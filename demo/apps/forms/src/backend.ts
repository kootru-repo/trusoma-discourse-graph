/* The one way out of the plugin: a request to the vault's own Python tool (tools/dm/form_api.py), one JSON request on its standard input and
   one JSON answer on its standard output. Every rule about the graph lives in that tool; the types here only name what it answers. */
import { spawn } from "child_process";
import path from "path";
import type { Component } from "obsidian";

export type Note = { title: string; link: string };
export type Experiment = Note & { record?: string; hypotheses?: string[] };
export type ResultNote = Note & { reading: string; record: string };
export type DraftHints = {
  claim_from_result?: string;
  claim_addresses?: string;
};
export type Draft = {
  draft: string;
  sentence: string;
  more: number;
  kind: string;
  hints?: DraftHints;
};
export type ValueItem = {
  key: string;
  value: unknown;
  status: string;
  meaning?: string;
};
export type Paper = { id: string; title: string };

export type Lists = {
  experiments: Experiment[];
  hypotheses: Note[];
  results: ResultNote[];
  questions: Note[];
  records: string[];
  readings: string[];
  against_readings: string[];
  drafts: Draft[];
  statuses: string[];
  passage_statuses: string[];
  error?: string;
};

export type FieldError = { field: string; message: string };
export type ValueState = {
  value?: unknown;
  status?: string;
  meaning?: string;
  evidence?: unknown;
};

/* what a check or a save answers: for a note its title, text and relations; for a value its state before and after and what reads it */
export type Answer = {
  error?: string;
  ok?: boolean;
  errors?: FieldError[];
  title?: string;
  body?: string;
  relations?: string[];
  before?: ValueState;
  after?: ValueState;
  impact?: string[];
};

export type QuoteAnswer = {
  found: boolean;
  exists: boolean;
  line?: number;
  count?: number;
  closest?: string;
  closest_line?: number;
};
export type RecordLine = { line: number; text: string };
export type RecordAnswer = {
  exists: boolean;
  total: number;
  lines?: RecordLine[];
};
export type ValuesAnswer = { values?: ValueItem[] };
export type PapersAnswer = { papers?: Paper[] };

export type Request = { action: string; [name: string]: unknown };

/* what a form needs of the plugin: the backend, a place to say what was saved, and a component to own rendered Markdown */
export type Host = Component & {
  call: <T>(request: Request) => Promise<T>;
  say: (text: string) => void;
};

type BackendCall = { python: string; root: string; request: Request };

/* a request that only reads is taken to hang past this (a cold disk has taken 34 seconds) and is stopped. A request that writes is never
   stopped: the tool restores the vault itself when its check fails, and stopping it half way would leave that undone. */
const ANSWER_MS = 120000;
const writes = (request: Request): boolean =>
  request.action === "save" ||
  request.action.endsWith("_save") ||
  (request.action === "admit" && !request.dry);

export const callBackend = <T>({
  python,
  root,
  request,
}: BackendCall): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const child = spawn(
      python,
      ["-B", path.join("tools", "dm", "form_api.py")],
      {
        cwd: root,
        env: { ...process.env, PYTHONUTF8: "1" },
        windowsHide: true,
      },
    );
    let out = "";
    let err = "";
    let late = false;
    const timer = writes(request)
      ? undefined
      : setTimeout(() => {
          late = true;
          child.kill();
        }, ANSWER_MS);
    child.stdin.on("error", () => undefined); // a tool that did not start has no input to write to: the error below says so
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      out += chunk;
    });
    child.stderr.on("data", (chunk: string) => {
      err += chunk;
    });
    child.on("error", (e) => {
      clearTimeout(timer);
      reject(
        new Error(
          `could not start ${python} (${e.message}); set the Python command in this plugin's settings`,
        ),
      );
    });
    child.on("close", () => {
      clearTimeout(timer);
      if (late) {
        reject(
          new Error(
            `no answer in ${ANSWER_MS / 1000} seconds; nothing was written`,
          ),
        );
        return;
      }
      try {
        resolve(JSON.parse(out) as T);
      } catch {
        reject(new Error((err || out || "no answer").slice(-300)));
      }
    });
    child.stdin.end(JSON.stringify(request), "utf8");
  });

export const messageOf = (e: unknown): string =>
  e instanceof Error ? e.message : String(e);
