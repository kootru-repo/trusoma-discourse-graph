---
nodeTypeId: "node_Qbdr-LbBCb_WjPFNTnjTX"
nodeInstanceId: "e86f611f-c4dc-7ee5-9ca9-251dddf41e65"
dg_type: "Experiment"
date: "2026-11-08"
record: "companion/audit_log/verification/sensitivity_2026-11-08_brainstem/RESULT.md"
quote: "# Result: brainstem sensitivity probe, 6 seeds (plan step 3, 2026-11-08)"
method_record: "companion/audit_log/verification/sensitivity_2026-11-08_brainstem/PLAN.md"
method: ["**Question.** Do the 16 open fetal brainstem values change the 12.5-week brainstem loop by more than its own chaotic noise? The 2026-11-06 probe had 2 seeds and one floor run per seed, so it could not separate small effects from noise (the 0.1% floor already moved pattern 0.41 and structure 0.64 on seed 1).", "- 6 seeds (1-6). Per seed: a baseline; a floor (all 16 values x 1.001); and each group x 0.75 and x 1.25. Integer values are rounded to at least 1.", "**Measures.** Pattern, where, structure, firing, amount, movement and firing_level, each against the same seed's baseline (the 2026-11-06 definitions).", "- A group MATTERS if, for any of pattern, where, structure or firing, its median over seeds of the larger of its two directions exceeds 0.05 AND exceeds 2 x the median of the floor runs over seeds."]
---

From the record: "# Result: brainstem sensitivity probe, 6 seeds (plan step 3, 2026-11-08)"

Method, from the plan `companion/audit_log/verification/sensitivity_2026-11-08_brainstem/PLAN.md`:

"**Question.** Do the 16 open fetal brainstem values change the 12.5-week brainstem loop by more than its own chaotic noise? The 2026-11-06 probe had 2 seeds and one floor run per seed, so it could not separate small effects from noise (the 0.1% floor already moved pattern 0.41 and structure 0.64 on seed 1)."

"- 6 seeds (1-6). Per seed: a baseline; a floor (all 16 values x 1.001); and each group x 0.75 and x 1.25. Integer values are rounded to at least 1."

"**Measures.** Pattern, where, structure, firing, amount, movement and firing_level, each against the same seed's baseline (the 2026-11-06 definitions)."

"- A group MATTERS if, for any of pattern, where, structure or firing, its median over seeds of the larger of its two directions exceeds 0.05 AND exceeds 2 x the median of the floor runs over seeds."

Record file: `companion/audit_log/verification/sensitivity_2026-11-08_brainstem/RESULT.md`, 2026-11-08.
