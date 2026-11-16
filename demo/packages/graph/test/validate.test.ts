/** The TypeScript rules agree with the vault as it stands, and refuse what the Python check refuses. */
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { test } from "vitest";
import { fileURLToPath } from "node:url";
import { checkGraph, checkNote } from "../src/validate.js";
import { loadVault } from "../src/vault.js";

const root = resolve(
  process.env.TRUSOMA_ROOT ??
    resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", ".."),
);
const g = loadVault(root);
const result = [...g.nodes.values()].find((n) => n.nodeType === "Result")!;

test("the real vault has no rule or triple violation", () => {
  assert.deepEqual(checkGraph(g), []);
});

test("a probe-record note is refused for each broken rule", () => {
  const ok = result.props;
  assert.deepEqual(
    checkNote({ root, kind: "Result", name: "x", props: ok }),
    [],
  );
  const bad: [string, Record<string, unknown>, RegExp][] = [
    [
      "quote not in the record file",
      { ...ok, quote: "words that are not in the file 7f3a" },
      /not found verbatim/,
    ],
    [
      "record file missing",
      { ...ok, record: "companion/NO_SUCH_FILE.md" },
      /does not exist/,
    ],
    ["reading outside the list", { ...ok, reading: "great" }, /reading/],
    ["counted not a boolean", { ...ok, counted: "yes" }, /counted/],
    ["carries a value", { ...ok, value: 1 }, /no value/],
    ["no experiment", { ...ok, experiment: undefined }, /experiment/],
  ];
  for (const [what, props, rx] of bad)
    assert.match(
      checkNote({
        root,
        kind: "Result",
        name: "x",
        props: props as never,
      }).join("; "),
      rx,
      what,
    );
  assert.match(
    checkNote({
      root,
      kind: "Experiment",
      name: "x",
      props: { record: ok.record!, quote: ok.quote!, date: "15 Nov" },
    }).join("; "),
    /YYYY-MM-DD/,
  );
  assert.match(
    checkNote({
      root,
      kind: "Hypothesis",
      name: "x",
      props: { record: ok.record!, quote: ok.quote! },
    }).join("; "),
    /prereg/,
  );
});

test("a relation outside the 26 allowed triples is refused", () => {
  const r = g.relations[0]!;
  const twisted = {
    ...g,
    relations: [{ ...r, source: r.destination, destination: r.source }],
  };
  const expectRefusal = !g.triples.some(
    (t) =>
      t.source === g.nodes.get(r.destination)!.nodeType &&
      t.relation === r.label &&
      t.destination === g.nodes.get(r.source)!.nodeType,
  );
  assert.equal(
    checkGraph(twisted).some((e) => /not an allowed triple/.test(e)),
    expectRefusal,
  );
});
