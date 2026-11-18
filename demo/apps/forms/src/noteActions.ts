/* A note carries its own way into the form that fits it: a button in the note's header, a command, and an entry in the note's menu, each
   opening the form with this note already chosen. What kind of note it is comes from its properties. The drafts that wait are counted in the
   status bar, one press away. */
import { FileView, Notice, TextFileView, TFile } from "obsidian";
import type { App, FrontMatterCache, Plugin, TAbstractFile } from "obsidian";
import { messageOf } from "./backend";
import type { DraftHints, Host } from "./backend";
import { AdmitForm, ResultForm } from "./noteForms";
import { PickModal } from "./pick";
import { EvidenceForm, ValueForm } from "./valueForms";

const DRAFTS = "Drafts/";
const GRAPH = "DiscourseGraph/";
const DRAFT_HINT =
  "First line: your claim or question. Below it: your reasoning, as long as you like. When it is ready, press Save to graph.";

export type FormsHost = Plugin &
  Host & { newDraft: (hints?: DraftHints) => void };

type NoteAction = {
  id: string;
  name: string;
  icon: string;
  when: (note: TFile) => boolean;
  run: (note: TFile) => void;
};

const asNote = (file: TAbstractFile | null | undefined): TFile | null =>
  file instanceof TFile && file.extension === "md" ? file : null;

export const inDrafts = (note: TFile): boolean =>
  note.extension === "md" && note.path.startsWith(DRAFTS);

/* the whole note as it stands, properties included: from the open editor when the note is open (what is typed may not be on the disk yet) */
const noteText = async (app: App, note: TFile): Promise<string> => {
  let open: string | undefined;
  app.workspace.iterateAllLeaves((leaf) => {
    const view = leaf.view;
    if (view instanceof TextFileView && view.file === note)
      open = view.getViewData();
  });
  return open ?? app.vault.read(note);
};

const noteActions = (app: App, host: FormsHost): NoteAction[] => {
  const copy = (note: TFile): void => {
    noteText(app, note)
      .then((text) => navigator.clipboard.writeText(text))
      .then(() => host.say("Copied the whole note: " + note.basename))
      .catch(
        (e: unknown) =>
          void new Notice("The note could not be copied: " + messageOf(e)),
      );
  };
  const front = (note: TFile): FrontMatterCache =>
    app.metadataCache.getFileCache(note)?.frontmatter ?? {};
  const inGraph = (note: TFile, type: string): boolean =>
    note.path.startsWith(GRAPH) &&
    front(note).dg_type === type &&
    !front(note).record_file;
  const isValue = (note: TFile): boolean => {
    const f = front(note);
    const kind = ["Claim", "Parameter"].includes(String(f.dg_type));
    return (
      note.path.startsWith(GRAPH) &&
      kind &&
      !!f.key &&
      !f.record_file &&
      !f.module
    );
  };
  const key = (note: TFile): string => String(front(note).key);
  return [
    {
      id: "admit-this",
      name: "Save to graph",
      icon: "check-circle",
      when: inDrafts,
      run: (note) =>
        new AdmitForm(app, host, note.path.slice(DRAFTS.length)).open(),
    },
    {
      id: "claim-from-result",
      name: "Draft a claim from this Result",
      icon: "pencil",
      when: (note) => inGraph(note, "Result"),
      run: (note) => host.newDraft({ claim_from_result: note.basename }),
    },
    {
      id: "claim-for-question",
      name: "Draft a claim that addresses this",
      icon: "pencil",
      when: (note) => inGraph(note, "Question"),
      run: (note) => host.newDraft({ claim_addresses: note.basename }),
    },
    {
      id: "result-for-experiment",
      name: "Enter a Result for this experiment",
      icon: "clipboard-list",
      when: (note) => inGraph(note, "Experiment"),
      run: (note) => new ResultForm(app, host, note.basename).open(),
    },
    {
      id: "passage-for-value",
      name: "Enter a passage for this value",
      icon: "quote",
      when: isValue,
      run: (note) => new EvidenceForm(app, host, key(note)).open(),
    },
    {
      id: "change-this-value",
      name: "Change this value",
      icon: "sliders-horizontal",
      when: isValue,
      run: (note) => new ValueForm(app, host, key(note)).open(),
    },
    {
      id: "copy-note",
      name: "Copy note",
      icon: "copy",
      when: () => true,
      run: copy,
    },
  ];
};

type Marked = { sign: string; buttons: HTMLElement[] };

export const registerNoteActions = (host: FormsHost): void => {
  const { app } = host;
  const actions = noteActions(app, host);
  const fitting = (file: TAbstractFile | null | undefined): NoteAction[] => {
    const note = asNote(file);
    return note ? actions.filter((a) => a.when(note)) : [];
  };

  actions.forEach((a) =>
    host.addCommand({
      id: a.id,
      name: a.name,
      checkCallback: (checking) => {
        const note = asNote(app.workspace.getActiveFile());
        if (!note || !a.when(note)) return false;
        if (!checking) a.run(note);
        return true;
      },
    }),
  );

  // the header buttons of each open note, renewed when the note or its kind changes
  const marked = new WeakMap<FileView, Marked>();
  const clear = (view: FileView): void => {
    marked.get(view)?.buttons.forEach((b) => b.remove());
    marked.delete(view);
  };
  const mark = (): void =>
    app.workspace.iterateAllLeaves((leaf) => {
      const view = leaf.view;
      if (!(view instanceof FileView)) return;
      const note = asNote(view.file);
      const fit = fitting(note);
      const sign = note ? `${note.path}|${fit.map((a) => a.id).join(",")}` : "";
      if ((marked.get(view)?.sign ?? null) === sign) return;
      clear(view);
      // addAction puts each new button first, so they are added last to first
      const buttons = [...fit].reverse().map((a) => {
        const b = view.addAction(a.icon, a.name, () => {
          if (note) a.run(note);
        });
        b.addClass("tsf-note-action");
        b.createSpan({ text: a.name });
        return b;
      });
      // a draft says what it is for above its text: the first line is the statement, the rest is reasoning
      if (note && inDrafts(note)) {
        const hint = createDiv({ cls: "tsf-draft-hint", text: DRAFT_HINT });
        hint.setAttribute("role", "note");
        view.containerEl.insertBefore(hint, view.contentEl);
        buttons.push(hint);
      }
      marked.set(view, { sign, buttons });
    });
  host.registerEvent(app.workspace.on("file-open", mark));
  host.registerEvent(app.workspace.on("layout-change", mark));
  host.registerEvent(app.metadataCache.on("changed", mark));
  host.registerEvent(app.vault.on("rename", mark)); // a note moved into or out of Drafts changes what fits it
  app.workspace.onLayoutReady(mark);
  host.register(() =>
    app.workspace.iterateAllLeaves((leaf) => {
      if (leaf.view instanceof FileView) clear(leaf.view);
    }),
  );

  host.registerEvent(
    app.workspace.on("file-menu", (menu, file) =>
      fitting(file).forEach((a) =>
        menu.addItem((item) =>
          item
            .setTitle(a.name)
            .setIcon(a.icon)
            .onClick(() => {
              const note = asNote(file);
              if (note) a.run(note);
            }),
        ),
      ),
    ),
  );
};

export const registerDraftCount = (host: FormsHost): void => {
  const { app } = host;
  const bar = host.addStatusBarItem();
  bar.addClass("mod-clickable");
  bar.setAttribute("role", "button");
  bar.setAttribute("tabindex", "0");
  const waiting = (): TFile[] => app.vault.getMarkdownFiles().filter(inDrafts);
  const count = (): void => {
    const n = waiting().length;
    bar.setText(n ? `${n} ${n === 1 ? "draft" : "drafts"} waiting` : "");
    bar.setAttribute(
      "aria-label",
      `${n} drafts wait to be saved to the graph: open one`,
    );
    bar.toggle(n > 0);
  };
  const go = (note: TFile): void =>
    void app.workspace.getLeaf("tab").openFile(note, { active: true });
  const openDraft = (): void => {
    const drafts = waiting();
    const only = drafts.length === 1 ? drafts[0] : undefined;
    if (only) go(only);
    else if (drafts.length)
      new PickModal<TFile>(app, {
        placeholder: "Drafts waiting",
        items: drafts,
        text: (f) => f.basename,
        onPick: go,
      }).open();
  };
  bar.onclick = openDraft;
  bar.addEventListener("keydown", (ev) => {
    if (ev.key !== "Enter" && ev.key !== " ") return;
    ev.preventDefault();
    openDraft();
  });
  host.registerEvent(app.vault.on("create", count));
  host.registerEvent(app.vault.on("delete", count));
  host.registerEvent(app.vault.on("rename", count));
  app.workspace.onLayoutReady(count);
};
