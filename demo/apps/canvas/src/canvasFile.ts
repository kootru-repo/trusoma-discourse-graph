/**
 * The canvas as the markdown file the Discourse Graphs Obsidian plugin reads and writes
 * (apps/obsidian/src/components/canvas/utils/tldraw.ts and stores/assetStore.ts): frontmatter key, a delimited JSON block holding the tldraw
 * schema and records, then one wikilink and block reference per card, which the card's src names.
 * The constants below must stay equal to theirs (apps/obsidian/src/constants.ts); scripts/check-upstream.ts compares them.
 */
import type { SerializedSchema, TLRecord } from "tldraw";

export const FRONTMATTER_KEY = "tldr-dg";
export const TLDATA_DELIMITER_START =
  "!!!_START_OF_TLDRAW_DG_DATA__DO_NOT_CHANGE_THIS_PHRASE_!!!";
export const TLDATA_DELIMITER_END =
  "!!!_END_OF_TLDRAW_DG_DATA__DO_NOT_CHANGE_THIS_PHRASE_!!!";
export const TLDRAW_VERSION = "3.14.2";
/** The plugin version whose file format this follows (apps/obsidian/package.json). */
export const PLUGIN_VERSION = "1.5.2";

export type CanvasLink = { blockRefId: string; linkText: string };
export type CanvasFileInput = {
  schema: SerializedSchema;
  records: TLRecord[];
  links: CanvasLink[];
  uuid: string;
};

type TLData = {
  meta: { uuid: string; "plugin-version": string; "tldraw-version": string };
  raw: {
    tldrawFileFormatVersion: number;
    schema: SerializedSchema;
    records: TLRecord[];
  };
};

const frontmatterTemplate = (data: string): string => {
  return `---\n${data}\n---\n`;
};

const codeBlockTemplate = (data: TLData): string => {
  return (
    "```json" +
    ` ${TLDATA_DELIMITER_START}\n${JSON.stringify(data, null, "\t")}\n${TLDATA_DELIMITER_END}\n` +
    "```"
  );
};

const blockRefTemplate = ({ blockRefId, linkText }: CanvasLink): string => {
  return `\n[[${linkText}]]\n^${blockRefId}\n`;
};

export const toCanvasMarkdown = ({
  schema,
  records,
  links,
  uuid,
}: CanvasFileInput): string => {
  const data: TLData = {
    meta: {
      uuid,
      "plugin-version": PLUGIN_VERSION,
      "tldraw-version": TLDRAW_VERSION,
    },
    raw: { tldrawFileFormatVersion: 1, schema, records },
  };
  const file = `${frontmatterTemplate(`${FRONTMATTER_KEY}: true`)}\n\n${codeBlockTemplate(data)}`;
  return file + links.map(blockRefTemplate).join("");
};

export const fromCanvasMarkdown = (markdown: string): TLData => {
  const start = markdown.indexOf(TLDATA_DELIMITER_START);
  const end = markdown.indexOf(TLDATA_DELIMITER_END);
  if (start < 0 || end < 0)
    throw new Error("not a Discourse Graphs canvas file");
  return JSON.parse(
    markdown.slice(start + TLDATA_DELIMITER_START.length, end),
  ) as TLData;
};
