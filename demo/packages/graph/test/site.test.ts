/** The counts drawn on the site's landing page (demo/site/index.html), each against the vault, so the page cannot drift from the notes. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "vitest";
import { PRESETS, runQuery } from "../src/query.js";
import { loadVault } from "../src/vault.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(
  process.env.TRUSOMA_ROOT ?? resolve(here, "..", "..", "..", ".."),
);
const page = readFileSync(
  join(here, "..", "..", "..", "site", "index.html"),
  "utf8",
);
const g = loadVault(root);
const nodes = [...g.nodes.values()];
const relations = [...g.outgoing.values()].flat();
const typeOf = (uid: string): string => g.nodes.get(uid)?.nodeType ?? "";
const thousands = (n: number): string => n.toLocaleString("en-US");

test("the page's note count per type is the vault's", () => {
  const drawn = [...page.matchAll(/\{ id: "(\w+)",\s+n: (\d+),/g)].map(
    (m) => [m[1]!, Number(m[2])] as const,
  );
  assert.equal(drawn.length, 10);
  for (const [type, n] of drawn)
    assert.equal(nodes.filter((x) => x.nodeType === type).length, n, type);
  assert.equal(
    drawn.reduce((sum, [, n]) => sum + n, 0),
    nodes.length,
  );
});

test("the page's relation count per pair of types is the vault's", () => {
  const drawn = [
    ...page.matchAll(/\["(\w+)", "([\w ]+)", "(\w+)", (\d+)\]/g),
  ].map((m) => ({ a: m[1]!, label: m[2]!, b: m[3]!, n: Number(m[4]) }));
  assert.equal(drawn.length, 21);
  for (const d of drawn)
    assert.equal(
      relations.filter(
        (r) =>
          r.label === d.label &&
          typeOf(r.source) === d.a &&
          typeOf(r.destination) === d.b,
      ).length,
      d.n,
      `${d.a} ${d.label} ${d.b}`,
    );
  const claimToClaim = relations.filter(
    (r) => typeOf(r.source) === "Claim" && typeOf(r.destination) === "Claim",
  ).length;
  const sum = drawn.reduce((s, d) => s + d.n, 0);
  assert.equal(sum + claimToClaim, relations.length);
  assert.ok(
    page.includes(`The scene draws ${thousands(sum)} relations`),
    "relations drawn",
  );
  assert.ok(
    page.includes(`The ${claimToClaim} Claim to Claim relations`),
    "relations not drawn",
  );
});

test("the page's headline counts are the vault's", () => {
  assert.ok(
    page.includes(`<b>${thousands(nodes.length)}</b><span>discourse notes`),
    "notes",
  );
  assert.ok(
    page.includes(`<b>${thousands(relations.length)}</b><span>relations`),
    "relations",
  );
  const sourced = runQuery({
    nodes: nodes.map((n) => ({ uid: n.uid, type: n.nodeType, props: n.props })),
    relations,
    query: PRESETS.find((p) => p.id === "sourced-values")!.query,
  }).length;
  assert.ok(
    page.includes(`See the ${thousands(sourced)} sourced values`),
    "sourced values",
  );
});
