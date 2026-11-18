# Removal probe, Stage B of NECESSITY_PLAN_2026-11-08.md (USER 2026-11-09: "Begin removal tests")

Fixed before the run. Ran without review under the 2026-10-22 ruling. A probe under one hour: a reading, not a proof.

**Question.** Of the 86 unsourced fetal-relevant values (TALLY 332 of 418), which can be removed, merged into a sourced or shared value, or set to a neutral value without changing the 12.5-week loop (body, skin, brainstem; no learner) beyond its own noise?

**Null forms (17 groups, 58 values).** The rows are in driver.py `GROUPS`.

| Group | Values | Null form |
|---|---|---|
| moment_merge | 11 moment_frac | all = sourced neck_flex 0.297 (one shared value) |
| limits_off | 10 open joint limits | removed (lower -180, upper +180 deg) |
| skin_density_merge | 15 afferent densities (n4) | one shared density, the median 87.9 |
| tissue_damping_off | eta, tongue_tan_delta, pulp_g n0/n1 | 0 (viscous terms removed; pulp_tau n0/n1 then unused) |
| tissue_neutral | bio.fetal, act_ratio | 1.0 (no fetal scaling, no ratio) |
| noise_off | skin_world and transduction receptor_noise_sd | 0 |
| pop_noise_off | pop_size | 10^9 (finite-size spike noise removed) |
| fa_off | fa_ramp | 1e-12 (FA channel driven to zero) |
| emd_off | emd_ms | 0 |
| stiffness_off | body7.init.k | 0 |
| damping_off | body7.init.c | 0 |
| atlas_off | neck_atlas_share | 0 |
| cordfrac_0 | CORD_FRAC | 0 |
| depression_off | TH_DEP | 1e6 (gate never opens) |
| popnet_merge | D_mat, ou_tau_e_ms | 1.0; = sourced ou_tau_i 21.9 ms |
| rest_symmetric | rest_fit_rad l/r fingers, l/r pron | left = right = mean |

**No null form (28 values, not tested).** These are geometry or material constants that a body must have: fk.tb, curl n1/n2, phalanx n0/n1, thumb_dir (3), thumb_target.n2, THUMB_TARGET.0/.1, cord_dir (3), face_frac (3), flat_profile, oral7 buccal/floor (4), tissue nu, e_palate, e_pulp, pulp_frac, pulp_tau n0/n1. They stay needed in form. (pulp_tau goes with tissue_damping_off if that group is removable.)

**Runs.**
- Seeds 1-3. Per seed: a baseline, a floor (all 58 values x 1.001; integers rounded), and each group's null form.
- 57 runs of 10 simulated seconds, two at a time. The worker is the 2026-11-08 one, except that skin receptor noise now comes from the config instead of being forced to 0, so its removal is testable.
- Waits while RAM is at 90% or more or commit charge at 94% or more. Deadline 3300 s; resumable.

**Measures.** Against the same seed's baseline: pattern, where, structure, firing, amount, movement and firing_level (the 2026-11-08 definitions). When a group changes the channel count (density merge), pattern and structure are not defined and the other five decide.

**Rule (fixed now).**
- A group is **REMOVABLE** only if:
  - no run refused or failed; and
  - no measure is changed. A measure is changed when its median over seeds exceeds 2 x the floor median AND, for pattern, where, structure and firing, also exceeds 0.05.
  - (Amended after launch, before any result was read: the first wording, "at most 2 x floor and at most 0.05", was degenerate. The floor alone moves pattern by 0.29, so every group would have read NEEDED.)
- Otherwise it is **NEEDED**.
- This is deliberately stricter than the sensitivity rule: all 7 measures count, including the aggregate ones (amount, movement, firing_level) that are less chaotic.

**Use (Stage C).**
- REMOVABLE: the group's values can be removed or merged in code, followed by a direct test of the change. The removal is a USER-visible edit, reported before it is made.
- NEEDED: the values stay on the sourcing list.

**Limits.**
- 3 seeds, 10 s, one drive, no learner.
- The loop is chaotic (2026-11-08 structure floor 0.69), so a REMOVABLE reading on the chaotic measures is weak. The aggregate measures carry most of the power.
- Groups move together, so effects within a group can cancel.

**Run note (2026-11-09, during the run).**
- stiffness_off (seed 1) hung past the 900 s worker timeout and crashed the driver after 19 results. It is recorded as failed (the rule counts it as NEEDED).
- The worker timeout is now 400 s; normal runs take 70-170 s.
- A group with a refused or failed run is decided, so its other seeds are skipped.
- Resumed with the remaining time budget, so the probe stays under one hour in total.
