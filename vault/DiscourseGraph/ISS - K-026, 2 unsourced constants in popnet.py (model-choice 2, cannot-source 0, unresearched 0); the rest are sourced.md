---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "59782af7-a2ba-7ea4-abc1-921d2f3e413f"
dg_type: "Issue"
dg_name: "K-026"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 95
data: {"id": "K-026", "category": "K", "priority": "P2", "ref": "constants_audit.csv, file=popnet.py", "item": "2 unsourced constants in popnet.py (model-choice 2, cannot-source 0, unresearched 0); the rest are sourced", "why": "model-choice values need a declared rationale or a measurement; cannot-source values need a source or a declared status", "resolve": "Work through the rows of this file in constants_audit.csv (filter file and status); update status/source/verified there, then close this batch", "status": "declared", "evidence": "constants_audit_c1m.csv: all 2 unsourced constants in popnet.py are classified model-choice (declared design choices; 0 cannot-source, 0 unresearched); checked 2026-10-29", "touched": "2026-10-29", "note": ""}
---

2 unsourced constants in popnet.py (model-choice 2, cannot-source 0, unresearched 0); the rest are sourced.

Why it matters: model-choice values need a declared rationale or a measurement; cannot-source values need a source or a declared status.

To resolve: Work through the rows of this file in constants_audit.csv (filter file and status); update status/source/verified there, then close this batch.

Status: declared; priority: P2; category: K.

Evidence so far: constants_audit_c1m.csv: all 2 unsourced constants in popnet.py are classified model-choice (declared design choices; 0 cannot-source, 0 unresearched); checked 2026-10-29.
