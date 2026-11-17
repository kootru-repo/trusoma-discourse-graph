---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "044dce7d-b0ff-7d96-b713-51d423fb722b"
dg_type: "Issue"
dg_name: "C-014"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 210
data: {"id": "C-014", "category": "C", "priority": "P2", "ref": "companion/audit_log/verification/trusoma_cortex/stage5_map.py; tools/trusoma/brain/predictive_net.py:37", "item": "Stage 5 map scorer may be blind: w_in.T @ w_in with 80 of 952 random afferents per unit gives about 3.5 shared units per channel pair; its ceiling was never measured", "why": "Probe 5 no-signal cannot be read until the scorer is shown to see a map through this wiring", "resolve": "RESEARCH_GRADE_PLAN S1 B0: score oracle weights under the real sparse mask with map_readout unchanged; record the ceiling; add the per-unit field readout if it is low", "status": "verified", "evidence": "b0_oracle.py run 2026-11-09 (companion/audit_log/verification/research_grade_2026-11-09/RESULT.md): oracle per_column 0.110 at 80 afferents against 0.003 shuffled, so the scorer is not blind; raw bar 0.583 unreachable at this wiring (ceiling 0.110; 0.675 with all afferents)", "touched": "2026-11-09", "note": "Hypothesis refuted. Exploratory field readout on the kept checkpoints: 7-8% closer than chance, z -5.8 to -9.8; needs a pre-registered replicated probe"}
---

Stage 5 map scorer may be blind: w_in.T @ w_in with 80 of 952 random afferents per unit gives about 3.5 shared units per channel pair; its ceiling was never measured.

Why it matters: Probe 5 no-signal cannot be read until the scorer is shown to see a map through this wiring.

To resolve: RESEARCH_GRADE_PLAN S1 B0: score oracle weights under the real sparse mask with map_readout unchanged; record the ceiling; add the per-unit field readout if it is low.

Status: verified; priority: P2; category: C.

Evidence so far: b0_oracle.py run 2026-11-09 (companion/audit_log/verification/research_grade_2026-11-09/RESULT.md): oracle per_column 0.110 at 80 afferents against 0.003 shuffled, so the scorer is not blind; raw bar 0.583 unreachable at this wiring (ceiling 0.110; 0.675 with all afferents).

Note: Hypothesis refuted. Exploratory field readout on the kept checkpoints: 7-8% closer than chance, z -5.8 to -9.8; needs a pre-registered replicated probe.
