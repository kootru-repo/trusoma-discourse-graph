/* TruSoma entry forms (Obsidian plugin, desktop only). A thin shell: it draws the fields and shows what the vault's own Python tool answers
   (tools/dm/form_api.py, one JSON request per call). No rule about the graph lives here; nothing here writes a graph note. The one file this
   plugin writes itself is a new plain draft in vault/Drafts, which no tool reads. Source: tools/dm/forms_plugin (installed by install.py). */
const { Plugin, Modal, Setting, Notice, SuggestModal, PluginSettingTab, Menu, MarkdownRenderer } = require("obsidian");
const { spawn } = require("child_process");
const path = require("path");

const DEFAULTS = { python: "python" };

function words(q) { return q.toLowerCase().split(/\s+/).filter(Boolean); }

class Pick extends SuggestModal {
  /* opts: placeholder, items (array) or search (query -> Promise of array), text(item), sub(item), onPick(item) */
  constructor(app, opts) { super(app); this.opts = opts; this.setPlaceholder(opts.placeholder || "Type to search"); this.turn = 0; }
  async getSuggestions(query) {
    if (this.opts.items) {
      const w = words(query);
      return this.opts.items.filter((i) => w.every((x) => (this.opts.text(i) + " " + (this.opts.sub ? this.opts.sub(i) : "")).toLowerCase().includes(x))).slice(0, 80);
    }
    const mine = ++this.turn;
    await new Promise((r) => setTimeout(r, 300));
    if (mine !== this.turn) return [];
    return await this.opts.search(query);
  }
  renderSuggestion(item, el) {
    el.createDiv({ text: this.opts.text(item) });
    if (this.opts.sub && this.opts.sub(item)) el.createDiv({ text: this.opts.sub(item), cls: "tsf-sub" });
  }
  onChooseSuggestion(item) { this.opts.onPick(item); }
}

class Form extends Modal {
  constructor(app, plugin) { super(app); this.plugin = plugin; this.v = {}; this.lists = null; this.errs = {}; this.ctl = {}; this.labels = {}; this.busy = false; }
  heading() { return ""; }
  intro() { return ""; }
  build() {}
  request() { return {}; }
  saveLabel() { return "Check and save"; }

  async onOpen() {
    this.modalEl.addClass("tsf-modal");
    this.titleEl.setText(this.heading());
    this.contentEl.createEl("p", { text: "Reading the vault…", attr: { role: "status" } });
    this.scope.register(["Mod"], "Enter", () => { this.save(); return false; });
    try {
      this.lists = await this.plugin.call({ action: "lists" });
      if (this.lists.error) throw new Error(this.lists.error);
    } catch (e) { this.contentEl.empty(); this.contentEl.createEl("p", { text: "The vault tool did not answer: " + e.message, cls: "tsf-error", attr: { role: "alert" } }); return; }
    // the foot of the form stays in view while the fields scroll: what is wrong, what is happening, and the buttons
    const foot = this.modalEl.createDiv({ cls: "tsf-foot" });
    this.summary = foot.createDiv({ cls: "tsf-summary", attr: { role: "alert" } });
    this.goBtn = foot.createEl("button", { text: "Go to the next one", cls: "tsf-go" });
    this.goBtn.onclick = () => this.toFirst(true);
    this.goBtn.hide();
    const b = foot.createDiv({ cls: "tsf-buttons" });
    this.status = b.createDiv({ cls: "tsf-status", attr: { role: "status" } });
    this.checkBtn = b.createEl("button", { text: "Check only" });
    this.checkBtn.onclick = () => this.check();
    this.saveBtn = b.createEl("button", { text: this.saveLabel(), cls: "mod-cta" });
    this.saveBtn.onclick = () => this.save();
    b.createEl("button", { text: "Cancel" }).onclick = () => this.close();
    this.contentEl.addEventListener("input", () => this.edited(true));
    this.contentEl.addEventListener("change", () => this.edited(true));
    this.render();
  }
  onClose() { this.contentEl.empty(); }
  edited(typed) { this.passed = false; if (this.saveBtn) this.saveBtn.setText(this.saveLabel()); if (typed && this.preview) { this.preview.empty(); if (this.status.getText().startsWith("Check passed")) this.status.setText("Changed since the check."); } }
  passLabel() { return "Save now"; }
  toFirst(next) {   // the first field to mend, or (from the button) the one after the field last visited
    const all = [...this.contentEl.querySelectorAll("[aria-invalid='true']")];
    if (!all.length) return;
    this.at = next ? ((this.at || 0) + 1) % all.length : 0;
    all[this.at].scrollIntoView({ block: "center" }); all[this.at].focus();
  }

  render(focus) {
    const c = this.contentEl;
    c.empty(); this.errs = {}; this.ctl = {};
    c.createEl("p", { text: this.intro(), cls: "tsf-intro" });
    c.createEl("p", { text: "Fields marked * are needed.", cls: "tsf-intro" });
    this.build();
    this.preview = c.createDiv({ cls: "tsf-preview", attr: { "aria-live": "polite" } });
    this.edited();
    if (focus && this.ctl[focus]) this.ctl[focus].focus();
  }

  /* one field: its label and help on the left; on the right its control and, directly under the control, what is wrong with it */
  row(field, label, desc, need) {
    const s = new Setting(this.contentEl).setName(label + (need ? " *" : ""));
    if (desc) s.setDesc(desc);
    s.controlEl.addClass("tsf-control");
    this.errs[field] = createDiv({ cls: "tsf-error", attr: { id: "tsf-err-" + field, role: "alert" } });
    this.labels[field] = label;
    return s;
  }
  done(field, s) { s.controlEl.appendChild(this.errs[field]); return s; }
  wire(field, label, el, need) {
    el.setAttribute("aria-label", label);
    el.setAttribute("aria-describedby", "tsf-err-" + field);
    if (need) el.setAttribute("aria-required", "true");
    this.ctl[field] = el;
  }
  text(field, label, desc, opts = {}) {
    const s = this.row(field, label, desc, opts.need);
    const add = (t) => {
      t.setValue(this.v[field] || "").onChange((x) => { this.v[field] = x; });
      if (opts.placeholder) t.setPlaceholder(opts.placeholder);
      this.wire(field, label, t.inputEl, opts.need);
    };
    if (opts.before) opts.before(s);
    if (opts.area) s.addTextArea(add); else s.addText(add);
    return opts.open ? s : this.done(field, s);
  }
  choice(field, label, desc, options, opts = {}) {
    const s = this.row(field, label, desc, opts.need);
    s.addDropdown((d) => {
      if (opts.empty !== undefined) d.addOption("", opts.empty);
      options.forEach((o) => d.addOption(o, o));
      if (this.v[field] === undefined && opts.empty === undefined) this.v[field] = options[0];
      d.setValue(this.v[field] || "").onChange((x) => { this.v[field] = x; if (opts.rerender) this.render(field); });
      this.wire(field, label, d.selectEl, opts.need);
    });
    return this.done(field, s);
  }
  toggle(field, label, desc, says) {
    const s = this.row(field, label, desc);
    if (this.v[field] === undefined) this.v[field] = false;
    const wrap = s.controlEl.createEl("label", { cls: "tsf-checkrow" });   // the words beside the box are part of the target
    const box = wrap.createEl("input", { type: "checkbox", cls: "tsf-check" });   // a native checkbox: Space toggles it and a screen reader says its state
    wrap.createSpan({ text: says });
    box.checked = !!this.v[field];
    box.addEventListener("change", () => { this.v[field] = box.checked; });
    this.wire(field, label, box);
    return this.done(field, s);
  }
  /* one or several notes picked from a list (never typed): opts.items or opts.search, opts.text, opts.sub, opts.multi, opts.onChange */
  pick(field, label, desc, opts) {
    const s = this.row(field, label, desc, opts.need);
    const chosen = opts.multi ? (this.v[field] || (this.v[field] = [])) : (this.v[field] ? [this.v[field]] : []);
    const ul = s.controlEl.createEl("ul", { cls: "tsf-chips", attr: { "aria-label": label + ": chosen" } });
    chosen.forEach((item) => {
      const li = ul.createEl("li");
      li.createSpan({ text: opts.text(item) });
      if (!opts.multi) return;
      const x = li.createEl("button", { text: "Remove", attr: { "aria-label": "Remove " + opts.text(item) } });
      x.onclick = () => { chosen.splice(chosen.indexOf(item), 1); if (opts.onChange) opts.onChange(null); this.render(field); };
    });
    s.addButton((b) => {
      const says = opts.multi ? "Add" : chosen.length ? "Change" : "Choose";
      b.setButtonText(says + " " + (opts.noun || "one") + "…");
      this.wire(field, label + ": " + says.toLowerCase(), b.buttonEl, opts.need);
      b.onClick(() => new Pick(this.app, Object.assign({}, opts, { placeholder: label, onPick: (item) => {
        if (opts.multi) { if (!chosen.some((x) => opts.text(x) === opts.text(item))) chosen.push(item); } else this.v[field] = item;
        if (opts.onChange) opts.onChange(item);
        this.render(field);
      } })).open());
    });
    return this.done(field, s);
  }
  /* words copied from a record file: found by typing a few of them and picking the line; the box below holds them and may be trimmed to less
     than the line. Whatever stands in the box is checked against the file, here and again by the vault's own check. */
  quote(field, label, desc, record, need = true) {
    let findInput, findBtn, found;
    const s = this.text(field, label, desc, { area: true, need, open: true, before: (st) => {
      const find = st.controlEl.createDiv({ cls: "tsf-find" });
      find.createEl("label", { text: "1. Find the line: type a few words of it and press Enter", attr: { for: "tsf-find-" + field } });
      findInput = find.createEl("input", { type: "text", attr: { id: "tsf-find-" + field, "aria-label": label + ": find the line in the record" } });
      findBtn = find.createEl("button", { text: "Find lines", attr: { "aria-label": label + ": find lines" } });
      found = st.controlEl.createDiv({ cls: "tsf-lines" });
      st.controlEl.createDiv({ cls: "tsf-find" }).createEl("label", { text: "2. The words as they stand in the record (trim them if less than the line is meant)" });
    } });
    const area = this.ctl[field];
    const note = s.controlEl.createDiv({ cls: "tsf-note", attr: { role: "status" } });
    this.done(field, s);
    const verify = async () => {
      const rec = record(), q = this.v[field] || "";
      if (!rec || !q) { note.setText(rec ? "" : "Choose the record file first."); return; }
      const a = await this.plugin.call({ action: "quote", record: rec, quote: q });
      note.empty();
      if (a.found) { note.setText("In the record word for word, line " + a.line + (a.count > 1 ? " (and " + (a.count - 1) + " more places)" : "") + "."); this.errs[field].setText(""); area.removeAttribute("aria-invalid"); return; }
      this.errs[field].setText(a.exists ? "These words are not in the record." : "The record file does not exist.");
      area.setAttribute("aria-invalid", "true");
      if (a.closest) {
        note.createSpan({ text: "Closest line, " + a.closest_line + ": " + a.closest + " " });
        note.createEl("button", { text: "Use the closest line" }).onclick = () => { this.v[field] = a.closest; area.value = a.closest; verify(); area.focus(); };
      }
    };
    area.addEventListener("blur", verify);
    const search = async () => {
      const rec = record();
      found.empty();
      if (!rec) { note.setText("Choose the record file first."); return; }
      const a = await this.plugin.call({ action: "record", record: rec, find: findInput.value });
      note.setText(a.exists ? a.total + " lines hold these words" + (a.total > a.lines.length ? ", the first " + a.lines.length + " shown." : ".") + (a.total ? " Press Enter to use the first, or Tab to another." : "") : "The record file does not exist.");
      (a.lines || []).forEach((l) => {
        found.createEl("button", { text: l.line + ": " + l.text, attr: { "aria-label": "Use line " + l.line + ": " + l.text } }).onclick = () => { this.v[field] = l.text; area.value = l.text; found.empty(); verify(); area.focus(); };
      });
      const firstLine = found.querySelector("button");
      if (firstLine) firstLine.focus();   // the lines found take the focus: Enter uses the first, Tab goes to the next
    };
    findInput.addEventListener("keydown", (ev) => { if (ev.key === "Enter" && !ev.ctrlKey && !ev.metaKey) { ev.preventDefault(); search(); } });
    findBtn.onclick = search;
    return s;
  }

  show(errors) {
    Object.values(this.errs).forEach((e) => e.setText(""));
    Object.values(this.ctl).forEach((e) => e.removeAttribute("aria-invalid"));
    this.summary.empty(); this.goBtn.hide();
    let first = null;
    const loose = [];
    const order = Object.keys(this.ctl);   // the first field in the form's own order takes the focus
    (errors || []).slice().sort((x, y) => order.indexOf(this.fieldOf(x.field)) - order.indexOf(this.fieldOf(y.field))).forEach((e) => {
      const f = this.fieldOf(e.field);
      const said = e.message === "needed" ? "\"" + (this.labels[f] || f) + "\" is needed: " + (this.ctl[f] && this.ctl[f].tagName === "BUTTON" ? "choose one" : this.ctl[f] && this.ctl[f].tagName === "SELECT" ? "choose one from the list" : "fill it in") : e.message;
      const msg = said.charAt(0).toUpperCase() + said.slice(1) + (/[.?!]$/.test(said) ? "" : ".");
      if (f && this.errs[f]) { this.errs[f].setText((this.errs[f].getText() ? this.errs[f].getText() + " " : "") + msg); if (this.ctl[f]) { this.ctl[f].setAttribute("aria-invalid", "true"); first = first || this.ctl[f]; } }
      else loose.push(msg);
    });
    if (errors && errors.length) this.summary.setText((errors.length === 1 ? "1 thing to mend, shown at its field. " : errors.length + " things to mend, each shown at its field. ") + loose.join(" "));
    if (first) { this.goBtn.show(); this.toFirst(); }
  }
  fieldOf(f) { return f; }
  showPreview(a) {
    const p = this.preview; p.empty();
    if (!a || !a.title) return;
    p.createEl("h4", { text: "The note as it will be written" });
    p.createDiv({ text: a.title, cls: "tsf-title" });
    MarkdownRenderer.render(this.app, a.body || "", p.createDiv(), "", this.plugin);
    (a.relations || []).forEach((r) => p.createDiv({ text: "Relation: " + r }));
  }
  async run(req, saying) {
    if (this.busy) return null;
    this.busy = true; this.status.setText(saying); this.checkBtn.disabled = true; this.saveBtn.disabled = true;
    try { const a = await this.plugin.call(req); if (a.error) throw new Error(a.error); return a; }
    catch (e) { this.summary.setText("The vault tool did not answer: " + e.message); return null; }
    finally { this.busy = false; this.status.setText(""); this.checkBtn.disabled = false; this.saveBtn.disabled = false; }
  }
  async check() {
    const a = await this.run(this.request(true), "Checking…");
    if (!a) return false;
    this.show(a.errors); this.showPreview(a);
    if (!a.errors.length) { this.passed = true; this.saveBtn.setText(this.passLabel()); this.status.setText("Check passed. Nothing is written yet. Press \"" + this.passLabel() + "\" to write it."); this.preview.scrollIntoView({ block: "nearest" }); this.saveBtn.focus(); }
    return !a.errors.length;
  }
  async save() {
    const a = await this.run(this.request(false), "Checking, saving and running the vault check (about 10 seconds)…");
    if (!a) return;
    if (!a.ok) { this.show(a.errors); this.showPreview(a); return; }
    new Notice("Saved and checked: " + (a.title || "the vault"), 8000);
    this.close();
    if (a.title) this.app.workspace.openLinkText(a.title, "", false);
  }
}

const noteText = (i) => i.title;
const links = (a) => (a || []).map((i) => i.link);

class ResultForm extends Form {
  heading() { return "Enter a Result"; }
  intro() { return "A reading copied from a record file. The words are picked from the file, never retyped from memory."; }
  build() {
    const L = this.lists, v = this.v;
    this.text("name", "Short name", "How the note is known, for example: probe 5 learned inside the shuffled range.", { need: true });
    this.pick("experiment", "Experiment", "The run that produced this reading.", { need: true, noun: "the experiment", items: L.experiments, text: noteText, sub: (i) => i.record,
      onChange: (i) => { if (i && i.record) v.record = i.record; v.consistent_with = []; v.against = []; } });
    this.choice("record", "Record file", "The file the reading stands in.", L.records, { empty: "Choose one", rerender: true, need: true });
    this.quote("quote", "Words of the record", "The line or part of a line that states the reading.", () => v.record);
    this.choice("reading", "Reading", "What the record says came out.", L.readings, { rerender: true, need: true });
    this.toggle("counted", "Counted", "Ticked only when the record counts this run toward a stage verdict.", "Counted toward a stage verdict");
    const tested = v.experiment ? L.hypotheses.filter((h) => (v.experiment.hypotheses || []).includes(h.link)) : [];
    if (tested.length) {
      this.pick("consistent_with", "Consistent with", "Hypotheses of this experiment the reading agrees with.", { noun: "a hypothesis", items: tested, text: noteText, multi: true });
      if (L.against_readings.includes(v.reading)) this.pick("against", "Against", "Hypotheses of this experiment the reading stands against.", { noun: "a hypothesis", items: tested, text: noteText, multi: true });
    }
    this.pick("answers", "Answers a question", "Only when the record itself says this run was for the question.", { noun: "a question", items: L.questions, text: noteText, multi: true });
    if ((v.answers || []).length) this.quote("answers_basis", "Words that tie the run to the question", "From the record file of the result or of the question.", () => v.record);
  }
  request(dry) {
    const v = this.v, p = { reading: v.reading, counted: !!v.counted, record: v.record || "", quote: v.quote || "", experiment: v.experiment ? v.experiment.link : "" };
    ["record", "quote", "experiment"].forEach((k) => { if (!p[k]) delete p[k]; });
    if ((v.consistent_with || []).length) p.consistent_with = links(v.consistent_with);
    if ((v.against || []).length && this.lists.against_readings.includes(v.reading)) p.against = links(v.against);
    if ((v.answers || []).length) { p.answers = links(v.answers); if (v.answers_basis) p.answers_basis = v.answers_basis; }
    return { action: dry ? "preview" : "save", kind: "Result", name: (v.name || "").trim(), props: p };
  }
}

class AdmitForm extends Form {
  heading() { return "Admit a draft to the graph"; }
  intro() { return "A claim or question you wrote freely in the Drafts folder. Its first line becomes the statement; the rest stays yours, under Notes. Until you admit it, a draft is checked by nothing."; }
  saveLabel() { return "Check and admit"; }
  passLabel() { return "Admit now"; }
  build() {
    const L = this.lists, v = this.v;
    this.pick("draft", "Draft", L.drafts.length ? "The draft to admit." : "No drafts are waiting. Make one with the command New draft.", { need: true, noun: "the draft", items: L.drafts, text: (d) => d.sentence || d.draft, sub: (d) => d.draft,
      onChange: (d) => { if (d) v.kind = d.kind === "Question" ? "Question" : "Claim"; } });
    if (!v.draft) return;
    this.choice("kind", "Admit as", "A question ends with a question mark.", ["Claim", "Question"], { rerender: true, need: true });
    this.text("name", "Short name", v.kind === "Question" ? "How the question is known, for example: mouth map first." : "How the claim is known, for example: finding, receptor noise.", { need: true });
    if (v.kind === "Question") return;
    this.pick("supported_by", "Results for the claim", "Results that support the claim. At least one Result is needed, for the claim or against it.", { noun: "a Result", items: L.results, text: noteText, sub: (i) => i.reading + ", " + i.record, multi: true });
    this.pick("opposed_by", "Results against the claim", "Results that stand against the claim.", { noun: "a Result", items: L.results, text: noteText, sub: (i) => i.reading + ", " + i.record, multi: true });
    const recs = [...new Set([...(v.supported_by || []), ...(v.opposed_by || [])].map((r) => r.record).filter(Boolean))];
    if (recs.length && !recs.includes(v.record)) v.record = recs[0];
    this.choice("record", "Record file", "A record one of the chosen Results rests on.", recs, { empty: recs.length ? undefined : "Choose a Result first", rerender: true, need: true });
    this.quote("quote", "Words of the record", "The line the claim rests on.", () => v.record);
    this.pick("addresses", "Addresses a question", "An open question the claim speaks to, if any.", { noun: "a question", items: L.questions, text: noteText, multi: true });
  }
  fieldOf(f) { return f === "statement" ? "draft" : f; }
  request(dry) {
    const v = this.v, p = {};
    if (v.kind !== "Question") {
      if (v.record) p.record = v.record;
      if (v.quote) p.quote = v.quote;
      ["supported_by", "opposed_by", "addresses"].forEach((k) => { if ((v[k] || []).length) p[k] = links(v[k]); });
    }
    return { action: "admit", draft: v.draft ? v.draft.draft : "", kind: v.kind === "Question" ? "Question" : "Finding", name: (v.name || "").trim(), props: p, dry: !!dry };
  }
}

class ValueBase extends Form {
  keyPick() {
    this.titleEl.setText(this.heading() + (this.v.key ? ": " + this.v.key.key : ""));
    this.pick("key", "Value", "Search by key or meaning.", { need: true, noun: "the value", search: async (q) => (await this.plugin.call({ action: "values", find: q })).values || [], text: (i) => i.key,
      sub: (i) => JSON.stringify(i.value) + ", " + i.status + (i.meaning ? ", " + i.meaning : "") });
  }
  showPreview(a) {
    const p = this.preview; p.empty();
    if (!a || !a.before) return;
    const will = Object.assign({}, a.before, this.asked());
    p.createEl("h4", { text: a.after ? "Written" : "What the change will be" });
    const t = p.createEl("table", { cls: "tsf-table" });
    const h = t.createEl("tr"); ["", a.after ? "Was" : "Now", a.after ? "Is now" : "After the change"].forEach((x) => h.createEl("th", { text: x, attr: { scope: "col" } }));
    [["value", "Value"], ["status", "Status"], ["meaning", "Meaning"], ["evidence", "Passages"]].forEach(([k, name]) => {
      const say = (x) => (x === null || x === undefined ? "none" : typeof x === "string" ? x : JSON.stringify(x));
      const then = (a.after || will)[k];
      const r = t.createEl("tr", { cls: say(then) === say(a.before[k]) ? "" : "tsf-changed" });
      r.createEl("th", { text: name + (say(then) === say(a.before[k]) ? "" : " (changes)"), attr: { scope: "row" } });
      r.createEl("td", { text: say(a.before[k]) });
      r.createEl("td", { text: say(then) === say(a.before[k]) ? say(then) + " (unchanged)" : say(then) });
    });
    if (!a.after && "value" in this.asked() && String(a.before.status || "").startsWith("source-found") && !this.v.status) p.createEl("p", { text: "Take care: the status stays " + a.before.status + " and its " + a.before.evidence + " passage(s) stay attached. They were read for the value as it is now. Check that they still support the new value, or set a new status.", cls: "tsf-caution" });
    if (a.impact) { p.createEl("h4", { text: "What reads this value: look at these again" }); p.createEl("pre", { text: a.impact.join("\n") }); }
  }
  asked() { return {}; }
  edited(typed) { if (this.checked) { this.checked = null; this.status.setText("Changed since the check: check again."); } if (this.saveBtn) this.saveBtn.setText(this.saveLabel()); if (typed && this.preview) this.preview.empty(); }
  async check() { const ok = await Form.prototype.check.call(this); this.saveBtn.setText(this.saveLabel()); if (ok) { this.status.setText("Check passed. Nothing is written yet."); this.saveBtn.focus(); } return ok; }
  async save() {
    const now = JSON.stringify(this.request(true));
    if (this.checked !== now) {   // a value is never written by one press: the first press checks and shows what changes, the second writes
      if (await this.check()) { this.checked = now; this.saveBtn.setText(this.writeLabel()); this.status.setText("Check passed. Nothing is written yet. Press \"" + this.writeLabel() + "\" to write it."); }
      return;
    }
    const a = await this.run(this.request(false), "Writing, regenerating and running the vault check (about 10 seconds)…");
    if (!a) return;
    this.checked = null; this.saveBtn.setText(this.saveLabel());
    this.show(a.errors); this.showPreview(a);
    if (a.ok) { new Notice("Saved and checked: " + this.v.key.key, 8000); this.status.setText("Written and checked."); }
  }
}

class ValueForm extends ValueBase {
  heading() { return "Change a value"; }
  intro() { return "A body or other configuration value. Check shows the value before, and what reads it; the second press writes. Learner constants are not changed here."; }
  saveLabel() { return "Check the change"; }
  writeLabel() { return "Write the change now"; }
  asked() { const v = this.v, o = {}; if (v.value) { try { o.value = JSON.parse(v.value); } catch (e) { o.value = v.value; } } if (v.status) o.status = v.status; if (v.meaning) o.meaning = v.meaning; return o; }
  build() {
    this.keyPick();
    this.text("value", "New value", "A number, true, false, a quoted text or a [list]. Leave it empty to keep the value.");
    this.choice("status", "New status", "A source-found status needs a passage first.", this.lists.statuses, { empty: "Unchanged" });
    this.text("meaning", "New meaning", "Leave it empty to keep the meaning.");
  }
  request(dry) {
    const v = this.v, r = { action: dry ? "value_preview" : "value_save", key: v.key ? v.key.key : "" };
    ["value", "status", "meaning"].forEach((k) => { if (v[k]) r[k] = v[k]; });
    return r;
  }
}

class EvidenceForm extends ValueBase {
  heading() { return "Enter a passage of a paper"; }
  intro() { return "Words read in a paper that bear on one value. The paper must be in the register already. Copy the passage from the paper as it stands."; }
  saveLabel() { return "Check the passage"; }
  writeLabel() { return "Write the passage now"; }
  asked() { return Object.assign({ evidence: "one more" }, this.v.status ? { status: this.v.status } : {}); }
  build() {
    this.keyPick();
    this.pick("paper", "Paper", "Search the register by author, year, title or DOI.", { need: true, noun: "the paper", search: async (q) => (await this.plugin.call({ action: "papers", find: q })).papers || [], text: (i) => i.title, sub: (i) => i.id });
    this.text("locator", "Where in the paper", "Page, table or figure.", { need: true });
    this.text("quote", "Words of the paper", "Copied as they stand.", { area: true, need: true });
    this.text("value_in_source", "Value in the paper", "The number as the paper gives it, with its unit.");
    this.text("species_age", "Species and age", "For example: human fetal, 12 weeks. Adult data is recorded as unusable, never as a source.");
    this.text("transfer", "Transfer", "How the paper's measure carries to the value; none when it is the same quantity at the same age.");
    this.choice("link_status", "What this passage is", "Fetal data, a stated transfer from other data, or adult data kept only as unusable.", this.lists.passage_statuses, { need: true, empty: "Choose one" });
    this.choice("status", "Then set the value's status to", "", this.lists.statuses, { empty: "Unchanged" });
  }
  request(dry) {
    const v = this.v, r = { action: dry ? "evidence_preview" : "evidence_save", key: v.key ? v.key.key : "", paper: v.paper ? v.paper.id : "" };
    ["locator", "quote", "value_in_source", "species_age", "transfer", "link_status", "status"].forEach((k) => { if (v[k]) r[k] = v[k]; });
    return r;
  }
}

class Settings extends PluginSettingTab {
  constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }
  display() {
    this.containerEl.empty();
    new Setting(this.containerEl).setName("Python command").setDesc("The command that starts Python on this computer. The forms run tools/dm/form_api.py with it, in the folder above the vault.")
      .addText((t) => t.setValue(this.plugin.settings.python).onChange(async (x) => { this.plugin.settings.python = x.trim() || "python"; await this.plugin.saveData(this.plugin.settings); }));
  }
}

module.exports = class TruSomaForms extends Plugin {
  async onload() {
    this.settings = Object.assign({}, DEFAULTS, await this.loadData());
    this.addSettingTab(new Settings(this.app, this));
    const forms = [["result", "Enter a Result", ResultForm], ["admit", "Admit a draft (claim or question)", AdmitForm], ["passage", "Enter a passage of a paper", EvidenceForm], ["value", "Change a value", ValueForm]];
    forms.forEach(([id, name, F]) => this.addCommand({ id, name, callback: () => new F(this.app, this).open() }));
    this.addCommand({ id: "draft", name: "New draft (claim or question, written freely)", callback: () => this.newDraft() });
    this.addRibbonIcon("clipboard-list", "TruSoma entry forms", (ev) => {
      const m = new Menu();
      m.addItem((i) => i.setTitle("New draft (claim or question)").onClick(() => this.newDraft()));
      forms.forEach(([, name, F]) => m.addItem((i) => i.setTitle(name).onClick(() => new F(this.app, this).open())));
      m.showAtMouseEvent(ev);
    });
  }
  async newDraft() {
    if (!this.app.vault.getAbstractFileByPath("Drafts")) await this.app.vault.createFolder("Drafts");
    const stamp = window.moment().format("YYYY-MM-DD HHmmss");
    const file = await this.app.vault.create("Drafts/draft " + stamp + ".md", "");
    const ws = this.app.workspace;
    const leaf = ws.getLeaf("tab");   // a tab of its own in the main area, never a side pane
    await leaf.openFile(file, { active: true });
    if (ws.rootSplit.containerEl.clientWidth < 320 && ws.rightSplit && !ws.rightSplit.collapsed) ws.rightSplit.collapse();   // a narrow window: the side pane gives way so there is room to write
    ws.setActiveLeaf(leaf, { focus: true });
    ws.revealLeaf(leaf);
    if (leaf.view && leaf.view.editor) leaf.view.editor.focus();
    new Notice("First line: your claim or question. Below it: your reasoning, as long as you like. Admit it when it is ready.", 10000);
  }
  /* what is typed in an open draft reaches the disk before the vault tool reads it (Obsidian saves a moment after the last key) */
  async flushDrafts() {
    const waiting = [];
    this.app.workspace.iterateAllLeaves((leaf) => { const v = leaf.view; if (v && v.file && v.file.path.startsWith("Drafts/") && typeof v.save === "function") waiting.push(v.save()); });
    await Promise.all(waiting);
  }
  async call(req) {
    if (["lists", "drafts", "admit"].includes(req.action)) await this.flushDrafts();
    const root = path.dirname(this.app.vault.adapter.getBasePath());
    return new Promise((resolve, reject) => {
      const p = spawn(this.settings.python, ["-B", path.join("tools", "dm", "form_api.py")], { cwd: root, env: Object.assign({}, process.env, { PYTHONUTF8: "1" }), windowsHide: true });
      let out = "", err = "";
      p.stdout.setEncoding("utf8"); p.stderr.setEncoding("utf8");
      p.stdout.on("data", (d) => { out += d; });
      p.stderr.on("data", (d) => { err += d; });
      p.on("error", (e) => reject(new Error("could not start " + this.settings.python + " (" + e.message + "); set the Python command in this plugin's settings")));
      p.on("close", () => { try { resolve(JSON.parse(out)); } catch (e) { reject(new Error((err || out || "no answer").slice(-300))); } });
      p.stdin.end(JSON.stringify(req), "utf8");
    });
  }
};
