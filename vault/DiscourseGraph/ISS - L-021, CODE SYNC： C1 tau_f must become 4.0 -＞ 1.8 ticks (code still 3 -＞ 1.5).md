---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "7217b183-469b-70e0-ae0d-adcbed26408f"
dg_type: "Issue"
dg_name: "L-021"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 130
data: {"id": "L-021", "category": "L", "priority": "P1", "ref": "cortex code vs CF2_CELL_SPEC 2026-10-24", "item": "CODE SYNC: C1 tau_f must become 4.0 -> 1.8 ticks (code still 3 -> 1.5)", "why": "", "resolve": "Change the tagged constant after a sourced appendix entry; run the provenance gate.", "status": "verified", "evidence": "cortex_core.py, core_v0.py, test_core_v0.py and BRAINSTEM_APPENDIX_A A20 now 4.0 -> 1.8; provenance gate 0 unbound; test_core_v0 V1-V3 ok", "touched": "2026-10-24", "note": ""}
---

CODE SYNC: C1 tau_f must become 4.0 -> 1.8 ticks (code still 3 -> 1.5).

To resolve: Change the tagged constant after a sourced appendix entry; run the provenance gate.

Status: verified; priority: P1; category: L.

Evidence so far: cortex_core.py, core_v0.py, test_core_v0.py and BRAINSTEM_APPENDIX_A A20 now 4.0 -> 1.8; provenance gate 0 unbound; test_core_v0 V1-V3 ok.
