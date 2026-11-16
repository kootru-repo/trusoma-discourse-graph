---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "14d46702-fc56-7c5a-ac77-3e37ee57017d"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 94
data: {"id": "K-025", "category": "K", "priority": "P2", "ref": "constants_audit.csv, file=brainstem_s2c.py", "item": "2 unsourced constants in brainstem_s2c.py (model-choice 2, cannot-source 0, unresearched 0); the rest are sourced", "why": "model-choice values need a declared rationale or a measurement; cannot-source values need a source or a declared status", "resolve": "Work through the rows of this file in constants_audit.csv (filter file and status); update status/source/verified there, then close this batch", "status": "declared", "evidence": "constants_audit_c1m.csv: all 5 unsourced constants in brainstem_s2c.py are classified model-choice (declared design choices; 0 cannot-source, 0 unresearched); checked 2026-10-29", "touched": "2026-10-29", "note": ""}
---
