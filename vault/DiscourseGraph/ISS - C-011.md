---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "b3ad844d-585a-7e59-a261-850bd6be20bc"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 164
data: {"id": "C-011", "category": "C", "priority": "P3", "ref": "companion/source_audit/VALUES_AUDIT_2026-11-03.md", "item": "231 global configuration keys are read only by modules outside the import closure of the latest roots, labelled current; listed in gap 3 of the report; scope trace from 2026-10-29", "why": "USER 2026-11-03: the global configuration reflects only the latest brain and body", "resolve": "Refresh the scope trace; move what is not latest to the other configuration or remove it", "status": "verified", "evidence": "Rerun audit: 0 global keys read only outside the closure; 55 keys moved to other_config by readers and a fresh trace", "touched": "2026-11-03", "note": "Brain modules untraced; the trace is one short world run"}
---
