---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "2e4eeb46-efe8-7198-ad92-16e9b278b079"
dg_type: "Issue"
dg_name: "L-004"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 113
data: {"id": "L-004", "category": "L", "priority": "P1", "ref": "CF2_CELL_SPEC.md rule C2 (learning-rule source check 2026-10-23)", "item": "C2: PARTIAL - He et al. 2015 Neuron 88:528 (full text): beta-adrenergic agent was isoproterenol, not NE; LTP halves at a 5 s delay and is abolished at 10 s; LTD abolished at 5 s. '5-HT LTD within 2.5 s not 5 s' is not in the paper (only 0 s vs 5 s tested); tau_LTP 2 s / tau_LTD 1 s is a fit, not reported", "why": "learning-rule source check: does the cited source support the rule as written?", "resolve": "Reword the LTD window to 'under 5 s (about half the LTP window)', mark 2.5 s as inferred, state isoproterenol", "status": "revised", "evidence": "spec revised 2026-10-24 (s2b 5979d8a and the sourced-form swap commit); see verification/2026-10-24_learning_rules_status.md", "touched": "2026-10-24", "note": "verdict PARTIAL"}
---

C2: PARTIAL - He et al. 2015 Neuron 88:528 (full text): beta-adrenergic agent was isoproterenol, not NE; LTP halves at a 5 s delay and is abolished at 10 s; LTD abolished at 5 s. '5-HT LTD within 2.5 s not 5 s' is not in the paper (only 0 s vs 5 s tested); tau_LTP 2 s / tau_LTD 1 s is a fit, not reported.

Why it matters: learning-rule source check: does the cited source support the rule as written?

To resolve: Reword the LTD window to 'under 5 s (about half the LTP window)', mark 2.5 s as inferred, state isoproterenol.

Status: revised; priority: P1; category: L.

Evidence so far: spec revised 2026-10-24 (s2b 5979d8a and the sourced-form swap commit); see verification/2026-10-24_learning_rules_status.md.

Note: verdict PARTIAL.
