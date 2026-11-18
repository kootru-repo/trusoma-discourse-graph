/* TruSoma entry forms (Obsidian plugin, desktop only). A thin shell: it draws the fields and shows what the vault's own Python tool answers
   (tools/dm/form_api.py, one JSON request per call). No rule about the graph lives here; nothing here writes a graph note. The one file this
   plugin writes itself is a new plain draft in vault/Drafts, which no tool reads. Built by scripts/build.ts, installed by
   tools/dm/forms_plugin/install.py. */
import path from "path";
import { FileSystemAdapter, MarkdownView, Menu, Notice, Plugin, TextFileView } from "obsidian";
import type { Modal } from "obsidian";
import { callBackend, messageOf } from "./backend";
import type { DraftHints, Request } from "./backend";
import { registerDraftCount, registerNoteActions } from "./noteActions";
import { AdmitForm, ResultForm } from "./noteForms";
import { DEFAULT_SETTINGS, SettingsTab } from "./settings";
import type { Settings } from "./settings";
import { EvidenceForm, ValueForm } from "./valueForms";

const DRAFTS = "Drafts";
const SAID_MS = 12000;
const SAID_LENGTH = 90;
const NARROW_PX = 320;
const NL = "\n";
/* the requests that read the drafts: what is typed in an open draft must be on the disk first */
const READS_DRAFTS = ["lists", "drafts", "admit"];

type FormEntry = { id: string; name: string; open: () => Modal };

/* the local time as it stands in a draft's file name: 2026-11-17 142530 */
const timeStamp = (now: Date): string => {
  const two = (n: number): string => String(n).padStart(2, "0");
  const day = [now.getFullYear(), two(now.getMonth() + 1), two(now.getDate())].join("-");
  return `${day} ${two(now.getHours())}${two(now.getMinutes())}${two(now.getSeconds())}`;
};

export default class TruSomaForms extends Plugin {
  settings: Settings = DEFAULT_SETTINGS;
  private said?: HTMLElement;
  private saidTimer?: number;
  private drafting: Promise<void> = Promise.resolve();

  async onload(): Promise<void> {
    this.settings = { ...DEFAULT_SETTINGS, ...((await this.loadData()) as Partial<Settings> | null) };
    if (typeof this.settings.python !== "string" || !this.settings.python.trim()) this.settings.python = DEFAULT_SETTINGS.python;
    this.addSettingTab(new SettingsTab(this.app, this));
    const forms: FormEntry[] = [
      { id: "result", name: "Enter a Result", open: () => new ResultForm(this.app, this) },
      { id: "admit", name: "Admit a draft (claim or question)", open: () => new AdmitForm(this.app, this) },
      { id: "passage", name: "Enter a passage of a paper", open: () => new EvidenceForm(this.app, this) },
      { id: "value", name: "Change a value", open: () => new ValueForm(this.app, this) },
    ];
    forms.forEach(({ id, name, open }) => this.addCommand({ id, name, callback: () => open().open() }));
    this.addCommand({
      id: "draft",
      name: "New draft (claim or question, written freely)",
      callback: () => this.newDraft(),
    });
    registerNoteActions(this);
    // what was just saved is said in the status bar: an Obsidian notice appears at the top right, over the buttons of the note that has just opened
    this.said = this.addStatusBarItem();
    this.said.addClass("tsf-said");
    this.said.setAttribute("role", "status");
    this.said.hide();
    this.register(() => window.clearTimeout(this.saidTimer));
    registerDraftCount(this);
    this.addRibbonIcon("clipboard-list", "TruSoma entry forms", (ev) => {
      const menu = new Menu();
      menu.addItem((item) => item.setTitle("New draft (claim or question)").onClick(() => this.newDraft()));
      forms.forEach(({ name, open }) => menu.addItem((item) => item.setTitle(name).onClick(() => open().open())));
      menu.showAtMouseEvent(ev);
    });
  }

  say(text: string): void {
    const said = this.said;
    if (!said) return;
    said.setText(text.length > SAID_LENGTH ? text.slice(0, SAID_LENGTH - 1) + "…" : text);
    said.show();
    window.clearTimeout(this.saidTimer);
    this.saidTimer = window.setTimeout(() => said.hide(), SAID_MS);
  }

  /* a new plain draft, opened ready to write in; hints: the note it was begun on, kept above the text */
  newDraft(hints?: DraftHints): void {
    // one at a time: two drafts begun at once would both take the same file name
    this.drafting = this.drafting
      .then(() => this.openNewDraft(hints))
      .catch((e: unknown) => void new Notice("The draft could not be made: " + messageOf(e)));
  }

  private async openNewDraft(hints?: DraftHints): Promise<void> {
    const { vault, workspace } = this.app;
    if (!vault.getAbstractFileByPath(DRAFTS)) await vault.createFolder(DRAFTS);
    const stamp = timeStamp(new Date());
    const lines = Object.entries(hints ?? {}).map(([name, title]) => `${name}: ${JSON.stringify(title)}`);
    const head = hints ? ["---", ...lines, "---", "", ""].join(NL) : "";
    let name = `${DRAFTS}/draft ${stamp}.md`;
    for (let n = 2; vault.getAbstractFileByPath(name); n++) name = `${DRAFTS}/draft ${stamp} ${n}.md`; // two drafts begun in one second
    const file = await vault.create(name, head);
    const leaf = workspace.getLeaf("tab"); // a tab of its own in the main area, never a side pane
    await leaf.openFile(file, { active: true });
    // a narrow window: the side pane gives way so there is room to write
    const room = (workspace.rootSplit as unknown as { containerEl?: HTMLElement }).containerEl?.clientWidth;
    if (room !== undefined && room < NARROW_PX && !workspace.rightSplit.collapsed) workspace.rightSplit.collapse();
    workspace.setActiveLeaf(leaf, { focus: true });
    await workspace.revealLeaf(leaf);
    if (leaf.view instanceof MarkdownView) {
      const editor = leaf.view.editor;
      editor.setCursor(editor.lastLine(), 0);
      editor.focus();
    }
    // no notice here: Obsidian shows notices at the top right, over the note's own buttons, and it hid Admit this draft for ten seconds
  }

  /* what is typed in an open draft reaches the disk before the vault tool reads it (Obsidian saves a moment after the last key) */
  private async flushDrafts(): Promise<void> {
    const saving: Promise<void>[] = [];
    this.app.workspace.iterateAllLeaves((leaf) => {
      const view = leaf.view;
      if (view instanceof TextFileView && view.file?.path.startsWith(DRAFTS + "/")) saving.push(view.save().catch(() => undefined)); // an unsaved draft is read as it stands on the disk
    });
    await Promise.all(saving);
  }

  async call<T>(request: Request): Promise<T> {
    if (READS_DRAFTS.includes(request.action)) await this.flushDrafts();
    const adapter = this.app.vault.adapter;
    if (!(adapter instanceof FileSystemAdapter)) throw new Error("the entry forms need a vault on this computer's disk");
    return callBackend<T>({ python: this.settings.python, root: path.dirname(adapter.getBasePath()), request });
  }
}
