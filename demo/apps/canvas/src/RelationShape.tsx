/**
 * One relation between two cards. The record is the one the Discourse Graphs Obsidian plugin writes
 * (apps/obsidian/src/components/canvas/shapes/DiscourseRelationShape.tsx): type "discourse-relation", tldraw's arrow props plus relationTypeId,
 * and its two ends held by "discourse-relation" bindings, so a canvas saved here loads in their store.
 * The drawing is ours: the line is routed round the cards from where they are now, using the layout hints kept in the shape's meta (RouteMeta),
 * which their plugin ignores; it draws the same record as a tldraw arrow.
 */
import {
  Polyline2d,
  Rectangle2d,
  SVGContainer,
  ShapeUtil,
  T,
  Vec,
  arrowShapeProps,
  type Geometry2d,
  type RecordPropsType,
  type TLBaseShape,
} from "tldraw";
import { getRelationEnds } from "./RelationBinding";

export type DiscourseRelationShapeProps = RecordPropsType<
  typeof arrowShapeProps
> & { relationTypeId: string };
export type DiscourseRelationShape = TLBaseShape<
  "discourse-relation",
  DiscourseRelationShapeProps
>;
export type RouteMeta = {
  flow: string;
  lane: number;
  sy: number;
  ey: number;
  t: number;
  hot: boolean;
};

export const routeMeta = (shape: DiscourseRelationShape): RouteMeta => {
  const meta = shape.meta as Partial<RouteMeta>;
  return {
    flow: meta.flow ?? "down",
    lane: meta.lane ?? 0,
    sy: meta.sy ?? 0.5,
    ey: meta.ey ?? 0.5,
    t: meta.t ?? 0.5,
    hot: meta.hot ?? false,
  };
};

type P = { x: number; y: number };
type Box = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  midX: number;
  midY: number;
};
type Route = { d: string; tip: P; angle: number; label: P; hull: P[] };
const INK = "#64748b";
const INK_ACTIVE = "#0f172a";
const INK_OPPOSES = "#dc2626";
/** how far out the first lane runs, and the step to each further lane */
const LANE = { first: 84, step: 44 };
const R = 26;
const deg = (a: P, b: P): number =>
  (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;

/**
 * The line from box a to box b. lane 0: a smooth curve between the facing sides.
 * Otherwise a squared path with rounded corners round the outside, |lane| lanes out, on the side of its sign:
 * a relation that skips a rank would cross the cards between.
 */
export const route = ({
  a,
  b,
  flow,
  lane,
  sy = 0.5,
  ey = 0.5,
  t = 0.5,
}: {
  a: Box;
  b: Box;
  flow: string;
  lane: number;
  sy?: number;
  ey?: number;
  t?: number;
}): Route => {
  if (lane !== 0) {
    const out =
      (LANE.first + LANE.step * (Math.abs(lane) - 1)) * Math.sign(lane);
    if (flow !== "across") {
      const s = { x: lane > 0 ? a.maxX : a.minX, y: a.midY };
      const e = { x: lane > 0 ? b.maxX : b.minX, y: b.midY };
      const x =
        (lane > 0 ? Math.max(s.x, e.x) : Math.min(s.x, e.x)) + out * 1.34;
      const c1 = { x, y: s.y };
      const c2 = { x, y: e.y };
      return {
        d: `M${s.x},${s.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${e.x},${e.y}`,
        tip: e,
        angle: deg(c2, e),
        label: {
          x: (s.x + e.x) / 2 + (out * 1.34 * 3) / 4,
          y: (s.y + e.y) / 2,
        },
        hull: [s, c1, c2, e],
      };
    }
    const y =
      (lane > 0 ? Math.max(a.maxY, b.maxY) : Math.min(a.minY, b.minY)) + out;
    const s = { x: a.midX, y: lane > 0 ? a.maxY : a.minY };
    const e = { x: b.midX, y: lane > 0 ? b.maxY : b.minY };
    const h = Math.sign(e.x - s.x) || 1;
    const v = Math.sign(lane);
    const d = `M${s.x},${s.y} V${y - v * R} Q${s.x},${y} ${s.x + h * R},${y} H${e.x - h * R} Q${e.x},${y} ${e.x},${y - v * R} V${e.y}`;
    return {
      d,
      tip: e,
      angle: v > 0 ? -90 : 90,
      label: { x: (s.x + e.x) / 2, y },
      hull: [s, { x: s.x, y }, { x: e.x, y }, e],
    };
  }
  if (flow === "elbow") {
    // down from the foot of a, then round one corner into the side of b
    const h = Math.sign(b.midX - a.midX) || 1;
    const s = { x: a.minX + (a.maxX - a.minX) * sy, y: a.maxY };
    const e = { x: h > 0 ? b.minX : b.maxX, y: b.midY };
    const corner = { x: s.x, y: e.y };
    return {
      d: `M${s.x},${s.y} V${e.y - R} Q${s.x},${e.y} ${s.x + h * R},${e.y} H${e.x}`,
      tip: e,
      angle: h > 0 ? 0 : 180,
      label: { x: (s.x + h * R + e.x) / 2, y: e.y },
      hull: [s, corner, e],
    };
  }
  const dx = b.midX - a.midX;
  const dy = b.midY - a.midY;
  const overlap = a.maxX > b.minX && b.maxX > a.minX;
  const upright =
    flow === "layers"
      ? true
      : flow === "tracks"
        ? overlap
        : Math.abs(dy) * (flow === "down" ? 2 : 0.5) >= Math.abs(dx);
  const s = upright
    ? { x: a.midX, y: dy > 0 ? a.maxY : a.minY }
    : { x: dx > 0 ? a.maxX : a.minX, y: a.minY + (a.maxY - a.minY) * sy };
  const e = upright
    ? { x: b.midX, y: dy > 0 ? b.minY : b.maxY }
    : { x: dx > 0 ? b.minX : b.maxX, y: b.minY + (b.maxY - b.minY) * ey };
  const c1 = upright
    ? { x: s.x, y: (s.y + e.y) / 2 }
    : { x: (s.x + e.x) / 2, y: s.y };
  const c2 = upright
    ? { x: e.x, y: (s.y + e.y) / 2 }
    : { x: (s.x + e.x) / 2, y: e.y };
  const u = 1 - t;
  const label = {
    x:
      u * u * u * s.x +
      3 * u * u * t * c1.x +
      3 * u * t * t * c2.x +
      t * t * t * e.x,
    y:
      u * u * u * s.y +
      3 * u * u * t * c1.y +
      3 * u * t * t * c2.y +
      t * t * t * e.y,
  };
  return {
    d: `M${s.x},${s.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${e.x},${e.y}`,
    tip: e,
    angle: deg(c2, e),
    label,
    hull: [s, c1, c2, e],
  };
};

export class DiscourseRelationUtil extends ShapeUtil<DiscourseRelationShape> {
  static override type = "discourse-relation" as const;
  static override props = {
    ...arrowShapeProps,
    relationTypeId: T.string,
  };

  override getDefaultProps(): DiscourseRelationShape["props"] {
    return {
      dash: "draw",
      size: "m",
      fill: "none",
      color: "black",
      labelColor: "black",
      bend: 0,
      start: { x: 0, y: 0 },
      end: { x: 100, y: 0 },
      arrowheadStart: "none",
      arrowheadEnd: "arrow",
      text: "",
      labelPosition: 0.5,
      font: "draw",
      scale: 1,
      kind: "arc",
      elbowMidPoint: 0,
      relationTypeId: "",
    };
  }

  private routeOf(shape: DiscourseRelationShape): Route | null {
    const ends = getRelationEnds(this.editor, shape.id);
    const a = ends.start
      ? this.editor.getShapePageBounds(ends.start)
      : undefined;
    const b = ends.end ? this.editor.getShapePageBounds(ends.end) : undefined;
    if (!a || !b) return null;
    const { flow, lane, sy, ey, t } = routeMeta(shape);
    return route({ a, b, flow, lane, sy, ey, t });
  }

  // The hull of the line, so the relation is drawn whenever any of it is in view.
  override getGeometry(shape: DiscourseRelationShape): Geometry2d {
    const found = this.routeOf(shape);
    if (!found)
      return new Rectangle2d({ width: 1, height: 1, isFilled: false });
    return new Polyline2d({ points: found.hull.map((p) => new Vec(p.x, p.y)) });
  }
  override canEdit = (): boolean => false;
  override canResize = (): boolean => false;
  override canBind = (): boolean => true;
  override hideSelectionBoundsBg = (): boolean => true;
  override hideSelectionBoundsFg = (): boolean => true;
  override hideResizeHandles = (): boolean => true;
  override hideRotateHandle = (): boolean => true;

  override component(shape: DiscourseRelationShape): JSX.Element | null {
    const found = this.routeOf(shape);
    if (!found) return null;
    const { d, tip, angle, label } = found;
    const { text } = shape.props;
    const ends = getRelationEnds(this.editor, shape.id);
    const selected = this.editor.getSelectedShapeIds();
    const active = selected.some((id) => id === ends.start || id === ends.end);
    const colour = text === "opposes" ? INK_OPPOSES : active ? INK_ACTIVE : INK;
    const width = text.length * 6.7 + 16;
    return (
      <SVGContainer style={{ overflow: "visible", pointerEvents: "none" }}>
        <path
          d={d}
          fill="none"
          stroke={colour}
          strokeWidth={active ? 2 : 1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M-3,0 L-9.5,-3.4 L-9.5,3.4 Z"
          fill={colour}
          stroke={colour}
          strokeWidth={1.5}
          strokeLinejoin="round"
          transform={`translate(${tip.x},${tip.y}) rotate(${angle})`}
        />
        <rect
          x={label.x - width / 2}
          y={label.y - 10}
          width={width}
          height={20}
          rx={6}
          fill="#f8fafc"
        />
        <text
          x={label.x}
          y={label.y + 4.2}
          textAnchor="middle"
          fontSize={12.5}
          fontWeight={500}
          fill="#475569"
          fontFamily="Inter, system-ui, 'Segoe UI', sans-serif"
        >
          {text}
        </text>
      </SVGContainer>
    );
  }

  override indicator(): null {
    return null;
  }
}
