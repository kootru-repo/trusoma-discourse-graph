/* A list to pick one item from, by typing a few words of it. The items are given, or searched for as the words are typed. */
import { SuggestModal } from "obsidian";
import type { App } from "obsidian";

export type PickSource<T> = {
  items?: T[];
  search?: (query: string) => Promise<T[]>;
  text: (item: T) => string;
  sub?: (item: T) => string | undefined;
};

export type PickOptions<T> = PickSource<T> & { placeholder?: string; onPick: (item: T) => void };

const SHOWN = 80;
const PAUSE_MS = 300;

const words = (query: string): string[] => query.toLowerCase().split(/\s+/).filter(Boolean);

export class PickModal<T> extends SuggestModal<T> {
  private turn = 0;

  constructor(
    app: App,
    private readonly opts: PickOptions<T>,
  ) {
    super(app);
    this.setPlaceholder(opts.placeholder || "Type to search");
  }

  async getSuggestions(query: string): Promise<T[]> {
    const { items, search, text, sub } = this.opts;
    if (items) {
      const asked = words(query);
      const said = (item: T): string => `${text(item)} ${sub?.(item) ?? ""}`.toLowerCase();
      return items.filter((item) => asked.every((word) => said(item).includes(word))).slice(0, SHOWN);
    }
    const mine = ++this.turn; // only the last words typed are searched for
    await new Promise((resolve) => setTimeout(resolve, PAUSE_MS));
    if (mine !== this.turn || !search) return [];
    try {
      return await search(query);
    } catch {
      return []; // the vault tool did not answer: nothing to pick, and the form says why at its next check
    }
  }

  renderSuggestion(item: T, el: HTMLElement): void {
    el.createDiv({ text: this.opts.text(item) });
    const sub = this.opts.sub?.(item);
    if (sub) el.createDiv({ text: sub, cls: "tsf-sub" });
  }

  onChooseSuggestion(item: T): void {
    this.opts.onPick(item);
  }
}
