---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "d58c1073-52a1-74f5-beb7-2a9ab8cdc3bb"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 75
data: {"id": "K-006", "category": "K", "priority": "P1", "ref": "constants_audit.csv, file=cortex_core.py", "item": "41 unsourced constants in cortex_core.py (model-choice 37, cannot-source 2, unresearched 2); the rest are sourced", "why": "model-choice values need a declared rationale or a measurement; cannot-source values need a source or a declared status", "resolve": "Work through the rows of this file in constants_audit.csv (filter file and status); update status/source/verified there, then close this batch", "status": "declared", "evidence": "c1m commit (constants_audit.csv): 34 cortex_core rows given a declared rationale; B_TH and D_RELAY (cannot-source) declared model choices with search record; TAU_LTD note cites He 2015 fit 5.40 s not applied (L-028); SCALING_H checked vs Turrigiano 48 h (K14-1) and set source-found-transfer. 2026-10-30", "touched": "2026-10-30", "note": ""}
---
