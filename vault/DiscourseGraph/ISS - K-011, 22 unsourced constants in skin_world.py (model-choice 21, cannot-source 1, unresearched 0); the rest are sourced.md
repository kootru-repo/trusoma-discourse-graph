---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "25a6690f-3103-7dbc-baea-1c7d2a61bcf0"
dg_type: "Issue"
dg_name: "K-011"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 80
data: {"id": "K-011", "category": "K", "priority": "P2", "ref": "constants_audit.csv, file=skin_world.py", "item": "22 unsourced constants in skin_world.py (model-choice 21, cannot-source 1, unresearched 0); the rest are sourced", "why": "model-choice values need a declared rationale or a measurement; cannot-source values need a source or a declared status", "resolve": "Work through the rows of this file in constants_audit.csv (filter file and status); update status/source/verified there, then close this batch", "status": "declared", "evidence": "c1m 534cdb1 (constants_audit.csv): all cannot-source/unresearched rows in this file declared model-choice with the search record kept; model-choice rows already carry a design-clause rationale in closed_by. Sensitivity-flagged rows left cannot-source: body7.uterus_aspect, oral7.floor_drop, oral7.arch_k, oral7.roof_half.n1, skin_world.receptor_noise_sd, tongue7.vault.n3. 2026-10-30", "touched": "2026-10-30", "note": ""}
---

22 unsourced constants in skin_world.py (model-choice 21, cannot-source 1, unresearched 0); the rest are sourced.

Why it matters: model-choice values need a declared rationale or a measurement; cannot-source values need a source or a declared status.

To resolve: Work through the rows of this file in constants_audit.csv (filter file and status); update status/source/verified there, then close this batch.

Status: declared; priority: P2; category: K.

Evidence so far: c1m 534cdb1 (constants_audit.csv): all cannot-source/unresearched rows in this file declared model-choice with the search record kept; model-choice rows already carry a design-clause rationale in closed_by. Sensitivity-flagged rows left cannot-source: body7.uterus_aspect, oral7.floor_drop, oral7.arch_k, oral7.roof_half.n1, skin_world.receptor_noise_sd, tongue7.vault.n3. 2026-10-30.
