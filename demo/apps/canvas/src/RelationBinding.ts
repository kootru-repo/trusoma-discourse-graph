/**
 * The binding that ties each end of a relation to a card: type "discourse-relation" with tldraw's arrow binding props,
 * as in the Discourse Graphs Obsidian plugin (apps/obsidian/src/components/canvas/shapes/DiscourseRelationBinding.tsx).
 * This view only reads relations, so the plugin's drag and re-parenting behaviour is not carried over.
 */
import {
  BindingUtil,
  arrowBindingProps,
  type Editor,
  type TLArrowBindingProps,
  type TLBaseBinding,
  type TLShapeId,
} from "tldraw";

export const RELATION_BINDING_TYPE = "discourse-relation" as const;
export type RelationBinding = TLBaseBinding<
  typeof RELATION_BINDING_TYPE,
  TLArrowBindingProps
>;
export type RelationEnds = { start: TLShapeId | null; end: TLShapeId | null };

export class DiscourseRelationBindingUtil extends BindingUtil<RelationBinding> {
  static override type = RELATION_BINDING_TYPE;
  static override props = arrowBindingProps;

  override getDefaultProps(): Partial<TLArrowBindingProps> {
    return {
      isPrecise: false,
      isExact: false,
      normalizedAnchor: { x: 0.5, y: 0.5 },
      snap: "none",
    };
  }
}

export const relationBindingProps = (
  terminal: "start" | "end",
): TLArrowBindingProps => {
  return {
    terminal,
    isPrecise: false,
    isExact: false,
    normalizedAnchor: { x: 0.5, y: 0.5 },
    snap: "none",
  };
};

export const getRelationEnds = (
  editor: Editor,
  relationId: TLShapeId,
): RelationEnds => {
  const bindings = editor.getBindingsFromShape<RelationBinding>(
    relationId,
    RELATION_BINDING_TYPE,
  );
  const find = (terminal: "start" | "end"): TLShapeId | null =>
    bindings.find((b) => b.props.terminal === terminal)?.toId ?? null;
  return { start: find("start"), end: find("end") };
};
