/** The static graph the canvas reads, and the two queries it needs: search, and the neighbourhood of one node with its layout (two tracks for a small one, ranks by node type for a larger one; see arrange). */
export type GNode = {
  uid: string;
  type: string;
  typeId: string;
  title: string;
  name: string;
  props: Record<string, string | number | boolean>;
};
export type GRelation = {
  id: string;
  label: string;
  typeId: string;
  source: string;
  destination: string;
};
export type GraphData = {
  nodeTypes: { id: string; name: string }[];
  relationTypes: { id: string; label: string }[];
  nodes: GNode[];
  relations: GRelation[];
};

export type Index = {
  data: GraphData;
  byUid: Map<string, GNode>;
  byTitle: Map<string, GNode>;
  touching: Map<string, GRelation[]>;
};

export const buildIndex = (data: GraphData): Index => {
  const byUid = new Map(data.nodes.map((n) => [n.uid, n]));
  const byTitle = new Map(data.nodes.map((n) => [n.title, n]));
  const touching = new Map<string, GRelation[]>();
  for (const r of data.relations) {
    for (const end of [r.source, r.destination]) {
      const list = touching.get(end);
      if (list) list.push(r);
      else touching.set(end, [r]);
    }
  }
  return { data, byUid, byTitle, touching };
};

export const search = ({
  index,
  query,
  type,
  limit = 60,
}: {
  index: Index;
  query: string;
  type: string;
  limit?: number;
}): { total: number; hits: GNode[] } => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length && !type) return { total: 0, hits: [] };
  const hits = index.data.nodes.filter((n) => {
    if (type && n.type !== type) return false;
    const text = (n.title + " " + JSON.stringify(n.props)).toLowerCase();
    return words.every((w) => text.includes(w));
  });
  hits.sort(
    (a, b) =>
      (index.touching.get(b.uid)?.length ?? 0) -
        (index.touching.get(a.uid)?.length ?? 0) ||
      a.title.localeCompare(b.title),
  );
  return { total: hits.length, hits: hits.slice(0, limit) };
};

/** The order a path reads in: where a value comes from on the left, what was done with it on the right. */
export const COLUMNS = [
  "Source",
  "Evidence",
  "Claim",
  "Question",
  "Hypothesis",
  "Issue",
  "Experiment",
  "Result",
  "Conclusion",
];
export const CARD = { w: 312, h: 150, gapX: 150, gapY: 36 };
export type Placed = {
  node: GNode;
  x: number;
  y: number;
  hops: number;
  col: number;
  row: number;
  offset: number;
};

export const neighbourhood = ({
  index,
  startUid,
  depth,
  limit = 48,
}: {
  index: Index;
  startUid: string;
  depth: number;
  limit?: number;
}): { placed: Placed[]; relations: GRelation[]; truncated: boolean } => {
  const start = index.byUid.get(startUid);
  if (!start) return { placed: [], relations: [], truncated: false };
  const hops = new Map<string, number>([[startUid, 0]]);
  let frontier = [startUid];
  let truncated = false;
  for (let hop = 1; hop <= depth; hop++) {
    const next: string[] = [];
    for (const uid of frontier) {
      for (const r of index.touching.get(uid) ?? []) {
        const other = r.source === uid ? r.destination : r.source;
        if (hops.has(other)) continue;
        if (hops.size >= limit) {
          truncated = true;
          continue;
        }
        hops.set(other, hop);
        next.push(other);
      }
    }
    frontier = next;
  }
  const columns = new Map<string, GNode[]>();
  for (const uid of hops.keys()) {
    const n = index.byUid.get(uid)!;
    const list = columns.get(n.type);
    if (list) list.push(n);
    else columns.set(n.type, [n]);
  }
  const used = COLUMNS.filter((c) => columns.has(c));
  const tallest = Math.max(...used.map((c) => columns.get(c)!.length));
  const placed: Placed[] = [];
  used.forEach((type, col) => {
    const list = columns
      .get(type)!
      .sort(
        (a, b) =>
          hops.get(a.uid)! - hops.get(b.uid)! || a.title.localeCompare(b.title),
      );
    const offset = ((tallest - list.length) * (CARD.h + CARD.gapY)) / 2;
    list.forEach((node, row) =>
      placed.push({
        node,
        x: col * (CARD.w + CARD.gapX),
        y: offset + row * (CARD.h + CARD.gapY),
        hops: hops.get(node.uid)!,
        col,
        row,
        offset: (tallest - list.length) / 2,
      }),
    );
  });
  const seen = new Set<string>();
  const relations: GRelation[] = [];
  for (const uid of hops.keys()) {
    for (const r of index.touching.get(uid) ?? []) {
      if (!seen.has(r.id) && hops.has(r.source) && hops.has(r.destination)) {
        seen.add(r.id);
        relations.push(r);
      }
    }
  }
  return { placed, relations, truncated };
};

/** Card spacing when the types run top to bottom. */
const DOWN = { gapX: 64, gapY: 64 };
export type Arranged = {
  node: GNode;
  x: number;
  y: number;
  h: number;
  col: number;
  track: number;
  slot: number;
};
export type Flow = "down" | "across" | "tracks" | "layers";

/** A card is as tall as its text: one or two headline lines, and one or two lines under it when the note has them. */
export const LINES = { head: 3, sub: 6, headChars: 27, subChars: 36 };
/** The text width inside a card (its width less padding and border), a little under, so a line that only just fits counts as wrapped. */
const TEXT_W = CARD.w - 2 * 17 - 6;
const FONT = { head: "600 17px", sub: "400 14.5px" };
let pen: CanvasRenderingContext2D | null | undefined;

/** How many lines the browser will wrap the text to, measured in the card's own font; by character count where there is no browser (tests). */
const lineCount = ({
  text,
  font,
  chars,
}: {
  text: string;
  font: string;
  chars: number;
}): number => {
  if (pen === undefined)
    pen =
      typeof document === "undefined"
        ? null
        : document.createElement("canvas").getContext("2d");
  if (!pen) return Math.ceil(text.length / chars);
  const family =
    getComputedStyle(document.documentElement).getPropertyValue("--sans") ||
    "sans-serif";
  pen.font = `${font} ${family}`;
  let lines = 1;
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (pen.measureText(next).width <= TEXT_W) {
      line = next;
      continue;
    }
    // a word wider than the card breaks inside itself
    const own = Math.ceil(pen.measureText(word).width / TEXT_W);
    lines += (line ? 1 : 0) + own - 1;
    line = own > 1 ? "" : word;
    if (own > 1) lines += 1;
  }
  return lines;
};

export const cardHeight = (n: GNode): number => {
  const d = display(n);
  const head = Math.min(
    LINES.head,
    lineCount({ text: d.head, font: FONT.head, chars: LINES.headChars }),
  );
  const sub = !d.sub
    ? 0
    : d.code
      ? 1
      : Math.min(
          LINES.sub,
          lineCount({ text: d.sub, font: FONT.sub, chars: LINES.subChars }),
        );
  return (
    14 + 16 + 7 + head * 24 + (sub ? 7 + (d.code ? 24 : sub * 21) : 0) + 15
  );
};

/** The two tracks of a small drawing: where a value comes from, and what was done with it. */
const TRACK: Record<string, number> = {
  Source: 0,
  Evidence: 0,
  Claim: 0,
  Issue: 0,
  Question: 1,
  Hypothesis: 1,
  Experiment: 1,
  Result: 1,
  Conclusion: 1,
};
const TRACKS = { gapY: 104, gutter: 172, limit: 12 };

/** Spacing of a layered drawing, and the most cards it puts side by side. */
const LAYERS = { gapX: 72, gapY: 96, wide: 3 };

/**
 * A small neighbourhood read top to bottom along its relations: a note sits one row below the lowest note that points at it,
 * so what supports a note is above it and what it informs is below. Each row keeps its cards under the cards that point at them,
 * and out of a column that a longer relation runs down. null when the relations loop or a row would be too wide.
 * In the cards returned, col and slot are the row and track is the column.
 */
const layered = (
  placed: Placed[],
  relations: GRelation[],
): Arranged[] | null => {
  const shown = new Set(placed.map((p) => p.node.uid));
  const edges = relations.filter(
    (r) =>
      shown.has(r.source) &&
      shown.has(r.destination) &&
      r.source !== r.destination,
  );
  const layer = new Map(placed.map((p) => [p.node.uid, 0]));
  for (let pass = 0; ; pass++) {
    let moved = false;
    for (const e of edges) {
      if (layer.get(e.destination)! <= layer.get(e.source)!) {
        layer.set(e.destination, layer.get(e.source)! + 1);
        moved = true;
      }
    }
    if (!moved) break;
    if (pass >= placed.length) return null;
  }
  const depth = Math.max(...layer.values()) + 1;
  const rows = Array.from({ length: depth }, (_, l) =>
    placed.filter((p) => layer.get(p.node.uid) === l),
  );
  const k = Math.max(...rows.map((r) => r.length));
  if (k > LAYERS.wide || depth < 2) return null;
  const column = new Map<string, number>();
  rows.forEach((row, l) => {
    const blocked = new Set(
      edges
        .filter(
          (e) => layer.get(e.source)! < l && layer.get(e.destination)! > l,
        )
        .map((e) => column.get(e.source)!),
    );
    const wish = (p: Placed): number => {
      let weight = 0;
      let sum = 0;
      for (const e of edges.filter((x) => x.destination === p.node.uid)) {
        const span = l - layer.get(e.source)!;
        weight += span;
        sum += span * column.get(e.source)!;
      }
      return weight ? sum / weight : (k - 1) / 2;
    };
    const free = Array.from({ length: k }, (_, i) => i);
    for (const p of [...row].sort(
      (a, b) => wish(a) - wish(b) || a.col - b.col || a.row - b.row,
    )) {
      const w = wish(p);
      const cost = (c: number): number =>
        Math.abs(c - w) + (blocked.has(c) ? 0.75 : 0);
      const best = free.reduce((x, y) => (cost(y) < cost(x) ? y : x));
      free.splice(free.indexOf(best), 1);
      column.set(p.node.uid, best);
    }
  });
  const rowH = rows.map((row) =>
    Math.max(...row.map((p) => cardHeight(p.node))),
  );
  const rowY = rowH.map((_, l) =>
    rowH.slice(0, l).reduce((sum, h) => sum + h + LAYERS.gapY, 0),
  );
  return placed.map((p) => {
    const l = layer.get(p.node.uid)!;
    const h = cardHeight(p.node);
    return {
      node: p.node,
      x: column.get(p.node.uid)! * (CARD.w + LAYERS.gapX),
      y: rowY[l]! + (rowH[l]! - h) / 2,
      h,
      col: l,
      track: column.get(p.node.uid)!,
      slot: l,
    };
  });
};

/**
 * Positions for a view of the given width and height.
 * A small neighbourhood is drawn as two tracks side by side, the sourcing chain (source, evidence, claim) and the testing chain
 * (question, hypothesis, experiment, result), each read top to bottom: a result that supports a claim is then a short step across, not a loop.
 * A larger one is ranked by node type, left to right when that shows the cards larger, else top to bottom.
 */
export const arrange = ({
  placed,
  relations,
  viewW,
  viewH,
}: {
  placed: Placed[];
  relations: GRelation[];
  viewW: number;
  viewH: number;
}): { flow: Flow; cards: Arranged[] } => {
  if (!placed.length) return { flow: "down", cards: [] };
  const layers =
    placed.length <= TRACKS.limit ? layered(placed, relations) : null;
  if (layers) return { flow: "layers", cards: layers };
  const sides = [
    placed.filter((p) => TRACK[p.node.type] === 0),
    placed.filter((p) => TRACK[p.node.type] !== 0),
  ];
  if (placed.length <= TRACKS.limit && sides[0]!.length && sides[1]!.length) {
    const order = (list: Placed[]): Placed[] =>
      [...list].sort((p, q) => p.col - q.col || p.row - q.row);
    const heights = sides.map((list) =>
      order(list).reduce(
        (sum, p) => sum + cardHeight(p.node) + TRACKS.gapY,
        -TRACKS.gapY,
      ),
    );
    const tallest = Math.max(...heights);
    const cards: Arranged[] = [];
    sides.forEach((list, track) => {
      let y = (tallest - heights[track]!) / 2;
      order(list).forEach((p, slot) => {
        const h = cardHeight(p.node);
        cards.push({
          node: p.node,
          x: track * (CARD.w + TRACKS.gutter),
          y,
          h,
          col: p.col,
          track,
          slot,
        });
        y += h + TRACKS.gapY;
      });
    });
    return { flow: "tracks", cards };
  }
  const cols = Math.max(...placed.map((p) => p.col)) + 1;
  const rows = Math.max(...placed.map((p) => p.row + p.offset)) + 1;
  const rankH = Array.from({ length: cols }, (_, c) =>
    Math.max(
      ...placed.filter((p) => p.col === c).map((p) => cardHeight(p.node)),
    ),
  );
  const rankY = rankH.map((_, c) =>
    rankH.slice(0, c).reduce((sum, h) => sum + h + DOWN.gapY, 0),
  );
  const across = {
    w: cols * CARD.w + (cols - 1) * CARD.gapX,
    h: rows * CARD.h + (rows - 1) * CARD.gapY,
  };
  const down = {
    w: rows * CARD.w + (rows - 1) * DOWN.gapX,
    h: rankY[cols - 1]! + rankH[cols - 1]!,
  };
  const scale = (b: { w: number; h: number }): number =>
    Math.min(viewW / b.w, viewH / b.h, 1);
  return scale(across) >= scale(down)
    ? {
        flow: "across",
        cards: placed.map((p) => ({
          node: p.node,
          x: p.x,
          y: p.y,
          h: cardHeight(p.node),
          col: p.col,
          track: 0,
          slot: 0,
        })),
      }
    : {
        flow: "down",
        cards: placed.map((p) => ({
          node: p.node,
          x: (p.row + p.offset) * (CARD.w + DOWN.gapX),
          y: rankY[p.col]!,
          h: cardHeight(p.node),
          col: p.col,
          track: 0,
          slot: 0,
        })),
      };
};

export type Path = {
  lane: number;
  sy: number;
  ey: number;
  t: number;
  flow?: string;
};

/**
 * How each relation is drawn. lane 0: straight between facing sides; otherwise round the outside, its sign the side and its size how far out
 * (a relation that skips a card would cross it). sy and ey are where on the card's side the line leaves and arrives (0 top, 1 bottom), so the
 * lines into one card do not pile on one point; t is where along the line its label sits, staggered so labels in the gutter do not stack.
 */
export const paths = ({
  relations,
  cards,
  flow,
}: {
  relations: GRelation[];
  cards: Arranged[];
  flow: Flow;
}): Map<string, Path> => {
  const byUid = new Map(cards.map((c) => [c.node.uid, c]));
  const out = new Map<string, Path>();
  const ends = relations
    .map((r) => ({ r, a: byUid.get(r.source), b: byUid.get(r.destination) }))
    .filter(
      (x): x is { r: GRelation; a: Arranged; b: Arranged } => !!x.a && !!x.b,
    );
  const used = { plus: 0, minus: 0 };
  if (flow === "layers") {
    // straight down a free column; else down the source's column and into the side of the destination; else a curve, or round the outside
    const at = new Set(cards.map((c) => c.col + ":" + c.track));
    const widest = Math.max(...cards.map((c) => c.track));
    for (const { r, a, b } of ends) {
      const between = ({
        column,
        from,
        to,
      }: {
        column: number;
        from: number;
        to: number;
      }): boolean => {
        for (let l = from; l <= to; l++)
          if (at.has(l + ":" + column)) return false;
        return true;
      };
      const beside = (): boolean => {
        for (
          let c = Math.min(a.track, b.track) + 1;
          c < Math.max(a.track, b.track);
          c++
        )
          if (at.has(b.col + ":" + c)) return false;
        return true;
      };
      const base = { sy: 0.5, ey: 0.5, t: 0.5 };
      // a line that leaves a foot shared with another line leaves it a quarter in, on the side it turns to; a long straight line is labelled in its last gap
      const shared = ends.some((x) => x.a === a && x.r !== r);
      if (
        a.track === b.track &&
        between({ column: a.track, from: a.col + 1, to: b.col - 1 })
      )
        out.set(r.id, {
          lane: 0,
          flow: "layers",
          ...base,
          t: b.col - a.col > 1 ? 0.86 : 0.5,
        });
      else if (
        a.track !== b.track &&
        b.col > a.col &&
        between({ column: a.track, from: a.col + 1, to: b.col }) &&
        beside()
      )
        out.set(r.id, {
          lane: 0,
          flow: "elbow",
          ...base,
          sy: shared ? (b.track < a.track ? 0.25 : 0.75) : 0.5,
        });
      else if (Math.abs(b.col - a.col) === 1)
        out.set(r.id, { lane: 0, flow: "layers", ...base });
      else
        out.set(r.id, {
          lane: a.track + b.track >= widest ? ++used.plus : -++used.minus,
          flow: "down",
          ...base,
        });
    }
    return out;
  }
  if (flow === "tracks") {
    const across = ends.filter((x) => x.a.track !== x.b.track);
    const port = new Map<string, number>();
    const side = (card: Arranged): typeof across =>
      across
        .filter((x) => x.a === card || x.b === card)
        .sort(
          (x, y) =>
            (x.a === card ? x.b.y : x.a.y) - (y.a === card ? y.b.y : y.a.y),
        );
    for (const card of cards) {
      const lines = side(card);
      lines.forEach((x, i) =>
        port.set(card.node.uid + x.r.id, (i + 1) / (lines.length + 1)),
      );
    }
    across
      .sort((x, y) => x.a.y + x.b.y - (y.a.y + y.b.y))
      .forEach((x, i) =>
        out.set(x.r.id, {
          lane: 0,
          sy: port.get(x.a.node.uid + x.r.id) ?? 0.5,
          ey: port.get(x.b.node.uid + x.r.id) ?? 0.5,
          t: across.length > 1 ? (i % 2 ? 0.66 : 0.34) : 0.5,
        }),
      );
    for (const x of ends
      .filter((e) => e.a.track === e.b.track)
      .sort(
        (p, q) => Math.abs(p.a.slot - p.b.slot) - Math.abs(q.a.slot - q.b.slot),
      )) {
      const lane =
        Math.abs(x.a.slot - x.b.slot) <= 1
          ? 0
          : x.a.track === 0
            ? -++used.minus
            : ++used.plus;
      out.set(x.r.id, { lane, sy: 0.5, ey: 0.5, t: 0.5 });
    }
    return out;
  }
  const cross = (c: Arranged): number => (flow === "down" ? c.x : c.y);
  const centre =
    cards.reduce((sum, c) => sum + cross(c), 0) / Math.max(1, cards.length);
  for (const { r, a, b } of ends)
    if (Math.abs(a.col - b.col) <= 1)
      out.set(r.id, { lane: 0, sy: 0.5, ey: 0.5, t: 0.5 });
  for (const { r, a, b } of ends
    .filter((x) => Math.abs(x.a.col - x.b.col) > 1)
    .sort(
      (x, y) => Math.abs(x.a.col - x.b.col) - Math.abs(y.a.col - y.b.col),
    )) {
    const lean = (cross(a) + cross(b)) / 2 - centre;
    const plus = Math.abs(lean) < 1 ? used.plus <= used.minus : lean > 0;
    out.set(r.id, {
      lane: plus ? ++used.plus : -++used.minus,
      sy: 0.5,
      ey: 0.5,
      t: 0.5,
    });
  }
  return out;
};

const text = (v: unknown): string =>
  typeof v === "string"
    ? v
    : typeof v === "number" || typeof v === "boolean"
      ? String(v)
      : "";
const lastPart = (key: string): string =>
  key.slice(key.lastIndexOf(".") + 1).replace(/_/g, " ");

/**
 * What a card and a list row show for a note: a headline a reader can take in, and a quieter second line.
 * Nothing is invented: each is one of the note's own properties (a value's key and number, an evidence note's quote, a paper's citation).
 */
const sentence = (s: string): string =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
export const display = (
  n: GNode,
): { head: string; sub: string; code: boolean; value: string } => {
  const d = show(n);
  return {
    head:
      d.code && n.type === "Claim" && n.props.key ? d.head : sentence(d.head),
    sub: d.sub,
    code: d.code,
    value: d.value ?? "",
  };
};
const show = (
  n: GNode,
): { head: string; sub: string; code: boolean; value?: string } => {
  const p = n.props;
  if (n.type === "Source") {
    const citation = text(p.citation);
    const parts = citation.split(/\.\s+/);
    const first = (parts[0] ?? "").split(/[ ,]/)[0] ?? "";
    const many = (parts[0] ?? "").includes(",");
    return citation
      ? {
          head: `${first}${many ? " et al." : ""} ${text(p.year)}`.trim(),
          sub: parts[1] ?? n.name,
          code: false,
        }
      : { head: n.name, sub: "", code: true };
  }
  if (n.type === "Evidence" && p.quote)
    return {
      head: text(p.quote),
      sub: [text(p.paper_id), text(p.locator)].filter(Boolean).join(" · "),
      code: false,
    };
  if (n.type === "Claim" && p.key) {
    const value = text(p.value);
    return {
      head: text(p.meaning) || lastPart(text(p.key)),
      sub: text(p.key),
      code: true,
      value: value.length <= 12 ? value : "",
    };
  }
  if (n.type === "Issue")
    return {
      head: text(p.item) || n.name,
      sub: [n.name, text(p.status)].filter(Boolean).join(" · "),
      code: false,
    };
  if (n.type === "Question")
    return {
      head: text(p.quote) || n.name,
      sub: n.name === text(p.quote) ? "" : n.name,
      code: false,
    };
  if (n.type === "Experiment")
    return { head: n.name, sub: text(p.date), code: false };
  if (n.type === "Hypothesis" || n.type === "Result")
    return { head: n.name, sub: text(p.quote), code: false };
  const head =
    text(p.statement) ||
    text(p.mechanism) ||
    text(p.method) ||
    text(p.quantity) ||
    text(p.quote);
  return head
    ? { head, sub: n.name, code: true }
    : { head: n.name, sub: "", code: false };
};
