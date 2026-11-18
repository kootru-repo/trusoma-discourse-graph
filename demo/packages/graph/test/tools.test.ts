/** Tests on the real vault (no fixtures): the counts are the ones the Python validator reports, so a reader that drops or misreads a note fails here. */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { test } from "vitest";
import { fileURLToPath } from "node:url";
import * as T from "../src/tools.js";
import { loadVault } from "../src/vault.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(
  process.env.TRUSOMA_ROOT ?? resolve(here, "..", "..", "..", ".."),
);
const g = loadVault(root);
const KEY = "phase1_substrate.NMDA_SHARE_E16";

test("the reader sees every discourse note and relation the vault holds", () => {
  const py = execFileSync(
    "python",
    [
      "-B",
      "-c",
      "import sys,json;sys.path.insert(0,'tools/dm');import dmlib as D;n=D.read_all();print(json.dumps([sum(1 for k,_ in n if k!='Record'),len(json.load(open(D.RELATIONS,encoding='utf-8'))['relations'])]))",
    ],
    { cwd: root, encoding: "utf8", env: { ...process.env, PYTHONUTF8: "1" } },
  );
  const [notes, relations] = JSON.parse(py) as [number, number];
  assert.equal(g.nodes.size, notes);
  assert.equal(g.relations.length, relations);
  assert.equal(g.nodeTypes.length, 10);
  assert.equal(g.relationTypes.length, 7);
});

test("search finds a value by name and filters by type", () => {
  const r = T.searchNodes(g, {
    query: "NMDA_SHARE_E16",
    nodeType: "CLM",
    limit: 5,
  });
  // the first hit is the value itself, found by its stable name: its title is derived from its properties (what its source says) and ends with the key and value in brackets
  assert.equal(r.results[0]?.uid, g.byHandle.get("CLM - " + KEY)?.uid);
  assert.ok(r.results[0]?.title.startsWith("CLM - "));
  assert.ok(r.results[0]?.title.endsWith(`(${KEY} = 0.755)`));
  assert.equal(T.getNode(g, { uid: "CLM - " + KEY }).name, KEY);
  const results = T.searchNodes(g, {
    query: "NMDA_SHARE_E16",
    nodeType: "Result",
    limit: 5,
  });
  assert.ok(
    results.total >= 1 && results.results.every((n) => n.nodeType === "Result"),
    "the Result that supports the value links to it, and the filter keeps only Results",
  );
});

test("trace_value joins source, quote, hypothesis, run and reading into one path", () => {
  const t = T.traceValue(g, { key: "NMDA_SHARE_E16" });
  assert.equal(t.claim.value, 0.755);
  assert.equal(t.supported, true);
  // a Source is titled with its citation; its handle is "@" and the paper id
  const source = g.byHandle.get("@p-waite2000");
  assert.ok(source);
  assert.ok(source.title.startsWith("@Waite PME"));
  assert.ok(source.title.endsWith("(p-waite2000)"));
  assert.equal(t.evidence[0]?.sources[0]?.uid, source.uid);
  assert.equal(t.evidence[0]?.sources[0]?.title, source.title);
  assert.ok(JSON.stringify(t.evidence[0]?.quote ?? "").length > 10);
  assert.equal(t.evidence[0]?.bearing, "supports");
  // a value whose only Evidence informs it (no accepted source) still shows that Evidence and its Source
  const informed = T.traceValue(g, { key: "body7.body7.init.k" });
  assert.ok(informed.evidence.length > 0);
  assert.ok(informed.evidence.every((e) => e.bearing === "informs"));
  assert.ok((informed.evidence[0]?.sources.length ?? 0) > 0);
  const run = t.hypotheses[0]?.experiments[0];
  assert.ok(run, "the value informs a hypothesis that a run tested");
  assert.equal(run.results[0]?.reading, "pass");
  assert.ok(t.resultsOnTheClaim.length >= 1);
});

test("gaps are reported, not hidden", () => {
  // values (records apart) that no note is related to: 1,117 Parameter notes (settings with no source; 42 more have a passage, an audit item or an open question related to them) and no Claim note
  const gaps = T.listGaps(g, { kind: "claims_without_evidence", limit: 2000 });
  assert.equal(gaps.total, 1116);
  const byType = (type: string): number =>
    gaps.results.filter((n) => n.nodeType === type).length;
  assert.equal(byType("Parameter"), 1116);
  assert.equal(byType("Claim"), 0);
  // a Parameter is a value like any other: it is traced under its real type, with nothing behind it
  const setting = gaps.results.find((n) => n.nodeType === "Parameter")!;
  const traced = T.traceValue(g, {
    key: T.getNode(g, { uid: setting.uid }).name,
  });
  assert.equal(traced.claim.nodeType, "Parameter");
  assert.equal(traced.supported, false);
  assert.ok(
    T.listGaps(g, { kind: "blocked_hypotheses", limit: 50 }).results.some((n) =>
      n.title.includes("TR12"),
    ),
  );
});

test("neighbourhood and typed relationships agree with the relation list", () => {
  const claim = g.byHandle.get("CLM - " + KEY)!;
  const hood = T.getNodeNeighborhood(g, {
    uid: claim.uid,
    depth: 2,
    limit: 200,
  });
  assert.ok(hood.nodes.some((n) => n.nodeType === "Source" && n.hops === 2));
  const rel = T.getRelationships(g, {
    destinationUid: claim.uid,
    relationshipType: "supports",
    limit: 50,
  });
  assert.equal(
    rel.total,
    (g.incoming.get(claim.uid) ?? []).filter((r) => r.label === "supports")
      .length,
  );
  assert.equal(
    T.getRelationTypes(g).relationTypes.reduce((s, t) => s + t.relations, 0),
    g.relations.length,
  );
});

test("a write with a quote that is not in the record file is refused and leaves no trace", () => {
  const before = execFileSync(
    "git",
    [
      "status",
      "--porcelain",
      "--",
      "vault",
      "companion",
      "tools/trusoma/brain",
    ],
    { cwd: root, encoding: "utf8" },
  );
  const r = T.addNote(g, {
    kind: "Result",
    name: "mcp test false quote",
    record: "companion/TRUSOMA_PROBES.md",
    quote: "the learner formed a perfect body map on every seed",
    properties: {
      reading: "pass",
      counted: false,
      experiment: "[[EXP - probe 1 existing checkpoints 2026-11-03]]",
    },
  });
  assert.equal(r.accepted, false);
  assert.ok(r.message.join(" ").includes("quote"), r.message.join(" | "));
  assert.equal(
    execFileSync(
      "git",
      [
        "status",
        "--porcelain",
        "--",
        "vault",
        "companion",
        "tools/trusoma/brain",
      ],
      { cwd: root, encoding: "utf8" },
    ),
    before,
  );
  assert.equal(T.check(g).ok, true);
});

test("a write with a verbatim quote is accepted, joins the graph, and is then removed again", () => {
  const before = execFileSync(
    "git",
    [
      "status",
      "--porcelain",
      "--",
      "vault",
      "companion",
      "tools/trusoma/brain",
    ],
    { cwd: root, encoding: "utf8" },
  );
  const relationsBefore = readFileSync(join(root, "vault", "relations.json"));
  const r = T.addNote(g, {
    kind: "Result",
    name: "mcp test verbatim quote",
    record: "companion/TRUSOMA_PROBES.md",
    quote: "Nothing here counts as a stage verdict.",
    properties: {
      reading: "observation",
      counted: false,
      experiment: "[[EXP - probe 1 existing checkpoints 2026-11-03]]",
    },
  });
  try {
    assert.equal(r.accepted, true, r.message.join(" | "));
    const added = r.graph.byTitle.get("RES - mcp test verbatim quote");
    assert.ok(added);
    assert.ok(
      (r.graph.incoming.get(added.uid) ?? []).some(
        (x) => x.label === "produces",
      ),
    );
    assert.equal(r.graph.nodes.size, g.nodes.size + 1);
    // the independent check: the vault's Python check accepts what TypeScript wrote, generated files included
    const verdict = T.check(r.graph);
    assert.equal(verdict.ok, true, JSON.stringify(verdict).slice(0, 600));
  } finally {
    // remove only what this test wrote: uncommitted notes of the author's stay (a clean of the folder once deleted them)
    rmSync(
      join(root, "vault", "DiscourseGraph", "RES - mcp test verbatim quote.md"),
      { force: true },
    );
    writeFileSync(join(root, "vault", "relations.json"), relationsBefore);
  }
  assert.equal(
    execFileSync(
      "git",
      [
        "status",
        "--porcelain",
        "--",
        "vault",
        "companion",
        "tools/trusoma/brain",
      ],
      { cwd: root, encoding: "utf8" },
    ),
    before,
  );
});
