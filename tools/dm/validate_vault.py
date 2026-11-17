"""Validate the vault (phases 1 and 2: learner and body Claims, their Evidence, Sources, relations). Exit 1 on any error. Checks: required properties per node type, deterministic
node ids, unique keys, key matches the note name, every wiki-link resolves, evidence required for source-found learner statuses, no adult stage on a bound learner value,
relations.json equals the relations implied by the wiki-links, learner values equal the appendix [V] token when the appendix names the key (missing token: warning),
every link row's species_age is covered by a source_basis rule or key row (warning count; the database build reports the binding ones).
usage: python validate_vault.py"""
import csv, datetime, json, re, sys
import dmlib as D

LATER_ADDED = ("later_record", "verified", "pmid_checked", "dg_name", "question", "opposes", "opposes_basis", "against", "answers", "answers_basis")   # properties added after the import: a later_record remark may not rest on them

REQUIRED = {"Claim": ("kind", "key", "order", "entries"),
            "Evidence": ("paper_id", "locator", "quote", "transfer", "source"),
            "Source": ("paper_id", "register", "row"),
            "Issue": ("record_file", "code", "order", "data"), "Record": ("record_file", "code", "order", "data"),
            "Question": ("record", "quote"), "Hypothesis": ("record", "quote", "prereg"), "Experiment": ("date", "record", "quote"),
            "Result": ("reading", "counted", "record", "quote", "experiment"), "Conclusion": ("record", "quote")}
READINGS = ("signal", "no-signal", "pass", "fail", "observation")
_FILES = {}


def _leaves(v, skip=()):
    if isinstance(v, str):
        yield v
    elif isinstance(v, dict):
        for k, x in v.items():
            if k not in skip:
                yield from _leaves(x)
    elif isinstance(v, list):
        for x in v:
            yield from _leaves(x)


def _strings(nodes):
    """every text held by a vault note, apart from the opposes_basis properties themselves (a basis cannot be its own proof)"""
    if "s" not in _TEXT:
        _TEXT["s"] = [s for p in nodes.values() for s in _leaves(p, ("opposes_basis",))]
    return _TEXT["s"]


_TEXT = {}


def discourse_checks(nodes, errors):
    """the probe record (plan section 18, O2): no value enters here; every note quotes its record file verbatim (so nothing is written from memory); links follow D.EDGE_RULES"""
    errors.extend("growth web " + x for x in D.gweb_relations(nodes)[1])
    for (kind, name), p in nodes.items():
        if p.get("code") == "gweb" and kind != D.GWEB_KIND.get(p.get("group"), "Record"):
            errors.append("%s %s: a growth web %s note must be a %s" % (kind, name, p.get("group"), D.GWEB_KIND.get(p.get("group"), "Record")))
    for (kind, name), p in nodes.items():   # the rules that also hold on record notes (D.ON_RECORDS)
        for rule_kind, prop, rel, other, outgoing in D.EDGE_RULES:
            if kind == rule_kind and (kind, prop) in D.ON_RECORDS and "record_file" in p:
                for l in D.links_of(p.get(prop)):
                    t = D.target_of(l, other)
                    if t is None or (other, t) not in nodes:
                        errors.append("%s %s: %s link %s does not resolve to a %s" % (kind, name, prop, l, other))
        if kind in ("Evidence", "Claim") and (p.get("opposes") or "opposes_basis" in p):
            # an opposition is never written from memory: its basis is a passage found verbatim in one of the two notes it joins, or in a growth web test that lists this
            # value (where the web itself says the sources disagree); and one Evidence cannot both support and oppose a Claim
            basis = p.get("opposes_basis")
            where = [p] + [nodes[("Claim", t)] for t in (D.target_of(l, "Claim") for l in D.links_of(p.get("opposes"))) if ("Claim", t) in nodes]
            if p.get("code") == "gweb":
                where += [q for (k, _), q in nodes.items() if k == "Hypothesis" and q.get("code") == "gweb" and p.get("label") in (q["data"].get("values") or [])]
            opposed = {D.target_of(l, "Claim") for l in D.links_of(p.get("opposes"))}
            where += [q for (k, _), q in nodes.items() if k == "Evidence" and q.get("code") == "gweb" and q["data"].get("record") in opposed]   # the opposed record's own growth web value
            near = [s for q in where for s in _leaves(q, ("opposes_basis",))]
            if not p.get("opposes"):
                errors.append("%s %s: opposes_basis without an opposes link" % (kind, name))
            elif not isinstance(basis, str) or len(basis) < 20 or not any(basis in s for s in near):
                errors.append("%s %s: opposes needs an opposes_basis found verbatim in this note, in the opposed Claim or its growth web value, or in a growth web test that lists this value" % (kind, name))
            if name in [D.target_of(l, "Claim") for l in D.links_of(p.get("opposes"))] and kind == "Claim":
                errors.append("Claim %s: opposes itself" % name)
            own = {D.link("Claim", p["data"]["record"])} if p.get("code") == "gweb" and ("Claim", p["data"].get("record")) in nodes else set()
            both = set(D.links_of(p.get("opposes"))) & (set(D.links_of(p.get("claim"))) | set(D.links_of(p.get("applies_to"))) | own)
            if both:
                errors.append("Evidence %s: both supports and opposes %s" % (name, ", ".join(sorted(both))))
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
            if kind == "Result" and p.get("against"):
                exp = nodes.get(("Experiment", D.target_of(p.get("experiment"), "Experiment"))) or {}
                tested = [D.target_of(l, "Hypothesis") for l in D.links_of(exp.get("hypotheses"))]
                if p.get("reading") not in D.AGAINST or any(D.target_of(l, "Hypothesis") not in tested for l in D.links_of(p["against"])):
                    errors.append("Result %s: against is for a failed or no-signal result and may only name a hypothesis its own experiment tested" % name)
                if any(l in D.links_of(p.get("consistent_with")) for l in D.links_of(p["against"])):
                    errors.append("Result %s: one result cannot be both against and consistent with a hypothesis" % name)
            if kind == "Result" and (p.get("answers") or "answers_basis" in p):   # never from memory: the words that tie this run to the question stand in the result's own record file
                texts = [_FILES.get(rec) or ""]
                for l in D.links_of(p.get("answers")):   # the words may stand in the question's own record file (the plan row that names the run)
                    qrec = (nodes.get(("Question", D.target_of(l, "Question"))) or {}).get("record", "")
                    f = D.ROOT / qrec
                    texts.append(f.read_text(encoding="utf-8") if qrec and f.is_file() else "")
                if not p.get("answers") or not p.get("answers_basis") or not any(p["answers_basis"] in x for x in texts):
                    errors.append("Result %s: answers needs an answers_basis found verbatim in its record file or in the record file of the question" % name)
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
            for l in D.links_of(p[prop]):
                t = D.target_of(l, other)
                if t is None or (other, t) not in nodes:
                    errors.append("%s %s: %s link %s does not resolve to a %s" % (kind, name, prop, l, other))
        if kind == "Result" and isinstance(p.get("experiment"), list):
            errors.append("Result %s: exactly one experiment" % name)
NEEDS_EVIDENCE = ("source-found-fetal", "source-found-transfer")
ADULT = ("adult", "mixed_adult")


def target(link, kind):
    return D.target_of(link, kind)


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
        if p.get("nodeInstanceId") != D.node_id(kind, name) or p.get("recordTypeId" if kind == "Record" else "nodeTypeId") != D.NODE_TYPE[D.disk_kind(kind, p)] or (kind == "Record" and "nodeTypeId" in p):
            errors.append("%s %s: node id or type id is not the deterministic one" % (kind, name))
    for (kind, name), p in nodes.items():   # a later verification of a passage: complete, dated, and only on an Evidence note
        if "verified" in p:
            v = p["verified"]
            if kind != "Evidence" or not isinstance(v, dict) or not all(isinstance(v.get(f), str) and v[f].strip() for f in ("on", "against", "passage")) or not re.fullmatch(r"20[0-9]{2}-[01][0-9]-[0-3][0-9]", v.get("on", "")):
                errors.append("%s %s: verified needs on (YYYY-MM-DD), against (where the passage was read) and passage (its words), on an Evidence note" % (kind, name))
        if "later_record" in p:   # an older remark that a later record overtakes: the remark stays where it is, this says what holds now
            v = p["later_record"]
            ok = isinstance(v, dict) and all(isinstance(v.get(f), str) and v[f].strip() for f in ("on", "remark", "now", "basis")) and len(v["remark"].strip()) >= 12
            try:
                ok = ok and bool(re.fullmatch(r"20[0-9]{2}-[01][0-9]-[0-3][0-9]", v["on"])) and datetime.date.fromisoformat(v["on"]) <= datetime.date.today()
            except (ValueError, TypeError, KeyError):
                ok = False
            older = [x if isinstance(x, str) else json.dumps(x, ensure_ascii=False) for k, x in p.items() if k not in LATER_ADDED]   # one property at a time, and never a property that was itself added after the import
            if not ok or not any(v["remark"] in x for x in older):
                errors.append("%s %s: later_record needs on (a real date written YYYY-MM-DD, not in the future), remark (12 or more characters that stand in one older property of this note), now (what holds since) and basis (the record it rests on)" % (kind, name))
    known = set(D.NODE_TYPE.values()) - {D.NODE_TYPE["Record"]}
    people = D.people_notes()
    for q in people:   # a note a person made with the plugin: accepted as theirs when the plugin can show it (a known node type); nothing of it is read as a value
        if D.read_note(q).get("nodeTypeId") not in known:
            errors.append("%s: a note without dg_type must carry a nodeTypeId of the vault's schema (a note made with the plugin does); this one does not" % q.name)
    outside = []   # a node made with the plugin before its folder setting was in place lies outside the folders the tools read: say so
    for q in sorted(D.VAULT.rglob("*.md")):
        part = q.relative_to(D.VAULT).parts
        if part[0] in (".obsidian", ".trash", "DiscourseGraph", "Tables", "Meta", "import"):   # "import" is where the plugin keeps notes imported from another space
            continue
        head = q.read_text(encoding="utf-8", errors="replace")[:400]
        if head.startswith("---") and "nodeTypeId:" in head.split(chr(10) + "---")[0]:
            outside.append("/".join(part))
    if outside:
        print("notes made with the plugin outside vault/DiscourseGraph (not read by the tools; move them into DiscourseGraph): %d: %s" % (len(outside), "; ".join(outside[:5])))
    if D.plain_notes():
        print("plain notes in the vault folders (not nodes: never read, never rewritten): %d: %s" % (len(D.plain_notes()), "; ".join(sorted(str(getattr(x, "name", x)) for x in D.plain_notes())[:8])))
    if people:
        print("notes made by a person in Obsidian (kept as theirs, never read as a value, never rewritten): %d" % len(people))
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
    bad = D.title_problems() + D.body_problems()
    errors.extend(bad[:5] + (["... and %d more notes with a body that is not the derived text" % (len(bad) - 5)] if len(bad) > 5 else []))
    rel = json.load(open(D.RELATIONS, encoding="utf-8"))["relations"]
    expected = D.expected_relations(nodes) if not errors else {}
    if errors:
        pass
    else:
        ours, foreign, stale = D.split_relations(rel, nodes)   # relations imported from another space are not ours to imply or refuse
        if stale:
            errors.append("relations.json holds %d relation(s) with an end that is no note of this vault and no imported note (regenerate to drop them)" % len(stale))
        if {k: D.relation_core(v) for k, v in ours.items()} != {k: D.relation_core(v) for k, v in expected.items()} or any("lastModified" not in v for v in ours.values()):   # lastModified is the plugin's to change once a relation is published
            errors.append("relations.json differs from the relations implied by the wiki-links (%d vs %d)" % (len(ours), len(expected)))
        if foreign:
            print("foreign relations kept (imported from another space, or drawn in Obsidian to or from a person's or an imported note): %d" % len(foreign))
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
