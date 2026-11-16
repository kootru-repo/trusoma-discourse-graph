/** The query engine on a small hand-made graph, then the preset questions on the real vault, each against a count worked out another way. */
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "vitest";
import {
  describeQuery,
  PRESETS,
  runQuery,
  type Query,
  type QueryNode,
  type QueryRelation,
} from "../src/query.js";
import { loadVault } from "../src/vault.js";

const small = {
  nodes: [
    { uid: "h1", type: "Hypothesis", props: {} },
    { uid: "h2", type: "Hypothesis", props: {} },
    { uid: "e1", type: "Experiment", props: {} },
    { uid: "i1", type: "Issue", props: {} },
    { uid: "r1", type: "Result", props: { reading: "fail" } },
    { uid: "r2", type: "Result", props: { reading: "pass" } },
  ] satisfies QueryNode[],
  relations: [
    { label: "motivates", source: "h1", destination: "e1" },
    { label: "motivates", source: "h2", destination: "i1" },
    { label: "produces", source: "e1", destination: "r1" },
    { label: "motivates", source: "h2", destination: "missing" },
  ] satisfies QueryRelation[],
};
const uids = (query: Query): string[] =>
  runQuery({ ...small, query }).map((n) => n.uid);

test("a condition looks at the label, the direction and the type of the other end", () => {
  const motivates = {
    relation: "motivates",
    direction: "to",
    type: "Experiment",
  } as const;
  assert.deepEqual(
    uids({ type: "Hypothesis", where: [{ has: true, ...motivates }] }),
    ["h1"],
  );
  assert.deepEqual(
    uids({ type: "Hypothesis", where: [{ has: false, ...motivates }] }),
    ["h2"],
  );
  // the same label to any type: both hypotheses have one
  assert.deepEqual(
    uids({
      type: "Hypothesis",
      where: [{ has: true, ...motivates, type: "" }],
    }),
    ["h1", "h2"],
  );
  // direction matters: the experiment receives the relation, it does not send it
  assert.deepEqual(
    uids({
      type: "Experiment",
      where: [{ has: true, ...motivates, direction: "from", type: "" }],
    }),
    ["e1"],
  );
  assert.deepEqual(
    uids({
      type: "Experiment",
      where: [{ has: true, ...motivates, type: "" }],
    }),
    [],
  );
});

test("conditions are joined by and; a property filter narrows by presence or value", () => {
  assert.deepEqual(
    uids({
      type: "Hypothesis",
      where: [
        { has: true, relation: "motivates", direction: "to", type: "Issue" },
        {
          has: false,
          relation: "motivates",
          direction: "to",
          type: "Experiment",
        },
      ],
    }),
    ["h2"],
  );
  assert.deepEqual(
    uids({
      type: "Result",
      where: [],
      props: [{ key: "reading", oneOf: ["fail", "no-signal"] }],
    }),
    ["r1"],
  );
  assert.deepEqual(uids({ type: "", where: [], props: [{ key: "reading" }] }), [
    "r1",
    "r2",
  ]);
});

test("a query reads as one sentence", () => {
  assert.equal(
    describeQuery(PRESETS.find((p) => p.id === "untested-hypotheses")!.query),
    'Hypothesis notes with no "motivates" relation to an Experiment',
  );
  assert.equal(
    describeQuery(PRESETS.find((p) => p.id === "positive-results")!.query),
    "Result notes whose reading is pass or signal",
  );
});

const root = resolve(
  process.env.TRUSOMA_ROOT ??
    resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", ".."),
);
const g = loadVault(root);
const nodes = [...g.nodes.values()].map((n) => ({
  uid: n.uid,
  type: n.nodeType,
  props: n.props,
}));
const relations = [...g.outgoing.values()].flat();
const answer = (id: string): string[] =>
  runQuery({
    nodes,
    relations,
    query: PRESETS.find((p) => p.id === id)!.query,
  }).map((n) => n.uid);

test("on the vault, the preset questions agree with counts worked out another way", () => {
  // value claims an evidence note supports, counted from the relation list
  const supported = new Set(
    relations
      .filter(
        (r) =>
          r.label === "supports" &&
          g.nodes.get(r.source)?.nodeType === "Evidence",
      )
      .map((r) => r.destination),
  );
  const sourced = nodes.filter(
    (n) => n.type === "Claim" && "key" in n.props && supported.has(n.uid),
  );
  assert.deepEqual(
    answer("sourced-values"),
    sourced.map((n) => n.uid),
  );
  assert.ok(sourced.length > 0);

  // hypotheses that motivate no experiment, counted from the relation list
  const tested = new Set(
    relations
      .filter(
        (r) =>
          r.label === "motivates" &&
          g.nodes.get(r.destination)?.nodeType === "Experiment",
      )
      .map((r) => r.source),
  );
  assert.deepEqual(
    answer("untested-hypotheses"),
    nodes
      .filter((n) => n.type === "Hypothesis" && !tested.has(n.uid))
      .map((n) => n.uid),
  );

  // every preset answers with something, and only with notes of its type
  for (const preset of PRESETS) {
    const found = runQuery({ nodes, relations, query: preset.query });
    assert.ok(found.length > 0, preset.id);
    assert.ok(found.every((n) => n.type === preset.query.type));
  }
});
