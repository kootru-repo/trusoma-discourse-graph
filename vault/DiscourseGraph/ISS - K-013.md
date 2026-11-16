---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "b10475d3-f87d-7bc9-93de-ae371a6c1afa"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 82
data: {"id": "K-013", "category": "K", "priority": "P2", "ref": "constants_audit.csv, file=brainstem_net7.py", "item": "13 unsourced constants in brainstem_net7.py (model-choice 12, cannot-source 1, unresearched 0); the rest are sourced", "why": "model-choice values need a declared rationale or a measurement; cannot-source values need a source or a declared status", "resolve": "Work through the rows of this file in constants_audit.csv (filter file and status); update status/source/verified there, then close this batch", "status": "declared", "evidence": "c1m 534cdb1 (constants_audit.csv): all cannot-source/unresearched rows in this file declared model-choice with the search record kept; model-choice rows already carry a design-clause rationale in closed_by. Sensitivity-flagged rows left cannot-source: body7.uterus_aspect, oral7.floor_drop, oral7.arch_k, oral7.roof_half.n1, skin_world.receptor_noise_sd, tongue7.vault.n3. 2026-10-30", "touched": "2026-10-30", "note": ""}
---
