# Sourcing worklist (generated from the vault by tools/dm/worklist.py; do not edit)

19 open questions hold up 72 values. Questions a probe found the model sensitive to come first, then the number of values that wait, then what those values feed and the hypotheses that rest on them. A probe reading sets search priority only.
To change a row, change the Question note (its lead, its values) or source a value; then run `python tools/dm/build_from_vault.py write`.

| # | Question | Waiting | Answered | Probe readings (signal / no signal / other) | Feeds | Hypotheses | Next lead | Papers already tried |
|---|---|---|---|---|---|---|---|---|
| 1 | How dense are touch afferents in each region of fetal skin? | 14 | 18 | 1 / 0 / 0 | 0 | 0 | fetal cutaneous nerve fibre density by region | p-doi-10-1152-jn-00313-2020, p-pmc5595116, p-vaira2017 |
| 2 | What are the muscle moment arms of the fetal joints? | 11 | 2 | 1 / 2 / 0 | 0 | 0 | fetal limb MRI lines of action (Kyoto Collection) | p-chenfranklin2025, p-garland2018, p-murray2002 |
| 3 | What are the rest angles of the fetal forearm and fingers, and the joint damping, at 11 to 14 weeks? | 4 | 15 | 2 / 0 / 0 | 0 | 0 | digitise open fetal 3D/4D ultrasound images | - |
| 4 | How do fetal touch afferents fire: ramp sensitivity, floor and noise? | 2 | 6 | 2 / 0 / 0 | 0 | 0 | neonatal rat trigeminal/DRG recordings (Fitzgerald) | p-pmc1350502 |
| 5 | How fast and how stiff is fetal muscle at an allowed stage? | 2 | 11 | 1 / 2 / 1 | 0 | 0 | fetal sheep or rat contraction times; preterm EMG | p-pmc1029052 |
| 6 | What share of neck motion does the upper cervical joint take in the fetus or infant? | 1 | 0 | 1 / 0 / 0 | 0 | 0 | infant cervical segmental kinematics | p-farber2025 |
| 7 | How does the depression threshold of a developing network map to a rate fraction? | 1 | 0 | 1 / 1 / 0 | 0 | 0 | a sourced mapping of developing-network activity to rate fraction | - |
| 8 | Where along the cord do the limb nerves enter in the fetus? | 1 | 0 | 1 / 1 / 0 | 0 | 0 | fetal limb imaging | - |
| 9 | What are the proportions of the fetal hand: phalanges, thumb position and direction, finger spacing? | 9 | 11 | 0 / 0 / 0 | 0 | 0 | Kyoto fetal hand phase-contrast CT; open fetal limb volumes | p-cao2021, p-doi-10-1152-jn-00313-2020 |
| 10 | What are the mechanical properties of fetal oral tissue? | 5 | 3 | 0 / 0 / 1 | 0 | 0 | embryonic mouse oral tissue AFM (Zhu 2020, Nagasaka 2026) | p-pmc12440228, p-pmid10211451 |
| 11 | Where does the fetal oral cavity end, and how far does the cheek bulge? | 4 | 3 | 0 / 0 / 0 | 0 | 0 | an open-mouth specimen at 12-13 weeks with clear palatoglossal folds | - |
| 12 | How far do the fingers and the thumb flex and extend in the early fetus? | 4 | 0 | 0 / 0 / 0 | 0 | 0 | preterm Amiel-Tison hand items; fetal 4D ultrasound hand excursion | p-chen2011, p-pmc11436331 |
| 13 | How deep are the lips set in the fetal face profile? | 4 | 33 | 0 / 0 / 0 | 0 | 0 | joint lip centre and depth refit on the 14 week scan | - |
| 14 | In which direction does the umbilical cord leave the fetal abdomen? | 3 | 0 | 0 / 0 / 0 | 0 | 0 | fetal MRI/ultrasound cord insertion angle | - |
| 15 | How far does the fetal or infant neck flex and extend? | 2 | 0 | 0 / 0 / 0 | 0 | 0 | infant cervical flexion reference values | p-pmid40415283 |
| 16 | How far does the fetal trunk flex and extend? | 2 | 0 | 0 / 0 / 0 | 0 | 0 | neonatal trunk ROM; fetal ultrasound trunk excursion | - |
| 17 | How far does the elbow extend before 20 weeks? | 1 | 1 | 0 / 0 / 0 | 0 | 0 | fetal elbow range in 4D ultrasound before 20 weeks | p-zwerus2019 |
| 18 | Does the shared population size of the brainstem nuclei matter, and what should it be? | 1 | 0 | 0 / 1 / 0 | 0 | 0 | none needed unless a probe shows the noise scale matters | - |
| 19 | How far does the shoulder adduct at a non-adult age? | 1 | 0 | 0 / 0 / 0 | 0 | 0 | neonatal shoulder adduction | p-okabe1978, p-pmid19503686 |

## The values behind each row

1. **How dense are touch afferents in each region of fetal skin?** Blocker: fetal Merkel cell density exists (Kim & Holbrook 1995) but the model counts afferent units; no fetal or newborn afferent density by region found (2026-11-06 search)
   `skin7.oral_new.buccal.n4`, `skin7.oral_new.lip_lower.n4`, `skin7.oral_new.lip_upper.n4`, `skin7.oral_new.ridge_lower.n4`, `skin7.oral_new.ridge_upper.n4`, `skin7.surfaces7.face.n4`, `skin7.surfaces7.fingers.n4`, `skin7.surfaces7.forearm.n4`, `skin7.surfaces7.leg.n4`, `skin7.surfaces7.palate.n4`, `skin7.surfaces7.rest_head.n4`, `skin7.surfaces7.sole.n4`, `skin7.surfaces7.tongue.n4`, `skin7.surfaces7.trunk.n4`

2. **What are the muscle moment arms of the fetal joints?** Blocker: no fetal or neonatal moment arm or line of action (only the knee, Ishikawa 2026)
   `body7.moment_frac.elbow`, `body7.moment_frac.fingers`, `body7.moment_frac.hip`, `body7.moment_frac.neck_yaw`, `body7.moment_frac.pron`, `body7.moment_frac.sh_abd`, `body7.moment_frac.sh_flex`, `body7.moment_frac.sh_rot`, `body7.moment_frac.spine_flex`, `body7.moment_frac.thumb`, `body7.moment_frac.wrist`

3. **What are the rest angles of the fetal forearm and fingers, and the joint damping, at 11 to 14 weeks?** Blocker: no quantitative fetal forearm, finger or damping data at 11-14 weeks
   `body7.body7.init.c`, `body7.rest_fit_rad.fingers`, `body7.rest_fit_rad.l_pron`, `body7.rest_fit_rad.r_pron`

4. **How do fetal touch afferents fire: ramp sensitivity, floor and noise?** Blocker: no fetal or neonatal afferent firing data for this term
   `skin_world.fa_ramp`, `skin_world.receptor_noise_sd`

5. **How fast and how stiff is fetal muscle at an allowed stage?** Blocker: no fetal or neonatal muscle timing/stiffness at an allowed stage
   `body7.body7.init.k`, `setting.popnet.PopNet.__init__.D_mat`

6. **What share of neck motion does the upper cervical joint take in the fetus or infant?** Blocker: a motion share; no fetal or infant segmental neck motion data; static scans cannot give it
   `body7.neck_atlas_share`

7. **How does the depression threshold of a developing network map to a rate fraction?** Blocker: Tabak theta_s is on a different activity scale; no sourced rescale
   `setting.brainstem_s2.TH_DEP`

8. **Where along the cord do the limb nerves enter in the fetus?** Blocker: no fetal nerve entry positions; limb muscles outside the scans
   `setting.brainstem_s2.CORD_FRAC`

9. **What are the proportions of the fetal hand: phalanges, thumb position and direction, finger spacing?** Blocker: no fetal hand morphometry for these proportions (searched 2026-11-06, incl. Kyoto/Carnegie-stage hand imaging: no hit)
   `body7.body7.fk.tb`, `body7.curl.n12`, `body7.thumb_dir.n0`, `body7.thumb_dir.n1`, `body7.thumb_dir.n2`, `body7.thumb_target.n2`, `setting.body7.THUMB_TARGET.0`, `setting.body7.THUMB_TARGET.1`, `skin7.surfaces7.thumb.n4`

10. **What are the mechanical properties of fetal oral tissue?** Blocker: no fetal or neonatal oral tissue mechanics for this term (2026-11-06 search; fetal muscle water 90.7% at 13-14 wk, Dickerson 1960, supports near-incompressibility but gives no value)
   `tongue7.tissue.init.nu`, `tongue7.tissue.init.pulp_g.n0`, `tongue7.tissue.init.pulp_g.n1`, `tongue7.tissue.init.pulp_tau.n0`, `tongue7.tissue.init.pulp_tau.n1`

11. **Where does the fetal oral cavity end, and how far does the cheek bulge?** Blocker: cavity end and cheek bulge are pose-dependent or below resolution on the open 14 week scan
   `oral7.buccal_back`, `oral7.buccal_bulge`, `oral7.buccal_front`, `oral7.floor_y.n1`

12. **How far do the fingers and the thumb flex and extend in the early fetus?** Blocker: no fetal or newborn finger/thumb range (Okabe 1978 does not measure them)
   `body7.limits_deg.fingers.hi`, `setting.body7.LIMITS_DEG.fingers_0`, `setting.body7.LIMITS_DEG.thumb_0`, `setting.body7.LIMITS_DEG.thumb_1`

13. **How deep are the lips set in the fetal face profile?** Blocker: lips closed at 13 weeks; at 14 weeks depth measured (0.054/0.058 R) but coupled to the sourced lip centre
   `body7.face_frac.n2.n2.hi`, `body7.face_frac.n2.n2.lo`, `body7.face_frac.n3.n2.hi`, `body7.flat_profile.n0#2`

14. **In which direction does the umbilical cord leave the fetal abdomen?** Blocker: no fetal umbilical cord insertion direction data
   `body7.cord_dir.n1`, `body7.cord_dir.n2`, `setting.body7.CORD_DIR.0`

15. **How far does the fetal or infant neck flex and extend?** Blocker: no fetal or infant cervical flexion/extension range found
   `body7.limits_deg.neck_flex#1`, `body7.limits_deg.neck_flex#2`

16. **How far does the fetal trunk flex and extend?** Blocker: no fetal or newborn trunk flexion/extension range
   `body7.limits_deg.spine_flex.hi`, `setting.body7.LIMITS_DEG.spine_flex_0`

17. **How far does the elbow extend before 20 weeks?** Blocker: newborn elbow lacks ~13 deg extension (Okabe 1978) but that is a late-gestation contracture
   `setting.body7.LIMITS_DEG.elbow_0`

18. **Does the shared population size of the brainstem nuclei matter, and what should it be?** Blocker: one shared population size since 2026-11-08 (replaces 12 per-nucleus counts): in pop mode it sets only finite-size spike noise; the 12 counts read MINOR in the 6-seed probe
   `brainstem_net7.pop_size`

19. **How far does the shoulder adduct at a non-adult age?** Blocker: no peer-reviewed adduction range at any non-adult age
   `body7.limits_deg.sh_abd#1`
