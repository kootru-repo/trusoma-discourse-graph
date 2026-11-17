---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "0ca5b54f-da7b-78ea-bf59-9dd67b82f61c"
dg_type: "Issue"
dg_name: "W-001"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 100
data: {"id": "W-001", "category": "W", "priority": "P3", "ref": "constants_audit.csv, file=body7.py", "item": "347 unsourced constants in world file body7.py (model-choice 214, cannot-source 130)", "why": "physics and geometry values; the world is physics only, but anatomy and tissue values should still track measurements", "resolve": "Work by kind (physical/body parameter first) in constants_audit.csv; fetal data preferred, declared transfer otherwise", "status": "open", "evidence": "", "touched": "", "note": "Largest batch: body7.py"}
---

347 unsourced constants in world file body7.py (model-choice 214, cannot-source 130).

Why it matters: physics and geometry values; the world is physics only, but anatomy and tissue values should still track measurements.

To resolve: Work by kind (physical/body parameter first) in constants_audit.csv; fetal data preferred, declared transfer otherwise.

Status: open; priority: P3; category: W.

Note: Largest batch: body7.py.
