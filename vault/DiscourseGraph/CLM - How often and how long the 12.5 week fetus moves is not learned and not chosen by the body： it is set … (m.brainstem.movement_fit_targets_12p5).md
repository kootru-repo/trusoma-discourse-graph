---
nodeTypeId: "node_LwROzkVH_Zck7ZxDgN91E"
nodeInstanceId: "1e906322-845d-776c-b84d-e653d6c5b0ee"
dg_type: "Claim"
dg_name: "m.brainstem.movement_fit_targets_12p5"
record_file: "companion/source_audit/sourcing_records.jsonl"
code: "records"
order: 523
fmt: "default"
data: {"kind": "method", "id": "m.brainstem.movement_fit_targets_12p5", "part": "brainstem", "method": "How often and how long the 12.5 week fetus moves is not learned and not chosen by the body: it is set by the excitability of the spontaneous movement generators, so the generator parameters are FITTED to sourced counts and durations, and contact is never fitted (USER 2026-11-11). Fit targets, median at 12 and 13 weeks [lowest-highest fetus]: general movements 11.5, 12.5 % of time [6-18] (common generator bias); isolated arm movements 48, 51.5 per h [6-104], isolated leg 3, 4 per h [0-26], head retroflexion 20, 41 [2-76], rotation 3, 3 [0-95], anteflexion 1, 1 [0-13] per h (per-joint generator bias; every movement outside a general movement counts, not only large ones); arm in motion 13.7, 14.8 % of time [6.3-23.5], derived from the two above and the movement duration; hand movement time 1.64 s to the mouth, 1.89 s to the eye (passive stiffness and damping or the generator time constants). Held out, validation only: hand-face contacts 23.5, 21 per h [0-78]; hand-to-mouth movements at least 10.5 per h at 14 weeks. The numbers are held in tools/tools_config.json under gm_score.py, TARGET and TARGET_NOTES.", "paper_id": "p-doi-10-1016-0378-3782-85-90174-4", "state": "de Vries 1985 scatter figures read into the local extract; Zoia 2013 read in full; the derived arm-in-motion share and the choice of which parameter each target constrains are the lead's; not yet fitted on the body bound 2026-11-11", "evidence": "de Vries 1985 Figs. 2, 11, 12, 14-17 (companion/sources/deVries1985_extract.md, section 2). Zoia 2013: Independent of gestational and age periods, hand movements to the eye were longer than those to the mouth (1893+-60 vs. 1640+-74 ms).", "doc": "companion/audit_log/verification/research_grade_2026-11-09/RESULT_PATH_STEPS_1_2.md"}
kind: "method"
source: "[[@de Vries JIP, Visser GHA, Prechtl HFR. The emergence of fetal behaviour. II. Quantitative aspects (p-doi-10-1016-0378-3782-85-90174-4)]]"
---

How often and how long the 12.5 week fetus moves is not learned and not chosen by the body: it is set by the excitability of the spontaneous movement generators, so the generator parameters are FITTED to sourced counts and durations, and contact is never fitted (USER 2026-11-11). Fit targets, median at 12 and 13 weeks [lowest-highest fetus]: general movements 11.5, 12.5 % of time [6-18] (common generator bias); isolated arm movements 48, 51.5 per h [6-104], isolated leg 3, 4 per h [0-26], head retroflexion 20, 41 [2-76], rotation 3, 3 [0-95], anteflexion 1, 1 [0-13] per h (per-joint generator bias; every movement outside a general movement counts, not only large ones); arm in motion 13.7, 14.8 % of time [6.3-23.5], derived from the two above and the movement duration; hand movement time 1.64 s to the mouth, 1.89 s to the eye (passive stiffness and damping or the generator time constants). Held out, validation only: hand-face contacts 23.5, 21 per h [0-78]; hand-to-mouth movements at least 10.5 per h at 14 weeks. The numbers are held in tools/tools_config.json under gm_score.py, TARGET and TARGET_NOTES.

Method record `m.brainstem.movement_fit_targets_12p5`, part: brainstem.

State: de Vries 1985 scatter figures read into the local extract; Zoia 2013 read in full; the derived arm-in-motion share and the choice of which parameter each target constrains are the lead's; not yet fitted on the body bound 2026-11-11.

Source: [[@de Vries JIP, Visser GHA, Prechtl HFR. The emergence of fetal behaviour. II. Quantitative aspects (p-doi-10-1016-0378-3782-85-90174-4)]].
