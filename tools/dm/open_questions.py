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
    hidden = len(every) - len(rows)
    out = ["# Open questions", "",
           "TruSoma is a model of the human fetal body and its developing brain at 10 to 17 weeks of gestation. Each value in the model should rest on a quoted source. "
           "For the %d questions below we have not found one, and %d values wait on them." % (len(rows), sum(len(r["waiting"]) for r in rows)), "",
           "To answer a question, open the form under it and give the paper and the passage that holds the number. We then read the paper. If the passage holds, we enter it in the graph as a Source note and an Evidence note with your quote, and we mark the value as sourced.", "",
           "An answer needs:", "",
           "- the paper's title, first author, year, journal and DOI",
           "- the passage word for word, with its page, table or figure",
           "- subjects of a suitable age. Human fetal data at 10 to 17 weeks comes first, then human preterm or newborn data, then fetal or newborn animal data. We do not use adult data.", "",
           "A measurement of a different quantity does not count as an answer.", "",
           "This list is generated from the project's vault. Questions that the model's probes found it sensitive to come first."
           + (" %d more open questions can only be settled by the project's own measurements and are left out." % hidden if hidden else ""), ""]
    for i, r in enumerate(rows, 1):
        url = "%s/issues/new?template=%s&title=%s" % (REPO, FORM, urllib.parse.quote("Answer: " + r["asks"], safe=""))
        out += ["## %d. %s" % (i, r["asks"]), "",
                "- Values that wait (%d): %s" % (len(r["waiting"]), ", ".join("`%s`" % k for k in r["waiting"])),
                "- What is missing: %s" % r["blocker"],
                "- Where we would look next: %s" % r["lead"]]
        for c in sorted(claims.get(r["name"], []), key=lambda c: c["statement"]):
            pro, con = len(D.links_of(c.get("supported_by"))), len(D.links_of(c.get("opposed_by")))
            out.append("- Probe readings on the claim \"%s\": %d for, %d against." % (c["statement"], pro, con))
        out += ["- [Answer this question with evidence](%s)" % url, ""]
    return NL.join(out)
