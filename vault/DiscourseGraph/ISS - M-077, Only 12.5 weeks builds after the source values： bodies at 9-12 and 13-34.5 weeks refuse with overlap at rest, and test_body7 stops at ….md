---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "62fbe87d-e1bf-73ce-89d0-368a004e00a2"
dg_type: "Issue"
dg_name: "M-077"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 190
data: {"id": "M-077", "category": "M", "priority": "P2", "ref": "companion/source_audit/batch_2026-11-05_values/CHANGES.md", "item": "Only 12.5 weeks builds after the source values: bodies at 9-12 and 13-34.5 weeks refuse with overlap at rest, and test_body7 stops at GA 14. Chart above 12.5 weeks still reads the ultrasound shaft", "why": "Shoulder width and limb lengths apply at every age, while rest rows were derived for the old sizes. Growth to 12.5 weeks needs younger bodies", "resolve": "Re-derive rest rows by age and extend whole-bone lengths; then rerun test_body7", "status": "in-progress", "evidence": "2026-11-08 part 1 done: 8-12.5 wk bodies build (552/552 builds, 12 configs, 0.1-wk grid). Fixed left-thumb mirroring bug (THUMB_TARGET not mirrored with sg, body7 and body7_nb), thumb rest 20->30 deg, 7 rest rows re-derived (m077_rows.py). Open part 2: bodies >12.5 wk (CRL None in M-087 trunk fit); whole-bone vs shaft anchor dip at 12.5. companion/source_audit/batch_2026-11-08_m077/CHANGES.md", "touched": "2026-11-13", "note": "2026-11-13: step at 12.5 weeks removed below 12.5: growth7.limbs takes the whole ulna and radius of Bareggi 1994 Table 2 (classes at crown-rump 45 and 53 mm, six values in other_config) and runs log-linearly to the 12.5 values (ulna 9.81 mm at 12.4 weeks, 10.10 at 12.5; before 12.05). 12.5 body unchanged (12 of 12 configurations build). Younger bodies: 234 of 552 builds refuse, against 208 before this change on the same tree; the 208 are the feet against the uterine wall bound 2026-11-11 (2.16 mm at 12.4 weeks), not the arms; the 26 new ones are at 9.6-9.8 and 10.6-10.8 weeks, where the forearm is now 9 percent longer. Arm rest rows cannot be re-derived until the wall overlap is dealt with (m077_rows.py finds 18.7 mm of overlap no arm pose removes). Above 12.5 weeks the chart still reads the shaft. companion/source_audit/batch_2026-11-13_forearm/"}
---

Only 12.5 weeks builds after the source values: bodies at 9-12 and 13-34.5 weeks refuse with overlap at rest, and test_body7 stops at GA 14. Chart above 12.5 weeks still reads the ultrasound shaft.

Why it matters: Shoulder width and limb lengths apply at every age, while rest rows were derived for the old sizes. Growth to 12.5 weeks needs younger bodies.

To resolve: Re-derive rest rows by age and extend whole-bone lengths; then rerun test_body7.

Status: in-progress; priority: P2; category: M.

Evidence so far: 2026-11-08 part 1 done: 8-12.5 wk bodies build (552/552 builds, 12 configs, 0.1-wk grid). Fixed left-thumb mirroring bug (THUMB_TARGET not mirrored with sg, body7 and body7_nb), thumb rest 20->30 deg, 7 rest rows re-derived (m077_rows.py). Open part 2: bodies >12.5 wk (CRL None in M-087 trunk fit); whole-bone vs shaft anchor dip at 12.5. companion/source_audit/batch_2026-11-08_m077/CHANGES.md.

Note: 2026-11-13: step at 12.5 weeks removed below 12.5: growth7.limbs takes the whole ulna and radius of Bareggi 1994 Table 2 (classes at crown-rump 45 and 53 mm, six values in other_config) and runs log-linearly to the 12.5 values (ulna 9.81 mm at 12.4 weeks, 10.10 at 12.5; before 12.05). 12.5 body unchanged (12 of 12 configurations build). Younger bodies: 234 of 552 builds refuse, against 208 before this change on the same tree; the 208 are the feet against the uterine wall bound 2026-11-11 (2.16 mm at 12.4 weeks), not the arms; the 26 new ones are at 9.6-9.8 and 10.6-10.8 weeks, where the forearm is now 9 percent longer. Arm rest rows cannot be re-derived until the wall overlap is dealt with (m077_rows.py finds 18.7 mm of overlap no arm pose removes). Above 12.5 weeks the chart still reads the shaft. companion/source_audit/batch_2026-11-13_forearm/.
