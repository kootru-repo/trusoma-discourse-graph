---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "488e2492-f0c8-7ae4-b7d4-a4051c363f3c"
dg_type: "Issue"
dg_name: "W-003"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 102
data: {"id": "W-003", "category": "W", "priority": "P3", "ref": "constants_audit.csv, file=body7_nb.py", "item": "88 unsourced constants in world file body7_nb.py (model-choice 88, cannot-source 0)", "why": "physics and geometry values; the world is physics only, but anatomy and tissue values should still track measurements", "resolve": "Work by kind (physical/body parameter first) in constants_audit.csv; fetal data preferred, declared transfer otherwise", "status": "declared", "evidence": "constants_audit_c1m.csv: all 88 unsourced constants in body7_nb.py are classified model-choice (declared design choices; 0 cannot-source, 0 unresearched); checked 2026-10-29", "touched": "2026-10-29", "note": "Largest batch: body7.py"}
---

88 unsourced constants in world file body7_nb.py (model-choice 88, cannot-source 0).

Why it matters: physics and geometry values; the world is physics only, but anatomy and tissue values should still track measurements.

To resolve: Work by kind (physical/body parameter first) in constants_audit.csv; fetal data preferred, declared transfer otherwise.

Status: declared; priority: P3; category: W.

Evidence so far: constants_audit_c1m.csv: all 88 unsourced constants in body7_nb.py are classified model-choice (declared design choices; 0 cannot-source, 0 unresearched); checked 2026-10-29.

Note: Largest batch: body7.py.
