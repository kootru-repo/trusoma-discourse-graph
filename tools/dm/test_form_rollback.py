"""Four cases of a refused save meeting its author's own typing. Run by test_form_api.py inside its throw-away worktree, never in the real tree.
Each case makes a save that the check refuses (a Result whose quote is not in its record), lets "the author" change files at a chosen moment, and
reads what the rollback left. Prints one JSON object {case title: true, or what was found}; every file is put back before the next case.
usage (from test_form_api.py): python tools/dm/test_form_rollback.py RECORD EXPERIMENT"""
import json, pathlib, shutil, subprocess, sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import dmlib as D, form_api as F

RECORD, EXPERIMENT = sys.argv[1], sys.argv[2]
RUN = subprocess.run
SAVED = b"a line the save wrote"
# the longest claim note: room for the save and the author to change lines far apart
OTHER = max(D.NODES.glob("CLM - *.md"), key=lambda p: p.stat().st_size)
ORIGINAL = OTHER.read_bytes()
# where an author types in a note of the graph: under its Notes heading (the body above it is generated, and every regeneration rewrites it)
MARK = D.NOTES_MARK.encode("utf-8")
TYPED = (b"" if MARK in ORIGINAL else b"\n" + MARK + b"\n") + b"\ntyped meanwhile\n"
NEW = D.NODES / "begun in the graph meanwhile.md"
RESULT = D.NODES / "RES - rolled back.md"
out = {}


def bad_result():
    D.write_note_kind("Result", "rolled back", {"reading": "observation", "counted": False, "record": RECORD, "quote": "not in the record", "experiment": EXPERIMENT})


def by_another_process(code):
    """a change no part of this process makes: what Obsidian does when its author types"""
    RUN([sys.executable, "-B", "-c", code], check=True)


def during_the_check(change):
    def run(*a, **k):
        F.subprocess.run = RUN
        change()
        return RUN(*a, **k)
    F.subprocess.run = run


def tidy():
    F.subprocess.run = RUN
    OTHER.write_bytes(ORIGINAL)
    for p in (NEW, RESULT):
        if p.exists():
            p.unlink()
    shutil.rmtree(F.KEPT, ignore_errors=True)
    D._CACHE.clear()


def reading(title, ok, found):
    out[title] = True if ok else found
    tidy()


# 1. typing in another note, and a new note, while the check runs
def typing():
    OTHER.write_bytes(ORIGINAL + TYPED)
    NEW.write_text("plain", encoding="utf-8")
during_the_check(typing)
a = F.guarded(bad_result)
found = [a["ok"], OTHER.read_bytes() == ORIGINAL + TYPED, NEW.exists(), RESULT.exists()]
reading("a rollback undoes the save only: text typed into another note and a note begun during the check both stay", found == [False, True, True, False], found)


# 2. the same, but in the first moment of the save, before it has finished writing
def write_with_typing():
    by_another_process("import pathlib; p = pathlib.Path(%r); p.write_bytes(p.read_bytes() + %r); pathlib.Path(%r).write_text('plain', encoding='utf-8')" % (str(OTHER), TYPED, str(NEW)))
    bad_result()
a = F.guarded(write_with_typing)
found = [a["ok"], OTHER.read_bytes() == ORIGINAL + TYPED, NEW.exists(), RESULT.exists()]
reading("text typed into another note while the save was still writing stays too", found == [False, True, True, False], found)


# 3 and 4 read the rollback itself: the save changed a line near the start of a note, and its author then changed the note
lines = ORIGINAL.split(b"\n")
AFTER = b"\n".join(lines[:3] + [SAVED] + lines[3:])   # what the save left


def rolled_back(now):
    OTHER.write_bytes(now)
    return F.restore({OTHER: ORIGINAL}, {OTHER: AFTER})


kept = rolled_back(AFTER + TYPED)   # typing at the end, far from the save's line
found = [len(lines) > 12, OTHER.read_bytes() == ORIGINAL + TYPED, kept, F.KEPT.exists()]
reading("a note the save rewrote and its author then typed in: the save's change is taken out, the typing stays", found == [True, True, [], False], found)

kept = rolled_back(AFTER.replace(SAVED, SAVED + b" and typed over"))   # typing in the very line the save wrote
copies = list(F.KEPT.glob("*.md")) if F.KEPT.exists() else []
found = [OTHER.read_bytes() == ORIGINAL, len(copies), bool(copies) and b"typed over" in copies[0].read_bytes(), len(kept) == 1 and "Your version is kept in local/form_api_kept/" in kept[0]]
reading("when the typing is in the very lines the save changed: the note is put back, the typed version is kept in a copy, and the answer says where", found == [True, 1, True, True], found)

sys.stdout.write(json.dumps(out, ensure_ascii=False))
