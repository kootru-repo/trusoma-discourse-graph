/* The two forms that change a value note: a new value, status or meaning, and a passage read in a paper. A value is never written by one
   press: the first press checks and shows what changes, the second writes. */
import type { App } from "obsidian";
import type { Answer, Host, Paper, PapersAnswer, Request, ValueItem, ValuesAnswer, ValueState } from "./backend";
import { Form } from "./form";

type ValueValues = {
  key: ValueItem;
  value: string;
  status: string;
  meaning: string;
  paper: Paper;
  locator: string;
  quote: string;
  value_in_source: string;
  species_age: string;
  transfer: string;
  link_status: string;
};

const ROWS: [keyof ValueState, string][] = [
  ["value", "Value"],
  ["status", "Status"],
  ["meaning", "Meaning"],
  ["evidence", "Passages"],
];

const say = (x: unknown): string => (x === null || x === undefined ? "none" : typeof x === "string" ? x : JSON.stringify(x));

abstract class ValueBase extends Form<ValueValues> {
  private checked: string | null = null;

  /* want: the key of the value the form was opened on */
  constructor(
    app: App,
    plugin: Host,
    private readonly want?: string,
  ) {
    super(app, plugin);
  }

  protected abstract writeLabel(): string;
  /* what the form asks to change, as it will stand after the change */
  protected abstract asked(): ValueState;

  protected async prepare(): Promise<void> {
    if (!this.want) return;
    const hit = (await this.values(this.want)).find((x) => x.key === this.want);
    if (hit) this.v.key = hit;
  }

  private async values(find: string): Promise<ValueItem[]> {
    return (await this.plugin.call<ValuesAnswer>({ action: "values", find })).values ?? [];
  }

  protected keyPick(): void {
    this.titleEl.setText(this.heading() + (this.v.key ? ": " + this.v.key.key : ""));
    this.pick<ValueItem>({
      field: "key",
      label: "Value",
      desc: "Search by key or meaning.",
      need: true,
      noun: "the value",
      search: (q) => this.values(q),
      text: (i) => i.key,
      sub: (i) => `${JSON.stringify(i.value)}, ${i.status}${i.meaning ? ", " + i.meaning : ""}`,
    });
  }

  protected showPreview(a: Answer): void {
    const p = this.preview;
    p.empty();
    const before = a.before;
    if (!before) return;
    const asked = this.asked();
    const then: ValueState = a.after ?? { ...before, ...asked };
    p.createEl("h4", { text: a.after ? "Written" : "What the change will be" });
    const table = p.createEl("table", { cls: "tsf-table" });
    const head = table.createEl("tr");
    ["", a.after ? "Was" : "Now", a.after ? "Is now" : "After the change"].forEach((x) =>
      head.createEl("th", { text: x, attr: { scope: "col" } }),
    );
    ROWS.forEach(([k, name]) => {
      const same = say(then[k]) === say(before[k]);
      const row = table.createEl("tr", { cls: same ? "" : "tsf-changed" });
      row.createEl("th", { text: name + (same ? "" : " (changes)"), attr: { scope: "row" } });
      row.createEl("td", { text: say(before[k]) });
      row.createEl("td", { text: same ? say(then[k]) + " (unchanged)" : say(then[k]) });
    });
    const sourced = (before.status ?? "").startsWith("source-found");
    if (!a.after && "value" in asked && sourced && !this.v.status)
      p.createEl("p", {
        text: `Take care: the status stays ${before.status} and its ${say(before.evidence)} passage(s) stay attached. They were read for the value as it is now. Check that they still support the new value, or set a new status.`,
        cls: "tsf-caution",
      });
    if (a.impact) {
      p.createEl("h4", { text: "What reads this value: look at these again" });
      p.createEl("pre", { text: a.impact.join("\n") });
    }
  }

  protected edited(typed: boolean): void {
    if (this.checked) {
      this.checked = null;
      this.status.setText("Changed since the check: check again.");
    }
    this.saveBtn.setText(this.saveLabel());
    if (typed) this.preview.empty();
  }

  protected async check(): Promise<boolean> {
    const ok = await super.check();
    this.saveBtn.setText(this.saveLabel());
    if (ok) {
      this.status.setText("Check passed. Nothing is written yet.");
      this.saveBtn.focus();
    }
    return ok;
  }

  protected async save(): Promise<void> {
    const now = JSON.stringify(this.request(true));
    if (this.checked !== now) {
      if (!(await this.check())) return;
      this.checked = now;
      this.saveBtn.setText(this.writeLabel());
      this.status.setText(`Check passed. Nothing is written yet. Press "${this.writeLabel()}" to write it.`);
      return;
    }
    const a = await this.run(this.request(false), "Writing, regenerating and running the vault check (about 10 seconds)…");
    if (!a) return;
    this.checked = null;
    this.saveBtn.setText(this.saveLabel());
    this.show(a.errors);
    this.showPreview(a);
    if (!a.ok) return;
    this.plugin.say("Saved and checked: " + (this.v.key?.key ?? ""));
    this.status.setText("Written and checked.");
  }
}

const parsed = (typed: string): unknown => {
  try {
    return JSON.parse(typed) as unknown;
  } catch {
    return typed;
  }
};

export class ValueForm extends ValueBase {
  protected heading(): string {
    return "Change a value";
  }
  protected intro(): string {
    return "A body or other configuration value. Check shows the value before, and what reads it; the second press writes. Learner constants are not changed here.";
  }
  protected saveLabel(): string {
    return "Check the change";
  }
  protected writeLabel(): string {
    return "Write the change now";
  }
  protected asked(): ValueState {
    const v = this.v;
    const asked: ValueState = {};
    if (v.value) asked.value = parsed(v.value);
    if (v.status) asked.status = v.status;
    if (v.meaning) asked.meaning = v.meaning;
    return asked;
  }
  protected build(): void {
    this.keyPick();
    this.text({
      field: "value",
      label: "New value",
      desc: "A number, true, false, a quoted text or a [list]. Leave it empty to keep the value.",
    });
    this.choice({
      field: "status",
      label: "New status",
      desc: "A source-found status needs a passage first.",
      options: this.lists.statuses,
      empty: "Unchanged",
    });
    this.text({ field: "meaning", label: "New meaning", desc: "Leave it empty to keep the meaning." });
  }
  protected request(dry: boolean): Request {
    const v = this.v;
    const req: Request = { action: dry ? "value_preview" : "value_save", key: v.key?.key ?? "" };
    for (const k of ["value", "status", "meaning"] as const) if (v[k]) req[k] = v[k];
    return req;
  }
}

const PASSAGE_FIELDS = ["locator", "quote", "value_in_source", "species_age", "transfer", "link_status", "status"] as const;

export class EvidenceForm extends ValueBase {
  protected heading(): string {
    return "Enter a passage of a paper";
  }
  protected intro(): string {
    return "Words read in a paper that bear on one value. The paper must be in the register already. Copy the passage from the paper as it stands.";
  }
  protected saveLabel(): string {
    return "Check the passage";
  }
  protected writeLabel(): string {
    return "Write the passage now";
  }
  protected asked(): ValueState {
    return { evidence: "one more", ...(this.v.status ? { status: this.v.status } : {}) };
  }
  protected build(): void {
    this.keyPick();
    this.pick<Paper>({
      field: "paper",
      label: "Paper",
      desc: "Search the register by author, year, title or DOI.",
      need: true,
      noun: "the paper",
      search: async (q) => (await this.plugin.call<PapersAnswer>({ action: "papers", find: q })).papers ?? [],
      text: (i) => i.title,
      sub: (i) => i.id,
    });
    this.text({ field: "locator", label: "Where in the paper", desc: "Page, table or figure.", need: true });
    this.text({ field: "quote", label: "Words of the paper", desc: "Copied as they stand.", area: true, need: true });
    this.text({
      field: "value_in_source",
      label: "Value in the paper",
      desc: "The number as the paper gives it, with its unit.",
    });
    this.text({
      field: "species_age",
      label: "Species and age",
      desc: "For example: human fetal, 12 weeks. Adult data is recorded as unusable, never as a source.",
    });
    this.text({
      field: "transfer",
      label: "Transfer",
      desc: "How the paper's measure carries to the value; none when it is the same quantity at the same age.",
    });
    this.choice({
      field: "link_status",
      label: "What this passage is",
      desc: "Fetal data, a stated transfer from other data, or adult data kept only as unusable.",
      options: this.lists.passage_statuses,
      need: true,
      empty: "Choose one",
    });
    this.choice({
      field: "status",
      label: "Then set the value's status to",
      options: this.lists.statuses,
      empty: "Unchanged",
    });
  }
  protected request(dry: boolean): Request {
    const v = this.v;
    const req: Request = {
      action: dry ? "evidence_preview" : "evidence_save",
      key: v.key?.key ?? "",
      paper: v.paper?.id ?? "",
    };
    for (const k of PASSAGE_FIELDS) if (v[k]) req[k] = v[k];
    return req;
  }
}
