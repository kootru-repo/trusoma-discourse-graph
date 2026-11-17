"""Make a relation drawn in Obsidian an authored fact (plan section 18, O3). The plugin writes a drawn relation into vault/relations.json; our relations are generated from
note properties, so a drawn one is a difference the commit check refuses. This tool reads relations.json, and for every relation the notes do not imply:
  - if the grammar table D.EDGE_RULES has a property for (source kind, relation, destination kind), the wiki-link is added to that property of the owning note (authored);
  - a drawn Evidence-supports-Claim relation is added to the Evidence note's applies_to list;
  - anything else (an end that is not a vault note, a triple with no property) is listed and dropped.
Then the generated files are rewritten, so relations.json again equals what the notes imply.
  report (default)  list what would happen, change nothing
  apply             write the note properties and regenerate
usage: python ingest_gui.py [report|apply]"""
import json, subprocess, sys
import dmlib as D

HEAD = ("nodeTypeId", "nodeInstanceId", "dg_type")


def plan(nodes):
    drawn, foreign, stale = D.split_relations(json.load(open(D.RELATIONS, encoding="utf-8"))["relations"], nodes)   # imported relations are kept as they are, never authored or dropped
    drawn = dict(drawn, **stale)   # a relation with an end that is no note at all is listed and dropped, as before
    if foreign:
        print("foreign relations left untouched: %d" % len(foreign))
    expected = D.expected_relations(nodes)
    by_id = {D.node_id(k, n): (k, n) for (k, n) in nodes}
    name_of = {v: k for k, v in D.REL_TYPE.items()}
    adds, rejects = [], []
    for rid, r in drawn.items():
        if rid in expected or any(e["type"] == r.get("type") and e["source"] == r.get("source") and e["destination"] == r.get("destination") for e in ()):
            continue
        a, b, rel = by_id.get(r.get("source")), by_id.get(r.get("destination")), name_of.get(r.get("type"))
        if a is None or b is None or rel is None:
            rejects.append((rid, "an end is not a vault note, or the relation type is unknown"))
            continue
        if any(e["type"] == r["type"] and e["source"] == r["source"] and e["destination"] == r["destination"] for e in expected.values()):
            continue   # the same relation under the plugin's own id: already implied by the notes
        owner = None
        for kind, prop, rule_rel, other, outgoing in D.EDGE_RULES:
            me, it = (a, b) if outgoing else (b, a)
            if rule_rel == rel and me[0] == kind and it[0] == other and ("record_file" not in nodes[me] or (kind, prop) in D.ON_RECORDS):
                owner = (me, prop, D.link(*it))
                break
        if owner is None and rel == "supports" and a[0] == "Evidence" and b[0] == "Claim" and nodes[a].get("evidence_kind") == "link":
            owner = (a, "applies_to", D.link(*b))
        if owner is None:
            rejects.append((rid, "%s %s -%s-> %s %s: no authored property holds this relation" % (a[0], a[1], rel, b[0], b[1])))
        else:
            adds.append(owner)
    missing = [rid for rid in expected if rid not in drawn]
    return adds, rejects, missing


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "report"
    nodes = D.read_all()
    adds, rejects, missing = plan(nodes)
    for (kind, name), prop, link in adds:
        print("ADD  %s %s: %s += %s" % (kind, name, prop, link))
    for rid, why in rejects:
        print("DROP %s: %s" % (rid, why))
    print("drawn relations to author: %d, to drop: %d, relations deleted in Obsidian that the notes still imply (restored on regeneration): %d" % (len(adds), len(rejects), len(missing)))
    if mode != "apply":
        return 0
    for (kind, name), prop, link in adds:
        p = {k: v for k, v in D.read_all()[(kind, name)].items() if k not in HEAD}
        cur = p.get(prop)
        single = prop in ("question", "experiment")
        if single and cur and cur != link:
            print("SKIP %s %s: %s already holds %s" % (kind, name, prop, cur))
            continue
        p[prop] = link if single else sorted(set(D.links_of(cur)) | {link})
        D.write_note_kind(kind, name, p)
    r = subprocess.run([sys.executable, "-B", str(D.ROOT / "tools/dm/build_from_vault.py"), "write"], capture_output=True, text=True)
    print(r.stdout.strip().splitlines()[-1] if r.stdout.strip() else r.stderr[-300:])
    return subprocess.run([sys.executable, "-B", str(D.ROOT / "tools/dm/check_all.py")], capture_output=True).returncode


if __name__ == "__main__":
    sys.exit(main())
