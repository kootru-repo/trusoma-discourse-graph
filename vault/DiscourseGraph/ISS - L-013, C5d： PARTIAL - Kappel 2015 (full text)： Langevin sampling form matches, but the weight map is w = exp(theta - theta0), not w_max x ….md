---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "a84d23f8-35b6-7d58-bf4a-5338733e1808"
dg_type: "Issue"
dg_name: "L-013"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 122
data: {"id": "L-013", "category": "L", "priority": "P2", "ref": "CF2_CELL_SPEC.md rule C5d (learning-rule source check 2026-10-23)", "item": "C5d: PARTIAL - Kappel 2015 (full text): Langevin sampling form matches, but the weight map is w = exp(theta - theta0), not w_max x sigmoid(theta); the prior values are the author's. Yasumatsu 2008 (full text) SUPPORTS the numbers: spine volume SD about 0.2 V + 0.01 um^3 per day (rat hippocampal slice culture), but the appendix says 'over hours' and 'per day' reads as voltage", "why": "learning-rule source check: does the cited source support the rule as written?", "resolve": "Cite as 'Langevin sampling form after Kappel 2015; sigmoid map and prior declared'; drop any log-normal claim; fix the appendix to '20 percent per day plus 0.01 um^3, multiplicative'", "status": "revised", "evidence": "spec revised 2026-10-24 (s2b 5979d8a and the sourced-form swap commit); see verification/2026-10-24_learning_rules_status.md", "touched": "2026-10-24", "note": "verdict PARTIAL"}
---

C5d: PARTIAL - Kappel 2015 (full text): Langevin sampling form matches, but the weight map is w = exp(theta - theta0), not w_max x sigmoid(theta); the prior values are the author's. Yasumatsu 2008 (full text) SUPPORTS the numbers: spine volume SD about 0.2 V + 0.01 um^3 per day (rat hippocampal slice culture), but the appendix says 'over hours' and 'per day' reads as voltage.

Why it matters: learning-rule source check: does the cited source support the rule as written?

To resolve: Cite as 'Langevin sampling form after Kappel 2015; sigmoid map and prior declared'; drop any log-normal claim; fix the appendix to '20 percent per day plus 0.01 um^3, multiplicative'.

Status: revised; priority: P2; category: L.

Evidence so far: spec revised 2026-10-24 (s2b 5979d8a and the sourced-form swap commit); see verification/2026-10-24_learning_rules_status.md.

Note: verdict PARTIAL.
