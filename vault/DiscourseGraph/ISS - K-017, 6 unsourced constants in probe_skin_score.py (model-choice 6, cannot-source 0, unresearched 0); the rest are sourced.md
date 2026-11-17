---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "913156af-2e14-70ff-b1bd-60ed3706bf85"
dg_type: "Issue"
dg_name: "K-017"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 86
data: {"id": "K-017", "category": "K", "priority": "P4", "ref": "constants_audit.csv, file=probe_skin_score.py", "item": "6 unsourced constants in probe_skin_score.py (model-choice 6, cannot-source 0, unresearched 0); the rest are sourced", "why": "model-choice values need a declared rationale or a measurement; cannot-source values need a source or a declared status", "resolve": "Work through the rows of this file in constants_audit.csv (filter file and status); update status/source/verified there, then close this batch", "status": "declared", "evidence": "constants_audit_c1m.csv: all 6 unsourced constants in probe_skin_score.py are classified model-choice (declared design choices; 0 cannot-source, 0 unresearched); checked 2026-10-29", "touched": "2026-10-29", "note": ""}
---

6 unsourced constants in probe_skin_score.py (model-choice 6, cannot-source 0, unresearched 0); the rest are sourced.

Why it matters: model-choice values need a declared rationale or a measurement; cannot-source values need a source or a declared status.

To resolve: Work through the rows of this file in constants_audit.csv (filter file and status); update status/source/verified there, then close this batch.

Status: declared; priority: P4; category: K.

Evidence so far: constants_audit_c1m.csv: all 6 unsourced constants in probe_skin_score.py are classified model-choice (declared design choices; 0 cannot-source, 0 unresearched); checked 2026-10-29.
