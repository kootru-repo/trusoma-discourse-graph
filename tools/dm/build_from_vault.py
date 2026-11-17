"""Generate from the vault (phases 1 to 3): global_config.json and other_config.json (every section), paper_links.csv, paper_register.csv, and the files of records.SPECS
(audit log, sourcing records, source_basis, worklists, measurement table, JEPA references, growth sources and equations, body provenance, growth web, tool settings).
  check  (default) generate in memory and compare with the committed files: exit 1 on any difference
  write  replace the committed generated files by the generated text (identical bytes when the gate holds; the register is rewritten once in canonical form)
usage: python build_from_vault.py [check|write]"""
import csv, io, json, sys
import dmlib as D
import worklist
import records as R

NL = chr(10)
OVERRIDES = "companion/source_audit/constant_overrides.json"   # generated: vault Claims whose status or meaning overrides the frozen constant log
ENTRY_ORDER = ("value", "entries", "db", "note", "status", "paper_id", "locator", "quote", "saved_text", "transfer", "source_note")
BODY_ORDER = ("value", "text", "entries", "db", "state", "status", "meaning")
LINK_FIELDS = ("cid", "status", "paper_id", "locator", "locator_basis", "quote", "value_in_source", "species_age", "transfer")
OTHER = D.ROOT / "tools/trusoma/brain/other_config.json"
LINKS = D.ROOT / "companion/source_audit/paper_links.csv"
REGISTER = D.ROOT / "companion/source_audit/paper_register.csv"
BASIS = D.ROOT / "companion/source_audit/source_basis.csv"
JEPA = D.ROOT / "companion/TRUSOMA_JEPA_REFERENCES.csv"
# the learner value table of the appendix (USER 2026-11-15, "table becomes a gen block"): the lines between the two markers are generated, the rest of the document is hand-written
APPENDIX = D.ROOT / "companion/CF2_CONSTANTS_APPENDIX.md"
BLOCK_BEGIN = "<!-- GENERATED from the vault by tools/dm/build_from_vault.py: do not edit between this line and the END line; edit the vault note and regenerate -->"
BLOCK_END = "<!-- END GENERATED -->"
BLOCK_HEAD = "## Learner value table (generated from the vault, one line per bound learner value; the entries above are the hand-written reading notes for the same values)"
PARTIAL = {APPENDIX}   # files of which only a marked block is generated


def appendix_block(nodes):
    lines = [BLOCK_BEGIN]
    learner = sorted((p for (k, _), p in nodes.items() if k == "Claim" and "module" in p), key=lambda p: p["order"])
    for c in learner:
        ev = [nodes[("Evidence", D.target_of(l, "Evidence"))] for l in c.get("evidence", [])]
        if ev:
            e = ev[0]
            row = nodes[("Source", e["paper_id"])]["row"]
            lines.append("- %s %s [V] (%s, %s %s; %s)" % (c["key"], json.dumps(c["value"]), e["paper_id"], row.get("first_author", ""), row.get("year", ""), e["locator"]))
        else:
            lines.append("- %s %s (no source recorded in the vault: %s)" % (c["key"], json.dumps(c["value"]), c.get("status") or "no status"))
    lines.append(BLOCK_END)
    return NL.join(lines)


def with_block(hand, block):
    """the document with its generated block replaced (or added at the end when the markers are not there yet)"""
    if BLOCK_BEGIN in hand and BLOCK_END in hand:
        pre, rest = hand.split(BLOCK_BEGIN, 1)
        return pre + block + rest.split(BLOCK_END, 1)[1]
    return hand.rstrip(NL) + NL + NL + BLOCK_HEAD + NL + block + NL


def csv_text(fields, rows):
    b = io.StringIO(newline="")
    w = csv.DictWriter(b, fields, lineterminator="\n")
    w.writeheader()
    w.writerows(rows)
    return b.getvalue()


def generate():
    nodes = D.read_all()
    claims = sorted((p for (k, _), p in nodes.items() if k == "Claim" and "record_file" not in p), key=lambda p: (p.get("module") is None, p.get("target") or "", p["order"]))
    evid = {n: p for (k, n), p in nodes.items() if k == "Evidence"}
    modules, basis, values = {}, {}, {"global": {}, "other": {}}
    for c in claims:
        if "module" in c:
            e = {"value": c["value"], "entries": c["entries"], "db": c["key"], "note": c["note"]}
            if "status" in c:
                e["status"] = c["status"]
            for link in c.get("evidence", []):
                ev = evid[D.target_of(link, "Evidence")]
                e.update({k: ev[k] for k in ("paper_id", "locator", "quote", "saved_text", "transfer", "source_note") if k in ev})
                basis[c["key"]] = {"source_kind": ev["class"], "species": ev["species"], "age_stage": ev["stage"], "ga_lo_wk": ev["ga_lo_wk"], "ga_hi_wk": ev["ga_hi_wk"], "note": ev["basis_note"]}
            modules.setdefault(c["module"], {})[c["name"]] = {k: e[k] for k in ENTRY_ORDER if k in e}
        else:
            c2 = dict(c)
            if "value_file" in c:
                c2["value"] = json.loads((D.VAULT / c["value_file"]).read_text(encoding="utf-8"))
            values[c["target"]][c["key"]] = {k: c2[k] for k in BODY_ORDER if k in c2}
    links = sorted((p for p in evid.values() if p.get("evidence_kind") == "link"), key=lambda p: p["link_order"])
    link_rows = [{"cid": p["link_cid"], **{k: p[k] for k in LINK_FIELDS if k != "cid"}} for p in links]
    registers = {"paper_register": [], "jepa_references": []}
    for (k, n), p in nodes.items():
        if k == "Source":
            registers[p["register"]].append(p)
    registers["paper_register"].sort(key=lambda p: p["order"])
    texts, parts = R.generate(nodes)
    overrides = {}
    for c in claims:
        if "module" not in c and (c.get("status_override") or c.get("meaning_override")):
            overrides[c["key"]] = {k: c[k + "_override"] for k in ("status", "meaning") if c.get(k + "_override")}
    texts[OVERRIDES] = json.dumps(overrides, indent=1, ensure_ascii=False) + NL
    return modules, values, basis, link_rows, registers, texts, parts


def render(modules, values, link_rows, registers, texts, parts):
    gpart, opart = parts["tools/trusoma/brain/global_config.json"], parts["tools/trusoma/brain/other_config.json"]
    body = json.loads(texts[R.SA + "body_provenance_12p5_required.json"])
    targets = {r["id"]: {"value": r.get("target_12_5"), "unit": r.get("unit"), "status": r.get("status"), "db": r["id"]} for r in body["features"]}
    g = {"schema": gpart["schema"], "modules": modules, "values": values["global"], "body_targets": targets, "growth_web": json.loads(texts[R.SA + "growth_web_12p5.json"])}
    o = {"schema": opart["schema"], "purpose": opart["purpose"], "values": values["other"], "registry": opart["registry"]}
    reg_rows = [p["row"] for p in registers["paper_register"]]
    headers = parts["__headers__"]
    out = {D.CONFIG: json.dumps(g, indent=1) + NL, OTHER: json.dumps(o, indent=1) + NL,
           LINKS: csv_text(headers["links"], link_rows), REGISTER: csv_text(headers["register"], reg_rows)}
    for path, text in texts.items():
        out[D.ROOT / path] = text
    rel = {"version": 1, "lastModified": D.STAMP_MS, "relations": D.merged_relations(D.read_all(), D.existing_relations())}   # foreign (imported) relations and the plugin's publish fields are carried through
    out[D.RELATIONS] = json.dumps(rel, indent=1, sort_keys=True) + NL
    out[worklist.PATH] = worklist.text(D.read_all())
    out[APPENDIX] = with_block(APPENDIX.read_bytes().decode("utf-8") if APPENDIX.exists() else "", appendix_block(D.read_all()))
    return out


def compare_side_records(basis, registers):
    problems = []
    if not BASIS.exists():
        return problems
    live = {r["match"]: r for r in csv.DictReader(open(BASIS, encoding="utf-8", newline="")) if r["match_on"] == "key"}
    for key, b in basis.items():
        if key not in live or any(live[key][f] != b[f] for f in b):
            problems.append("source_basis row differs for " + key)
    return problems


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "check"
    if mode == "write":
        moved = [(kind, name, p) for (kind, name), p in D.read_all().items() if not p.get("dg_name") and p.get("nodeInstanceId") != D.node_id(kind, name)]
        if moved:
            for kind, name, p in moved:
                print("STOPPED: the %s note now named '%s' carries an id that is not the one of that name%s. Its file name is its name: give the file its old name back, then run write again."
                      % (kind, name, (" (its key property says: %s)" % p["key"]) if p.get("key") and p.get("key") != name else ""))
            print("nothing was written")
            return 1
    if mode == "write":   # first: titles and bodies. A note renamed by hand gets its derived title back before anything reads the links to it, so the relations are right in one pass
        fresh = D.refresh_bodies()   # a note edited by hand or in Obsidian gets its readable body rebuilt from its properties
        if fresh:
            print("readable bodies rebuilt:", fresh)
        import passages
        if passages.write():   # the index of passages that stand in several Evidence notes follows the titles
            print("written Repeated passages.md")
    modules, values, basis, link_rows, registers, texts, parts = generate()
    outputs = render(modules, values, link_rows, registers, texts, parts)
    problems = compare_side_records(basis, registers)
    changed = []
    for path, text in outputs.items():
        if not path.exists() or path.read_bytes().decode("utf-8") != text:
            changed.append(path)
            problems.append("generated %s differs from the committed file" % path.name)
    print("learner %d, body values %d, other values %d, link rows %d, register rows %d" % (sum(len(v) for v in modules.values()), len(values["global"]), len(values["other"]), len(link_rows), len(registers["paper_register"])))
    if mode == "write":
        for path in changed:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(outputs[path].encode("utf-8"))
            print("written", path.name)
        return 0
    for p in problems:
        print("DIFFERENCE", p)
    print("G EQUAL" if not problems else "G FAILED")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
