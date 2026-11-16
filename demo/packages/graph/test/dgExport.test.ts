/** Shape and closure of the rows for their upsert_concepts function. These tests do not touch a database. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { test } from "vitest";
import { fileURLToPath } from "node:url";
import { referencesOf, toLocalConcepts } from "../src/dgExport.js";
import { loadVault } from "../src/vault.js";

const root = resolve(
  process.env.TRUSOMA_ROOT ??
    resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", ".."),
);
const g = loadVault(root);
const created = JSON.parse(
  readFileSync(join(root, "vault", "relations.json"), "utf8"),
) as { relations: Record<string, { created: number }> };
const { concepts, counts } = toLocalConcepts(
  g,
  (id) => created.relations[id]!.created,
);

test("one row per grammar item, note and relation", () => {
  assert.deepEqual(counts, {
    nodeTypes: 9,
    relationTypes: 7,
    triples: 26,
    instances: g.nodes.size,
    relations: g.relations.length,
  });
  assert.equal(concepts.length, 42 + g.nodes.size + g.relations.length);
});

test("ids are unique and every reference points at an earlier row (their loader's dependency order)", () => {
  const seen = new Set<string>();
  for (const c of concepts) {
    for (const ref of referencesOf(c))
      assert.ok(seen.has(ref), `${c.name}: ${ref} is not an earlier row`);
    assert.ok(
      !seen.has(c.source_local_id),
      `duplicate id ${c.source_local_id}`,
    );
    seen.add(c.source_local_id);
  }
});

test("a note and a relation carry what their plugin's conversion carries", () => {
  const claim = concepts.find(
    (c) => c.name === "DiscourseGraph/CLM - phase1_substrate.NMDA_SHARE_E16.md",
  )!;
  assert.equal(claim.is_schema, false);
  assert.equal(
    claim.literal_content.core_title,
    "phase1_substrate.NMDA_SHARE_E16",
  );
  assert.equal(
    (claim.literal_content.source_data as { value: number }).value,
    0.755,
  );
  const supports = concepts.find(
    (c) =>
      !c.is_schema &&
      c.local_reference_content?.destination === claim.source_local_id &&
      c.name.includes("-supports->"),
  )!;
  assert.match(
    supports.name,
    /^\[\[.+\]\] -supports-> \[\[CLM - phase1_substrate\.NMDA_SHARE_E16\]\]$/,
  );
  assert.deepEqual(Object.keys(supports.local_reference_content!).sort(), [
    "destination",
    "source",
  ]);
});
