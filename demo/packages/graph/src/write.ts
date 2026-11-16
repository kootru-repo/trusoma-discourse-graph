/**
 * Writing a probe-record note (Question, Hypothesis, Experiment, Result) in TypeScript, with no Python in the path.
 * It does what tools/dm/value_add.py `discourse` does, byte for byte: the note file (one JSON value per property line), the note's id,
 * and the relations its link properties imply, added to vault/relations.json. Two tests hold it to that: every probe-record note already
 * in the vault is reproduced exactly from its properties, and after a write the vault's own Python check (the one a commit runs) passes.
 * Value notes (Claim, Evidence, Source) are not written here: they change generated configuration files and stay with the Python tool.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Graph, Json } from "./vault.js";

export const WRITABLE = [
  "Question",
  "Hypothesis",
  "Experiment",
  "Result",
] as const;
export type WritableKind = (typeof WRITABLE)[number];

const STAMP_MS = 1763164800000; // the vault's fixed relation stamp, so regeneration is reproducible
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
  ["Question", "informed_by", "informs", "Claim", false],
];
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

/** The note file's text, as the vault's tool writes it. */
type NoteArgs = {
  g: Graph;
  kind: string;
  name: string;
  props: Record<string, Json>;
};

export const noteText = ({ g, kind, name, props }: NoteArgs): string => {
  const head: Record<string, Json> = {
    nodeTypeId: typeIdOf(g, kind),
    nodeInstanceId: nodeId(kind, name),
    dg_type: kind,
    ...props,
  };
  return [
    "---",
    ...Object.entries(head).map(([k, v]) => `${k}: ${pyJson(v)}`),
    "---",
    "",
  ].join("\n");
};

export type RelationRecord = {
  id: string;
  type: string;
  source: string;
  destination: string;
  created: number;
};

/** The relations a note's link properties imply, and the reasons a link is not acceptable. */
export const impliedRelations = ({
  g,
  kind,
  name,
  props,
}: NoteArgs): { relations: RelationRecord[]; errors: string[] } => {
  const relations: RelationRecord[] = [];
  const errors: string[] = [];
  const myTitle = prefixOf(g, kind) + name;
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
    const type = g.relationTypes.find((t) => t.label === label);
    if (!type) throw new Error(`relation type ${label} is not in the grammar`);
    for (const link of links) {
      const otherPrefix = prefixOf(g, other);
      const target =
        typeof link === "string" &&
        link.startsWith("[[" + otherPrefix) &&
        link.endsWith("]]")
          ? g.byTitle.get(link.slice(2, -2))
          : undefined;
      if (!target || target.nodeType !== other) {
        errors.push(
          `${kind} ${name}: ${prop} link ${JSON.stringify(link)} does not resolve to a ${other}`,
        );
        continue;
      }
      const me = { title: myTitle, id: nodeId(kind, name) };
      const it = { title: target.title, id: target.uid };
      const [a, b] = outgoing ? [me, it] : [it, me];
      const id = nodeId(
        "relation",
        `${RELATION_KEY[label] ?? label}|${a.title}|${b.title}`,
      );
      relations.push({
        id,
        type: type.id,
        source: a.id,
        destination: b.id,
        created: STAMP_MS,
      });
    }
  }
  return { relations, errors };
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
    `${prefixOf(g, kind)}${name}.md`,
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
