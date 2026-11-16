/** The TypeScript writer reproduces what the vault's Python tool wrote, byte for byte, for every probe-record note in the vault. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "vitest";
import { loadVault } from "../src/vault.js";
import {
  impliedRelations,
  nodeId,
  noteText,
  pyJson,
  WRITABLE,
} from "../src/write.js";

const root = resolve(
  process.env.TRUSOMA_ROOT ??
    resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", ".."),
);
const g = loadVault(root);
const record = [...g.nodes.values()].filter(
  (n) =>
    (WRITABLE as readonly string[]).includes(n.nodeType) &&
    !("record_file" in n.props),
);
const stored = (
  JSON.parse(readFileSync(join(root, "vault", "relations.json"), "utf8")) as {
    relations: Record<string, unknown>;
  }
).relations;

test("every probe-record note in the vault is reproduced exactly from its properties", () => {
  assert.ok(record.length >= 40, `only ${record.length} notes`);
  for (const n of record) {
    assert.equal(nodeId(n.nodeType, n.name), n.uid, n.title);
    assert.equal(
      noteText({ g, kind: n.nodeType, name: n.name, props: n.props }),
      readFileSync(
        join(root, "vault", "DiscourseGraph", n.title + ".md"),
        "utf8",
      ),
      n.title,
    );
  }
});

test("the relations derived from their links are the ones stored, id and content", () => {
  let count = 0;
  for (const n of record) {
    const { relations, errors } = impliedRelations({
      g,
      kind: n.nodeType,
      name: n.name,
      props: n.props,
    });
    assert.deepEqual(errors, [], n.title);
    for (const r of relations) {
      assert.deepEqual(stored[r.id], r, `${n.title}: ${r.id}`);
      count += 1;
    }
  }
  assert.ok(count >= 40, `only ${count} relations`);
});

test("values are written as Python writes them, and a fraction is refused", () => {
  assert.equal(
    pyJson(["[[HYP- a]]", 'b "q" é', true, 3, null]),
    '["[[HYP- a]]", "b \\"q\\" é", true, 3, null]',
  );
  assert.throws(() => pyJson(0.5), /fraction/);
});

test("a link to a note of the wrong kind, or to no note, is refused", () => {
  const exp = [...g.nodes.values()].find((n) => n.nodeType === "Experiment")!;
  const hyp = [...g.nodes.values()].find(
    (n) => n.nodeType === "Hypothesis" && !("record_file" in n.props),
  )!;
  assert.match(
    impliedRelations({
      g,
      kind: "Result",
      name: "x",
      props: { experiment: `[[${hyp.title}]]` },
    }).errors.join(";"),
    /does not resolve to a Experiment/,
  );
  assert.match(
    impliedRelations({
      g,
      kind: "Result",
      name: "x",
      props: { experiment: "[[EXP - no such run]]" },
    }).errors.join(";"),
    /does not resolve/,
  );
  assert.match(
    impliedRelations({
      g,
      kind: "Result",
      name: "x",
      props: { experiment: [`[[${exp.title}]]`] },
    }).errors.join(";"),
    /exactly one experiment/,
  );
  assert.equal(
    impliedRelations({
      g,
      kind: "Result",
      name: "x",
      props: { experiment: `[[${exp.title}]]` },
    }).relations.length,
    1,
  );
});
