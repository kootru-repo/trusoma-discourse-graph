---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "96098b43-412c-7dfb-bec2-d105192a2fbf"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 217
data: {"id": "M-093", "category": "M", "priority": "P1", "ref": "companion/audit_log/verification/research_grade_2026-11-09/RESULT_PATH_STEPS_1_2.md", "item": "Skin afferent gain setting.skin_world.GAIN = 1.0 is unresearched: a threshold-force touch adds about 0.8 per s, where Fitzgerald 1987 (doi:10.1038/326603a0) reports 3-6 impulses over 50-150 ms at E17", "why": "Path plan step 1: touch does not reach the afferent spikes", "resolve": "Read the paper's figure or text for the force that gave 3-6 impulses; derive the gain; sourcing record first, then the value tools", "status": "verified", "evidence": "2026-11-11 bound: setting.skin_world.GAIN 1.0 -> 4.4, source-found-transfer, Fitzgerald 1987 Fig. 2c (read in full); join: hair for the trace not named. Record m.afferent.gain.fitzgerald1987n; appendix Q entry. Reading on the sourced wall with both afferent values: 0.138-0.164 (gate 0.35 not met)", "touched": "2026-11-11", "note": ""}
---
