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
    nodeTypes: 10,
    relationTypes: 7,
    triples: 33,
    instances: g.nodes.size,
    relations: g.relations.length,
  });
  assert.equal(concepts.length, 50 + g.nodes.size + g.relations.length);
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
  // the note is found by its stable handle: its title (the file name) is derived from its properties and can change
  const note = g.byHandle.get("CLM - phase1_substrate.NMDA_SHARE_E16")!;
  // a sourced value is titled with what its source says; the key and value follow in brackets
  assert.ok(note.title.startsWith("CLM - "));
  assert.ok(note.title.endsWith("(phase1_substrate.NMDA_SHARE_E16 = 0.755)"));
  const claim = concepts.find((c) => c.source_local_id === note.uid)!;
  assert.equal(claim.name, `DiscourseGraph/${note.title}.md`);
  assert.equal(claim.is_schema, false);
  assert.equal(claim.literal_content.label, note.title);
  // their conversion takes the core title from the file name, so it is the title without the type prefix
  assert.equal(
    claim.literal_content.core_title,
    note.title.slice("CLM - ".length),
  );
  const sourceData = claim.literal_content.source_data as {
    value: number;
    dg_name: string;
  };
  assert.equal(sourceData.dg_name, "phase1_substrate.NMDA_SHARE_E16");
  assert.equal(sourceData.value, 0.755);
  const supports = concepts.find(
    (c) =>
      !c.is_schema &&
      c.local_reference_content?.destination === claim.source_local_id &&
      c.name.includes("-supports->"),
  )!;
  assert.match(supports.name, /^\[\[.+\]\] -supports-> \[\[.+\]\]$/);
  assert.ok(supports.name.endsWith(` -supports-> [[${note.title}]]`));
  assert.deepEqual(Object.keys(supports.local_reference_content!).sort(), [
    "destination",
    "source",
  ]);
});
