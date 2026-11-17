---
nodeTypeId: "node_LwROzkVH_Zck7ZxDgN91E"
nodeInstanceId: "937c5673-cb03-7ad5-a00b-21ac9058f210"
dg_type: "Claim"
dg_name: "m.golda2026_11_08.miller2025_fluid_volume"
record_file: "companion/source_audit/sourcing_records.jsonl"
code: "records"
order: 505
fmt: "default"
data: {"kind": "value", "id": "m.golda2026_11_08.miller2025_fluid_volume", "part": "hypothesis", "quantity": "test.miller2025.fluid_and_fetal_volume", "value": {"amniotic_fluid_ml": {"wk10": 60, "wk12": 100, "wk16": 250, "wk20": 350}, "fetal_volume_ml": {"wk10": 30, "wk12": 50, "wk16": 145, "wk20": 330}, "at_12p5_interpolated": {"fluid_ml": 119, "fetal_ml": 62}, "conflict": "Nowlan 2015 (citing Brace & Wolf 1989; Gadd 1966) gives about 20 mL of fluid at 10 weeks, against 60 here; Miller's early rows likely come from Rhodes 1966 (in his reference list)", "bears_on": "body7.uterus_clear (cavity = 1.1 x rest envelope; model choice): needs the model's own envelope volume and a choice of amniotic versus chorionic cavity, so not applied"}, "unit": "mL", "paper_id": "p-doi-10-1016-j-clinbiomech-2025-106513", "locator": "Table 2", "species": "human fetus", "limit": "secondary table; sources disagree at 10 weeks", "state": "growth web test value; candidate for body7.uterus_clear", "evidence": "companion/source_audit/batch_2026-11-08_golda/FINDINGS.md", "doc": "companion/source_audit/batch_2026-11-08_golda/FINDINGS.md"}
kind: "value"
source: "[[@Miller M. Fetal bone loading is a critical determinant of fetal and young infant bone strength (p-doi-10-1016-j-clinbiomech-2025-106513)]]"
---

test.miller2025.fluid_and_fetal_volume.

Value record `m.golda2026_11_08.miller2025_fluid_volume`, part: hypothesis.

Value: {"amniotic_fluid_ml": {"wk10": 60, "wk12": 100, "wk16": 250, "wk20": 350}, "fetal_volume_ml": {"wk10": 30, "wk12": 50, "wk16": 145, "wk20": 330}, "at_12p5_interpolated": {"fluid_ml": 119, "fetal_ml": 62}, "conflict": "Nowlan 2015 (citing Brace & Wolf 1989; Gadd 1966) gives about 20 mL of fluid at 10 ... (mL).

Where in the source: Table 2.

Species and age: human fetus.

Limit: secondary table; sources disagree at 10 weeks.

State: growth web test value; candidate for body7.uterus_clear.

Source: [[@Miller M. Fetal bone loading is a critical determinant of fetal and young infant bone strength (p-doi-10-1016-j-clinbiomech-2025-106513)]].
