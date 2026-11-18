"""The readable body of a vault note: plain sentences DERIVED from the note's own properties, so a person (in Obsidian, or a collaborator who imports the node) can read what
the note says without opening the frontmatter. Nothing here is authored: the body is rebuilt on every write, the check refuses a body that differs from this derivation, and no
tool reads a body back. A value that has no `meaning` property gets no invented description: its key, value and status are stated as they are."""
import json, re

NL = chr(10)
UNSOURCED = {
    "model-choice": "a model choice, not a sourced value",
    "unresearched": "not researched yet, not a sourced value",
    "cannot-source": "no source could be found, not a sourced value",
    "adult-sourced-unusable": "only an adult source exists, which this project does not accept, so not a sourced value",
}
PARAMETER_KIND = {"model-choice": "a model choice", "unresearched": "not researched yet", "cannot-source": "no source could be found",
                  "adult-sourced-unusable": "only an adult source exists", "design-cited": "cites the design only"}
SOURCED = {
    "source-found-fetal": "sourced from fetal data",
    "source-found-transfer": "sourced by a declared transfer from another species, age or system",
}


def short(v, n=300):
    s = v if isinstance(v, str) else json.dumps(v, ensure_ascii=False)
    s = " ".join(s.split())
    return s if len(s) <= n else s[:n] + " ..."


def status_words(status):
    if not status:
        return None
    gloss = UNSOURCED.get(status) or SOURCED.get(status)
    return "Status: %s%s." % (status, " (%s)" % gloss if gloss else "")


def links(v):
    if not v:
        return ""
    return ", ".join(v) if isinstance(v, list) else str(v)


def sentence(s):
    s = " ".join(str(s).split())
    return s if s.endswith((".", "?", "!")) else s + "."


def quoted(q):
    return '"%s"' % " ".join(str(q).split())


def opposition(p):
    """the lines of an Evidence note that opposes a Claim, with the passage of the vault that states the conflict"""
    if not p.get("opposes"):
        return []
    return ["Opposes: %s." % links(p["opposes"])] + (["The conflict as the vault states it: %s" % quoted(p["opposes_basis"])] if p.get("opposes_basis") else [])


def lines_for(kind, name, p):
    d = p.get("data") if isinstance(p.get("data"), dict) else {}
    out = []
    if kind == "Claim" and p.get("code") == "gweb":   # a growth web mechanism
        out.append(sentence("%s acts on %s (%s): %s" % (d.get("source"), d.get("target"), d.get("sign"), d.get("mechanism"))))
        out.append("Growth web mechanism `%s`; evidence class: %s; phase: %s." % (d.get("id"), d.get("evidence"), d.get("phase")))
        if d.get("note"):
            out.append(sentence(d["note"]))
        if d.get("equation_gap"):
            out.append(sentence("Open: " + d["equation_gap"]))
    elif kind == "Claim" and "record_file" in p:   # a method, value or join record
        out.append(sentence(d.get("method") or d.get("quantity") or name))
        out.append("%s record `%s`%s." % (str(p.get("kind") or d.get("kind") or "record").capitalize(), d.get("id") or name, ", part: %s" % d["part"] if d.get("part") else ""))
        if "value" in d:
            out.append("Value: %s%s." % (short(d["value"]), " (%s)" % short(d["unit"], 400) if d.get("unit") else ""))
        for label, key in (("Where in the source", "locator"), ("Species and age", "species"), ("Limit", "limit"), ("State", "state")):
            if d.get(key):
                out.append(sentence("%s: %s" % (label, short(d[key], 500))))
        if p.get("source"):
            out.append("Source: %s." % p["source"])
        out += opposition(p)
    elif kind == "Claim":   # a configuration value (body, other, or learner)
        key = p.get("key") or name
        if p.get("meaning"):
            out.append(sentence(str(p["meaning"])[:1].upper() + str(p["meaning"])[1:]))
        if p.get("value_file"):
            out.append("`%s` is a large table kept in `%s`." % (key, p["value_file"]))
        else:
            out.append("`%s` = %s." % (key, short(p["text"] if p.get("text") not in (None, "") else p.get("value"))))
        if status_words(p.get("status")):
            out.append(status_words(p["status"]))
        if p.get("note"):
            out.append(sentence("Note: " + str(p["note"])))
        if p.get("state"):
            out.append(sentence("State: " + str(p["state"])))
        out.append("Evidence: %s." % links(p["evidence"]) if p.get("evidence") else "No evidence note is attached.")
        if p.get("informs"):
            out.append("Feeds: %s. Basis: %s" % (links(p["informs"]), quoted(p.get("informs_basis") or "")))
    elif kind == "Evidence" and p.get("code") == "gweb":   # a growth web value with its quote
        out.append(sentence("%s = %s" % (p.get("label"), short(d.get("value"), 400))))
        if d.get("unit"):
            out.append(sentence("Unit and reading: " + str(d["unit"])))
        if d.get("quote"):
            out.append("Quote: %s" % quoted(d["quote"]))
        out.append("Role: %s; extrapolation: %s; age basis: %s; read depth: %s." % (d.get("role"), d.get("extrapolation"), d.get("age_basis"), d.get("read_depth")))
        if d.get("paper_id"):
            out.append("Source: [[@%s]]." % d["paper_id"])
        out += opposition(p)
    elif kind == "Evidence":   # a quoted passage for one value
        if p.get("quote"):
            out.append("Quote: %s" % quoted(p["quote"]))
        if p.get("locator"):
            out.append(sentence("Where in the source: " + str(p["locator"])))
        if p.get("value_in_source"):
            out.append(sentence("Value in the source: " + str(p["value_in_source"])))
        who = p.get("species_age") or " ".join(str(p[k]) for k in ("species", "stage") if p.get(k))
        if who:
            out.append(sentence("Species and age: " + who))
        if p.get("transfer"):
            out.append(sentence("Transfer: " + str(p["transfer"])))
        if status_words(p.get("status")):
            out.append(status_words(p["status"]))
        if p.get("source"):
            out.append("Source: %s." % p["source"])
        to = links(p.get("applies_to")) or links(p.get("claim"))
        if to:
            out.append("For: %s." % to)
        out += opposition(p)
    elif kind == "Hypothesis" and p.get("code") == "gweb":   # a growth web test statement
        out.append(sentence(d.get("statement") or name))
        out.append("Growth web test `%s` on `%s`." % (d.get("id"), d.get("node")))
    elif kind == "Finding":   # a claim that states what the probes show
        out.append(sentence(str(p.get("statement") or name)))
        out.append("The readings come from short probe runs and are provisional. Removal probes switch a value off or merge it with another, and sensitivity probes change it by a quarter, so a reading for and a reading against may come from different tests.")
        for label, key in (("Supported by", "supported_by"), ("Opposed by", "opposed_by"), ("Addresses", "addresses")):
            if p.get(key):
                out.append("%s: %s." % (label, links(p[key])))
        if p.get("quote"):
            out.append("From the record: %s" % quoted(p["quote"]))
        if p.get("record"):
            out.append("Record file: `%s`." % p["record"])
    elif kind in ("Question", "Hypothesis", "Experiment", "Result"):
        if p.get("asks"):
            out.append(sentence(str(p["asks"])))
        if p.get("quote"):
            out.append("From the record: %s" % quoted(p["quote"]))
        if p.get("reading"):
            out.append("Reading: %s%s%s." % (p["reading"], "" if p.get("counted", True) else " (not counted)", ", holds by construction" if p.get("by_construction") else ""))
        for label, key in (("Question", "question"), ("Tests", "hypotheses"), ("Experiment", "experiment"), ("Supports", "supports"), ("Opposes", "opposes"),
                           ("Consistent with", "consistent_with"), ("Rests on", "informed_by"), ("Open issues", "issues")):
            if p.get(key):
                out.append("%s: %s." % (label, links(p[key])))
        if p.get("lead"):
            out.append(sentence("Next lead: " + str(p["lead"])))
        if p.get("values"):
            out.append("Values that wait on this question (a sourced one answers its part): %s." % links(p["values"]))
        if p.get("method"):   # the plan fixed before the run, in its own words
            out.append("Method, from the plan `%s`:" % p.get("method_record"))
            out.extend(quoted(m) for m in p["method"])
        if p.get("record"):
            out.append("Record file: `%s`%s." % (p["record"], ", %s" % p["date"] if p.get("date") else ""))
    elif kind == "Issue":
        out.append(sentence(d.get("item") or name))
        if d.get("why"):
            out.append(sentence("Why it matters: " + str(d["why"])))
        if d.get("resolve"):
            out.append(sentence("To resolve: " + str(d["resolve"])))
        out.append("Status: %s; priority: %s; category: %s." % (d.get("status"), d.get("priority"), d.get("category")))
        if d.get("evidence"):
            out.append(sentence("Evidence so far: " + short(d["evidence"], 1200)))
        if d.get("note"):
            out.append(sentence("Note: " + short(d["note"], 1200)))
    elif kind == "Source":
        row = p.get("row") if isinstance(p.get("row"), dict) else {}
        out.append(sentence(row.get("citation") or name))
        ids = ["%s: %s" % (lab, row[k]) for lab, k in (("DOI", "doi"), ("PMID", "pmid"), ("PMCID", "pmcid")) if row.get(k)]
        if ids:
            out.append("; ".join(ids) + ".")
    return out


# ---- titles. A title is derived from the note's properties, like its body: a sentence a reader can dispute, the source for a piece of evidence, and the stable name in
# brackets so a key can still be searched. Nothing is invented: a value with no `meaning` states its key and value, and a setting with no source is not titled as a claim at all.
THIN = 12   # a value text shorter than this is only a number
TITLE_MAX = 150   # characters of a title without ".md": the longest path in a throw-away worktree stays under the 260 of Windows
FULLWIDTH = {ord(a): b for a, b in zip(chr(92) + '/:*?"<>|^#', "＼／：＊？＂＜＞｜＾＃")}
FULLWIDTH.update({ord("["): "(", ord("]"): ")"})
PREFIXES = {"Claim": "CLM - ", "Evidence": "EVD - ", "Hypothesis": "HYP- ", "Parameter": "PAR - ", "Question": "QUE - ", "Issue": "ISS - ", "Source": "@"}


def is_parameter(p):
    """a configuration value with no source and no evidence: a setting, not an assertion (model choice, not researched, no source found, cited design)"""
    return "record_file" not in p and ("key" in p or "module" in p) and not str(p.get("status") or "").startswith("source-found") and not p.get("evidence")


def clean(s):
    """text that can be a file name and the inside of a wiki-link: reserved characters are written in their full-width form, so nothing is dropped"""
    return " ".join(str(s).translate(FULLWIDTH).split()).strip(" .")


SENTENCE_END = re.compile(r"(?<=[a-z]{4})[.] (?=[A-Z])|(?<=[A-Za-z])[;] (?=[A-Za-z])")


SERIES = re.compile(r"[IVXLC]+[.] ")   # a numbered part of a series title follows: the title goes on


def closed(s, whole=None):
    """True when no bracket and no quotation is left open in s (s is the start of the text `whole`, which is looked at for the mark that closes a quotation)"""
    w = whole if whole is not None and whole.startswith(s) else s
    quoting = False
    for i, c in enumerate(s):
        if c != "'":
            continue
        before, after = (s[i - 1] if i else " "), (s[i + 1] if i + 1 < len(s) else " ")
        if before.isalnum() and after.isalnum():   # an apostrophe inside a word: unit's, 1997's, O'Rahilly
            continue
        if (before.isspace() or before in "([") and not after.isspace():   # before a word: a quotation opens
            quoting = True
        elif quoting:   # after a word or its full stop: the open quotation closes
            later = [j for j in range(i + 1, len(w)) if w[j] == "'" and not (w[j - 1].isalnum() and w[j + 1:j + 2].isalnum())]
            if before == "s" and later and not w[later[0] - 1].isspace() and w[later[0] - 1] not in "([":
                continue   # a plural possessive inside the quotation (the units' mean): the mark that closes it comes later
            quoting = False
        # else: after a word with no quotation open, a plural possessive (units')
    return s.count("(") <= s.count(")") and s.count("[") <= s.count("]") and not quoting and s.count(chr(0xFF02)) % 2 == 0


def fit(prefix, text, suffix):
    suffix = clean(suffix)
    suffix = (" " + suffix) if suffix else ""
    room = TITLE_MAX - len(prefix) - len(suffix)
    t = clean(text)
    if len(t) > room:
        cut = t[:max(room, 1)]
        # a real sentence end only: a full stop after a whole lower-case word of four letters or more (not a number, an initial or an abbreviation such as "al." or
        # "Fig."), followed by a capital; or a semicolon after a letter
        ends = [m.start() for m in SENTENCE_END.finditer(cut) if closed(cut[:m.start()], t) and not SERIES.match(t[m.end():])]
        end = ends[-1] if ends else -1
        if end >= room * 0.6:   # a whole sentence or clause fits in most of the room: stop there, nothing is left hanging
            t = cut[:end].rstrip(" ,;.")
        else:
            t = t[:max(room - 2, 1)].rsplit(" ", 1)[0].rstrip(" ,;.") + " …"
    return (prefix + t + suffix).strip()


def value_text(p):
    if p.get("value_file"):
        return None
    v = p["text"] if p.get("text") not in (None, "") else p.get("value")
    s = v if isinstance(v, str) else json.dumps(v, ensure_ascii=False)
    return s if len(s) <= 30 else None


PARTICLES = ("de", "van", "von", "der", "den", "del", "di", "la", "le", "du")
OURS = ("extraction agent", "my sums", "as quoted by the assistant", "least-squares fit", "(was ", "not read", "not verified", "search-result paraphrase")


def ours(text):
    """True when a recorded passage is this project's own words about the source (its arithmetic, its fit, a remark on how the passage was got), not the source's"""
    low = str(text or "").lower()
    return any(m in low for m in OURS)


def surname(row):
    """the first author's surname. The register column holds only a particle for some names ('de' for 'de Vries'); the citation text then gives the whole surname"""
    first = str(row.get("first_author") or "")
    if first.lower() not in PARTICLES:
        return first
    out = []
    for tok in str(row.get("citation") or "").split()[:4]:
        word = tok.strip(",.;")
        if out and word.isupper() and len(word) <= 4:   # the initials end the surname
            break
        out.append(word)
        if tok.endswith(","):
            break
    return " ".join(out) if len(out) > 1 and out[0].lower() == first.lower() else first


def cite(paper_id, sources):
    row = (sources.get(paper_id) or {}).get("row") or {}
    who = " ".join(str(x) for x in (surname(row), row.get("year")) if x)
    return who or (paper_id or "")


def verified_passage(ev):
    """the passage of the source that a later check found for this Evidence note (property `verified`: on, against, passage), or ''"""
    v = ev.get("verified")
    return str(v.get("passage") or "") if isinstance(v, dict) else ""


def who_of(ev):
    """the species and age an Evidence note states, in its own words"""
    who = ev.get("species_age") or " ".join(str(ev[k]) for k in ("species", "stage") if ev.get(k))
    return "" if str(who).lower().startswith("none") else who   # a computational model has no species


def usable(meaning):
    """a `meaning` that is a description (some hold a fragment of source code from the import; those are not used in a title)"""
    m = str(meaning or "")
    return bool(m.strip()) and "CFGV" not in m


def title(kind, name, p, sources, ev=None):
    """the title (file name without .md) of a note. `sources` maps a paper id to its Source note; `ev` is the first Evidence note of a configuration value, when it has
    one. None for the kinds that keep their name as their title."""
    d = p.get("data") if isinstance(p.get("data"), dict) else {}
    if kind == "Claim" and is_parameter(p):
        if usable(p.get("meaning")):   # a setting whose meaning is recorded says what it is; its key and value follow in brackets
            v = value_text(p)
            return fit(PREFIXES["Parameter"], p["meaning"], "(%s)" % ("%s = %s" % (name, v) if v is not None else name))
        v = value_text(p)
        what = [x for x in (PARAMETER_KIND.get(p.get("status")), p.get("state")) if x]   # no meaning is recorded, so the title says what is: key, value, kind of setting, use
        said = "%s = %s" % (name, v) if v is not None else name
        return fit(PREFIXES["Parameter"], said + (", " + "; ".join(str(x) for x in what) if what else ""), "") if (v is not None or what) else PREFIXES["Parameter"] + name
    if kind == "Claim" and p.get("code") == "gweb":
        return fit(PREFIXES[kind], "%s acts on %s (%s), %s" % (d.get("source"), d.get("target"), d.get("sign"), d.get("mechanism")), "(%s)" % name)
    if kind == "Claim" and "record_file" in p:
        said = str(d.get("method") or d.get("quantity") or "")
        if not d.get("method") and isinstance(d.get("value"), (int, float, str)) and not isinstance(d.get("value"), bool):   # a value record: the quantity, what was found and its unit, in the record's own words
            v = short(d["value"], 60)
            if len(v) <= 60 and not v.endswith(" ..."):
                said = "%s = %s" % (said, v)
            if d.get("unit") and str(d["unit"]) not in said:
                said = "%s, %s" % (said, d["unit"])
        elif " " not in said.strip() and d.get("unit"):   # a label, not a sentence: say what it measures, from the record's own unit text
            said = "%s, %s" % (said, d["unit"])
        if str(d.get("quantity") or "").startswith("test.") and d.get("unit"):   # a variable name: its last part in words, the unit text and the species, all from the record
            label = str(d["quantity"]).split(".")[-1].replace("_", " ")
            if isinstance(d.get("value"), (int, float, str)) and not isinstance(d.get("value"), bool) and len(short(d["value"], 60)) <= 60 and not short(d["value"], 60).endswith(" ..."):
                label = "%s = %s" % (label, short(d["value"], 60))
            said = ", ".join(str(x) for x in (label, d["unit"], d.get("species")) if x)
        return fit(PREFIXES[kind], said, "(%s)" % name)
    if kind == "Claim":
        v = value_text(p)
        key = "%s = %s" % (name, v) if v is not None else name
        sourced = str(p.get("status") or "").startswith("source-found")
        if usable(p.get("meaning")):
            return fit(PREFIXES[kind], p["meaning"], "(%s)" % key)
        if sourced and ev and (ev.get("quote") or ev.get("value_in_source")):   # the claim is what the source says about the world; the key and value follow in brackets
            said = str(ev.get("quote") or ev.get("value_in_source"))
            if verified_passage(ev):
                return fit(PREFIXES[kind], verified_passage(ev) + (", " + who_of(ev) if who_of(ev) else ""), "(%s)" % key)
            if not ev.get("quote") and "not read" in said.lower() and ev.get("locator"):   # a stale remark in the field; the locator states the table row that was read
                said = str(ev["locator"])
            if not ev.get("quote") or ours(said):   # no passage of the source, or the passage is our own words about it: the title says whose reading this is
                said = "our reading, " + said
            return fit(PREFIXES[kind], said + (", " + who_of(ev) if who_of(ev) else ""), "(%s)" % key)
        gloss = SOURCED.get(p.get("status")) or UNSOURCED.get(p.get("status")) or ""
        return fit(PREFIXES[kind], key + (", " + gloss if gloss else ""), "")
    if kind == "Evidence" and p.get("code") == "gweb":
        text = d.get("quote") or "%s = %s" % (p.get("label"), short(d.get("value"), 80))
        if p.get("opposes") and p.get("opposes_basis"):   # a note that stands against a Claim is titled by the passage that says so (the note may hold several findings)
            text = p["opposes_basis"]
            if text not in str(d.get("quote") or ""):   # the basis is the vault's own statement of the conflict, not the source's words
                return fit(PREFIXES[kind], "our reading, " + str(text), "- from %s (%s)" % (cite(d.get("paper_id"), sources), p.get("label")))
        if ours(text):
            return fit(PREFIXES[kind], "our reading, " + str(text), "- from %s (%s)" % (cite(d.get("paper_id"), sources), p.get("label")))
        return fit(PREFIXES[kind], text, "- %s (%s)" % (cite(d.get("paper_id"), sources), p.get("label")))
    if kind == "Evidence":
        quote, vis = str(p.get("quote") or ""), str(p.get("value_in_source") or "")
        if verified_passage(p):
            text = "%s, %s" % (vis, verified_passage(p)) if vis and not ours(vis) and len(clean(vis)) < 40 else verified_passage(p)
            return fit(PREFIXES[kind], text, "- %s (%s)" % (cite(p.get("paper_id"), sources), name))
        if quote:   # the source's own words first; a bare number read from it goes in front
            text = "%s, %s" % (vis, quote) if vis and len(clean(vis)) < THIN else quote
            if ours(quote):   # the recorded passage is this project's words about the source (a fit, a sum, a remark on how it was got)
                return fit(PREFIXES[kind], "our reading, " + text, "- from %s (%s)" % (cite(p.get("paper_id"), sources), name))
            return fit(PREFIXES[kind], text, "- %s (%s)" % (cite(p.get("paper_id"), sources), name))
        # no passage of the source is recorded: what stands here is this project's reading of it (often its own arithmetic or fit), and the title says so
        if "not read" in vis.lower() and p.get("locator"):   # a stale remark in the field; the locator states the table row that was read
            vis = str(p["locator"])
        text = "our reading, " + vis if vis else "no passage recorded" + (", " + str(p["locator"]) if p.get("locator") else "")
        return fit(PREFIXES[kind], text, "- from %s (%s)" % (cite(p.get("paper_id"), sources), name))
    if kind == "Hypothesis" and p.get("code") == "gweb":
        return fit(PREFIXES[kind], d.get("statement") or "", "(%s)" % name)
    if kind == "Finding":
        return fit(PREFIXES["Claim"], p.get("statement") or name, "")
    if kind == "Question" and p.get("asks"):   # an open-value question: the question itself, its stable name in brackets
        return fit(PREFIXES[kind], p["asks"], "(%s)" % name)
    if kind == "Question" and p.get("quote"):
        return fit(PREFIXES[kind], p["quote"], "")
    if kind == "Issue" and d.get("item"):
        return fit(PREFIXES[kind], "%s, %s" % (name, d["item"]), "")
    if kind == "Source":
        row = p.get("row") if isinstance(p.get("row"), dict) else {}
        said = row.get("citation") or " ".join(str(row[k]) for k in ("first_author", "year", "title") if row.get(k))
        return fit(PREFIXES[kind], said, "(%s)" % name) if said else None
    return None


def body(kind, name, props):
    """the text that follows the frontmatter of a node note ('' for a table row or an unknown kind)"""
    if kind == "Record":
        return ""
    ls = [l for l in lines_for(kind, name, props) if l]
    return (NL + (NL + NL).join(ls) + NL) if ls else ""
