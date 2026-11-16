/**
 * Export the vault's discourse graph as one static JSON file for the canvas (demo/web/public/graph.json).
 * A generated file: never edited, rebuilt from the vault by `npm run export`, ignored by git.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadVault, type Json } from "../src/vault.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(
  process.env.TRUSOMA_ROOT ?? resolve(here, "..", "..", "..", ".."),
);
const out = resolve(
  here,
  "..",
  "..",
  "..",
  "apps",
  "canvas",
  "public",
  "graph.json",
);
const KEEP = [
  "key",
  "value",
  "status",
  "quote",
  "locator",
  "transfer",
  "paper_id",
  "reading",
  "counted",
  "prereg",
  "date",
  "record",
  "species",
  "stage",
  "note",
  "meaning",
];
const clip = (v: Json): Json =>
  typeof v === "string" && v.length > 600 ? v.slice(0, 600) + " ..." : v;

const g = loadVault(root);
const nodes = [...g.nodes.values()].map((n) => {
  const props: Record<string, Json> = {};
  for (const k of KEEP)
    if (k in n.props && n.props[k] !== "" && n.props[k] !== null)
      props[k] = clip(
        typeof n.props[k] === "object"
          ? JSON.stringify(n.props[k])
          : n.props[k]!,
      );
  const data = n.props.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    for (const k of [
      "item",
      "status",
      "statement",
      "mechanism",
      "quote",
      "paper_id",
      "value",
      "unit",
      "method",
      "quantity",
    ]) {
      const v = data[k];
      if (v !== undefined && v !== "" && v !== null && !(k in props))
        props[k] = clip(typeof v === "object" ? JSON.stringify(v) : v);
    }
  }
  if (n.nodeType === "Source") {
    const row = n.props.row;
    if (row && typeof row === "object" && !Array.isArray(row))
      for (const k of ["citation", "year", "doi"])
        if (row[k]) props[k] = clip(row[k]);
  }
  return {
    uid: n.uid,
    type: n.nodeType,
    typeId: n.nodeTypeId,
    title: n.title,
    name: n.name,
    props,
  };
});
const relations = g.relations.map((r) => ({
  id: r.id,
  label: r.label,
  typeId: r.type,
  source: r.source,
  destination: r.destination,
}));
mkdirSync(dirname(out), { recursive: true });
writeFileSync(
  out,
  JSON.stringify({
    nodeTypes: g.nodeTypes,
    relationTypes: g.relationTypes,
    nodes,
    relations,
  }),
);
console.log(`graph.json: ${nodes.length} nodes, ${relations.length} relations`);
