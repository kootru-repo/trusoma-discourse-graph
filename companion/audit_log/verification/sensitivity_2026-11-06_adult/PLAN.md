# Sensitivity probe of the 93 adult-sourced values, plan written before the run (2026-11-06)

**Question:** which of the 93 values set aside under the USER's no-adult rule change what the body feels, how it moves, or how the brainstem fires? The answer ranks them for fetal sourcing. A reading, not a proof. No learner runs. Ran without review under the 2026-10-22 ruling.

**Method:** the same as sensitivity_2026-11-05 (copied drivers and workers; the measures and the rule are unchanged). Members are the configuration keys with status adult-sourced-unusable.

| Part | Run | Groups (members) | Change |
|---|---|---|---|
| Body (sens_driver.py) | 12.5 weeks, mouth on, 20 s, seeds 0 and 1 | limits (7) | -15 and +15 deg |
| | | moment_arms (3), neck_shoulder (1), hand_hip (12), tissue (8), skin (19), transduction (3), muscle_timing (2) | x 0.75 and x 1.25 |
| Brainstem (loop_driver.py) | 12.5 weeks, 10 s (shortened from 15 s to stay under one hour), seeds 1 and 2 | delays (3) | -1 ms and +2 ms |
| | | counts (8), projections (19), reflex_terms (2), popnet (6) | x 0.75 and x 1.25 |

**Floors:** a 0.1% change to every member at once, on each seed.

**Rule (unchanged):** a group MATTERS if, on both seeds and in at least one direction, `pattern`, `where` or `structure` (plus `firing` in the brainstem part) exceeds both 0.05 and 3 times that seed's floor. A failed or refused run counts as MATTERS.

**Limits:**
- One drive, one body. 25% is arbitrary. Group members move together, so effects may cancel.
- The 10 s brainstem runs have lower power than the 15 s runs of 2026-11-05.

**Process:**
- Two processes (one per part); the RAM guard waits while load is at 90% or more (raised from 85% by the USER 2026-11-08) or commit charge is at 94% or more (added 2026-11-08 after a WinError 1455 at 99% commit).
- Other projects' processes are never touched.
- Resumable. Total under one hour of run time.
