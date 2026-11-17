# Open questions

TruSoma is a model of the human fetal body and its developing brain at 10 to 17 weeks of gestation. Every value in it is meant to rest on a quoted source. The 17 questions below are where no usable source has been found yet; 67 values wait on them.

**You can answer one.** Open the form under a question and give a paper and the passage that holds the number. An answer that holds is entered in the graph as a Source and an Evidence note that quote your passage, and the value it sets is marked as sourced.

What counts as an answer:

- Human fetal data at 10 to 17 weeks comes first, then human preterm or newborn data, then fetal or newborn animal data. Adult data is not used, scaled or direct.
- The paper's title, first author, year, journal and DOI.
- The passage word for word, with its page, table or figure. A measurement of a different quantity is not an answer.

This list is generated from the project's vault. 2 more open questions are settled by the project's own measurements and are not listed. The questions that the model's own probes found it sensitive to come first.

## 1. How dense are touch afferents in each region of fetal skin?

- Values that wait (14): `skin7.oral_new.buccal.n4`, `skin7.oral_new.lip_lower.n4`, `skin7.oral_new.lip_upper.n4`, `skin7.oral_new.ridge_lower.n4`, `skin7.oral_new.ridge_upper.n4`, `skin7.surfaces7.face.n4`, `skin7.surfaces7.fingers.n4`, `skin7.surfaces7.forearm.n4`, `skin7.surfaces7.leg.n4`, `skin7.surfaces7.palate.n4`, `skin7.surfaces7.rest_head.n4`, `skin7.surfaces7.sole.n4`, `skin7.surfaces7.tongue.n4`, `skin7.surfaces7.trunk.n4`
- What is missing: fetal Merkel cell density exists (Kim & Holbrook 1995) but the model counts afferent units; no fetal or newborn afferent density by region found (2026-11-06 search)
- Where we would look next: whole-nerve axon and ganglion cell counts at fetal or newborn ages, each needing a count-per-area join (closed, abstract only): Renehan 1984, Brain Research 322:369, doi 10.1016/0006-8993(84)90136-7; Jenq 1986, J Comp Neurol 244:445, doi 10.1002/cne.902440404; Davies 1984, J Comp Neurol 223:124, doi 10.1002/cne.902230110; Fried 1982, J Neurol Sci 53:169, doi 10.1016/0022-510x(82)90003-x; Shield 1986, Acta Neuropathol 70:60, doi 10.1007/bf00689515. No density by region found (search of 2026-11-17)
- From the model's probes: Where touch lands in the model depends on the differences in afferent density between skin regions, by a small margin (1 reading for, 0 against; a reading, not a proof).
- [Answer this question with evidence](https://github.com/kootru-repo/trusoma-discourse-graph/issues/new?template=answer-a-question.yml&title=Answer%3A%20How%20dense%20are%20touch%20afferents%20in%20each%20region%20of%20fetal%20skin%3F)

## 2. What are the muscle moment arms of the fetal joints?

- Values that wait (11): `body7.moment_frac.elbow`, `body7.moment_frac.fingers`, `body7.moment_frac.hip`, `body7.moment_frac.neck_yaw`, `body7.moment_frac.pron`, `body7.moment_frac.sh_abd`, `body7.moment_frac.sh_flex`, `body7.moment_frac.sh_rot`, `body7.moment_frac.spine_flex`, `body7.moment_frac.thumb`, `body7.moment_frac.wrist`
- What is missing: no fetal or neonatal moment arm or line of action (only the knee, Ishikawa 2026)
- Where we would look next: fetal limb MRI lines of action (Kyoto Collection)
- From the model's probes: The touch readings of the model are sensitive to the muscle moment arms of the joints (1 reading for, 2 against; a reading, not a proof).
- [Answer this question with evidence](https://github.com/kootru-repo/trusoma-discourse-graph/issues/new?template=answer-a-question.yml&title=Answer%3A%20What%20are%20the%20muscle%20moment%20arms%20of%20the%20fetal%20joints%3F)

## 3. What are the rest angles of the fetal forearm and fingers, and the joint damping, at 11 to 14 weeks?

- Values that wait (4): `body7.body7.init.c`, `body7.rest_fit_rad.fingers`, `body7.rest_fit_rad.l_pron`, `body7.rest_fit_rad.r_pron`
- What is missing: no quantitative fetal forearm, finger or damping data at 11-14 weeks
- Where we would look next: digitise open fetal 3D/4D ultrasound images
- From the model's probes: Asymmetric rest angles and joint damping change where touch lands in the model, by a small margin (2 readings for, 0 against; a reading, not a proof).
- [Answer this question with evidence](https://github.com/kootru-repo/trusoma-discourse-graph/issues/new?template=answer-a-question.yml&title=Answer%3A%20What%20are%20the%20rest%20angles%20of%20the%20fetal%20forearm%20and%20fingers%2C%20and%20the%20joint%20damping%2C%20at%2011%20to%2014%20weeks%3F)

## 4. How do fetal touch afferents fire: ramp sensitivity, floor and noise?

- Values that wait (2): `skin_world.fa_ramp`, `skin_world.receptor_noise_sd`
- What is missing: no fetal or neonatal afferent firing data for this term
- Where we would look next: Gibson 1975, Brain Research 86:181, doi 10.1016/0006-8993(75)90696-4 and Beitel 1977, Brain Research 129:213, doi 10.1016/0006-8993(77)90002-6 (amplitude and velocity thresholds of developing afferents; closed, abstract only). Ferrington 1980, J Physiol 307:335, doi 10.1113/jphysiol.1980.sp013438 (neonatal kitten, read 2026-11-17: vibration thresholds and spike timing, needs a join to the ramp term)
- From the model's probes: Receptor noise shapes where touch lands and the structure of the touch input in the model (1 reading for, 0 against; a reading, not a proof).
- From the model's probes: The ramp response of the fast adapting afferents carries a large part of the amount of touch input in the model (1 reading for, 0 against; a reading, not a proof).
- [Answer this question with evidence](https://github.com/kootru-repo/trusoma-discourse-graph/issues/new?template=answer-a-question.yml&title=Answer%3A%20How%20do%20fetal%20touch%20afferents%20fire%3A%20ramp%20sensitivity%2C%20floor%20and%20noise%3F)

## 5. How fast and how stiff is fetal muscle at an allowed stage?

- Values that wait (2): `body7.body7.init.k`, `setting.popnet.PopNet.__init__.D_mat`
- What is missing: no fetal or neonatal muscle timing/stiffness at an allowed stage
- Where we would look next: Synowiec 2019, Frontiers in Neurology 9:1183, doi 10.3389/fneur.2018.01183 (newborn rabbit, read 2026-11-17: joint stiffness under anaesthesia given only as an upper bound, individual values in Figure 1; needs a segment length); Drobyshevsky 2012, Stroke 43:2757, doi 10.1161/strokeaha.112.653857 (the torque device, not read)
- From the model's probes: The population terms D_mat and ou_tau_e_ms shape the activity of the 12.5 week loop (1 reading for, 1 against; a reading, not a proof).
- [Answer this question with evidence](https://github.com/kootru-repo/trusoma-discourse-graph/issues/new?template=answer-a-question.yml&title=Answer%3A%20How%20fast%20and%20how%20stiff%20is%20fetal%20muscle%20at%20an%20allowed%20stage%3F)

## 6. What share of neck motion does the upper cervical joint take in the fetus or infant?

- Values that wait (1): `body7.neck_atlas_share`
- What is missing: a motion share; no fetal or infant segmental neck motion data; static scans cannot give it
- Where we would look next: Luck 2012, Duke University dissertation, hdl.handle.net/10161/5850 (read 2026-11-17: Table 20 gives occiput to C2 together, not the atlanto-occipital joint alone); needs a sourced split of occiput-C1 from C1-C2 at a perinatal age
- From the model's probes: The share of neck motion taken by the upper cervical joint changes where touch lands and how much touch there is in the model (1 reading for, 0 against; a reading, not a proof).
- [Answer this question with evidence](https://github.com/kootru-repo/trusoma-discourse-graph/issues/new?template=answer-a-question.yml&title=Answer%3A%20What%20share%20of%20neck%20motion%20does%20the%20upper%20cervical%20joint%20take%20in%20the%20fetus%20or%20infant%3F)

## 7. How does the depression threshold of a developing network map to a rate fraction?

- Values that wait (1): `setting.brainstem_s2.TH_DEP`
- What is missing: Tabak theta_s is on a different activity scale; no sourced rescale
- Where we would look next: a sourced mapping of developing-network activity to rate fraction
- From the model's probes: The nerve entry position on the cord and the depression threshold change the activity pattern of the brainstem loop (1 reading for, 2 against; a reading, not a proof).
- [Answer this question with evidence](https://github.com/kootru-repo/trusoma-discourse-graph/issues/new?template=answer-a-question.yml&title=Answer%3A%20How%20does%20the%20depression%20threshold%20of%20a%20developing%20network%20map%20to%20a%20rate%20fraction%3F)

## 8. Where along the cord do the limb nerves enter in the fetus?

- Values that wait (1): `setting.brainstem_s2.CORD_FRAC`
- What is missing: no fetal nerve entry positions; limb muscles outside the scans
- Where we would look next: fetal limb imaging
- From the model's probes: The nerve entry position on the cord and the depression threshold change the activity pattern of the brainstem loop (1 reading for, 2 against; a reading, not a proof).
- [Answer this question with evidence](https://github.com/kootru-repo/trusoma-discourse-graph/issues/new?template=answer-a-question.yml&title=Answer%3A%20Where%20along%20the%20cord%20do%20the%20limb%20nerves%20enter%20in%20the%20fetus%3F)

## 9. What are the proportions of the fetal hand: phalanges, thumb position and direction, finger spacing?

- Values that wait (9): `body7.body7.fk.tb`, `body7.curl.n12`, `body7.thumb_dir.n0`, `body7.thumb_dir.n1`, `body7.thumb_dir.n2`, `body7.thumb_target.n2`, `setting.body7.THUMB_TARGET.0`, `setting.body7.THUMB_TARGET.1`, `skin7.surfaces7.thumb.n4`
- What is missing: no fetal hand morphometry for these proportions (searched 2026-11-06, incl. Kyoto/Carnegie-stage hand imaging: no hit)
- Where we would look next: Kyoto fetal hand phase-contrast CT; open fetal limb volumes
- [Answer this question with evidence](https://github.com/kootru-repo/trusoma-discourse-graph/issues/new?template=answer-a-question.yml&title=Answer%3A%20What%20are%20the%20proportions%20of%20the%20fetal%20hand%3A%20phalanges%2C%20thumb%20position%20and%20direction%2C%20finger%20spacing%3F)

## 10. What are the mechanical properties of fetal oral tissue?

- Values that wait (5): `tongue7.tissue.init.nu`, `tongue7.tissue.init.pulp_g.n0`, `tongue7.tissue.init.pulp_g.n1`, `tongue7.tissue.init.pulp_tau.n0`, `tongue7.tissue.init.pulp_tau.n1`
- What is missing: no fetal or neonatal oral tissue mechanics for this term (2026-11-06 search; fetal muscle water 90.7% at 13-14 wk, Dickerson 1960, supports near-incompressibility but gives no value)
- Where we would look next: Forgacs 1998, Biophysical Journal 74:2227, doi 10.1016/s0006-3495(98)77932-9 (chick embryo tissue, read 2026-11-17: stress relaxation times in Table 1, seconds to tens of seconds; another tissue and no fast time); Akos 2020, Front Cell Dev Biol 8:674, doi 10.3389/fcell.2020.00674 (quail embryo, a creep time); Harada 2011, Int J CARS 6:797, doi 10.1007/s11548-011-0563-7 (rat fetus abdominal wall, closed). No measured Poisson ratio found
- [Answer this question with evidence](https://github.com/kootru-repo/trusoma-discourse-graph/issues/new?template=answer-a-question.yml&title=Answer%3A%20What%20are%20the%20mechanical%20properties%20of%20fetal%20oral%20tissue%3F)

## 11. Where does the fetal oral cavity end, and how far does the cheek bulge?

- Values that wait (4): `oral7.buccal_back`, `oral7.buccal_bulge`, `oral7.buccal_front`, `oral7.floor_y.n1`
- What is missing: cavity end and cheek bulge are pose-dependent or below resolution on the open 14 week scan
- Where we would look next: an open-mouth specimen at 12-13 weeks with clear palatoglossal folds
- [Answer this question with evidence](https://github.com/kootru-repo/trusoma-discourse-graph/issues/new?template=answer-a-question.yml&title=Answer%3A%20Where%20does%20the%20fetal%20oral%20cavity%20end%2C%20and%20how%20far%20does%20the%20cheek%20bulge%3F)

## 12. How far do the fingers and the thumb flex and extend in the early fetus?

- Values that wait (4): `body7.limits_deg.fingers.hi`, `setting.body7.LIMITS_DEG.fingers_0`, `setting.body7.LIMITS_DEG.thumb_0`, `setting.body7.LIMITS_DEG.thumb_1`
- What is missing: no fetal or newborn finger/thumb range (Okabe 1978 does not measure them)
- Where we would look next: Katz 2007, J Pediatr Orthop B 16:252, doi 10.1097/bpb.0b013e3280e1295d (fetal finger movements from 16 weeks; closed, the abstract gives categories and no degrees). Nothing found for the thumb
- [Answer this question with evidence](https://github.com/kootru-repo/trusoma-discourse-graph/issues/new?template=answer-a-question.yml&title=Answer%3A%20How%20far%20do%20the%20fingers%20and%20the%20thumb%20flex%20and%20extend%20in%20the%20early%20fetus%3F)

## 13. In which direction does the umbilical cord leave the fetal abdomen?

- Values that wait (3): `body7.cord_dir.n1`, `body7.cord_dir.n2`, `setting.body7.CORD_DIR.0`
- What is missing: no fetal umbilical cord insertion direction data
- Where we would look next: fetal MRI/ultrasound cord insertion angle
- [Answer this question with evidence](https://github.com/kootru-repo/trusoma-discourse-graph/issues/new?template=answer-a-question.yml&title=Answer%3A%20In%20which%20direction%20does%20the%20umbilical%20cord%20leave%20the%20fetal%20abdomen%3F)

## 14. How far does the fetal or infant neck flex and extend?

- Values that wait (2): `body7.limits_deg.neck_flex#1`, `body7.limits_deg.neck_flex#2`
- What is missing: no fetal or infant cervical flexion/extension range found
- Where we would look next: Luck 2012, Duke University dissertation, hdl.handle.net/10161/5850 (perinatal cadaver necks, read 2026-11-17: Tables 20 and 21 give rotation at 0.1 N-m, which the author calls an upper bound at low load, not a range limit). No in vivo fetal or infant range found
- [Answer this question with evidence](https://github.com/kootru-repo/trusoma-discourse-graph/issues/new?template=answer-a-question.yml&title=Answer%3A%20How%20far%20does%20the%20fetal%20or%20infant%20neck%20flex%20and%20extend%3F)

## 15. How far does the fetal trunk flex and extend?

- Values that wait (2): `body7.limits_deg.spine_flex.hi`, `setting.body7.LIMITS_DEG.spine_flex_0`
- What is missing: no fetal or newborn trunk flexion/extension range
- Where we would look next: neonatal trunk ROM; fetal ultrasound trunk excursion
- [Answer this question with evidence](https://github.com/kootru-repo/trusoma-discourse-graph/issues/new?template=answer-a-question.yml&title=Answer%3A%20How%20far%20does%20the%20fetal%20trunk%20flex%20and%20extend%3F)

## 16. How far does the elbow extend before 20 weeks?

- Values that wait (1): `setting.body7.LIMITS_DEG.elbow_0`
- What is missing: newborn elbow lacks ~13 deg extension (Okabe 1978) but that is a late-gestation contracture
- Where we would look next: Mondal 2022, J Matern Fetal Neonatal Med 35:7259, doi 10.1080/14767058.2021.1946784 (newborns born at 28 to 41 weeks, goniometer; closed). Nothing found before 20 weeks
- [Answer this question with evidence](https://github.com/kootru-repo/trusoma-discourse-graph/issues/new?template=answer-a-question.yml&title=Answer%3A%20How%20far%20does%20the%20elbow%20extend%20before%2020%20weeks%3F)

## 17. How far does the shoulder adduct at a non-adult age?

- Values that wait (1): `body7.limits_deg.sh_abd#1`
- What is missing: no peer-reviewed adduction range at any non-adult age
- Where we would look next: neonatal shoulder adduction
- [Answer this question with evidence](https://github.com/kootru-repo/trusoma-discourse-graph/issues/new?template=answer-a-question.yml&title=Answer%3A%20How%20far%20does%20the%20shoulder%20adduct%20at%20a%20non-adult%20age%3F)
