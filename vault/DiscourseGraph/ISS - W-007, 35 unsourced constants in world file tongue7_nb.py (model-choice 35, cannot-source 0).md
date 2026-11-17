---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "79cc9744-f42a-7945-b82f-d627849b181c"
dg_type: "Issue"
dg_name: "W-007"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 106
data: {"id": "W-007", "category": "W", "priority": "P3", "ref": "constants_audit.csv, file=tongue7_nb.py", "item": "35 unsourced constants in world file tongue7_nb.py (model-choice 35, cannot-source 0)", "why": "physics and geometry values; the world is physics only, but anatomy and tissue values should still track measurements", "resolve": "Work by kind (physical/body parameter first) in constants_audit.csv; fetal data preferred, declared transfer otherwise", "status": "declared", "evidence": "constants_audit_c1m.csv: all 35 unsourced constants in tongue7_nb.py are classified model-choice (declared design choices; 0 cannot-source, 0 unresearched); checked 2026-10-29", "touched": "2026-10-29", "note": "Largest batch: body7.py"}
---

35 unsourced constants in world file tongue7_nb.py (model-choice 35, cannot-source 0).

Why it matters: physics and geometry values; the world is physics only, but anatomy and tissue values should still track measurements.

To resolve: Work by kind (physical/body parameter first) in constants_audit.csv; fetal data preferred, declared transfer otherwise.

Status: declared; priority: P3; category: W.

Evidence so far: constants_audit_c1m.csv: all 35 unsourced constants in tongue7_nb.py are classified model-choice (declared design choices; 0 cannot-source, 0 unresearched); checked 2026-10-29.

Note: Largest batch: body7.py.
