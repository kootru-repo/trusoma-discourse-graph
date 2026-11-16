---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "5c488cad-89e5-7642-8f4f-69e483082609"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 155
data: {"id": "L-039", "category": "L", "priority": "P2", "ref": "companion/CF2_CELL_SPEC.md JL1; TRUSOMA_JEPA_LEARNER.md J6", "item": "CF2_CELL_SPEC JL1 says the learner takes Poisson afferent rates only and claims no touch adapter; Stages 2-4 feed TouchSim spikes as 1 ms events (p = 1 in that bin), join J6. The spec and code header still list J1-J5 only", "why": "J6 and J7 are listed in the learner document but the cell spec, a source of truth, was not updated", "resolve": "Amend JL1 and the join list to state J6 and its test; no new flag or constant needed", "status": "verified", "evidence": "Cell spec JL1a added 2026-11-03 states J6, its failure and the sparse form J8; TRUSOMA_JEPA_LEARNER section 6 lists J6-J8; learner module header updated", "touched": "2026-11-03", "note": ""}
---
