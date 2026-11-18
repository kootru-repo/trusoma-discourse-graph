"""The entry forms' one door into the vault (2026-11-17). A form (the Obsidian plugin in tools/dm/forms_plugin, or any caller) sends ONE JSON request on standard
input and reads ONE JSON answer on standard output. No rule lives in the form: every check here is the vault's own (validate_vault), run on the vault as read plus
the one candidate note, before anything is written. A save writes through dmlib, regenerates, runs the full check in a fresh process and, if that fails, puts
back the exact bytes of every file it touched.

The split (USER 2026-11-17): transcription goes through a strict form (a Result, a passage of a paper, a value); judgement is written freely. A claim or a
question starts as a plain note in vault/Drafts, which no tool reads and no check can fail on, and is ADMITTED to the graph when its author says so: the
draft's first line becomes the statement, the rest stays the author's own words under "## Notes".

actions (request {"action": ..., ...}):
  lists                         the picker lists: experiments, hypotheses, results, questions, findings, record files, readings
  record   record, find         the lines of a record file that hold the words typed (line number and text), so a quote is picked, not retyped
  quote    record, quote        is the quote in the record word for word: found, line, count; when it is not, the closest line
  preview  kind, name, props    title, body, relations and errors of the note as it would be written; nothing is written
  save     kind, name, props    preview, then write, regenerate, check; refused or rolled back with the errors
  drafts                        the drafts waiting in vault/Drafts
  admit    draft, kind, name, props   a draft becomes a claim (kind Finding) or a Question; the draft file is removed once the check passes
  values   find                 configuration values whose key or meaning holds the words typed
  papers   find                 papers of the register
  value_preview / value_save    key + value, status, meaning: before and after, what to look at again (impact), then value_add.py set
  evidence_preview / evidence_save   key, paper, locator, quote, value_in_source, species_age, transfer: then value_add.py evidence
usage: python -B tools/dm/form_api.py < request.json"""
import contextlib, datetime, difflib, io, json, re, subprocess, sys, time
import dmlib as D

DRAFTS = D.VAULT / "Drafts"   # plain notes; dmlib reads vault/DiscourseGraph and vault/Tables only, so nothing here is read, checked or published
ASKED = "companion/audit_log/QUESTIONS_ASKED.md"   # the record of the questions admitted from drafts: one dated line each, quoted by the Question note
ASKED_HEAD = "# Questions asked\n\nOne line per question admitted to the vault from a draft (tools/dm/form_api.py admit): the date and the question in its author's words. The Question note quotes its line.\n\n"
FORM_KINDS = ("Result", "Finding", "Question")
PASSAGE_STATUSES = ("source-found-fetal", "source-found-transfer", "adult-sourced-unusable")   # what a passage entered in the form can be (the statuses the vault's link rows hold)
LINK_PROPS = {"Result": ("experiment", "consistent_with", "against", "supports", "opposes", "answers"), "Finding": ("supported_by", "opposed_by", "addresses"), "Question": ("informed_by",)}
# which field of the form a line of the vault check belongs to (the words are the check's own; only the place they are shown is chosen here)
FIELD_OF = ((r"its quote is not found|missing quote", "quote"), (r"record file|missing record", "record"), (r"reading ", "reading"), (r"counted must|missing counted", "counted"),
            (r"answers needs", "answers_basis"), (r"against is for|both against and consistent", "against"), (r"exactly one experiment|missing experiment", "experiment"),
            (r"a finding names at least one Result", "supported_by"), (r"listed both for and against", "opposed_by"), (r"missing statement", "statement"), (r": (\w+) link ", None))


def candidate(kind, name, props):
    """the properties of the note as dmlib.write_note_kind would write them (test_form_api holds this equal to every note the vault holds)"""
    dk = D.disk_kind(kind, props)
    head = {"nodeTypeId": D.NODE_TYPE[dk], "nodeInstanceId": D.node_id(kind, name), "dg_type": dk}
    head.update({k: v for k, v in props.items() if k not in ("dg_name", "recordTypeId")})
    return head


def record_text(rec):
    f = D.ROOT / rec if rec else None
    return f.read_text(encoding="utf-8") if f and f.is_file() and D.ROOT in f.resolve().parents else None


def field_of(message):
    for pattern, field in FIELD_OF:
        m = re.search(pattern, message)
        if m:
            return field or m.group(1)
    return ""


def check_candidate(kind, name, props):
    """the vault check's own lines about the vault with this one note added, less the lines it already says without it"""
    import validate_vault as V
    out = []
    bad = sorted({ch for ch in name if ch in D.BAD_NAME_CHARS + "#"})
    if bad:
        out.append({"field": "name", "message": "take out " + " ".join(bad) + " (a name with these would break the links to the note)"})
    elif len(name) >= 150:
        out.append({"field": "name", "message": "shorter than 150 characters: this is the short name, not the statement"})
    if not name.strip():
        out.append({"field": "name", "message": "a short name is needed: the note is known by it"})
    if kind not in FORM_KINDS:
        return out + [{"field": "", "message": "no form for a %s note" % kind}]
    nodes = D.read_all()
    if not out and (kind, name) in nodes:
        out.append({"field": "name", "message": "a %s note with this name exists: %s" % (kind, D.title(kind, name))})
    if out:   # the name is said to be wrong, and the rest of the form is still checked in the same pass (under a stand-in name)
        name = "form candidate"
    for k, v in props.items():
        if v in ("", [], None):
            return out + [{"field": k, "message": "empty: leave the field out or fill it"}]
    cand = candidate(kind, name, props)
    before, after = [], []
    V.discourse_checks(nodes, before)
    V.extra_checks(nodes, before)
    more = dict(nodes)
    more[(kind, name)] = cand
    after += ["%s %s: missing %s" % (kind, name, f) for f in V.REQUIRED[kind] if f not in cand]
    V.discourse_checks(more, after)
    V.extra_checks(more, after)
    seen = set(before)
    for e in after:
        if e not in seen:
            seen.add(e)
            out.append({"field": field_of(e), "message": e.split(": ", 1)[-1] if e.startswith(("%s %s: " % (kind, name), "Claim %s: " % name)) else e})
    gone = {e["field"] for e in out if e["message"].startswith("missing ")}   # a field left empty is said once, not once per rule that reads it
    out = [e for e in out if e["field"] not in gone or e["message"].startswith("missing ")]
    for e in out:
        if e["message"].startswith("missing "):
            e["message"] = "needed"
    if kind == "Finding" and not out:   # a form rule, as the 20 claims entered by script were held to: the claim quotes a record one of its Results rests on
        recs = {nodes[("Result", D.target_of(l, "Result"))].get("record") for l in D.links_of(props.get("supported_by")) + D.links_of(props.get("opposed_by"))}
        if props.get("record") not in recs:
            out.append({"field": "record", "message": "a claim quotes a record that one of its Results rests on: " + ", ".join(sorted(recs))})
    return out


def relations_of(kind, props):
    out = []
    for rule_kind, prop, rel, other, outgoing in D.EDGE_RULES:
        if rule_kind == kind:
            for l in D.links_of(props.get(prop)):
                out.append(("this note %s %s" if outgoing else "%s%s this note") % ((rel, l[2:-2]) if outgoing else (l[2:-2], " " + rel)))
    return out


def preview(kind, name, props):
    import readable
    errors = check_candidate(kind, name, props)
    out = {"errors": errors, "title": "", "body": "", "relations": []}
    if kind in FORM_KINDS and not any(e["field"] == "name" for e in errors):
        cand = candidate(kind, name, props)
        try:
            out["title"] = readable.title(kind, name, cand, {}) or D.canon(D.disk_kind(kind, props), name)
            out["body"] = readable.body(kind, name, cand).strip()
            out["relations"] = relations_of(kind, props)
        except (KeyError, TypeError, AttributeError):   # a half-filled form: the errors say what is missing
            pass
    return out


def snapshot(extra=()):
    """the bytes of every file a save can touch: the vault (notes can be retitled and links rewritten), the generated files, and the files named"""
    import build_from_vault as B
    paths = [p for p in D.VAULT.rglob("*") if p.is_file() and p.relative_to(D.VAULT).parts[0] not in (".obsidian", ".trash")]
    with contextlib.redirect_stdout(io.StringIO()):
        modules, values, basis, link_rows, registers, texts, parts = B.generate()
        paths += list(B.render(modules, values, link_rows, registers, texts, parts))
    paths += [D.ROOT / e for e in extra]
    return {p: (p.read_bytes() if p.exists() else None) for p in set(paths)}


def restore(snap):
    """put back exactly what was there: changed and deleted files rewritten, files that did not exist removed. Never git."""
    for p in D.VAULT.rglob("*"):
        if p.is_file() and p.relative_to(D.VAULT).parts[0] not in (".obsidian", ".trash") and p not in snap:
            p.unlink()
    for p, b in snap.items():
        if b is None:
            if p.exists():
                p.unlink()
        elif not p.exists() or p.read_bytes() != b:
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_bytes(b)
    D._CACHE.clear()


def regenerate_and_check():
    """regenerate from the vault, then the full check in a fresh process (it reads the disk, not this process's memory). [] when it passes"""
    import build_from_vault as B
    said = io.StringIO()
    saved = sys.argv
    try:
        with contextlib.redirect_stdout(said):
            D.write_relations()
            sys.argv = [saved[0], "write"]
            code = B.main()
    except SystemExit as e:
        code = e.code or 1
    except Exception as e:   # anything the regeneration cannot digest is a refusal, and the caller puts the files back
        said.write("%s: %s" % (type(e).__name__, e))
        code = 1
    finally:
        sys.argv = saved
    if code:
        return [l for l in said.getvalue().splitlines() if l.strip()][-6:] or ["the regeneration stopped"]
    r = subprocess.run([sys.executable, "-B", str(D.ROOT / "tools/dm/check_all.py")], cwd=str(D.ROOT), capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode:
        lines = [l for l in (r.stdout + r.stderr).splitlines() if l.strip()]
        return [l for l in lines if re.search(r"DIFFERENCE|FAILED|Error|missing|not found|does not", l)][:12] or lines[-6:]
    return []


def guarded(write, extra=()):
    """run a write under the snapshot: {"ok": True} when the full check passes after it, else everything is put back and the check's lines returned"""
    t0 = time.time()
    snap = snapshot(extra)
    try:
        said = write() or []
        problems = regenerate_and_check()
    except SystemExit as e:   # the value tools refuse with a sentence
        problems = [str(e.code)]
    except Exception as e:
        problems = ["%s: %s" % (type(e).__name__, e)]
    if problems:
        restore(snap)
        return {"ok": False, "errors": [{"field": field_of(p), "message": p} for p in problems], "written": False}
    return {"ok": True, "errors": [], "written": True, "said": said, "seconds": round(time.time() - t0, 1)}


def save(kind, name, props, notes="", extra=(), also=None):
    pre = preview(kind, name, props)
    if pre["errors"]:
        return dict(pre, ok=False, written=False)

    def write():
        D.write_note_kind(kind, name, props)
        if notes.strip():   # the author's own words follow the generated body under "## Notes"; no tool reads or rewrites them
            path = D.NODES / (D.PREFIX[D.disk_kind(kind, props)] + name + ".md")
            path.write_text(path.read_text(encoding="utf-8") + chr(10) + D.NOTES_MARK + chr(10) + chr(10) + notes.strip() + chr(10), encoding="utf-8", newline="\n")
        if also:
            also()
    out = guarded(write, extra)
    if out["ok"]:
        out["title"] = D.title(kind, name)
        out["path"] = "vault/DiscourseGraph/%s.md" % out["title"]
    return out


def read_draft(rel):
    """(first line without its heading marks, the rest) of a draft; rel is the path inside vault/Drafts"""
    p = (DRAFTS / rel).resolve()
    if DRAFTS.resolve() not in p.parents or not p.is_file():
        return None, None, None
    text = p.read_text(encoding="utf-8")
    if text.startswith("---"):
        end = text.find(chr(10) + "---", 3)
        text = text[text.find(chr(10), end + 1) + 1:] if end > 0 else text
    lines = text.strip().splitlines()
    first = lines[0].lstrip("#").strip() if lines else ""
    return p, first, chr(10).join(lines[1:]).strip()


def drafts():
    out = []
    for p in sorted(DRAFTS.rglob("*.md")) if DRAFTS.is_dir() else []:
        rel = p.relative_to(DRAFTS).as_posix()
        _, first, rest = read_draft(rel)
        out.append({"draft": rel, "sentence": first, "more": len(rest), "kind": "Question" if first.endswith("?") else "Finding"})
    return out


def admit(req):
    path, first, rest = read_draft(req.get("draft", ""))
    if path is None:
        return {"ok": False, "written": False, "errors": [{"field": "draft", "message": "no such draft in vault/Drafts"}]}
    kind, name, props = req["kind"], req.get("name", ""), dict(req.get("props") or {})
    dry = req.get("dry")
    if kind == "Question":   # a question is its author's: its record is the dated line of the questions file, written by this admission
        if not first.endswith("?") or len(first) < 12:
            return {"ok": False, "written": False, "errors": [{"field": "draft", "message": "the first line of the draft is the question and ends with a question mark"}]}
        props.update(record=ASKED, quote=first)
        line = "- %s: %s%s" % (datetime.date.today().isoformat(), first, chr(10))
        f = D.ROOT / ASKED
        old = f.read_text(encoding="utf-8") if f.exists() else None
        f.write_text((old or ASKED_HEAD) + line, encoding="utf-8", newline="\n")   # the check reads the file, so the line is there for the preview too
        out = {}   # if the preview or the save raises, the line is taken back all the same
        try:
            out = preview(kind, name, props) if dry else save(kind, name, props, notes=rest, extra=(ASKED,), also=path.unlink)
        finally:
            if dry or not out.get("ok"):
                f.write_text(old, encoding="utf-8", newline="\n") if old is not None else f.unlink()
        return out
    if kind != "Finding":
        return {"ok": False, "written": False, "errors": [{"field": "", "message": "a draft is admitted as a claim or as a question"}]}
    props.setdefault("statement", first)
    return preview(kind, name, props) if dry else save(kind, name, props, notes=rest, also=path.unlink)


def lists():
    nodes = D.read_all()
    def rows(kind, *fields):
        out = []
        for (k, n), p in sorted(nodes.items()):
            if k == kind and "record_file" not in p:
                row = {"name": n, "title": D.title(k, n), "link": D.link(k, n)}
                row.update({f: p.get(f) for f in fields if f in p})
                out.append(row)
        return out
    records = sorted({p["record"] for (k, n), p in nodes.items() if k in FORM_KINDS + ("Hypothesis", "Experiment") and "record_file" not in p and p.get("record")})
    return {"experiments": rows("Experiment", "record", "date", "hypotheses"), "hypotheses": rows("Hypothesis"), "results": rows("Result", "record", "reading", "experiment"),
            "questions": rows("Question"), "findings": rows("Finding", "statement"), "records": records, "readings": list(__import__("validate_vault").READINGS),
            "against_readings": list(D.AGAINST), "drafts": drafts(), "statuses": list(__import__("value_add").STATUSES), "passage_statuses": list(PASSAGE_STATUSES)}


def record_lines(rec, find):
    text = record_text(rec)
    if text is None:
        return {"exists": False, "lines": []}
    words = [w for w in find.lower().split() if w]
    hits = [{"line": i + 1, "text": l} for i, l in enumerate(text.splitlines()) if l.strip() and all(w in l.lower() for w in words)]
    return {"exists": True, "total": len(hits), "lines": hits[:60]}


def quote(rec, q):
    text = record_text(rec)
    if text is None:
        return {"exists": False, "found": False}
    at = text.find(q) if q else -1
    if at >= 0:
        return {"exists": True, "found": True, "line": text.count(chr(10), 0, at) + 1, "count": text.count(q)}
    lines = text.splitlines()
    near = difflib.get_close_matches(q, [l for l in lines if l.strip()], n=1, cutoff=0.5) if q else []
    return {"exists": True, "found": False, "closest": near[0] if near else "", "closest_line": lines.index(near[0]) + 1 if near else 0}


def values(find):
    words = [w for w in find.lower().split() if w]
    out = []
    for (k, n), p in sorted(D.read_all().items()):
        if k == "Claim" and "record_file" not in p and ("value" in p or "value_file" in p):
            hay = (n + " " + str(p.get("meaning", ""))).lower()
            if all(w in hay for w in words):
                out.append({"key": p.get("key", n), "title": D.title(k, n), "value": p.get("value"), "status": p.get("status"), "meaning": p.get("meaning"), "learner": "module" in p,
                            "evidence": len(D.links_of(p.get("evidence")))})
    return {"total": len(out), "values": out[:60]}


def papers(find):
    words = [w for w in find.lower().split() if w]
    out = []
    for (k, n), p in sorted(D.read_all().items()):
        if k == "Source" and "record_file" not in p:
            row = p.get("row") or {}
            hay = (n + " " + json.dumps(row, ensure_ascii=False)).lower()
            if all(w in hay for w in words):
                out.append({"id": p.get("paper_id", n), "title": D.title(k, n), "year": row.get("year"), "doi": row.get("doi")})
    return {"total": len(out), "papers": out[:60]}


def value_request(req, command):
    """the value tools' own command line for the request (so the form and the command line cannot differ), parsed by the tools' own parser"""
    import value_add as A
    flags = {"set": ("value", "status", "meaning", "state"), "evidence": ("paper", "locator", "quote", "value_in_source", "species_age", "transfer", "link_status", "status")}[command]
    argv = [command, "--key", str(req.get("key", ""))]
    for f in flags:
        if req.get(f) not in (None, ""):
            argv += ["--" + f.replace("_", "-"), req[f] if isinstance(req[f], str) else json.dumps(req[f])]
    return A, A.parser().parse_args(argv)


def value_errors(req, command):
    nodes = D.read_all()
    p = nodes.get(("Claim", D.safe(str(req.get("key", "")))))
    if not p or "record_file" in p:
        return None, [{"field": "key", "message": "no such value"}]
    out = []
    if "module" in p:   # the first version of the forms leaves the learner constants to the command line (their appendix line and code tag must agree)
        out.append({"field": "key", "message": "a learner constant is changed with tools/dm/value_add.py, not in this form"})
    if command == "set":
        if req.get("value") in (None, "") and not req.get("status") and not req.get("meaning"):
            out.append({"field": "value", "message": "nothing to change"})
        if isinstance(req.get("value"), str) and req["value"] != "":
            try:
                json.loads(req["value"])
            except ValueError:
                out.append({"field": "value", "message": "write the value as a number, true, false, a quoted text or a [list]"})
    else:
        for f in ("paper", "locator", "quote"):
            if not str(req.get(f) or "").strip():
                out.append({"field": f, "message": "needed"})
        if req.get("link_status") not in PASSAGE_STATUSES:
            out.append({"field": "link_status", "message": "say what this passage is: " + ", ".join(PASSAGE_STATUSES)})
        if req.get("paper") and ("Source", req["paper"]) not in nodes:
            out.append({"field": "paper", "message": "not in the paper register: add the paper first (tools/dm/value_add.py paper, after the five-field check)"})
    if req.get("status") and req["status"] not in __import__("value_add").STATUSES:
        out.append({"field": "status", "message": "not one of the statuses"})
    return p, out


def value_action(req, command, write):
    p, errors = value_errors(req, command)
    out = {"errors": errors, "ok": not errors, "written": False}
    if p is None:
        return out
    out["before"] = {"value": p.get("value"), "status": p.get("status"), "meaning": p.get("meaning"), "evidence": len(D.links_of(p.get("evidence")))}
    if command == "set" and req.get("value") not in (None, ""):
        import impact
        with contextlib.redirect_stdout(io.StringIO()):
            out["impact"] = impact.report(req["key"])
    if errors or not write:
        return out

    def run():
        A, a = value_request(req, command)
        with contextlib.redirect_stdout(io.StringIO()):
            said = a.fn(a)
            if command == "evidence" and req.get("status"):
                _, b = value_request({"key": req["key"], "status": req["status"]}, "set")
                said += b.fn(b)
        return said
    out.update(guarded(run))
    if out["ok"]:
        q = D.read_all()[("Claim", D.safe(req["key"]))]
        out["after"] = {"value": q.get("value"), "status": q.get("status"), "meaning": q.get("meaning"), "evidence": len(D.links_of(q.get("evidence")))}
    return out


def handle(req):
    a = req.get("action")
    if a == "lists":
        return lists()
    if a == "record":
        return record_lines(req.get("record", ""), req.get("find", ""))
    if a == "quote":
        return quote(req.get("record", ""), req.get("quote", ""))
    if a == "preview":
        return preview(req.get("kind"), req.get("name", ""), dict(req.get("props") or {}))
    if a == "save":
        return save(req.get("kind"), req.get("name", ""), dict(req.get("props") or {}))
    if a == "drafts":
        return {"drafts": drafts()}
    if a == "admit":
        return admit(req)
    if a == "values":
        return values(req.get("find", ""))
    if a == "papers":
        return papers(req.get("find", ""))
    if a in ("value_preview", "value_save"):
        return value_action(req, "set", a == "value_save")
    if a in ("evidence_preview", "evidence_save"):
        return value_action(req, "evidence", a == "evidence_save")
    return {"error": "unknown action: %r" % a}


def main():
    sys.stdin.reconfigure(encoding="utf-8")
    sys.stdout.reconfigure(encoding="utf-8")
    real = sys.stdout
    try:
        with contextlib.redirect_stdout(io.StringIO()):   # nothing but the one JSON answer reaches the caller
            out = handle(json.loads(sys.stdin.read()))
    except D.UnreadableNote as e:
        out = {"error": str(e)}
    except Exception as e:
        out = {"error": "%s: %s" % (type(e).__name__, e)}
    real.write(json.dumps(out, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
