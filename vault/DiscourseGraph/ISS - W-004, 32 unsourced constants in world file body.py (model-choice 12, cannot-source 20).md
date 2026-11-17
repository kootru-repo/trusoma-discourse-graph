---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "e352c176-c240-7a2b-be1d-50c5815f9db6"
dg_type: "Issue"
dg_name: "W-004"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 103
data: {"id": "W-004", "category": "W", "priority": "P3", "ref": "constants_audit.csv, file=body.py", "item": "32 unsourced constants in world file body.py (model-choice 12, cannot-source 20)", "why": "physics and geometry values; the world is physics only, but anatomy and tissue values should still track measurements", "resolve": "Work by kind (physical/body parameter first) in constants_audit.csv; fetal data preferred, declared transfer otherwise", "status": "open", "evidence": "", "touched": "", "note": "Largest batch: body7.py"}
---

32 unsourced constants in world file body.py (model-choice 12, cannot-source 20).

Why it matters: physics and geometry values; the world is physics only, but anatomy and tissue values should still track measurements.

To resolve: Work by kind (physical/body parameter first) in constants_audit.csv; fetal data preferred, declared transfer otherwise.

Status: open; priority: P3; category: W.

Note: Largest batch: body7.py.
