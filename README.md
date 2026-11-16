# TruSoma discourse graph

A real research record kept as a [Discourse Graphs](https://discoursegraphs.com) vault, with a tldraw canvas, an MCP server and a Supabase load built on the Discourse Graphs repository's own stack and checked against it item by item.

**[Open the live canvas](https://kootru-repo.github.io/trusoma-discourse-graph/)** · [Architecture](docs/architecture.md) · [Developer guide](demo/README.md)

[![CI](https://github.com/kootru-repo/trusoma-discourse-graph/actions/workflows/ci.yaml/badge.svg)](https://github.com/kootru-repo/trusoma-discourse-graph/actions/workflows/ci.yaml)

![One model value traced from its source to the result that tested it](demo/docs/canvas-nmda-share.png)

## What this is

TruSoma is a simulation of human fetal development at 10 to 17 weeks, built only from published biology. Every number in it has to be traced to a source. This repository holds the record that does the tracing, and the software that reads it.

| Part | What it does | Where |
| --- | --- | --- |
| Vault | 4,381 discourse notes and 2,288 relations in the Discourse Graphs grammar: sources, verbatim quotes, claims, hypotheses, experiments and results, failed ones included | [`vault/`](vault) |
| Canvas | Draws any note's neighbourhood as cards and labelled relations, using the Discourse Graphs Obsidian plugin's own canvas records | [`demo/apps/canvas`](demo/apps/canvas) |
| Ask | Runs questions over the graph as data ("which hypotheses have no experiment linked?"), with five presets, a question builder and a link per question, for example [`#ask=untested-hypotheses`](https://kootru-repo.github.io/trusoma-discourse-graph/#ask=untested-hypotheses) | [`demo/packages/graph/src/query.ts`](demo/packages/graph/src/query.ts) |
| Obsidian round trip | "Save canvas" writes the plugin's canvas file; the plugin opens it and every card links back to its note | [`demo/docs`](demo/docs) |
| MCP server | An assistant searches the graph, traces a value to its sources, lists gaps, and writes notes that a validator can refuse | [`demo/apps/mcp`](demo/apps/mcp) |
| Database load | The vault as rows for the Discourse Graphs Supabase schema, loaded through its `upsert_concepts` function as a signed-in space member | [`demo/packages/graph`](demo/packages/graph) |
| Conformance check | Compares all of the above with a checkout of the Discourse Graphs repository | [`check-upstream.ts`](demo/packages/graph/scripts/check-upstream.ts) |

## Try it

The canvas needs nothing installed: open the [live page](https://kootru-repo.github.io/trusoma-discourse-graph/), search for a note, and widen its neighbourhood from 1 to 4 hops.

To run everything locally (Node 22, pnpm 10.15.1, Python 3.11 or later):

```
cd demo
pnpm install
pnpm test     # unit tests on the real vault
pnpm dev      # the canvas at http://localhost:4173
pnpm start    # the MCP server over stdio
```

To connect an assistant: `claude mcp add trusoma-dg -- pnpm --dir /path/to/demo start`

## Built on the Discourse Graphs stack

The demo is laid out and built the way the [Discourse Graphs repository](https://github.com/DiscourseGraphs/discourse-graph) is, and a script proves it on every push.

- **Same records.** Canvas cards, relation shapes, bindings and the node migration sequence are the Obsidian plugin's. Database rows are deep-equal, in order, to the output of the plugin's own conversion code run from its source.
- **Same tools.** A pnpm workspace of `apps/` and `packages/` run by turbo, TypeScript, tldraw 3.14.2, esbuild, Tailwind, vitest, zod, and their eslint preset and Prettier configuration, at the versions they pin.
- **Same database path.** Their migrations, their `create-space` edge function, a sign-in as the space account, then `upsert_concepts` under row-level security.
- **Checked, not claimed.** [CI](.github/workflows/ci.yaml) clones the Discourse Graphs repository at a pinned commit and runs the conformance check against it: 45 of 45 items pass.

One thing is added that their repository does not have: the MCP SDK, confined to `demo/apps/mcp` and named by the check as an addition. The vault's authoring tools are Python.

## The vault is the only source

Every table, configuration file and database in the project is generated from the notes and compared byte for byte at each commit.

```
python tools/dm/check_all.py                    # validate the vault and compare every generated file
python tools/dm/test_single_source.py tamper    # change one byte of each generated file: every change is detected
```

Gaps are shown, not hidden: 1,212 of 1,943 value claims have no evidence yet, and the MCP server's `list_gaps` tool reports them. Failed and no-signal results are entered like passes.

## Limits

- The hosted database is not open to visitors: by the schema's policies, a client that is not signed in reads no rows. The load is recorded in [`demo/docs/hosted-load.json`](demo/docs/hosted-load.json).
- Saving a rearranged canvas back to the vault is not built, and there are no automated browser tests.
- The simulation code itself is not in this repository. Project page: https://labs.kootru.com
