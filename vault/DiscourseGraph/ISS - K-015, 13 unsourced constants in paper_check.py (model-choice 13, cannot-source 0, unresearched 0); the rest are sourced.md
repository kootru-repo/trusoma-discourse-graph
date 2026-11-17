---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "fbea056b-15f5-7847-9a17-9f79659ceffe"
dg_type: "Issue"
dg_name: "K-015"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 84
data: {"id": "K-015", "category": "K", "priority": "P4", "ref": "constants_audit.csv, file=paper_check.py", "item": "13 unsourced constants in paper_check.py (model-choice 13, cannot-source 0, unresearched 0); the rest are sourced", "why": "model-choice values need a declared rationale or a measurement; cannot-source values need a source or a declared status", "resolve": "Work through the rows of this file in constants_audit.csv (filter file and status); update status/source/verified there, then close this batch", "status": "declared", "evidence": "constants_audit_c1m.csv: all 13 unsourced constants in paper_check.py are classified model-choice (declared design choices; 0 cannot-source, 0 unresearched); checked 2026-10-29", "touched": "2026-10-29", "note": ""}
---

13 unsourced constants in paper_check.py (model-choice 13, cannot-source 0, unresearched 0); the rest are sourced.

Why it matters: model-choice values need a declared rationale or a measurement; cannot-source values need a source or a declared status.

To resolve: Work through the rows of this file in constants_audit.csv (filter file and status); update status/source/verified there, then close this batch.

Status: declared; priority: P4; category: K.

Evidence so far: constants_audit_c1m.csv: all 13 unsourced constants in paper_check.py are classified model-choice (declared design choices; 0 cannot-source, 0 unresearched); checked 2026-10-29.
