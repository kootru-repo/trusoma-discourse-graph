/**
 * Read the Discourse Graphs vault into one typed graph.
 * The vault is the only authored source (local/dg_demo/TRUSOMA_DG_DEMO_PLAN_2026-11-15.md, section 1): this module only reads.
 * A note's frontmatter is one `name: <JSON>` per line; a note last saved by Obsidian's property editor is YAML, read with the yaml package.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { parse as parseYaml } from "yaml";

export type Json =
  string | number | boolean | null | Json[] | { [key: string]: Json };

export type DiscourseNode = {
  uid: string;
  nodeType: string;
  nodeTypeId: string;
  title: string;
  /** the title without its type prefix, e.g. "phase1_substrate.NMDA_SHARE_E16" */
  name: string;
  props: Record<string, Json>;
};

export type Relation = {
  id: string;
  type: string;
  label: string;
  source: string;
  destination: string;
};
export type NodeTypeDef = { id: string; name: string; format: string };
export type RelationTypeDef = { id: string; label: string; complement: string };
export type Triple = { source: string; relation: string; destination: string };

export type Graph = {
  root: string;
  nodes: Map<string, DiscourseNode>;
  byTitle: Map<string, DiscourseNode>;
  relations: Relation[];
  outgoing: Map<string, Relation[]>;
  incoming: Map<string, Relation[]>;
  nodeTypes: NodeTypeDef[];
  relationTypes: RelationTypeDef[];
  triples: Triple[];
};

const HEAD = new Set(["nodeTypeId", "nodeInstanceId", "dg_type"]);

export const parseFrontmatter = (
  text: string,
  file: string,
): Record<string, Json> => {
  const lines = text.split("\n");
  if (lines[0] !== "---") throw new Error(`${file}: no frontmatter`);
  const end = lines.indexOf("---", 1);
  if (end < 0) throw new Error(`${file}: frontmatter not closed`);
  const body = lines.slice(1, end);
  try {
    const props: Record<string, Json> = {};
    for (const line of body) {
      const at = line.indexOf(": ");
      if (at < 0) throw new SyntaxError("not a name: value line");
      props[line.slice(0, at)] = JSON.parse(line.slice(at + 2)) as Json;
    }
    return props;
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    const parsed: unknown = parseYaml(body.join("\n"));
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error(`${file}: frontmatter is not a mapping`);
    return parsed as Record<string, Json>;
  }
};

type Grammar = {
  nodeTypes: { id: string; name: string; format?: string }[];
  relationTypes: { id: string; label: string; complement?: string }[];
  discourseRelations: {
    sourceId: string;
    destinationId: string;
    relationshipTypeId: string;
  }[];
};

const readGrammar = (vault: string): Grammar => {
  for (const candidate of [
    join(vault, "Meta", "grammar.json"),
    join(vault, ".obsidian", "plugins", "discourse-graphs", "data.json"),
  ]) {
    if (existsSync(candidate))
      return JSON.parse(readFileSync(candidate, "utf8")) as Grammar;
  }
  throw new Error(
    "no grammar: neither vault/Meta/grammar.json nor the plugin's data.json exists",
  );
};

const push = ({
  map,
  key,
  relation,
}: {
  map: Map<string, Relation[]>;
  key: string;
  relation: Relation;
}): void => {
  const list = map.get(key);
  if (list) list.push(relation);
  else map.set(key, [relation]);
};

/** Load every discourse note (vault/DiscourseGraph) and every relation (vault/relations.json). Table rows (vault/Tables) are not discourse and are not loaded. */
export const loadVault = (root: string): Graph => {
  const vault = join(root, "vault");
  const grammar = readGrammar(vault);
  const nodeTypes = grammar.nodeTypes.map((t) => ({
    id: t.id,
    name: t.name,
    format: t.format ?? "",
  }));
  const relationTypes = grammar.relationTypes.map((t) => ({
    id: t.id,
    label: t.label,
    complement: t.complement ?? "",
  }));
  const typeName = new Map(nodeTypes.map((t) => [t.id, t.name]));
  const relationLabel = new Map(relationTypes.map((t) => [t.id, t.label]));
  const triples = grammar.discourseRelations.map((t) => ({
    source: typeName.get(t.sourceId) ?? t.sourceId,
    relation: relationLabel.get(t.relationshipTypeId) ?? t.relationshipTypeId,
    destination: typeName.get(t.destinationId) ?? t.destinationId,
  }));

  const nodes = new Map<string, DiscourseNode>();
  const byTitle = new Map<string, DiscourseNode>();
  const folder = join(vault, "DiscourseGraph");
  for (const file of readdirSync(folder).sort()) {
    if (!file.endsWith(".md")) continue;
    const all = parseFrontmatter(
      readFileSync(join(folder, file), "utf8"),
      file,
    );
    const uid = all.nodeInstanceId;
    const nodeTypeId = all.nodeTypeId;
    if (typeof uid !== "string" || typeof nodeTypeId !== "string")
      throw new Error(`${file}: no node id or type id`);
    const nodeType = typeName.get(nodeTypeId);
    if (!nodeType)
      throw new Error(`${file}: node type ${nodeTypeId} is not in the grammar`);
    const title = basename(file, ".md");
    const prefix = (
      nodeTypes.find((t) => t.id === nodeTypeId)?.format ?? ""
    ).replace("{content}", "");
    const props: Record<string, Json> = {};
    for (const [key, value] of Object.entries(all))
      if (!HEAD.has(key)) props[key] = value;
    const node: DiscourseNode = {
      uid,
      nodeType,
      nodeTypeId,
      title,
      name: title.startsWith(prefix) ? title.slice(prefix.length) : title,
      props,
    };
    nodes.set(uid, node);
    byTitle.set(title, node);
  }

  const file = JSON.parse(
    readFileSync(join(vault, "relations.json"), "utf8"),
  ) as {
    relations: Record<
      string,
      { id: string; type: string; source: string; destination: string }
    >;
  };
  const relations: Relation[] = [];
  const outgoing = new Map<string, Relation[]>();
  const incoming = new Map<string, Relation[]>();
  for (const r of Object.values(file.relations)) {
    if (!nodes.has(r.source) || !nodes.has(r.destination))
      throw new Error(`relation ${r.id}: an end is not a note of the vault`);
    const relation: Relation = {
      id: r.id,
      type: r.type,
      label: relationLabel.get(r.type) ?? r.type,
      source: r.source,
      destination: r.destination,
    };
    relations.push(relation);
    push({ map: outgoing, key: r.source, relation });
    push({ map: incoming, key: r.destination, relation });
  }
  return {
    root,
    nodes,
    byTitle,
    relations,
    outgoing,
    incoming,
    nodeTypes,
    relationTypes,
    triples,
  };
};
