---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "bfbc60f5-91d0-7f09-ac61-7a5606f9abc6"
dg_type: "Issue"
dg_name: "K-021"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 90
data: {"id": "K-021", "category": "K", "priority": "P4", "ref": "constants_audit.csv, file=probe_skin_score_d1.py", "item": "4 unsourced constants in probe_skin_score_d1.py (model-choice 4, cannot-source 0, unresearched 0); the rest are sourced", "why": "model-choice values need a declared rationale or a measurement; cannot-source values need a source or a declared status", "resolve": "Work through the rows of this file in constants_audit.csv (filter file and status); update status/source/verified there, then close this batch", "status": "declared", "evidence": "constants_audit_c1m.csv: all 4 unsourced constants in probe_skin_score_d1.py are classified model-choice (declared design choices; 0 cannot-source, 0 unresearched); checked 2026-10-29", "touched": "2026-10-29", "note": ""}
---

4 unsourced constants in probe_skin_score_d1.py (model-choice 4, cannot-source 0, unresearched 0); the rest are sourced.

Why it matters: model-choice values need a declared rationale or a measurement; cannot-source values need a source or a declared status.

To resolve: Work through the rows of this file in constants_audit.csv (filter file and status); update status/source/verified there, then close this batch.

Status: declared; priority: P4; category: K.

Evidence so far: constants_audit_c1m.csv: all 4 unsourced constants in probe_skin_score_d1.py are classified model-choice (declared design choices; 0 cannot-source, 0 unresearched); checked 2026-10-29.
