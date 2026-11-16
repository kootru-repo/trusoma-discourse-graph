---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "a73c73af-96bf-7e73-9fc2-5d8faf26a559"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 160
data: {"id": "C-007", "category": "C", "priority": "P1", "ref": "tools/trusoma/brain/predictive_net.py lines 8-15, 50; .claude/hooks/brain_guard.py; c1m companion/source_audit", "item": "USER rule 2026-11-03: sourced values must not be in code; they live in global configuration with a sourcing DB reference, and all settings and method sourcing are stored in the DB. Today the learner holds K14 literals inline, no global configuration file was found, the learner's sources and the relay papers are not in the c1m paper register, and brain_guard enforces inline cid tags", "why": "Sourcing recorded only in Markdown and CSV breaks the rule; the learner has no file access after the isolation guard, so configuration must load before it; guard and gate changes need the USER's unlock (GATE_UNLOCK is dated 2026-10-29)", "resolve": "Confirm the DB, then register papers and per-constant cids (also L-037), add the configuration, read values from it, and update the guard under an unlock", "status": "verified", "evidence": "f1bb339: every value key the code reads is in global_config.json or other_config.json and the master database (1,995 keys, none missing, none unused); provenance_check refuses literals and named values in brain code; K1-K4 and the full gate pass; the code with values put back equals the c1m source except the intended load_values change; harness and viewer settings in tools/tools_config.json", "touched": "2026-11-03", "note": ""}
---
