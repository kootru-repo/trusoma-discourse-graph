---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "fb365f7d-7c8d-7ac4-b666-57ab4fced38b"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 166
data: {"id": "C-013", "category": "C", "priority": "P3", "ref": "tools/trusoma/brain/audit.py", "item": "audit.registry reads the registry from global_config.json, and the registry moved to other_config.json on 2026-11-04; no caller, so it would fail only if called", "why": "", "resolve": "Point it at OTHER_CONFIG or remove it", "status": "open", "evidence": "", "touched": "2026-11-04", "note": "No caller, so low priority."}
---
