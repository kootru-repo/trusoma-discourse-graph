# TruSoma fast probes (USER 2026-11-03)

"Probes should always take under an hour. Goal is to assess not prove." Ran without review under the 2026-10-22 ruling.

## Rules
1. A probe takes under an hour in total, scoring included, under a hard stop (`timeout 3300`).
2. Size it from measured rates before launch: about 45 minutes of learning and at most 10 of scoring.
3. A probe gives a reading: signal, no signal or unclear. It never gives PASS, or a verdict from a pre-registered stage.
4. Each report states how far learning got and what could change with more of it.
5. Sourcing rules and guards are unchanged. A probe never adds an unsourced method or constant to the brain package.

## What this replaces
The 5-11 h remainders of Stages 1b, 2b and 5 were stopped at 14:10 on 2026-11-03. Reading their checkpoints early breaks those pre-registrations, which required finished learning and the order 1b, then 2b and 5. Those stages can therefore no longer give a clean pre-registered verdict; a confirmation, if ever wanted, needs new seeds. The stopped checkpoints and pause_backup are kept.

## Probe 1: read the existing checkpoints
Copies under `C:\Projects\trusoma-archive\runs\trusoma_cortex\probe_2026-11-03`, scored by the existing harness, unchanged. Written before any number was read.

| Probe | Learned so far (full length) | Question | Signal means |
|---|---|---|---|
| 1b | 820-840 of 1000 s | Do sparse afferents stay alive and selective on simple input? | Rate at least 10 % of untrained and under 45 Hz; S_cv and C above shuffled on all seeds; S_cv above untrained |
| 2b | 1300-1320 of 2000 stimuli | Does orientation survive to spikes with sparse afferents? | Error below shuffled and untrained on all seeds; raw_matched, about 2.7 degrees, is reported beside it |
| 5 | 900 of 2000 stimuli | Is there a body map in the afferent weights? | per_column above shuffled and untrained on all seeds; raw correlation, 0.583, is reported beside it |

Measured time for the same scoring: Stage 1 about 1.5 minutes, Stage 2 about 5 minutes, weights-only Stage 5 expected in minutes.

What more learning could change: 2b's mean afferent weight has been flat at 0.0026-0.0027 since about stimulus 180, so more learning looks unlikely to help it. Stage 5's mean weight was still rising at stimulus 900 (0.0054 to 0.0057 over the last 120 stimuli), so its reading may understate the full run.

### Readings, 2026-11-03
Scoring took 7 minutes (14:12:30 to 14:19:23); the noise check below took under 15 more. Logs: `probe_2026-11-03\s1`, `s2b` and `s5`.

| Probe | Reading | Learned | Shuffled | Untrained | Raw |
|---|---|---|---|---|---|
| 1b S_cv | **Signal** | 0.989-0.992 | 0.375-0.400 | 0.207-0.216 | Not applicable |
| 2b error, degrees | **No signal** | 9.6-11.4 | 6.4-6.9 | 25.4-28.0 | raw_matched 2.6-2.8 |
| 5 per_column | **No signal** at 900 of 2000 | 0.0046-0.0053 | Mean 0.0031-0.0035, sd 0.0011-0.0015 | 0.0021-0.0039 | 0.583 |

Probe 1b: rate 4.1-4.2 Hz against 9.2-9.4 untrained; C 0.999-1.000 against shuffled 0.315-0.323; min_cover 0.130-0.196. Untrained already decodes the five groups at 1.000 in this sparse form, so decoding says nothing here.

Probe 2b: the sparse form changes the picture from the dense 40.8-44.9 degrees, so orientation now reaches spikes. But the same weights placed at random do better than the learned placement on every seed, so the improvement comes from sparse wiring and weight size, not from what the learner placed. It stays about 4 times worse than raw_matched at the same spike budget.

Probe 5: the script prints "VERDICT USEFUL | HEADLINE PROGRESSING" because 0.005 exceeds 0.004. **That line should not be read as a result.** A check added after seeing it, `probe5_noise.py` with 20 shuffles per seed, puts learned at z 1.0-1.3 and inside the shuffled range on every seed. Mean weight was still rising, so the full run could differ, but the gap to raw correlation is over 100 times.

Nothing here counts as a stage verdict. Why learned placement does worse than random is unknown.

## Next, by reading
- 2b signal: sparse probes of Stages 3 and 4, under an hour each.
- 2b no signal: this route looks closed. The next step is to source a relay, then probe it.
- 2b unclear: one fresh probe on new seeds, under an hour.

## Sizing fresh probes
Rates under the 9-run load, 2026-11-03:
- Touch learning: about 15 s per stimulus, so 45 minutes gives about 180 stimuli.
- Stage 1 input: about 24 s per simulated second, so 45 minutes gives about 110 s.

Learning curves that say whether this is enough:
- Stage 1b's C reached 0.88 by 110 s and 0.95 by 210 s.
- Stage 2b's mean weight plateaued by stimulus 180.
- Stage 5's mean weight was only 0.0012-0.0026 at stimuli 120-240, against 0.0057 at stimulus 900, so a fresh map probe would be under-learned and must say so.

## Growth probe, 2026-11-04
No signal: a learner that doubles twice by division forms no better map than the fixed learner, at about 40% less estimated compute and with no sign of collapse. `TRUSOMA_GROWTH_PROBE.md`.

## Scorer positive control, 2026-11-09
No learner ran; 52 s. `audit_log/verification/research_grade_2026-11-09/RESULT.md`.
- **The Stage 5 scorer is not blind.** A perfect map at the learner's wiring (80 of 952 afferents, about 3.5 shared units per channel pair) scores `per_column` 0.110 against 0.003 shuffled. Probe 5's learned 0.005 was a fair no signal on that readout, at about 4% of its ceiling.
- **Stage 5's COMPETITIVE bar (raw 0.583) could not be reached** at this wiring: the ceiling is 0.110, and 0.675 with all afferents.
- **Exploratory signal on a direct readout.** Each unit's 10 strongest afferents sit 7-8% closer on the skin than its own wiring gives by chance on all three kept checkpoints (z -5.8 to -9.8), and 9-15% after a shared channel preference is divided out (z -9.2 to -17.6). The oracle is 68% closer. Post hoc and on three checkpoints, so a hypothesis for a pre-registered replicated probe, not a reading of a map.

## The body's own touch, 2026-11-09
No learner ran. 180 simulated seconds, 3 brainstem seeds, 860-1060 s of wall time each. `audit_log/verification/research_grade_2026-11-09/RESULT_B1.md`.
- **52-106 of 230 live skin units are ever touched.** Thumbs, palms, left fingers, soles and the upper gum ridge never are; nearly all contact is in the mouth.
- **Signal for surface identity in the raw input:** same-surface partners 0.68-0.82 against 0.16-0.28 time-shuffled, on every seed.
- **No signal for neighbour order within a surface** in the raw input: contact covers most of a surface at once, on grids of 9 or 16 units.
- What more could change: three minutes holds about one general movement, so hand contact may appear in a longer window.
