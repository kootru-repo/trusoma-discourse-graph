---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "faa3414f-a8dc-7ca1-be5d-ed7a78e7b84d"
dg_type: "Issue"
dg_name: "L-036"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 150
data: {"id": "L-036", "category": "L", "priority": "P2", "ref": "companion/TRUSOMA_JEPA_LEARNER.md", "item": "JEPA learner has no sourced touch input: robot sensor to rate mapping unsourceable; the TruSoma body's skin route not examined", "why": "USER: no test until the whole model is sourced", "resolve": "Examine skin_world transduction sources, or read a source for the mapping; then a new pre-registration", "status": "in-progress", "evidence": "2026-11-10 join J16 tested, pre-registered (companion/TRUSOMA_SKIN7_PREREG_2026-11-10.md section 10): NOT REPLICATED, 1 of 10 seeds grouped; learned 0.0475 vs untrained 0.0489 vs null 0.0473; b2_score.log. Input-limited: afferent spikes hold surface identity only at 0.07-0.10 vs 0.06 shuffled (currents 0.69-0.72), rates 0.65/s untouched vs 0.66 touched (b2_raw_420s.log). Open: the afferent stage's resting vs driven rate", "touched": "2026-11-10", "note": "Stage 2 on TouchSim failed its test 2026-11-03 (NO ADDED VALUE, TRUSOMA_STAGE2_TOUCH.md section 7): the route gives the learner sourced input but J6 loses the signal. Mouth, fetal age, shear and robot counts stay open"}
---

JEPA learner has no sourced touch input: robot sensor to rate mapping unsourceable; the TruSoma body's skin route not examined.

Why it matters: USER: no test until the whole model is sourced.

To resolve: Examine skin_world transduction sources, or read a source for the mapping; then a new pre-registration.

Status: in-progress; priority: P2; category: L.

Evidence so far: 2026-11-10 join J16 tested, pre-registered (companion/TRUSOMA_SKIN7_PREREG_2026-11-10.md section 10): NOT REPLICATED, 1 of 10 seeds grouped; learned 0.0475 vs untrained 0.0489 vs null 0.0473; b2_score.log. Input-limited: afferent spikes hold surface identity only at 0.07-0.10 vs 0.06 shuffled (currents 0.69-0.72), rates 0.65/s untouched vs 0.66 touched (b2_raw_420s.log). Open: the afferent stage's resting vs driven rate.

Note: Stage 2 on TouchSim failed its test 2026-11-03 (NO ADDED VALUE, TRUSOMA_STAGE2_TOUCH.md section 7): the route gives the learner sourced input but J6 loses the signal. Mouth, fetal age, shear and robot counts stay open.
