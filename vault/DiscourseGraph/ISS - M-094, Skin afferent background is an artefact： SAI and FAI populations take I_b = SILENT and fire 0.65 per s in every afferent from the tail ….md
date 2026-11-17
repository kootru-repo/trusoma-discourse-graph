---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "9cd64f34-078a-74de-b6ea-53ca122b1ef2"
dg_type: "Issue"
dg_name: "M-094"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 218
data: {"id": "M-094", "category": "M", "priority": "P2", "ref": "companion/audit_log/verification/research_grade_2026-11-09/RESULT_PATH_STEPS_1_2.md", "item": "Skin afferent background is an artefact: SAI and FAI populations take I_b = SILENT and fire 0.65 per s in every afferent from the tail of the rate curve; Fitzgerald 1987 gives a third of units active below 0.5 per s (join JT-5, listed and not applied)", "why": "Path plan step 1: 65 spikes per s of noise per unit", "resolve": "Sourcing record for the background from Fitzgerald 1987; a base drive for the afferent populations that gives it; probe", "status": "verified", "evidence": "2026-11-11 bound: new setting.brainstem_s2.AFF_BASE -2.2 for the SA-I and FA-I populations (brainstem_s2.py), source-found-transfer, Fitzgerald 1987 (read in full): at most 0.165 per s per afferent; the model gives 0.16-0.17. Record m.afferent.base.fitzgerald1987n; appendix A entry", "touched": "2026-11-11", "note": ""}
---

Skin afferent background is an artefact: SAI and FAI populations take I_b = SILENT and fire 0.65 per s in every afferent from the tail of the rate curve; Fitzgerald 1987 gives a third of units active below 0.5 per s (join JT-5, listed and not applied).

Why it matters: Path plan step 1: 65 spikes per s of noise per unit.

To resolve: Sourcing record for the background from Fitzgerald 1987; a base drive for the afferent populations that gives it; probe.

Status: verified; priority: P2; category: M.

Evidence so far: 2026-11-11 bound: new setting.brainstem_s2.AFF_BASE -2.2 for the SA-I and FA-I populations (brainstem_s2.py), source-found-transfer, Fitzgerald 1987 (read in full): at most 0.165 per s per afferent; the model gives 0.16-0.17. Record m.afferent.base.fitzgerald1987n; appendix A entry.
