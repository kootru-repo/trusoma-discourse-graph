/**
 * Load the vault into a hosted Supabase project that holds the Discourse Graphs schema (their migrations, pushed with `supabase db push`),
 * the way their Obsidian plugin does it (apps/obsidian/src/utils/supabaseContext.ts, packages/database/src/lib/contextFunctions.ts):
 * their create-space edge function makes the space and its account, the client signs in as that account, create_account_in_space
 * gives the author, and the rows go through upsert_concepts under row-level security. No service-role key is read.
 * local/supabase.env (not in git) holds SUPABASE_URL, SUPABASE_ANON_KEY and SPACE_PASSWORD; the password is made on the first run, as the plugin makes its own.
 * usage: pnpm run db:hosted
 */
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { toLocalConcepts } from "../src/dgExport.js";
import { loadVault } from "../src/vault.js";

const SPACE = {
  url: "obsidian:trusoma-demo",
  name: "TruSoma",
  platform: "Obsidian",
} as const;
const ACCOUNT = { localId: "trusoma-demo-loader", name: "TruSoma" };
const ROLE =
  "space member (their create-space function, signed in as the space account)";
const BATCH = 250;
const CLAIM_HANDLE = "CLM - phase1_substrate.NMDA_SHARE_E16"; // the stable handle; the file's title is derived from the note's properties

type Tally = { ok: number; conflict: number; error: number };
type Counts = {
  schemas: number;
  instances: number;
  relations: number;
  total: number;
};

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(
  process.env.TRUSOMA_ROOT ?? resolve(here, "..", "..", "..", ".."),
);
const envFile = join(root, "local", "supabase.env");

const readEnv = (file: string): Record<string, string> => {
  const pairs = readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.includes("="))
    .map(
      (line) =>
        [
          line.slice(0, line.indexOf("=")),
          line.slice(line.indexOf("=") + 1),
        ] as const,
    );
  return Object.fromEntries(pairs);
};

const env = readEnv(envFile);
const url = env.SUPABASE_URL;
const anonKey = env.SUPABASE_ANON_KEY;
if (!url || !anonKey)
  throw new Error(
    "local/supabase.env needs SUPABASE_URL and SUPABASE_ANON_KEY",
  );

const spacePassword = (): string => {
  if (env.SPACE_PASSWORD) return env.SPACE_PASSWORD;
  const password = randomUUID();
  appendFileSync(envFile, `\nSPACE_PASSWORD=${password}\n`);
  return password;
};

const options = { auth: { persistSession: false } };
const supabase = createClient(url, anonKey, options);
const notSignedIn = createClient(url, anonKey, options);

/** The space, through their edge function; then a client signed in as the space's own account. */
const signInToSpace = async (): Promise<number> => {
  const password = spacePassword();
  const made = await supabase.functions.invoke<{ id: number }>("create-space", {
    body: { ...SPACE, password },
  });
  if (!made.data)
    throw new Error(
      `create-space: ${made.error instanceof Error ? made.error.message : "no data"}`,
    );
  const spaceId = made.data.id;
  const email = `${SPACE.platform.toLowerCase()}-${spaceId}-anon@database.discoursegraphs.com`;
  const signedIn = await supabase.auth.signInWithPassword({ email, password });
  if (signedIn.error)
    throw new Error(`sign in to the space: ${signedIn.error.message}`);
  return spaceId;
};

const spaceId = await signInToSpace();

const authorId = async (): Promise<number> => {
  const result = await supabase.rpc("create_account_in_space", {
    space_id_: spaceId,
    account_local_id_: ACCOUNT.localId,
    name_: ACCOUNT.name,
    email_: undefined,
  });
  if (result.error)
    throw new Error(`create_account_in_space: ${result.error.message}`);
  return result.data as number;
};

const loadConcepts = async (concepts: unknown[]): Promise<Tally> => {
  const tally: Tally = { ok: 0, conflict: 0, error: 0 };
  for (let i = 0; i < concepts.length; i += BATCH) {
    const result = await supabase.rpc("upsert_concepts", {
      v_space_id: spaceId,
      data: concepts.slice(i, i + BATCH),
    });
    const error = result.error;
    const data = result.data as number[];
    if (error) throw new Error(`upsert_concepts at ${i}: ${error.message}`);
    for (const id of data)
      tally[id === -1 ? "conflict" : id === -2 ? "error" : "ok"] += 1;
  }
  return tally;
};

const countRows = async (): Promise<Counts> => {
  const count = async (filter: {
    is_schema?: boolean;
    is_relation?: boolean;
  }): Promise<number> => {
    let query = supabase
      .from("Concept")
      .select("id", { count: "exact", head: true })
      .eq("space_id", spaceId);
    for (const [column, value] of Object.entries(filter))
      query = query.eq(column, value);
    const { count: n, error } = await query;
    if (error) throw new Error(`Concept count: ${error.message}`);
    return n ?? 0;
  };
  return {
    schemas: await count({ is_schema: true }),
    instances: await count({ is_schema: false, is_relation: false }),
    relations: await count({ is_schema: false, is_relation: true }),
    total: await count({}),
  };
};

const g = loadVault(root);
const claimNote = g.byHandle.get(CLAIM_HANDLE);
if (!claimNote) throw new Error(`no note with the handle ${CLAIM_HANDLE}`);
const CLAIM = `DiscourseGraph/${claimNote.title}.md`;
const created = JSON.parse(
  readFileSync(join(root, "vault", "relations.json"), "utf8"),
) as { relations: Record<string, { created: number }> };
const { concepts, counts } = toLocalConcepts(
  g,
  (id) => created.relations[id]!.created,
);
const author = await authorId();
// their conversion puts the space and the author on every row
const rows = concepts.map((concept) => ({
  ...concept,
  space_id: spaceId,
  author_id: author,
}));

const before = await countRows();
const started = Date.now();
const tally = await loadConcepts(rows);
const after = await countRows();
console.log(
  `space ${spaceId}, author ${author}, as ${ROLE}; rows before ${before.total}; load:`,
  tally,
  `in ${((Date.now() - started) / 1000).toFixed(1)} s`,
);
console.log("Concept rows", after, "expected", {
  instances: counts.instances,
  relations: counts.relations,
  total: concepts.length,
});

const claim = await supabase
  .from("Concept")
  .select("source_local_id, name, literal_content")
  .eq("space_id", spaceId)
  .eq("name", CLAIM)
  .maybeSingle();
if (claim.error) throw new Error(`round trip: ${claim.error.message}`);
const sourceData = (
  claim.data?.literal_content as { source_data?: { value?: unknown } } | null
)?.source_data;
console.log(
  "round trip of one claim:",
  claim.data
    ? { name: (claim.data as { name: string }).name, value: sourceData?.value }
    : "NOT FOUND",
);

const seenByAnon = await notSignedIn
  .from("Concept")
  .select("id", { count: "exact", head: true })
  .eq("space_id", spaceId);
console.log(
  `rows a client that is not signed in can read: ${seenByAnon.count ?? 0} (their policies give none without space access)`,
);

// their other edge function answers with its own refusal to a caller that is not a signed-in person
const groupProbe = await fetch(`${url}/functions/v1/create-group`, {
  method: "POST",
  headers: {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "probe" }),
});
const groupAnswer = `${groupProbe.status} ${((await groupProbe.json()) as { msg?: string }).msg ?? ""}`;
console.log(`create-group without a signed-in person: ${groupAnswer}`);

const ok =
  tally.error === 0 &&
  after.total === concepts.length &&
  Boolean(claim.data) &&
  (seenByAnon.count ?? 0) === 0 &&
  groupAnswer === "401 Unauthorized anonymous access";
// scripts/check-upstream.ts reads this record; it holds counts only, no key
const record =
  JSON.stringify({
    ok,
    rows: after.total,
    expected: concepts.length,
    errors: tally.error,
    role: ROLE,
    edgeFunctions: {
      "create-space": "made the space",
      "create-group": groupAnswer,
    },
    at: new Date().toISOString(),
  }) + "\n";
writeFileSync(join(root, "local", "hosted_load.json"), record);
// the committed copy, read by the check where local/ does not exist
writeFileSync(join(root, "demo", "docs", "hosted-load.json"), record);
console.log(ok ? "HOSTED LOAD OK" : "HOSTED LOAD FAILED");
process.exit(ok ? 0 : 1);
