/**
 * The card for one discourse node. The record is the one the Discourse Graphs Obsidian plugin writes
 * (apps/obsidian/src/components/canvas/shapes/DiscourseNodeShape.tsx): same type and the same props, so a canvas saved here loads in their store.
 * What this view adds for drawing (CardMeta) is kept in the shape's meta, which their plugin ignores.
 */
import {
  BaseBoxShapeUtil,
  DefaultFontStyle,
  DefaultSizeStyle,
  HTMLContainer,
  T,
  type TLBaseShape,
  type TLDefaultFontStyle,
  type TLDefaultSizeStyle,
} from "tldraw";

export type DiscourseNodeShape = TLBaseShape<
  "discourse-node",
  {
    w: number;
    h: number;
    src: string | null;
    title: string;
    nodeTypeId: string;
    imageSrc?: string;
    size: TLDefaultSizeStyle;
    fontFamily: TLDefaultFontStyle;
  }
>;

export type CardMeta = {
  uid: string;
  nodeType: string;
  head: string;
  sub: string;
  code: boolean;
  value: string;
  reading: string;
  focus: boolean;
};

export const DEFAULT_DISCOURSE_NODE_PROPS: DiscourseNodeShape["props"] = {
  w: 200,
  h: 100,
  src: null,
  title: "",
  nodeTypeId: "",
  imageSrc: undefined,
  size: "s",
  fontFamily: "sans",
};

/** Their link from a card to its note: a block reference in the canvas file, named in the card's src. */
export const BLOCKREF_SRC_PREFIX = "asset:obsidian.blockref.";

export const TYPE_COLOUR: Record<string, string> = {
  Source: "#64748b",
  Evidence: "#2563eb",
  Claim: "#0891b2",
  Question: "#9333ea",
  Hypothesis: "#d97706",
  Issue: "#dc2626",
  Experiment: "#4f46e5",
  Result: "#be185d",
  Conclusion: "#334155",
};
export const READING_COLOUR: Record<string, string> = {
  pass: "#16a34a",
  signal: "#16a34a",
  fail: "#dc2626",
  "no-signal": "#d97706",
  observation: "#64748b",
};

/** The reading of a result as a tinted pill; the colour comes in as --c. */
export const TW_READING =
  "rounded-full px-2.5 py-0.5 text-[12px] font-semibold lowercase [background:color-mix(in_srgb,var(--c)_12%,white)] [color:color-mix(in_srgb,var(--c)_78%,black)]";

export const cardMeta = (shape: DiscourseNodeShape): CardMeta => {
  const meta = shape.meta as Partial<CardMeta>;
  return {
    uid: meta.uid ?? "",
    nodeType: meta.nodeType ?? "Claim",
    head: meta.head ?? shape.props.title,
    sub: meta.sub ?? "",
    code: meta.code ?? false,
    value: meta.value ?? "",
    reading: meta.reading ?? "",
    focus: meta.focus ?? false,
  };
};

export class DiscourseNodeUtil extends BaseBoxShapeUtil<DiscourseNodeShape> {
  static override type = "discourse-node" as const;
  static override props = {
    w: T.number,
    h: T.number,
    src: T.string.nullable(),
    title: T.string.optional(),
    nodeTypeId: T.string.nullable().optional(),
    imageSrc: T.string.optional(),
    size: DefaultSizeStyle,
    fontFamily: DefaultFontStyle,
  };

  override getDefaultProps(): DiscourseNodeShape["props"] {
    return { ...DEFAULT_DISCOURSE_NODE_PROPS };
  }

  override canEdit(): boolean {
    return false;
  }
  override canResize(): boolean {
    return false;
  }

  override component(shape: DiscourseNodeShape): JSX.Element {
    const { uid, nodeType, head, sub, code, value, reading, focus } =
      cardMeta(shape);
    const colour = TYPE_COLOUR[nodeType] ?? "#334155";
    return (
      <HTMLContainer
        className={`flex flex-col gap-[7px] overflow-hidden rounded-xl border-solid bg-white font-sans [pointer-events:all] ${focus ? "border-2 px-[15px] py-[13px] [border-color:var(--type)] [box-shadow:0_0_0_3px_color-mix(in_srgb,var(--type)_16%,transparent),0_4px_12px_rgba(15,23,42,0.06)]" : "border border-[rgba(15,23,42,0.08)] px-4 py-3.5 [box-shadow:0_1px_3px_rgba(15,23,42,0.05),0_4px_12px_rgba(15,23,42,0.04)]"}`}
        style={{ ["--type" as string]: colour }}
        data-uid={uid}
        data-node-type={nodeType}
      >
        <div className="flex h-4 items-center justify-between">
          <span className="inline-flex items-center gap-[7px] text-[11.5px] font-semibold uppercase tracking-[0.07em] [color:var(--type)]">
            <i className="h-[9px] w-[9px] rounded-full [background:var(--type)]" />
            {nodeType}
          </span>
          {value ? (
            <span className="text-ink rounded-md bg-[#f1f5f9] px-2 py-px font-mono text-[14px] font-medium">
              {value}
            </span>
          ) : null}
          {reading ? (
            <span
              className={TW_READING}
              style={{
                ["--c" as string]: READING_COLOUR[reading] ?? "#64748b",
              }}
            >
              {reading}
            </span>
          ) : null}
        </div>
        <div className="text-ink line-clamp-3 text-[17px] font-semibold leading-6 tracking-[-0.01em]">
          {head}
        </div>
        {sub ? (
          <div
            className={
              code
                ? "h-6 truncate font-mono text-[14.5px] leading-[22px] text-[#475569]"
                : "line-clamp-6 whitespace-normal text-[14.5px] leading-[21px] text-[#475569]"
            }
          >
            <span
              className={
                code
                  ? "inline-block h-[23px] max-w-full truncate align-top text-[12.5px] leading-[23px] text-[#64748b]"
                  : undefined
              }
            >
              {sub}
            </span>
          </div>
        ) : null}
      </HTMLContainer>
    );
  }

  override indicator(shape: DiscourseNodeShape): JSX.Element {
    return (
      <rect width={shape.props.w} height={shape.props.h} rx={12} ry={12} />
    );
  }
}
