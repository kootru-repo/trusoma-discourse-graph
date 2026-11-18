"""Tests of the entry forms' backend (form_api.py) in a throw-away worktree of HEAD, never the real tree. The working copies of form_api.py and dmlib's
neighbours are the worktree's own, except form_api.py itself, which is copied from the working tree so the test runs what is being written.
Two things must hold for every case: a save that answers ok leaves a vault whose full check passes, and a refusal leaves `git status` exactly as it was.
usage: python tools/dm/test_form_api.py   (about 2 minutes)"""
import json, os, pathlib, shutil, subprocess, sys, tempfile

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
ENV = dict(os.environ, PYTHONUTF8="1")
PROBES = "companion/TRUSOMA_PROBES.md"
QUOTE = "Nothing here counts as a stage verdict."
EXP = "[[EXP - probe 1 existing checkpoints 2026-11-03]]"


def main():
    tmp = pathlib.Path(tempfile.mkdtemp(prefix="dmform_"))
    wt = tmp / "wt"
    subprocess.run(["git", "-C", str(ROOT), "worktree", "add", "--detach", str(wt), "HEAD"], check=True, capture_output=True)
    out = []

    def py(*args, stdin=None):
        return subprocess.run([sys.executable, "-B", "-E", *args], cwd=wt, capture_output=True, text=True, encoding="utf-8", errors="replace", env=ENV, input=stdin)

    def api(**req):
        r = py("tools/dm/form_api.py", stdin=json.dumps(req, ensure_ascii=False))
        try:
            return json.loads(r.stdout)
        except ValueError:
            return {"error": "not JSON: " + (r.stdout + r.stderr)[-300:]}

    def status():
        return subprocess.run(["git", "-C", str(wt), "status", "--porcelain"], capture_output=True, text=True).stdout

    def check():
        return py("tools/dm/check_all.py").returncode == 0

    def case(title, ok, detail=""):
        out.append((title, bool(ok), str(detail)[:200]))

    def unchanged(title, base, answer):
        case(title, answer.get("ok") is False and not answer.get("written") and status() == base, json.dumps(answer.get("errors") or answer, ensure_ascii=False))

    try:
        shutil.copy(HERE / "form_api.py", wt / "tools/dm/form_api.py")
        py("tools/dm/build_from_vault.py", "write")
        subprocess.run(["git", "-C", str(wt), "add", "-A"], capture_output=True)   # the baseline every refusal is compared with
        base = status()
        case("baseline check passes in the worktree", check())

        r = py("-c", "import sys; sys.path.insert(0, 'tools/dm'); import dmlib as D, form_api as F\n"
               "n = D.read_all(); bad = []\n"
               "for (k, nm), p in n.items():\n"
               "    if k == 'Record' or 'record_file' in p: continue\n"
               "    user = {a: b for a, b in p.items() if a not in ('nodeTypeId', 'nodeInstanceId', 'dg_type', 'dg_name')}\n"
               "    if F.candidate(k, nm, user) != {a: b for a, b in p.items() if a != 'dg_name'}: bad.append((k, nm))\n"
               "print(len(n), len(bad), bad[:3])")
        case("the candidate a form builds equals the note on disk, for every authored note", r.stdout.split()[1:2] == ["0"], r.stdout + r.stderr[-200:])

        good = {"reading": "observation", "counted": False, "record": PROBES, "quote": QUOTE, "experiment": EXP}
        a = api(action="quote", record=PROBES, quote=QUOTE)
        case("a quote in the record is found with its line", a.get("found") and a.get("line", 0) > 0, a)
        a = api(action="quote", record=PROBES, quote=QUOTE.replace("a stage", "stage"))
        case("a quote one word off is not found and the closest line is offered", a.get("found") is False and QUOTE in a.get("closest", ""), a)
        a = api(action="quote", record="../outside.md", quote="x")
        case("a record path outside the repository is not read", a.get("exists") is False, a)
        a = api(action="record", record=PROBES, find="stage verdict")
        case("record lines are found by the words typed", any(QUOTE in l["text"] for l in a.get("lines", [])), a)

        a = api(action="preview", kind="Result", name="form test", props=good)
        case("preview of a good Result: no errors, title, body, relation; nothing written", not a.get("errors") and a.get("title") == "RES - form test" and QUOTE in a.get("body", "")
             and a.get("relations") and status() == base, a)
        for title, change, field in (("false quote", {"quote": "the learner formed a perfect body map on every seed"}, "quote"), ("unknown reading", {"reading": "good"}, "reading"),
                                     ("counted not true or false", {"counted": "yes"}, "counted"), ("experiment that does not exist", {"experiment": "[[EXP - none]]"}, "experiment"),
                                     ("record that does not exist", {"record": "companion/NONE.md"}, "record")):
            a = api(action="save", kind="Result", name="form test", props=dict(good, **change))
            unchanged("save refused, nothing written: " + title, base, a)
            case("  and the error is shown at its field: " + field, any(e["field"] == field for e in a.get("errors", [])), a.get("errors"))
        a = api(action="save", kind="Result", name="form test", props={k: v for k, v in good.items() if k != "reading"})
        unchanged("save refused: a required field left out", base, a)
        a = api(action="save", kind="Result", name="bad [name]", props=good)
        unchanged("save refused: a name with link characters", base, a)
        a = api(action="save", kind="Hypothesis", name="form test", props=good)
        unchanged("save refused: a kind with no form", base, a)

        r = py("-c", "import sys; sys.path.insert(0, 'tools/dm'); import dmlib as D, form_api as F\n"
               "def w():\n    D.write_note_kind('Result', 'rolled back', {'reading': 'observation', 'counted': False, 'record': %r, 'quote': 'not in the record', 'experiment': %r})\n"
               "print(F.guarded(w)['ok'])" % (PROBES, EXP))
        case("a write the full check refuses is rolled back byte for byte", r.stdout.strip() == "False" and status() == base, r.stdout + r.stderr[-200:])

        r = py("-c", "import sys; sys.path.insert(0, 'tools/dm'); import dmlib as D, form_api as F\n"
               "def w():\n    (F.DRAFTS / 'begun meanwhile.md').parent.mkdir(exist_ok=True); (F.DRAFTS / 'begun meanwhile.md').write_text('a draft', encoding='utf-8')\n"
               "    (D.NODES / 'stray.md').write_text('stray', encoding='utf-8'); raise ValueError('refused')\n"
               "print(F.guarded(w)['ok'], (F.DRAFTS / 'begun meanwhile.md').exists(), (D.NODES / 'stray.md').exists())")
        kept = r.stdout.split() == ["False", "True", "False"]
        shutil.rmtree(wt / "vault/Drafts", ignore_errors=True)
        case("a rollback keeps a draft begun while the save ran, and removes the save's own new file", kept and status() == base, r.stdout + r.stderr[-200:])

        r = py("-c", "import sys, subprocess; sys.path.insert(0, 'tools/dm'); import dmlib as D, form_api as F\n"
               "other = sorted(D.NODES.glob('CLM - *.md'))[0]; new = D.NODES / 'begun in the graph meanwhile.md'; run = subprocess.run\n"
               "def typing(*a, **k):\n    other.write_bytes(other.read_bytes() + b'typed meanwhile'); new.write_text('plain', encoding='utf-8'); return run(*a, **k)\n"
               "F.subprocess.run = typing\n"
               "def w():\n    D.write_note_kind('Result', 'rolled back', {'reading': 'observation', 'counted': False, 'record': %r, 'quote': 'not in the record', 'experiment': %r})\n"
               "ok = F.guarded(w)['ok']\n"
               "print(ok, other.read_bytes().endswith(b'typed meanwhile'), new.exists(), (D.NODES / 'RES - rolled back.md').exists())\n"
               "other.write_bytes(other.read_bytes()[:-len(b'typed meanwhile')]); new.unlink()" % (PROBES, EXP))
        case("a rollback undoes the save only: text typed into another note and a note begun during the check both stay",
             r.stdout.split() == ["False", "True", "True", "False"] and status() == base, r.stdout + r.stderr[-300:])

        holder = subprocess.Popen([sys.executable, "-B", "-E", "-u", "-c", "import sys, time; sys.path.insert(0, 'tools/dm'); import form_api as F\n"
                                   "with F.one_writer():\n    print('held'); time.sleep(120)"], cwd=wt, env=ENV, stdout=subprocess.PIPE, text=True)
        try:
            held = holder.stdout.readline().strip() == "held"
            a = api(action="save", kind="Result", name="second writer", props=good, wait=1)
            unchanged("a save that arrives while another holds the lock is refused with nothing written", base, a)
            case("  and it says so", held and "Another save" in json.dumps(a.get("errors")), json.dumps(a))
            b = api(action="quote", record=PROBES, quote=QUOTE)
            case("a reading request is answered while the lock is held", b.get("ok") or b.get("found") or "error" not in b, json.dumps(b)[:150])
        finally:
            holder.kill()   # a writer that dies holds nothing: the next case would be refused if the lock outlived it
            holder.wait()

        a = api(action="save", kind="Result", name="form test", props=good)
        note = wt / "vault/DiscourseGraph/RES - form test.md"
        rel = json.loads((wt / "vault/relations.json").read_text(encoding="utf-8"))["relations"]
        case("save of a good Result: written, check passes, relation made", a.get("ok") and note.exists() and check() and len(rel) > 0, a)
        case("  seconds for the save", a.get("ok"), a.get("seconds"))
        a = api(action="save", kind="Result", name="form test", props=good)
        case("a second note of the same name is refused", a.get("ok") is False and a["errors"][0]["field"] == "name", a.get("errors"))

        drafts = wt / "vault/Drafts"
        (drafts / "ideas").mkdir(parents=True)
        (drafts / "CLM - half an idea.md").write_text("maybe touch order matters\n", encoding="utf-8")
        (drafts / "ideas" / "QUE - nested.md").write_text("# Does the mouth map come first?\n\nI think so because of the trigeminal timing.\n", encoding="utf-8")
        (drafts / "from the dialog.md").write_text('---\nnodeTypeId: "node_4SqRl5RIkaUMb9fLOpdhq"\n---\nsomething\n', encoding="utf-8")
        (drafts / "claim.md").write_text("Raw touch says which surface is touched before learning\n\nMy reasoning: the partner score is far above shuffled.\nSecond line of mine.\n", encoding="utf-8")
        case("drafts of any name, nested, or made with the plugin's dialog never fail the check", check())
        a = api(action="drafts")
        case("the drafts are listed with their first line", len(a.get("drafts", [])) == 4 and any(d["kind"] == "Question" for d in a["drafts"]), a)
        subprocess.run(["git", "-C", str(wt), "add", "-A"], capture_output=True)
        base2 = status()

        res = "[[RES - surface identity in the raw touch input]]"
        q = "same-surface partners 0.68-0.82 against 0.16-0.28 time-shuffled, on every seed"
        fprops = {"record": PROBES, "quote": q, "supported_by": [res]}
        a = api(action="admit", draft="claim.md", kind="Finding", name="finding, form test", props=dict(fprops, quote="words that are not there"))
        unchanged("admitting a claim with a false quote is refused, the draft stays", base2, a)
        a = api(action="admit", draft="claim.md", kind="Finding", name="finding, form test", props={"record": PROBES, "quote": q})
        unchanged("admitting a claim with no Result for or against it is refused", base2, a)
        a = api(action="admit", draft="claim.md", kind="Finding", name="finding, form test", props=dict(fprops, record="companion/RESEARCH_GRADE_PLAN_2026-11-09.md", quote="Can the scorer see a map through this wiring?"))
        unchanged("admitting a claim that quotes a record none of its Results rests on is refused", base2, a)
        a = api(action="admit", draft="claim.md", kind="Finding", name="finding, form test", props=fprops, dry=True)
        case("a dry admission previews and writes nothing", not a.get("errors") and a.get("title", "").startswith("CLM - Raw touch") and status() == base2, a)
        a = api(action="admit", draft="claim.md", kind="Finding", name="finding, form test", props=fprops)
        made = list((wt / "vault/DiscourseGraph").glob("CLM - Raw touch says which surface*.md"))
        text = made[0].read_text(encoding="utf-8") if made else ""
        case("a claim is admitted: check passes, the draft is gone, the author's words are under Notes", a.get("ok") and check() and not (drafts / "claim.md").exists()
             and "## Notes" in text and "Second line of mine." in text and 'statement: "Raw touch says' in text, a)
        py("tools/dm/build_from_vault.py", "write")
        case("  and a regeneration keeps those words", made and "Second line of mine." in made[0].read_text(encoding="utf-8") and check())

        subprocess.run(["git", "-C", str(wt), "add", "-A"], capture_output=True)
        base3 = status()
        a = api(action="admit", draft="CLM - half an idea.md", kind="Question", name="touch order", props={})
        unchanged("a draft that is not a question is not admitted as one; no line is left in the questions file", base3, a)
        a = api(action="admit", draft="ideas/QUE - nested.md", kind="Question", name="mouth map first", props={})
        asked = wt / "companion/audit_log/QUESTIONS_ASKED.md"
        qn = list((wt / "vault/DiscourseGraph").glob("QUE - Does the mouth map come first*.md"))
        case("a question is admitted: its dated line is in the questions file, the note quotes it, check passes", a.get("ok") and check() and asked.exists()
             and "Does the mouth map come first?" in asked.read_text(encoding="utf-8") and qn and "trigeminal timing" in qn[0].read_text(encoding="utf-8"), a)

        subprocess.run(["git", "-C", str(wt), "add", "-A"], capture_output=True)
        base4 = status()
        r = py("-c", "import sys, json; sys.path.insert(0, 'tools/dm'); import dmlib as D\n"
               "n = D.read_all()\n"
               "body = [p['key'] for (k, nm), p in sorted(n.items()) if k == 'Claim' and 'record_file' not in p and 'module' not in p and isinstance(p.get('value'), float) and not p.get('evidence') and not str(p.get('status', '')).startswith('source-found')]\n"
               "learner = [p.get('key', nm) for (k, nm), p in sorted(n.items()) if k == 'Claim' and 'module' in p]\n"
               "paper = [nm for (k, nm), p in sorted(n.items()) if k == 'Source' and 'record_file' not in p]\n"
               "print(json.dumps([body[0], learner[0], paper[0], n[('Claim', D.safe(body[0]))]['value']]))")
        key, learner, paper, old = json.loads(r.stdout)
        a = api(action="value_preview", key=key, value=json.dumps(old * 2))
        case("a value preview shows before and what to look at again, and writes nothing", a.get("ok") and a["before"]["value"] == old and a.get("impact") and status() == base4, a)
        a = api(action="value_save", key=learner, value="1")
        unchanged("a learner constant is not changed in the form", base4, a)
        a = api(action="value_save", key=key, value="not a number")
        unchanged("a value that is not a number, text or list is refused", base4, a)
        a = api(action="value_save", key="no.such.key", value="1")
        unchanged("an unknown key is refused", base4, a)
        a = api(action="evidence_save", key=key, paper="p-not-in-register", locator="p. 1", quote="some words")
        unchanged("a passage of a paper that is not in the register is refused", base4, a)
        a = api(action="evidence_save", key=key, paper=paper, locator="", quote="")
        unchanged("a passage without its words and place is refused", base4, a)
        a = api(action="evidence_save", key=key, paper=paper, locator="p. 1", quote="a passage read for the test", link_status="lead")
        unchanged("a passage whose kind is not one of the three is refused", base4, a)
        a = api(action="evidence_save", key=key, paper=paper, locator="p. 1", quote="a passage read for the test")
        unchanged("a passage whose kind is left out is refused", base4, a)
        a = api(action="value_save", key=key, status="approved")
        unchanged("a status that is not one of the statuses is refused", base4, a)
        a = api(action="value_save", key=key, value=json.dumps(old * 2))
        case("a value change answers ok with a passing check, or is refused with nothing changed", (a.get("ok") and a["after"]["value"] == old * 2 and check()) or (a.get("ok") is False and status() == base4),
             ("ok " if a.get("ok") else "refused ") + json.dumps(a.get("errors"))[:150])
        subprocess.run(["git", "-C", str(wt), "add", "-A"], capture_output=True)
        base5 = status()
        a = api(action="evidence_save", key=key, paper=paper, locator="p. 1", quote="a passage read for the test", value_in_source="1", species_age="human fetal 12 weeks", transfer="none", link_status="source-found-fetal")
        case("a passage answers ok with a passing check, or is refused with nothing changed", (a.get("ok") and a["after"]["evidence"] == 1 and check()) or (a.get("ok") is False and status() == base5),
             ("ok " if a.get("ok") else "refused ") + json.dumps(a.get("errors"))[:150])
    finally:
        subprocess.run(["git", "-C", str(ROOT), "worktree", "remove", "--force", str(wt)], capture_output=True)
        shutil.rmtree(tmp, ignore_errors=True)
    for title, ok, detail in out:
        print(("ok    " if ok else "FAIL  ") + title + ("" if ok and not title.startswith("  seconds") and "answers ok" not in title else "   " + detail))
    bad = sum(1 for _, ok, _ in out if not ok)
    print("%d of %d cases hold" % (len(out) - bad, len(out)))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
