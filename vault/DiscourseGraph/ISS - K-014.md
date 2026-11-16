---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "96aedb51-b65a-7461-8555-44617789b459"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 83
data: {"id": "K-014", "category": "K", "priority": "P2", "ref": "constants_audit.csv, file=brainstem_net.py", "item": "13 unsourced constants in brainstem_net.py (model-choice 13, cannot-source 0, unresearched 0); the rest are sourced", "why": "model-choice values need a declared rationale or a measurement; cannot-source values need a source or a declared status", "resolve": "Work through the rows of this file in constants_audit.csv (filter file and status); update status/source/verified there, then close this batch", "status": "declared", "evidence": "constants_audit_c1m.csv: all 13 unsourced constants in brainstem_net.py are classified model-choice (declared design choices; 0 cannot-source, 0 unresearched); checked 2026-10-29", "touched": "2026-10-29", "note": ""}
---
