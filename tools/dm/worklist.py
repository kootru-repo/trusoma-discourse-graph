"""The sourcing worklist, generated from the vault's open-value Questions (never edited by hand; build_from_vault.py writes and checks it).
One row per Question that still holds a value up, ranked by how much hangs on it: the values that wait, then what those values feed and the
hypotheses that rest on them. A row shows the next lead and the papers already tried (the sources of the Evidence its values carry)."""
import dmlib as D

PATH = D.ROOT / "companion" / "source_audit" / "WORKLIST.md"
NL = chr(10)


def rows(nodes):
    feeds = {}
    for (kind, name), p in nodes.items():
        if kind == "Claim" and "record_file" not in p and p.get("informs"):
            feeds[name] = [t for t in (D.target_of(l, "Claim") for l in D.links_of(p["informs"])) if ("Claim", t) in nodes]
    rests = {}
    for (kind, name), p in nodes.items():
        if kind == "Hypothesis" and "record_file" not in p:
            for l in D.links_of(p.get("informed_by")):
                rests.setdefault(D.target_of(l, "Claim"), set()).add(name)
    probes = {}   # the probe readings that name a question (a Result's answers): whether the model is sensitive to these values
    for (kind, name), p in nodes.items():
        if kind == "Result" and "record_file" not in p:
            for l in D.links_of(p.get("answers")):
                probes.setdefault(D.target_of(l, "Question"), []).append(p.get("reading"))
    out = []
    for qname, (done, waiting) in D.open_questions(nodes).items():
        if not waiting:
            continue
        q = nodes[("Question", qname)]
        fed = sorted({t for v in waiting for t in feeds.get(v, ())} - set(waiting))
        hyps = sorted({h for v in waiting for h in rests.get(v, ())})
        tried = set()
        for v in waiting:
            for l in D.links_of(nodes[("Claim", v)].get("evidence")):
                e = nodes.get(("Evidence", D.target_of(l, "Evidence"))) or {}
                if e.get("paper_id"):
                    tried.add(e["paper_id"])
        keys = sorted(str(nodes[("Claim", v)].get("key") or v) for v in waiting)
        out.append({"name": qname, "asks": q.get("asks") or q.get("quote") or qname, "waiting": keys, "done": len(done), "fed": len(fed), "hyps": len(hyps),
                    "lead": q.get("lead") or "-", "tried": sorted(tried), "blocker": q.get("quote") or "",
                    "signal": probes.get(qname, []).count("signal"), "quiet": probes.get(qname, []).count("no-signal"), "other": len([x for x in probes.get(qname, []) if x not in ("signal", "no-signal")])})
    # first the questions a probe found the model sensitive to, then by the values that wait, then by what hangs on those values
    out.sort(key=lambda r: (-(1 if r["signal"] else 0), -len(r["waiting"]), -(r["fed"] + r["hyps"]), r["name"]))
    return out


def cell(s):
    return str(s).replace("|", "/").replace(NL, " ")


def text(nodes):
    rs = rows(nodes)
    lines = ["# Sourcing worklist (generated from the vault by tools/dm/worklist.py; do not edit)", "",
             "%d open questions hold up %d values. Questions a probe found the model sensitive to come first, then the number of values that wait, then what those values feed and the hypotheses that rest on them. A probe reading sets search priority only." % (len(rs), sum(len(r["waiting"]) for r in rs)),
             "To change a row, change the Question note (its lead, its values) or source a value; then run `python tools/dm/build_from_vault.py write`.", "",
             "| # | Question | Waiting | Answered | Probe readings (signal / no signal / other) | Feeds | Hypotheses | Next lead | Papers already tried |", "|---|---|---|---|---|---|---|---|---|"]
    for i, r in enumerate(rs, 1):
        lines.append("| %d | %s | %d | %d | %d / %d / %d | %d | %d | %s | %s |" % (i, cell(r["asks"]), len(r["waiting"]), r["done"], r["signal"], r["quiet"], r["other"], r["fed"], r["hyps"], cell(r["lead"]), cell(", ".join(r["tried"]) or "-")))
    lines += ["", "## The values behind each row", ""]
    for i, r in enumerate(rs, 1):
        lines += ["%d. **%s** Blocker: %s" % (i, cell(r["asks"]), cell(r["blocker"])), "   " + ", ".join("`%s`" % k for k in r["waiting"]), ""]
    return NL.join(lines)
