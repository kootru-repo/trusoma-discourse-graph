# Sensitivity probe of the fetal values, plan written before the run (2026-11-05)

**Question:** which of the 162 unsourced fetal values change what the body feels and how it moves, enough to be worth sourcing? A reading, not a proof. No learner runs, so this is not a test of a learner. Ran without review under the 2026-10-22 ruling.

**Run:** body at 12.5 weeks with mouth on, skin without noise, 20 s, a fixed test drive of 3 random joints every 150 ms, seeds 0 and 1. The drive is a mechanical test input, not a claim about fetal drive.

**Groups:** each group's values are changed together, and only inside this process; the configuration is not edited.

| Change | Applied to |
|---|---|
| x 0.75 and x 1.25 | Face, mouth, rest posture, hand and hip, moment arms, skin receptors, tissue, neck and shoulder, cord and uterus, muscle size |
| - 15 and + 15 degrees | Joint limits |

Covered: 136 of the 162. Not covered: head growth anchor (acts below 12 weeks), and the brainstem, nerve path and sleep groups (no brainstem runs here). These 26 need a separate reading.

Corrected before any result was read: the first launch stopped at 3.8 s because the body's guard refuses hand-face contact with the mouth on. The run now uses `oral_guard="report"`, which logs those events and does not stop. Hands still cannot enter the mouth in this body: `oral_hands` is marked unsafe for runs in the code.

**Measures, each against the same seed with unchanged values:**
- `pattern`: 1 - correlation of mean current per channel.
- `amount`: absolute log ratio of total current.
- `where`: total variation distance of contact share by surface, 0 to 1.
- `structure`: 1 - correlation between channels' pairwise correlation matrices, the signal a body map could learn from.
- `movement`: RMS change in joint mean and in joint spread, radians.

**Floors:** the same measures for a 0.1% change to every group at once (chaos in the contact mechanics), and for a different seed (a different drive).

**Rule, fixed before the run:** a group MATTERS if, on both seeds and in at least one direction, any of `pattern`, `where` or `structure` exceeds both 0.05 and 3 times the 0.1% floor on that seed. A run that fails or is refused counts as MATTERS, and is reported as such. Otherwise the group is MINOR at this range.

## Part 2, written before its run: the 26 not covered

**Run:** the brainstem drives the body and skin at 12.5 weeks, mouth on, 15 s, seeds 1 and 2 (`loop_worker.py`, `loop_driver.py`). No learner.

**Groups:** brainstem delays (-1 ms and +2 ms, floor 1), receptors and GABA, depression and timing, nerve paths, sleep and wake (x 0.75 and x 1.25; the x 1.25 run also flips transmitter signs), head growth anchor (x 0.75 and x 1.25). One extra reading, not ruled on: `nmda_frac` 0.65 and `tau_nmda_ms` 50 as Wu 2026 suggests.

**Measures:** as above, plus `firing`: 1 - correlation of mean rate per population.

**Rule:** as above, with `firing` added to `pattern`, `where` and `structure`. The floor is a 0.1% change to all 26 at once.

## Limits of both parts

**Limits:** one drive and one body; a 25% change is arbitrary and some sources disagree by more; groups move together, so effects may cancel. A MINOR group is a candidate for declaring, with this range and result as its evidence, and is not shown to be harmless.
