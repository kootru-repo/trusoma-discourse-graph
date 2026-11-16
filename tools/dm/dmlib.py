"""Shared helpers of the vault tools (phase 1 of companion/DM_CONVERSION_PLAN_2026-11-15.md). Nothing here touches the brain package.
Note format: markdown with a frontmatter block; every property is `name: <JSON>` on one line (JSON scalars, lists and objects are valid YAML flow syntax, so
Obsidian reads them, and this reader needs no YAML library). Titles follow the lab-vault grammar: "CLM - {content}", "EVD - {content}", "@{content}"."""
import hashlib, json, pathlib, uuid

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
    ("Question", "informed_by", "informs", "Claim", False),          # Claim informs Question
    ("Claim", "informs", "informs", "Claim", True),                  # Claim informs Claim
    ("Claim", "addresses", "addresses", "Question", True),           # Claim addresses Question
)
BIG_VALUE_BYTES = 20000   # a value longer than this (as JSON) is kept in vault/Data/<key>.json, not in the note: a property line that long makes Obsidian slow
STAMP_MS = 1763164800000   # 2026-11-15T00:00:00Z, the import date, written into generated relations so regeneration is reproducible


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


def title(kind, name):
    return PREFIX[kind] + name


def link(kind, name):
    return "[[%s]]" % title(kind, name)


def write_note_kind(kind, name, props):
    _CACHE.clear()
    head = {"nodeTypeId": NODE_TYPE[kind], "nodeInstanceId": node_id(kind, name), "dg_type": kind}
    head.update(props)
    lines = ["---"] + ["%s: %s" % (k, json.dumps(v, ensure_ascii=False)) for k, v in head.items()] + ["---", ""]
    folder = TABLES if kind == "Record" else NODES
    folder.mkdir(parents=True, exist_ok=True)
    (folder / (title(kind, name) + ".md")).write_text("\n".join(lines), encoding="utf-8", newline="\n")


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
    import yaml
    parsed = yaml.safe_load("\n".join(lines[1:end]))
    if not isinstance(parsed, dict):
        raise ValueError("%s: frontmatter is not a mapping" % path)
    return parsed


_CACHE = {}


def read_all():
    """{(dg_type, name): props} for every node note in the vault (parsed once per process; a write clears the cache)"""
    if "all" in _CACHE:
        return _CACHE["all"]
    out = {}
    for p in sorted(NODES.glob("*.md")) + sorted(TABLES.glob("*.md")):
        props = read_note(p)
        kind = props["dg_type"]
        stem = p.stem
        assert stem.startswith(PREFIX[kind]), "%s: title does not match type %s" % (p.name, kind)
        out[(kind, stem[len(PREFIX[kind]):])] = props
    _CACHE["all"] = out
    return out


def relation_record(kind, source_title, dest_title, source_id, dest_id):
    rid = node_id("relation", "%s|%s|%s" % (kind, source_title, dest_title))
    return rid, {"id": rid, "type": REL_TYPE[kind], "source": source_id, "destination": dest_id, "created": STAMP_MS}


write_note = write_note_kind


def target_of(link, kind):
    return link[2 + len(PREFIX[kind]):-2] if link and link.startswith("[[" + PREFIX[kind]) else None


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
        rid, rec = relation_record(rel, title(ak, an), title(bk, bn), node_id(ak, an), node_id(bk, bn))
        out[rid] = rec
    for (kind, name), p in nodes.items():
        if kind == "Evidence" and "record_file" not in p:
            pairs = [("produces", p["source"][2:-2], title("Evidence", name), node_id("Source", target_of(p["source"], "Source")), node_id("Evidence", name))]
            if "claim" in p:
                pairs.append(("supports", title("Evidence", name), p["claim"][2:-2], node_id("Evidence", name), node_id("Claim", target_of(p["claim"], "Claim"))))
            for k, a, b, ai, bi in pairs:
                rid, rec = relation_record(k, a, b, ai, bi)
                out[rid] = rec
        for rule_kind, prop, rel, other, outgoing in EDGE_RULES:
            if kind != rule_kind or not p.get(prop) or "record_file" in p:
                continue
            for l in links_of(p[prop]):
                me, it = (title(kind, name), node_id(kind, name)), (l[2:-2], node_id(other, target_of(l, other)))
                a, b = (me, it) if outgoing else (it, me)
                rid, rec = relation_record(rel, a[0], b[0], a[1], b[1])
                out[rid] = rec
    return out


def links_of(v):
    """a property holding one wiki-link or a list of them, as a list"""
    return [v] if isinstance(v, str) else list(v or [])


def write_relations():
    body = {"version": 1, "lastModified": STAMP_MS, "relations": expected_relations(read_all())}
    RELATIONS.write_text(json.dumps(body, indent=1, sort_keys=True) + chr(10), encoding="utf-8", newline=chr(10))
