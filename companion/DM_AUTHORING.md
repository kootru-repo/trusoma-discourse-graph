# Authoring values and sources after the vault cutover (2026-11-15)

The Obsidian vault `vault/` (Discourse Graphs notes) is the only authored source of values, their sourcing, the paper register, link rows, method and join records, the audit log and the classifier tables. These files are GENERATED, never edited by hand: global_config.json, other_config.json, paper_links.csv, paper_register.csv, nonbrain_audit_log.csv, sourcing_records.jsonl, source_basis.csv, unsourced_kind.csv, declared_values.csv, sculpt_measures.csv, the two growth sources files, equations.jsonl, body_provenance_12p5_required.json, growth_web_12p5.json, tools_config.json, constant_overrides.json, TRUSOMA_JEPA_REFERENCES.csv, and the databases. Not generated: the frozen constant log (vault/Meta/Frozen.md), the appendix [V] lines and the {cid:} code tags (committed by hand).

Commands (all in tools/dm; each writes vault notes, rebuilds relations.json, regenerates every file and runs the check):
- `python tools/dm/value_add.py value --key K --target global|other --value JSON --entries Q12 --state "..." --status S [--meaning ..] [--paper P --locator L --quote Q --value-in-source V --species-age S --transfer T]`
- `value_add.py learner --module M --name N --value JSON --entries K18 --note "{cid: K18} [K18] unit; rule PA2" --status S --paper P --locator L --quote Q --cls human_fetal|... --species ... --stage prenatal|...`
- `value_add.py set --key K [--value JSON] [--status S] [--meaning ..] [--state ..] [--entries a,b]` (a changed status or meaning of a constant that is in the frozen log is also written as an override)
- `value_add.py evidence --key K --paper P --locator L --quote Q ...`; `paper --id p-x --first-author .. --year .. --citation ..`; `basis --species-age TEXT --kind .. --species .. --stage ..`; `record --json '{...}'`
- Audit items: `python companion/audit_log/audit_log.py set|add ...` (writes the Issue note, regenerates the CSV).
- By hand in Obsidian or an editor: edit the note, then `python tools/dm/build_from_vault.py write` and `python tools/dm/check_all.py`.

Then put the {cid: ...} tag the tool prints on the consumer line and commit (the appendix's learner value table is a generated block since 2026-11-15, plan section 19; a hand-written reading note above the block is optional and, when present, is compared with the vault). The pre-commit build (build_sourcing_db.py --check) refuses a commit whose generated files differ from the vault, so a hand edit of a generated file fails there.

Rules that did not change: no value in code, a db reference per value, a source-found status needs a verbatim quote, locator and paper, no adult values, a new constant needs an appendix [V] entry read FIRST, provenance_check and the isolation guard.

Rollback: `git tag pre-dm-cutover` (the tree before the cutover); the retired value tools run only with TRUSOMA_LEGACY_VALUE_TOOLS=1 on that tree.

Note names: '#' in a key is written '~' in the note name (a '#' in a wiki-link is a heading); the Claim's key property keeps the real key.

## Added 2026-11-15 (plan sections 18 and 19)
- The 10-17 week window (window_config_10_17.json and companion/source_audit/window_10_17/) is generated too: edit the Record notes `REC - wcfg ...`, `wlog`, `wlinks`, `wreg`, `wrec` in vault/Tables, then `python tools/dm/build_from_vault.py write`.
- Probe record: `python tools/dm/value_add.py discourse --kind Result --name "..." --record companion/FILE.md --quote "verbatim text from that file" --prop reading='"no-signal"' --prop counted=false --prop experiment='"[[EXP - ...]]"'` (kinds Question, Hypothesis, Experiment, Result; link properties question, hypotheses, experiment, supports, opposes, consistent_with, informed_by, issues; the table is EDGE_RULES in tools/dm/dmlib.py). A quote that is not in the record file is refused; a discourse note never carries a value; failed readings are entered like passes.
- A relation drawn in Obsidian: `python tools/dm/ingest_gui.py` (report), then `apply`; without it the commit check refuses the drawn relation.
- Tests: `python tools/dm/test_semantic.py` (20 cases, a minute), `python tools/dm/test_single_source.py tamper|clone|mutate` (mutate takes several minutes).
