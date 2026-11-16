# TruSoma discourse graph

TruSoma is a simulation of the human fetal body and its developing brain at 10 to 17 weeks of gestation, built from published biology. The rule of the project is that every number in the model is traced to a source or recorded as a choice. This repository holds the record that does the tracing, kept as a [Discourse Graphs](https://discoursegraphs.com) vault of 4,381 notes and 2,288 relations, and the software that lets people and AI assistants read and write it.

**[Open the live canvas](https://kootru-repo.github.io/trusoma-discourse-graph/)** · [Project page](https://labs.kootru.com) · [Architecture](docs/architecture.md) · [Developer guide](demo/README.md)

[![CI](https://github.com/kootru-repo/trusoma-discourse-graph/actions/workflows/ci.yaml/badge.svg)](https://github.com/kootru-repo/trusoma-discourse-graph/actions/workflows/ci.yaml)

![One model value traced from its source to the result that tested it](demo/docs/canvas-nmda-share.png)

## Why a discourse graph

The project's rule needs a record that shows where each number came from. In TruSoma each value is a claim note, linked to the verbatim quote it came from, the paper that quote is in, the hypothesis it informs and the result that tested it. Every value has a recorded status, and every result is entered whatever its outcome.

## What is here

| Part | What it does | Where |
| --- | --- | --- |
| Vault | 4,381 discourse notes and 2,288 relations: sources, verbatim quotes, claims, hypotheses, experiments and results | [`vault/`](vault) |
| Canvas | Draws any note's neighbourhood as cards and labelled relations | [`demo/apps/canvas`](demo/apps/canvas) |
| Ask | Runs questions over the graph as data ("which hypotheses have no experiment linked?"), with six presets, a question builder and a link per question, for example [`#ask=untested-hypotheses`](https://kootru-repo.github.io/trusoma-discourse-graph/#ask=untested-hypotheses), the 18 hypotheses with no experiment note linked | [`demo/packages/graph/src/query.ts`](demo/packages/graph/src/query.ts) |
| MCP server | An assistant searches the graph, traces a value to its sources, lists gaps, and writes notes that a validator can refuse | [`demo/apps/mcp`](demo/apps/mcp) |
| Obsidian round trip | "Save canvas" writes a canvas file that the Discourse Graphs Obsidian plugin opens, with every card linked back to its note | [`demo/docs`](demo/docs) |
| Database load | The vault as rows for the Discourse Graphs Supabase schema | [`demo/packages/graph`](demo/packages/graph) |

![A question over the graph, with its first answer drawn](demo/docs/canvas-ask.png)

## Try it

Open the [live page](https://kootru-repo.github.io/trusoma-discourse-graph/) (nothing to install), search for a note, and widen its neighbourhood from 1 to 4 hops. The Ask tab answers questions such as which model values are backed by a quoted source.

To run everything locally (Node 22, pnpm 10.15.1, Python 3.11 or later):

```
cd demo
pnpm install
pnpm test     # unit tests on the real vault
pnpm dev      # the canvas at http://localhost:4173
pnpm start    # the MCP server over stdio
pnpm run example   # what an assistant sees: one value traced, one write refused
```

## Ask it through an assistant

The MCP server gives an AI assistant the graph as tools. Two calls are shown here. The output below is from the real vault, shortened; `pnpm run example` prints it in full.

**Trace a value to its sources.** One call returns the whole path: the value, the verbatim quote behind it, the paper, the hypothesis it informs, the experiment and the result.

```
> trace_value { "key": "NMDA_SHARE_E16" }
{
  "claim":    { "title": "CLM - phase1_substrate.NMDA_SHARE_E16", "value": 0.755, "status": "source-found-transfer" },
  "evidence": [{
    "quote":   "the remaining postsynaptic response (75.5%, +/- 0.7% SD) was blocked by AP5, indicating it was mediated by NMDA receptors ...",
    "locator": "Results (E16 recordings); abstract gives 75%",
    "sources": [{ "title": "@p-waite2000" }]
  }],
  "hypotheses": [{
    "title": "HYP- S2 NMDA share and excitatory GABA-A",
    "experiments": [{
      "title":   "EXP - test rs3 s2 gaba and nmda share e4707cd",
      "results": [{ "title": "RES - S2 recovers the bound share and the GABA-A sign", "reading": "pass" }]
    }]
  }],
  "supported": true
}
```

**Refuse a write that misquotes its record.** An assistant can add notes, but only ones that fit the grammar and quote their record file word for word. This quote is not in the file, so nothing is written:

```
> add_note { "kind": "Result", "record": "companion/TRUSOMA_PROBES.md",
             "quote": "the learner formed a perfect body map on every seed", ... }
{
  "accepted": false,
  "title": "RES - example of a refused write",
  "message": ["Result example of a refused write: its quote is not found verbatim in companion/TRUSOMA_PROBES.md"]
}
```

The server has 11 tools in all: nine for reading (search, neighbourhood, trace, gaps and the grammar), one that runs the vault's check, and `add_note`. To connect one: `claude mcp add trusoma-dg -- pnpm --dir /path/to/demo start`

## The vault is the only source

Every table, configuration file and database in the project is generated from the notes and compared byte for byte at each commit.

```
python tools/dm/check_all.py                    # validate the vault and compare every generated file
python tools/dm/test_single_source.py tamper    # change one byte of each generated file: every change is detected
```

The vault holds 1,943 value notes. 731 are linked to a verbatim quote from a paper; the others carry their status (a recorded model choice, a design value, or next in line for a source), and the Ask tab and the MCP server's `list_gaps` tool list them. Of the values that describe the fetal body, brainstem and learner, 495 of 569 are sourced (87%); the [project page](https://labs.kootru.com) keeps that count.

## Works with the Discourse Graphs plugin

The vault opens in Obsidian with the open-source [Discourse Graphs plugin](https://github.com/DiscourseGraphs/discourse-graph), which shows each note's type and relations. The software here writes that plugin's formats and adds none of its own.

- **Canvas files.** A saved canvas uses the plugin's card, relation and binding records, so it opens in Obsidian as drawn.
- **Database rows.** The load produces the rows the plugin's own conversion produces and sends them through the schema's `upsert_concepts` function as a signed-in member, under row-level security.
- **Tooling.** TypeScript in a pnpm workspace run by turbo, with tldraw, esbuild, Tailwind, vitest and zod at the versions the plugin pins, so shared record definitions behave the same in both.
- **Tested.** [CI](.github/workflows/ci.yaml) runs a [compatibility check](demo/packages/graph/scripts/check-upstream.ts) against a pinned commit of the plugin's repository on every push.

The MCP server uses the MCP SDK, and the vault's authoring tools are Python.

## Scope

- The hosted database is not open to visitors: by the schema's policies, a client that is not signed in reads no rows. The load is recorded in [`demo/docs/hosted-load.json`](demo/docs/hosted-load.json).
- The canvas is a reading view: a drawing is saved as a canvas file for Obsidian, and notes are written through the MCP server or in Obsidian. A drawing shows up to four notes around any one note, and the side panel lists every relation.
- This repository is the record and its software; the simulation itself is developed separately.
