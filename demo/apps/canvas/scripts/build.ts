/**
 * Build the canvas the way the Discourse Graphs Obsidian plugin is built (apps/obsidian/scripts/compile.ts):
 * esbuild bundles the entry, and the root styles.css goes through postcss with Tailwind and autoprefixer.
 * usage: tsx scripts/build.ts            one build into dist/
 *        tsx scripts/build.ts --serve    build, then serve dist/ on http://localhost:4173 and rebuild on change
 */
import autoprefixer from "autoprefixer";
import esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import tailwindcss from "tailwindcss";

const PORT = 4173;
const root = fs.realpathSync(process.cwd());
const outdir = path.join(root, "dist");
const isProd = process.env.NODE_ENV === "production";

const buildStyles = async (): Promise<void> => {
  const from = path.join(root, "styles.css");
  const to = path.join(outdir, "styles.css");
  const result = await postcss([
    tailwindcss(path.join(root, "tailwind.config.ts")),
    autoprefixer(),
  ]).process(fs.readFileSync(from, "utf8"), { from, to });
  fs.writeFileSync(to, result.css);
};

const copyStaticFiles = (): void => {
  fs.cpSync(path.join(root, "index.html"), path.join(outdir, "index.html"));
  fs.cpSync(path.join(root, "public"), outdir, { recursive: true });
};

const options: esbuild.BuildOptions = {
  absWorkingDir: root,
  entryPoints: [path.join("src", "main.tsx")],
  outdir,
  bundle: true,
  format: "esm",
  platform: "browser",
  jsx: "automatic",
  sourcemap: isProd ? undefined : "linked",
  minify: isProd,
  entryNames: "main",
  define: { "process.env.NODE_ENV": isProd ? '"production"' : '"development"' },
  loader: { ".woff2": "file", ".woff": "file", ".svg": "file", ".png": "file" },
  plugins: [
    {
      name: "stylesAndStaticFiles",
      setup: (build): void => {
        build.onEnd(async (result) => {
          await buildStyles();
          copyStaticFiles();
          console.log(`built with ${result.errors.length} errors`);
        });
      },
    },
  ],
};

fs.mkdirSync(outdir, { recursive: true });
if (process.argv.includes("--serve")) {
  const context = await esbuild.context(options);
  await context.watch();
  await context.serve({ servedir: outdir, port: PORT });
  console.log(`http://localhost:${PORT}`);
} else {
  await esbuild.build(options);
}
