---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "4a8f8c67-400d-7b59-bd67-535ef553db10"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 81
data: {"id": "K-012", "category": "K", "priority": "P4", "ref": "constants_audit.csv, file=map_readout.py", "item": "16 unsourced constants in map_readout.py (model-choice 16, cannot-source 0, unresearched 0); the rest are sourced", "why": "model-choice values need a declared rationale or a measurement; cannot-source values need a source or a declared status", "resolve": "Work through the rows of this file in constants_audit.csv (filter file and status); update status/source/verified there, then close this batch", "status": "declared", "evidence": "constants_audit_c1m.csv: all 16 unsourced constants in map_readout.py are classified model-choice; checked 2026-10-29", "touched": "2026-10-29", "note": ""}
---
