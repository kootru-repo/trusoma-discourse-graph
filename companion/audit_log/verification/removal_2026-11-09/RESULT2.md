# Removal probe, chunks 2 and 3: result (2026-11-09)

Ran without review under the 2026-10-22 ruling. A probe, a reading, not a proof. Plans: PLAN2.md, PLAN3.md. Rule outputs: rule2_out.txt, rule3_out.txt, rule3b_out.txt.

**Chunk 2 (48 single-value tests, results2.jsonl).**
- NEEDED: CORD_FRAC (seeds 4-6, where), D_mat, skin receptor noise, phalanx merge, lim sh_abd#1, lim neck_flex#2, skin_tongue density.
- REMOVABLE with the event exercised: tongue_tan_delta, ou_tau_e merge, transduction noise, rest fingers symmetry, rest pronation symmetry, curl merge, rigid palate, plus some limits, single moment fractions and skin densities (these stay by policy, PLAN3.md).
- Zero change because the event never happens in 60 s (not exercised, so they stay): pulp_g n0/n1, pulp_off, unreached limits, skin surfaces without contact.
- TH_DEP: NEEDED (60 s check: depletion s falls to 0.47; PLAN2.md).

**Chunk 3, joint test (6 seeds).**
- Set a (all candidates): NEEDED on movement only (0.125 against 2 x floor 0.048). Rest pronation symmetry was dropped.
- Set b (the rest): REMOVABLE. Medians against 2 x floor: structure 0.346 vs 0.348 (borderline), where 0.183 vs 0.248, movement 0.037 vs 0.046; the others are well inside.

**Removed in code (this commit).**
- ou_tau_e_ms: popnet uses the sourced ou_tau_i (21.9 ms).
- transduction.receptor_noise_sd: Transducer, Transducer7, JawView and OralTransducer noise() return zeros.
- tongue_tan_delta and eta: no viscous term on the non-thumb contact classes.
- e_palate: rigid palate. h_palate_mm is then unused and moved to other_config (a declared value; the sourced count falls by 1).
- rest_fit_rad l/r fingers -> body7.rest_fit_rad.fingers (mean 0.360688 rad); curl n1/n2 -> body7.curl.n12 (1.05). Both stay unsourced.
- e_pulp and bio.pulp_frac moved to other_config: unused by the 12.5 run (the live thumb is rigid; audit item added).

**Tally.** 331 of 405 fetal-relevant values sourced (81.7%); 74 unsourced (from 83).

**Tests.** test_s2a_body7 passes. test_tongue7 (pressure), test_body_values_fix (moment_frac) and test_popnet_ext (K2 nmda decay unit) fail, all three also on HEAD before this change.

**Checked and kept (all 86 assessed).** NEEDED by test: CORD_FRAC, TH_DEP, D_mat, skin noise, phalanx, rest pronation and the NEEDED groups of chunk 1. Kept by policy: joint limits, moment fractions, skin densities, pop_size (Noble principle). Not exercised until Phase 1: pulp_g, pulp_tau, unreached limits, uncontacted skin.
