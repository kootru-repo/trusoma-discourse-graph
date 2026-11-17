# Sensitivity probe of the fetal values: result (2026-11-05)

A reading under an hour, not a proof. No learner ran. Plan fixed before the runs: `PLAN.md`. Scripts and raw results are beside this file; verdicts come from `apply_rule.py`. Ran without review under the 2026-10-22 ruling. Each value is listed in `companion/source_audit/declared_values.csv` and the master database's `declared_values` table.

## Verdicts

| Group | Values | Verdict | Largest reading | What it means |
|---|---|---|---|---|
| Mouth proportions | 24 | MATTERS | `pattern` 0.52, `where` 0.33 | Clear on both seeds |
| Joint limits | 13 | MATTERS | `pattern` 0.43 at +15 degrees | Only on widening; -15 degrees stayed small |
| Rest posture | 23 | MATTERS, by refusal | x 1.25 cannot build | Limbs collide at rest, so the rule counts it. The runs that did build stayed under the rule |
| Neck and shoulder | 6 | MATTERS, by refusal | x 0.75 cannot build | The same |
| Hand and hip | 11 | MATTERS, by refusal | x 0.75 cannot build | The same |
| Face | 29 | MINOR | `where` 0.12, one seed | |
| Moment arms | 10 | MINOR | below the rule | At 25%; the knee source differs by about 3 times |
| Muscle size | 1 | MINOR | below the rule | |
| Cord and uterus | 4 | MINOR | below the rule | |
| Tissue | 6 | MINOR | near zero | |
| Skin receptors | 9 | MINOR | below the rule | Noise was off, so the noise term was not tested |
| Brainstem delays | 5 | MINOR, low power | inside the floor | |
| Receptors and GABA | 5 | MINOR, low power | inside the floor | |
| Depression and timing | 4 | MINOR, low power | inside the floor | |
| Nerve paths | 2 | MINOR, low power | inside the floor | |
| Sleep and wake | 9 | MINOR, low power | `firing` 0.41, about twice the floor | Sleep scope, deferred |
| Head anchor | 1 | NO EFFECT | exactly 0 on every measure | Clean: it acts only below 12 weeks |

Totals: 77 MATTERS (40 of them by refusal alone), 84 MINOR, 1 no effect.

## How far to trust this

- **The system is chaotic.** A 0.1% change to every value moved `firing` by 0.18-0.19, `structure` by up to 0.31 and `where` by up to 0.41 in the brainstem runs, as much as another seed. So MINOR means "not separable from chaos in this run length", not "harmless". This is weakest for the brainstem groups, marked low power.
- **The range is arbitrary.** 25% is smaller than some known disagreements.
- **The rule counts a refusal as MATTERS.** The three refusal groups show the rest pose is tightly packed, not that their values change touch.
- **Test drive.** Part 1 used a random drive, not the brainstem. One body.
- **Hands at the face** ran in the guard's report mode, on the rigid-ball face.
- **Wu 2026 values** (`nmda_frac` 0.65, `tau_nmda_ms` 50) stayed inside the floor: `firing` 0.07-0.09. A halved NMDA decay does not visibly change this run, which does not make either value right.

## What the refusals were (read after the verdicts)

The refused runs overlapped at rest, and small joint changes cleared them: hand and hip x 0.75, 1.95 mm, cleared with hips +1 and -4 degrees; neck and shoulder x 0.75, 0.44 mm, cleared with neck flexion -2 degrees; rest posture x 1.25, 2.35 mm, cleared with right shoulder abduction +3 and hips -5 and -7 degrees (`overlap.py`, `clear.py`). These poses belong to the test changes only. The real body has no overlap at rest, so no value changed. It weakens the MATTERS label on those 37 unsourced values: they were not measured. A rerun with these poses would give them a measured reading.

## Sourcing done on what matters

Four values linked; sourced goes from 290 to 294 of 945.

| Value | Model | Evidence |
|---|---|---|
| `rest_fit_rad.l_hip` | 119.1 degrees | Takakuwa 2023: fetal hip flexion mostly 90-120; 119.6, sd 4.3, CRL 45-75, n = 5 |
| `rest_fit_rad.r_hip` | 109.1 degrees | Same printed range; below the local readings |
| `rest_fit_rad.l_sh_flex` | 56.5 degrees | Kumano 2022 nominal 59.0 at 12.5 weeks |
| `oral7.tongue_thick` | 0.45 | Kaiser 2024 scan, my reading by eye: 3.75 mm over 7.5 mm, 0.50 +/- 0.06, one specimen |

The links were checked by me, not blind; reviews are suspended.

**Compared and not linked:**

| Value | Model | Evidence |
|---|---|---|
| `r_sh_flex` | 34.3 degrees | Kumano 59.0: 25 degrees low |
| `l_sh_abd`, `r_sh_abd` | -31.6, -34.7 degrees | Kumano nominal +33.7: same size, opposite sign, M-075 |
| `l_knee`, `r_knee` | 47.3, 24.0 degrees | Takakuwa about 90 at CS23; no fetal value printed |
| Elbows | 11.3, 27.3 degrees | Sourced table holds 70 by a rule. Ohmura 2018 shows extended arms in living fetuses, with no angle |
| Palate vault | `roof_v` 0.3 | Scan about 0.14, read across a closed mouth |
| `floor_drop` | 0.885 | Scan about 1.07 +/- 0.15 |

**Limits, 13:** no fetal range found. Mondal 2022 (newborns) is paywalled, and Ohmura 2018 and similar 4D studies give frequency rather than range. Declared.

**Mouth, 23 left:** most are modelling terms of the mouth's surfaces with no anatomical definition, so one specimen cannot source them. Declared.

**Hand and hip, neck and shoulder:** sources that disagree wait for the chart rewrite; the rest have no defined counterpart. Declared.

158 fetal values are now declared, each with its range and reading.
