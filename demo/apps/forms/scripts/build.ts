/**
 * Build the plugin the way the Discourse Graphs Obsidian plugin is built (apps/obsidian/scripts/compile.ts): esbuild bundles
 * src/index.ts into one CommonJS main.js, and manifest.json and styles.css are copied beside it.
 * One difference, on purpose: this plugin is desktop only (it runs the vault's Python check as a child process), so the Node
 * builtins it uses stay external. The upstream plugin runs on mobile and keeps them out.
 * usage: tsx scripts/build.ts                 one build into dist/
 *        tsx scripts/build.ts --mirror DIR    build, then copy the three files into DIR (a vault's plugin folder)
 */
import esbuild from "esbuild";
import fs from "node:fs";
import { builtinModules } from "node:module";
import path from "node:path";

const root = fs.realpathSync(process.cwd());
const outdir = path.join(root, "dist");
const isProd = process.env.NODE_ENV === "production";
const FILES_INCLUDED = ["manifest.json", "styles.css"];

const mirrorTo = (): string | undefined => {
  const at = process.argv.indexOf("--mirror");
  return at > 0 ? process.argv[at + 1] : undefined;
};

const build = async (): Promise<void> => {
  fs.mkdirSync(outdir, { recursive: true });
  await esbuild.build({
    absWorkingDir: root,
    entryPoints: [path.join("src", "index.ts")],
    outfile: path.join(outdir, "main.js"),
    bundle: true,
    format: "cjs",
    platform: "node",
    target: "es2018",
    external: ["obsidian", "electron", ...builtinModules],
    sourcemap: isProd ? undefined : "inline",
    minify: isProd,
    logLevel: "info",
  });
  for (const file of FILES_INCLUDED) {
    fs.cpSync(path.join(root, file), path.join(outdir, file));
  }
  const mirror = mirrorTo();
  if (mirror) {
    fs.mkdirSync(mirror, { recursive: true });
    for (const file of ["main.js", ...FILES_INCLUDED]) {
      fs.cpSync(path.join(outdir, file), path.join(mirror, file));
    }
    console.log(`mirrored to ${mirror}`);
  }
};

build().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
