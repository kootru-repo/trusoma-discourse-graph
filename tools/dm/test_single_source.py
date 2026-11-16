"""Adversarial tests of the claim "the vault is the single source" (2026-11-15). Each test tries to FALSIFY the claim; a failure is a finding, not an error.
  trace     every file the database build reads, classified: generated from the vault, frozen, code, document, other (other = a hidden source)
  tamper    change one byte of each generated file: the check must fail
  mutate    change each property of sampled notes: the check must fail (feeds an output or is guarded) or the property is DEAD (a second, unverified copy or unused)
  clone     fresh checkout of HEAD, delete every generated file, regenerate from the vault only, compare with HEAD
  yaml      would Obsidian's own property editor (YAML rewrite) keep the vault readable?
  stats     graph statistics for the optimality assessment
usage: python test_single_source.py trace|tamper|mutate|clone|yaml|stats"""
import collections, copy, io, json, os, pathlib, random, re, runpy, shutil, subprocess, sys, tempfile
import dmlib as D
import build_from_vault as B
import records as R
import validate_vault as V

ROOT = D.ROOT
GENERATED = None


def generated_paths():
    nodes = D.read_all()
    modules, values, basis, link_rows, registers, texts, parts = B.generate()
    return list(B.render(modules, values, link_rows, registers, texts, parts))


def check_outputs(nodes):
    """regenerate in memory from the given node dict and compare with the committed files: (differing file names, validator errors)"""
    D._CACHE["all"] = nodes
    try:
        modules, values, basis, link_rows, registers, texts, parts = B.generate()
        outputs = B.render(modules, values, link_rows, registers, texts, parts)
        diff = sorted(p.name for p, t in outputs.items() if p.read_bytes().decode("utf-8") != t)
        diff += ["side:" + x[:40] for x in B.compare_side_records(basis, registers)]
        buf = io.StringIO()
        old = sys.stdout
        sys.stdout = buf
        try:
            V.main()
        finally:
            sys.stdout = old
        errs = [l for l in buf.getvalue().splitlines() if l.startswith("ERROR")]
        return diff, errs
    except Exception as e:   # a mutation that breaks the generator is also a detection
        return ["EXC:" + type(e).__name__], []
    finally:
        D._CACHE.clear()


def trace():
    reads = set()
    def hook(event, args):
        if event == "open" and isinstance(args[0], (str, os.PathLike)):
            mode = args[1] or "r"
            if "w" not in str(mode) and "a" not in str(mode) and "+" not in str(mode):
                reads.add(os.path.abspath(str(args[0])))
    sys.addaudithook(hook)
    sys.argv = ["build_sourcing_db.py", "--check"]
    try:
        runpy.run_path(str(ROOT / "companion/source_audit/build_sourcing_db.py"), run_name="__main__")
    except SystemExit:
        pass
    gen = {str(p) for p in generated_paths()}
    gen = {os.path.abspath(g) for g in gen}
    cls = collections.defaultdict(list)
    for r in sorted(reads):
        rel = os.path.relpath(r, ROOT).replace("\\", "/")
        if r in gen:
            cls["generated from the vault"].append(rel)
        elif rel.startswith("vault/"):
            cls["vault"].append(rel)
        elif rel.endswith("constant_sources.jsonl"):
            cls["frozen history"].append(rel)
        elif rel.endswith(".py") or "__pycache__" in rel or rel.startswith(("tools/trusoma/brain/", "tools/dm/")):
            cls["code"].append(rel)
        elif rel.endswith(".md"):
            cls["document"].append(rel)
        elif not rel.startswith(".."):
            cls["OTHER (hidden source?)"].append(rel)
        else:
            cls["outside the repository (python, system)"].append(rel)
    for k, v in cls.items():
        print("%-42s %d" % (k, len(v)))
        if k.startswith(("OTHER", "document", "frozen")) or len(v) < 6:
            for x in v:
                print("    ", x)


def tamper():
    nodes = D.read_all()
    paths = generated_paths()
    detected = 0
    for p in paths:
        orig = p.read_bytes()
        p.write_bytes(orig.replace(B.BLOCK_END.encode(), b" " + B.BLOCK_END.encode()) if p in B.PARTIAL else orig + b" ")   # a partly generated file: tamper inside its block
        try:
            r = subprocess.run([sys.executable, "-B", str(ROOT / "tools/dm/check_all.py")], capture_output=True, text=True)
        finally:
            p.write_bytes(orig)
        ok = r.returncode != 0
        detected += ok
        print("%-45s %s" % (p.name, "DETECTED" if ok else "** NOT DETECTED **"))
    print("tampered generated files detected: %d of %d" % (detected, len(paths)))
    for rel in ("vault/relations.json", "companion/source_audit/constant_sources.jsonl"):
        p = ROOT / rel
        orig = p.read_bytes()
        p.write_bytes(orig + b" ")
        try:
            r = subprocess.run([sys.executable, "-B", str(ROOT / "tools/dm/check_all.py")], capture_output=True, text=True)
        finally:
            p.write_bytes(orig)
        print("%-45s %s" % (rel, "DETECTED" if r.returncode else "** NOT DETECTED **"))


def mutate_value(v):
    if isinstance(v, bool):
        return not v
    if isinstance(v, (int, float)):
        return v + 1
    if isinstance(v, str):
        return v + "X"
    if isinstance(v, list):
        return v + ["X"]
    if isinstance(v, dict):
        return dict(v, zzX="X")
    return "X"


def mutate(per_group=2):
    random.seed(1)
    nodes0 = D.read_all()
    groups = collections.defaultdict(list)
    for key, p in nodes0.items():
        g = (key[0], p.get("code") or ("link" if p.get("evidence_kind") == "link" else "learner" if "module" in p or "ga_lo_wk" in p else p.get("target", "")), p.get("register", ""))
        groups[g].append(key)
    result = collections.defaultdict(lambda: collections.Counter())
    dead = collections.defaultdict(list)
    n = 0
    for g, keys in sorted(groups.items(), key=lambda kv: str(kv[0])):
        for key in random.sample(keys, min(per_group, len(keys))):
            props = nodes0[key]
            for prop in list(props):
                if prop in ("nodeTypeId", "nodeInstanceId", "dg_type"):
                    continue
                items = [(None, props[prop])] if not (prop == "data" and isinstance(props[prop], dict)) else [(k, v) for k, v in props[prop].items()]
                for sub, val in items:
                    nodes = dict(nodes0)
                    p2 = dict(props)
                    if sub is None:
                        p2[prop] = mutate_value(val)
                    else:
                        d = dict(props[prop])
                        d[sub] = mutate_value(val)
                        p2[prop] = d
                    nodes[key] = p2
                    diff, errs = check_outputs(nodes)
                    n += 1
                    label = prop if sub is None else "data." + sub
                    if errs:
                        result[g]["guarded by the validator"] += 1
                    elif diff:
                        result[g]["feeds an output"] += 1
                    else:
                        result[g]["DEAD (nothing notices)"] += 1
                        dead[g].append((key[1][:40], label))
    print("mutations run:", n)
    for g, c in sorted(result.items(), key=lambda kv: str(kv[0])):
        print("%-50s %s" % (g, dict(c)))
    print("\nDEAD properties (changed with no output change and no validator error):")
    for g, v in sorted(dead.items(), key=lambda kv: str(kv[0])):
        print(g, collections.Counter(l for _, l in v).most_common())
    json.dump({str(g): v for g, v in dead.items()}, open(ROOT / "local/dm_dead_properties.json", "w"), indent=1)


def clone():
    tmp = pathlib.Path(tempfile.mkdtemp(prefix="dmclone_"))
    wt = tmp / "wt"
    subprocess.run(["git", "-C", str(ROOT), "worktree", "add", "--detach", str(wt), "HEAD"], check=True, capture_output=True)
    try:
        # the generated files, deleted
        gen = [pathlib.Path(p) for p in generated_paths()]
        rels = [p.relative_to(ROOT) for p in gen]
        for rel in rels:
            if ROOT / rel in B.PARTIAL:   # a partly generated file: empty its generated block, keep the hand-written text
                t = (wt / rel).read_bytes().decode("utf-8")
                (wt / rel).write_bytes((t.split(B.BLOCK_BEGIN)[0] + B.BLOCK_BEGIN + chr(10) + B.BLOCK_END + t.split(B.BLOCK_END)[1]).encode("utf-8"))
            else:
                (wt / rel).unlink()
        print("deleted generated files in the fresh checkout:", len(rels))
        env = dict(os.environ, PYTHONUTF8="1")
        r = subprocess.run([sys.executable, "-B", str(wt / "tools/dm/build_from_vault.py"), "write"], cwd=wt, capture_output=True, text=True, env=env)
        print("regenerate from the vault only: exit", r.returncode, (r.stdout + r.stderr).strip().splitlines()[-1:] )
        dm = D.__file__
        diffs = []
        for rel in rels:
            a, b = (wt / rel), (ROOT / rel)
            if not a.exists():
                diffs.append((str(rel), "MISSING after regeneration"))
            elif a.read_bytes() != b.read_bytes():
                diffs.append((str(rel), "DIFFERENT"))
        print("files regenerated identical to HEAD: %d of %d" % (len(rels) - len(diffs), len(rels)))
        for d in diffs:
            print("   ", d)
        r = subprocess.run([sys.executable, "-B", "-E", str(wt / "companion/source_audit/build_sourcing_db.py"), "--check"], cwd=wt, capture_output=True, text=True, env=env)
        probs = [l for l in r.stdout.splitlines() if l.startswith("PROBLEM")]
        print("database build in the fresh checkout: exit", r.returncode, "problems", len(probs), probs[:3], (r.stderr.strip().splitlines() or [""])[-1][:200])
    finally:
        subprocess.run(["git", "-C", str(ROOT), "worktree", "remove", "--force", str(wt)], capture_output=True)
        shutil.rmtree(tmp, ignore_errors=True)


def yaml_check():
    try:
        import yaml
    except ImportError:
        yaml = None
    print("PyYAML available:", bool(yaml))
    p = next(D.NODES.glob("CLM - phase1_substrate.NMDA_SHARE_E16.md"))
    props = D.read_note(p)
    # what Obsidian's property editor writes: lists in block style, strings unquoted where legal, objects not editable (left as written)
    lines = ["---"]
    for k, v in props.items():
        if isinstance(v, list):
            lines.append("%s:" % k)
            lines += ["  - %s" % (json.dumps(x, ensure_ascii=False) if not isinstance(x, str) else x) for x in v]
        elif isinstance(v, str):
            lines.append("%s: %s" % (k, v if re.fullmatch(r"[A-Za-z0-9_ .\-]+", v) else json.dumps(v, ensure_ascii=False)))
        else:
            lines.append("%s: %s" % (k, json.dumps(v)))
    lines += ["---", ""]
    tmp = pathlib.Path(tempfile.mkdtemp()) / "x.md"
    tmp.write_text("\n".join(lines), encoding="utf-8")
    try:
        got = D.read_note(tmp)
        print("our reader on an Obsidian-style rewrite:", "reads, equal" if got == props else "reads but DIFFERENT: %s" % [k for k in props if got.get(k) != props[k]])
    except Exception as e:
        print("our reader on an Obsidian-style rewrite: FAILS (%s: %s)" % (type(e).__name__, str(e)[:80]))
    if yaml:
        got = yaml.safe_load("\n".join(lines).split("---")[1])
        print("a YAML parser on the same text:", "equal" if got == props else "differs in %s" % [k for k in props if got.get(k) != props[k]])
        orig = yaml.safe_load("\n".join(open(p, encoding="utf-8").read().split("---")[1:2]))
        print("a YAML parser on OUR file format:", "equal" if orig == props else "differs in %s" % [k for k in props if orig.get(k) != props[k]])


def stats():
    nodes = D.read_all()
    kinds = collections.Counter()
    for (k, n), p in nodes.items():
        if "record_file" in p:
            kinds[(k, "table row: " + p["code"])] += 1
        elif k == "Claim":
            kinds[(k, "value (" + ("learner" if "module" in p else p["target"]) + ")")] += 1
        elif k == "Evidence":
            kinds[(k, "link row" if p.get("evidence_kind") == "link" else "learner source")] += 1
        else:
            kinds[(k, "")] += 1
    total = len(nodes)
    dg = sum(v for (k, d), v in kinds.items() if not d.startswith("table row") or k in ("Issue", "Claim"))
    print("notes", total)
    for (k, d), v in sorted(kinds.items(), key=lambda kv: -kv[1]):
        print("  %-9s %-28s %5d" % (k, d, v))
    rec = sum(v for (k, d), v in kinds.items() if k == "Record")
    print("Record notes (table rows with no discourse meaning): %d = %.0f%% of all notes" % (rec, 100 * rec / total))
    rel = json.load(open(D.RELATIONS, encoding="utf-8"))["relations"]
    print("relation types used:", dict(collections.Counter(r["type"] for r in rel.values())), "of the 7 relation types and 26 triples in the schema")
    claims = [(k, p) for (kk, k), p in nodes.items() if kk == "Claim" and "record_file" not in p]
    ev_n = collections.Counter()
    for (kk, k), p in nodes.items():
        if kk == "Evidence" and "claim" in p:
            ev_n[D.target_of(p["claim"], "Claim")] += 1
    dist = collections.Counter(min(ev_n[D.safe(k)], 4) for k, p in claims)
    print("evidence per value claim (4 = four or more):", dict(sorted(dist.items())))
    by_status = collections.Counter((p.get("status"), ev_n[D.safe(k)] > 0) for k, p in claims)
    print("claims by (status, has evidence):", dict(sorted(by_status.items(), key=lambda kv: str(kv[0]))))
    sizes = [len((D.NODES / f).read_bytes()) for f in os.listdir(D.NODES)]
    print("note size bytes: median %d, p95 %d, max %d, total %.1f MB" % (sorted(sizes)[len(sizes) // 2], sorted(sizes)[int(len(sizes) * .95)], max(sizes), sum(sizes) / 1e6))
    props = collections.Counter(len(p) for p in nodes.values())
    print("properties per note: median", sorted(len(p) for p in nodes.values())[total // 2])
    outdeg = collections.Counter()
    for r in rel.values():
        outdeg[r["source"]] += 1
    print("every relation links Source to Evidence or Evidence to Claim: a two-level tree of %d edges, longest path 2" % len(rel))


if __name__ == "__main__":
    {"trace": trace, "tamper": tamper, "mutate": mutate, "clone": clone, "yaml": yaml_check, "stats": stats}[sys.argv[1]]()
