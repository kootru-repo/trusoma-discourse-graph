# Result: sensitivity probe of the adult-sourced values (run 2026-11-08)

A reading, not a proof. The plan and the rule are in PLAN.md, applied with `apply_rule.py`. The run used the configuration as it stood before the 2026-11-08 value changes. Ran without review under the 2026-10-22 ruling.

| Part | Group (values) | Verdict | Note |
|---|---|---|---|
| Body | limits (7) | MINOR | largest: amount 0.26 |
| | moment_arms (3) | MINOR | |
| | neck_shoulder (1) | MINOR | |
| | hand_hip (12) | MATTERS, by refusal only | x 0.75 refused on both seeds: "embedded rest at GA 12.5: derive a rest row (F-1) first". The readings themselves are tiny (max 0.003) |
| | tissue (8) | MINOR | |
| | skin (19) | MINOR | amount up to 0.18 |
| | transduction (3) | MINOR | no effect |
| | muscle_timing (2) | MINOR | |
| Brainstem | delays (3) | MINOR | low power: the 0.1% floor already moves pattern 0.41 and structure 0.64 (seed 1) |
| | counts (8) | MINOR | low power, as above |
| | projections (19) | MINOR | low power, as above |
| | reflex_terms (2) | MINOR | |
| | popnet (6) | MATTERS | x 0.75 on both seeds (amount 1.20 and 1.22; firing 0.45 and 0.54) |

**Reading:**
- The popnet background-noise terms are the adult values that matter most. ou_tau_i was replaced the same day (21.9 ms, Branchereau 2019); ou_ge0, ou_gi0, ou_sde, ou_sdi and ou_tau_e stay open (cluster 8 round 2 in ADULT_TRANSITION_PLAN.md).
- hand_hip matters only because shrinking the hand breaks the 12.5-week rest posture. It is a geometry coupling, not a response.
- The brainstem part cannot separate MINOR from MATTERS well, because the loop is chaotic at the 0.1% floor.
- The three delay values were changed after this run (d_b3_rn 39, d_b1e 27, d_atonia 22 ms, from human fetal brainstem lengths), so this run says nothing about the new values.
