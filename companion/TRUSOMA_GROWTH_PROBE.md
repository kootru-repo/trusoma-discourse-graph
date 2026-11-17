# Growth probe: does a learner that grows by division learn a better map? (2026-11-04)

Written before any score from this probe. A probe gives a reading, never a pass (TRUSOMA_PROBES.md). USER 2026-11-04 approved this probe as step 3 of the plan in audit item M-057. Ran without review under the 2026-10-22 ruling.

**This is a hypothesis probe, not the TruSoma learner.** It has unsourced joins, so the script carries no brain lane marker and nothing here enters the brain package. It does not test the cortex: the one-cortex merge stays open, and `ONE_CORTEX_MERGE_DESIGN.md` still says a fully sourced merge is not possible today. It asks only whether growth by division changes the afferent map the learner forms.

## 1. Question
On Stage 5's touches, with no position information, does the sparse learner that starts at 125 + 125 units and doubles twice by division reach a different map than the same learner at 500 + 500 from the start?

## 2. Methods
| Method | Status | Source |
|---|---|---|
| Learner, sparse form | Unchanged; only its size names are set from the harness | K15; `predictive_net.py` |
| Stimuli, order, scorer | Unchanged | `TRUSOMA_STAGE5_MAP.md`; `map_readout.py` |
| Daughter = parent + deviation | Read, transferred | Kerstjens, Michel & Douglas 2022, Algorithm 2, for gene expression |
| 20% of divisions symmetric, no deviation | Read, transferred | The same, Algorithm 2 |
| One rule per cell type; random wiring drawn from that rule | Read, as an argument | Kerstjens & Zador 2026 |

## 3. Joins, unsourced and declared
1. The division rule is applied to afferent weights. The source applies it to gene expression.
2. The deviation's size is the learner's initial afferent spread. The source's size has no meaning for weights.
3. Daughters inherit the parent's afferent mask, so the final 500 units share 125 masks. This is the address idea in its simplest form: lineage alone decides what a unit samples. Address never comes from skin position.
4. Recurrent wiring is redrawn by the same `P_CONNECT` rule at the new size. A new synapse keeps the parents' learned weight where the parents were connected and otherwise takes the initial weight, then is divided by the root of 2, as the initial weights scale with size.
5. Start size and schedule: two rounds, 125 to 250 at a quarter of the stimuli and 250 to 500 at half. The source's cell-cycle times are random; this probe's rounds are synchronous.

Nothing in this probe uses 12.5 week data. Its transfers are Stage 5's: passive contacts on one adult fingertip.

## 4. Arms
| Arm | How | Stimuli |
|---|---|---|
| grown | `growth_probe.py`, seeds 0, 1, 2 | Up to 900 |
| grown_untrained | The same divisions with no touch and no learning | 0 |
| fixed | The existing Stage 5 checkpoints, not rerun | 900 |
| shuffled | Each unit's weights permuted, 20 draws per seed | Same as its arm |
| raw correlation | Existing value, 0.583 | |

grown_untrained is essential: inherited masks give channels shared units with no learning at all, so a raw score could come from the wiring rule alone. Reusing the fixed checkpoints saves an hour of compute and keeps the same stimuli and order, but they ran earlier on the machine, which affects time and not results.

## 5. Readings, fixed now
Metric: `per_column`, as in Stage 5.
- **Signal:** on all seeds grown is above the largest of its 20 shuffled draws, and above grown_untrained.
- **Better than fixed:** on all seeds signal holds, and grown is above fixed. Fixed itself read no signal: per_column 0.0046-0.0053, inside its shuffled range.
- **No signal:** anything else. A score from wiring alone counts as no signal for learning.
- Raw correlation is reported beside these and decides nothing.
- Also reported: firing rates, since Stage 1's range for a healthy unit is at least 10% of untrained and under 45 Hz, and mean afferent weight.

Limit on the time: about 45 minutes of learning, 10 of scoring, hard stop under an hour. If a seed stops before 900 stimuli, the report says how far it got, and the comparison with fixed is unequal. The fixed arm's own map had not finished learning at 900 stimuli, and this one will have spent only half its stimuli at full size. A no signal here does not rule out growth, and a signal would still need a fixed arm rerun with the same channels.

## 6. Reading, 2026-11-04: no signal
All three seeds reached 900 stimuli in 46 minutes, three at once. Scoring took under a minute. Log: `C:\Projects\trusoma-archive\runs\trusoma_cortex\probe_growth_2026-11-04`.

| Seed | grown | Largest shuffled | grown_untrained | fixed |
|---|---|---|---|---|
| 0 | 0.00560 | 0.00525 | 0.00140 | 0.00525 |
| 1 | 0.00350 | 0.00525 | 0.00385 | 0.00455 |
| 2 | 0.00350 | 0.00630 | 0.00420 | 0.00455 |

- **Signal: no.** Only seed 0 clears its shuffled range, and seeds 1 and 2 fall below the same wiring with no learning.
- **Better than fixed: no.** Seed 0 is above fixed; seeds 1 and 2 are below. Every score here is about 100 times below raw correlation, 0.583, so these differences are small against the input's own structure.
- **Growth did no visible harm.** Firing rates at the end were 3.2-3.3 Hz in E units against 3.35 for fixed on seed 0, and mean afferent weight 0.0056-0.0057 against 0.0057. Division did not collapse the network.
- **Time saved, an estimate.** The first 450 stimuli, below full size, took about 380 s; the last 450, at full size, about 2,360 s. Had the first half also run at full size, it would have taken about 4,700 s in total against 2,740 s, about 40% less. The fixed arm was not rerun alongside, so this is extrapolated.

What more learning could change: mean afferent weight was still rising at stimulus 900 in every grown seed, as in the fixed arm. Half of the grown arm's stimuli were below full size. What this probe does not show: anything about the cortex, about growth with mouth or body input, or about the other joins' alternatives, such as redrawn masks or asynchronous division. The map problem seen in Stage 5 is unchanged: this learner's afferent weights do not carry the skin map, grown or not.

