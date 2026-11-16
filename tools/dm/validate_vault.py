"""Validate the vault (phases 1 and 2: learner and body Claims, their Evidence, Sources, relations). Exit 1 on any error. Checks: required properties per node type, deterministic
node ids, unique keys, key matches the note name, every wiki-link resolves, evidence required for source-found learner statuses, no adult stage on a bound learner value,
relations.json equals the relations implied by the wiki-links, learner values equal the appendix [V] token when the appendix names the key (missing token: warning),
every link row's species_age is covered by a source_basis rule or key row (warning count; the database build reports the binding ones).
usage: python validate_vault.py"""
import csv, json, re, sys
import dmlib as D

REQUIRED = {"Claim": ("kind", "key", "order", "entries"),
            "Evidence": ("paper_id", "locator", "quote", "transfer", "source"),
            "Source": ("paper_id", "register", "row"),
            "Issue": ("record_file", "code", "order", "data"), "Record": ("record_file", "code", "order", "data"),
            "Question": ("record", "quote"), "Hypothesis": ("record", "quote", "prereg"), "Experiment": ("date", "record", "quote"),
            "Result": ("reading", "counted", "record", "quote", "experiment"), "Conclusion": ("record", "quote")}
READINGS = ("signal", "no-signal", "pass", "fail", "observation")
_FILES = {}


def discourse_checks(nodes, errors):
    """the probe record (plan section 18, O2): no value enters here; every note quotes its record file verbatim (so nothing is written from memory); links follow D.EDGE_RULES"""
    errors.extend("growth web " + x for x in D.gweb_relations(nodes)[1])
    for (kind, name), p in nodes.items():
        if p.get("code") == "gweb" and kind != D.GWEB_KIND.get(p.get("group"), "Record"):
            errors.append("%s %s: a growth web %s note must be a %s" % (kind, name, p.get("group"), D.GWEB_KIND.get(p.get("group"), "Record")))
    for (kind, name), p in nodes.items():
        if "record_file" in p:
            continue
        if kind in D.DISCOURSE or kind == "Conclusion":
            if "value" in p or "value_file" in p:
                errors.append("%s %s: a discourse note may not carry a value" % (kind, name))
            rec = p.get("record", "")
            if rec not in _FILES:
                f = D.ROOT / rec
                _FILES[rec] = f.read_text(encoding="utf-8") if rec and f.is_file() else None
            if _FILES[rec] is None:
                errors.append("%s %s: record file %r does not exist" % (kind, name, rec))
            elif not p.get("quote") or p["quote"] not in _FILES[rec]:
                errors.append("%s %s: its quote is not found verbatim in %s" % (kind, name, rec))
            if kind == "Result" and p.get("reading") not in READINGS:
                errors.append("Result %s: reading %r is not one of %s" % (name, p.get("reading"), READINGS))
            if kind == "Result" and not isinstance(p.get("counted"), bool):
                errors.append("Result %s: counted must be true or false" % name)
            if "text" in p:
                errors.append("%s %s: no text property (the quote is the text)" % (kind, name))
            if kind == "Experiment" and not re.fullmatch(r"20[0-9]{2}-[01][0-9]-[0-3][0-9]", str(p.get("date"))):
                errors.append("Experiment %s: date must be YYYY-MM-DD" % name)
            if kind == "Hypothesis" and not isinstance(p.get("prereg"), bool):
                errors.append("Hypothesis %s: prereg must be true or false" % name)
        for rule_kind, prop, rel, other, outgoing in D.EDGE_RULES:
            if kind != rule_kind or prop not in p:
                continue
            for l in ([] if "record_file" in p else D.links_of(p[prop])):
                t = D.target_of(l, other)
                if t is None or (other, t) not in nodes:
                    errors.append("%s %s: %s link %s does not resolve to a %s" % (kind, name, prop, l, other))
        if kind == "Result" and isinstance(p.get("experiment"), list):
            errors.append("Result %s: exactly one experiment" % name)
NEEDS_EVIDENCE = ("source-found-fetal", "source-found-transfer")
ADULT = ("adult", "mixed_adult")


def target(link, kind):
    m = re.fullmatch(r"\[\[%s(.*)\]\]" % re.escape(D.PREFIX[kind]), link or "")
    return m.group(1) if m else None


def extra_checks(nodes, errors):
    """rules added after the adversarial tests of 2026-11-15 (plan section 17)"""
    import records as R
    spec_path = {s["code"]: s["path"] for s in R.SPECS}
    spec_path.update({"links": R.SA + "paper_links.csv", "register": R.SA + "paper_register.csv"})
    groups = {}
    shapes = {}
    covered = set()
    for (kind, name), p in nodes.items():
        if kind == "Evidence" and p.get("evidence_kind") == "link":
            if "claim" in p:
                covered.add(D.target_of(p["claim"], "Claim"))
            covered.update(D.target_of(l, "Claim") for l in p.get("applies_to", []))
            groups.setdefault(("link evidence", "link_order"), []).append((p["link_order"], name))
    for (kind, name), p in nodes.items():
        if "record_file" in p:
            if spec_path.get(p["code"]) != p["record_file"]:
                errors.append("%s %s: record_file %s is not the file of code %s" % (kind, name, p["record_file"], p["code"]))
            groups.setdefault(("table " + p["code"], "order"), []).append((p["order"], name))
            if kind == "Claim" and p["code"] == "records":
                d = p.get("data", {})
                if p.get("kind") != d.get("kind", "record"):
                    errors.append("Claim %s: kind %r disagrees with the record (%r)" % (name, p.get("kind"), d.get("kind", "record")))
                want = D.link("Source", d["paper_id"]) if d.get("paper_id") else None
                if p.get("source") != want:
                    errors.append("Claim %s: source link %r disagrees with the record's paper_id %r" % (name, p.get("source"), d.get("paper_id")))
            if p["code"] == "basis" and isinstance(p["data"], dict) and "derived_from" in p["data"]:
                d = p["data"]
                if ("Evidence", d["derived_from"]) not in nodes or d.get("match_on") != "key" or d["derived_from"] != d.get("match", "") + " 1":
                    errors.append("Record %s: a derived basis row must be a key row whose derived_from is its Evidence note" % name)
            if "group" in p:
                shapes.setdefault((p["code"], p["group"]), set()).add(p["shape"])
        elif kind == "Claim":
            if "value" not in p and "value_file" not in p:
                errors.append("Claim %s: neither value nor value_file" % name)
            if "value_file" in p and not (D.VAULT / p["value_file"]).exists():
                errors.append("Claim %s: value_file %s does not exist" % (name, p["value_file"]))
            if p.get("kind") != "value":
                errors.append("Claim %s: kind must be value" % name)
            groups.setdefault(("claim " + ("learner" if "module" in p else p.get("target", "?")), "order"), []).append((p["order"], name))
            if "module" not in p and str(p.get("status", "")).startswith("source-found") and name not in covered:
                errors.append("Claim %s: status %s but no Evidence (link row) covers it" % (name, p["status"]))
        elif kind == "Source" and p.get("register") == "paper_register":
            groups.setdefault(("register", "order"), []).append((p["order"], name))
    for g, s in shapes.items():
        if len(s) != 1:
            errors.append("table %s group %s: members disagree on their shape %s" % (g[0], g[1], sorted(s)))
    for (g, field), items in groups.items():
        seen = {}
        for o, n in items:
            if o in seen:
                errors.append("%s: %s %s is used by both %s and %s" % (g, field, o, seen[o], n))
            seen[o] = n
    jhead = next(p["data"]["header"] for p in nodes.values() if p.get("code") == "jepa" and p["order"] == -1)
    jepa = {}
    for p in nodes.values():
        if p.get("code") == "jepa" and p["order"] >= 0:
            d = p["data"] if isinstance(p["data"], dict) else dict(zip(jhead, p["data"]))   # ragged rows are stored as lists
            jepa[d.get("paper_id")] = d
    for (kind, name), p in nodes.items():
        if kind == "Source" and p.get("register") == "jepa_references":
            rec = jepa.get(name)
            if rec is None or any(rec.get(f) != v for f, v in p["row"].items()):
                errors.append("Source %s: its row differs from the JEPA references table" % name)


def main():
    nodes = D.read_all()
    errors, warnings = [], []
    keys = set()
    for (kind, name), p in nodes.items():
        for f in (REQUIRED[kind] if "record_file" not in p else ("record_file", "code", "order", "data")):
            if f not in p:
                errors.append("%s %s: missing %s" % (kind, name, f))
        if p.get("nodeInstanceId") != D.node_id(kind, name) or p.get("nodeTypeId") != D.NODE_TYPE[kind]:
            errors.append("%s %s: node id or type id is not the deterministic one" % (kind, name))
    orphans = 0
    for (kind, name), p in nodes.items():
        if "record_file" in p:   # phase 3 notes: Issues, method and join Claims, Records (one row of an authored table each)
            if kind == "Claim" and p["code"] == "records" and "fmt" not in p:
                errors.append("%s %s: record Claim without fmt" % (kind, name))
            if kind == "Claim" and p.get("source") and ("Source", target(p["source"], "Source")) not in nodes:
                errors.append("Claim %s: source link does not resolve" % name)
            continue
        if kind == "Claim":
            learner = "module" in p
            if D.safe(p["key"]) != name:
                errors.append("Claim %s: key and note name disagree" % name)
            if learner and (p["key"] != p["module"] + "." + p["name"]):
                errors.append("Claim %s: key, module and name disagree" % name)
            if not learner and ("db" not in p or "text" not in p or "state" not in p):
                errors.append("Claim %s: body claim without db, text or state" % name)
            if not learner and p.get("target") not in ("global", "other"):
                errors.append("Claim %s: neither a module nor a global or other target" % name)
            if p["key"] in keys:
                errors.append("duplicate key " + p["key"])
            keys.add(p["key"])
            links = p.get("evidence", [])
            if learner and p.get("status") in NEEDS_EVIDENCE and not links:
                errors.append("Claim %s: status %s needs Evidence" % (name, p["status"]))
            if learner and "status" not in p:
                warnings.append("Claim %s: no status recorded" % name)
            for l in links:
                t = target(l, "Evidence")
                if ("Evidence", t) not in nodes:
                    errors.append("Claim %s: link %s does not resolve" % (name, l))
                elif target(nodes[("Evidence", t)].get("claim"), "Claim") != name:
                    errors.append("Claim %s: evidence %s points at another claim" % (name, t))
        elif kind == "Evidence":
            link_kind = p.get("evidence_kind") == "link"
            if "claim" in p:
                if ("Claim", target(p["claim"], "Claim")) not in nodes:
                    errors.append("Evidence %s: claim link does not resolve" % name)
            elif link_kind:
                orphans += 1
            else:
                errors.append("Evidence %s: no claim" % name)
            for l in p.get("applies_to", []):
                if ("Claim", target(l, "Claim")) not in nodes:
                    errors.append("Evidence %s: applies_to link %s does not resolve" % (name, l))
            if ("Source", target(p["source"], "Source")) not in nodes:
                errors.append("Evidence %s: source link does not resolve" % name)
            elif target(p["source"], "Source") != p["paper_id"]:
                errors.append("Evidence %s: source link and paper_id disagree" % name)
            if not link_kind:
                for f in ("class", "species", "stage", "ga_lo_wk", "ga_hi_wk", "basis_note"):
                    if f not in p:
                        errors.append("Evidence %s: missing %s" % (name, f))
                if not p["quote"] or not p["locator"]:
                    errors.append("Evidence %s: empty quote or locator" % name)
                if p.get("stage") in ADULT:
                    errors.append("Evidence %s: adult stage on a bound value" % name)
            elif "link_cid" not in p or "link_order" not in p:
                errors.append("Evidence %s: link row without link_cid or link_order" % name)
        elif kind == "Source":
            if p["row"].get("paper_id") != name or p["paper_id"] != name:
                errors.append("Source %s: paper_id disagrees" % name)
            if p["register"] == "paper_register" and "order" not in p:
                errors.append("Source %s: register row without order" % name)
    extra_checks(nodes, errors)
    discourse_checks(nodes, errors)
    rel = json.load(open(D.RELATIONS, encoding="utf-8"))["relations"]
    expected = D.expected_relations(nodes) if not errors else {}
    if errors:
        pass
    elif rel != expected:
        errors.append("relations.json differs from the relations implied by the wiki-links (%d vs %d)" % (len(rel), len(expected)))
    app = open(D.ROOT / "companion/CF2_CONSTANTS_APPENDIX.md", encoding="utf-8").read()
    missing = 0
    for (kind, name), p in nodes.items():
        if kind != "Claim" or "module" not in p:
            continue
        m = re.search(r"(?<![A-Za-z0-9_])%s (-?[0-9][0-9.eE+-]*)" % re.escape(p["name"]), app)
        if not m:
            missing += 1
            continue
        try:
            if abs(float(m.group(1).rstrip(".;,")) - float(p["value"])) > 1e-9 * max(1.0, abs(float(p["value"]))):
                errors.append("Claim %s: value %s, appendix %s" % (name, p["value"], m.group(1)))
        except (ValueError, TypeError):
            warnings.append("Claim %s: appendix token not comparable (%s)" % (name, m.group(1)))
    if missing:
        warnings.append("%d learner claims have no appendix [V] token for their name" % missing)
    if orphans:
        warnings.append("%d link rows name a constant that is no longer in any configuration (kept as Evidence without a claim)" % orphans)
    rules = {r["match"] for r in csv.DictReader(open(D.ROOT / "companion/source_audit/source_basis.csv", encoding="utf-8", newline="")) if r["match_on"] == "species_age"}
    uncovered = {p["species_age"] for (k, _), p in nodes.items() if k == "Evidence" and p.get("evidence_kind") == "link" and p["species_age"] not in rules}
    if uncovered:
        warnings.append("%d link species_age texts have no species_age rule (covered by key rows or unbound)" % len(uncovered))
    import hashlib
    frozen = D.VAULT / "Meta" / "Frozen.md"
    if frozen.exists():
        want = re.search(r"sha256: ([0-9a-f]{64})", frozen.read_text(encoding="utf-8")).group(1)
        got = hashlib.sha256((D.ROOT / "companion/source_audit/constant_sources.jsonl").read_bytes()).hexdigest()
        if want != got:
            errors.append("constant_sources.jsonl changed after the freeze (vault/Meta/Frozen.md): the log is history, record changes in the vault")
    c = lambda k: sum(1 for x in nodes if x[0] == k)
    print("nodes %d (claims %d, evidence %d, sources %d), relations %d" % (len(nodes), c("Claim"), c("Evidence"), c("Source"), len(rel)))
    for w in warnings:
        print("WARNING", w)
    for e in errors[:40]:
        print("ERROR", e)
    print("VALID" if not errors else "INVALID (%d errors)" % len(errors))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
