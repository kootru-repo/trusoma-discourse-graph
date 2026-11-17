"""The open questions, written for a reader outside the project (the public extract writes it as OPEN_QUESTIONS.md; it is generated from the vault's
open-value Questions, the claims that address them and the probe readings, and is never edited by hand). Each question links to an issue form on the
public repository where a reader can answer it with a quoted source."""
import urllib.parse
import dmlib as D
import worklist

NL = chr(10)
REPO = "https://github.com/kootru-repo/trusoma-discourse-graph"
FORM = "answer-a-question.yml"


def text(nodes):
    every = worklist.rows(nodes)
    rows = [r for r in every if nodes[("Question", r["name"])].get("outside") is not False]   # a question the project settles by its own probes or measurements is not asked of readers
    claims = {}
    for (kind, name), p in nodes.items():
        if kind == "Finding":
            for l in D.links_of(p.get("addresses")):
                claims.setdefault(D.target_of(l, "Question"), []).append(p)
    out = ["# Open questions", "",
           "TruSoma is a model of the human fetal body and its developing brain at 10 to 17 weeks of gestation. Every value in it is meant to rest on a quoted source. "
           "The %d questions below are where no usable source has been found yet; %d values wait on them." % (len(rows), sum(len(r["waiting"]) for r in rows), ), "",
           "**You can answer one.** Open the form under a question and give a paper and the passage that holds the number. An answer that holds is entered in the graph as a Source and an Evidence note that quote your passage, and the value it sets is marked as sourced.", "",
           "What counts as an answer:", "",
           "- Human fetal data at 10 to 17 weeks comes first, then human preterm or newborn data, then fetal or newborn animal data. Adult data is not used, scaled or direct.",
           "- The paper's title, first author, year, journal and DOI.",
           "- The passage word for word, with its page, table or figure. A measurement of a different quantity is not an answer.", "",
           "This list is generated from the project's vault.%s The questions that the model's own probes found it sensitive to come first." % (" %d more open questions are settled by the project's own measurements and are not listed." % (len(every) - len(rows)) if len(every) > len(rows) else ""), ""]
    for i, r in enumerate(rows, 1):
        url = "%s/issues/new?template=%s&title=%s" % (REPO, FORM, urllib.parse.quote("Answer: " + r["asks"], safe=""))
        out += ["## %d. %s" % (i, r["asks"]), "",
                "- Values that wait (%d): %s" % (len(r["waiting"]), ", ".join("`%s`" % k for k in r["waiting"])),
                "- What is missing: %s" % r["blocker"],
                "- Where we would look next: %s" % r["lead"]]
        for c in sorted(claims.get(r["name"], []), key=lambda c: c["statement"]):
            pro, con = len(D.links_of(c.get("supported_by"))), len(D.links_of(c.get("opposed_by")))
            out.append("- From the model's probes: %s (%d reading%s for, %d against; a reading, not a proof)." % (c["statement"], pro, "" if pro == 1 else "s", con))
        out += ["- [Answer this question with evidence](%s)" % url, ""]
    return NL.join(out)
