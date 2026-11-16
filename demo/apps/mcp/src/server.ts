/**
 * MCP server over the TruSoma Discourse Graphs vault (stdio).
 *   TRUSOMA_ROOT      the repository root that holds vault/ and tools/dm (default: three folders above this package)
 *   TRUSOMA_READONLY  set to 1 to leave out the write tool (the mode for a hosted copy)
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as T from "@repo/graph/tools";
import { loadVault } from "@repo/graph/vault";

const root = resolve(
  process.env.TRUSOMA_ROOT ??
    resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", ".."),
);
let graph = loadVault(root);

const reply = (
  value: unknown,
): { content: { type: "text"; text: string }[] } => ({
  content: [{ type: "text" as const, text: JSON.stringify(value, null, 1) }],
});
const guarded =
  <A>(fn: (args: A) => unknown) =>
  (args: A) => {
    try {
      return reply(fn(args));
    } catch (error) {
      return {
        ...reply({
          error: error instanceof Error ? error.message : String(error),
        }),
        isError: true,
      };
    }
  };

const server = new McpServer({
  name: "trusoma-discourse-graph",
  version: "0.1.0",
});
server.tool(
  "search_nodes",
  "Search the discourse graph by keywords, optionally within one node type.",
  T.SearchNodesSchema.shape,
  guarded((a) => T.searchNodes(graph, T.SearchNodesSchema.parse(a))),
);
server.tool(
  "get_node",
  "Get one node with all its properties (value, verbatim quote, locator, status) by uid or title.",
  T.GetNodeSchema.shape,
  guarded((a) => T.getNode(graph, a)),
);
server.tool(
  "get_linked_nodes",
  "Get the nodes linked to or from one node, with the relation of each link.",
  T.GetLinkedNodesSchema.shape,
  guarded((a) => T.getLinkedNodes(graph, T.GetLinkedNodesSchema.parse(a))),
);
server.tool(
  "get_schema",
  "The node types of this graph, how many notes each has, and the allowed (source, relation, destination) triples.",
  T.GetSchemaSchema.shape,
  guarded(() => T.getSchema(graph)),
);
server.tool(
  "get_relationships",
  "Query typed relationships by source, destination or relation type.",
  T.GetRelationshipsSchema.shape,
  guarded((a) => T.getRelationships(graph, T.GetRelationshipsSchema.parse(a))),
);
server.tool(
  "get_relation_types",
  "The relation types of this graph and how many relations each has.",
  T.GetRelationTypesSchema.shape,
  guarded(() => T.getRelationTypes(graph)),
);
server.tool(
  "get_node_neighborhood",
  "Breadth-first neighbourhood of a node, 1 to 4 hops.",
  T.GetNodeNeighborhoodSchema.shape,
  guarded((a) =>
    T.getNodeNeighborhood(graph, T.GetNodeNeighborhoodSchema.parse(a)),
  ),
);
server.tool(
  "trace_value",
  "Trace one model value: the sources and verbatim quotes behind it, and the hypotheses, runs and readings (failed ones included) that used it.",
  T.TraceValueSchema.shape,
  guarded((a) => T.traceValue(graph, a)),
);
server.tool(
  "list_gaps",
  "What the graph lacks: value claims with no evidence, hypotheses no run has tested, hypotheses blocked by an open issue.",
  T.ListGapsSchema.shape,
  guarded((a) => T.listGaps(graph, T.ListGapsSchema.parse(a))),
);
server.tool(
  "check",
  "Run the vault's commit check: validate every note and compare every generated file with the vault.",
  T.CheckSchema.shape,
  guarded(() => T.check(graph)),
);
if (process.env.TRUSOMA_READONLY !== "1") {
  server.tool(
    "add_note",
    "Write a Question, Hypothesis, Experiment or Result note into the vault. The quote must be verbatim text of the named record file; a refused write is undone and its reasons returned.",
    T.AddNoteSchema.shape,
    guarded((a) => {
      const { graph: next, ...result } = T.addNote(
        graph,
        T.AddNoteSchema.parse(a),
      );
      graph = next;
      return result;
    }),
  );
}

await server.connect(new StdioServerTransport());
