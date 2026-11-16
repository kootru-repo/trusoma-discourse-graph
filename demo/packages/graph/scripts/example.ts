/**
 * What an assistant sees through the MCP server, printed from the real vault: one value traced to its sources, and one write that is refused.
 * The same functions the server exposes as tools are called here directly, so the output is what the tools return.
 * usage: pnpm run example
 */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { addNote, traceValue } from "../src/tools.js";
import { loadVault } from "../src/vault.js";

const root = resolve(
  process.env.TRUSOMA_ROOT ??
    resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", ".."),
);
const g = loadVault(root);

const show = (call: string, result: unknown): void => {
  console.log(`> ${call}`);
  console.log(JSON.stringify(result, null, 2));
  console.log();
};

show(
  'trace_value { "key": "NMDA_SHARE_E16" }',
  traceValue(g, { key: "NMDA_SHARE_E16" }),
);

// the quote below is not in the record file, so the validator refuses the note and nothing is written
const refused = addNote(g, {
  kind: "Result",
  name: "example of a refused write",
  record: "companion/TRUSOMA_PROBES.md",
  quote: "the learner formed a perfect body map on every seed",
  properties: {
    reading: "pass",
    counted: false,
    experiment: "[[EXP - probe 1 existing checkpoints 2026-11-03]]",
  },
});
show(
  'add_note { "kind": "Result", "record": "companion/TRUSOMA_PROBES.md", "quote": "the learner formed a perfect body map on every seed", ... }',
  {
    accepted: refused.accepted,
    title: refused.title,
    message: refused.message,
  },
);
