"""The value tool after the vault cutover (phase 4 of companion/DM_CONVERSION_PLAN_2026-11-15.md). It writes vault notes, rebuilds relations.json and regenerates every
generated file (build_from_vault write), then runs the check. It never touches a generated file directly and never writes the frozen constant log.
  value     a new body or other value: Claim (+ Evidence link row when --paper is given), --target global|other
  learner   a new learner value: Claim in a module + Evidence with the basis fields
  set       change fields of an existing Claim (--value JSON, --status, --meaning, --state, --entries a,b)
  evidence  add a paper link row to an existing Claim
  paper     add a row to the paper register
  basis     add a species_age classifier rule (source_basis.csv row)
  record    append a record to sourcing_records.jsonl (--json '{...}')
After a value is bound, paste by hand (plan section 3c): the appendix [V] line and the {cid: ...} tag in the consumer; this tool prints both templates.
Rules enforced: a source-found status needs --paper, --locator, --quote (and the paper must exist); no key twice; the status must be a known one.
usage: python value_add.py <command> --key K [options]; python value_add.py <command> --help"""
import argparse, json, sys
import dmlib as D
import build_from_vault as B
import validate_vault as V

STATUSES = ("source-found-fetal", "source-found-transfer", "model-choice", "unresearched", "cannot-source", "design-cited", "adult-sourced-unusable")
LINK_FIELDS = ("locator", "quote", "value_in_source", "species_age", "transfer")


def LOG_CIDS():
    """constant IDs of the frozen log: for these a changed status or meaning is also written as an override, because the database build reads the log first"""
    if "cids" not in _LOG:
        _LOG["cids"] = {json.loads(l)["cid"] for l in open(D.ROOT / "companion/source_audit/constant_sources.jsonl", encoding="utf-8")}
    return _LOG["cids"]


_LOG = {}


def nodes():
    return D.read_all()


def next_order(code_filter, field="order"):
    return 1 + max([p[field] for p in nodes().values() if code_filter(p)] or [-1])


def link_args(a):
    return {"status": a.link_status or a.status, "paper_id": a.paper, "locator": a.locator or "", "locator_basis": a.locator_basis, "quote": a.quote or "",
            "value_in_source": a.value_in_source or "", "species_age": a.species_age or "", "transfer": a.transfer or ""}


def add_link(claim_key, cid, args):
    n = nodes()
    if ("Source", args["paper_id"]) not in n:
        sys.exit("paper %s is not in the register: add it first with the paper command" % args["paper_id"])
    count = 1 + sum(1 for (k, nm) in n if k == "Evidence" and nm.startswith(D.safe(cid) + " ") and nm[len(D.safe(cid)) + 1:].isdigit())
    name = "%s %d" % (D.safe(cid), count)
    ev = {"evidence_kind": "link", "link_cid": cid, "link_order": next_order(lambda p: p.get("evidence_kind") == "link", "link_order")}
    ev.update(args)
    ev["source"] = D.link("Source", args["paper_id"])
    ev["claim"] = D.link("Claim", D.safe(claim_key))
    D.write_note_kind("Evidence", name, ev)
    claim = dict(n[("Claim", D.safe(claim_key))])
    claim["evidence"] = claim.get("evidence", []) + [D.link("Evidence", name)]
    D.write_note_kind("Claim", D.safe(claim_key), claim)


def finish(printed):
    D.write_relations()
    saved = sys.argv
    sys.argv = [saved[0], "write"]
    B.main()
    for line in printed:
        print(line)
    sys.argv = [saved[0], "check"]
    return 1 if (B.main() or V.main()) else 0


def cmd_value(a):
    n = nodes()
    if ("Claim", D.safe(a.key)) in n:
        sys.exit("key exists: " + a.key)
    if a.status not in STATUSES:
        sys.exit("status must be one of: " + ", ".join(STATUSES))
    if a.status.startswith("source-found") and not (a.paper and a.locator and a.quote):
        sys.exit("a source-found status needs --paper, --locator and --quote")
    value = json.loads(a.value)
    props = {"kind": "value", "key": a.key, "target": a.target, "order": next_order(lambda p: p.get("target") == a.target and "record_file" not in p),
             "value": value, "text": str(value), "entries": a.entries.split(","), "db": a.db or a.key, "state": a.state, "status": a.status}
    if a.meaning:
        props["meaning"] = a.meaning
    if len(json.dumps(value)) > D.BIG_VALUE_BYTES:
        rel = "Data/%s.json" % D.safe(a.key)
        (D.VAULT / "Data").mkdir(exist_ok=True)
        (D.VAULT / rel).write_text(json.dumps(value, ensure_ascii=False) + chr(10), encoding="utf-8", newline=chr(10))
        del props["value"]
        props["value_file"] = rel
    D.write_note_kind("Claim", D.safe(a.key), props)
    if a.paper:
        add_link(a.key, props["db"], link_args(a))
    return ["appendix line to paste (CF2_CONSTANTS_APPENDIX.md): %s %s [V] ... (source, year)" % (a.key, a.value), "code tag to put on the consumer line: {cid: %s}" % props["db"]]


def cmd_learner(a):
    n = nodes()
    key = a.module + "." + a.name
    if ("Claim", key) in n:
        sys.exit("key exists: " + key)
    if not (a.paper and a.locator and a.quote and a.cls and a.species and a.stage):
        sys.exit("a learner value needs --paper --locator --quote --class --species --stage")
    if a.stage in V.ADULT:
        sys.exit("adult stage: never a bound value (USER 2026-11-06)")
    if ("Source", a.paper) not in n:
        sys.exit("paper %s is not in the register: add it first" % a.paper)
    props = {"kind": "value", "key": key, "module": a.module, "name": a.name, "order": next_order(lambda p: "module" in p), "value": json.loads(a.value), "entries": a.entries.split(","), "note": a.note, "status": a.status,
             "evidence": [D.link("Evidence", key + " 1")]}
    ev = {"claim": D.link("Claim", key), "source": D.link("Source", a.paper), "paper_id": a.paper, "locator": a.locator, "quote": a.quote, "transfer": a.transfer or "",
          "class": a.cls, "species": a.species, "stage": a.stage, "ga_lo_wk": a.ga_lo or "", "ga_hi_wk": a.ga_hi or "", "basis_note": a.basis_note or ""}
    D.write_note_kind("Evidence", key + " 1", ev)
    D.write_note_kind("Claim", key, props)
    import records as R
    order = next_order(lambda p: p.get("code") == "basis")
    D.write_note_kind("Record", "basis %05d" % order, {"record_file": R.SPECS[2]["path"], "code": "basis", "order": order, "data": {"match_on": "key", "match": key, "derived_from": key + " 1"}})
    return ["the source_basis key row is derived from the Evidence note (--cls, --species, --stage, --ga-lo, --ga-hi, --basis-note)",
            "appendix line to paste: %s %s [V] ... (source, year)" % (a.name, a.value), "code tag: {cid: %s}" % a.entries.split(",")[0]]


def cmd_set(a):
    n = nodes()
    p = n.get(("Claim", D.safe(a.key)))
    if not p or "record_file" in p:
        sys.exit("no such value: " + a.key)
    p = dict(p)
    if a.value is not None:
        p["value"] = json.loads(a.value)
        if "text" in p:
            p["text"] = str(p["value"])
    if a.status:
        if a.status not in STATUSES:
            sys.exit("status must be one of: " + ", ".join(STATUSES))
        if a.status.startswith("source-found") and not p.get("evidence") and "module" not in p:
            sys.exit("a source-found status needs evidence: add it with the evidence command first")
        p["status"] = a.status
        if p.get("db") in LOG_CIDS():
            p["status_override"] = a.status
    in_log = p.get("db") in LOG_CIDS()
    if a.meaning:
        p["meaning"] = a.meaning
        if in_log:
            p["meaning_override"] = a.meaning
    if a.state:
        p["state"] = a.state
    if a.entries:
        p["entries"] = a.entries.split(",")
    D.write_note_kind("Claim", D.safe(a.key), p)
    if a.value is not None:   # what to look at again, from the vault's relations and the code that reads the value
        import impact
        print(chr(10).join(["IMPACT of the change:"] + ["  " + l for l in impact.report(a.key)]))
    return ["changed %s; if the value changed, the appendix [V] line and the consumer's tag must agree (the check compares learner values with the appendix)" % a.key]


def cmd_evidence(a):
    n = nodes()
    p = n.get(("Claim", D.safe(a.key)))
    if not p or "record_file" in p or "module" in p:
        sys.exit("body or other value expected: " + a.key)
    if not (a.paper and a.locator and a.quote):
        sys.exit("evidence needs --paper, --locator and --quote")
    add_link(a.key, p["db"], link_args(a))
    return ["link row added for " + p["db"]]


def cmd_paper(a):
    n = nodes()
    if ("Source", a.id) in n:
        sys.exit("paper exists: " + a.id)
    row = {"paper_id": a.id, "first_author": a.first_author, "year": a.year, "citation": a.citation, "doi": a.doi or "", "pmid": a.pmid or "", "pmcid": a.pmcid or "", "url": a.url or "",
           "local_file": a.local_file or "", "n_constants": a.n_constants}
    order = next_order(lambda p: p.get("register") == "paper_register")
    D.write_note_kind("Source", a.id, {"paper_id": a.id, "register": "paper_register", "order": order, "row": row})
    return ["paper added to the register: " + a.id + " (check the five fields against Crossref with tools/skills/check_citation.py)"]


def cmd_basis(a):
    import records as R
    row = {"match_on": "species_age", "match": a.species_age, "source_kind": a.kind, "ga_lo_wk": a.lo or "", "ga_hi_wk": a.hi or "", "note": a.note or "", "species": a.species or "", "age_stage": a.stage or ""}
    order = next_order(lambda p: p.get("code") == "basis")
    D.write_note_kind("Record", "basis %05d" % order, {"record_file": R.SPECS[2]["path"], "code": "basis", "order": order, "data": row})
    return ["basis rule added"]


def cmd_record(a):
    import records as R
    obj = json.loads(a.json)
    order = next_order(lambda p: p.get("code") == "records")
    name = D.safe(obj["id"]) if obj.get("id") else "records %05d" % order
    props = {"record_file": R.SPECS[1]["path"], "code": "records", "order": order, "fmt": "compact", "data": obj, "kind": obj.get("kind", "record"), "source": D.link("Source", obj["paper_id"]) if obj.get("paper_id") else None}
    if props["source"] and ("Source", obj["paper_id"]) not in nodes():
        sys.exit("paper %s is not in the register: add it first" % obj["paper_id"])
    D.write_note_kind("Claim", name, props)
    return ["record added: " + name]


def cmd_discourse(a):
    """a Question, Hypothesis, Experiment or Result note: --record FILE --quote TEXT (verbatim from the file) and --prop name=JSON for the rest
    (prereg, date, reading, counted, question, hypotheses, experiment, supports, opposes, consistent_with, informed_by, issues, commit)"""
    props = {"record": a.record, "quote": a.quote}
    for kv in a.prop or []:
        k, _, v = kv.partition("=")
        props[k] = json.loads(v)
    D.write_note_kind(a.kind, a.name, props)
    return ["%s note written: %s" % (a.kind, D.title(a.kind, a.name))]


def parser():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    def add(cmd, fn, **flags):
        sp = sub.add_parser(cmd)
        sp.set_defaults(fn=fn)
        for f, kw in flags.items():
            sp.add_argument("--" + f.replace("_", "-"), dest=f, **kw)
        return sp
    ev = dict(paper={}, locator={}, quote={}, value_in_source={}, species_age={}, transfer={}, link_status={}, locator_basis=dict(default="quote"))
    add("value", cmd_value, key=dict(required=True), target=dict(required=True, choices=["global", "other"]), value=dict(required=True), entries=dict(required=True), state=dict(required=True),
        status=dict(required=True), meaning={}, db={}, **ev)
    add("learner", cmd_learner, module=dict(required=True), name=dict(required=True), value=dict(required=True), entries=dict(required=True), note=dict(required=True), status=dict(required=True),
        paper={}, locator={}, quote={}, transfer={}, cls=dict(), species={}, stage={}, ga_lo={}, ga_hi={}, basis_note={})
    add("set", cmd_set, key=dict(required=True), value={}, status={}, meaning={}, state={}, entries={})
    add("evidence", cmd_evidence, key=dict(required=True), status={}, **ev)
    add("paper", cmd_paper, id=dict(required=True), first_author=dict(required=True), year=dict(required=True), citation=dict(required=True), doi={}, pmid={}, pmcid={}, url={}, local_file={}, n_constants=dict(default="0"))
    add("basis", cmd_basis, species_age=dict(required=True), kind=dict(required=True), lo={}, hi={}, note={}, species={}, stage={})
    add("record", cmd_record, json=dict(required=True))
    add("discourse", cmd_discourse, kind=dict(required=True, choices=list(D.DISCOURSE) + ["Finding"]), name=dict(required=True), record=dict(required=True), quote=dict(required=True), prop=dict(action="append"))
    return ap


def main():
    a = parser().parse_args()
    printed = a.fn(a)
    return finish(printed)


if __name__ == "__main__":
    sys.exit(main())
