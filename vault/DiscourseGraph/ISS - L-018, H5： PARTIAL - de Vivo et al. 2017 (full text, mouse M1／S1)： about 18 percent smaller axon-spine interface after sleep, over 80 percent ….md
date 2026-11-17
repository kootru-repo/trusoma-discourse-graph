---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "941ad6e3-6153-7b5e-b1a2-4e123e9c765d"
dg_type: "Issue"
dg_name: "L-018"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 127
data: {"id": "L-018", "category": "L", "priority": "P2", "ref": "CF2_CELL_SPEC.md rule H5 (learning-rule source check 2026-10-23)", "item": "H5: PARTIAL - de Vivo et al. 2017 (full text, mouse M1/S1): about 18 percent smaller axon-spine interface after sleep, over 80 percent of synapses scale, the probability of scaling falls QUADRATICALLY with size, the largest 20 percent are spared. The logistic s(w) and the (1-ACh)^2 form are the author's approximations", "why": "learning-rule source check: does the cited source support the rule as written?", "resolve": "State that the logistic is an approximation of a quadratic fall; optionally derive eta_ds from 18 percent per ~7 h sleep", "status": "revised", "evidence": "spec revised 2026-10-24 (s2b 5979d8a and the sourced-form swap commit); see verification/2026-10-24_learning_rules_status.md", "touched": "2026-10-24", "note": "w_spare, kappa, eta_ds still need de Vivo SOM coefficients"}
---

H5: PARTIAL - de Vivo et al. 2017 (full text, mouse M1/S1): about 18 percent smaller axon-spine interface after sleep, over 80 percent of synapses scale, the probability of scaling falls QUADRATICALLY with size, the largest 20 percent are spared. The logistic s(w) and the (1-ACh)^2 form are the author's approximations.

Why it matters: learning-rule source check: does the cited source support the rule as written?

To resolve: State that the logistic is an approximation of a quadratic fall; optionally derive eta_ds from 18 percent per ~7 h sleep.

Status: revised; priority: P2; category: L.

Evidence so far: spec revised 2026-10-24 (s2b 5979d8a and the sourced-form swap commit); see verification/2026-10-24_learning_rules_status.md.

Note: w_spare, kappa, eta_ds still need de Vivo SOM coefficients.
