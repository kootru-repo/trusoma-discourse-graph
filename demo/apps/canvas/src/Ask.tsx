/**
 * Questions over the graph: preset ones, and one the reader builds from the grammar ("find notes of a type that have, or lack, a relation to or from a type").
 * Every question is a Query run by packages/graph/src/query.ts; the active preset states in one sentence exactly what it asks, and the builder's controls read as that sentence.
 */
import type { ReactNode } from "react";
import {
  describeQuery,
  PRESETS,
  type Condition,
  type Query,
} from "@repo/graph/query";
import { TW_LABEL, TW_SELECT } from "./tw";

export const CUSTOM = "custom";
/** The active question: a preset's id, or CUSTOM for the one built here. */
export type Asked = { id: string; query: Query };

export const DEFAULT_CUSTOM: Query = {
  type: "Claim",
  where: [
    { has: true, relation: "supports", direction: "from", type: "Evidence" },
  ],
};

const FIRST: Condition = DEFAULT_CUSTOM.where[0]!;
const TW_EXACT = "mb-0 mt-1 text-[12px] leading-normal text-[#4a566b]";
const TW_ASIDE =
  "text-[12px] font-semibold text-[#56637a] [font-variant-numeric:tabular-nums]";

const article = (word: string): string =>
  /^[aeiou]/i.test(word) ? `an ${word}` : `a ${word}`;

/** One row of the list. The active row holds what makes its question exact: a preset's sentence, or the builder's controls. */
const Question = ({
  label,
  aside,
  active,
  onPick,
  children,
}: {
  label: string;
  aside: string;
  active: boolean;
  onPick: () => void;
  children?: ReactNode;
}): JSX.Element => (
  <li
    className={`rounded-lg ${active ? "bg-[#eef2f6] [box-shadow:inset_3px_0_0_#0f172a]" : "hover:bg-[#f8fafc]"}`}
  >
    <button
      className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-2.5 rounded-lg border-0 bg-transparent px-2.5 py-[7px] text-left text-[13.5px] leading-[1.35] ${active ? "font-semibold" : "font-medium"}`}
      aria-pressed={active}
      onClick={onPick}
    >
      <span>{label}</span>
      <span className={TW_ASIDE}>{aside}</span>
    </button>
    {active && children ? (
      <div className="px-2.5 pb-2.5">{children}</div>
    ) : null}
  </li>
);

const Pick = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; text: string }[];
  onChange: (value: string) => void;
}): JSX.Element => (
  <select
    className={`${TW_SELECT} bg-white`}
    aria-label={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.text}
      </option>
    ))}
  </select>
);

export const Ask = ({
  asked,
  counts,
  nodeTypes,
  relationLabels,
  onAsk,
}: {
  asked: Asked;
  counts: Record<string, number>;
  nodeTypes: string[];
  relationLabels: string[];
  onAsk: (asked: Asked) => void;
}): JSX.Element => {
  const building = asked.id === CUSTOM;
  const custom = building ? asked.query : DEFAULT_CUSTOM;
  const condition = custom.where[0] ?? FIRST;
  const build = (change: {
    type?: string;
    condition?: Partial<Condition>;
  }): void =>
    onAsk({
      id: CUSTOM,
      query: {
        type: change.type ?? custom.type,
        where: [{ ...condition, ...change.condition }],
      },
    });
  const picks = (
    <div className="grid gap-1.5" data-testid="builder">
      <Pick
        label="Find notes of type"
        value={custom.type}
        options={nodeTypes.map((t) => ({ value: t, text: `Find ${t} notes` }))}
        onChange={(type) => build({ type })}
      />
      <Pick
        label="With or without"
        value={condition.has ? "has" : "has no"}
        options={[
          { value: "has", text: "that have a relation" },
          { value: "has no", text: "that have no relation" },
        ]}
        onChange={(v) => build({ condition: { has: v === "has" } })}
      />
      <Pick
        label="Relation"
        value={condition.relation}
        options={relationLabels.map((l) => ({
          value: l,
          text: `labelled "${l}"`,
        }))}
        onChange={(relation) => build({ condition: { relation } })}
      />
      <Pick
        label="Direction and type of the other note"
        value={`${condition.direction}|${condition.type}`}
        options={(["to", "from"] as const).flatMap((d) =>
          ["", ...nodeTypes].map((t) => ({
            value: `${d}|${t}`,
            text: `${d} ${t ? `${article(t)} note` : "any note"}`,
          })),
        )}
        onChange={(v) => {
          const [direction, type = ""] = v.split("|");
          build({
            condition: { direction: direction === "to" ? "to" : "from", type },
          });
        }}
      />
      <p className={TW_EXACT} data-testid="built">
        <span className="font-semibold">Reads: </span>
        {describeQuery(custom)}
      </p>
    </div>
  );
  return (
    <div className="mr-1 grid flex-none gap-2">
      <div className="flex items-baseline justify-between">
        <span className={TW_LABEL}>
          {building ? "Your question" : "Questions"}
        </span>
        <button
          className="text-accent cursor-pointer border-0 bg-transparent p-0 text-[12.5px] font-semibold hover:underline"
          onClick={() =>
            onAsk(
              building
                ? { id: PRESETS[0]!.id, query: PRESETS[0]!.query }
                : { id: CUSTOM, query: custom },
            )
          }
        >
          {building ? "Preset questions" : "Build your own"}
        </button>
      </div>
      {building ? (
        picks
      ) : (
        <ul className="-mx-2.5 my-0 grid list-none gap-0.5 p-0">
          {PRESETS.map((preset) => (
            <Question
              key={preset.id}
              label={preset.question}
              aside={(counts[preset.id] ?? 0).toLocaleString()}
              active={asked.id === preset.id}
              onPick={() => onAsk({ id: preset.id, query: preset.query })}
            >
              <p className="m-0 text-[12.5px] leading-normal text-[#3d4a5f]">
                {preset.plain}
              </p>
              <details className="mt-1">
                <summary className="cursor-pointer text-[12px] font-semibold text-[#56637a]">
                  Exact query
                </summary>
                <p className={TW_EXACT} data-testid="asked">
                  {describeQuery(preset.query)}
                </p>
              </details>
            </Question>
          ))}
        </ul>
      )}
    </div>
  );
};
