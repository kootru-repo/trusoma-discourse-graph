/**
 * vault/Meta/grammar.json is the committed copy of the grammar (node types, relation types, allowed triples) that a clean checkout reads;
 * the plugin's own data.json is not in git. Where both exist, they must say the same.
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "vitest";

const KEYS = ["nodeTypes", "relationTypes", "discourseRelations"] as const;

const root = resolve(
  process.env.TRUSOMA_ROOT ??
    resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", ".."),
);
const committed = join(root, "vault", "Meta", "grammar.json");
const plugin = join(
  root,
  "vault",
  ".obsidian",
  "plugins",
  "discourse-graphs",
  "data.json",
);

const read = (file: string): Record<string, unknown> =>
  JSON.parse(readFileSync(file, "utf8")) as Record<string, unknown>;

test("the committed grammar is there and holds the three tables", () => {
  const grammar = read(committed);
  assert.deepEqual(Object.keys(grammar), [...KEYS]);
  for (const key of KEYS) assert.ok((grammar[key] as unknown[]).length > 0);
});

test.skipIf(!existsSync(plugin))(
  "the committed grammar equals the plugin's settings",
  () => {
    const grammar = read(committed);
    const settings = read(plugin);
    for (const key of KEYS) assert.deepEqual(grammar[key], settings[key]);
  },
);
