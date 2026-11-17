---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "f7df64c3-9aa0-7c5a-a419-9684616f8d4e"
dg_type: "Issue"
dg_name: "W-002"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 101
data: {"id": "W-002", "category": "W", "priority": "P3", "ref": "constants_audit.csv, file=tongue7.py", "item": "114 unsourced constants in world file tongue7.py (model-choice 112, cannot-source 2)", "why": "physics and geometry values; the world is physics only, but anatomy and tissue values should still track measurements", "resolve": "Work by kind (physical/body parameter first) in constants_audit.csv; fetal data preferred, declared transfer otherwise", "status": "open", "evidence": "", "touched": "", "note": "Largest batch: body7.py"}
---

114 unsourced constants in world file tongue7.py (model-choice 112, cannot-source 2).

Why it matters: physics and geometry values; the world is physics only, but anatomy and tissue values should still track measurements.

To resolve: Work by kind (physical/body parameter first) in constants_audit.csv; fetal data preferred, declared transfer otherwise.

Status: open; priority: P3; category: W.

Note: Largest batch: body7.py.
