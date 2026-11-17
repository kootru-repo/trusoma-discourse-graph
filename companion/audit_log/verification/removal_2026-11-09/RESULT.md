# Result: removal probe (Stage B), run 2026-11-09

A reading, not a proof. Plan and rule: PLAN.md, including the rule amendment and the run note. `apply_rule.py results.jsonl` gives the table. There were 47 results, about 55 min in total, with no learner. Ran without review under the 2026-10-22 ruling.

**Floor (x1.001, 3 seeds), medians:**

| Measure | Median |
|---|---|
| pattern | 0.317 |
| where | 0.049 |
| structure | 0.21 |
| firing | 0.166 |
| amount | 0.236 |
| movement | 0.083 |
| firing_level | 0.165 |

## REMOVABLE: 5 groups, 6 values

No measure moved beyond 2 x the floor.

| Group | Values | Null form | Note |
|---|---|---|---|
| depression_off | setting.brainstem_s2.TH_DEP | depletion gate off | The run is almost identical to the baseline (pattern 0.000, firing 0.025). At 0.5 the gate barely engages in the 12.5 loop. |
| pop_noise_off | brainstem_net7.pop_size | N = 10^9 | Finite-size spike noise is not needed. |
| emd_off | body7.emd_ms | 0 ms | |
| tissue_neutral | tongue7.tissue.bio.fetal, tongue7.tissue.init.act_ratio | 1.0 each | bio.fetal scales the sourced e_tongue (6.2 kPa, source-found-transfer); removing it leaves the sourced value. |
| cordfrac_0 | setting.brainstem_s2.CORD_FRAC | 0 | **Conflicts** with the 2026-11-08 probe: the CORD_FRAC + TH_DEP group read MATTERS narrowly over 6 seeds. Since TH_DEP has almost no effect, that reading came from CORD_FRAC or from noise. Confirm directly before removing. |

## NEEDED: 12 groups, 52 values

| Group | Values | Reason |
|---|---|---|
| tissue_damping_off | 4 (eta, tongue_tan_delta, pulp_g x2) | refused: ZeroDivisionError at build |
| stiffness_off | body7.init.k | run hung past 900 s |
| popnet_merge | D_mat, ou_tau_e_ms | pattern 0.65, amount 1.48, firing_level 0.44: the largest effect |
| limits_off | 10 joint limits | where, structure, amount |
| noise_off | 2 receptor noise sd | where; structure 0.99 |
| fa_off | skin_world.fa_ramp | amount 0.665 |
| atlas_off | neck_atlas_share | where, amount |
| moment_merge | 11 moment_frac | where 0.147 |
| skin_density_merge | 15 afferent densities | where 0.133 |
| damping_off | body7.init.c | where 0.115 |
| rest_symmetric | 4 rest_fit_rad | where 0.111 |

The six groups in the last four rows are NEEDED on `where` alone, at 1.1-1.5 x the 0.098 threshold. These are the weakest NEEDED readings.

**No null form (28 values):** geometry and material constants (PLAN.md). They are needed in form.

## Tally consequence (if the USER approves the removals)

| | Unsourced | TALLY |
|---|---|---|
| Now | 86 | 332 of 418 |
| Remove the 6 | 80 | 332 of 412 (80.6%) |
| Remove 5, keep CORD_FRAC until confirmed | 81 | 332 of 413 (80.4%) |

Nothing has been removed from the code yet. Stage C needs the USER's word, then a direct test of each change.
