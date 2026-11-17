---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "3747d1f8-ab77-705e-8a1a-15013af081dc"
dg_type: "Issue"
dg_name: "L-016"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 125
data: {"id": "L-016", "category": "L", "priority": "P2", "ref": "CF2_CELL_SPEC.md rule H3 (learning-rule source check 2026-10-23)", "item": "H3: PARTIAL - Fauth 2015 (full text): deletion p_del = p_build x rho x exp(-a^2 w^(4/3)) has no w0 parameter; the spec's w0 0.2, rho 1.5, a 6 are not confirmed in the paper. Huttenlocher & Dabholkar 1997 (abstract): synaptic DENSITY rises through infancy (auditory, prefrontal); it gives no formation or deletion rates", "why": "learning-rule source check: does the cited source support the rule as written?", "resolve": "Rewrite the deletion form to match Fauth or declare w0 as the author's; reword Huttenlocher to 'density rises through term and infancy'", "status": "revised", "evidence": "spec revised 2026-10-24 (s2b 5979d8a and the sourced-form swap commit); see verification/2026-10-24_learning_rules_status.md", "touched": "2026-10-24", "note": "verdict PARTIAL"}
---

H3: PARTIAL - Fauth 2015 (full text): deletion p_del = p_build x rho x exp(-a^2 w^(4/3)) has no w0 parameter; the spec's w0 0.2, rho 1.5, a 6 are not confirmed in the paper. Huttenlocher & Dabholkar 1997 (abstract): synaptic DENSITY rises through infancy (auditory, prefrontal); it gives no formation or deletion rates.

Why it matters: learning-rule source check: does the cited source support the rule as written?

To resolve: Rewrite the deletion form to match Fauth or declare w0 as the author's; reword Huttenlocher to 'density rises through term and infancy'.

Status: revised; priority: P2; category: L.

Evidence so far: spec revised 2026-10-24 (s2b 5979d8a and the sourced-form swap commit); see verification/2026-10-24_learning_rules_status.md.

Note: verdict PARTIAL.
