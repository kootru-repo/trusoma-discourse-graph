/**
 * The migration sequence of the discourse-node shape, with the id and version the Discourse Graphs Obsidian plugin uses
 * (apps/obsidian/src/components/canvas/shapes/discourseNodeMigrations.ts), so the schema saved in a canvas file names the same sequence.
 */
import { createMigrationIds, createMigrationSequence } from "tldraw";

const SEQUENCE_ID = "com.discourse-graph.obsidian.discourse-node";
const versions = createMigrationIds(SEQUENCE_ID, { addSizeAndFontFamily: 1 });

type NodeRecord = {
  typeName: string;
  type: string;
  props: { size?: string; fontFamily?: string };
};

const isNodeRecord = (record: unknown): record is NodeRecord => {
  if (typeof record !== "object" || record === null) return false;
  const candidate = record as Record<string, unknown>;
  return (
    candidate.typeName === "shape" &&
    candidate.type === "discourse-node" &&
    typeof candidate.props === "object" &&
    candidate.props !== null
  );
};

export const discourseNodeMigrations = createMigrationSequence({
  sequenceId: SEQUENCE_ID,
  sequence: [
    {
      id: versions.addSizeAndFontFamily,
      scope: "record",
      filter: (record) => isNodeRecord(record),
      up: (shape) => {
        if (!isNodeRecord(shape)) return;
        shape.props.size ??= "s";
        shape.props.fontFamily ??= "draw";
      },
    },
  ],
});
