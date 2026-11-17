---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "3b41047b-5547-7017-b3fc-08571f47ca03"
dg_type: "Issue"
dg_name: "L-037"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 152
data: {"id": "L-037", "category": "L", "priority": "P3", "ref": "companion/TRUSOMA_JEPA_REFERENCES.csv", "item": "JEPA learner sources are not in the c1m paper register: K14 is one block with no per-constant cids, and predictive_net is not on the c1m branch", "why": "The register is generated from the append-only constant_sources.jsonl, so its CSVs cannot be hand-edited; the sources are listed in the engine-tree reference table meanwhile", "resolve": "When the learner reaches c1m or the merge, give K14 per-constant cids through the source log and rebuild the register", "status": "verified", "evidence": "16 of 17 learner settings have a paper, locator and verbatim quote in global_config.json, checked against the saved text by batch_2026-11-04/learner_sources.py, and in the master database; MS_PER_S is a unit conversion", "touched": "2026-11-04", "note": ""}
---

JEPA learner sources are not in the c1m paper register: K14 is one block with no per-constant cids, and predictive_net is not on the c1m branch.

Why it matters: The register is generated from the append-only constant_sources.jsonl, so its CSVs cannot be hand-edited; the sources are listed in the engine-tree reference table meanwhile.

To resolve: When the learner reaches c1m or the merge, give K14 per-constant cids through the source log and rebuild the register.

Status: verified; priority: P3; category: L.

Evidence so far: 16 of 17 learner settings have a paper, locator and verbatim quote in global_config.json, checked against the saved text by batch_2026-11-04/learner_sources.py, and in the master database; MS_PER_S is a unit conversion.
