---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "dc05fc31-1f83-7823-ade2-b0cc3a142215"
dg_type: "Issue"
dg_name: "K-029"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 98
data: {"id": "K-029", "category": "K", "priority": "P2", "ref": "constants_audit.csv, file=growth7.py", "item": "1 unsourced constants in growth7.py (model-choice 1, cannot-source 0, unresearched 0); the rest are sourced", "why": "model-choice values need a declared rationale or a measurement; cannot-source values need a source or a declared status", "resolve": "Work through the rows of this file in constants_audit.csv (filter file and status); update status/source/verified there, then close this batch", "status": "declared", "evidence": "constants_audit_c1m.csv: all 2 unsourced constants in growth7.py are classified model-choice (declared design choices; 0 cannot-source, 0 unresearched); checked 2026-10-29", "touched": "2026-10-29", "note": ""}
---

1 unsourced constants in growth7.py (model-choice 1, cannot-source 0, unresearched 0); the rest are sourced.

Why it matters: model-choice values need a declared rationale or a measurement; cannot-source values need a source or a declared status.

To resolve: Work through the rows of this file in constants_audit.csv (filter file and status); update status/source/verified there, then close this batch.

Status: declared; priority: P2; category: K.

Evidence so far: constants_audit_c1m.csv: all 2 unsourced constants in growth7.py are classified model-choice (declared design choices; 0 cannot-source, 0 unresearched); checked 2026-10-29.
