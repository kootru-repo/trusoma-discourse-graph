# Brainstem sensitivity probe, more seeds (plan step 3, USER 2026-11-08)

Fixed before the run. Ran without review under the 2026-10-22 ruling. A probe under one hour: a reading, not a proof.

**Question.** Do the 16 open fetal brainstem values change the 12.5-week brainstem loop by more than its own chaotic noise? The 2026-11-06 probe had 2 seeds and one floor run per seed, so it could not separate small effects from noise (the 0.1% floor already moved pattern 0.41 and structure 0.64 on seed 1).

**Values** (every brainstem or popnet value that is not sourced and whose role is fetal; config and unsourced_kind.csv on 2026-11-08):
- **counts** (12): brainstem_net7.pops.{b1a_off, b1a_on_gaba, b1a_on_glu, b1b_sleep, b1b_wake, b1b_wake_gaba, b1c_mia, b1d_scn, b2_bf, b2_chol, b2_dr, b2_lc}.lo
- **popnet** (2): popnet.popnet.init.ou_tau_e_ms, setting.popnet.PopNet.__init__.D_mat
- **settings** (2): setting.brainstem_s2.CORD_FRAC, setting.brainstem_s2.TH_DEP

**Runs.**
- 6 seeds (1-6). Per seed: a baseline; a floor (all 16 values x 1.001); and each group x 0.75 and x 1.25. Integer values are rounded to at least 1.
- That is 48 runs of 10 simulated seconds, using the same worker as the 2026-11-06 probe (loop_worker.py; 12.5-week body, brainstem, skin; no learner).
- Two runs at a time. The run waits while RAM is at 90% or more or commit charge at 94% or more. Deadline 3300 s; it is resumable.

**Measures.** Pattern, where, structure, firing, amount, movement and firing_level, each against the same seed's baseline (the 2026-11-06 definitions).

**Rule (fixed now).**
- A group MATTERS if, for any of pattern, where, structure or firing, its median over seeds of the larger of its two directions exceeds 0.05 AND exceeds 2 x the median of the floor runs over seeds.
- A refused or failed run also counts as MATTERS.
- Otherwise MINOR. The 2026-11-06 per-seed rule is reported alongside for continuity.

**Use.** MINOR groups are candidates for the USER's step 4 decision (declare as model choices rather than chase); a MATTERS group stays on the sourcing list.
