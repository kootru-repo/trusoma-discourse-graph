---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "56f94aba-44df-7c56-987a-58be60da57cd"
dg_type: "Issue"
dg_name: "W-008"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 107
data: {"id": "W-008", "category": "W", "priority": "P3", "ref": "constants_audit.csv, file=skin_world.py", "item": "22 unsourced constants in world file skin_world.py (model-choice 21, cannot-source 1)", "why": "physics and geometry values; the world is physics only, but anatomy and tissue values should still track measurements", "resolve": "Work by kind (physical/body parameter first) in constants_audit.csv; fetal data preferred, declared transfer otherwise", "status": "open", "evidence": "", "touched": "", "note": "Largest batch: body7.py"}
---

22 unsourced constants in world file skin_world.py (model-choice 21, cannot-source 1).

Why it matters: physics and geometry values; the world is physics only, but anatomy and tissue values should still track measurements.

To resolve: Work by kind (physical/body parameter first) in constants_audit.csv; fetal data preferred, declared transfer otherwise.

Status: open; priority: P3; category: W.

Note: Largest batch: body7.py.
