/**
 * The vault's rules for the discourse layer, in TypeScript: the same checks as tools/dm/validate_vault.py makes on Question, Hypothesis,
 * Experiment and Result notes and on every relation. The Python check stays the one the commit runs (it also compares the generated files);
 * this one lets a TypeScript caller refuse a bad note before anything is written, and is tested to agree with the Python check on the real vault.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { internalKind, type Graph, type Json } from "./vault.js";

export const READINGS = [
  "signal",
  "no-signal",
  "pass",
  "fail",
  "observation",
] as const;

const base = z
  .object({ record: z.string().min(1), quote: z.string().min(1) })
  .passthrough();
const noValue = (p: Record<string, unknown>): boolean =>
  !("value" in p) && !("value_file" in p) && !("text" in p);
const rule = <T extends z.ZodType<Record<string, unknown>>>(
  s: T,
): z.ZodEffects<T> =>
  s.refine(
    noValue,
    "a probe-record note carries no value and no text property (the quote is the text)",
  );

export const NOTE_RULES = {
  Question: rule(base),
  Hypothesis: rule(base.extend({ prereg: z.boolean() })),
  Experiment: rule(
    base.extend({
      date: z
        .string()
        .regex(/^20\d{2}-[01]\d-[0-3]\d$/, "date must be YYYY-MM-DD"),
    }),
  ),
  Result: rule(
    base.extend({
      reading: z.enum(READINGS),
      counted: z.boolean(),
      experiment: z.string().min(1),
    }),
  ),
  Conclusion: rule(base),
} as const;
export type RuledKind = keyof typeof NOTE_RULES;
export const isRuled = (kind: string): kind is RuledKind => kind in NOTE_RULES;

const files = new Map<string, string | null>();
const recordText = (root: string, record: string): string | null => {
  const key = join(root, record);
  if (!files.has(key))
    files.set(key, existsSync(key) ? readFileSync(key, "utf8") : null);
  return files.get(key)!;
};

/** Reasons a note of this kind with these properties would be refused; empty when it is acceptable. */
export const checkNote = ({
  root,
  kind,
  name,
  props,
}: {
  root: string;
  kind: string;
  name: string;
  props: Record<string, Json>;
}): string[] => {
  if (!isRuled(kind) || "record_file" in props) return []; // a growth-web note is a table row: the Python check rules it
  const parsed = NOTE_RULES[kind].safeParse(props);
  const errors = parsed.success
    ? []
    : parsed.error.issues.map(
        (i) => `${kind} ${name}: ${i.path.join(".") || "note"}: ${i.message}`,
      );
  const record = typeof props.record === "string" ? props.record : "";
  const text = record ? recordText(root, record) : null;
  if (text === null)
    errors.push(
      `${kind} ${name}: record file ${JSON.stringify(record)} does not exist`,
    );
  else if (
    typeof props.quote !== "string" ||
    !props.quote ||
    !text.includes(props.quote)
  )
    errors.push(
      `${kind} ${name}: its quote is not found verbatim in ${record}`,
    );
  return errors;
};

/** Every probe-record note against its rule, and every relation against the grammar's allowed triples (a Parameter note stands where a Claim is allowed). */
export const checkGraph = (g: Graph): string[] => {
  const errors: string[] = [];
  for (const n of g.nodes.values())
    errors.push(
      ...checkNote({
        root: g.root,
        kind: n.nodeType,
        name: n.name,
        props: n.props,
      }),
    );
  const allowed = new Set(
    g.triples.map((t) => `${t.source}|${t.relation}|${t.destination}`),
  );
  for (const r of g.relations) {
    const s = g.nodes.get(r.source);
    const d = g.nodes.get(r.destination);
    if (!s || !d) errors.push(`relation ${r.id}: an end is not a note`);
    else if (
      !allowed.has(
        `${internalKind(s.nodeType)}|${r.label}|${internalKind(d.nodeType)}`,
      )
    )
      errors.push(
        `relation ${r.id}: ${s.nodeType} -${r.label}-> ${d.nodeType} is not an allowed triple`,
      );
  }
  return errors;
};
