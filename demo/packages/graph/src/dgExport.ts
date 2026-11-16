/**
 * The vault as the rows the Discourse Graphs database takes: the `data` argument of their Postgres function `upsert_concepts`
 * (packages/database/supabase/schemas/concept.sql, type concept_local_input).
 * The mapping follows their Obsidian plugin's own conversion (apps/obsidian/src/utils/conceptConversion.ts, read at commit 1ae4c00), in the plugin's order:
 * node types, relation types, allowed triples, node instances, relation instances. space_id and author_id are left to the loader.
 * A note's created and last_modified are its file's times, as in their plugin (file.stat.ctime, file.stat.mtime): the database requires them.
 * A note's source_data is its frontmatter without the two ids, as theirs: the plugin's dg_type property stays in.
 * Tested for shape and closure (test/dgExport.test.ts), row for row against their own conversion code (test/theirConversion.test.ts), and loaded through their function into a hosted Supabase (scripts/load-hosted.ts).
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { Graph, Json } from "./vault.js";

export type LocalConcept = {
  name: string;
  source_local_id: string;
  is_schema: boolean;
  schema_represented_by_local_id?: string;
  description?: string;
  created?: string;
  last_modified?: string;
  literal_content: Record<string, Json>;
  local_reference_content?: Record<string, string>;
};

type RawNodeType = {
  id: string;
  name: string;
  format: string;
  created: number;
  modified: number;
  description?: string;
  template?: string;
} & Record<string, Json>;
type RawRelationType = {
  id: string;
  label: string;
  complement: string;
  created: number;
  modified: number;
  status?: string;
} & Record<string, Json>;
type RawTriple = {
  id: string;
  sourceId: string;
  destinationId: string;
  relationshipTypeId: string;
  created: number;
  modified: number;
};
type RawGrammar = {
  nodeTypes: RawNodeType[];
  relationTypes: RawRelationType[];
  discourseRelations: RawTriple[];
};

const ROLES = ["source", "destination"];
const iso = (ms: number): string => new Date(ms).toISOString();

const readRawGrammar = (root: string): RawGrammar => {
  for (const f of [
    join(root, "vault", "Meta", "grammar.json"),
    join(
      root,
      "vault",
      ".obsidian",
      "plugins",
      "discourse-graphs",
      "data.json",
    ),
  ]) {
    if (existsSync(f)) return JSON.parse(readFileSync(f, "utf8")) as RawGrammar;
  }
  throw new Error("no grammar file");
};

const coreTitle = (format: string, basename: string): string => {
  const prefix = format.replace("{content}", "");
  return basename.startsWith(prefix) ? basename.slice(prefix.length) : basename;
};

export const toLocalConcepts = (
  g: Graph,
  relationCreatedMs: (id: string) => number,
): { concepts: LocalConcept[]; counts: Record<string, number> } => {
  const raw = readRawGrammar(g.root);
  const nodeTypeById = new Map(raw.nodeTypes.map((t) => [t.id, t]));
  const relationTypeById = new Map(raw.relationTypes.map((t) => [t.id, t]));

  const nodeTypes: LocalConcept[] = raw.nodeTypes.map(
    ({
      description,
      template,
      id,
      name,
      format,
      created,
      modified,
      ...other
    }) => ({
      name,
      source_local_id: id,
      is_schema: true,
      created: iso(created),
      last_modified: iso(modified),
      ...(description ? { description } : {}),
      literal_content: {
        label: name,
        format,
        source_data: other,
        ...(template ? { template } : {}),
        template_content: null,
      },
    }),
  );
  const relationTypes: LocalConcept[] = raw.relationTypes.map(
    ({ id, label, complement, created, modified, ...rest }) => {
      const other = Object.fromEntries(
        Object.entries(rest).filter(([key]) => key !== "status"),
      );
      return {
        name: label,
        source_local_id: id,
        is_schema: true,
        created: iso(created),
        last_modified: iso(modified),
        literal_content: {
          roles: ROLES,
          label,
          complement,
          source_data: other,
        },
      };
    },
  );
  const triples: LocalConcept[] = [];
  for (const t of raw.discourseRelations) {
    const type = relationTypeById.get(t.relationshipTypeId);
    if (!type) continue;
    triples.push({
      name: `${nodeTypeById.get(t.sourceId)?.name ?? t.sourceId} -${type.label}-> ${nodeTypeById.get(t.destinationId)?.name ?? t.destinationId}`,
      source_local_id: t.id,
      is_schema: true,
      created: iso(t.created),
      last_modified: iso(t.modified),
      literal_content: {
        roles: ROLES,
        label: type.label,
        complement: type.complement,
      },
      local_reference_content: {
        relation_type: t.relationshipTypeId,
        source: t.sourceId,
        destination: t.destinationId,
      },
    });
  }
  const instances: LocalConcept[] = [...g.nodes.values()].map((n) => {
    const stat = statSync(
      join(g.root, "vault", "DiscourseGraph", `${n.title}.md`),
    );
    return {
      name: `DiscourseGraph/${n.title}.md`,
      source_local_id: n.uid,
      schema_represented_by_local_id: n.nodeTypeId,
      is_schema: false,
      created: iso(stat.birthtimeMs),
      last_modified: iso(stat.mtimeMs),
      literal_content: {
        label: n.title,
        core_title: coreTitle(
          nodeTypeById.get(n.nodeTypeId)?.format ?? "",
          n.title,
        ),
        source_data: { dg_type: n.nodeType, ...n.props },
      },
    };
  });
  const relations: LocalConcept[] = g.relations.map((r) => {
    const when = iso(relationCreatedMs(r.id));
    return {
      name: `[[${g.nodes.get(r.source)!.title}]] -${r.label}-> [[${g.nodes.get(r.destination)!.title}]]`,
      source_local_id: r.id,
      schema_represented_by_local_id: r.type,
      is_schema: false,
      created: when,
      last_modified: when,
      literal_content: {},
      local_reference_content: { source: r.source, destination: r.destination },
    };
  });
  return {
    concepts: [
      ...nodeTypes,
      ...relationTypes,
      ...triples,
      ...instances,
      ...relations,
    ],
    counts: {
      nodeTypes: nodeTypes.length,
      relationTypes: relationTypes.length,
      triples: triples.length,
      instances: instances.length,
      relations: relations.length,
    },
  };
};

/** Ids a concept refers to (its schema and its reference slots): each must be the source_local_id of an earlier row, or their loader reports it missing. */
export const referencesOf = (c: LocalConcept): string[] => [
  ...(c.schema_represented_by_local_id
    ? [c.schema_represented_by_local_id]
    : []),
  ...Object.values(c.local_reference_content ?? {}),
];
