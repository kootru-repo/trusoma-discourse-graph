# Research-grade plan: seven solutions (2026-11-09)

USER 2026-11-09: "assess this trusoma project and what it will take for it to be successful and leveragable at the research grade level", then "plan and document superior solutions for each of these 7 in detail". This is a plan. Nothing here is built, no value is bound and no brain code changes. Ran without review under the 2026-10-22 ruling. Decisions taken under FULL DELEGATION are marked **Decided** and logged in DECISIONS_PENDING.

The seven findings, in the order of the assessment:

| # | Finding | Solution in one line |
|---|---|---|
| S1 | No run has shown a body map | Prove the instrument can see a map, then the input carries one, then run the learner on `skin7` |
| S2 | Probes give readings, never results | Confirm by replication of small finished runs with sealed scoring, inside the hour rule |
| S3 | Growth is validated by citation, and most links have none | Calibrate on normal growth, validate on a perturbation the model never saw; build two testable loops first |
| S4 | The body is a generated sculpt | A dimension table with measured spreads, a per-segment morph to it, and a staged-embryo start shape |
| S5 | A sourcing count is not model validity | A range for every value, and the map endpoint read across those ranges |
| S6 | Nobody outside can use it | Three releasable units, one-command reproduction, a tree with no unexplained failure |

Every fact below carries its check. "Lead" means a paper found by search today and **not read**: a hypothesis until read and logged, never a source of a method or value.

---

## S1. A body map on the 12.5 week body

### What is wrong
- 0 map results. Stage 2 failed (40.8-44.9 degrees, chance about 45). Probe 2b: learned placement worse than the same weights shuffled. Probe 5: learned 0.0046-0.0053 against shuffled 0.0031-0.0035, z 1.0-1.3, and raw correlation 0.583. Check: `TRUSOMA_PROBES.md`, `TRUSOMA_SOURCING_STATUS.md`.
- The learner has never seen this body. It takes TouchSim input (an adult fingertip), not `skin7`. Check: `source_audit/GLOBAL_CONFIG_AND_DB.md`, Limits; audit L-036.

### Why "run the baseline" is not enough
Three different faults give the same "no signal", and the runs so far cannot tell them apart.

1. **The instrument may be blind.** Stage 5 scores channel similarity as `w_in.T @ w_in`. Each E unit gets 80 of 952 afferents drawn uniformly at random (`tools/trusoma/brain/predictive_net.py`, line 37). So a pair of channels shares 500 x (80/952) x (79/951) = **3.5 units** on average. Similarity estimated from 3.5 units is mostly noise whatever the learner did. Stage 5's own text names the cause ("most channel pairs share few units") but never measured the ceiling. This is arithmetic from the code, not a run.
2. **The input may carry no map.** On TouchSim it does (raw 0.583). On `skin7` at 12.5 weeks nobody has looked. Movement takes 2% to 12.5% of the time at 8-10 weeks and hand-face contact starts at about 10 weeks (`TRUSOMA_COUPLED_GROWTH_PLAN.md`, sections 0 and 3.1), so contacts may be too rare or too stereotyped.
3. **The learner may start from the wrong state.** The project's own sourcing says the trigeminal map at this age is a pre-pattern that activity then refines (join J9; `MERKER_ALIGNMENT_2026-11-07.md`, section 7.3: "the Phase 1 learner therefore models the start of refinement"). The code starts every unit from uniform random wiring, with no pre-pattern. The sourced claim and the built start disagree.

### The solution: a ladder of four rungs, each under an hour, each able to stop the climb

| Rung | Question | What runs | Learner? | Time | Stops the climb if |
|---|---|---|---|---|---|
| B0 | Can the scorer see a map through this wiring? | Oracle weights under the real sparse mask, scored by `map_readout.py` unchanged | No | Minutes | The oracle scores near shuffled: the scorer is replaced before anything else is run |
| B1 | Does `skin7` input carry a map? | Record `skin7` currents from the 12.5 body under the brainstem's own movement; score raw correlation per surface; count contacts per surface per simulated minute | No | Under an hour, cached | Raw shows no map on any surface: the problem is the world's contact statistics, not the learner |
| B2 | Does the learner add a map on `skin7`? | The unchanged learner on the cached currents, sized by S2 so learning finishes | Yes | S2 protocol | Learned is not above shuffled and untrained: go to B3 |
| B3 | Is it the start state or the rule? | The starting-wiring question (below), then the relay route already planned | Yes | S2 protocol | - |

**B0, the positive control.**
- Build weights no learner made: each unit gets a random centre on the skin and weights that fall off with true distance from it, kept only on that unit's 80 real afferents. Score it exactly as Stage 5 does. Also score it at 160, 320 and all 952 afferents.
- Reading: the oracle's `per_column` is the most this scorer can report at this sparsity. Every later learner score is reported as a fraction of it.
- If the ceiling is low, add a second readout that does not need shared units: for each unit, the mean true distance among its 10 strongest afferents, against the same number for its own mask drawn at random. This reads each unit's field directly.
- Both are evaluations. No unit reads them, skin positions enter only through the scorer, and nothing enters the brain package.

**B1, raw input first.** This repeats Stage 5 section 3 ("raw-only check, before any learner") on the real body. It records, per surface: contacts per simulated minute, the fraction of live units ever touched, and the raw correlation map score. The recording is cached to disk outside the brain package, as `touchsim_cache.py` does for TouchSim, so every later learning probe replays it without physics. **Decided:** the mouth surfaces go first (mouth-first ONE map rule), the hand second.

**B2, the learner.** Gate: the `skin7`-to-learner join is listed with its evidence and gets its own pre-registration, as L-036 requires and the 2026-11-03 definition allows. Arms per seed, as Stage 5: learned, untrained, shuffled, raw correlation, plus the B0 oracle as ceiling. Endpoint, brain lane: learned above shuffled and untrained on every seed. Raw and oracle are reported beside it.

**B3, the start state.** Before any code: a method record for the starting wiring, from sources already read in this project (Humphrey 1952: the tract already separates ophthalmic from maxillo-mandibular fibres by 22 mm; Iwasato 1997, Kutsuwada 1996 and Erzurumlu 2010 under J9). Two limits apply and are kept:
- no shortcut priors: a coarse order inside one surface is not the mouth teaching the hand, but a hand-placed map would be;
- no hard-coded anatomy: in the full plan the pre-pattern must come from growth (loop L6, address by lineage), not from a table.

So B3 runs the start state only as a labelled reference arm, with wiring probability falling off with distance at three widths and today's uniform draw as the fourth. Its reading is "how much pre-pattern does this rule need to refine a map", which is the number the growth loops must then deliver. It never replaces the learner's design by itself.

### Outcomes and what each one means
| B0 | B1 | B2 | Meaning | Next |
|---|---|---|---|---|
| Blind | - | - | Probe 5's "no signal" says nothing | New readout, re-score the kept Stage 5 checkpoints |
| Sees | No map in raw | - | The body does not touch itself enough, or too uniformly | World and movement work; no learner change |
| Sees | Map in raw | Signal | First positive result | S2 confirmation |
| Sees | Map in raw | No signal | The learner is the fault | B3, then the relay (L-041) |

### Deliverable
One table: oracle ceiling, raw, learned, shuffled, untrained, per surface, per seed. It is the baseline growth must beat (growth plan, step 2).

### B0 result (run 2026-11-09, 52 s)
`audit_log/verification/research_grade_2026-11-09/RESULT.md`.
- **The scorer is not blind; fault 1 above is refuted.** A perfect map at 80 afferents scores 0.110 against 0.003 shuffled. Probe 5's no signal stands on that readout, at about 4% of the ceiling.
- **The raw bar of 0.583 was unreachable** at this wiring (ceiling 0.110). It is dropped as a criterion; `per_column` is reported as a fraction of the ceiling.
- **The direct field readout finds weak local fields** in the three kept checkpoints: 7-8% closer than chance (z -5.8 to -9.8), 9-15% with a shared channel preference removed. Exploratory and post hoc.
- **Consequences.** The field ratio is the primary endpoint candidate for B2. Fault 3 weakens: the rule builds some locality from uniform wiring, so B3 moves behind B2 and runs only if B2 shows no growth of the field ratio with learning.
- **Confirmation pre-registered:** `TRUSOMA_FIELD_PREREG_2026-11-09.md`, 10 fresh seeds at 460 stimuli, sealed scoring. Its result is appended there.

### B1 result (run 2026-11-09, 180 simulated s, 3 seeds)
`audit_log/verification/research_grade_2026-11-09/RESULT_B1.md`.
- **Fault 2 is partly real.** Of 230 live units, 52-106 are ever touched in three minutes. Both thumbs, both palms, the left fingers, both soles and the upper gum ridge are never touched; nearly all contact is inside the mouth.
- **The input carries surface identity:** a unit's 3 strongest partners are on its own surface 0.68-0.82 of the time, against 0.16-0.28 time-shuffled, on every seed.
- **The input carries no neighbour order within a surface:** no surface beats its time-shuffled draws. Contact covers most of a surface at once (15 of the tongue's 16 units), and each surface has only 9 or 16 units.
- **Consequences.** B2 on `skin7` is pre-registered on surface grouping, where the raw bar is 0.68-0.82, not on within-surface neighbours. The limit on a body map here is the world: which skin is touched and how locally. Hand surfaces need contact before any learner can place them. A longer window is the first check, since three minutes holds about one general movement.

---

## S2. A confirmed result inside the hour rule

### What is wrong
- A probe "never gives PASS" (`TRUSOMA_PROBES.md`, rule 3). Stage 5's full run needs 2000 stimuli at about 15 s each under load: 8.3 hours. 45 minutes gives about 180.
- Reading the stopped checkpoints early ended three pre-registrations (same file, "What this replaces").
- Three seeds cannot separate a small effect from a chaotic floor.

### Why "lift the cap once" is the weaker answer
It needs the USER, it repeats the 5-11 hour runs that were stopped, and one long run is still one sample. The evidence a reviewer wants is not duration. It is: learning finished, the criteria were fixed first, nobody looked early, and it happened again on new seeds.

### The solution: replicated finished probes with sealed scoring

1. **Shrink the experiment until learning finishes in 45 minutes.**
   - One surface, not the whole body. The lips and face go live first (64 units at 9 weeks; growth plan, section 0.1).
   - Size the learner to the surface. A sizing probe measures stimuli-to-plateau at two sizes and the rest is extrapolated (extrapolate-dont-rerun).
   - The existing curves say this is reachable: Stage 2b's mean afferent weight was flat by stimulus 180, which fits 45 minutes; Stage 5 at full size was still rising at 900, which does not.
   - Rates are re-measured without the 9-run load, on cached input (S1, B1), before sizing.
2. **Define "finished" before the run.** The pre-registration states a plateau rule on the mean afferent weight: change over the last fifth of learning below a stated fraction. A run that misses it is reported as unfinished and not scored.
3. **Replicate instead of lengthening.** Each seed is its own complete probe under an hour. The pre-registration fixes N = 10 seeds, the arms, the endpoint and the finish rule. At 3 processes at a time this is four launches.
4. **Seal the scoring.** One scoring script refuses to run until all N final checkpoints exist, logs their hashes, and scores them in one pass. No interim number can be read, by construction. This closes the 2026-11-03 failure mechanically, not by intention.
5. **State the result as counts and an effect size.**
   - Learned above shuffled on 10 of 10 seeds has a one-sided sign-test probability of 1/1024, about 0.001, if learning did nothing. 9 of 10 gives 11/1024, about 0.011. Fewer than 9 is not a result.
   - Beside it: the paired difference with a bootstrap interval, the score as a fraction of the B0 ceiling, and the z against 20 shuffles per seed, as `probe5_noise.py` does.
6. **Then one step up in size.** The same protocol at double the surface or units. A claim that holds at two sizes can be extrapolated; one at a single size cannot.

**Decided:** the outcome is reported as a "replicated reading, k of N seeds" and never as PASS. Whether the USER later calls that a verdict changes no number.

### What stays outside the rule
A full-size, full-length run. It is listed for the USER and nothing in this plan waits for it.

### Deliverable
`PREREG` text, the sizing table, the sealed scorer, and one results table. The same protocol serves S3 and S5.

---

## S3. Growth validated by perturbation

### What is wrong
- No loop exists in code. Of the 45 growth signals: 3 have human numbers, 4 animal numbers, 12 a direction only, 9 no source. No rate is human fetal, and the equations "were not written to work together" (growth plan, section 3.2).
- So the system cannot be validated by citing its parts. With 12 loops entering in six steps, a miss could not be traced to a loop either.

### The solution

**Principle: calibrate on one observation, validate on another.** A rate with no source is fitted so the model reproduces normal growth. It is then tested on a perturbation it was not fitted to. A fitted rate stays **unsourced** and is labelled a fit, as the fitted registry already does. What changes is that it becomes falsifiable.

**1. Order loops by whether they can be tested, not by anatomy.**

| Loop | Calibrate on | Validate on (held out) | Evidence already in the project |
|---|---|---|---|
| L1, target-derived survival | Normal counts over time | Remove the target: survival falls. Enlarge the target: survival does **not** rise | Chick and quail: about 45% of motoneurons survive with a limb, about 15% without; enlarging the target rescued none (growth plan, 3.1). Human: 182,122 at 11 weeks and about 117,350 at 25-32 weeks (Forger 1987, few observations) |
| L2, movement shapes the body | Normal joint and muscle state | Block movement: joint and muscle change in the reported direction and size | Onset numbers only; tissue effect "direction only, animal". Needs a read source: see leads |
| L3, sensation shapes the stem | - | No perturbation data found at this stage | Hold as a declared join inside the L1-L2 loop |
| L6, L7, L8, L9, L10, L12 | - | None found | Stay in the growth web record as hypotheses; not built |

- The asymmetry in L1 (removal hurts, enlargement does not help) is a strong test because a simple proportional rule fails it.
- L1's timing is a free output, not an input: the model's death curve is compared with both Forger 1987 and Fidziańska 2002, which disagree (join `motor_death_timing`).
- A loop enters the build only with a named held-out observation. This keeps "growth is structured from interconnected feedback, never a schedule": L1, L2 and L3 already close a loop from body to stem and back.

**2. Check that a loop can be tested before building it.** For each free rate, sweep it across its range (S5) on a toy version and read the validation endpoint. If the endpoint does not move, the data cannot constrain that loop, and it stays out. This costs minutes and prevents building what cannot fail.

**3. One common state for the adapters.** The equations use molecules, cells, sarcomeres and weights. Each tissue state is carried as a fraction of its 12.5 week target, and each sourced equation is written in that fraction. Every adapter is then one stated join with one knock-out, instead of an unstated unit conversion.

**4. Verify the two clocks separately from the biology.** Halve the slow step and halve the summary window on a case with a known answer. The endpoint must change by less than a stated tolerance. Operator splitting is an unsourced join; convergence is its test.

**5. Grow on `Body7` first, the mesh second.** `Body7` builds from 8 to 12.5 weeks since 2026-11-08 (audit M-077 part 1: 552 of 552 builds on a 0.1 week grid; the growth plan's "does not build at 8" is out of date). Bodies above 12.5 weeks do not build (M-077 part 2), which Phase 1 does not need. **Decided:** the first growth probes run 8 to 12.5 weeks on `Body7`, so the loop science does not wait for the mesh (S4). The USER's requirement that growth is literal in the 3D body stands; this is order only.

**6. Keep the three tests already planned** (growth plan, section 5): the coupling test (all loops off reproduces today's body exactly), the knock-out test and the synergy test. The learning endpoint is S1's baseline: the map with a growth history against the same learner on the same body without one.

### Leads, not read
- "Mechanical Influences on Morphogenesis of the Knee Joint Revealed through Morphological, Molecular and Computational Analysis of Immobilised Embryos", K.A. Roddy, 2011, PLoS ONE 6(2):e17526, doi:10.1371/journal.pone.0017526. Chick knee under neuromuscular block; a candidate held-out observation for L2. Species transfer. **Yield checked 2026-11-09** (`audit_log/verification/research_grade_2026-11-09/LEADS.md`, an automated summary of the page, table not seen): it gives sizes, not only a direction. Joint separation falls by 30-36% and intercondylar fossa width by 30-45% after 4-5 days of paralysis, condyle heights by 12-18%, some widths not at all. Usable as the L2 held-out observation once the table is checked against the page.
- "Stresses and strains on the human fetal skeleton during development", S.W. Verbruggen, 2018, J R Soc Interface 15(138):20170593, doi:10.1098/rsif.2017.0593. Human fetal forces from cine MRI at 20-35 weeks: after the window, so a bound or check only.

### Deliverable
A table per loop: calibration observation, held-out observation, result. A loop with no row is not in the model.

---

## S4. Anatomy a reviewer accepts

### What is wrong
- The 12.5 week body is the week 8 Hunyuan3D sculpt scaled uniformly by 3.7154, "not measured anatomy" (growth plan, 0.1).
- Its bounding box diagonal is 5.87 cm against about 6.2 cm crown-rump on the charts; its head is 7-15% narrower than the sourced head sizes (`RESULT_2026-11-04.md`; `FACE_ENVELOPE_GATES_12P5.md`).
- Shrinking it back to 8 weeks was judged not usable: one welded surface (531 edges between right forearm and trunk), poor labels, mature face and digits.

### What today's search found
- **No open, measured, whole-body surface at 12.5 weeks.** Four searches (whole-body micro-CT, Dutch Fetal Biobank, Kyoto Collection, HDBR atlas), not exhaustive.
- Measured data that exists: staged embryo reconstructions for Carnegie stages 7-23, which covers this plan's 8-10 week start; segment-level morphometry from the Kyoto Collection across the fetal period; a micro-CT atlas of the fetal skull base at 13-19 weeks, head only.

### The solution: the body is a set of measured dimensions with a stated error; the mesh is its display

**1. A dimension table.** One row per dimension the physics or skin reads: the 16 body targets (`source_audit/body_provenance_12p5_required.json`), segment lengths and girths, head sizes. Columns: source, n, spread, age basis, the model's value, and the deviation in units of the source's spread. `sculpt_measures.csv` and the master database's `sculpt_measures` table are the start. The table is the claim; a reviewer checks rows, not renders.

**2. Morph the sculpt to the table, by segment.**
- Re-label the mesh from `Body7`'s joint centres by distance along the surface, and cut the bridges between parts that are not parent and child.
- Scale length and girth separately per segment, to the table.
- Accept only when every row is inside its source's spread. The landing error is reported.
- This also moves `skin7`'s units onto the mesh, which closes the open item of sites 3-23 mm off the sculpt.
- The body-is-source rule holds: the body moves toward measurements, never toward the brain.

**3. A measured start shape.** The 8-10 week shape comes from staged embryo reconstructions (stage 23 is 10.0 weeks in the configuration), matched to the mesh by landmarks, not from shrinking a mature sculpt. Growth then runs between a measured-shape start and a measurement-conforming end.

**4. Numbers replace render judging for this purpose.** Deviation per row, and landmark distance to the staged reconstruction at stage 23. The delegated visual judges stay for display.

**5. Say exactly what the body is.** "Conforms to N measured dimensions within their spread; surface shape between them is not measured." That sentence is defensible. "Anatomical fetus" is not.

**6. One scan would upgrade it.** A whole-body scan near 60-65 mm crown-rump length would turn "conforms to measured dimensions" into "measured". Only the USER can request one. What to ask for, from the Kyoto Collection or the Dutch Fetal Biobank: one whole-body MRI or contrast micro-CT surface at that length, or segment lengths and girths of the upper limb and hand at 50-80 mm, which would also close the 40 hand and limb values now set aside as adult-sourced (`source_audit/OPEN_VALUES.md`).

### Leads, not read
- "An interactive three-dimensional digital atlas and quantitative database of human development", B.S. de Bakker, 2016, Science 354(6315):aag0053, doi:10.1126/science.aag0053. Stages 7-23, with a quantitative database.
- "Morphogenesis of the femur at different stages of normal human development", Y. Suzuki, 2019, PLoS ONE 14(8):e0221569, doi:10.1371/journal.pone.0221569. 62 Kyoto specimens, crown-rump 11.4-185 mm.
- "3D atlas of the human fetal chondrocranium in the middle trimester", M. Kaiser, 2024, Scientific Data 11, doi:10.1038/s41597-024-03455-1. 13-19 weeks, head only. **Not a new lead: already in the project** as `p-kaiser2024` (`paper_register.csv`; the 13 week scan behind the neck pivot and palate thickness).
- "Developmental atlas of the early first trimester human embryo", S. Yamada, 2010, Developmental Dynamics 239(6):1585-1595, doi:10.1002/dvdy.22316. Stages 13-23.

### Deliverable
The dimension table with deviations, the re-labelled mesh, and the one-sentence statement of what the body is.

### Step 1, first version (2026-11-09)
`audit_log/verification/research_grade_2026-11-09/DIMENSION_TABLE.md`, generated by `dimension_table.py` from the 16 body targets already on record. **0 of 16 have a source spread recorded**, so no deviation can be judged yet: that is the first gap. 4 have a direct sculpt measurement (biparietal diameter -15.4%, occipitofrontal -7.6%, tongue length -1.6%, tongue width -9.0%), 6 only a surface distance, 6 none. By status: 4 sourced direct, 2 interpolated, 6 derived, 4 extrapolated. The femur row carries the open whole-bone question (audit M-068: 9.15 mm against 14.19 mm).

---

## S5. From a sourcing count to uncertainty

### What is wrong
- 331 of 405 says how many values have a source. It does not say whether the result depends on the 74 that do not: 40 adult-sourced and set aside, 23 model choices, 4 that cannot be sourced, 2 design-cited, 5 unresearched (`OPEN_VALUES.md`, counted today).
- "Sourced" also covers long transfers. In the master database today, 396 constants have a basis row (a different count from the TALLY, which goes by role). 102 have a human fetal source whose range includes 12.5 weeks. The rest are extrapolated: 112 across fetal age, 28 fetal with no range in weeks, 9 fetal from another quantity, 69 from after birth, 40 animal after birth, 19 animal before birth, 17 a published model's parameter (`constants_with_basis`, queried read-only 2026-11-09).
- The sensitivity probes hit a floor: "a 0.1% change to every value moved firing by 0.18-0.19 ... as much as another seed". The system is chaotic, the 25% range was arbitrary, and MINOR meant "not separable from chaos" (`sensitivity_2026-11-05/RESULT.md`).
- Of 184 growth values, 75 were read through an assistant with printed tables unseen and 64 in part (growth plan, 3.2).

### The solution

**1. Every value gets a range.** Status stays sourced or unsourced; nothing is renamed.
- Sourced: the source's own spread, widened by a stated factor per extrapolation class.
- Unsourced: a bounded interval from what is known. Adult and newborn values are allowed here as **bounds**, which the fetal-data-first rule permits ("adult only as a bound or check"), plus physical limits.
- New columns beside each value in the records: low, high, basis of the range.

**2. Read the endpoint, not the trajectory.** In a chaotic system two runs diverge whatever is changed, so trajectory distance measures chaos. The quantities to read are statistics that are stable across seeds: the map endpoint from S1, contact counts per surface, and the 16 body targets. Each is a mean over seeds, and the detectable effect is stated before the run from the measured seed spread.

**3. Screen, then propagate.**
- Screen the existing value groups with one-at-a-time steps across each range, on the small experiment from S2, so a member costs minutes.
- Then draw whole bodies at random across the ranges of the values that moved the endpoint, and run S2's protocol on each.
- The result is one sentence a reviewer can use: "the map forms in k of n sampled bodies; it fails when value X is below Y".

**4. This is the product claim, tested.** The vision is a learner that calibrates to any body. A learner that needs one exact fetus has failed it; one that maps every body drawn from the ranges has shown it. The unsourced values stop being only a debt and become the test set.

**5. Source by value of information.** Keep searching only where the endpoint moves across the value's range. CORD_FRAC and TH_DEP already qualify (`sensitivity_2026-11-08_brainstem/RESULT.md`). For the rest, the range is reported and the search stops until a new reason appears.

**6. Repair read depth before anything is built on it.** A value bound to a build needs its table seen or its full text read. The 75 assistant-read and 64 part-read growth values are re-read in the order the S3 loops use them.

**7. Report two lines.** The TALLY line as now, and below it: "endpoint across ranges: k of n bodies".

### Lead, not read
- "Factorial Sampling Plans for Preliminary Computational Experiments", M.D. Morris, 1991, Technometrics 33(2):161-174, doi:10.1080/00401706.1991.10484804 (JSTOR copy doi:10.2307/1269043; the search returned both). The screening design in step 3. An analysis method outside the brain package; read before use.

### Deliverable
Range columns, the screening table, and the k-of-n line.

---

## S6. Usable by others

### What is wrong
- The master database, the runs and the papers sit outside the repository. Paths to `C:\Projects\trusoma` are fixed in tools.
- `README.md` describes gates that were removed on 2026-11-04 and names an older design.
- Three tests fail on HEAD: `test_tongue7` pressure, `test_body_values_fix` moment_frac, `test_popnet_ext` K2 (handoff 2026-11-09). **Explained 2026-11-09:** all three first failures were test pins left behind by value changes already decided, not code faults. `test_popnet_ext` now passes (48 checks). The other two get past their pins and stop at one known cause, a 14 week body that does not build (audit M-077 part 2).
- The documents speak in internal codes (K14, J6, L-036, M-077).

### The solution

**1. Three units, each useful without the others.**

| Unit | What it is | Why others would use it | Distance |
|---|---|---|---|
| A. Fetal parameter database | The 8-12.5 week values with source, quote, extrapolation class, read depth and range | It serves any fetal model. Whether a comparable table already exists was not searched | Nearest: the records are text in git already |
| B. Fetal self-touch environment | The 12.5 body, `skin7` and brainstem movement behind one interface, with the raw and oracle baselines from S1 | Anyone can test a learner on it; comparators are free here | After S1 B1 |
| C. The learner result | S1 and S2 | The scientific claim | After S2 |

A and B have value even if C fails. That is the hedge.

**2. One command per headline number.** A `repro/` folder: rebuild the database from the text records, run the small confirmed experiment, print the table, compare with a stored expected output. Versions pinned. Paths from one setting, not fixed. Proven by a fresh clone in an empty folder on this machine.

**3. No unexplained failure.** Each of the three failing tests is fixed, or marked as a known failure with its audit ID and reason. Only the one relevant test is run each time.

**4. Legible to a stranger.** A current `README.md`: what this is, what works, what does not, how to run it. A glossary from internal codes to plain names. One methods document with the model's equations and its joins.

**5. The record of failures is an asset in a paper.** Stage 2, probe 2b and the growth-by-division probe are exactly what a methods section needs. They stay off the marketing site, as ruled.

**6. An outside reader test.** Done means: someone outside reproduces the headline number from the README alone.

**USER-only:** a public release with a DOI, and a co-author in embryology or developmental neurobiology. Neither blocks steps 1-5.

### Lead, not read
- "Ten Simple Rules for Reproducible Computational Research", G.K. Sandve, 2013, PLoS Computational Biology 9(10):e1003285, doi:10.1371/journal.pcbi.1003285.

### Deliverable
`repro/`, a current README, a glossary, and a known-failures list of length 0 or fully explained.

---

## Order of work

**Superseded 2026-11-10 by `TRUSOMA_PATH_PLAN_2026-11-10.md`** (USER approved). The table below is the order as it stood; the solutions S1-S6 above remain the methods.

| Step | Work | Needs | Size |
|---|---|---|---|
| 1 | S1 B0: scorer positive control | **Done 2026-11-09** | 52 s |
| 2 | S6 steps 3-4: failing tests explained, README current, glossary (`GLOSSARY.md`) | **Done 2026-11-09** | Small |
| 3 | (removed with the robot hand goal, USER 2026-11-10) | - | - |
| 4 | S1 B1: cache `skin7` currents, raw check | **Done 2026-11-09** | One probe |
| 5 | S2: sizing probe, pre-registration, sealed scorer | Step 4 | Two probes |
| 6 | S1 B2 under S2: 10 seeds | Step 5, join listed | Four launches |
| 7 | S5 steps 1-3: ranges, screen | Step 5 | Probes of minutes |
| 8 | (removed with the robot hand goal, USER 2026-11-10) | - | - |
| 9 | S4 steps 1-3: table, morph, start shape | Step 1 first version done 2026-11-09; spreads missing | Parallel to 4-8 |
| 10 | S3: L1 and L2 on `Body7`, 9 to 12.5 weeks | Steps 6, 7 | Its own plan |
| 11 | S6 steps 1-2: units A and B, `repro/` | Steps 6, 9 | Small |

Steps 1-4 are done; step 5 is done for the field signal (2026-11-10: 10 of 10 seeds local, `TRUSOMA_FIELD_PREREG_2026-11-09.md` section 9). Step 6 is run (2026-11-10: `TRUSOMA_SKIN7_PREREG_2026-11-10.md`, join J16): **not replicated, 1 of 10 seeds grouped**; the reading points at the afferent stage, where contact barely changes the firing rate, so that comes before B3 or any rerun. The longer B1 window is run: the hands are still untouched at 420 s, and the afferent spikes hold far less than the currents (`RESULT_B1.md`). Sourcing the 74 continues beside this, reordered by S5 step 5 once step 7 has run.

## What only the USER can do
None of these blocks the order above.
1. Request a scan or measurements from the Kyoto Collection or the Dutch Fetal Biobank (S4).
2. Publish a release with a DOI (S6).
3. Bring in a co-author (S6).
4. Allow one full-size, full-length run (S2), if wanted.

## What was not checked
- An untrained network on the field readout (none is in the probe folder; the null equals it in expectation only).
- Contact on `skin7` beyond 180 simulated seconds: whether the hands are ever touched in a longer window.
- Any lead above beyond its search record: title, first author, journal, year and DOI were confirmed by search today; the contents were not read.
- Whether a whole-body scan exists unpublished at either collection.
- Which commit first broke the tongue pressure pin (read from the commit log, not bisected).
