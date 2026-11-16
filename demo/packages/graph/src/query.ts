/**
 * Questions over the discourse graph, as data: "find notes of one type that have, or do not have, a relation of a given label to or from a note of a given type".
 * Pure functions over plain nodes and relations (no file or network access), so the canvas and the tests run the same code.
 * The preset questions are queries like any other; nothing about them is special-cased.
 */
export type QueryNode = {
  uid: string;
  type: string;
  props: Record<string, unknown>;
};
export type QueryRelation = {
  label: string;
  source: string;
  destination: string;
};

/** "to": the relation leaves the note found; "from": it arrives at the note found. An empty type means any type. */
export type Condition = {
  has: boolean;
  relation: string;
  direction: "to" | "from";
  type: string;
};
/** The property must be present; with oneOf, its value must also be one of those listed. The label is how the sentence says it. */
export type PropertyFilter = { key: string; oneOf?: string[]; label?: string };
export type Query = {
  type: string;
  where: Condition[];
  props?: PropertyFilter[];
};
/** plain says in everyday words what the query selects; the query itself is the exact statement. */
export type Preset = {
  id: string;
  question: string;
  plain: string;
  query: Query;
};

const edgeKey = ({
  direction,
  relation,
  type,
}: {
  direction: string;
  relation: string;
  type: string;
}): string => `${direction}|${relation}|${type}`;

/** For every note, the set of "direction|label|type of the other end" it takes part in, with the any-type form alongside. */
const edgeIndex = ({
  nodes,
  relations,
}: {
  nodes: QueryNode[];
  relations: QueryRelation[];
}): Map<string, Set<string>> => {
  const typeOf = new Map(nodes.map((n) => [n.uid, n.type]));
  const edges = new Map<string, Set<string>>();
  const add = ({
    uid,
    direction,
    relation,
    other,
  }: {
    uid: string;
    direction: "to" | "from";
    relation: string;
    other: string;
  }): void => {
    const type = typeOf.get(other);
    if (type === undefined) return; // a relation whose other end is not a note in this graph says nothing
    const set = edges.get(uid) ?? new Set<string>();
    set.add(edgeKey({ direction, relation, type }));
    set.add(edgeKey({ direction, relation, type: "" }));
    edges.set(uid, set);
  };
  for (const r of relations) {
    add({
      uid: r.source,
      direction: "to",
      relation: r.label,
      other: r.destination,
    });
    add({
      uid: r.destination,
      direction: "from",
      relation: r.label,
      other: r.source,
    });
  }
  return edges;
};

const matchesProps = (node: QueryNode, filters: PropertyFilter[]): boolean =>
  filters.every(({ key, oneOf }) => {
    const value = node.props[key];
    if (value === undefined || value === null || value === "") return false;
    return (
      !oneOf ||
      oneOf.includes(typeof value === "string" ? value : JSON.stringify(value))
    );
  });

/** The notes that answer the query, in the order they were given. */
export const runQuery = <N extends QueryNode>({
  nodes,
  relations,
  query,
}: {
  nodes: N[];
  relations: QueryRelation[];
  query: Query;
}): N[] => {
  const edges = edgeIndex({ nodes, relations });
  return nodes.filter((node) => {
    if (query.type && node.type !== query.type) return false;
    if (!matchesProps(node, query.props ?? [])) return false;
    const own = edges.get(node.uid);
    return query.where.every(
      (condition) => (own?.has(edgeKey(condition)) ?? false) === condition.has,
    );
  });
};

const article = (word: string): string =>
  /^[aeiou]/i.test(word) ? `an ${word}` : `a ${word}`;

/** The query as one English sentence, so a reader can check what a preset or a built question really asks. */
export const describeQuery = (query: Query): string => {
  const subject = query.type ? `${query.type} notes` : "Notes";
  const props = (query.props ?? []).map(
    ({ key, oneOf, label }) =>
      label ??
      (oneOf ? `whose ${key} is ${oneOf.join(" or ")}` : `that have a ${key}`),
  );
  // "with a ..." or "with no ..." is said once per run of conditions of the same kind
  const conditions = query.where.map(
    ({ has, relation, direction, type }, at) => {
      const repeats = at > 0 && query.where[at - 1]!.has === has;
      const lead = repeats ? (has ? "a" : "no") : has ? "with a" : "with no";
      return `${lead} "${relation}" relation ${direction} ${type ? article(type) : "any note"}`;
    },
  );
  const listed =
    conditions.length > 1
      ? `${conditions.slice(0, -1).join(", ")} and ${conditions[conditions.length - 1]!}`
      : (conditions[0] ?? "");
  const described = props.length
    ? `${subject} ${props.join(" and ")}`
    : subject;
  return listed
    ? `${described}${props.length ? "," : ""} ${listed}`
    : described;
};

export const PRESETS: Preset[] = [
  {
    id: "claims-without-evidence",
    question: "Which model values have no evidence linked yet?",
    plain:
      "Values the model uses that no quote, result or other claim is linked to.",
    query: {
      type: "Claim",
      props: [{ key: "key", label: "that are model values" }],
      where: [
        { has: false, relation: "supports", direction: "from", type: "" },
        { has: false, relation: "informs", direction: "from", type: "" },
        { has: false, relation: "informs", direction: "to", type: "" },
      ],
    },
  },
  {
    id: "untested-hypotheses",
    question: "Which hypotheses have no experiment linked?",
    plain:
      "Hypotheses that motivate no experiment note; links to other kinds of note do not count.",
    query: {
      type: "Hypothesis",
      where: [
        {
          has: false,
          relation: "motivates",
          direction: "to",
          type: "Experiment",
        },
      ],
    },
  },
  {
    id: "supported-but-untested",
    question: "Which hypotheses have evidence but no experiment linked?",
    plain:
      "Hypotheses a quoted source agrees with, but that motivate no experiment note.",
    query: {
      type: "Hypothesis",
      where: [
        {
          has: true,
          relation: "consistent with",
          direction: "from",
          type: "Evidence",
        },
        {
          has: false,
          relation: "motivates",
          direction: "to",
          type: "Experiment",
        },
      ],
    },
  },
  {
    id: "failed-results",
    question: "Which results failed or showed no signal?",
    plain: "Results whose reading was recorded as fail or no-signal.",
    query: {
      type: "Result",
      props: [{ key: "reading", oneOf: ["fail", "no-signal"] }],
      where: [],
    },
  },
  {
    id: "unused-evidence",
    question: "Which evidence is not linked to a claim or hypothesis?",
    plain: "Quoted evidence that is not attached to any claim or hypothesis.",
    query: {
      type: "Evidence",
      where: [
        { has: false, relation: "supports", direction: "to", type: "" },
        { has: false, relation: "consistent with", direction: "to", type: "" },
      ],
    },
  },
];
