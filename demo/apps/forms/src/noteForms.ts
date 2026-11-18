/* The two forms that write a note of the graph: a Result copied from a record file, and a draft admitted as a claim or a question. */
import type { App } from "obsidian";
import type {
  Draft,
  Experiment,
  Host,
  Note,
  Request,
  ResultNote,
} from "./backend";
import { Form } from "./form";

const noteText = (note: Note): string => note.title;
const links = (notes: Note[] = []): string[] => notes.map((note) => note.link);
const resultSub = (result: ResultNote): string =>
  `${result.reading}, ${result.record}`;

type ResultValues = {
  name: string;
  experiment: Experiment;
  record: string;
  quote: string;
  reading: string;
  counted: boolean;
  consistent_with: Note[];
  against: Note[];
  answers: Note[];
  answers_basis: string;
};

export class ResultForm extends Form<ResultValues> {
  /* want: the title of the experiment the form was opened on */
  constructor(
    app: App,
    plugin: Host,
    private readonly want?: string,
  ) {
    super(app, plugin);
  }

  protected prepare(): Promise<void> {
    const e = this.want
      ? this.lists.experiments.find((x) => x.title === this.want)
      : undefined;
    if (e) this.v.experiment = e;
    if (e?.record) this.v.record = e.record;
    return Promise.resolve();
  }
  protected heading(): string {
    return "Enter a Result";
  }
  protected intro(): string {
    return "A reading copied from a record file. The words are picked from the file, never retyped from memory.";
  }

  protected build(): void {
    const L = this.lists;
    const v = this.v;
    this.text({
      field: "name",
      label: "Short name",
      desc: "How the note is known, for example: probe 5 learned inside the shuffled range.",
      need: true,
    });
    this.pick<Experiment>({
      field: "experiment",
      label: "Experiment",
      desc: "The run that produced this reading.",
      need: true,
      noun: "the experiment",
      items: L.experiments,
      text: noteText,
      sub: (e) => e.record,
      onChange: (e) => {
        if (e?.record) v.record = e.record;
        v.consistent_with = [];
        v.against = [];
      },
    });
    this.choice({
      field: "record",
      label: "Record file",
      desc: "The file the reading stands in.",
      options: L.records,
      empty: "Choose one",
      rerender: true,
      need: true,
    });
    this.quote({
      field: "quote",
      label: "Words of the record",
      desc: "The line or part of a line that states the reading.",
      record: () => v.record,
    });
    this.choice({
      field: "reading",
      label: "Reading",
      desc: "What the record says came out.",
      options: L.readings,
      rerender: true,
      need: true,
    });
    this.toggle({
      field: "counted",
      label: "Counted",
      desc: "Ticked only when the record counts this run toward a stage verdict.",
      says: "Counted toward a stage verdict",
    });
    const of = v.experiment?.hypotheses ?? [];
    const tested = L.hypotheses.filter((h) => of.includes(h.link));
    if (tested.length) {
      this.pick<Note>({
        field: "consistent_with",
        label: "Consistent with",
        desc: "Hypotheses of this experiment the reading agrees with.",
        noun: "a hypothesis",
        items: tested,
        text: noteText,
        multi: true,
      });
      if (L.against_readings.includes(v.reading ?? ""))
        this.pick<Note>({
          field: "against",
          label: "Against",
          desc: "Hypotheses of this experiment the reading stands against.",
          noun: "a hypothesis",
          items: tested,
          text: noteText,
          multi: true,
        });
    }
    this.pick<Note>({
      field: "answers",
      label: "Answers a question",
      desc: "Only when the record itself says this run was for the question.",
      noun: "a question",
      items: L.questions,
      text: noteText,
      multi: true,
    });
    if (v.answers?.length)
      this.quote({
        field: "answers_basis",
        label: "Words that tie the run to the question",
        desc: "From the record file of the result or of the question.",
        record: () => v.record,
      });
  }

  protected request(dry: boolean): Request {
    const v = this.v;
    const props: Record<string, unknown> = {
      reading: v.reading,
      counted: !!v.counted,
    };
    if (v.record) props.record = v.record;
    if (v.quote) props.quote = v.quote;
    if (v.experiment) props.experiment = v.experiment.link;
    if (v.consistent_with?.length)
      props.consistent_with = links(v.consistent_with);
    if (
      v.against?.length &&
      this.lists.against_readings.includes(v.reading ?? "")
    )
      props.against = links(v.against);
    if (v.answers?.length) {
      props.answers = links(v.answers);
      if (v.answers_basis) props.answers_basis = v.answers_basis;
    }
    return {
      action: dry ? "preview" : "save",
      kind: "Result",
      name: (v.name ?? "").trim(),
      props,
    };
  }
}

type AdmitValues = {
  draft: Draft;
  kind: string;
  name: string;
  supported_by: ResultNote[];
  opposed_by: ResultNote[];
  record: string;
  quote: string;
  addresses: Note[];
};

export class AdmitForm extends Form<AdmitValues> {
  /* want: the draft to start with (its path inside Drafts), from the button on the draft itself */
  constructor(
    app: App,
    plugin: Host,
    private want?: string,
  ) {
    super(app, plugin);
  }

  protected heading(): string {
    return "Admit a draft to the graph";
  }
  protected intro(): string {
    return "A claim or question you wrote freely in the Drafts folder. Its first line becomes the statement; the rest stays yours, under Notes. Until you admit it, a draft is checked by nothing.";
  }
  protected saveLabel(): string {
    return "Check and admit";
  }
  protected passLabel(): string {
    return "Admit now";
  }
  protected fieldOf(field: string): string {
    return field === "statement" ? "draft" : field;
  }

  protected build(): void {
    const L = this.lists;
    const v = this.v;
    if (this.want && !v.draft) {
      const d = L.drafts.find((x) => x.draft === this.want);
      if (d) {
        v.draft = d;
        this.startFrom(d);
      }
    }
    this.want = undefined;
    this.pick<Draft>({
      field: "draft",
      label: "Draft",
      desc: L.drafts.length
        ? "The draft to admit."
        : "No drafts are waiting. Make one with the command New draft.",
      need: true,
      noun: "the draft",
      items: L.drafts,
      text: (d) => d.sentence || d.draft,
      sub: (d) => d.draft,
      onChange: (d) => {
        if (d) this.startFrom(d);
      },
    });
    if (!v.draft) return;
    this.choice({
      field: "kind",
      label: "Admit as",
      desc: "A question ends with a question mark.",
      options: ["Claim", "Question"],
      rerender: true,
      need: true,
    });
    this.text({
      field: "name",
      label: "Short name",
      desc:
        v.kind === "Question"
          ? "How the question is known, for example: mouth map first."
          : "How the claim is known, for example: finding, receptor noise.",
      need: true,
    });
    if (v.kind === "Question") return;
    this.pick<ResultNote>({
      field: "supported_by",
      label: "Results for the claim",
      desc: "Results that support the claim. At least one Result is needed, for the claim or against it. A Result that stands against the claim belongs in the next field: remove it here and add it there.",
      noun: "a Result",
      items: L.results,
      text: noteText,
      sub: resultSub,
      multi: true,
    });
    this.pick<ResultNote>({
      field: "opposed_by",
      label: "Results against the claim",
      desc: "Results that stand against the claim.",
      noun: "a Result",
      items: L.results,
      text: noteText,
      sub: resultSub,
      multi: true,
    });
    const chosen = [...(v.supported_by ?? []), ...(v.opposed_by ?? [])];
    const recs = [...new Set(chosen.map((r) => r.record).filter(Boolean))];
    if (recs.length && !recs.includes(v.record ?? "")) v.record = recs[0];
    this.choice({
      field: "record",
      label: "Record file",
      desc: "A record one of the chosen Results rests on.",
      options: recs,
      empty: recs.length ? undefined : "Choose a Result first",
      rerender: true,
      need: true,
    });
    this.quote({
      field: "quote",
      label: "Words of the record",
      desc: "The line the claim rests on.",
      record: () => v.record,
    });
    this.pick<Note>({
      field: "addresses",
      label: "Addresses a question",
      desc: "An open question the claim speaks to, if any.",
      noun: "a question",
      items: L.questions,
      text: noteText,
      multi: true,
    });
  }

  /* a draft begun on a Result or a Question starts the form with that note chosen; it is a first choice, and can be removed */
  private startFrom(d: Draft): void {
    const L = this.lists;
    const v = this.v;
    const hints = d.hints ?? {};
    v.kind = d.kind === "Question" ? "Question" : "Claim";
    const result = hints.claim_from_result
      ? L.results.find((x) => x.title === hints.claim_from_result)
      : undefined;
    if (result && !v.supported_by?.length && !v.opposed_by?.length) {
      v.supported_by = [result];
      v.kind = "Claim";
    }
    const question = hints.claim_addresses
      ? L.questions.find((x) => x.title === hints.claim_addresses)
      : undefined;
    if (question && !v.addresses?.length) {
      v.addresses = [question];
      v.kind = "Claim";
    }
  }

  protected request(dry: boolean): Request {
    const v = this.v;
    const props: Record<string, unknown> = {};
    if (v.kind !== "Question") {
      if (v.record) props.record = v.record;
      if (v.quote) props.quote = v.quote;
      if (v.supported_by?.length) props.supported_by = links(v.supported_by);
      if (v.opposed_by?.length) props.opposed_by = links(v.opposed_by);
      if (v.addresses?.length) props.addresses = links(v.addresses);
    }
    return {
      action: "admit",
      draft: v.draft?.draft ?? "",
      kind: v.kind === "Question" ? "Question" : "Finding",
      name: (v.name ?? "").trim(),
      props,
      dry,
    };
  }
}
