/* The form every entry form is made from: the fields, what is wrong shown at its field, the note as it will be written, and a foot that
   stays in view with the buttons. It decides nothing about the graph: it sends what was entered to the vault tool and shows the answer. */
import { MarkdownRenderer, Modal, Setting } from "obsidian";
import type { AbstractTextComponent, App } from "obsidian";
import { messageOf } from "./backend";
import type {
  Answer,
  FieldError,
  Host,
  Lists,
  QuoteAnswer,
  RecordAnswer,
  Request,
} from "./backend";
import { PickModal } from "./pick";
import type { PickSource } from "./pick";

type Key<V> = keyof V & string;
type FieldBase<V> = {
  field: Key<V>;
  label: string;
  desc?: string;
  need?: boolean;
};
export type TextField<V> = FieldBase<V> & { area?: boolean; open?: boolean };
export type ChoiceField<V> = FieldBase<V> & {
  options: string[];
  empty?: string;
  rerender?: boolean;
};
export type ToggleField<V> = FieldBase<V> & { says: string };
export type PickField<V, T> = FieldBase<V> &
  PickSource<T> & {
    noun?: string;
    multi?: boolean;
    onChange?: (item: T | null) => void;
  };
export type QuoteField<V> = FieldBase<V> & { record: () => string | undefined };
type Wire = { field: string; label: string; el: HTMLElement; need?: boolean };

export abstract class Form<V extends object> extends Modal {
  protected readonly v: Partial<V> = {};
  protected lists!: Lists;
  protected status!: HTMLElement;
  protected saveBtn!: HTMLButtonElement;
  protected preview!: HTMLElement;
  private summary!: HTMLElement;
  private goBtn!: HTMLButtonElement;
  private checkBtn!: HTMLButtonElement;
  private errs: Record<string, HTMLElement> = {};
  private ctl: Record<string, HTMLElement> = {};
  private labels: Record<string, string> = {};
  private busy = false;
  private ready = false;
  private at = 0;

  constructor(
    app: App,
    protected readonly plugin: Host,
  ) {
    super(app);
  }

  protected abstract heading(): string;
  protected abstract intro(): string;
  protected abstract build(): void;
  protected abstract request(dry: boolean): Request;

  protected saveLabel(): string {
    return "Check and save";
  }
  protected passLabel(): string {
    return "Save now";
  }
  /* what the form starts with, when it was opened from a note */
  protected prepare(): Promise<void> {
    return Promise.resolve();
  }
  /* the field of the form an error of the vault tool belongs to */
  protected fieldOf(field: string): string {
    return field;
  }

  /* the values are kept by field name; the helpers below read and write them loosely, the forms read them by their own types */
  private get bag(): Record<string, unknown> {
    return this.v;
  }
  private str(field: string): string {
    const x = this.bag[field];
    return typeof x === "string" ? x : "";
  }

  async onOpen(): Promise<void> {
    this.modalEl.addClass("tsf-modal");
    this.titleEl.setText(this.heading());
    this.contentEl.createEl("p", {
      text: "Reading the vault…",
      attr: { role: "status" },
    });
    this.scope.register(["Mod"], "Enter", () => {
      void this.save();
      return false;
    });
    try {
      this.lists = await this.plugin.call<Lists>({ action: "lists" });
      if (this.lists.error) throw new Error(this.lists.error);
    } catch (e) {
      this.contentEl.empty();
      this.contentEl.createEl("p", {
        text: "The vault tool did not answer: " + messageOf(e),
        cls: "tsf-error",
        attr: { role: "alert" },
      });
      return;
    }
    // the foot of the form stays in view while the fields scroll: what is wrong, what is happening, and the buttons
    const foot = this.modalEl.createDiv({ cls: "tsf-foot" });
    this.summary = foot.createDiv({
      cls: "tsf-summary",
      attr: { role: "alert" },
    });
    this.goBtn = foot.createEl("button", {
      text: "Go to the next one",
      cls: "tsf-go",
    });
    this.goBtn.onclick = () => this.toFirst(true);
    this.goBtn.hide();
    const buttons = foot.createDiv({ cls: "tsf-buttons" });
    this.status = buttons.createDiv({
      cls: "tsf-status",
      attr: { role: "status" },
    });
    this.checkBtn = buttons.createEl("button", { text: "Check only" });
    this.checkBtn.onclick = () => void this.check();
    this.saveBtn = buttons.createEl("button", {
      text: this.saveLabel(),
      cls: "mod-cta",
    });
    this.saveBtn.onclick = () => void this.save();
    buttons.createEl("button", { text: "Cancel" }).onclick = () => this.close();
    try {
      await this.prepare();
    } catch {
      /* the form opens empty */
    }
    this.contentEl.addEventListener("input", () => this.edited(true));
    this.contentEl.addEventListener("change", () => this.edited(true));
    this.ready = true;
    this.render();
  }

  onClose(): void {
    this.contentEl.empty();
  }

  protected edited(typed: boolean): void {
    this.saveBtn.setText(this.saveLabel());
    if (!typed) return;
    this.preview.empty();
    if (this.status.getText().startsWith("Check passed"))
      this.status.setText("Changed since the check.");
  }

  /* the first field to mend, or (from the button) the one after the field last visited */
  private toFirst(next: boolean): void {
    const all = Array.from(
      this.contentEl.querySelectorAll<HTMLElement>("[aria-invalid='true']"),
    );
    if (!all.length) return;
    this.at = next ? (this.at + 1) % all.length : 0;
    const el = all[this.at];
    el?.scrollIntoView({ block: "center" });
    el?.focus();
  }

  protected render(focus?: string): void {
    const c = this.contentEl;
    c.empty();
    this.errs = {};
    this.ctl = {};
    c.createEl("p", { text: this.intro(), cls: "tsf-intro" });
    c.createEl("p", { text: "Fields marked * are needed.", cls: "tsf-intro" });
    this.build();
    this.preview = c.createDiv({
      cls: "tsf-preview",
      attr: { "aria-live": "polite" },
    });
    this.edited(false);
    if (focus) this.ctl[focus]?.focus();
  }

  /* one field: its label and help on the left; on the right its control and, directly under the control, what is wrong with it */
  private row({ field, label, desc, need }: FieldBase<V>): Setting {
    const s = new Setting(this.contentEl).setName(label + (need ? " *" : ""));
    if (desc) s.setDesc(desc);
    s.controlEl.addClass("tsf-control");
    this.errs[field] = createDiv({
      cls: "tsf-error",
      attr: { id: "tsf-err-" + field, role: "alert" },
    });
    this.labels[field] = label;
    return s;
  }
  private done(field: string, s: Setting): Setting {
    const err = this.errs[field];
    if (err) s.controlEl.appendChild(err);
    return s;
  }
  private wire({ field, label, el, need }: Wire): void {
    el.setAttribute("aria-label", label);
    el.setAttribute("aria-describedby", "tsf-err-" + field);
    if (need) el.setAttribute("aria-required", "true");
    this.ctl[field] = el;
  }

  protected text(o: TextField<V>): Setting {
    const s = this.row(o);
    const add = (
      t: AbstractTextComponent<HTMLInputElement | HTMLTextAreaElement>,
    ): void => {
      t.setValue(this.str(o.field)).onChange((x) => {
        this.bag[o.field] = x;
      });
      this.wire({
        field: o.field,
        label: o.label,
        el: t.inputEl,
        need: o.need,
      });
    };
    if (o.area) s.addTextArea(add);
    else s.addText(add);
    return o.open ? s : this.done(o.field, s);
  }

  protected choice(o: ChoiceField<V>): Setting {
    const s = this.row(o);
    s.addDropdown((d) => {
      if (o.empty !== undefined) d.addOption("", o.empty);
      for (const option of o.options) d.addOption(option, option);
      if (this.bag[o.field] === undefined && o.empty === undefined)
        this.bag[o.field] = o.options[0];
      d.setValue(this.str(o.field)).onChange((x) => {
        this.bag[o.field] = x;
        if (o.rerender) this.render(o.field);
      });
      this.wire({
        field: o.field,
        label: o.label,
        el: d.selectEl,
        need: o.need,
      });
    });
    return this.done(o.field, s);
  }

  protected toggle(o: ToggleField<V>): Setting {
    const s = this.row(o);
    if (this.bag[o.field] === undefined) this.bag[o.field] = false;
    const wrap = s.controlEl.createEl("label", { cls: "tsf-checkrow" }); // the words beside the box are part of the target
    const box = wrap.createEl("input", { type: "checkbox", cls: "tsf-check" }); // a native checkbox: Space toggles it and a screen reader says its state
    wrap.createSpan({ text: o.says });
    box.checked = !!this.bag[o.field];
    box.addEventListener("change", () => {
      this.bag[o.field] = box.checked;
    });
    this.wire({ field: o.field, label: o.label, el: box });
    return this.done(o.field, s);
  }

  /* one or several notes picked from a list (never typed) */
  protected pick<T>(o: PickField<V, T>): Setting {
    const { field, label, text } = o;
    const s = this.row(o);
    const held = this.bag[field];
    let chosen: T[];
    if (o.multi) {
      chosen = Array.isArray(held) ? (held as T[]) : [];
      this.bag[field] = chosen;
    } else chosen = held ? [held as T] : [];
    const ul = s.controlEl.createEl("ul", {
      cls: "tsf-chips",
      attr: { "aria-label": label + ": chosen" },
    });
    chosen.forEach((item) => {
      const li = ul.createEl("li");
      li.createSpan({ text: text(item) });
      if (!o.multi) return;
      const x = li.createEl("button", {
        text: "Remove",
        attr: { "aria-label": "Remove " + text(item) },
      });
      x.onclick = () => {
        chosen.splice(chosen.indexOf(item), 1);
        o.onChange?.(null);
        this.render(field);
      };
    });
    const onPick = (item: T): void => {
      if (!o.multi) this.bag[field] = item;
      else if (!chosen.some((x) => text(x) === text(item))) chosen.push(item);
      o.onChange?.(item);
      this.render(field);
    };
    s.addButton((b) => {
      const says = o.multi ? "Add" : chosen.length ? "Change" : "Choose";
      b.setButtonText(`${says} ${o.noun || "one"}…`);
      this.wire({
        field,
        label: label + ": " + says.toLowerCase(),
        el: b.buttonEl,
        need: o.need,
      });
      b.onClick(() =>
        new PickModal<T>(this.app, {
          items: o.items,
          search: o.search,
          text,
          sub: o.sub,
          placeholder: label,
          onPick,
        }).open(),
      );
    });
    return this.done(field, s);
  }

  /* words copied from a record file: found by typing a few of them and picking the line; the box below holds them and may be trimmed to less
     than the line. Whatever stands in the box is checked against the file, here and again by the vault's own check. */
  protected quote(o: QuoteField<V>): Setting {
    const { field, label, record } = o;
    const s = this.text({
      field,
      label,
      desc: o.desc,
      need: o.need ?? true,
      area: true,
      open: true,
    });
    const area = this.ctl[field] as HTMLTextAreaElement;
    const find = createDiv({ cls: "tsf-find" });
    find.createEl("label", {
      text: "1. Find the line: type a few words of it and press Enter",
      attr: { for: "tsf-find-" + field },
    });
    const findInput = find.createEl("input", {
      type: "text",
      attr: {
        id: "tsf-find-" + field,
        "aria-label": label + ": find the line in the record",
      },
    });
    const findBtn = find.createEl("button", {
      text: "Find lines",
      attr: { "aria-label": label + ": find lines" },
    });
    const found = createDiv({ cls: "tsf-lines" });
    const second = createDiv({ cls: "tsf-find" });
    second.createEl("label", {
      text: "2. The words as they stand in the record (trim them if less than the line is meant)",
    });
    s.controlEl.prepend(find, found, second); // the finder stands above the box it fills
    const note = s.controlEl.createDiv({
      cls: "tsf-note",
      attr: { role: "status" },
    });
    this.done(field, s);
    const err = this.errs[field];
    let turn = 0; // only the last question asked of the record is shown
    const failed = (e: unknown): void =>
      note.setText("The vault tool did not answer: " + messageOf(e));
    const use = (words: string): void => {
      this.bag[field] = words;
      area.value = words;
      void verify().catch(failed);
      area.focus();
    };
    const verify = async (): Promise<void> => {
      const rec = record();
      const q = this.str(field);
      if (!rec || !q) {
        note.setText(rec ? "" : "Choose the record file first.");
        return;
      }
      const mine = ++turn;
      const a = await this.plugin.call<QuoteAnswer>({
        action: "quote",
        record: rec,
        quote: q,
      });
      if (mine !== turn) return;
      note.empty();
      if (a.found) {
        const more =
          (a.count ?? 1) > 1 ? ` (and ${(a.count ?? 1) - 1} more places)` : "";
        note.setText(`In the record word for word, line ${a.line}${more}.`);
        err?.setText("");
        area.removeAttribute("aria-invalid");
        return;
      }
      err?.setText(
        a.exists
          ? "These words are not in the record."
          : "The record file does not exist.",
      );
      area.setAttribute("aria-invalid", "true");
      const closest = a.closest;
      if (closest) {
        note.createSpan({
          text: `Closest line, ${a.closest_line}: ${closest} `,
        });
        note.createEl("button", { text: "Use the closest line" }).onclick =
          () => use(closest);
      }
    };
    area.addEventListener("blur", () => void verify().catch(failed));
    const search = async (): Promise<void> => {
      const rec = record();
      found.empty();
      if (!rec) {
        note.setText("Choose the record file first.");
        return;
      }
      const mine = ++turn;
      const a = await this.plugin.call<RecordAnswer>({
        action: "record",
        record: rec,
        find: findInput.value,
      });
      if (mine !== turn) return;
      const lines = a.lines ?? [];
      const shown =
        a.total > lines.length ? `, the first ${lines.length} shown.` : ".";
      const how = a.total
        ? " Press Enter to use the first, or Tab to another."
        : "";
      note.setText(
        a.exists
          ? `${a.total} lines hold these words${shown}${how}`
          : "The record file does not exist.",
      );
      lines.forEach((l) => {
        const says = `${l.line}: ${l.text}`;
        found.createEl("button", {
          text: says,
          attr: { "aria-label": "Use line " + says },
        }).onclick = () => {
          found.empty();
          use(l.text);
        };
      });
      found.querySelector("button")?.focus(); // the lines found take the focus: Enter uses the first, Tab goes to the next
    };
    findInput.addEventListener("keydown", (ev) => {
      if (ev.key !== "Enter" || ev.ctrlKey || ev.metaKey) return;
      ev.preventDefault();
      void search().catch(failed);
    });
    findBtn.onclick = () => void search().catch(failed);
    return s;
  }

  /* how an error reads at its field: the vault tool's own words, or for an empty field what to do about it */
  private said(error: FieldError, field: string): string {
    const tag = this.ctl[field]?.tagName;
    const how =
      tag === "BUTTON"
        ? "choose one"
        : tag === "SELECT"
          ? "choose one from the list"
          : "fill it in";
    const said =
      error.message === "needed"
        ? `"${this.labels[field] || field}" is needed: ${how}`
        : error.message;
    return (
      said.charAt(0).toUpperCase() +
      said.slice(1) +
      (/[.?!]$/.test(said) ? "" : ".")
    );
  }

  protected show(errors: FieldError[] = []): void {
    Object.values(this.errs).forEach((e) => e.setText(""));
    Object.values(this.ctl).forEach((e) => e.removeAttribute("aria-invalid"));
    this.summary.empty();
    this.goBtn.hide();
    let first: HTMLElement | undefined;
    const loose: string[] = [];
    const order = Object.keys(this.ctl); // the first field in the form's own order takes the focus
    const place = (e: FieldError): number =>
      order.indexOf(this.fieldOf(e.field));
    [...errors]
      .sort((x, y) => place(x) - place(y))
      .forEach((e) => {
        const field = this.fieldOf(e.field);
        const msg = this.said(e, field);
        const err = field ? this.errs[field] : undefined;
        if (!err) {
          loose.push(msg);
          return;
        }
        err.setText((err.getText() ? err.getText() + " " : "") + msg);
        const ctl = this.ctl[field];
        if (!ctl) return;
        ctl.setAttribute("aria-invalid", "true");
        first = first ?? ctl;
      });
    if (errors.length) {
      const count =
        errors.length === 1
          ? "1 thing to mend, shown at its field. "
          : errors.length + " things to mend, each shown at its field. ";
      this.summary.setText(count + loose.join(" "));
    }
    if (first) {
      this.goBtn.show();
      this.toFirst(false);
    }
  }

  protected showPreview(a: Answer): void {
    const p = this.preview;
    p.empty();
    if (!a.title) return;
    p.createEl("h4", { text: "The note as it will be written" });
    p.createDiv({ text: a.title, cls: "tsf-title" });
    void MarkdownRenderer.render(
      this.app,
      a.body || "",
      p.createDiv(),
      "",
      this.plugin,
    );
    (a.relations ?? []).forEach((r) => p.createDiv({ text: "Relation: " + r }));
  }

  protected async run(req: Request, saying: string): Promise<Answer | null> {
    if (this.busy || !this.ready) return null; // Ctrl+Enter before the form is drawn, or while the vault could not be read
    this.busy = true;
    this.status.setText(saying);
    this.checkBtn.disabled = true;
    this.saveBtn.disabled = true;
    try {
      const a = await this.plugin.call<Answer>(req);
      if (a.error) throw new Error(a.error);
      return a;
    } catch (e) {
      this.summary.setText("The vault tool did not answer: " + messageOf(e));
      return null;
    } finally {
      this.busy = false;
      this.status.setText("");
      this.checkBtn.disabled = false;
      this.saveBtn.disabled = false;
    }
  }

  protected async check(): Promise<boolean> {
    const a = await this.run(this.request(true), "Checking…");
    if (!a) return false;
    const errors = a.errors ?? [];
    this.show(errors);
    this.showPreview(a);
    if (errors.length) return false;
    this.saveBtn.setText(this.passLabel());
    this.status.setText(
      `Check passed. Nothing is written yet. Press "${this.passLabel()}" to write it.`,
    );
    this.preview.scrollIntoView({ block: "nearest" });
    this.saveBtn.focus();
    return true;
  }

  protected async save(): Promise<void> {
    const a = await this.run(
      this.request(false),
      "Checking, saving and running the vault check (about 10 seconds)…",
    );
    if (!a) return;
    if (!a.ok) {
      this.show(a.errors);
      this.showPreview(a);
      return;
    }
    this.plugin.say("Saved and checked: " + (a.title || "the vault"));
    this.close();
    if (a.title) void this.app.workspace.openLinkText(a.title, "", false);
  }
}
