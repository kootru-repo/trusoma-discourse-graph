/**
 * Records the walkthrough shown on the site (demo/site/forms.html): a claim written freely on a Result, admitted through the form, refused
 * once at its field, mended and saved. It drives a real Obsidian over its debugging port, on a throw-away copy of the vault, and writes
 * four stills and the frames of a short film. Waits on the vault's own check are shortened in the film; nothing else is edited.
 * usage: PLAYWRIGHT_CORE=/path/to/playwright-core tsx scripts/walkthrough.ts OUT_DIR   (Obsidian started with --remote-debugging-port=9333)
 */
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

type Box = { x: number; y: number; width: number; height: number };
type Shot = {
  path: string;
  type?: "jpeg" | "png";
  quality?: number;
  clip?: Box;
};
type Part = "note" | "form" | "quote";
type Page = {
  url: () => string;
  mouse: { move: (x: number, y: number) => Promise<void> };
  evaluate: <T, A = undefined>(
    fn: (arg: A) => T | Promise<T>,
    arg?: A,
  ) => Promise<T>;
  click: (selector: string) => Promise<void>;
  focus: (selector: string) => Promise<void>;
  waitForSelector: (
    selector: string,
    options?: { state?: "detached"; timeout?: number },
  ) => Promise<unknown>;
  waitForTimeout: (ms: number) => Promise<void>;
  screenshot: (shot: Shot) => Promise<unknown>;
  setViewportSize: (size: { width: number; height: number }) => Promise<void>;
  keyboard: {
    type: (text: string, options?: { delay?: number }) => Promise<void>;
    press: (key: string) => Promise<void>;
  };
};
type Browser = {
  contexts: () => { pages: () => Page[] }[];
  close: () => Promise<void>;
};
type Playwright = {
  chromium: { connectOverCDP: (url: string) => Promise<Browser> };
};
type Leaf = { openFile: (file: unknown) => Promise<void> };
type ObsidianApp = {
  plugins: {
    disablePlugin: (id: string) => Promise<void>;
    enablePlugin: (id: string) => Promise<void>;
  };
  workspace: {
    leftSplit: { collapse: () => void };
    rightSplit: { collapse: () => void };
    getLeaf: (fresh: boolean) => Leaf;
  };
  vault: { getAbstractFileByPath: (path: string) => unknown };
};
type Frame = { file: string; at: number };

const RESULT =
  "DiscourseGraph/RES - surface identity in the raw touch input.md";
const CLAIM =
  "Touch alone already tells which surface is which, before any learning";
const REASON =
  "If the raw input separates surfaces, the learner starts from a map that is partly there.";
const NAME = "finding, surfaces in raw touch";
const FROM_MEMORY = "the raw input separates surfaces perfectly";
const WORDS = "same-surface partners";
const ACTION = ".workspace-leaf.mod-active .tsf-note-action";
const KEY_MS = 28;
const LONGEST_FRAME_S = 0.7;

const { chromium } = createRequire(import.meta.url)(
  process.env.PLAYWRIGHT_CORE ?? "playwright-core",
) as Playwright;
const out = path.resolve(process.argv[2] ?? "walkthrough");

const main = async (): Promise<void> => {
  fs.mkdirSync(path.join(out, "frames"), { recursive: true });
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const page = browser
    .contexts()
    .flatMap((context) => context.pages())
    .find((p) => p.url().includes("index.html"));
  if (!page) throw new Error("the vault window was not found");
  const { keyboard } = page;
  const wait = (ms: number): Promise<void> => page.waitForTimeout(ms);
  // a still shows the part of the window the step is about, without the film's label; the film waits while it is taken
  let holding = false;
  // no named function inside: this code runs in the Obsidian window, where the helpers a bundler adds for names do not exist
  const boxOf = (part: Part): Promise<Box> =>
    page.evaluate((which) => {
      const body = document.body;
      const leaf = (
        document.querySelector(".workspace-leaf.mod-active") ?? body
      ).getBoundingClientRect();
      if (which === "note")
        return {
          x: leaf.left,
          y: leaf.top,
          width: leaf.width,
          height: 400,
        };
      const modal = (
        document.querySelector(".tsf-modal") ?? body
      ).getBoundingClientRect();
      if (which === "form") {
        // down to the last whole field that fits, so no field is cut in half
        let bottom = modal.top + 120;
        for (const item of document.querySelectorAll(
          ".tsf-modal .setting-item",
        )) {
          const b = item.getBoundingClientRect().bottom;
          if (b <= modal.top + 520 && b > bottom) bottom = b;
        }
        return {
          x: modal.left,
          y: modal.top,
          width: modal.width,
          height: bottom - modal.top + 1,
        };
      }
      const row = (
        document
          .querySelector(".tsf-modal textarea")
          ?.closest(".setting-item") ?? body
      ).getBoundingClientRect();
      return {
        x: modal.left,
        y: row.top - 8,
        width: modal.width,
        height: modal.bottom - row.top + 8,
      };
    }, part);
  const labelShown = (shown: boolean): Promise<void> =>
    page.evaluate((on) => {
      const el = document.getElementById("tsf-demo-caption");
      if (el) el.style.visibility = on ? "visible" : "hidden";
    }, shown);
  const still = async (name: string, part: Part): Promise<void> => {
    holding = true;
    await wait(350);
    await labelShown(false);
    await page.screenshot({
      path: path.join(out, name + ".png"),
      clip: await boxOf(part),
    });
    await labelShown(true);
    holding = false;
  };
  // the pointer leaves the button after the press, so no tooltip hangs over the next view
  const press = async (name: string): Promise<void> => {
    await page.click(`${ACTION}:has-text('${name}')`);
    await page.mouse.move(640, 560);
  };
  const caption = (text: string): Promise<void> =>
    page.evaluate((said) => {
      const id = "tsf-demo-caption";
      const el =
        document.getElementById(id) ??
        document.body.appendChild(
          Object.assign(document.createElement("div"), { id }),
        );
      el.setAttribute(
        "style",
        "position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:9999;padding:9px 18px;border-radius:999px;" +
          "background:#ffc46b;color:#0a0f1c;font:600 15px/1.3 'Segoe UI',system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.45);" +
          "max-width:92vw;text-align:center",
      );
      el.textContent = said;
      el.style.display = said ? "block" : "none";
    }, text);

  await page.setViewportSize({ width: 1280, height: 800 });
  await keyboard.press("Escape");
  await page.evaluate(async (note) => {
    const app = (window as unknown as { app: ObsidianApp }).app; // this function runs in the Obsidian window
    await app.plugins.disablePlugin("trusoma-forms");
    await app.plugins.enablePlugin("trusoma-forms");
    app.workspace.leftSplit.collapse();
    app.workspace.rightSplit.collapse();
    document.querySelectorAll<HTMLElement>(".notice").forEach((n) => n.click());
    await app.workspace
      .getLeaf(false)
      .openFile(app.vault.getAbstractFileByPath(note));
  }, RESULT);
  await wait(1500);

  // the film: frames taken as fast as the window gives them, while the steps below run
  const frames: Frame[] = [];
  let filming = true;
  const film = (async (): Promise<void> => {
    while (filming) {
      if (holding) {
        await wait(40);
        continue;
      }
      const file = path.join(
        out,
        "frames",
        `f${String(frames.length).padStart(5, "0")}.jpg`,
      );
      const at = Date.now();
      await page.screenshot({ path: file, type: "jpeg", quality: 82 });
      frames.push({ file, at });
    }
  })();

  await caption("1. A Result in the graph. Start a claim from it.");
  await wait(2200);
  await press("Draft a claim from this Result");
  await wait(1500);
  await caption(
    "2. Write the claim freely. The first line is the claim, the rest is your reasoning.",
  );
  await keyboard.type(CLAIM, { delay: KEY_MS });
  await keyboard.press("Enter");
  await keyboard.press("Enter");
  await keyboard.type(REASON, { delay: KEY_MS });
  await wait(1600);
  await still("1-draft", "note");

  await caption(
    "3. Save it to the graph from the note. The form opens with the Result already chosen.",
  );
  await wait(900);
  await press("Save to graph");
  await page.waitForSelector(".tsf-modal .tsf-buttons", { timeout: 60000 });
  await wait(900);
  await page.focus(".tsf-modal input[aria-label='Short name']");
  await keyboard.type(NAME, { delay: KEY_MS });
  await wait(1400);
  await still("2-form", "form");

  await caption(
    "4. Words typed from memory are refused at their field. Nothing is written.",
  );
  await page.focus(".tsf-modal textarea[aria-label='Words of the record']");
  await keyboard.type(FROM_MEMORY, { delay: KEY_MS });
  await page.click(".tsf-modal .tsf-buttons button:has-text('Check only')");
  await page.waitForSelector(".tsf-modal [aria-invalid='true']", {
    timeout: 60000,
  });
  await wait(2600);
  await still("3-refused", "quote");

  await caption(
    "5. Find the line in the record and pick it. The words are copied, never retyped.",
  );
  await page.focus("#tsf-find-quote");
  await keyboard.type(WORDS, { delay: KEY_MS });
  await keyboard.press("Enter");
  await page.waitForSelector(".tsf-lines button", { timeout: 60000 });
  await wait(1500);
  await keyboard.press("Enter");
  await wait(2600);

  await caption(
    "6. Check and save: the vault's own check runs, then the note opens.",
  );
  await keyboard.press("Control+Enter");
  await page.waitForSelector(".tsf-modal", {
    state: "detached",
    timeout: 120000,
  });
  await wait(2500);
  await caption("");
  await wait(300);
  await still("4-saved", "note");
  await wait(1200);
  filming = false;
  await film;

  // waits on the vault's check are shortened: no frame stays longer than LONGEST_FRAME_S
  const lines = frames.flatMap((frame, i) => {
    const next = frames[i + 1];
    const seconds = Math.min(
      next ? (next.at - frame.at) / 1000 : LONGEST_FRAME_S,
      LONGEST_FRAME_S,
    );
    return [
      `file '${frame.file.replace(/\\/g, "/")}'`,
      `duration ${seconds.toFixed(3)}`,
    ];
  });
  fs.writeFileSync(path.join(out, "frames.txt"), lines.join("\n") + "\n");
  console.log(`${frames.length} frames, 4 stills in ${out}`);
  await browser.close();
};

main().catch((e: unknown) => {
  console.error("ERR", e instanceof Error ? e.message : e);
  process.exit(1);
});
