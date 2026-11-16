/**
 * Is the demo interoperable with, and built on the same software as, the Discourse Graphs repository? One line per item, pass or FAIL.
 * Every item is read from a checkout of DiscourseGraphs/discourse-graph (DG_REPO) and compared with the demo's own files; nothing is asserted from memory.
 * A dependency of the demo that their repository does not have is listed as an exception, never counted as a pass.
 * usage: DG_REPO=/path/to/discourse-graph pnpm run check:upstream
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type Item = { name: string; ok: boolean; detail: string };
type Packages = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  packageManager?: string;
};

const here = dirname(fileURLToPath(import.meta.url));
const demo = resolve(here, "..", "..", "..");
const repo = process.env.DG_REPO;
if (!repo)
  throw new Error(
    "set DG_REPO to a checkout of DiscourseGraphs/discourse-graph",
  );

const read = (...parts: string[]): string =>
  readFileSync(join(...parts), "utf8");
const json = <T>(...parts: string[]): T => JSON.parse(read(...parts)) as T;
const obsidian = (...parts: string[]): string =>
  read(repo, "apps", "obsidian", ...parts);
const canvas = (...parts: string[]): string =>
  obsidian("src", "components", "canvas", ...parts);
const web = (...parts: string[]): string =>
  read(demo, "apps", "canvas", "src", ...parts);

const items: Item[] = [];
const check = ({ name, ok, detail }: Item): void => {
  items.push({ name, ok, detail });
};
const same = ({
  name,
  ours,
  theirs,
}: {
  name: string;
  ours: string;
  theirs: string;
}): void => {
  check({
    name,
    ok: ours === theirs,
    detail: ours === theirs ? ours : `ours ${ours} | theirs ${theirs}`,
  });
};

/** The keys of a `static props = { ... }` block, in order. */
const staticProps = (source: string): string => {
  const block =
    /static (?:override )?props = \{([\s\S]*?)\n {2}\};/.exec(source)?.[1] ??
    "";
  return [...block.matchAll(/^\s*(\.\.\.\w+|\w+)(?=[:,])/gm)]
    .map((m) => m[1])
    .join(" ");
};
const constant = (source: string, name: string): string => {
  return (
    new RegExp(`${name}\\s*=\\s*"([^"]+)"`).exec(
      source.replace(/=\s*\n\s*/g, "= "),
    )?.[1] ?? "(not found)"
  );
};
const catalogVersion = ({
  workspace,
  name,
  section = "catalog",
}: {
  workspace: string;
  name: string;
  section?: string;
}): string => {
  const start = workspace.indexOf(
    section === "catalog" ? "\ncatalog:" : `\n  ${section}:`,
  );
  const line = new RegExp(
    `^\\s+"?${name.replace(/[/@]/g, "\\$&")}"?:\\s*(\\S+)`,
    "m",
  ).exec(workspace.slice(start));
  return line?.[1] ?? "(not found)";
};
const version = (pkg: Packages, name: string): string =>
  pkg.dependencies?.[name] ?? pkg.devDependencies?.[name] ?? "(absent)";

// canvas records
same({
  name: "card shape: props",
  ours: staticProps(web("DiscourseNodeShape.tsx")),
  theirs: staticProps(canvas("shapes", "DiscourseNodeShape.tsx")),
});
same({
  name: "relation shape: props",
  ours: staticProps(web("RelationShape.tsx")),
  theirs: staticProps(canvas("shapes", "DiscourseRelationShape.tsx")),
});
for (const [name, ours, theirs] of [
  [
    "card shape: type",
    web("DiscourseNodeShape.tsx"),
    canvas("shapes", "DiscourseNodeShape.tsx"),
  ],
  [
    "relation shape: type",
    web("RelationShape.tsx"),
    canvas("shapes", "DiscourseRelationShape.tsx"),
  ],
] as const) {
  const type = (source: string): string =>
    /static (?:override )?type = "([^"]+)"/.exec(source)?.[1] ?? "(not found)";
  same({ name, ours: type(ours), theirs: type(theirs) });
}
const theirBinding = canvas("shapes", "DiscourseRelationBinding.tsx");
const ourBinding = web("RelationBinding.ts");
same({
  name: "relation binding: type",
  ours: constant(ourBinding, "RELATION_BINDING_TYPE"),
  theirs:
    /class DiscourseRelationBindingUtil[\s\S]*?static override type = "([^"]+)"/.exec(
      theirBinding,
    )?.[1] ?? "(not found)",
});
check({
  name: "relation binding: tldraw's arrow binding props",
  ok:
    /static override props = arrowBindingProps;/.test(ourBinding) &&
    /static override props = arrowBindingProps;/.test(theirBinding),
  detail: "arrowBindingProps in both",
});
const sequence = (source: string): string =>
  `${/"(com\.discourse-graph[^"]+)"/.exec(source)?.[1]} ${/addSizeAndFontFamily: (\d+)/.exec(source)?.[1]}`;
same({
  name: "card shape: migration sequence and version",
  ours: sequence(web("discourseNodeMigrations.ts")),
  theirs: sequence(canvas("shapes", "discourseNodeMigrations.ts")),
});

// canvas file
const theirConstants = obsidian("src", "constants.ts");
for (const name of [
  "FRONTMATTER_KEY",
  "TLDATA_DELIMITER_START",
  "TLDATA_DELIMITER_END",
  "TLDRAW_VERSION",
]) {
  same({
    name: `canvas file: ${name}`,
    ours: constant(web("canvasFile.ts"), name),
    theirs: constant(theirConstants, name),
  });
}
const theirObsidian = json<Packages & { version: string }>(
  repo,
  "apps",
  "obsidian",
  "package.json",
);
same({
  name: "canvas file: plugin version",
  ours: constant(web("canvasFile.ts"), "PLUGIN_VERSION"),
  theirs: theirObsidian.version,
});
same({
  name: "card link: block reference prefix",
  ours: constant(web("DiscourseNodeShape.tsx"), "BLOCKREF_SRC_PREFIX"),
  theirs: `asset:${constant(canvas("stores", "assetStore.ts"), "ASSET_PREFIX")}`,
});

// software
const workspace = read(repo, "pnpm-workspace.yaml");
const theirRoot = json<Packages>(repo, "package.json");
const ourServer = json<Packages>(demo, "packages", "graph", "package.json");
const ourRoot = json<Packages>(demo, "package.json");
const ourWeb = json<Packages>(demo, "apps", "canvas", "package.json");
same({
  name: "package manager",
  ours: ourRoot.packageManager ?? "(unset)",
  theirs: theirRoot.packageManager ?? "(unset)",
});
same({
  name: "workspace: turbo",
  ours: version(ourRoot, "turbo"),
  theirs: version(theirRoot, "turbo"),
});
const globs = (source: string): string =>
  [...source.matchAll(/^ {2}- ((?:packages|apps)\/\*)$/gm)]
    .map((m) => m[1])
    .join(" ");
same({
  name: "workspace: package folders",
  ours: globs(read(demo, "pnpm-workspace.yaml")),
  theirs: globs(workspace),
});
same({
  name: "canvas: tldraw",
  ours: version(ourWeb, "tldraw"),
  theirs: version(theirObsidian, "tldraw"),
});
same({
  name: "canvas: react",
  ours: version(ourWeb, "react"),
  theirs: catalogVersion({ workspace, name: "react", section: "obsidian" }),
});
same({
  name: "canvas: react-dom",
  ours: version(ourWeb, "react-dom"),
  theirs: catalogVersion({ workspace, name: "react-dom", section: "obsidian" }),
});
same({
  name: "canvas: typescript",
  ours: version(ourWeb, "typescript"),
  theirs: version(theirObsidian, "typescript"),
});
same({
  name: "canvas: tailwindcss",
  ours: version(ourWeb, "tailwindcss"),
  theirs: version(theirObsidian, "tailwindcss"),
});
same({
  name: "canvas: bundler esbuild",
  ours: version(ourWeb, "esbuild"),
  theirs: version(theirObsidian, "esbuild"),
});
same({
  name: "canvas: eslint",
  ours: version(ourWeb, "eslint"),
  theirs: catalogVersion({ workspace, name: "eslint" }),
});
same({
  name: "server: @supabase/supabase-js",
  ours: version(ourServer, "@supabase/supabase-js"),
  theirs: catalogVersion({ workspace, name: "@supabase/supabase-js" }),
});
same({
  name: "server: zod",
  ours: version(ourServer, "zod"),
  theirs: version(theirObsidian, "zod"),
});
same({
  name: "server: vitest",
  ours: version(ourServer, "vitest"),
  theirs: catalogVersion({ workspace, name: "vitest" }),
});
same({
  name: "server: typescript",
  ours: version(ourServer, "typescript"),
  theirs: version(theirObsidian, "typescript"),
});
same({
  name: "server: tsx",
  ours: version(ourServer, "tsx"),
  theirs: version(theirObsidian, "tsx"),
});
same({
  name: "server: yaml",
  ours: version(ourServer, "yaml"),
  theirs: version(theirObsidian, "yaml"),
});
same({
  name: "server: eslint",
  ours: version(ourServer, "eslint"),
  theirs: catalogVersion({ workspace, name: "eslint" }),
});

for (const file of ["base.js", "react-internal.js"]) {
  const identical =
    read(demo, "packages", "eslint-config", file) ===
    read(repo, "packages", "eslint-config", file);
  check({
    name: `eslint preset: ${file}`,
    ok: identical,
    detail: identical
      ? "identical to theirs"
      : "differs from packages/eslint-config",
  });
}
const firstTwoLines = (source: string): string =>
  source.split(/\r?\n/).slice(0, 2).join(" ");
same({
  name: "canvas: root stylesheet through Tailwind",
  ours: firstTwoLines(read(demo, "apps", "canvas", "styles.css")),
  theirs: firstTwoLines(obsidian("styles.css")),
});
for (const dir of ["packages/graph", "apps/canvas", "apps/mcp"]) {
  const run = spawnSync(
    process.execPath,
    [
      join(demo, dir, "node_modules", "eslint", "bin", "eslint.js"),
      ".",
      "--max-warnings",
      "0",
    ],
    { cwd: join(demo, dir), encoding: "utf8" },
  );
  check({
    name: `eslint preset: no warnings in ${dir}/`,
    ok: run.status === 0,
    detail:
      run.status === 0
        ? "0 errors, 0 warnings"
        : (/\d+ problems?.*/.exec(run.stdout)?.[0] ?? "eslint failed"),
  });
  // two rules of their STYLE_GUIDE.md that their preset does not enforce
  const styleGuide = spawnSync(
    process.execPath,
    [
      join(demo, dir, "node_modules", "eslint", "bin", "eslint.js"),
      ".",
      "--max-warnings",
      "0",
      "--rule",
      JSON.stringify({
        "max-params": ["warn", 2],
        "@typescript-eslint/explicit-function-return-type": [
          "warn",
          { allowExpressions: true, allowTypedFunctionExpressions: true },
        ],
      }),
    ],
    { cwd: join(demo, dir), encoding: "utf8" },
  );
  check({
    name: `style guide: explicit return types, named parameters above two, in ${dir}/`,
    ok: styleGuide.status === 0,
    detail:
      styleGuide.status === 0
        ? "no finding"
        : (/\d+ problems?.*/.exec(styleGuide.stdout)?.[0] ?? "eslint failed"),
  });
}
const formatted = spawnSync(
  process.execPath,
  [
    join(demo, "node_modules", "prettier", "bin", "prettier.cjs"),
    "--check",
    "**/*.{js,mjs,ts,tsx,md,mdx}",
  ],
  { cwd: demo, encoding: "utf8" },
);
check({
  name: "style guide: formatted by Prettier with their configuration",
  ok: formatted.status === 0,
  detail:
    formatted.status === 0 ? "all files formatted" : "prettier --check fails",
});
const handClasses = [
  ...new Set(
    [
      ...read(demo, "apps", "canvas", "styles.css").matchAll(/\.(dg-[\w-]+)/g),
    ].map((m) => m[1]),
  ),
].sort();
const allowed = ["dg-canvas", "dg-scroll", "dg-select"];
check({
  name: "canvas: styled with Tailwind utilities; hand classes only for tldraw's own elements, scrollbar parts and the select arrow",
  ok: handClasses.every((name) => allowed.includes(name ?? "")),
  detail: handClasses.join(" "),
});

// database
const conversion = spawnSync(
  process.execPath,
  [
    join(demo, "packages", "graph", "node_modules", "vitest", "vitest.mjs"),
    "run",
    "test/theirConversion.test.ts",
  ],
  { cwd: join(demo, "packages", "graph"), encoding: "utf8" },
);
check({
  name: "database: rows equal their plugin's own conversion, run from their source",
  ok: conversion.status === 0,
  detail:
    conversion.status === 0
      ? "every row deep-equal, same order; relations.json passes their file check"
      : "test/theirConversion.test.ts fails",
});
// the record of the last hosted load: the local one if this computer made it, else the committed copy (counts only, no key)
const hosted = [
  join(demo, "..", "local", "hosted_load.json"),
  join(demo, "docs", "hosted-load.json"),
].find((file) => existsSync(file));
const load = hosted
  ? json<{
      ok: boolean;
      rows: number;
      expected: number;
      at?: string;
      role?: string;
      edgeFunctions?: Record<string, string>;
    }>(hosted)
  : null;
check({
  name: "database: vault loaded into a hosted Supabase through their upsert_concepts",
  ok: Boolean(load?.ok),
  detail: load
    ? `${load.rows} of ${load.expected} rows, recorded run of ${(load.at ?? "").slice(0, 10)}`
    : "no record: run pnpm run db:hosted",
});
check({
  name: "database: loaded as a signed-in member of the space, under row-level security",
  ok: Boolean(load?.ok && load.role?.startsWith("space member")),
  detail: load?.role ?? "no role in the record",
});
check({
  name: "database: their two edge functions are deployed and answer",
  ok: Boolean(
    load?.ok &&
    load.edgeFunctions?.["create-space"] &&
    load.edgeFunctions["create-group"]?.startsWith("401"),
  ),
  detail: load?.edgeFunctions
    ? `create-space ${load.edgeFunctions["create-space"]}; create-group refuses an anonymous caller (${load.edgeFunctions["create-group"]})`
    : "no edge function record",
});

// what the demo uses that their repository does not have
const theirs = new Set<string>(
  Object.keys({ ...theirRoot.dependencies, ...theirRoot.devDependencies }),
);
for (const dir of ["apps", "packages"]) {
  for (const name of [
    "obsidian",
    "roam",
    "website",
    "tldraw-sync-worker",
    "database",
    "ui",
    "utils",
    "content-model",
    "eslint-config",
    "tailwind-config",
    "typescript-config",
  ]) {
    const file = join(repo, dir, name, "package.json");
    if (!existsSync(file)) continue;
    const pkg = json<Packages>(file);
    for (const dep of Object.keys({
      ...pkg.dependencies,
      ...pkg.devDependencies,
    }))
      theirs.add(dep);
  }
}
const exceptions = [ourRoot, ourServer, ourWeb]
  .flatMap((pkg) =>
    Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }),
  )
  .filter((dep) => !theirs.has(dep) && !dep.startsWith("@repo/"));

for (const item of items)
  console.log(`${item.ok ? "pass" : "FAIL"}  ${item.name}: ${item.detail}`);
console.log(
  `not in their repository (exceptions, each needs a reason in the README): ${[...new Set(exceptions)].join(", ") || "none"}`,
);
// the MCP server is its own package (apps/mcp): an addition outside their stack, named here and not part of the answer below
const ourMcp = json<Packages>(demo, "apps", "mcp", "package.json");
const additions = Object.keys({
  ...ourMcp.dependencies,
  ...ourMcp.devDependencies,
}).filter((dep) => !theirs.has(dep) && !dep.startsWith("@repo/"));
console.log(
  `named addition outside their stack, in its own package apps/mcp: ${additions.join(", ") || "none"}`,
);
const failed = items.filter((item) => !item.ok).length;
const yes = failed === 0 && exceptions.length === 0;
console.log(
  `${items.length - failed} of ${items.length} items pass; ${new Set(exceptions).size} exceptions`,
);
console.log(
  `Completely interoperable and on the upstream software: ${yes ? "YES" : "NO"}`,
);
process.exit(yes ? 0 : 1);
