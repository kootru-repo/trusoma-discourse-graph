# Result: brainstem sensitivity probe, 6 seeds (plan step 3, 2026-11-08)

A reading, not a proof. The rule was fixed in PLAN.md before the run (a519392) and applied with apply_rule.py. Ran without review under the 2026-10-22 ruling.

**Runs.**
- 42 of 42 condition runs plus 6 baselines over seeds 1-6, at 10 simulated seconds each. Nothing was refused or failed.
- The first chunk hit its 3300 s deadline. A driver bug had written the deadline stops as "failed", which the rule would have read as MATTERS. Those 4 rows were removed, the driver was fixed, and the run was resumed to completion.

**Noise floor** (all 16 values x 1.001; median over seeds): pattern 0.291, where 0.115, structure 0.692, firing 0.132. The loop is chaotic. Structure's floor is above every group's effect, so structure cannot separate groups.

| Group | Values | Median of max(x0.75, x1.25) over seeds | Verdict (PLAN rule) | 2026-11-06 per-seed rule |
|---|---|---|---|---|
| counts | 12 nucleus neuron counts (pops.*.lo) | pattern 0.486, where 0.148, structure 0.433, firing 0.162 | **MINOR** | MINOR |
| popnet | ou_tau_e_ms, D_mat | pattern 0.447, where 0.127, structure 0.508, firing 0.187 | **MINOR** | MINOR |
| settings | CORD_FRAC, TH_DEP | pattern **0.611** (> 2 x 0.291 = 0.582), where 0.171, structure 0.740, firing 0.193 | **MATTERS**, narrowly, on pattern only | MINOR |

**Reading.**
- The 12 neuron counts and the 2 popnet terms do not move the 12.5-week brainstem loop beyond its own noise at +-25%. They are candidates for the USER's step-4 decision: declare them as model choices rather than keep chasing sources that the Golda audit found do not exist at 12.5 weeks.
- CORD_FRAC and TH_DEP pass the threshold by a small margin (0.611 against 0.582) on one measure. The run does not separate the two. They stay on the sourcing list; a split probe (each value alone) would say which one matters.
- The background-noise terms that mattered in the 2026-11-06 probe (ou_ge0, ou_gi0, ou_sde, ou_sdi) are not in this set: their role is not fetal in unsourced_kind.csv. That 2026-11-06 verdict stands.
