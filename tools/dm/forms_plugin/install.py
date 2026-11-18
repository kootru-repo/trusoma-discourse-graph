"""Install (or update) the TruSoma entry forms plugin into a vault's Obsidian folder: copies main.js, manifest.json and styles.css to
<vault>/.obsidian/plugins/trusoma-forms and adds "trusoma-forms" to <vault>/.obsidian/community-plugins.json (the list of enabled plugins; nothing
else in it is changed). The Obsidian folder is not committed, so this is run once per machine and again after the plugin's source changes.
usage: python tools/dm/forms_plugin/install.py [VAULT]   (default: the repository's vault/)"""
import json, pathlib, shutil, sys

HERE = pathlib.Path(__file__).resolve().parent


def main():
    vault = pathlib.Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else HERE.parent.parent.parent / "vault"
    dst = vault / ".obsidian" / "plugins" / "trusoma-forms"
    dst.mkdir(parents=True, exist_ok=True)
    for f in ("main.js", "manifest.json", "styles.css"):
        shutil.copyfile(HERE / f, dst / f)
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
