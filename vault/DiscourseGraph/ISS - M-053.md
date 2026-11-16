---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "c883ee36-285a-74c4-961b-fc9eaa3d501e"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 140
data: {"id": "M-053", "category": "M", "priority": "P1", "ref": "Kootru-Labs body_world_12p5 handoff 5.1", "item": "skin7 taxel_points_analysis_only places trunk/hand/limb/sole taxels from the fixed rest configuration, ignoring body.q: 11 surfaces sit 3-23 mm off the UNCHANGED sculpt (legs 18, soles 23 mm). Fix: make the analysis placement follow body.q, or adopt data/fitted_q.json (23 DOF) as the 12.5 rest q0; then regenerate the taxel sites and re-gate/re-seal contact tests.", "why": "needs a brain-dir edit (unsourced constants / seal): blocked for Claude by brain_guard, owner decision", "resolve": "source fitted_q.json as a [V] appendix entry first, then bind; or change skin7 placement to use body.q", "status": "declared", "evidence": "2026-10-30 exact Blender re-measure with the corrected frame (verification/2026-10-30_m053_remeasure.md, correction section): live surfaces at GA 12.5 are within 2 mm except face 2.8 mm and soles 8.4/10.6 mm; hands/fingers/thumbs 0.8-1.9 mm. Decision (full delegation): keep the overlap-free rest posture of c1c2f7d; the sole offset is the cost of not letting feet/legs collide (a hip/knee refit would cut soles to 4.8 mm but moves L_knee 23 deg and collides, probe m053_legfit_probe.py). Revisit if sole contact tests need it.", "touched": "2026-10-30", "note": ""}
---
