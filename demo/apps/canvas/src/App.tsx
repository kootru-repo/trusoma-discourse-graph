import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Tldraw,
  createShapeId,
  createTLStore,
  defaultBindingUtils,
  defaultShapeUtils,
  loadSnapshot,
  type Editor,
  type TLComponents,
  type TLRecord,
  type TLShapeId,
} from "tldraw";
import "tldraw/tldraw.css";
import {
  BLOCKREF_SRC_PREFIX,
  DEFAULT_DISCOURSE_NODE_PROPS,
  DiscourseNodeUtil,
  READING_COLOUR,
  TW_READING,
  TYPE_COLOUR,
  cardMeta,
  type CardMeta,
  type DiscourseNodeShape,
} from "./DiscourseNodeShape";
import {
  DiscourseRelationBindingUtil,
  RELATION_BINDING_TYPE,
  relationBindingProps,
} from "./RelationBinding";
import {
  DiscourseRelationUtil,
  routeMeta,
  type DiscourseRelationShape,
  type RouteMeta,
} from "./RelationShape";
import { fromCanvasMarkdown, toCanvasMarkdown } from "./canvasFile";
import { discourseNodeMigrations } from "./discourseNodeMigrations";
import {
  CARD,
  COLUMNS,
  arrange,
  buildIndex,
  display,
  neighbourhood,
  paths,
  search,
  type GNode,
  type GRelation,
  type GraphData,
  type Index,
} from "./graph";
import { PRESETS, runQuery, type Query } from "@repo/graph/query";
import { Ask, CUSTOM, DEFAULT_CUSTOM, type Asked } from "./Ask";
import { TW_LABEL } from "./tw";

const shapeUtils = [DiscourseNodeUtil, DiscourseRelationUtil];
const bindingUtils = [DiscourseRelationBindingUtil];
const migrations = [discourseNodeMigrations];
const START = "phase1_substrate.NMDA_SHARE_E16";
/** The canvas is a reading view: tldraw's drawing tools, menus and style panel are left out; pan, zoom, select and drag stay. */
const components: TLComponents = {
  Toolbar: null,
  PageMenu: null,
  MainMenu: null,
  StylePanel: null,
  ActionsMenu: null,
  QuickActions: null,
  HelpMenu: null,
  DebugPanel: null,
  MenuPanel: null,
  NavigationPanel: null,
  HelperButtons: null,
  ZoomMenu: null,
  Minimap: null,
  SharePanel: null,
  TopPanel: null,
};
/** What a reader calls each property; a property not listed is shown under its own name, and the bookkeeping ones are not shown. */
const LABEL: Record<string, string> = {
  value: "Value",
  key: "Key",
  status: "Sourcing status",
  meaning: "Meaning",
  record: "Record file",
  quote: "Quote",
  reading: "Reading",
  counted: "Counts toward a verdict",
  prereg: "Pre-registered",
  date: "Date",
  paper_id: "Paper",
  locator: "Where in the paper",
  transfer: "Transfer to the fetus",
  citation: "Citation",
  year: "Year",
  doi: "DOI",
  item: "Issue",
  statement: "Statement",
  mechanism: "Mechanism",
  method: "Method",
  quantity: "Quantity",
  unit: "Unit",
  note: "Note",
  species: "Species",
  stage: "Stage",
};
const CODE = new Set(["key", "record", "paper_id"]);
const FIRST = [
  "value",
  "reading",
  "quote",
  "citation",
  "item",
  "statement",
  "status",
];
const LONG = new Set([
  "quote",
  "citation",
  "item",
  "statement",
  "mechanism",
  "note",
  "locator",
  "transfer",
  "meaning",
]);
/** Class strings used in more than one place (Tailwind utilities; the tokens are in tailwind.config.ts). */
const TW_PANEL =
  "absolute z-[400] min-h-0 rounded-[14px] border border-solid border-[rgba(15,23,42,0.08)] bg-white [box-shadow:0_1px_2px_rgba(15,23,42,0.05),0_8px_24px_rgba(15,23,42,0.07)] max-[900px]:!inset-x-0 max-[900px]:!bottom-[calc(56px+env(safe-area-inset-bottom))] max-[900px]:!top-0 max-[900px]:!max-h-none max-[900px]:!w-auto max-[900px]:rounded-none max-[900px]:border-0 max-[900px]:[box-shadow:none]";
/** On a narrow screen one pane shows at a time (the tab bar switches them); the canvas itself is never hidden, since tldraw measures it. */
type Pane = "find" | "graph" | "note";
const TW_OFF = "max-[900px]:hidden";
const TW_TALL = "max-[900px]:h-11 max-[900px]:text-[16px]";
const TW_DOT = "h-2 w-2 flex-none rounded-full";
const TW_ROW_BUTTON = "grid w-full rounded-lg border-0 text-left";
const TW_ZOOM_BUTTON =
  "h-10 min-w-[42px] border-0 border-solid border-line bg-transparent px-3.5 font-medium text-ink-2 hover:bg-canvas max-[900px]:h-11 max-[900px]:min-w-[52px] max-[900px]:px-4";
const TW_SECTION = `${TW_LABEL} mb-3.5 mt-[22px] flex justify-between border-0 border-t border-solid border-[#f1f5f9] pt-[18px]`;
const TW_STRONG = "font-semibold not-italic text-ink";
const TW_COUNT = "font-semibold text-ink-2 [font-variant-numeric:tabular-nums]";
const TW_CODE =
  "inline-block max-w-full font-mono text-[12.5px] text-[#475569] [overflow-wrap:anywhere]";
/** Extra classes for the value of one property, by its key. */
const DD: Record<string, string> = {
  quote: "border-0 border-l-2 border-solid border-[#cbd5e1] pl-3 text-[13.5px]",
  value: "font-mono text-[13.5px] font-medium",
  note: "rounded-md border border-solid border-line-2 bg-canvas px-2.5 py-2 text-[12.5px] !text-ink-2",
};

/** Plain words for the statuses a reader meets most; the others read well enough with their hyphens removed. */
const STATUS: Record<string, string> = {
  "source-found-fetal": "Sourced from fetal data",
  "source-found-transfer": "Sourced from another setting",
};
const pretty = (s: string): string =>
  STATUS[s] ?? s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
/** A property as text for a reader: the constant tags the model's code carries ("{cid: K16} [K16]") are left out. */
const shownText = (v: unknown): string =>
  String(v)
    .replace(/\{cid:[^}]*\}\s*/g, "")
    .replace(/^\[[A-Z]+\d+\]\s*/, "");
const ordered = (props: Record<string, unknown>): [string, unknown][] => {
  const keys = Object.keys(props).filter((k) => k !== "key"); // the key is the line under the headline
  return [
    ...FIRST.filter((k) => keys.includes(k)),
    ...keys.filter((k) => !FIRST.includes(k)),
  ].map((k) => [k, props[k]]);
};

/** The drawing as a canvas file for the Discourse Graphs Obsidian plugin: each card links to its note by a block reference. */
const canvasMarkdown = (editor: Editor): string => {
  const cards = editor
    .getCurrentPageShapes()
    .filter(
      (shape): shape is DiscourseNodeShape => shape.type === "discourse-node",
    );
  const links = cards.map((card) => ({
    blockRefId: (card.props.src ?? "").slice(BLOCKREF_SRC_PREFIX.length),
    linkText: card.props.title,
  }));
  return toCanvasMarkdown({
    schema: editor.store.schema.serialize(),
    records: editor.store.allRecords(),
    links,
    uuid: crypto.randomUUID(),
  });
};

/** Load a canvas file into a store put together as their plugin does (processInitialData), and count what arrives. */
const loadAsPlugin = (
  markdown: string,
): { shapes: number; bindings: number } => {
  const data = fromCanvasMarkdown(markdown);
  const store = createTLStore({
    shapeUtils: [
      ...defaultShapeUtils,
      DiscourseNodeUtil,
      DiscourseRelationUtil,
    ],
    bindingUtils: [...defaultBindingUtils, DiscourseRelationBindingUtil],
    migrations,
  });
  const records = Object.fromEntries(
    data.raw.records.map((record) => [record.id, record]),
  ) as Record<string, TLRecord>;
  loadSnapshot(
    store,
    { store: records, schema: data.raw.schema },
    { forceOverwriteSessionState: true },
  );
  const all = store.allRecords();
  return {
    shapes: all.filter((r) => r.typeName === "shape").length,
    bindings: all.filter((r) => r.typeName === "binding").length,
  };
};

const saveCanvasFile = (editor: Editor, name: string): void => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(
    new Blob([canvasMarkdown(editor)], { type: "text/markdown" }),
  );
  link.download = `${name}.md`;
  link.click();
  URL.revokeObjectURL(link.href);
};

/** The width each floating panel takes from the view, with its margin (the two TW_PANEL elements in App). */
const PANEL = { left: 324, right: 348 };
/** Show the whole drawing between the panels, at most 1.2 times life size (a single card would otherwise fill the view). */
const fit = (editor: Editor): void => {
  const ids = editor
    .getCurrentPageShapes()
    .filter((s) => s.type === "discourse-node")
    .map((s) => s.id);
  const boxes = ids.map((id) => editor.getShapePageBounds(id)!).filter(Boolean);
  if (!boxes.length) return;
  const bounds = boxes
    .slice(1)
    .reduce((all, b) => all.expand(b), boxes[0]!.clone());
  // room at each side for the relations that go round the outside there, and their labels
  const lanes = editor
    .getCurrentPageShapes()
    .filter((s) => s.type === "discourse-relation")
    .map((s) => routeMeta(s as DiscourseRelationShape).lane);
  const room = (n: number): number =>
    n ? (84 + 44 * (n - 1)) * 1.05 + 84 : 24;
  const left = room(-Math.min(0, ...lanes));
  const right = room(Math.max(0, ...lanes));
  // the panels float over the canvas: the drawing is fitted to the part of the view between them
  const box = new Box(
    bounds.minX - left,
    bounds.minY - 60,
    bounds.w + left + right,
    bounds.h + 150, // 60 above, and 90 below so the zoom buttons cover no card
  );
  const view = editor.getViewportScreenBounds();
  const wide = view.w > 900;
  const clear = { left: wide ? PANEL.left : 0, right: wide ? PANEL.right : 0 };
  // on a phone the status line lies over the top of the canvas: the drawing starts below it
  const top = wide ? 8 : view.h < 520 ? 48 : 68;
  const open = {
    w: view.w - clear.left - clear.right - 16,
    h: view.h - top - 8,
  };
  // on a phone the cards stay readable: below this scale the view is moved with a finger instead
  const z = Math.max(
    wide ? 0 : 0.42,
    Math.min(1.2, open.w / box.w, open.h / box.h),
  );
  editor.setCamera(
    {
      x: (clear.left + 8 + open.w / 2) / z - box.midX,
      y: (top + open.h / 2) / z - box.midY,
      z,
    },
    { animation: { duration: 220 } },
  );
};

/** Replace the canvas by the neighbourhood of one node: cards ranked by node type, one labelled line per relation. */
const draw = ({
  editor,
  index,
  uid,
  depth,
}: {
  editor: Editor;
  index: Index;
  uid: string;
  depth: number;
}): { nodes: number; relations: number; truncated: boolean } => {
  const { placed, relations, truncated } = neighbourhood({
    index,
    startUid: uid,
    depth,
  });
  const view = editor.getViewportScreenBounds();
  const { flow, cards } = arrange({
    placed,
    relations,
    viewW: view.w - 300,
    viewH: view.h - 72,
  });
  const path = paths({ relations, cards, flow });
  editor.run(
    () => {
      const all = [...editor.getCurrentPageShapeIds()];
      editor.updateShapes(
        all.map((id) => ({
          id,
          type: editor.getShape(id)!.type,
          isLocked: false,
        })),
      );
      editor.deleteShapes(all);
      const ids = new Map<string, TLShapeId>();
      for (const c of cards) ids.set(c.node.uid, createShapeId());
      const drawn = relations.flatMap((r) => {
        const from = ids.get(r.source);
        const to = ids.get(r.destination);
        return from && to ? [{ r, id: createShapeId(), from, to }] : [];
      });
      editor.createShapes<DiscourseNodeShape>(
        cards.map(({ node, x, y, h }) => {
          const d = display(node);
          const meta: CardMeta = {
            uid: node.uid,
            nodeType: node.type,
            head: d.head,
            sub: d.sub,
            code: d.code,
            value: d.value,
            reading:
              typeof node.props.reading === "string" ? node.props.reading : "",
            focus: node.uid === uid,
          };
          return {
            id: ids.get(node.uid)!,
            type: "discourse-node" as const,
            x,
            y,
            meta,
            props: {
              ...DEFAULT_DISCOURSE_NODE_PROPS,
              w: CARD.w,
              h,
              src: BLOCKREF_SRC_PREFIX + node.uid,
              title: node.title,
              nodeTypeId: node.typeId,
            },
          };
        }),
      );
      editor.createShapes<DiscourseRelationShape>(
        drawn.map(({ r, id }) => {
          const meta: RouteMeta = {
            flow,
            lane: 0,
            sy: 0.5,
            ey: 0.5,
            t: 0.5,
            ...path.get(r.id),
            hot: r.source === uid || r.destination === uid,
          };
          return {
            id,
            type: "discourse-relation" as const,
            x: 0,
            y: 0,
            isLocked: true,
            meta: { ...meta, relationId: r.id },
            props: { text: r.label, relationTypeId: r.typeId },
          };
        }),
      );
      editor.createBindings(
        drawn.flatMap(({ id, from, to }) => [
          {
            type: RELATION_BINDING_TYPE,
            fromId: id,
            toId: from,
            props: relationBindingProps("start"),
          },
          {
            type: RELATION_BINDING_TYPE,
            fromId: id,
            toId: to,
            props: relationBindingProps("end"),
          },
        ]),
      );
      editor.sendToBack(drawn.map((x) => x.id));
      editor.selectNone();
    },
    { ignoreShapeLock: true },
  );
  fit(editor);
  return { nodes: cards.length, relations: relations.length, truncated };
};

const Row = ({
  node,
  active,
  onPick,
}: {
  node: GNode;
  active: boolean;
  onPick: (n: GNode) => void;
}): JSX.Element => {
  const d = display(node);
  return (
    <li>
      <button
        className={`${TW_ROW_BUTTON} grid-cols-[8px_minmax(0,1fr)] items-start gap-2.5 px-2.5 py-[11px] ${active ? "bg-[#eef2f6]" : "bg-transparent hover:bg-[#f8fafc]"}`}
        style={
          active
            ? { boxShadow: `inset 3px 0 0 ${TYPE_COLOUR[node.type]}` }
            : undefined
        }
        aria-current={active}
        onClick={() => onPick(node)}
      >
        <span
          className={`${TW_DOT} mt-[5px]`}
          style={{ background: TYPE_COLOUR[node.type] }}
        />
        <span className="grid min-w-0 gap-px">
          <span
            className={`line-clamp-2 text-[14px] leading-[1.35] ${active ? "font-semibold" : "font-medium"}`}
          >
            {d.head}
          </span>
          <span className="mt-[3px] truncate font-mono text-[12px] tracking-[-0.01em] text-[#56637a]">
            {node.type}
            {d.value ? " · " + d.value : ""}
          </span>
        </span>
      </button>
    </li>
  );
};

const LISTED = 60;
/** An answer list longer than this gets a filter box. */
const FILTER_FROM = 15;
/** A value whose note says in plain words what it is, which reads better at the top of a list than a bare key or a note that cites the project's own audit items (A17, F7, U6). */
const described = (n: GNode): number => {
  const meaning = String(n.props.meaning ?? "");
  return /^[A-Za-z]/.test(meaning) && !/\b[AFU]\d+\b/.test(meaning) ? 0 : 1;
};
/** The answers to a question: values described in words first, then by what the list shows for each, so a reader can find one. */
const answersTo = (
  data: { nodes: GNode[]; relations: GRelation[] },
  query: Query,
): GNode[] =>
  [...runQuery({ ...data, query })].sort(
    (a, b) =>
      described(a) - described(b) ||
      display(a).head.localeCompare(display(b).head, "en", {
        sensitivity: "base",
        numeric: true,
      }),
  );
const FIRST_QUESTION: Asked = {
  id: PRESETS[0]!.id,
  query: PRESETS[0]!.query,
};
/** A link can open a preset question: #ask=<preset id>. */
const askedFromHash = (): Asked | null => {
  const id = new URLSearchParams(window.location.hash.slice(1)).get("ask");
  const preset = PRESETS.find((p) => p.id === id);
  return preset ? { id: preset.id, query: preset.query } : null;
};
const setHash = (hash: string): void =>
  window.history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search + hash,
  );

export const App = (): JSX.Element => {
  const [index, setIndex] = useState<Index | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("NMDA");
  const [type, setType] = useState("");
  const [mode, setMode] = useState<"search" | "ask">(() =>
    askedFromHash() ? "ask" : "search",
  );
  const [asked, setAsked] = useState<Asked>(
    () => askedFromHash() ?? FIRST_QUESTION,
  );
  const [listed, setListed] = useState(LISTED);
  const [within, setWithin] = useState("");
  const [depth, setDepth] = useState(1);
  const [focus, setFocus] = useState<GNode | null>(null);
  const [selected, setSelected] = useState<GNode | null>(null);
  // a link to a question promises its answers, so on a phone it opens on the list; otherwise on the drawing
  const [pane, setPane] = useState<Pane>(() =>
    askedFromHash() ? "find" : "graph",
  );
  /** Choosing a note draws it, and on a phone shows the drawing. */
  const pick = useCallback((n: GNode): void => {
    setFocus(n);
    setPane("graph");
  }, []);
  const [shown, setShown] = useState({
    nodes: 0,
    relations: 0,
    truncated: false,
  });
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    fetch("graph.json")
      .then((r) =>
        r.ok
          ? (r.json() as Promise<GraphData>)
          : Promise.reject(new Error("graph.json " + r.status)),
      )
      .then((data) => {
        setIndex(buildIndex(data));
        // a link to a question opens on its first answer; otherwise on the start note
        const linked = askedFromHash();
        const answer = linked ? answersTo(data, linked.query)[0] : undefined;
        setFocus(
          answer ??
            data.nodes.find((n) => n.name === START) ??
            data.nodes[0] ??
            null,
        );
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : String(e)),
      );
  }, []);

  // cards are sized by measuring their text, so they are drawn again once the web font is in (a fallback font wraps to fewer lines)
  const [fonts, setFonts] = useState(false);
  useEffect(() => {
    void document.fonts.ready.then(() => setFonts(true));
  }, []);
  const redraw = useCallback(() => {
    void fonts;
    if (index && focus && editorRef.current) {
      setShown(
        draw({ editor: editorRef.current, index, uid: focus.uid, depth }),
      );
      setSelected(focus);
    }
  }, [index, focus, depth, fonts]);
  useEffect(redraw, [redraw]);

  const onMount = useCallback(
    (editor: Editor) => {
      editorRef.current = editor;
      Object.assign(window, {
        __editor: editor,
        __canvasMarkdown: () => canvasMarkdown(editor),
        __loadAsPlugin: loadAsPlugin,
      });
      if (window.matchMedia("(pointer: coarse)").matches) {
        // on a touch screen one finger moves the view (the select tool would draw a selection box); a tap on a card still selects it
        editor.setCurrentTool("hand");
        let down: { x: number; y: number } | null = null;
        editor.on("event", (e) => {
          if (e.type !== "pointer") return;
          const at = editor.inputs.currentScreenPoint;
          if (e.name === "pointer_down") down = { x: at.x, y: at.y };
          if (e.name !== "pointer_up" || !down) return;
          const moved = Math.hypot(at.x - down.x, at.y - down.y);
          down = null;
          if (moved > 8) return;
          const hit = editor.getShapeAtPoint(editor.inputs.currentPagePoint, {
            hitInside: true,
          });
          if (hit?.type === "discourse-node") editor.select(hit.id);
        });
      }
      editor.sideEffects.registerAfterChangeHandler(
        "instance_page_state",
        () => {
          const only = editor.getOnlySelectedShape();
          if (only?.type === "discourse-node" && index)
            setSelected(
              index.byUid.get(cardMeta(only as DiscourseNodeShape).uid) ?? null,
            );
        },
      );
      redraw();
    },
    [index, redraw],
  );

  /** Asking draws the first answer, so the canvas responds to the question and not only the list. */
  const drawFirst = useCallback(
    (asking: Query): void => {
      if (!index) return;
      const first = answersTo(index.data, asking)[0];
      if (first) setFocus(first);
    },
    [index],
  );
  const ask = useCallback(
    (next: Asked): void => {
      setAsked(next);
      setListed(LISTED);
      setWithin("");
      setHash(next.id === CUSTOM ? "" : `#ask=${next.id}`);
      drawFirst(next.query);
    },
    [drawFirst],
  );
  const switchMode = useCallback(
    (next: "search" | "ask"): void => {
      setMode(next);
      setListed(LISTED);
      setHash(next === "ask" && asked.id !== CUSTOM ? `#ask=${asked.id}` : "");
      if (next === "ask") drawFirst(asked.query);
    },
    [asked, drawFirst],
  );
  const counts = useMemo((): Record<string, number> => {
    if (!index) return {};
    const { nodes, relations } = index.data;
    const custom = asked.id === CUSTOM ? asked.query : DEFAULT_CUSTOM;
    return Object.fromEntries(
      [...PRESETS, { id: CUSTOM, query: custom }].map((q) => [
        q.id,
        runQuery({ nodes, relations, query: q.query }).length,
      ]),
    );
  }, [index, asked]);
  const results = useMemo((): {
    total: number;
    answers: number;
    hits: GNode[];
  } => {
    if (!index) return { total: 0, answers: 0, hits: [] };
    if (mode === "search") {
      const found = search({ index, query, type, limit: listed });
      return { ...found, answers: found.total };
    }
    const { nodes, relations } = index.data;
    const answers = answersTo({ nodes, relations }, asked.query);
    const words = within.toLowerCase().split(/\s+/).filter(Boolean);
    const found = words.length
      ? answers.filter((n) => {
          // the title, and for a value its key and number, since a short title says little on its own
          const text =
            `${n.title} ${n.props.key ?? ""} ${n.props.value ?? ""}`.toLowerCase();
          return words.every((w) => text.includes(w));
        })
      : answers;
    return {
      total: found.length,
      answers: answers.length,
      hits: found.slice(0, listed),
    };
  }, [index, mode, query, type, asked, listed, within]);
  const links = useMemo(() => {
    if (!index || !selected) return [];
    return (index.touching.get(selected.uid) ?? []).map((r) => {
      const outgoing = r.source === selected.uid;
      return {
        id: r.id,
        label: r.label,
        outgoing,
        other: index.byUid.get(outgoing ? r.destination : r.source)!,
      };
    });
  }, [index, selected]);

  if (error)
    return (
      <div className="text-muted p-6">Could not load the graph: {error}</div>
    );
  if (!index) return <div className="text-muted p-6">Loading the graph…</div>;
  const head = selected ? display(selected) : null;
  // the headline and the line under it are not repeated among the properties
  const facts = selected
    ? ordered(selected.props).filter(
        ([, v]) => v !== head?.head && v !== head?.sub,
      )
    : [];
  return (
    <div className="relative block h-full overflow-hidden">
      <aside
        className={`${TW_PANEL} ${pane === "find" ? "" : TW_OFF} bottom-3 left-3 top-3 flex w-[300px] flex-col gap-4 pb-0 pl-5 pr-3.5 pt-5 max-[900px]:overflow-y-auto`}
      >
        <header className="border-line-2 mr-1.5 flex items-center gap-3 border-0 border-b border-solid pb-4 pr-1">
          <span
            className="bg-ink relative h-[34px] w-[34px] flex-none rounded-[9px]"
            aria-hidden="true"
          >
            <i className="absolute left-[7px] top-2 h-2 w-2 rounded-full bg-[#14b8a6]" />
            <i className="absolute right-[7px] top-2 h-2 w-2 rounded-full bg-[#3b82f6]" />
            <i className="absolute bottom-[7px] left-[13px] h-2 w-2 rounded-full bg-[#f59e0b]" />
          </span>
          <div>
            <h1 className="text-[16px] font-bold tracking-[-0.01em]">
              TruSoma
            </h1>
            <p className="text-[12.5px] text-[#56637a]">
              A research record as a graph
            </p>
          </div>
          <a
            className="text-accent ml-auto whitespace-nowrap text-[12.5px] font-medium no-underline hover:underline max-[900px]:text-[14px]"
            href="../"
          >
            Six uses
          </a>
        </header>
        <p className="-mt-0.5 mr-1.5 text-[13px] leading-normal text-[#56637a]">
          <b className={TW_COUNT}>{index.data.nodes.length.toLocaleString()}</b>{" "}
          notes ·{" "}
          <b className={TW_COUNT}>
            {index.data.relations.length.toLocaleString()}
          </b>{" "}
          relations ·{" "}
          <b className={TW_COUNT}>
            {(counts["sourced-values"] ?? 0).toLocaleString()}
          </b>{" "}
          values with a quoted source
        </p>
        <div
          className="border-line mr-1 grid h-[34px] flex-none grid-cols-2 overflow-hidden rounded-lg border border-solid bg-white max-[900px]:h-11"
          role="group"
          aria-label="Mode"
        >
          {(["search", "ask"] as const).map((m) => (
            <button
              key={m}
              className={`border-line border-0 border-solid font-medium ${m === "ask" ? "border-l" : ""} ${m === mode ? "bg-ink text-white" : "text-muted hover:bg-canvas bg-transparent"}`}
              aria-pressed={m === mode}
              onClick={() => switchMode(m)}
            >
              {m === "search" ? "Search" : "Ask"}
            </button>
          ))}
        </div>
        <div
          className="flex min-h-0 flex-1 flex-col gap-4 max-[900px]:flex-none"
          data-testid="column"
        >
          {mode === "search" ? (
            <>
              <div className="relative mr-1">
                <svg
                  className="stroke-faint absolute left-[11px] top-2.5 h-4 w-4 fill-none [stroke-linecap:round] [stroke-width:1.8] max-[900px]:top-3.5"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="9" r="5.5" />
                  <path d="M13.5 13.5 17 17" />
                </svg>
                <input
                  className={`border-line h-[38px] w-full rounded-lg border border-solid bg-white pl-[34px] pr-3 hover:border-[#cbd5e1] ${TW_TALL}`}
                  aria-label="Search notes"
                  placeholder="Search notes"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setListed(LISTED);
                  }}
                />
              </div>
              <div className="mr-1 grid grid-cols-[1fr_auto] gap-3">
                <label className="grid gap-1.5">
                  <span className={TW_LABEL}>Type</span>
                  <select
                    className={`dg-select border-line h-[34px] w-full appearance-none rounded-lg border border-solid pl-[11px] pr-[30px] hover:border-[#cbd5e1] ${TW_TALL}`}
                    aria-label="Node type"
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value);
                      setListed(LISTED);
                    }}
                  >
                    <option value="">All types</option>
                    {COLUMNS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid gap-1.5">
                  <span className={TW_LABEL}>Hops</span>
                  <div
                    className="border-line flex h-[34px] overflow-hidden rounded-lg border border-solid bg-white max-[900px]:h-11"
                    role="group"
                    aria-label="Hops"
                  >
                    {[1, 2, 3, 4].map((d) => (
                      <button
                        key={d}
                        className={`border-line w-[38px] border-0 border-solid font-medium max-[900px]:w-12 max-[900px]:flex-none ${d > 1 ? "border-l" : ""} ${d === depth ? "bg-ink text-white" : "text-muted hover:bg-canvas bg-transparent"}`}
                        aria-pressed={d === depth}
                        onClick={() => setDepth(d)}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Ask
              asked={asked}
              counts={counts}
              nodeTypes={index.data.nodeTypes.map((t) => t.name)}
              relationLabels={index.data.relationTypes.map((t) => t.label)}
              onAsk={ask}
            />
          )}
          <div
            className={`${TW_LABEL} border-line-2 mr-1.5 flex-none border-0 border-t border-solid pt-3.5`}
          >
            {results.total.toLocaleString()}
            {results.total < results.answers
              ? ` of ${results.answers.toLocaleString()}`
              : ""}{" "}
            {results.answers === 1 ? "result" : "results"}
          </div>
          {mode === "ask" && results.answers > FILTER_FROM ? (
            <input
              className={`border-line -mt-1.5 mr-1 h-[34px] flex-none rounded-lg border border-solid bg-white px-[11px] hover:border-[#cbd5e1] ${TW_TALL}`}
              aria-label="Filter the results"
              placeholder={`Filter ${results.answers.toLocaleString()} results`}
              value={within}
              onChange={(e) => {
                setWithin(e.target.value);
                setListed(LISTED);
              }}
            />
          ) : null}
          <ul
            className="dg-scroll -ml-2.5 -mt-1.5 mb-0 mr-0 grid min-h-0 flex-1 list-none content-start gap-0.5 overflow-y-auto pb-6 pl-0 pr-2.5 pt-0 max-[900px]:flex-none max-[900px]:overflow-visible min-[901px]:[mask-image:linear-gradient(to_bottom,#000_calc(100%-28px),transparent)]"
            data-testid="results"
          >
            {results.hits.map((n) => (
              <Row
                key={n.uid}
                node={n}
                active={focus?.uid === n.uid}
                onPick={pick}
              />
            ))}
            {results.total > results.hits.length ? (
              <li className="pl-2.5 pt-1.5">
                <button
                  className="border-line text-ink-2 hover:bg-canvas h-[34px] w-full rounded-lg border border-solid bg-white text-[13px] font-medium max-[900px]:h-11 max-[900px]:text-[14px]"
                  onClick={() => setListed(listed + LISTED)}
                >
                  Show {Math.min(LISTED, results.total - results.hits.length)}{" "}
                  more of {results.total.toLocaleString()}
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      </aside>
      <main className="absolute inset-0 grid min-h-0 min-w-0 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] overflow-hidden max-[900px]:bottom-[calc(56px+env(safe-area-inset-bottom))]">
        <div className="dg-canvas relative min-h-0 min-w-0">
          <Tldraw
            shapeUtils={shapeUtils}
            bindingUtils={bindingUtils}
            migrations={migrations}
            components={components}
            onMount={onMount}
          />
          <div
            className="border-line text-muted absolute left-[328px] top-3.5 z-[300] max-w-[calc(100%-688px)] truncate rounded-full border border-solid bg-[rgba(255,255,255,0.82)] px-3.5 py-[7px] text-[12.5px] [backdrop-filter:blur(8px)] [box-shadow:0_1px_2px_rgba(15,23,42,0.05)] max-[900px]:left-3 max-[900px]:top-3 max-[900px]:max-w-[calc(100%-24px)] max-[900px]:whitespace-normal max-[900px]:rounded-xl max-[900px]:bg-[rgba(255,255,255,0.94)] max-[900px]:text-[13px] max-[900px]:[-webkit-box-orient:vertical] max-[900px]:[-webkit-line-clamp:2] max-[900px]:[display:-webkit-box]"
            data-testid="status"
          >
            <span>
              <b className={TW_STRONG}>{shown.nodes}</b>{" "}
              {shown.nodes === 1 ? "note" : "notes"} and{" "}
              <b className={TW_STRONG}>{shown.relations}</b>{" "}
              {shown.relations === 1 ? "relation" : "relations"} within {depth}{" "}
              {depth === 1 ? "hop" : "hops"} of{" "}
              <em className={TW_STRONG}>{focus ? display(focus).head : ""}</em>
              {shown.truncated
                ? " (drawn in part; the panel lists the rest)"
                : ""}
            </span>
          </div>
          <div
            className="border-line absolute bottom-3.5 left-[328px] z-[300] flex overflow-hidden rounded-lg border border-solid bg-white [box-shadow:0_1px_2px_rgba(15,23,42,0.05)] max-[900px]:bottom-3 max-[900px]:left-3"
            role="group"
            aria-label="Zoom"
          >
            <button
              className={TW_ZOOM_BUTTON}
              aria-label="Zoom out"
              onClick={() =>
                editorRef.current?.zoomOut(undefined, {
                  animation: { duration: 120 },
                })
              }
            >
              −
            </button>
            <button
              className={`${TW_ZOOM_BUTTON} border-l`}
              onClick={() => editorRef.current && fit(editorRef.current)}
            >
              Fit
            </button>
            <button
              className={`${TW_ZOOM_BUTTON} border-l`}
              aria-label="Zoom in"
              onClick={() =>
                editorRef.current?.zoomIn(undefined, {
                  animation: { duration: 120 },
                })
              }
            >
              +
            </button>
            <button
              className={`${TW_ZOOM_BUTTON} border-l`}
              title="Save this canvas as a file for the Discourse Graphs Obsidian plugin"
              onClick={() =>
                editorRef.current &&
                focus &&
                saveCanvasFile(
                  editorRef.current,
                  `Canvas - ${display(focus).head}`,
                )
              }
            >
              <span className="max-[900px]:hidden">Save canvas</span>
              <span className="hidden max-[900px]:inline">Save</span>
            </button>
          </div>
          {selected ? (
            <button
              className="bg-ink absolute bottom-[60px] right-3 z-[300] hidden h-11 max-w-[60%] items-center gap-2 rounded-lg border-0 px-3.5 text-[14px] font-semibold text-white [box-shadow:0_4px_14px_rgba(15,23,42,0.25)] max-[900px]:flex"
              data-testid="read-note"
              onClick={() => setPane("note")}
            >
              <i
                className={TW_DOT}
                style={{ background: TYPE_COLOUR[selected.type] }}
              />
              <span className="truncate">Read note</span>
            </button>
          ) : null}
        </div>
      </main>
      <aside
        className={`${TW_PANEL} ${pane === "note" ? "" : TW_OFF} dg-scroll right-3 top-3 max-h-[calc(100%-84px)] w-[324px] overflow-y-auto p-5`}
        data-testid="note"
      >
        {selected && head ? (
          <>
            <div className="flex items-center justify-between">
              <span
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.06em]"
                style={{ color: TYPE_COLOUR[selected.type] ?? "#334155" }}
              >
                <i className="h-2 w-2 rounded-full bg-current" />
                {selected.type}
              </span>
              {typeof selected.props.reading === "string" ? (
                <span
                  className={TW_READING}
                  style={{
                    ["--c" as string]:
                      READING_COLOUR[selected.props.reading] ?? "#64748b",
                  }}
                >
                  {selected.props.reading}
                </span>
              ) : null}
            </div>
            <h2 className="mt-4 text-[21px] font-semibold leading-[1.3] tracking-[-0.01em] [overflow-wrap:anywhere]">
              {head.head}
              {head.value ? (
                <span className="text-ink ml-2.5 rounded-md bg-[#f1f5f9] px-2 py-0.5 align-[2px] font-mono text-[15px] font-medium tracking-normal">
                  {head.value}
                </span>
              ) : null}
            </h2>
            {head.sub ? (
              <p className="text-muted mt-1.5 [overflow-wrap:anywhere]">
                {head.code ? (
                  <code className={TW_CODE}>{head.sub}</code>
                ) : (
                  head.sub
                )}
              </p>
            ) : null}
            {selected.uid !== focus?.uid ? (
              <button
                className="border-line text-ink-2 hover:bg-canvas mt-3.5 h-8 rounded-lg border border-solid bg-white px-3 font-medium max-[900px]:h-11"
                onClick={() => pick(selected)}
              >
                Centre the canvas here
              </button>
            ) : null}
            {facts.length ? <h3 className={TW_SECTION}>Properties</h3> : null}
            <dl className="m-0 grid grid-cols-[max-content_minmax(0,1fr)] items-baseline gap-x-5 gap-y-3">
              {facts.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt
                    className={`text-[13px] text-[#56637a] ${LONG.has(k) ? "col-span-full mt-1.5" : ""}`}
                  >
                    {LABEL[k] ?? k.replace(/_/g, " ")}
                  </dt>
                  <dd
                    className={`m-0 [overflow-wrap:anywhere] ${LONG.has(k) ? "text-ink-2 col-span-full -mt-1.5" : "text-ink"} ${DD[k] ?? "text-[13.5px]"}`}
                  >
                    {CODE.has(k) ? (
                      <code className={TW_CODE}>{String(v)}</code>
                    ) : k === "status" ? (
                      <span className="inline-block rounded-full bg-[#ecfdf5] px-[9px] py-0.5 text-[12px] font-semibold text-[#166534]">
                        {pretty(String(v))}
                      </span>
                    ) : typeof v === "boolean" ? (
                      v ? (
                        "Yes"
                      ) : (
                        "No"
                      )
                    ) : k === "doi" ? (
                      <a
                        className="text-accent [overflow-wrap:anywhere]"
                        href={`https://doi.org/${String(v)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {String(v)}
                      </a>
                    ) : (
                      shownText(v)
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <h3 className={TW_SECTION}>
              Relations{" "}
              <span className="text-faint [font-variant-numeric:tabular-nums]">
                {links.length}
              </span>
            </h3>
            {links.length ? (
              <ul className="-mx-2 -mb-1.5 mt-0 grid list-none gap-1 p-0">
                {links.map((l) => (
                  <li key={l.id}>
                    <button
                      className={`${TW_ROW_BUTTON} grid-cols-[minmax(0,1fr)] items-baseline gap-[3px] bg-transparent p-2 hover:bg-[#f8fafc] max-[900px]:py-2.5`}
                      onClick={() => pick(l.other)}
                    >
                      <span className="inline-flex min-w-0 items-center gap-[5px] justify-self-start whitespace-nowrap text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[#475569]">
                        {l.outgoing ? null : (
                          <i className="text-faint not-italic">←</i>
                        )}
                        {l.label}
                        {l.outgoing ? (
                          <i className="text-faint not-italic">→</i>
                        ) : null}
                      </span>
                      <span className="flex min-w-0 items-baseline gap-2 text-[14px] font-medium leading-[1.35]">
                        <span
                          className={`${TW_DOT} [transform:translateY(-1px)]`}
                          style={{ background: TYPE_COLOUR[l.other.type] }}
                        />
                        <span className="line-clamp-2 min-w-0 whitespace-normal">
                          {display(l.other).head}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">
                No relation yet: nothing in the record supports or uses this
                note.
              </p>
            )}
          </>
        ) : (
          <p className="text-muted">Select a card to read its properties.</p>
        )}
      </aside>
      <nav
        className="border-line absolute inset-x-0 bottom-0 z-[500] hidden grid-cols-[1fr_1fr_1fr_auto] border-0 border-t border-solid bg-white pb-[env(safe-area-inset-bottom)] before:pointer-events-none before:absolute before:inset-x-0 before:-top-6 before:h-6 before:bg-gradient-to-t before:from-white before:to-transparent before:content-[''] max-[900px]:grid"
        aria-label="View"
      >
        {(
          [
            ["find", mode === "ask" ? "Ask" : "Search"],
            ["graph", "Graph"],
            ["note", "Note"],
          ] as const
        ).map(([id, text]) => (
          <button
            key={id}
            className={`relative h-14 border-0 bg-transparent text-[13px] font-semibold ${id === pane ? "text-ink" : "text-[#475569]"}`}
            aria-pressed={id === pane}
            data-testid={`tab-${id}`}
            onClick={() => setPane(id)}
          >
            {id === pane ? (
              <i className="bg-ink absolute inset-x-6 top-0 h-[3px] rounded-b" />
            ) : null}
            {text}
          </button>
        ))}
        <a
          className="text-accent border-line flex h-14 items-center border-0 border-l border-solid px-4 text-[13px] font-semibold no-underline"
          href="../"
        >
          Six uses
        </a>
      </nav>
    </div>
  );
};
