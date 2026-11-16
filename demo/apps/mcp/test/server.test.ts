/** The server over stdio, on the real vault: the tool list and one answer. */
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { test } from "vitest";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(
  process.env.TRUSOMA_ROOT ?? resolve(here, "..", "..", "..", ".."),
);

test("the server speaks MCP over stdio: tools are listed and one answers", async () => {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [
      resolve(here, "..", "node_modules", "tsx", "dist", "cli.mjs"),
      resolve(here, "..", "src", "server.ts"),
    ],
    env: { ...process.env, TRUSOMA_ROOT: root, TRUSOMA_READONLY: "1" },
  });
  const client = new Client({ name: "test", version: "0" });
  await client.connect(transport);
  try {
    const names = (await client.listTools()).tools.map((t) => t.name).sort();
    assert.deepEqual(names, [
      "check",
      "get_linked_nodes",
      "get_node",
      "get_node_neighborhood",
      "get_relation_types",
      "get_relationships",
      "get_schema",
      "list_gaps",
      "search_nodes",
      "trace_value",
    ]);
    const out = await client.callTool({
      name: "trace_value",
      arguments: { key: "NMDA_SHARE_E16" },
    });
    const text = (out.content as { type: string; text: string }[])[0]!.text;
    assert.equal(
      (JSON.parse(text) as { claim: { value: number } }).claim.value,
      0.755,
    );
  } finally {
    await client.close();
  }
});
