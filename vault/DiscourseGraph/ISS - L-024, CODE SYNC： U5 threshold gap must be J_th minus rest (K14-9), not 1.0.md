---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "9c647232-3420-7c90-881f-2177cfe7de43"
dg_type: "Issue"
dg_name: "L-024"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 133
data: {"id": "L-024", "category": "L", "priority": "P2", "ref": "cortex code vs CF2_CELL_SPEC 2026-10-24", "item": "CODE SYNC: U5 threshold gap must be J_th minus rest (K14-9), not 1.0", "why": "", "resolve": "Change the gap; re-run the sliding-threshold tests.", "status": "revised", "evidence": "c1m commit 237c6ea: U5_GAP=0.5 (J_th 0.5 - rest 0), voltage_rule uses it; test_cortex_core pass, full gate pass", "touched": "2026-10-29", "note": "U5 is the ablation reference (A1 covariance is the default); gap change needs the K14-9 fit"}
---

CODE SYNC: U5 threshold gap must be J_th minus rest (K14-9), not 1.0.

To resolve: Change the gap; re-run the sliding-threshold tests.

Status: revised; priority: P2; category: L.

Evidence so far: c1m commit 237c6ea: U5_GAP=0.5 (J_th 0.5 - rest 0), voltage_rule uses it; test_cortex_core pass, full gate pass.

Note: U5 is the ablation reference (A1 covariance is the default); gap change needs the K14-9 fit.
