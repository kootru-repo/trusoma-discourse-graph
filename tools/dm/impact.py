"""What to look at again when a configuration value changes. Reads the vault's relations and the brain code; changes nothing.
  the code lines that read the value, and the other values read on those same lines (from tools/trusoma/brain/*.py, through CFGV["key"] and the
    module constants assigned from it)
  the values it feeds (the `informs` property of a value note, followed onward), and the values that feed it
  the open-value Question that lists it
  the Hypotheses that rest on it (their `informed_by`), the Experiments that tested them and the Results those produced: readings taken with the old value
  the audit items that name it, and its Evidence
A value with nothing under "feeds" has NO STATED dependency; that is not a statement that nothing depends on it (the code lines are the place to look).
usage: python tools/dm/impact.py KEY [KEY ...]"""
import re, sys
import dmlib as D

BRAIN = D.ROOT / "tools" / "trusoma" / "brain"
READ = re.compile(r'CFGV\["([^"]+)"\]')
ASSIGN = re.compile(r"^([A-Za-z_][A-Za-z0-9_]*(?:\s*,\s*[A-Za-z_][A-Za-z0-9_]*)*)\s*=(?!=)")   # one name, or several assigned together
NAME = re.compile(r"[A-Za-z_][A-Za-z0-9_]*")


def code_reads():
    """{key: [(file, line number, the other keys read on that line)]}: direct reads and uses of a module constant assigned from the configuration"""
    out = {}
    for path in sorted(BRAIN.glob("*.py")):
        if path.name.startswith("test_"):
            continue
        lines = path.read_text(encoding="utf-8", errors="replace").split("\n")
        consts = {}
        for line in lines:
            m = ASSIGN.match(line)
            keys = READ.findall(line)
            if m and keys:
                for nm in NAME.findall(m.group(1)):   # names assigned together on one line share that line's keys
                    consts[nm] = keys
        for i, line in enumerate(lines, 1):
            code = line.split("#", 1)[0]
            keys = list(READ.findall(code))
            m = ASSIGN.match(code)
            for word in set(NAME.findall(code)):
                if word in consts and not (m and word in NAME.findall(m.group(1))):
                    keys += consts[word]
            keys = sorted(set(keys))
            for k in keys:
                out.setdefault(k, []).append((path.name, i, [x for x in keys if x != k]))
    return out


def value_name(nodes, key):
    for (kind, name), p in nodes.items():
        if kind == "Claim" and "record_file" not in p and str(p.get("key") or name) == key:
            return name
    return None


def fed_by(nodes):
    """{value name: [names of the values it feeds]} from the informs property of value notes"""
    out = {}
    for (kind, name), p in nodes.items():
        if kind == "Claim" and "record_file" not in p and p.get("informs"):
            out[name] = [t for t in (D.target_of(l, "Claim") for l in D.links_of(p["informs"])) if ("Claim", t) in nodes]
    return out


def downstream(feeds, name):
    seen, todo = [], list(feeds.get(name, ()))
    while todo:
        x = todo.pop(0)
        if x not in seen and x != name:
            seen.append(x)
            todo += feeds.get(x, ())
    return seen


def report(key, nodes=None, reads=None):
    nodes = nodes or D.read_all()
    reads = code_reads() if reads is None else reads
    name = value_name(nodes, key)
    if name is None:
        return ["no such value: " + key]
    p = nodes[("Claim", name)]
    me = D.link("Claim", name)
    keyof = lambda n: str(nodes[("Claim", n)].get("key") or n)
    out = ["%s = %s  [%s]" % (key, D.json.dumps(p.get("value")) if "value" in p else "(file)", p.get("status"))]
    rd = reads.get(key, [])
    out.append("read by %d code line(s):" % len(rd))
    for f, i, others in rd[:40]:
        out.append("  tools/trusoma/brain/%s:%d%s" % (f, i, ("  with " + ", ".join(others[:8]) + (" ..." if len(others) > 8 else "")) if others else ""))
    feeds = fed_by(nodes)
    down = downstream(feeds, name)
    out.append("feeds (stated): " + (", ".join(keyof(n) for n in down) if down else "no stated dependency"))
    up = sorted(keyof(n) for n, ts in feeds.items() if name in ts)
    out.append("fed by (stated): " + (", ".join(up) if up else "none stated"))
    for (kind, qn), q in nodes.items():
        if kind == "Question" and "record_file" not in q and me in D.links_of(q.get("values")):
            out.append("question: %s" % D.title("Question", qn))
    hyps = [hn for (kind, hn), h in nodes.items() if kind == "Hypothesis" and "record_file" not in h and me in D.links_of(h.get("informed_by"))]
    for hn in hyps:
        out.append("hypothesis resting on it: %s" % D.title("Hypothesis", hn))
        for (kind, en), e in nodes.items():
            if kind == "Experiment" and "record_file" not in e and D.link("Hypothesis", hn) in D.links_of(e.get("hypotheses")):
                out.append("  experiment: %s" % D.title("Experiment", en))
                for (k2, rn), r in nodes.items():
                    if k2 == "Result" and "record_file" not in r and r.get("experiment") == D.link("Experiment", en):
                        out.append("    result taken with the earlier value (%s): %s" % (r.get("reading"), D.title("Result", rn)))
    for (kind, n), q in nodes.items():
        if kind == "Result" and "record_file" not in q and me in D.links_of(q.get("supports")) + D.links_of(q.get("opposes")):
            out.append("result about it: %s" % D.title("Result", n))
    rel = D.expected_relations(nodes)
    mine = D.node_id("Claim", name)
    issues = sorted(r["source"] for r in rel.values() if r["destination"] == mine and r["type"] == D.REL_TYPE["informs"])
    ids = {D.node_id(k, n): (k, n) for (k, n) in nodes}
    for s in issues:
        k, n = ids.get(s, (None, None))
        if k == "Issue":
            out.append("audit item: %s" % n)
    out.append("evidence notes: %d" % len(D.links_of(p.get("evidence"))))
    return out


def main():
    keys = sys.argv[1:]
    if not keys:
        print(__doc__)
        return 1
    nodes, reads = D.read_all(), code_reads()
    for k in keys:
        print("\n".join(report(k, nodes, reads)))
        print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
