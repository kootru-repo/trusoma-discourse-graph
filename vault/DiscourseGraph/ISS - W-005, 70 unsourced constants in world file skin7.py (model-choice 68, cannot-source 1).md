---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "52a62778-c5f4-7f08-9b71-97125f1083e2"
dg_type: "Issue"
dg_name: "W-005"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 104
data: {"id": "W-005", "category": "W", "priority": "P3", "ref": "constants_audit.csv, file=skin7.py", "item": "70 unsourced constants in world file skin7.py (model-choice 68, cannot-source 1)", "why": "physics and geometry values; the world is physics only, but anatomy and tissue values should still track measurements", "resolve": "Work by kind (physical/body parameter first) in constants_audit.csv; fetal data preferred, declared transfer otherwise", "status": "open", "evidence": "", "touched": "", "note": "Largest batch: body7.py"}
---

70 unsourced constants in world file skin7.py (model-choice 68, cannot-source 1).

Why it matters: physics and geometry values; the world is physics only, but anatomy and tissue values should still track measurements.

To resolve: Work by kind (physical/body parameter first) in constants_audit.csv; fetal data preferred, declared transfer otherwise.

Status: open; priority: P3; category: W.

Note: Largest batch: body7.py.
