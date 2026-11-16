/**
 * The tools of the MCP server, as plain functions over the graph (so they are tested without a transport).
 * Read tools keep the names and argument names of the Discourse Graphs proof-of-concept MCP server (search_nodes, get_node, get_linked_nodes,
 * get_schema, get_relationships, get_relation_types, get_node_neighborhood). trace_value, list_gaps, check and add_note are ours.
 * The write tool is TypeScript only (validate.ts, write.ts): it writes one vault note and the relations its links imply, refuses what the vault's rules refuse,
 * and leaves no trace when it refuses. The vault's Python check (the `check` tool, and every commit) stays the independent check of what was written.
 */
import { checkGraph, checkNote } from "./validate.js";
import { checkName, impliedRelations, noteText, writeNote } from "./write.js";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import {
  loadVault,
  type DiscourseNode,
  type Graph,
  type Json,
  type Relation,
} from "./vault.js";

const ABBREVIATION: Record<string, string> = {
  CLM: "Claim",
  EVD: "Evidence",
  SRC: "Source",
  ISS: "Issue",
  QUE: "Question",
  HYP: "Hypothesis",
  EXP: "Experiment",
  RES: "Result",
  CON: "Conclusion",
};
type Brief = { uid: string; nodeType: string; title: string };
type Edge = { relation: string; source: Brief; destination: Brief };
type Linked = { relation: string; node: Brief };
type Reading = Brief & { reading: Json; quote: Json };
type Trace = {
  claim: Brief & { value: Json; status: Json };
  evidence: (Brief & {
    quote: Json;
    locator: Json;
    transfer: Json;
    sources: Brief[];
  })[];
  hypotheses: (Brief & {
    criterion: Json;
    preregistered: Json;
    experiments: (Brief & {
      date: Json;
      results: (Reading & { counted: Json })[];
    })[];
  })[];
  resultsOnTheClaim: Reading[];
  supported: boolean;
};
type AddNoteResult = {
  accepted: boolean;
  title: string;
  message: string[];
  graph: Graph;
};

const brief = (n: DiscourseNode): Brief => ({
  uid: n.uid,
  nodeType: n.nodeType,
  title: n.title,
});
const mustGet = (g: Graph, uid: string): DiscourseNode => {
  const node = g.nodes.get(uid) ?? g.byTitle.get(uid);
  if (!node) throw new Error(`no node with uid or title ${uid}`);
  return node;
};
const edge = (g: Graph, r: Relation): Edge => ({
  relation: r.label,
  source: brief(mustGet(g, r.source)),
  destination: brief(mustGet(g, r.destination)),
});

export const SearchNodesSchema = z.object({
  query: z
    .string()
    .describe(
      "Keywords; every word must occur in the note's title or properties",
    ),
  nodeType: z
    .string()
    .optional()
    .describe(
      "Claim, Evidence, Source, Issue, Question, Hypothesis, Experiment, Result (or CLM, EVD, ...)",
    ),
  limit: z.number().optional().default(10),
});
export const searchNodes = (
  g: Graph,
  a: z.infer<typeof SearchNodesSchema>,
): { total: number; results: Brief[] } => {
  const words = a.query.toLowerCase().split(/\s+/).filter(Boolean);
  const want = a.nodeType
    ? (ABBREVIATION[a.nodeType.toUpperCase()] ?? a.nodeType)
    : undefined;
  const hits: { node: DiscourseNode; inTitle: number }[] = [];
  for (const node of g.nodes.values()) {
    if (want && node.nodeType.toLowerCase() !== want.toLowerCase()) continue;
    const title = node.title.toLowerCase();
    const text = title + " " + JSON.stringify(node.props).toLowerCase();
    if (words.every((w) => text.includes(w)))
      hits.push({
        node,
        inTitle: words.filter((w) => title.includes(w)).length,
      });
  }
  hits.sort(
    (x, y) => y.inTitle - x.inTitle || x.node.title.localeCompare(y.node.title),
  );
  return {
    total: hits.length,
    results: hits.slice(0, a.limit).map((h) => brief(h.node)),
  };
};

export const GetNodeSchema = z.object({
  uid: z.string().describe("The node's uid (nodeInstanceId) or its full title"),
});
export const getNode = (
  g: Graph,
  a: z.infer<typeof GetNodeSchema>,
): Brief & {
  name: string;
  properties: DiscourseNode["props"];
  outgoing: number;
  incoming: number;
} => {
  const n = mustGet(g, a.uid);
  return {
    ...brief(n),
    name: n.name,
    properties: n.props,
    outgoing: (g.outgoing.get(n.uid) ?? []).length,
    incoming: (g.incoming.get(n.uid) ?? []).length,
  };
};

export const GetLinkedNodesSchema = z.object({
  uid: z.string(),
  direction: z
    .enum(["outgoing", "incoming", "both"])
    .optional()
    .default("both"),
});
export const getLinkedNodes = (
  g: Graph,
  a: z.infer<typeof GetLinkedNodesSchema>,
): { node: Brief; outgoing: Linked[]; incoming: Linked[] } => {
  const n = mustGet(g, a.uid);
  return {
    node: brief(n),
    outgoing:
      a.direction === "incoming"
        ? []
        : (g.outgoing.get(n.uid) ?? []).map((r) => ({
            relation: r.label,
            node: brief(mustGet(g, r.destination)),
          })),
    incoming:
      a.direction === "outgoing"
        ? []
        : (g.incoming.get(n.uid) ?? []).map((r) => ({
            relation: r.label,
            node: brief(mustGet(g, r.source)),
          })),
  };
};

export const GetSchemaSchema = z.object({});
export const getSchema = (
  g: Graph,
): {
  nodeTypes: { name: string; format: string; notes: number }[];
  allowedTriples: Graph["triples"];
} => {
  const count = new Map<string, number>();
  for (const n of g.nodes.values())
    count.set(n.nodeType, (count.get(n.nodeType) ?? 0) + 1);
  return {
    nodeTypes: g.nodeTypes.map((t) => ({
      name: t.name,
      format: t.format,
      notes: count.get(t.name) ?? 0,
    })),
    allowedTriples: g.triples,
  };
};

export const GetRelationshipsSchema = z.object({
  sourceUid: z.string().optional(),
  destinationUid: z.string().optional(),
  relationshipType: z.string().optional(),
  limit: z.number().optional().default(50),
});
export const getRelationships = (
  g: Graph,
  a: z.infer<typeof GetRelationshipsSchema>,
): { total: number; relationships: Edge[] } => {
  const source = a.sourceUid ? mustGet(g, a.sourceUid).uid : undefined;
  const destination = a.destinationUid
    ? mustGet(g, a.destinationUid).uid
    : undefined;
  const pool = source
    ? (g.outgoing.get(source) ?? [])
    : destination
      ? (g.incoming.get(destination) ?? [])
      : g.relations;
  const hits = pool.filter(
    (r) =>
      (!destination || r.destination === destination) &&
      (!a.relationshipType ||
        r.label.toLowerCase() === a.relationshipType.toLowerCase()),
  );
  return {
    total: hits.length,
    relationships: hits.slice(0, a.limit).map((r) => edge(g, r)),
  };
};

export const GetRelationTypesSchema = z.object({});
export const getRelationTypes = (
  g: Graph,
): {
  relationTypes: { label: string; complement: string; relations: number }[];
} => {
  const count = new Map<string, number>();
  for (const r of g.relations)
    count.set(r.label, (count.get(r.label) ?? 0) + 1);
  return {
    relationTypes: g.relationTypes.map((t) => ({
      label: t.label,
      complement: t.complement,
      relations: count.get(t.label) ?? 0,
    })),
  };
};

export const GetNodeNeighborhoodSchema = z.object({
  uid: z.string(),
  depth: z.number().min(1).max(4).optional().default(1),
  limit: z.number().optional().default(200),
});
export const getNodeNeighborhood = (
  g: Graph,
  a: z.infer<typeof GetNodeNeighborhoodSchema>,
): {
  start: Brief;
  nodes: (Brief & { hops: number })[];
  relationships: Edge[];
  truncated: boolean;
} => {
  const start = mustGet(g, a.uid);
  const seen = new Map<string, number>([[start.uid, 0]]);
  const edges = new Map<string, Relation>();
  let frontier = [start.uid];
  for (let hop = 1; hop <= a.depth && seen.size < a.limit; hop++) {
    const next: string[] = [];
    for (const uid of frontier) {
      for (const r of [
        ...(g.outgoing.get(uid) ?? []),
        ...(g.incoming.get(uid) ?? []),
      ]) {
        const other = r.source === uid ? r.destination : r.source;
        if (!seen.has(other)) {
          if (seen.size >= a.limit) continue;
          seen.set(other, hop);
          next.push(other);
        }
        edges.set(r.id, r);
      }
    }
    frontier = next;
  }
  return {
    start: brief(start),
    nodes: [...seen].map(([uid, hops]) => ({
      ...brief(mustGet(g, uid)),
      hops,
    })),
    relationships: [...edges.values()]
      .filter((r) => seen.has(r.source) && seen.has(r.destination))
      .map((r) => edge(g, r)),
    truncated: seen.size >= a.limit,
  };
};

/** The whole path of one value: the sources and quotes behind it, and the hypotheses, runs and readings that used it. */
export const TraceValueSchema = z.object({
  key: z
    .string()
    .describe(
      "A value's key or name, e.g. phase1_substrate.NMDA_SHARE_E16 or NMDA_SHARE_E16",
    ),
});
export const traceValue = (
  g: Graph,
  a: z.infer<typeof TraceValueSchema>,
): Trace => {
  const claim = [...g.nodes.values()].find(
    (n) =>
      n.nodeType === "Claim" &&
      (n.props.key === a.key || n.props.name === a.key || n.name === a.key),
  );
  if (!claim) throw new Error(`no Claim with key or name ${a.key}`);
  const into = (uid: string, label: string): DiscourseNode[] =>
    (g.incoming.get(uid) ?? [])
      .filter((r) => r.label === label)
      .map((r) => mustGet(g, r.source));
  const out = (uid: string, label: string): DiscourseNode[] =>
    (g.outgoing.get(uid) ?? [])
      .filter((r) => r.label === label)
      .map((r) => mustGet(g, r.destination));
  const evidence = into(claim.uid, "supports")
    .filter((n) => n.nodeType === "Evidence")
    .map((e) => ({
      ...brief(e),
      quote: e.props.quote ?? null,
      locator: e.props.locator ?? null,
      transfer: e.props.transfer ?? null,
      sources: into(e.uid, "produces").map(brief),
    }));
  const hypotheses = out(claim.uid, "informs")
    .filter((n) => n.nodeType === "Hypothesis")
    .map((h) => ({
      ...brief(h),
      criterion: h.props.quote ?? null,
      preregistered: h.props.prereg ?? null,
      experiments: out(h.uid, "motivates")
        .filter((n) => n.nodeType === "Experiment")
        .map((x) => ({
          ...brief(x),
          date: x.props.date ?? null,
          results: out(x.uid, "produces")
            .filter((n) => n.nodeType === "Result")
            .map((r) => ({
              ...brief(r),
              reading: r.props.reading ?? null,
              counted: r.props.counted ?? null,
              quote: r.props.quote ?? null,
            })),
        })),
    }));
  const direct = [...into(claim.uid, "supports"), ...into(claim.uid, "opposes")]
    .filter((n) => n.nodeType === "Result")
    .map((r) => ({
      ...brief(r),
      reading: r.props.reading ?? null,
      quote: r.props.quote ?? null,
    }));
  return {
    claim: {
      ...brief(claim),
      value: claim.props.value ?? null,
      status: claim.props.status ?? null,
    },
    evidence,
    hypotheses,
    resultsOnTheClaim: direct,
    supported: evidence.length > 0,
  };
};

/** What the graph does not have yet: value claims with no evidence, hypotheses that no run has tested, hypotheses blocked by an issue. */
export const ListGapsSchema = z.object({
  kind: z.enum([
    "claims_without_evidence",
    "untested_hypotheses",
    "blocked_hypotheses",
  ]),
  contains: z.string().optional(),
  limit: z.number().optional().default(20),
});
export const listGaps = (
  g: Graph,
  a: z.infer<typeof ListGapsSchema>,
): { kind: string; total: number; results: (Brief & { status: Json })[] } => {
  const all = [...g.nodes.values()];
  let hits: DiscourseNode[];
  if (a.kind === "claims_without_evidence")
    hits = all.filter(
      (n) =>
        n.nodeType === "Claim" &&
        !("record_file" in n.props) &&
        !(g.incoming.get(n.uid) ?? []).length &&
        !(g.outgoing.get(n.uid) ?? []).length,
    );
  else if (a.kind === "untested_hypotheses")
    hits = all.filter(
      (n) =>
        n.nodeType === "Hypothesis" &&
        !("record_file" in n.props) &&
        !(g.outgoing.get(n.uid) ?? []).some(
          (r) =>
            r.label === "motivates" &&
            mustGet(g, r.destination).nodeType === "Experiment",
        ),
    );
  else
    hits = all.filter(
      (n) =>
        n.nodeType === "Hypothesis" &&
        (g.outgoing.get(n.uid) ?? []).some(
          (r) =>
            r.label === "motivates" &&
            mustGet(g, r.destination).nodeType === "Issue",
        ),
    );
  if (a.contains)
    hits = hits.filter((n) =>
      n.title.toLowerCase().includes(a.contains!.toLowerCase()),
    );
  return {
    kind: a.kind,
    total: hits.length,
    results: hits
      .slice(0, a.limit)
      .map((n) => ({ ...brief(n), status: n.props.status ?? null })),
  };
};

const python = (
  root: string,
  args: string[],
): { ok: boolean; output: string } => {
  const r = spawnSync(process.env.TRUSOMA_PYTHON ?? "python", ["-B", ...args], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, PYTHONUTF8: "1" },
  });
  return {
    ok: r.status === 0,
    output: ((r.stdout ?? "") + (r.stderr ?? "")).trim(),
  };
};

/** Run the vault's commit check: validate every note and compare every generated file with the vault. */
export const CheckSchema = z.object({});
export const check = (g: Graph): { ok: boolean; lastLines: string[] } => {
  const r = python(g.root, ["tools/dm/check_all.py"]);
  return { ok: r.ok, lastLines: r.output.split("\n").slice(-6) };
};

const PREFIX: Record<string, string> = {
  Question: "QUE - ",
  Hypothesis: "HYP- ",
  Experiment: "EXP - ",
  Result: "RES - ",
};
/**
 * Write one probe-record note (Question, Hypothesis, Experiment or Result) into the vault through tools/dm/value_add.py, then run the check.
 * The validator refuses a quote that is not verbatim in the named record file, a value on such a note, and a link that does not resolve.
 * When it refuses, the note is removed and the generated files are restored, so a refused write leaves no trace.
 */
export const AddNoteSchema = z.object({
  kind: z.enum(["Question", "Hypothesis", "Experiment", "Result"]),
  name: z
    .string()
    .describe("The note's name (the title without its type prefix)"),
  record: z
    .string()
    .describe("Repository path of the record file the quote is taken from"),
  quote: z.string().describe("Text copied verbatim from that file"),
  properties: z
    .record(z.any())
    .optional()
    .describe(
      "Other properties: prereg, date, reading, counted, question, hypotheses, experiment, supports, opposes, consistent_with, informed_by, issues",
    ),
});
export const addNote = (
  g: Graph,
  a: z.infer<typeof AddNoteSchema>,
): AddNoteResult => {
  const title = PREFIX[a.kind] + a.name;
  const refuse = (message: string[]): AddNoteResult => ({
    accepted: false,
    title,
    message,
    graph: g,
  });
  if (
    g.byTitle.has(title) ||
    existsSync(join(g.root, "vault", "DiscourseGraph", title + ".md"))
  )
    return refuse(["a note with this title already exists"]);
  const props: Record<string, Json> = {
    record: a.record,
    quote: a.quote,
    ...((a.properties ?? {}) as Record<string, Json>),
  };
  let implied: ReturnType<typeof impliedRelations>;
  try {
    noteText({ g, kind: a.kind, name: a.name, props });
    implied = impliedRelations({ g, kind: a.kind, name: a.name, props });
  } catch (error) {
    return refuse([error instanceof Error ? error.message : String(error)]);
  }
  const reasons = [
    ...checkName(a.name),
    ...checkNote({ root: g.root, kind: a.kind, name: a.name, props }),
    ...implied.errors,
  ];
  if (reasons.length) return refuse(reasons);
  const written = writeNote({
    g,
    kind: a.kind,
    name: a.name,
    props,
    relations: implied.relations,
  });
  try {
    const graph = loadVault(g.root);
    const after = checkGraph(graph);
    if (after.length) throw new Error(after.slice(0, 6).join("; "));
    return {
      accepted: true,
      title,
      message: [
        `${a.kind} note written: ${title}`,
        `${implied.relations.length} relation(s) added`,
      ],
      graph,
    };
  } catch (error) {
    written.undo();
    return refuse([error instanceof Error ? error.message : String(error)]);
  }
};
