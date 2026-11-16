/**
 * The rows this package builds are the rows the Discourse Graphs plugin's own code builds from the same vault.
 * Their conversion (apps/obsidian/src/utils/conceptConversion.ts) and their relation file check (utils/relationsStore.ts) are run from a checkout
 * named by DG_REPO, on what Obsidian would hand them: each note's frontmatter and file times, the plugin's grammar, relations.json.
 * Skipped when DG_REPO is not set.
 */
import assert from "node:assert/strict";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";
import { test } from "vitest";
import { parse } from "yaml";
import { toLocalConcepts, type LocalConcept } from "../src/dgExport.js";
import { loadVault } from "../src/vault.js";

type Row = Record<string, unknown>;
type RelationInstance = {
  id: string;
  type: string;
  source: string;
  destination: string;
  created: number;
  lastModified?: number;
};
type RelationsFile = {
  version: number;
  lastModified: number;
  relations: Record<string, RelationInstance>;
};
type Grammar = {
  nodeTypes: { id: string }[];
  relationTypes: { id: string }[];
  discourseRelations: { id: string }[];
};
type Theirs = {
  discourseNodeSchemaToLocalConcept: (args: { context: Row; node: Row }) => Row;
  discourseRelationTypeToLocalConcept: (context: Row, relationType: Row) => Row;
  discourseRelationTripleSchemaToLocalConcept: (args: {
    context: Row;
    relation: Row;
    nodeTypesById: Row;
    relationTypesById: Row;
  }) => Row | null;
  discourseNodeInstanceToLocalConcept: (args: {
    context: Row;
    nodeData: Row;
    nodeTypesById: Row;
  }) => Row;
  relationInstanceToLocalConcept: (args: {
    context: Row;
    relationTypesById: Row;
    allNodesById: Row;
    relationInstanceData: RelationInstance;
  }) => Row | null;
};

const repo = process.env.DG_REPO;
const root = resolve(
  process.env.TRUSOMA_ROOT ??
    resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", ".."),
);
const their = (...parts: string[]): string =>
  join(repo ?? "", "apps", "obsidian", "src", ...parts);

/**
 * Their conversion module and the three small modules it calls, compiled from their source as it stands into a temporary folder.
 * Only the import paths are rewritten; their constants module builds default settings on load, so the one name the conversion takes from it is read from their file.
 */
const loadTheirConversion = async (): Promise<Theirs> => {
  const dir = mkdtempSync(join(tmpdir(), "dg-conversion-"));
  const database = (name: string): string =>
    join(repo ?? "", "packages", "database", "src", "lib", `${name}.ts`);
  const sources: Record<string, string> = {
    conceptConversion: their("utils", "conceptConversion.ts"),
    extractContentFromTitle: database("extractContentFromTitle"),
    decorateTitle: database("decorateTitle"),
    getDiscourseNodeFormatExpression: database(
      "getDiscourseNodeFormatExpression",
    ),
  };
  const slot = /SOURCE_SLOT\s*=\s*"([^"]+)"/.exec(
    readFileSync(their("constants.ts"), "utf8"),
  )?.[1];
  if (!slot) throw new Error("SOURCE_SLOT not found in their constants.ts");
  writeFileSync(
    join(dir, "constants.mjs"),
    `export const SOURCE_SLOT = ${JSON.stringify(slot)};
`,
  );
  for (const [name, file] of Object.entries(sources)) {
    const compiled = ts.transpileModule(readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
    writeFileSync(
      join(dir, `${name}.mjs`),
      compiled.replace(
        /from "(?:@repo\/database\/lib|~|\.)\/([\w]+)"/g,
        'from "./$1.mjs"',
      ),
    );
  }
  try {
    return (await import(
      /* @vite-ignore */ pathToFileURL(join(dir, "conceptConversion.mjs")).href
    )) as Theirs;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

/** Their row without the two fields the loader fills, and as it crosses the wire (undefined dropped). */
const wire = (row: Row | null): Row => {
  const copy = JSON.parse(JSON.stringify(row)) as Row;
  delete copy.space_id;
  delete copy.author_id;
  return copy;
};
const byId = <T extends { id: string }>(items: T[]): Record<string, T> =>
  Object.fromEntries(items.map((item) => [item.id, item]));

test.skipIf(!repo)(
  "relations.json passes their relation file check and every relation has their fields",
  () => {
    const source = readFileSync(their("utils", "relationsStore.ts"), "utf8");
    for (const field of ["version", "lastModified", "relations"])
      assert.match(
        source,
        new RegExp(`typeof data\\.${field} !== "(number|object)"`),
        `their check no longer reads ${field}`,
      );
    const file = JSON.parse(
      readFileSync(join(root, "vault", "relations.json"), "utf8"),
    ) as RelationsFile;
    assert.equal(typeof file.version, "number");
    assert.equal(typeof file.lastModified, "number");
    assert.equal(typeof file.relations, "object");
    for (const [id, relation] of Object.entries(file.relations)) {
      assert.equal(relation.id, id);
      for (const field of ["type", "source", "destination"] as const)
        assert.equal(typeof relation[field], "string", `${id}: ${field}`);
      assert.equal(typeof relation.created, "number", `${id}: created`);
    }
  },
);

test.skipIf(!repo)(
  "their plugin's conversion gives the same rows, in the same order, from the same vault",
  async () => {
    const theirs = await loadTheirConversion();
    const g = loadVault(root);
    const context = { spaceId: 1, userId: 1 };
    const grammarFile = [
      join(root, "vault", "Meta", "grammar.json"),
      join(
        root,
        "vault",
        ".obsidian",
        "plugins",
        "discourse-graphs",
        "data.json",
      ),
    ].find((file) => existsSync(file));
    assert.ok(grammarFile, "no grammar file");
    const grammar = JSON.parse(readFileSync(grammarFile, "utf8")) as Grammar;
    const nodeTypesById = byId(grammar.nodeTypes);
    const relationTypesById = byId(grammar.relationTypes);
    const relations = (
      JSON.parse(
        readFileSync(join(root, "vault", "relations.json"), "utf8"),
      ) as RelationsFile
    ).relations;

    // what Obsidian hands their code for a note: the file (name, path, times) and its parsed frontmatter
    const allNodesById: Record<string, Row> = {};
    const instances: Row[] = [];
    for (const node of g.nodes.values()) {
      const path = join(root, "vault", "DiscourseGraph", `${node.title}.md`);
      const stat = statSync(path);
      const text = readFileSync(path, "utf8");
      const frontmatter = parse(
        text.slice(text.indexOf("---") + 3, text.indexOf("\n---", 3)),
      ) as Row;
      const file = {
        basename: node.title,
        path: `DiscourseGraph/${node.title}.md`,
        stat: { ctime: stat.birthtimeMs, mtime: stat.mtimeMs },
      };
      allNodesById[String(frontmatter.nodeInstanceId)] = { file, frontmatter };
      instances.push(
        theirs.discourseNodeInstanceToLocalConcept({
          context,
          nodeData: { file, frontmatter, nodeTypeId: frontmatter.nodeTypeId },
          nodeTypesById,
        }),
      );
    }
    const expected: (Row | null)[] = [
      ...grammar.nodeTypes.map((node) =>
        theirs.discourseNodeSchemaToLocalConcept({ context, node }),
      ),
      ...grammar.relationTypes.map((type) =>
        theirs.discourseRelationTypeToLocalConcept(context, type),
      ),
      ...grammar.discourseRelations.map((relation) =>
        theirs.discourseRelationTripleSchemaToLocalConcept({
          context,
          relation,
          nodeTypesById,
          relationTypesById,
        }),
      ),
      ...instances,
      ...g.relations.map((relation) =>
        theirs.relationInstanceToLocalConcept({
          context,
          relationTypesById,
          allNodesById,
          relationInstanceData: relations[relation.id]!,
        }),
      ),
    ];
    const ours: LocalConcept[] = toLocalConcepts(
      g,
      (id) => relations[id]!.created,
    ).concepts;
    assert.equal(ours.length, expected.length);
    for (const [index, row] of ours.entries())
      assert.deepEqual(
        JSON.parse(JSON.stringify(row)),
        wire(expected[index] ?? null),
        `row ${index}: ${row.name}`,
      );
  },
);
