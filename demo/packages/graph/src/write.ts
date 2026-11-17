/**
 * Writing a probe-record note (Question, Hypothesis, Experiment, Result) in TypeScript, with no Python in the path.
 * A Question's title is derived from its quote (tools/dm/readable.py, title); its stable name is then kept in the dg_name property. The other three kinds are titled prefix + name.
 * A Result also gets the relations the vault derives for it (tools/dm/dmlib.py, expected_relations): it informs the Question its experiment's hypotheses came from, and a failed or
 * null Result of an experiment that tested exactly one hypothesis opposes that hypothesis.
 * It does what tools/dm/value_add.py `discourse` does, byte for byte: the note file (one JSON value per property line, then the body
 * derived from those properties as tools/dm/readable.py derives it), the note's id, and the relations its link properties imply,
 * added to vault/relations.json. Ids derive from stable handles (type prefix + name), never from a title: a linked note may be retitled. Two tests hold it to that: every probe-record note already
 * in the vault is reproduced exactly from its properties, and after a write the vault's own Python check (the one a commit runs) passes.
 * Value notes (Claim, Evidence, Source) are not written here: they change generated configuration files and stay with the Python tool.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  handleOf,
  internalKind,
  type DiscourseNode,
  type Graph,
  type Json,
} from "./vault.js";

export const WRITABLE = [
  "Question",
  "Hypothesis",
  "Experiment",
  "Result",
] as const;
export type WritableKind = (typeof WRITABLE)[number];

const STAMP_MS = 1794700800000; // the vault's fixed relation stamp, so regeneration is reproducible
const BAD_NAME_CHARS = '[]|^<>:"/\\?*#';

/** (note kind, link property, relation label, kind at the other end, true when the note is the relation's source): the vault's EDGE_RULES for these kinds. */
export const EDGE_RULES: readonly (readonly [
  WritableKind,
  string,
  string,
  string,
  boolean,
])[] = [
  ["Hypothesis", "question", "motivates", "Question", false],
  ["Hypothesis", "informed_by", "informs", "Claim", false],
  ["Hypothesis", "issues", "motivates", "Issue", true],
  ["Experiment", "hypotheses", "motivates", "Hypothesis", false],
  ["Experiment", "issues", "produces", "Issue", true],
  ["Result", "experiment", "produces", "Experiment", false],
  ["Result", "supports", "supports", "Claim", true],
  ["Result", "opposes", "opposes", "Claim", true],
  ["Result", "consistent_with", "consistent with", "Hypothesis", true],
  ["Result", "against", "opposes", "Hypothesis", true],
  ["Result", "answers", "informs", "Question", true],
  ["Question", "informed_by", "informs", "Claim", false],
];
/** readings of a Result that stand against the hypothesis its experiment tested (the vault's AGAINST) */
const AGAINST: readonly string[] = ["fail", "no-signal"];
/** a property holding one wiki-link or a list of them, as a list (the vault's links_of) */
const linksOf = (v: Json | undefined): Json[] =>
  typeof v === "string" ? [v] : Array.isArray(v) ? v : [];
/** the key the vault's id rule uses for each relation label */
const RELATION_KEY: Record<string, string> = {
  "consistent with": "consistent_with",
};

/** Deterministic uuid-v7-shaped id from a kind and a name (the vault's node_id). */
export const nodeId = (kind: string, name: string): string => {
  const b = createHash("sha256")
    .update(`trusoma:${kind}:${name}`, "utf8")
    .digest()
    .subarray(0, 16);
  b[6] = (b[6]! & 0x0f) | 0x70;
  b[8] = (b[8]! & 0x3f) | 0x80;
  const h = b.toString("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
};

/** A property value as Python's json.dumps(ensure_ascii=False) writes it. Fractions are refused: the two languages print them differently. */
export const pyJson = (v: Json): string => {
  if (v === null) return "null";
  if (typeof v === "string" || typeof v === "boolean") return JSON.stringify(v);
  if (typeof v === "number") {
    if (!Number.isSafeInteger(v))
      throw new Error(
        "a probe-record note holds no fraction; a value belongs in a value note",
      );
    return String(v);
  }
  if (Array.isArray(v)) return `[${v.map(pyJson).join(", ")}]`;
  return `{${Object.entries(v)
    .map(([k, x]) => `${JSON.stringify(k)}: ${pyJson(x)}`)
    .join(", ")}}`;
};

const typeIdOf = (g: Graph, kind: string): string => {
  const t = g.nodeTypes.find((x) => x.name === kind);
  if (!t) throw new Error(`node type ${kind} is not in the grammar`);
  return t.id;
};
const prefixOf = (g: Graph, kind: string): string =>
  g.nodeTypes.find((x) => x.name === kind)!.format.replace("{content}", "");

type NoteArgs = {
  g: Graph;
  kind: string;
  name: string;
  props: Record<string, Json>;
};

/** What Python's str.split() splits on (its Unicode whitespace; not the same set as JavaScript's \s). */
const PY_SPACE =
  // eslint-disable-next-line no-control-regex -- the separators \x1c to \x1f are whitespace to Python
  /[\t\n\v\f\r\x1c-\x1f \x85\xa0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+/;
/** Python's truth of a property value: null, false, 0, "" and an empty list or object are false. */
const truthy = (v: Json | undefined): v is Json =>
  !(
    v === undefined ||
    v === null ||
    v === false ||
    v === 0 ||
    v === "" ||
    (typeof v === "object" && Object.keys(v).length === 0)
  );
/** Python's str() of a scalar property. A list or object has no place in a sentence of a probe-record note. */
const pyStr = (v: Json): string => {
  if (typeof v === "string") return v;
  if (typeof v === "boolean") return v ? "True" : "False";
  if (typeof v === "number" && Number.isSafeInteger(v)) return String(v);
  throw new Error("a probe-record note's body states text and links only");
};
/** Python's str.split(): the words of a text. */
const pyWords = (s: string): string[] => s.split(PY_SPACE).filter(Boolean);
const quoted = (q: Json): string => `"${pyWords(pyStr(q)).join(" ")}"`;
const linksText = (v: Json): string =>
  Array.isArray(v) ? v.map(pyStr).join(", ") : pyStr(v);
const BODY_LINKS: readonly (readonly [string, string])[] = [
  ["Question", "question"],
  ["Tests", "hypotheses"],
  ["Experiment", "experiment"],
  ["Supports", "supports"],
  ["Opposes", "opposes"],
  ["Consistent with", "consistent_with"],
  ["Rests on", "informed_by"],
  ["Open issues", "issues"],
];

/**
 * The body of a probe-record note: plain sentences derived from its properties, exactly as tools/dm/readable.py writes them
 * (lines_for, the Question, Hypothesis, Experiment and Result branch, then body). Never authored: the vault's check refuses a body that differs.
 */
export const noteBody = (kind: string, props: Record<string, Json>): string => {
  if (!(WRITABLE as readonly string[]).includes(kind))
    throw new Error(`the body of a ${kind} note is not derived here`);
  const lines: string[] = [];
  if (truthy(props.quote))
    lines.push(`From the record: ${quoted(props.quote)}`);
  if (truthy(props.reading)) {
    const counted = "counted" in props ? truthy(props.counted) : true;
    lines.push(
      `Reading: ${pyStr(props.reading)}${counted ? "" : " (not counted)"}${truthy(props.by_construction) ? ", holds by construction" : ""}.`,
    );
  }
  for (const [label, key] of BODY_LINKS) {
    const value = props[key];
    if (truthy(value)) lines.push(`${label}: ${linksText(value)}.`);
  }
  if (truthy(props.record))
    lines.push(
      `Record file: \`${pyStr(props.record)}\`${truthy(props.date) ? `, ${pyStr(props.date)}` : ""}.`,
    );
  return lines.length ? `\n${lines.join("\n\n")}\n` : "";
};

export const NOTES_MARK = "## Notes";
/** The reader's own part of a note file: from the heading line "Notes" (any level, any case: "## Notes", "### notes") to the end ("" when the note has none). Never generated, never checked (the vault's notes_of). */
export const notesOf = (text: string): string => {
  const end = text.indexOf("\n---", 3);
  let pos = (end > 0 ? end : 0) + 1;
  for (const line of text.slice(pos).split("\n")) {
    if (
      line.startsWith("#") &&
      pyWords(line.replace(/^#+/, "")).join(" ").toLowerCase() === "notes"
    )
      return text.slice(pos);
    pos += line.length + 1;
  }
  return "";
};

/** Titles, as tools/dm/readable.py derives them (clean, fit and the Question branch of title: the one writable kind whose title is not its prefix and name). */
const TITLE_MAX = 150;
const FULLWIDTH: Record<string, string> = {
  "\\": "＼",
  "/": "／",
  ":": "：",
  "*": "＊",
  "?": "？",
  '"': "＂",
  "<": "＜",
  ">": "＞",
  "|": "｜",
  "^": "＾",
  "#": "＃",
  "[": "(",
  "]": ")",
};
/** Text that can be a file name and the inside of a wiki-link: reserved characters in their full-width form, runs of whitespace as one space, no space or full stop at either end. */
const clean = (s: string): string =>
  pyWords([...s].map((ch) => FULLWIDTH[ch] ?? ch).join(""))
    .join(" ")
    .replace(/^[ .]+|[ .]+$/g, "");
/** prefix + text, the text cut at a word to fit TITLE_MAX characters (Python counts code points, so this does too). */
const fit = (prefix: string, text: string): string => {
  const room = TITLE_MAX - [...prefix].length;
  let t = [...clean(text)];
  if (t.length > room) {
    const cut = t.slice(0, Math.max(room - 2, 1)).join("");
    const at = cut.lastIndexOf(" ");
    t = [...((at < 0 ? cut : cut.slice(0, at)).replace(/[ ,;.]+$/, "") + " …")];
  }
  return (prefix + t.join("")).trim();
};
/** The title (file name without .md) of a probe-record note: a Question is titled with its quote, the other kinds with their prefix and name. */
export const noteTitle = ({ g, kind, name, props }: NoteArgs): string =>
  kind === "Question" && truthy(props.quote)
    ? fit(prefixOf(g, kind), pyStr(props.quote))
    : prefixOf(g, kind) + name;

/** The note file's text, as the vault's tool writes it: the properties (dg_name after dg_type when the title is not the prefix and name), the derived body, then the reader's own notes when the note has any. */
export const noteText = ({
  g,
  kind,
  name,
  props,
  notes = "",
}: NoteArgs & { notes?: string }): string => {
  // a dg_name handed in is not kept (the vault's write_note_kind drops it): the name is the one this note is written under
  const own = Object.fromEntries(
    Object.entries(props).filter(([k]) => k !== "dg_name"),
  );
  const retitled =
    noteTitle({ g, kind, name, props }) !== prefixOf(g, kind) + name;
  const head: Record<string, Json> = {
    nodeTypeId: typeIdOf(g, kind),
    nodeInstanceId: nodeId(kind, name),
    dg_type: kind,
    ...(retitled ? { dg_name: name } : {}),
    ...own,
  };
  const front = [
    "---",
    ...Object.entries(head).map(([k, v]) => `${k}: ${pyJson(v)}`),
    "---",
    "",
  ].join("\n");
  const body = noteBody(kind, head);
  return front + (notes ? `${body}\n${notes}` : body);
};

export type RelationRecord = {
  id: string;
  type: string;
  source: string;
  destination: string;
  created: number;
  lastModified: number;
};

/** The relations a note's link properties imply, and the reasons a link is not acceptable. */
export const impliedRelations = ({
  g,
  kind,
  name,
  props,
}: NoteArgs): { relations: RelationRecord[]; errors: string[] } => {
  const byId = new Map<string, RelationRecord>();
  const errors: string[] = [];
  type End = { handle: string; id: string };
  const me: End = {
    handle: handleOf(g, { nodeType: kind, name }),
    id: nodeId(kind, name),
  };
  const add = ({ label, a, b }: { label: string; a: End; b: End }): void => {
    const type = g.relationTypes.find((t) => t.label === label);
    if (!type) throw new Error(`relation type ${label} is not in the grammar`);
    const id = nodeId(
      "relation",
      `${RELATION_KEY[label] ?? label}|${a.handle}|${b.handle}`,
    );
    byId.set(id, {
      id,
      type: type.id,
      source: a.id,
      destination: b.id,
      created: STAMP_MS,
      lastModified: STAMP_MS,
    });
  };
  /** the note of this kind a wiki-link points at, through the note's current title (the vault's target_of, for a link that resolves) */
  const targetOf = (
    link: Json | undefined,
    other: string,
  ): DiscourseNode | undefined => {
    const hit =
      typeof link === "string" && link.startsWith("[[") && link.endsWith("]]")
        ? g.byTitle.get(link.slice(2, -2))
        : undefined;
    return hit && internalKind(hit.nodeType) === other ? hit : undefined;
  };
  const endOf = (n: DiscourseNode): End => ({
    handle: handleOf(g, n),
    id: n.uid,
  });
  if (kind === "Result" && Array.isArray(props.experiment))
    errors.push(`Result ${name}: exactly one experiment`);
  for (const [ruleKind, prop, label, other, outgoing] of EDGE_RULES) {
    const value = props[prop];
    if (
      kind !== ruleKind ||
      value === undefined ||
      value === null ||
      value === ""
    )
      continue;
    const links =
      typeof value === "string" ? [value] : Array.isArray(value) ? value : [];
    for (const link of links) {
      // a wiki-link holds the note's current title; the kind is checked on the note it resolves to (a Parameter stands where a Claim is expected)
      const target = targetOf(link, other);
      if (!target) {
        errors.push(
          `${kind} ${name}: ${prop} link ${JSON.stringify(link)} does not resolve to a ${other}`,
        );
        continue;
      }
      if (outgoing) add({ label, a: me, b: endOf(target) });
      else add({ label, a: endOf(target), b: me });
    }
  }
  if (kind === "Result" && truthy(props.experiment)) {
    // derived, not linked (the vault's expected_relations): what was found bears on the question the tested hypotheses came from,
    // and a failed or null result of an experiment that tested exactly one hypothesis stands against it
    const tested = targetOf(props.experiment, "Experiment")?.props.hypotheses;
    const hypotheses = linksOf(tested).flatMap((l) => {
      const h = targetOf(l, "Hypothesis");
      return h ? [h] : [];
    });
    // a result that names the hypotheses it bears on informs their questions only; a named question (answers) replaces the derivation
    const named = [
      ...linksOf(props.against),
      ...linksOf(props.consistent_with),
    ].flatMap((l) => {
      const h = targetOf(l, "Hypothesis");
      return h ? [h.uid] : [];
    });
    const mine = hypotheses.filter((h) => named.includes(h.uid));
    if (!truthy(props.answers))
      for (const h of mine.length ? mine : hypotheses) {
        const q = targetOf(h.props.question, "Question");
        if (q) add({ label: "informs", a: me, b: endOf(q) });
      }
    if (
      typeof props.reading === "string" &&
      AGAINST.includes(props.reading) &&
      hypotheses.length === 1 &&
      !truthy(props.consistent_with) &&
      !truthy(props.against)
    )
      add({ label: "opposes", a: me, b: endOf(hypotheses[0]!) });
  }
  return { relations: [...byId.values()], errors };
};

const sortKeys = (v: unknown): unknown =>
  Array.isArray(v)
    ? v.map(sortKeys)
    : v && typeof v === "object"
      ? Object.fromEntries(
          Object.keys(v)
            .sort()
            .map((k) => [k, sortKeys((v as Record<string, unknown>)[k])]),
        )
      : v;

export const checkName = (name: string): string[] =>
  [...BAD_NAME_CHARS].some((ch) => name.includes(ch)) ||
  name.length >= 150 ||
  !name.trim()
    ? [`unsafe note name: ${name}`]
    : [];

/** Write the note and its relations. Returns how to undo it. The caller has already checked the note (validate.ts) and its links. */
export const writeNote = ({
  g,
  kind,
  name,
  props,
  relations,
}: NoteArgs & { kind: WritableKind; relations: RelationRecord[] }): {
  file: string;
  undo: () => void;
} => {
  const file = join(
    g.root,
    "vault",
    "DiscourseGraph",
    `${noteTitle({ g, kind, name, props })}.md`,
  );
  const relationsFile = join(g.root, "vault", "relations.json");
  if (existsSync(file))
    throw new Error("a note with this title already exists");
  const before = readFileSync(relationsFile, "utf8");
  const body = JSON.parse(before) as {
    relations: Record<string, RelationRecord>;
  };
  for (const r of relations) body.relations[r.id] = r;
  writeFileSync(file, noteText({ g, kind, name, props }), "utf8");
  writeFileSync(
    relationsFile,
    JSON.stringify(sortKeys(body), null, 1) + "\n",
    "utf8",
  );
  return {
    file,
    undo: () => {
      if (existsSync(file)) unlinkSync(file);
      writeFileSync(relationsFile, before, "utf8");
    },
  };
};
