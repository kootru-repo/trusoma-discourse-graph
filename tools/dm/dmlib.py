"""Shared helpers of the vault tools (phase 1 of companion/DM_CONVERSION_PLAN_2026-11-15.md). Nothing here touches the brain package.
Note format: markdown with a frontmatter block; every property is `name: <JSON>` on one line (JSON scalars, lists and objects are valid YAML flow syntax, so
Obsidian reads them, and this reader needs no YAML library). Titles follow the lab-vault grammar: "CLM - {content}", "EVD - {content}", "@{content}"."""
import hashlib, json, pathlib, uuid, re
import readable

ROOT = pathlib.Path(__file__).resolve().parents[2]
VAULT = ROOT / "vault"
NODES = VAULT / "DiscourseGraph"   # discourse nodes: Claim, Evidence, Source, Issue
TABLES = VAULT / "Tables"   # Record notes: one row of an authored table each, no discourse meaning (kept out of the plugin's node folder and of Obsidian's graph and search)
RELATIONS = VAULT / "relations.json"
CONFIG = ROOT / "tools/trusoma/brain/global_config.json"
# node and relation type ids of the lab vault's schema (DiscourseGraphs/obsidian-lab-example), adopted as our grammar; replaced by our own schema export in phase 0 when the plugin is installed
NODE_TYPE = {"Claim": "node_LwROzkVH_Zck7ZxDgN91E", "Evidence": "node_xQmEzWQFHdHy2swhrugrF", "Source": "node_-PIYSmr5icSFMACYAUobE", "Issue": "node_2unblKFUVJkOdOnT8MstZ",
             "Question": "node_4SqRl5RIkaUMb9fLOpdhq", "Hypothesis": "node_8eLgGKXiSzIWJvcrGCBFE", "Experiment": "node_Qbdr-LbBCb_WjPFNTnjTX",
             "Result": "node_i7PzyKw2NfkA8asBfxeey", "Conclusion": "node_J9JyrRTQj6nuJs6IY83Mo",
             "Record": "trusoma-record"}   # Record is ours: a data row with no discourse meaning (not a plugin node type)
PREFIX = {"Claim": "CLM - ", "Evidence": "EVD - ", "Source": "@", "Issue": "ISS - ", "Record": "REC - ",
          "Question": "QUE - ", "Hypothesis": "HYP- ", "Experiment": "EXP - ", "Result": "RES - ", "Conclusion": "CON - "}   # the plugin's own title formats ("HYP- " has no space before the hyphen there)
REL_TYPE = {"supports": "relation_Fvz-iAdQfeqSsmpKkZBN0", "produces": "rel_5nnUOb6wBzlAwAF2Wk-ts", "opposes": "relation_eGQp4gFgaNvQsJd3x8Nj9", "informs": "relation_G8GMDxjFv_e5ePzoR7uYn",
            "consistent_with": "rel_E2h9UFdS53YWki3-nczo0", "motivates": "rel_M4xTO_--Zo4nsjQGab9bz", "addresses": "rel_Ge2hTgsP6UFabvpMY45wN"}
# A configuration value with no source is written to disk as a Parameter note (readable.is_parameter): a setting, not an assertion. Inside the tools it stays a Claim of
# the same name and id, so no reader of values changes; only the note's type, prefix and title on disk differ.
PREFIX["Parameter"] = "PAR - "
OUR_PREFIXES = tuple(sorted(set(PREFIX.values())))   # the title starts the tools give; taken from PREFIX so the two cannot drift
# properties the tools write and the plugin's own dialog does not: a note without dg_type that carries one is a note of the graph that lost its type line
TOOL_PROPS = ("dg_name", "record_file", "record", "quote", "paper_id", "key", "module", "order")
NODE_TYPE["Parameter"] = "node_trusomaParameter00001"
DISCOURSE = ("Question", "Hypothesis", "Experiment", "Result")   # the probe record (plan section 18, O2): no value, every note quotes its record file verbatim
# (note kind, property holding wiki-links, relation, kind at the other end, True when the note is the relation's source). Every triple is one of the plugin grammar's
# discourseRelations (lab vault schema); a relation exists only as one of these properties, relations.json is generated from them.
EDGE_RULES = (
    ("Hypothesis", "question", "motivates", "Question", False),      # Question motivates Hypothesis
    ("Hypothesis", "informed_by", "informs", "Claim", False),        # Claim informs Hypothesis (the sourced values the criterion rests on)
    ("Hypothesis", "issues", "motivates", "Issue", True),            # Hypothesis motivates Issue (what blocks its test)
    ("Experiment", "hypotheses", "motivates", "Hypothesis", False),  # Hypothesis motivates Experiment
    ("Experiment", "issues", "produces", "Issue", True),             # Experiment produces Issue
    ("Result", "experiment", "produces", "Experiment", False),       # Experiment produces Result
    ("Result", "supports", "supports", "Claim", True),
    ("Result", "opposes", "opposes", "Claim", True),
    ("Result", "consistent_with", "consistent_with", "Hypothesis", True),
    ("Result", "against", "opposes", "Hypothesis", True),            # Result opposes Hypothesis: named by hand when its experiment tested several hypotheses (a failed or null reading only)
    ("Result", "answers", "informs", "Question", True),              # Result informs Question: the question the record itself says this run was for (answers_basis quotes where)
    ("Question", "informed_by", "informs", "Claim", False),          # Claim informs Question
    ("Claim", "informs", "informs", "Claim", True),                  # Claim informs Claim
    ("Claim", "addresses", "addresses", "Question", True),           # Claim addresses Question
    ("Evidence", "opposes", "opposes", "Claim", True),               # Evidence opposes Claim: a conflict between sources that the vault itself states (opposes_basis quotes where)
    ("Claim", "opposes", "opposes", "Claim", True),                  # Claim opposes Claim (our triple): two records that the vault itself says disagree (opposes_basis quotes where)
)
ON_RECORDS = {("Evidence", "opposes"), ("Claim", "opposes")}   # the rules that also hold on a record note (a growth web value is a record note); the other rules are for authored notes only
# triples of ours that are not in the lab schema; each is written into vault/Meta/grammar.json and the plugin settings by tools/dm/schema_tool.py
OWN_TRIPLES = (("Result", "informs", "Question"), ("Result", "opposes", "Hypothesis"), ("Claim", "opposes", "Claim"), ("Evidence", "informs", "Parameter"), ("Source", "informs", "Claim"), ("Issue", "informs", "Claim"), ("Issue", "informs", "Parameter"))   # the last: a passage that bears on a setting which still has no accepted source
KEY_TOKEN = re.compile(r"[A-Za-z_][A-Za-z0-9_]*(?:[.][A-Za-z0-9_~]+)+")   # the shape of a configuration key inside free text
GROUP_REF = re.compile(r"([A-Za-z_][A-Za-z0-9_]*(?:[.][A-Za-z0-9_~]+)+) [(]([0-9]+) values[)]")   # a group of values named in an audit item's ref
WORD = re.compile(r"[A-Za-z_][A-Za-z0-9_]*")
KEY_RANGE = re.compile(r"((?:[A-Za-z_][A-Za-z0-9_]*[.])+)([A-Za-z_]+)([0-9]+)-(?:\2)?([0-9]+)(?![0-9A-Za-z_]|[.][0-9A-Za-z_])")   # a run of numbered keys written as first-last
RANGE_MAX = 50   # op: bound, a longer run is not read as a key range


def with_ranges(text):
    """the text with every key of a range written out after it ("a.n1-n3" also names a.n2 and a.n3), so the key pattern finds each"""
    extra = []
    for path, letters, a, b in KEY_RANGE.findall(text):   # the same letters on both ends, or none on the second
        stem = path + letters
        if int(a) < int(b) <= int(a) + RANGE_MAX:
            extra += ["%s%d" % (stem, i) for i in range(int(a), int(b) + 1)]
    return text + (" " + " ".join(extra) if extra else "")
AGAINST = ("fail", "no-signal")   # readings of a Result that stand against the hypothesis its experiment tested
BIG_VALUE_BYTES = 20000   # a value longer than this (as JSON) is kept in vault/Data/<key>.json, not in the note: a property line that long makes Obsidian slow
STAMP_MS = 1794700800000   # 2026-11-15T00:00:00Z, the import date, written into generated relations so regeneration is reproducible


def node_id(kind, name):
    """deterministic uuidv7-shaped id (version and variant bits set) from the node's kind and name"""
    b = bytearray(hashlib.sha256(("trusoma:%s:%s" % (kind, name)).encode("utf-8")).digest()[:16])
    b[6] = (b[6] & 0x0F) | 0x70
    b[8] = (b[8] & 0x3F) | 0x80
    return str(uuid.UUID(bytes=bytes(b)))


BAD_NAME_CHARS = "[]|^<>:\"/" + chr(92) + "?*"


def safe(name):
    """note name for a key or id: '#' would turn a wiki-link into a heading link, so it is written '~'; no other link or file metacharacter may occur"""
    s = name.replace("#", "~")
    assert not any(ch in s for ch in BAD_NAME_CHARS) and len(s) < 150, "unsafe note name: " + name
    return s


def canon(kind, name):
    """the stable handle form of a note: type prefix + name. A note's id and the ids of its relations derive from it, never from the file's title, so a note can be
    retitled without changing any id (the name is kept in the note's dg_name property when the title differs)"""
    return PREFIX[kind] + name


def title(kind, name):
    """the note's title (its file name without .md): the file that holds it now, else the title derived for it, else the handle form"""
    stems = _CACHE.get("stem")
    if stems is None and "reading" not in _CACHE:
        read_all()
        stems = _CACHE.get("stem")
    return (stems or {}).get((kind, name)) or canon(kind, name)


def link(kind, name):
    return "[[%s]]" % title(kind, name)


def write_note_kind(kind, name, props):
    old = title(kind, name)
    _CACHE.clear()
    dk = disk_kind(kind, props)
    head = {("recordTypeId" if kind == "Record" else "nodeTypeId"): NODE_TYPE[dk], "nodeInstanceId": node_id(kind, name), "dg_type": dk}
    folder = TABLES if kind == "Record" else NODES
    folder.mkdir(parents=True, exist_ok=True)
    stem = old if (folder / (old + ".md")).exists() else PREFIX[dk] + name   # an existing note keeps its file; a title changes only through retitle()
    if stem != PREFIX[dk] + name:
        head["dg_name"] = name   # the stable name of a note whose title is not its prefix and name (right after dg_type, where retitle() keeps it)
    head.update({k: v for k, v in props.items() if k not in ("dg_name", "recordTypeId")})
    lines = ["---"] + ["%s: %s" % (k, json.dumps(v, ensure_ascii=False)) for k, v in head.items()] + ["---", ""]
    path = folder / (stem + ".md")
    kept = notes_of(path.read_text(encoding="utf-8")) if path.exists() else ""   # a person's own notes under "## Notes" survive every rewrite
    path.write_text("\n".join(lines) + with_notes(readable.body(kind, name, head), kept), encoding="utf-8", newline="\n")   # the body is derived, never authored (readable.py)


NOTES_MARK = "## Notes"   # everything from this heading to the end of a note is the reader's own writing: never generated, never checked, never read by a tool


def notes_of(text):
    """the free part of a note: from the heading line 'Notes' (any level, any case: '## Notes', '### notes') to the end ('' when the note has none)"""
    nl = chr(10)
    end = text.find(nl + "---", 3)
    pos = (end if end > 0 else 0) + 1
    for line in text[pos:].split(nl):
        if line.startswith("#") and line.lstrip("#").strip().lower() == "notes":
            return text[pos:]
        pos += len(line) + 1
    return ""


def with_notes(body, notes):
    """the derived body followed, after one empty line, by the reader's own notes"""
    return body + chr(10) + notes if notes else body


def disk_kind(kind, props):
    """the note type written to disk: Parameter for a configuration value with no source, else the kind itself"""
    return "Parameter" if kind == "Claim" and readable.is_parameter(props) else kind


def _wanted_titles():
    """({(kind, name): the title derived from the note's properties} for the notes whose title is derived, {(kind, name): the current title} for every note)"""
    nodes = read_all()
    sources = {n: p for (k, n), p in nodes.items() if k == "Source"}
    first = {}   # the first Evidence note of each configuration value: the one its own evidence list names first, else the first that applies to it
    for (kind, name), p in sorted(nodes.items()):
        if kind == "Evidence" and "record_file" not in p:
            for l in links_of(p.get("claim")) + links_of(p.get("applies_to")):
                first.setdefault(target_of(l, "Claim"), p)
    want = {}
    for (kind, name), p in nodes.items():
        ev = None
        if kind == "Claim" and "record_file" not in p:
            own = [nodes.get(("Evidence", target_of(l, "Evidence"))) for l in links_of(p.get("evidence"))]
            ev = next((e for e in own if e), None) or first.get(name)
        t = None if kind == "Record" else readable.title(kind, name, p, sources, ev)
        if t is not None:
            want[(kind, name)] = t
    return want, dict(_CACHE["stem"])


def title_problems():
    """notes whose title or type on disk is not the one derived from their properties"""
    want, have = _wanted_titles()
    nodes = read_all()
    out = ["%s.md: the title should be %r (titles are generated: run tools/dm/build_from_vault.py write)" % (have[k], t) for k, t in sorted(want.items()) if have[k] != t]
    out += ["%s.md: the note type on disk should be %s" % (have[(k, n)], disk_kind(k, p)) for (k, n), p in nodes.items() if k != "Record" and p["dg_type"] != disk_kind(k, p)]
    return out


def retitle():
    """rename every note whose derived title differs from its file name, set its type and dg_name, and rewrite the wiki-links to it in every note. No id changes: a note's
    id and its relations derive from its name. Returns the number of notes renamed or retyped."""
    want, have = _wanted_titles()
    nodes = read_all()
    moves = {have[k]: t for k, t in want.items() if have[k] != t}
    retype = {(k, n) for (k, n), p in nodes.items() if k != "Record" and p["dg_type"] != disk_kind(k, p)}
    if not moves and not retype:
        return 0
    seen = set()
    for s in (moves.get(s, s) for s in have.values()):
        assert s.lower() not in seen, "two notes would get the title %r" % s
        seen.add(s.lower())
    def relink(text):
        out, i = [], 0
        while True:
            a = text.find("[[", i)
            b = text.find("]]", a + 2) if a >= 0 else -1
            if a < 0 or b < 0:
                return "".join(out) + text[i:]
            inner = text[a + 2:b]
            out.append(text[i:a] + "[[" + moves.get(inner, inner) + "]]")
            i = b + 2
    for (kind, name), stem in have.items():
        folder = TABLES if kind == "Record" else NODES
        path = folder / (stem + ".md")
        text = path.read_text(encoding="utf-8")
        new = relink(text) if moves else text
        new_stem = moves.get(stem, stem)
        if kind != "Record":
            dk = disk_kind(kind, nodes[(kind, name)])
            lines = new.split(chr(10))
            end = lines.index("---", 1)
            head = [l for l in lines[1:end] if not l.startswith("dg_name: ")]
            head = [("nodeTypeId: " + json.dumps(NODE_TYPE[dk])) if l.startswith("nodeTypeId: ") else ("dg_type: " + json.dumps(dk)) if l.startswith("dg_type: ") else l for l in head]
            if new_stem != PREFIX[dk] + name:
                at = next(i for i, l in enumerate(head) if l.startswith("dg_type: ")) + 1
                head.insert(at, "dg_name: " + json.dumps(name, ensure_ascii=False))
            new = chr(10).join(lines[:1] + head + lines[end:])
        if new_stem != stem:
            path.unlink()
        if new != text or new_stem != stem:
            (folder / (new_stem + ".md")).write_text(new, encoding="utf-8", newline=chr(10))
    _CACHE.clear()
    return len(moves) + len(retype)


def _stale_bodies():
    """(path, text up to and including the frontmatter's closing line, derived body) of every node note whose body is not the text derived from its own properties"""
    for p in sorted(NODES.glob("*.md")):
        props = plain(p)
        if props is None or props.get("importedFromRid") or "dg_type" not in props:
            continue
        kind = "Claim" if props["dg_type"] == "Parameter" else props["dg_type"]
        text = p.read_text(encoding="utf-8")
        cut = text.index(chr(10) + "---", 3) + 5
        want = with_notes(readable.body(kind, name_of(p, props), props), notes_of(text))
        if text[cut:] != want:
            yield p, text[:cut], want


def body_problems():
    """node notes with a hand-written or stale body"""
    return ["%s: the body differs from the text derived from its properties (bodies are generated: tools/dm/build_from_vault.py write rebuilds it, and REPLACES any text of yours that is not under a '## Notes' heading: move it there first)" % p.name for p, _, _ in _stale_bodies()]


def refresh_bodies():
    """retitle the notes whose derived title changed, then rebuild the body of every note where it is stale; apart from a retitled note's type and name lines the
    frontmatter is left exactly as it is. Returns the number of notes rewritten."""
    n = retitle()
    _CACHE.clear()
    stale = list(_stale_bodies())
    if stale:
        keep = ROOT / "local" / "dg_guard" / "replaced_bodies"
        keep.mkdir(parents=True, exist_ok=True)
        for p, head, want in stale:   # what is about to be replaced (a stale generated body, or text someone typed outside "## Notes") is kept here first
            old = p.read_text(encoding="utf-8")
            (keep / p.name).write_text(old[len(head):] if old.startswith(head) else old, encoding="utf-8", newline=chr(10))
        print("bodies replaced: %d (the replaced text of each is kept in local/dg_guard/replaced_bodies/)" % len(stale))
    for p, head, want in stale:
        p.write_text(head.rstrip(chr(10)) + chr(10) + want, encoding="utf-8", newline=chr(10))
        n += 1
    return n


class UnreadableNote(Exception):
    """a note with a property block that cannot be read. Not a ValueError on purpose: plain() takes a ValueError to mean "a person's plain note" and skips
    the note, and a node note that cannot be read must stop the check and the write instead of dropping out of the generated files (review of ae3fb58b)"""


def plain(path):
    """the properties of a note, or None for a plain note of a person (no frontmatter, or neither dg_type nor nodeTypeId): such a note is not part of the graph and is never read"""
    try:
        props = read_note(path)
    except ValueError as e:
        # a person's plain note carries none of our lines. A note that carries one and cannot be read (a byte-order mark before the first ---, a byte
        # that is not UTF-8, a closing line that is missing or has a trailing space) is a note of the graph: skipping it drops its row from the generated
        # files with the check passing (review of f5f30000), so it stops the check and the write instead
        marks = (b"nodeInstanceId: ", b"dg_type: ", b"recordTypeId: ", b"nodeTypeId: ")
        with open(path, "rb") as f:
            raw = f.read()
        searched = [raw]
        if raw[:2] in (b"\xff\xfe", b"\xfe\xff") or b"\x00" in raw:   # UTF-16, which Windows PowerShell 5.1 writes with > and Out-File (review of e7f9def8)
            searched += [raw.decode(enc, "replace").encode("utf-8") for enc in ("utf-16", "utf-16-le", "utf-16-be")]
        if any(line.lstrip(b"\xef\xbb\xbf").startswith(marks) for s in searched for line in s.splitlines()):
            raise UnreadableNote("%s: a note with a line of the graph (dg_type, nodeTypeId, nodeInstanceId or recordTypeId) whose properties cannot be read (%s)"
                                 % (path, str(e).rsplit(": ", 1)[-1][:120]))
        return None
    return props if ("dg_type" in props or "nodeTypeId" in props or "recordTypeId" in props) else None


def _yaml_plain(text):
    """YAML read the way Obsidian reads it: a key is always text, and only true/false, null and numbers are typed. PyYAML's default (YAML 1.1) reads
    the key `on` as True and an unquoted 2026-11-17 as a date object; both were seen on notes the plugin rewrote when it published them (2026-11-17)."""
    import re, yaml

    class Loader(yaml.SafeLoader):
        pass
    Loader.yaml_implicit_resolvers = {ch: [(tag, rx) for tag, rx in rs if tag not in ("tag:yaml.org,2002:timestamp", "tag:yaml.org,2002:bool", "tag:yaml.org,2002:float", "tag:yaml.org,2002:int")]
                                      for ch, rs in yaml.SafeLoader.yaml_implicit_resolvers.items()}
    Loader.add_implicit_resolver("tag:yaml.org,2002:bool", re.compile(r"^(?:true|True|TRUE|false|False|FALSE)$"), list("tTfF"))
    # whole numbers in plain decimal only: 012, 1_000 and 12:30 stay text (PyYAML's own rule reads them as 10, 1000 and 750)
    Loader.add_implicit_resolver("tag:yaml.org,2002:int", re.compile(r"^[-+]?(?:0|[1-9][0-9]*)$"), list("-+0123456789"))
    # a number with an exponent and no point (1e-9, which is how JavaScript writes it) is a number; PyYAML's own rule wants a point and reads it as text
    Loader.add_implicit_resolver("tag:yaml.org,2002:float", re.compile(r"^[-+]?(?:\.[0-9]+|(?:0|[1-9][0-9]*)(?:\.[0-9]*)?)(?:[eE][-+]?[0-9]+)?$|^[-+]?\.(?:inf|Inf|INF)$|^\.(?:nan|NaN|NAN)$"), list("-+0123456789."))

    def mapping(loader, node, deep=False):   # keys stay the text that stands in the file
        return {(k.value if isinstance(k, yaml.ScalarNode) else loader.construct_object(k, deep=True)): loader.construct_object(v, deep=True) for k, v in node.value}
    Loader.add_constructor("tag:yaml.org,2002:map", mapping)
    return yaml.load(text, Loader=Loader)


def read_note(path):
    text = pathlib.Path(path).read_text(encoding="utf-8")
    lines = text.split("\n")
    if not lines or lines[0] != "---":
        raise ValueError("%s: no frontmatter" % path)
    end = next((i for i, ln in enumerate(lines[1:], 1) if ln == "---"), None)
    if end is None:
        raise ValueError("%s: frontmatter not closed" % path)
    props = {}
    try:
        for ln in lines[1:end]:
            k, _, v = ln.partition(": ")
            props[k] = json.loads(v)
        return props
    except json.JSONDecodeError:
        pass
    # not our one-JSON-value-per-line format (a note saved by Obsidian's property editor): read it as YAML; any misreading shows up as a difference in the regenerated files
    try:
        parsed = _yaml_plain("\n".join(lines[1:end]))
    except Exception as e:   # text the YAML reader cannot take (a tab, a stray mark): name the note, do not stop with a bare library error
        raise UnreadableNote("%s: the properties cannot be read as YAML (%s)" % (path, str(e).split("\n")[0][:120]))
    if not isinstance(parsed, dict):
        raise ValueError("%s: frontmatter is not a mapping" % path)
    return parsed


_CACHE = {}


def read_all():
    """{(dg_type, name): props} for every node note in the vault (parsed once per process; a write clears the cache)"""
    if "all" in _CACHE:
        return _CACHE["all"]
    out, stems, by_stem, people, plains = {}, {}, {}, [], []
    _CACHE["reading"] = True
    try:
        _read_into(out, stems, by_stem, people, plains)
    finally:
        _CACHE.pop("reading", None)
    _CACHE.update(all=out, stem=stems, by_stem=by_stem, people=people, plains=plains)
    return out


def _read_into(out, stems, by_stem, people, plains):
    for p in sorted(NODES.glob("*.md")) + sorted(TABLES.glob("*.md")):
        props = plain(p)
        if props is None:   # an ordinary note someone keeps in the folder: not a node, never read, never rewritten
            # the last guard, whatever the cause (an emptied file, a second --- line, anything later): a file that reads as plain but is named the way the
            # tools name a node or a record is not skipped, because skipping it drops its row from the generated files with the check passing
            if p.name.startswith(OUR_PREFIXES):
                raise UnreadableNote("%s: named like a note of the graph (it begins with %r) but it has no readable properties of one; mend the note or rename it"
                                     % (p, next(x for x in OUR_PREFIXES if p.name.startswith(x))))
            plains.append(p)
            continue
        if props.get("importedFromRid"):   # a note imported from another space by the plugin (normally under vault/import/, which is not read): never ours, never a value
            continue
        if "dg_type" not in props:   # a note a person created in Obsidian with the plugin: theirs, never a value, never rewritten (validate_vault.py checks its type is known)
            lost = [k for k in TOOL_PROPS if k in props]
            if lost:   # the plugin's dialog writes none of these: this is a note of the graph whose dg_type line was removed, and skipping it drops its row
                raise UnreadableNote("%s: a note of the graph without its dg_type property (it carries %s); put the dg_type line back" % (p, ", ".join(lost)))
            people.append(p)
            continue
        kind = "Claim" if props["dg_type"] == "Parameter" else props["dg_type"]
        name = name_of(p, props)
        assert (kind, name) not in out, "two notes hold %s %s" % (kind, name)
        out[(kind, name)] = props
        stems[(kind, name)] = p.stem
        by_stem[p.stem] = (kind, name)
    # a note of the graph moved out of the top level of the two folders (a subfolder, the vault root, another folder: ordinary use of Obsidian) is not
    # read above, so its row would drop from the generated files with every check passing (review of 13698d7d): stop and say where it is
    for q in sorted(VAULT.rglob("*.md")):
        part = q.relative_to(VAULT).parts
        if q.parent in (NODES, TABLES) or part[0] in (".obsidian", ".trash"):   # vault/Meta and vault/import are looked at too (review of b68d4578)
            continue
        try:
            props = plain(q)
        except UnreadableNote:
            if part[0] == "import":   # a note imported from another space is never ours and must never stop the tools
                continue
            raise
        ours = (props is not None and not props.get("importedFromRid") and ("dg_type" in props or any(k in props for k in TOOL_PROPS))) or \
               (props is None and part[0] in (NODES.name, TABLES.name) and q.name.startswith(OUR_PREFIXES))
        if ours:
            raise UnreadableNote("%s: a note of the graph outside the top level of vault/%s and vault/%s, where the tools do not read it; move it back" % (q, NODES.name, TABLES.name))


def plain_notes():
    """ordinary notes in the vault folders that are not nodes (paths only)"""
    read_all()
    return list(_CACHE.get("plains", []))


def people_notes():
    """the notes a person created with the plugin (no dg_type): paths only"""
    read_all()
    return list(_CACHE.get("people", []))


def name_of(path, props):
    """a note's stable name: its dg_name property when it has been retitled, else its title without the type prefix"""
    if props.get("dg_name"):
        return props["dg_name"]
    kind = props["dg_type"]
    assert path.stem.startswith(PREFIX[kind]), "%s: title does not match type %s and the note has no dg_name" % (path.name, kind)
    return path.stem[len(PREFIX[kind]):]


def relation_record(kind, source_title, dest_title, source_id, dest_id):
    rid = node_id("relation", "%s|%s|%s" % (kind, source_title, dest_title))
    return rid, {"id": rid, "type": REL_TYPE[kind], "source": source_id, "destination": dest_id, "created": STAMP_MS, "lastModified": STAMP_MS}


write_note = write_note_kind

RELATION_CORE = ("id", "type", "source", "destination", "created")   # the fields of a relation that our notes imply
RELATION_PLUGIN_FIELDS = ("lastModified", "publishedToGroupId", "authorId", "tentative")   # fields the plugin adds to a relation of ours (publishing to a group); kept on regeneration


def is_rid(x):
    """a resource id of another space, as the plugin writes it for the ends of an imported relation (packages/database/src/lib/rid.ts)"""
    return isinstance(x, str) and (x.startswith("orn:") or x.startswith("https://"))


def imported_ids():
    """nodeInstanceId of every note the plugin imported from another space: the notes under vault/import/ and any note that carries importedFromRid (ids only; nothing else of them is read)"""
    if "imported" not in _CACHE:
        out = set()
        for p in list((VAULT / "import").rglob("*.md")) + list(NODES.glob("*.md")):
            try:
                props = read_note(p)
            except Exception:
                continue
            if isinstance(props, dict) and props.get("nodeInstanceId") and (props.get("importedFromRid") or VAULT / "import" in p.parents or "dg_type" not in props):   # a person's own note counts like an imported one: its relations are kept, never authored or dropped
                out.add(props["nodeInstanceId"])
        _CACHE["imported"] = out
    return _CACHE["imported"]


def split_relations(relations, nodes):
    """(ours, foreign, stale) of a relations.json map.
    Ours: both ends are notes of this vault and the record was not imported.
    Foreign: the record carries importedFromRid, or an end is a resource id of another space, or an end is a note imported from another space. Foreign relations are carried
    through unchanged: never generated, never read as sourcing, never written into a note property, never dropped.
    Stale: anything else (an end that is no note at all, as after one of our notes was deleted or renamed): dropped by a regeneration, refused by the check."""
    local = {p["nodeInstanceId"] for p in nodes.values()}
    imported = imported_ids()
    ours, foreign, stale = {}, {}, {}
    for rid, r in relations.items():
        ends = (r.get("source"), r.get("destination")) if isinstance(r, dict) else (None, None)
        if isinstance(r, dict) and (r.get("importedFromRid") or any(is_rid(e) or e in imported for e in ends)):
            foreign[rid] = r
        elif isinstance(r, dict) and all(e in local for e in ends):
            ours[rid] = r
        else:
            stale[rid] = r
    return ours, foreign, stale


def strip_props(path, names):
    """remove frontmatter properties from a note file (used for the public extract); True when something was removed"""
    props = read_note(path)
    if not any(n in props for n in names):
        return False
    text = pathlib.Path(path).read_text(encoding="utf-8")
    body = text[text.index(chr(10) + "---", 3) + 4:]   # what follows the closing line of the frontmatter
    lines = ["---"] + ["%s: %s" % (k, json.dumps(v, ensure_ascii=False)) for k, v in props.items() if k not in names] + ["---"]
    pathlib.Path(path).write_text(chr(10).join(lines) + body, encoding="utf-8", newline=chr(10))
    return True


def relation_core(r):
    return {k: r[k] for k in RELATION_CORE if k in r}


def merged_relations(nodes, existing):
    """the relations.json map to write: the relations the notes imply (with the plugin's own fields of an existing record kept), plus the foreign relations as they are"""
    ours, foreign, _stale = split_relations(existing, nodes)   # stale records are not written back
    out = {}
    for rid, rec in expected_relations(nodes).items():
        rec = dict(rec)
        for k in RELATION_PLUGIN_FIELDS:
            if k in ours.get(rid, {}):
                rec[k] = ours[rid][k]
        out[rid] = rec
    out.update(foreign)
    return out


def existing_relations():
    try:
        return json.load(open(RELATIONS, encoding="utf-8"))["relations"]
    except (FileNotFoundError, KeyError, ValueError):
        return {}


def target_of(link, kind):
    """the name of the note of this kind that a wiki-link points at (through the note's title), or None"""
    if not link or not (link.startswith("[[") and link.endswith("]]")):
        return None
    read_all()
    hit = _CACHE["by_stem"].get(link[2:-2])
    if hit:
        return hit[1] if hit[0] == kind else None
    return link[2 + len(PREFIX[kind]):-2] if link.startswith("[[" + PREFIX[kind]) else None   # no such note: the name the link spells (the caller reports it as unresolved)


GWEB_KIND = {"edges": "Claim", "values": "Evidence", "tests": "Hypothesis"}   # growth web parts that are discourse: a mechanism, a sourced quoted number, a test statement


def gweb_relations(nodes):
    """(relation, source kind, source name, destination kind, destination name) implied by the growth web notes' own data: the paper of a value, the values an edge or a test
    lists, and the order of mechanisms inside a loop (A informs B when A's target is B's source and one loop holds both)"""
    val, edge = {}, {}
    for (kind, name), p in nodes.items():
        if p.get("code") == "gweb" and p.get("group") == "values":
            val[p["label"]] = name
        if p.get("code") == "gweb" and p.get("group") == "edges":
            edge[p["data"]["id"]] = (name, p["data"])
    out, problems = [], []
    for (kind, name), p in nodes.items():
        if p.get("code") != "gweb":
            continue
        g, d = p.get("group"), p["data"]
        if g == "values":
            if ("Claim", d.get("record")) in nodes:   # the sourcing record this value was taken from: the same extraction, so consistent with it, not independent support
                out.append(("consistent_with", "Claim", d["record"], "Evidence", name))
            if ("Source", d.get("paper_id")) in nodes:
                out.append(("produces", "Source", d["paper_id"], "Evidence", name))
            else:
                problems.append("%s: paper %r has no Source note" % (name, d.get("paper_id")))
        elif g in ("edges", "tests"):
            for v in d.get("values", []):
                if v not in val:
                    problems.append("%s: value %r is not a growth web value" % (name, v))
                elif g == "edges":
                    out.append(("supports", "Evidence", val[v], "Claim", name))
                else:
                    out.append(("consistent_with", "Evidence", val[v], "Hypothesis", name))
        elif g == "loops":
            members = [edge[e] for e in d.get("edges", []) if e in edge]
            problems += ["%s: edge %r is not a growth web edge" % (name, e) for e in d.get("edges", []) if e not in edge]
            for an, a in members:
                for bn, b in members:
                    if an != bn and a["target"] == b["source"]:
                        out.append(("informs", "Claim", an, "Claim", bn))
    return out, problems


def expected_relations(nodes):
    """the relations implied by the notes: Evidence wiki-links (Source produces Evidence, Evidence supports Claim), the EDGE_RULES properties, the growth web's own data"""
    out = {}
    for rel, ak, an, bk, bn in gweb_relations(nodes)[0]:
        rid, rec = relation_record(rel, canon(ak, an), canon(bk, bn), node_id(ak, an), node_id(bk, bn))
        out[rid] = rec
    for (kind, name), p in nodes.items():
        if kind == "Claim" and p.get("code") == "records" and p.get("source") and paper_states(p):   # a method or value record is what its paper states: Source produces Claim
            src = target_of(p["source"], "Source")
            rid, rec = relation_record("produces", canon("Source", src), canon("Claim", name), node_id("Source", src), node_id("Claim", name))
            out[rid] = rec
        elif kind == "Claim" and p.get("code") == "records" and p.get("source") and ("Source", target_of(p["source"], "Source")) in nodes:
            # a join, or a record that opens with our verdict on the paper: the paper did not state it, but the record rests on that paper (our triple Source informs Claim)
            src = target_of(p["source"], "Source")
            rid, rec = relation_record("informs", canon("Source", src), canon("Claim", name), node_id("Source", src), node_id("Claim", name))
            out[rid] = rec
        if kind == "Issue":   # an audit item that names a configuration value by its exact key bears on that value (our triples Issue informs Claim, Issue informs Parameter)
            d = p.get("data") if isinstance(p.get("data"), dict) else {}
            # only what the item is about (its reference and its statement); a key mentioned in passing in the evidence or note of an item is not its subject
            text = with_ranges(" ".join(str(d.get(f) or "") for f in ("ref", "item")))
            keys = set(KEY_TOKEN.findall(text))
            for prefix, count in GROUP_REF.findall(str(d.get("ref") or "")):   # "prefix (N values)": the N configuration values whose key starts with that prefix, when exactly N do
                group = [n for (k, n), q in nodes.items() if k == "Claim" and "record_file" not in q and n.startswith(prefix + ".")]
                if len(group) == int(count):
                    keys.update(group)
            # a key in the item's other fields counts when the item itself names that key's module (its file): the item is then about that module's values, and the key
            # is one of them. A key of another module mentioned there in passing is not the item's subject.
            words = set(WORD.findall(text))
            rest = with_ranges(" ".join(str(d.get(f) or "") for f in ("why", "resolve", "evidence", "note")))
            keys.update(k for k in KEY_TOKEN.findall(rest) if module_of(k) in words or len(_issue_mentions(nodes).get(k, ())) <= 2)   # or the key is named by one or two items only: a pointed mention, not a sentence copied across many items
            for key in sorted(keys):
                if ("Claim", key) in nodes and "record_file" not in nodes[("Claim", key)]:
                    rid, rec = relation_record("informs", canon("Issue", name), canon("Claim", key), node_id("Issue", name), node_id("Claim", key))
                    out[rid] = rec
        if kind == "Result" and "record_file" not in p and p.get("experiment"):
            exp = nodes.get(("Experiment", target_of(p["experiment"], "Experiment"))) or {}
            hyps = [target_of(l, "Hypothesis") for l in links_of(exp.get("hypotheses"))]
            hyps = [h for h in hyps if ("Hypothesis", h) in nodes]
            named = [target_of(l, "Hypothesis") for l in links_of(p.get("against")) + links_of(p.get("consistent_with"))]
            mine = [h for h in hyps if h in named] or hyps   # a result that names the hypotheses it bears on informs their questions only
            asked = [] if p.get("answers") else sorted({target_of(nodes[("Hypothesis", h)].get("question"), "Question") for h in mine} - {None})   # a named question replaces the derivation
            for q in asked:   # what was found bears on the question the tested hypothesis came from (our triple Result informs Question)
                if ("Question", q) in nodes:
                    rid, rec = relation_record("informs", canon("Result", name), canon("Question", q), node_id("Result", name), node_id("Question", q))
                    out[rid] = rec
            if p.get("reading") in AGAINST and len(hyps) == 1 and not p.get("consistent_with") and not p.get("against"):   # a null or failed result of an experiment that tested one hypothesis stands against it (our triple)
                rid, rec = relation_record("opposes", canon("Result", name), canon("Hypothesis", hyps[0]), node_id("Result", name), node_id("Hypothesis", hyps[0]))
                out[rid] = rec
        if kind == "Evidence" and "record_file" not in p:
            src, me_c = target_of(p["source"], "Source"), canon("Evidence", name)
            pairs = [("produces", canon("Source", src), me_c, node_id("Source", src), node_id("Evidence", name))]
            for l in links_of(p.get("claim")) + [l for l in links_of(p.get("applies_to")) if l not in links_of(p.get("claim"))]:
                cl = target_of(l, "Claim")
                if ("Claim", cl) not in nodes:
                    continue   # reported by the check as an unresolved link
                # evidence the project does not accept as a source (adult only, or the value is still a model choice) informs the value; it does not support it
                rel = "supports" if str(nodes[("Claim", cl)].get("status") or "").startswith("source-found") else "informs"
                pairs.append((rel, me_c, canon("Claim", cl), node_id("Evidence", name), node_id("Claim", cl)))
            for k, a, b, ai, bi in pairs:
                rid, rec = relation_record(k, a, b, ai, bi)
                out[rid] = rec
        for rule_kind, prop, rel, other, outgoing in EDGE_RULES:
            if kind != rule_kind or not p.get(prop) or ("record_file" in p and (kind, prop) not in ON_RECORDS):
                continue
            for l in links_of(p[prop]):
                t = target_of(l, other)
                me, it = (canon(kind, name), node_id(kind, name)), (canon(other, t), node_id(other, t))
                a, b = (me, it) if outgoing else (it, me)
                rid, rec = relation_record(rel, a[0], b[0], a[1], b[1])
                out[rid] = rec
    return out


def _issue_mentions(nodes):
    """{configuration key: the audit items whose why, resolve, evidence or note text names it}"""
    if "mentions" not in _CACHE:
        out = {}
        for (kind, name), p in nodes.items():
            if kind == "Issue" and isinstance(p.get("data"), dict):
                rest = " ".join(str(p["data"].get(f) or "") for f in ("why", "resolve", "evidence", "note"))
                for k in set(KEY_TOKEN.findall(rest)):
                    if ("Claim", k) in nodes:
                        out.setdefault(k, set()).add(name)
        _CACHE["mentions"] = out
    return _CACHE["mentions"]


def module_of(key):
    """the module (code file) a configuration key belongs to: its first part, or the second when the key opens with 'setting.'"""
    parts = key.split(".")
    return parts[1] if parts[0] == "setting" and len(parts) > 1 else parts[0]


def paper_states(p):
    """True when a record is something its paper states (a method or a value). A join is the project's own reasoning across papers, and a record that opens with a verdict
    of ours on the paper (NEGATIVE: ...) is not a statement of that paper: neither is 'produced' by the Source."""
    d = p.get("data") or {}
    said = str(d.get("method") or d.get("quantity") or "")
    return d.get("kind") in ("method", "value") and not said.startswith("NEGATIVE")


def links_of(v):
    """a property holding one wiki-link or a list of them, as a list"""
    return [v] if isinstance(v, str) else list(v or [])


def write_relations():
    body = {"version": 1, "lastModified": STAMP_MS, "relations": expected_relations(read_all())}
    RELATIONS.write_text(json.dumps(body, indent=1, sort_keys=True) + chr(10), encoding="utf-8", newline=chr(10))
