# Pre-registration: does the learner group the body's own touch by surface? (2026-11-10)

Written and committed before any learning run for it starts and before any of its checkpoints exists. It is rung B2 of S1 in `RESEARCH_GRADE_PLAN_2026-11-09.md`, run under S2 (replicated finished probes, sealed scoring), and it is the pre-registered test of join J16 that audit item L-036 asks for. Ran without review under the 2026-10-22 ruling. Decided under FULL DELEGATION; logged in DECISIONS_PENDING.

## 1. Why
- The learner has so far only seen TouchSim input from an adult fingertip. On it, its units form weak local fields (`TRUSOMA_FIELD_PREREG_2026-11-09.md`, 10 of 10 seeds).
- The 12.5 week body's own touch says which surface a skin unit is on: in the transduction currents, a unit's 3 strongest partners are on its own surface 0.69-0.82 of the time (`audit_log/verification/research_grade_2026-11-09/RESULT_B1.md`). It does not say which units are neighbours within a surface, so this test is about surfaces only.
- The learner has never been given this body's touch.

## 2. Question
Starting from uniform random wiring, do the learner's units come to weight together the afferents of one surface, on the body's own touch, by a rule fixed here?

## 3. Join J16, listed here: the body's afferents into the learner
| Item | Choice | Evidence |
|---|---|---|
| What feeds the learner | The brainstem's own SA-I and FA-I afferent units, 2 per skin unit, 536 in all. They already exist in `brainstem_s2.py` and are driven by `skin7` through `transduction7.py`; nothing is added to the brain package | The sourcing of those units is that of the brainstem and skin (the six bound documents) |
| The signal | Each afferent unit stands for 100 afferents; the engine holds the fraction of them that spiked in each ms. One learner channel per unit; its rate in a 1 ms bin is that fraction times 1000 per s, so the learner draws a spike with that probability. This is the signal the unit already sends to its own targets | No source runs this pairing. The join is **listed, evidence indirect**, as J6 was |
| Not tested | One channel per single afferent (53,600 channels), or the summed count as the rate | - |
| Recording | `b1_worker.py`: the body, skin and brainstem in closed loop, no value changed, 420 simulated s, brainstem seeds 4, 5, 6. Spikes of the afferent units, every ms. Files `seed_{4,5,6}_420s_spikes.npz` in `local/runs/research_grade_2026-11-09/b1` | SHA-256 in section 8 |

## 4. Method
| Item | Choice |
|---|---|
| Learner | Sparse form, `predictive_net.py` unchanged, 536 inputs; joins J1-J8 as before, J16 in place of J6 |
| Harness | `audit_log/verification/research_grade_2026-11-09/b2_skin7.py`, launched by `b2_launch.sh` |
| Input order | The recording, in recorded order, from its start |
| Seeds | Learner seeds 20 to 29, never used before. Seed s replays the recording of brainstem seed 4 + (s mod 3) |
| Learning length | L = 240 simulated s for every seed (sizing, section 8) |
| Untrained arm | Same harness and seeds, 10 simulated s with plasticity off: its afferent weights are the starting weights |
| Null | Each unit's learned weights permuted among its own afferents, 20 draws per seed |
| Processes | 3 at a time; each run is its own probe under an hour, with the harness's wall limit |

**Finished.** A run is finished when its checkpoint says `done` = 240000 ms. A run that pauses at its wall limit, or is killed from outside, is resumed once. A seed still unfinished after that counts as **not grouped**.

## 5. Endpoint
Each afferent's weights are first divided by their mean over the units that afferent reaches, so a preference that every unit shares (for a touched surface, say) does not count. Two afferents are then similar when the same units weight both. **Endpoint:** the fraction of an afferent's 3 most similar afferents that are on its own surface, averaged over all 536 afferent units (`b2_score.py`, function `partner`). It is the quantity `b2_raw.py` reads from the spikes themselves.

A seed is **grouped** when its learned value is above its untrained value **and** above every one of its 20 null draws.

## 6. Reading, fixed now
| Grouped seeds, of 10 | Reading |
|---|---|
| 9 or 10 | Replicated signal |
| 8 or fewer | Not replicated |

Reported as "replicated reading, k of 10", never PASS. Reported beside it and deciding nothing: the same value without the division; the surface contrast (between-surface share of a unit's weight variance); the same-surface share among a unit's 10 strongest afferents; the learner's firing rate at the end; the paired difference learned minus untrained with a bootstrap interval.

## 7. What a result would and would not mean
- **The readout is blunt, and that is known before the run.** A unit has 80 afferents over 24 surfaces, 3 to 4 per surface. On synthetic weights (`b2_score_dry.log`) the endpoint detects a unit preferring one surface when that surface's weights are doubled, is borderline at one and a half times, and misses 20%. A preference all units share is ignored at every size, as intended.
- **The input is weak, and that is known too.** In the afferent spikes the raw value is 0.07-0.10 over all units against at most 0.06 time-shuffled, and 0.19-0.24 among afferents of touched skin against at most 0.20 (`b2_raw_420s.log`). The currents gave 0.69-0.72. Most of what the skin says is lost between current and spike: afferents fire at 0.65 per s untouched and 0.66 touched.
- **Signal** would mean the rule groups afferents by surface from uniform wiring on the body's own touch in 4 minutes. Not a map within a surface; not the hand (no hand unit is touched in these recordings).
- **Not replicated** would mean no preference of about one and a half to two times within 4 minutes on this input. It would not separate the learner from the input, since the input holds little. The next step would then be the afferent stage, not the learner.
- **Three recordings, ten seeds.** The seeds differ in wiring and in their own draws, not in what the body did. The count is over learners, not over bodies.

## 8. Sizing, done before this document (2026-11-10)
- Three throwaway runs (seeds 97-99, 20 simulated s each, one per recording) started together took 193, 193 and 194 s: **9.7 s per simulated s**. The learner fired: 0.4 per s in the first 10 s, 0.7 in the second. Their checkpoints were deleted unscored; the timing logs are `sizing_s97.log` to `sizing_s99.log` in the run folder.
- 2400 / 9.7 = 247, so **L = 240 simulated s**, about 39 minutes per run, under the harness's 3300 s wall limit.
- Run folder: `local/runs/research_grade_2026-11-09/b2`.
- Recording hashes (SHA-256): `seed_4_420s_spikes.npz` 66856c5a2b328271a9695d9d1ca07934c5da138085213d183ee99c928ae8721f; `seed_5_420s_spikes.npz` 5b23e4cd8d20fccc69252387639300e4e214644523f7e3aecb7e6c90c4cec30a; `seed_6_420s_spikes.npz` b19efea1acdecc78ba91f62b6e151e300370f13a897e91f40dca943a8dcb60c0.
- Order of launches: the 10 untrained runs, then learned seeds 20-22, 23-25, 26-28, 29.

## 9. Sealed scoring
`b2_score.py` refuses to run unless all 10 learned checkpoints exist with `done` = 240000 and all 10 untrained checkpoints exist. It prints the SHA-256 of each file, then scores all of them in one pass. No checkpoint is opened by any other script before that. No criterion changes after the result, and no tuning.

## 10. Result, appended 2026-11-10
**Not replicated: 1 of 10 seeds grouped** (criterion: 9 or more). Scored once, all 20 checkpoints in one pass, by `b2_score.py` unchanged; output and the 20 SHA-256 values are in `audit_log/verification/research_grade_2026-11-09/b2_score.log`. All 20 runs finished without a resume.

| Seed | Learned | Untrained | Null max | Grouped | Firing at the end, per s |
|---|---|---|---|---|---|
| 20 | 0.0466 | 0.0485 | 0.0628 | no | 1.26 |
| 21 | 0.0522 | 0.0479 | 0.0622 | no | 1.13 |
| 22 | 0.0367 | 0.0392 | 0.0591 | no | 1.14 |
| 23 | 0.0417 | 0.0498 | 0.0634 | no | 1.28 |
| 24 | 0.0404 | 0.0354 | 0.0616 | no | 1.12 |
| 25 | 0.0535 | 0.0653 | 0.0603 | no | 1.06 |
| 26 | 0.0479 | 0.0529 | 0.0535 | no | 0.90 |
| 27 | 0.0417 | 0.0435 | 0.0566 | no | 0.98 |
| 28 | 0.0522 | 0.0535 | 0.0684 | no | 1.08 |
| 29 | 0.0616 | 0.0535 | 0.0603 | yes | 1.30 |

Reported, deciding nothing: mean endpoint learned 0.0475, untrained 0.0489, null 0.0473; learned minus untrained -0.0015, bootstrap 95% -0.0051 to 0.0021. The surface contrast (0.263-0.279 learned against 0.259-0.276 untrained) and the same-surface share of the 10 strongest afferents (0.044-0.050 against 0.046-0.050) show nothing either.

**Reading, as fixed in section 7.** The learner fired (0.9-1.3 per s) and learned nothing about surfaces in 4 minutes: learned sits on untrained and on the null. This does not separate the learner from the input. The input held little (0.07-0.10 against 0.06 shuffled) and the readout only catches a preference of one and a half to two times. The next step is the afferent stage, where the skin's signal is lost between current and spike, not the learner.

No deviation from this document.
