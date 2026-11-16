---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "775c11af-1bd1-7b9b-8a99-1b0563ca645c"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 108
data: {"id": "W-009", "category": "W", "priority": "P3", "ref": "constants_audit.csv, file=body_size.py", "item": "6 unsourced constants in world file body_size.py (model-choice 6, cannot-source 0)", "why": "physics and geometry values; the world is physics only, but anatomy and tissue values should still track measurements", "resolve": "Work by kind (physical/body parameter first) in constants_audit.csv; fetal data preferred, declared transfer otherwise", "status": "declared", "evidence": "constants_audit_c1m.csv: all 6 unsourced constants in body_size.py are classified model-choice (declared design choices; 0 cannot-source, 0 unresearched); checked 2026-10-29", "touched": "2026-10-29", "note": "Largest batch: body7.py"}
---
