// Keyboard test of the entry forms plugin (source: demo/apps/forms, TypeScript) in real Obsidian, on a throw-away copy of the vault in a separate profile (set up as
// obsidian_click_test.cjs describes, plus: python tools/dm/forms_plugin/install.py <copy>/vault). After the trust dialog, every step is done with the
// keyboard alone: the command palette, Tab, typing, Enter, Ctrl+Enter. What it measured goes to <out.json>; screenshots go beside it.
// usage: PLAYWRIGHT_CORE=<path to playwright-core> node forms_click_test.cjs <out.json> <copy root>
const { chromium } = require(process.env.PLAYWRIGHT_CORE || "playwright-core");
const fs = require("fs");
const path = require("path");
const outFile = process.argv[2] || "forms_click_test_run.json";
const copy = process.argv[3];
const shots = path.dirname(outFile);
(async () => {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9333");
  const page = browser.contexts().flatMap((c) => c.pages()).find((p) => p.url().includes("index.html"));
  const out = { consoleErrors: [], pageErrors: [], steps: {} };
  page.on("console", (m) => { if (m.type() === "error") out.consoleErrors.push(m.text().slice(0, 300)); });
  page.on("pageerror", (e) => out.pageErrors.push(String(e).slice(0, 300)));
  const k = page.keyboard;
  const wait = (ms) => page.waitForTimeout(ms);
  const shot = (name) => page.screenshot({ path: path.join(shots, name + ".png") });

  const trust = await page.$("button:has-text('Trust author and enable plugins')");
  if (trust) { await trust.click(); await wait(5000); }
  await k.press("Escape"); await wait(500);
  out.steps.enabled = await page.evaluate(async () => {
    const a = window.app;
    if (!a.plugins.isEnabled()) await a.plugins.setEnable(true);
    for (const id of ["discourse-graphs", "trusoma-forms"]) if (!a.plugins.plugins[id]) await a.plugins.enablePluginAndSave(id);
    await a.plugins.disablePlugin("trusoma-forms"); await a.plugins.enablePlugin("trusoma-forms");   // the plugin's files as they are on disk now
    return Object.keys(a.plugins.plugins);
  });

  const active = () => page.evaluate(() => { const e = document.activeElement; return e ? (e.getAttribute("aria-label") || e.textContent || "").trim() : ""; });
  // Tab until the control with this name holds the focus (a name is the control's aria-label, or a button's text)
  const tabTo = async (name) => {
    // Obsidian puts the focus back on the first field, a moment later, when Tab leaves the form's last button; a person never types inside that moment, a driver can.
    // So a match counts only when it still holds after a short wait.
    for (let i = 0; i < 80; i++) { if ((await active()) === name) { await wait(250); if ((await active()) === name) return true; } await k.press("Tab"); await wait(40); }
    throw new Error("Tab never reached: " + name + " (stopped on: " + (await active()) + ")");
  };
  const command = async (name) => { await k.press("Control+p"); await wait(400); await k.type(name, { delay: 5 }); await wait(500); await k.press("Enter"); };
  const formReady = () => page.waitForSelector(".tsf-modal .tsf-buttons", { timeout: 30000 });
  const pickFrom = async (label, typed) => { await tabTo(label); await k.press("Enter"); await wait(400); await k.type(typed, { delay: 5 }); await wait(1800); await k.press("Enter"); await wait(500); };
  const findLine = async (label, typed) => {
    await tabTo(label + ": find the line in the record"); await k.type(typed, { delay: 5 }); await k.press("Enter");
    await page.waitForSelector(".tsf-lines button", { timeout: 15000 });
    await wait(300); await k.press("Enter"); await wait(1500);   // the first line found holds the focus
  };
  const saved = async () => { await page.waitForSelector(".tsf-modal", { state: "detached", timeout: 60000 }); await page.waitForSelector(".tsf-said:has-text('Saved and checked')", { timeout: 5000 }); await wait(800); };
  const state = () => page.evaluate(() => ({
    errors: [...document.querySelectorAll(".tsf-modal .tsf-error")].map((e) => e.textContent).filter(Boolean),
    summary: (document.querySelector(".tsf-summary") || {}).textContent || "",
    invalid: [...document.querySelectorAll(".tsf-modal [aria-invalid='true']")].map((e) => e.getAttribute("aria-label")),
    focus: (document.activeElement.getAttribute("aria-label") || "").trim(),
    preview: ((document.querySelector(".tsf-preview") || {}).textContent || "").slice(0, 200),
    describedBy: [...document.querySelectorAll(".tsf-modal [aria-invalid='true']")].map((e) => (document.getElementById(e.getAttribute("aria-describedby")) || {}).textContent || ""),
  }));
  // every control of the open form has a name a screen reader can say, and text against its background (WCAG contrast ratio; 7 is the AAA line for body text)
  const audit = () => page.evaluate(() => {
    const lum = (c) => { const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const rgb = (s) => (s.match(/[\d.]+/g) || []).map(Number);
    const bgOf = (e) => { for (; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c.length >= 3 && (c.length < 4 || c[3] > 0.99)) return c; } return [255, 255, 255]; };
    const ratio = (e) => { const f = lum(rgb(getComputedStyle(e).color)), b = lum(bgOf(e)); return Math.round(((Math.max(f, b) + 0.05) / (Math.min(f, b) + 0.05)) * 10) / 10; };
    const m = document.querySelector(".tsf-modal");
    const controls = [...m.querySelectorAll("input, select, textarea, button, [role='switch']")].filter((e) => e.offsetParent !== null);
    const unnamed = controls.filter((e) => !((e.getAttribute("aria-label") || e.textContent || "").trim())).length;
    const small = controls.filter((e) => { const r = e.getBoundingClientRect(); return r.height < 24 || r.width < 24; }).map((e) => (e.getAttribute("aria-label") || e.textContent || e.className).trim().slice(0, 40));
    const pick = (sel) => { const e = [...m.querySelectorAll(sel)].find((x) => x.textContent.trim() && x.offsetParent !== null); return e ? ratio(e) : null; };
    const edge = (e) => { const f = lum(rgb(getComputedStyle(e).borderTopColor)), b = lum(bgOf(e.parentElement)); return Math.round(((Math.max(f, b) + 0.05) / (Math.min(f, b) + 0.05)) * 10) / 10; };
    const fields = [...m.querySelectorAll("input[type='text'], textarea, select, input[type='checkbox']")].filter((e) => e.offsetParent !== null);
    const foot = m.querySelector(".tsf-foot").getBoundingClientRect(), head = m.querySelector(".modal-title").getBoundingClientRect();
    const inView = (r) => r.top >= 0 && r.bottom <= window.innerHeight && r.height > 0;
    return { faintestFieldBorder: Math.min(...fields.map(edge)), buttonsInView: inView(foot), titleInView: inView(head), controls: controls.length, unnamed, smallerThan24px: small, contrast: { label: pick(".setting-item-name"), description: pick(".setting-item-description"), error: pick(".tsf-error"), intro: pick(".tsf-intro"), preview: pick(".tsf-preview pre"), button: pick(".tsf-buttons button") },
      overflowX: m.scrollWidth > m.clientWidth + 1 };
  });
  const exists = (rel) => fs.existsSync(path.join(copy, rel));
  const find = (dir, start) => fs.readdirSync(path.join(copy, dir)).filter((f) => f.startsWith(start));

  // 1. a Result, by keyboard: first a wrong quote (refused at its field), then the line picked from the record
  await command("TruSoma entry forms: Enter a Result"); await formReady();
  await shot("result_empty");
  await tabTo("Short name"); await k.type("forms click test reading");
  await pickFrom("Experiment: choose", "probe 1 existing");
  out.steps.recordFollowsExperiment = await page.evaluate(() => document.querySelector(".tsf-modal select[aria-label='Record file']").value);
  await tabTo("Words of the record"); await k.type("the learner formed a perfect body map on every seed");
  await tabTo("Reading"); await k.type("o"); await wait(500);
  await k.press("Control+Enter"); await wait(4000);
  out.steps.refusedResult = Object.assign(await state(), { noteWritten: exists("vault/DiscourseGraph/RES - forms click test reading.md") });
  out.steps.auditErrorState = await audit();
  await shot("result_refused");
  await tabTo("Words of the record"); await k.press("Control+a"); await k.press("Delete");
  await findLine("Words of the record", "Nothing here counts");
  out.steps.quotePicked = await page.evaluate(() => ({ quote: document.querySelector(".tsf-modal textarea").value, note: document.querySelector(".tsf-note").textContent }));
  await tabTo("Check only"); await k.press("Enter"); await wait(3000);
  out.steps.checkedResult = await state();
  await shot("result_checked");
  await k.press("Control+Enter"); await saved();
  out.steps.savedResult = { noteWritten: exists("vault/DiscourseGraph/RES - forms click test reading.md"), openNote: await page.evaluate(() => (window.app.workspace.getActiveFile() || {}).path) };

  // 2. a question: drafted freely, then admitted
  await command("TruSoma entry forms: New draft"); await wait(2500);
  await k.type("Does the order of neighbours within a surface appear once the learner has grown?"); await k.press("Enter"); await k.press("Enter");
  await k.type("My thought: the raw input holds no order, so any order must come from learning. Not sure yet."); await wait(150);   // no wait for Obsidian's own delayed save: the plugin saves an open draft before the vault tool reads it
  out.steps.draft = find("vault/Drafts", "draft ");
  await command("TruSoma entry forms: Save a draft to the graph"); await formReady();
  await pickFrom("Draft: choose", "order of neighbours");
  await tabTo("Short name"); await k.type("neighbour order after growth");
  await shot("admit_question");
  await k.press("Control+Enter"); await saved();
  const asked = path.join(copy, "companion/audit_log/QUESTIONS_ASKED.md");
  out.steps.admittedQuestion = { note: find("vault/DiscourseGraph", "QUE - Does the order of neighbours"), draftsLeft: find("vault/Drafts", "draft "), line: fs.existsSync(asked) ? fs.readFileSync(asked, "utf8").trim().split("\n").pop() : null };

  // 3. a claim: drafted freely, admitted with a Result for it and a line of that Result's record
  await command("TruSoma entry forms: New draft"); await wait(2500);
  await k.type("Raw touch already tells surfaces apart before any learning"); await k.press("Enter"); await k.press("Enter");
  await k.type("Why I hold this: the partner score sits far above the shuffled one on every seed."); await wait(150);
  await command("TruSoma entry forms: Save a draft to the graph"); await formReady();
  await pickFrom("Draft: choose", "tells surfaces apart");
  await tabTo("Short name"); await k.type("finding, forms click test");
  await k.press("Control+Enter"); await wait(4000);
  out.steps.refusedClaim = await state();
  await pickFrom("Results for the claim: add", "surface identity raw touch");
  out.steps.recordFollowsResult = await page.evaluate(() => document.querySelector(".tsf-modal select[aria-label='Record file']").value);
  await findLine("Words of the record", "same-surface partners");
  await shot("admit_claim");
  out.steps.auditClaimForm = await audit();
  await k.press("Control+Enter"); await saved();
  const claim = find("vault/DiscourseGraph", "CLM - Raw touch already tells");
  out.steps.admittedClaim = { note: claim, notesKept: claim.length ? fs.readFileSync(path.join(copy, "vault/DiscourseGraph", claim[0]), "utf8").includes("## Notes\n\nWhy I hold this") : false, draftsLeft: find("vault/Drafts", "draft ") };

  // 4. a value: one press checks and shows what reads it, nothing is written; then the passage form opens
  await command("TruSoma entry forms: Change a value"); await formReady();
  await pickFrom("Value: choose", "hill_curv");
  await tabTo("New value"); await k.type("0.3");
  await k.press("Control+Enter"); await wait(5000);
  out.steps.valueFirstPress = await page.evaluate(() => ({ status: document.querySelector(".tsf-status").textContent, preview: document.querySelector(".tsf-preview").textContent.slice(0, 260) }));
  await shot("value_checked");
  out.steps.valueButtonAfterCheck = await page.evaluate(() => document.querySelector(".tsf-buttons .mod-cta").textContent);
  await tabTo("New value"); await k.type("1");
  out.steps.valueButtonAfterEdit = await page.evaluate(() => ({ button: document.querySelector(".tsf-buttons .mod-cta").textContent, status: document.querySelector(".tsf-status").textContent }));
  await k.press("Escape"); await wait(400);
  await command("TruSoma entry forms: Enter a passage"); await formReady();
  out.steps.auditPassageForm = await audit();
  await shot("passage_empty");
  await k.press("Escape"); await wait(400);

  // 5. the same Result form in the other theme and in a narrow window (for the judges and the contrast figures)
  for (const [theme, name] of [["moonstone", "light"], ["obsidian", "dark"]]) {
    await page.evaluate((t) => window.app.changeTheme(t), theme); await wait(800);
    await command("TruSoma entry forms: Enter a Result"); await formReady();
    await tabTo("Short name"); await k.type("x [bad name]"); await k.press("Control+Enter"); await wait(3500);
    out.steps["audit_" + name] = await audit();
    await shot("result_" + name);
    if (name === "dark") { await page.setViewportSize({ width: 520, height: 900 }); await wait(800); out.steps.audit_narrow = await audit(); await shot("result_narrow"); }
    await k.press("Escape"); await wait(400);
  }
  fs.writeFileSync(outFile, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})().catch((e) => { console.error("DRIVER ERROR", e.message); process.exit(1); });
