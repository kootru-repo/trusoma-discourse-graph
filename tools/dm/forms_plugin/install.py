"""Install (or update) the TruSoma entry forms plugin into a vault's Obsidian folder. The plugin's source is TypeScript in demo/apps/forms; this
builds it when the built files are missing or older than the source (pnpm, in the demo workspace: `pnpm install` there once), copies main.js,
manifest.json and styles.css from demo/apps/forms/dist to <vault>/.obsidian/plugins/trusoma-forms and adds "trusoma-forms" to
<vault>/.obsidian/community-plugins.json (the list of enabled plugins; nothing else in it is changed). The Obsidian folder is not committed, so
this is run once per machine and again after the plugin's source changes.
usage: python tools/dm/forms_plugin/install.py [VAULT]   (default: the repository's vault/)"""
import json, pathlib, shutil, subprocess, sys

REPO = pathlib.Path(__file__).resolve().parent.parent.parent.parent
APP = REPO / "demo" / "apps" / "forms"
DIST = APP / "dist"
FILES = ("main.js", "manifest.json", "styles.css")


def stale():
    """the built files are missing, or a source file is newer than the built main.js"""
    if not all((DIST / f).exists() for f in FILES):
        return True
    built = (DIST / "main.js").stat().st_mtime
    source = [APP / "manifest.json", APP / "styles.css", APP / "package.json", *(APP / "src").rglob("*.ts"), *(APP / "scripts").rglob("*.ts")]
    return any(p.stat().st_mtime > built for p in source)


def build():
    pnpm = shutil.which("pnpm")
    if not pnpm:
        print("the plugin is not built and pnpm was not found: install Node and pnpm, run `pnpm install` in demo/, then run this again")
        return False
    done = subprocess.run([pnpm, "run", "build"], cwd=APP)
    if done.returncode:
        print("the build failed (if packages are missing: `pnpm install` in demo/)")
    return done.returncode == 0


def main():
    vault = pathlib.Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else REPO / "vault"
    if stale() and not build():
        return 1
    dst = vault / ".obsidian" / "plugins" / "trusoma-forms"
    dst.mkdir(parents=True, exist_ok=True)
    for f in FILES:
        shutil.copyfile(DIST / f, dst / f)
    listed = vault / ".obsidian" / "community-plugins.json"
    on = json.loads(listed.read_text(encoding="utf-8")) if listed.exists() else []
    if "trusoma-forms" not in on:
        listed.write_text(json.dumps(on + ["trusoma-forms"], indent=2), encoding="utf-8")
    data = dst / "data.json"   # the plugin's settings: the Python that ran this install, so the forms do not depend on what a plain launch of Obsidian finds first
    if not data.exists():
        data.write_text(json.dumps({"python": sys.executable}, indent=2), encoding="utf-8")
    print("installed in", dst, "(restart Obsidian or reload the plugin to see a change)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
