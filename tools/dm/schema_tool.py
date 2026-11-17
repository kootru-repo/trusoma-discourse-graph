"""The vault's schema as the Discourse Graphs plugin reads it.
The node types, relation types and allowed triples live in vault/Meta/grammar.json (committed) and, on the author's machine, in the plugin's settings
(vault/.obsidian/plugins/discourse-graphs/data.json, not committed). This tool
  write  adds what is ours to both (the Parameter node type, the triples of dmlib.OWN_TRIPLES) and writes vault/Meta/dg-schema-trusoma.json: the same schema in the plugin's
         own export format (apps/obsidian/src/utils/specValidation.ts, dgSchemaFileSchema), for reading and for vaults that already hold these ids (a fresh clone uses install, below, not the plugin's import command)
  check  (default) exit 1 unless grammar.json holds every type and triple the vault's relations use and the schema file is the one derived from grammar.json
  install  for a fresh clone: writes the node types, relation types and triples into the plugin's settings file BEFORE the plugin is first enabled (creates the file when
         it is missing; when it exists every other setting is kept, and so is any type or triple a person added there under an id that is not ours). This is the way to get the vault's own type ids. The plugin's import command alone does not give them:
         it matches Question, Claim, Evidence, Source, supports, opposes and informs to the plugin's defaults by name and keeps the defaults' random ids, so the notes of
         those types would show as unknown.
usage: python schema_tool.py [check|write|install]"""
import json, sys
import dmlib as D

GRAMMAR = D.VAULT / "Meta" / "grammar.json"
SETTINGS = D.VAULT / ".obsidian" / "plugins" / "discourse-graphs" / "data.json"
SCHEMA = D.VAULT / "Meta" / "dg-schema-trusoma.json"
NL = chr(10)
OURS_MS = 1794787200000   # 2026-11-16T00:00:00Z, when our additions to the lab schema were made
PARAMETER = {"id": D.NODE_TYPE["Parameter"], "name": "Parameter", "format": "PAR - {content}", "color": "#8A8F98", "created": OURS_MS, "modified": OURS_MS,
             "description": "A model setting with no source yet: not an assertion (a model choice, a value not researched, one with no source found, or one that cites the design only)",
             "tag": "par-candidate"}
REQUIRED_NODE = ("id", "name", "format", "created", "modified")
REQUIRED_REL = ("id", "label", "complement", "created", "modified")
REQUIRED_TRIPLE = ("id", "sourceId", "destinationId", "relationshipTypeId", "created", "modified")


def own_triples():
    out = []
    for i, (a, rel, b) in enumerate(D.OWN_TRIPLES, 1):
        out.append({"sourceId": D.NODE_TYPE[a], "destinationId": D.NODE_TYPE[b], "relationshipTypeId": D.REL_TYPE[rel], "created": OURS_MS, "modified": OURS_MS,
                    "id": "rel3_trusomaOwnTriple%05d" % i})
    return out


def with_ours(g):
    g = dict(g)
    g["nodeTypes"] = [x for x in g["nodeTypes"] if x["id"] != PARAMETER["id"]] + [PARAMETER]
    mine = own_triples()
    ids = {x["id"] for x in mine}
    g["discourseRelations"] = [x for x in g["discourseRelations"] if x["id"] not in ids] + mine
    return g


def schema_file(g):
    """the plugin's schema export of this grammar (fixed date and names, so the file is reproducible)"""
    return {"version": 1, "exportedAt": "2026-11-16T00:00:00.000Z", "pluginVersion": "1.8.0", "vaultName": "trusoma", "vaultId": "trusoma-vault",
            "nodeTypes": g["nodeTypes"], "relationTypes": g["relationTypes"], "discourseRelations": g["discourseRelations"], "templates": []}


def dump(obj, indent):
    return json.dumps(obj, indent=indent, ensure_ascii=False) + NL


def allowed(g):
    return {(t["sourceId"], t["relationshipTypeId"], t["destinationId"]) for t in g["discourseRelations"]}


def problems():
    out = []
    if not GRAMMAR.exists():
        return ["vault/Meta/grammar.json is missing"]
    g = json.loads(GRAMMAR.read_text(encoding="utf-8"))
    if with_ours(g) != g:
        out.append("grammar.json lacks the Parameter type or one of our triples (run tools/dm/schema_tool.py write)")
    for name, rows, req in (("node type", g["nodeTypes"], REQUIRED_NODE), ("relation type", g["relationTypes"], REQUIRED_REL), ("triple", g["discourseRelations"], REQUIRED_TRIPLE)):
        for r in rows:
            miss = [k for k in req if k not in r]
            if miss:
                out.append("grammar.json %s %s lacks %s (the plugin's schema import requires it)" % (name, r.get("id"), ", ".join(miss)))
    if not SCHEMA.exists() or SCHEMA.read_text(encoding="utf-8") != dump(schema_file(g), 2):
        out.append("vault/Meta/dg-schema-trusoma.json is not the schema derived from grammar.json (run tools/dm/schema_tool.py write)")
    nodes = D.read_all()
    type_of = {D.node_id(k, n): D.NODE_TYPE[D.disk_kind(k, p)] for (k, n), p in nodes.items() if k != "Record"}
    ok = allowed(g)
    bad = {}
    for r in D.expected_relations(nodes).values():
        t = (type_of.get(r["source"]), r["type"], type_of.get(r["destination"]))
        if t not in ok:
            bad[t] = bad.get(t, 0) + 1
    names = {v: k for k, v in D.NODE_TYPE.items()}
    rels = {v: k for k, v in D.REL_TYPE.items()}
    out += ["%d relation(s) %s -%s-> %s: not a triple of the grammar" % (n, names.get(a, a), rels.get(r, r), names.get(b, b)) for (a, r, b), n in sorted(bad.items(), key=str)]
    return out


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "check"
    if mode == "write":
        g = with_ours(json.loads(GRAMMAR.read_text(encoding="utf-8")))
        GRAMMAR.write_text(dump(g, 1), encoding="utf-8", newline=NL)
        SCHEMA.write_text(dump(schema_file(g), 2), encoding="utf-8", newline=NL)
        if SETTINGS.exists():   # the author's own plugin settings follow, so Obsidian shows the same types and triples
            s = json.loads(SETTINGS.read_text(encoding="utf-8"))
            s.update({k: g[k] for k in ("nodeTypes", "relationTypes", "discourseRelations")})
            SETTINGS.write_text(json.dumps(s, indent=2, ensure_ascii=False), encoding="utf-8", newline=NL)
        print("schema written: %d node types, %d relation types, %d triples" % (len(g["nodeTypes"]), len(g["relationTypes"]), len(g["discourseRelations"])))
    if mode == "install":
        g = json.loads(GRAMMAR.read_text(encoding="utf-8"))
        s = json.loads(SETTINGS.read_text(encoding="utf-8")) if SETTINGS.exists() else {}
        moved = {}   # id of a plugin default that gives way -> id of the vault's type of the same name: a person's own triple that used the default follows it
        for k in ("nodeTypes", "relationTypes"):
            mine = {str(x.get("name") or x.get("label") or "").lower(): x["id"] for x in g[k]}
            for x in s.get(k, []):
                nm = str(x.get("name") or x.get("label") or "").lower()
                if nm in mine and x.get("id") != mine[nm]:
                    moved[x["id"]] = mine[nm]
        for x in s.get("discourseRelations", []):
            for f in ("sourceId", "destinationId", "relationshipTypeId"):
                x[f] = moved.get(x.get(f), x.get(f))
        seen = {(x["sourceId"], x["relationshipTypeId"], x["destinationId"]) for x in g["discourseRelations"]}
        s["discourseRelations"] = [x for x in s.get("discourseRelations", []) if (x.get("sourceId"), x.get("relationshipTypeId"), x.get("destinationId")) not in seen or x.get("id") in {y["id"] for y in g["discourseRelations"]}]
        for k in ("nodeTypes", "relationTypes", "discourseRelations"):   # ours by id, then whatever else a person keeps there
            ours = {x["id"] for x in g[k]}
            names = {str(x.get("name") or x.get("label") or "").lower() for x in g[k]} - {""}   # a default type of the plugin with one of our names (the plugin was enabled once before) gives way to ours
            s[k] = g[k] + [x for x in s.get(k, []) if x.get("id") not in ours and str(x.get("name") or x.get("label") or "").lower() not in names]
        live = {x["id"] for x in s["nodeTypes"]} | {x["id"] for x in s["relationTypes"]}   # a kept triple must still point at types that exist
        s["discourseRelations"] = [x for x in s["discourseRelations"] if {x.get("sourceId"), x.get("destinationId"), x.get("relationshipTypeId")} <= live]
        if not s.get("nodesFolderPath"):
            s["nodesFolderPath"] = "DiscourseGraph"
        SETTINGS.parent.mkdir(parents=True, exist_ok=True)
        SETTINGS.write_text(json.dumps(s, indent=2, ensure_ascii=False), encoding="utf-8", newline=NL)
        print("plugin settings hold the vault's schema: %s (%d node types, %d relation types, %d triples). Restart Obsidian if it is open." % (SETTINGS, len(s["nodeTypes"]), len(s["relationTypes"]), len(s["discourseRelations"])))
    bad = problems()
    for b in bad:
        print("SCHEMA", b)
    print("SCHEMA OK" if not bad else "SCHEMA FAILED")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
