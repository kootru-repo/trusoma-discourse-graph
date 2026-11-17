---
nodeTypeId: "node_xQmEzWQFHdHy2swhrugrF"
nodeInstanceId: "e9743492-c9d7-756d-b708-4a38b064a0ec"
dg_type: "Evidence"
dg_name: "gweb values test.miller2025.fluid_and_fetal_volume"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 317
group: "values"
shape: "dictmap"
label: "test.miller2025.fluid_and_fetal_volume"
data: {"value": {"amniotic_fluid_ml": {"wk10": 60, "wk12": 100, "wk16": 250, "wk20": 350}, "fetal_volume_ml": {"wk10": 30, "wk12": 50, "wk16": 145, "wk20": 330}, "at_12p5_interpolated": {"fluid_ml": 119, "fetal_ml": 62}, "conflict": "Nowlan 2015 (citing Brace & Wolf 1989; Gadd 1966) gives about 20 mL of fluid at 10 weeks, against 60 here; Miller's early rows likely come from Rhodes 1966 (in his reference list)", "bears_on": "body7.uterus_clear (cavity = 1.1 x rest envelope; model choice): needs the model's own envelope volume and a choice of amniotic versus chorionic cavity, so not applied"}, "unit": "mL (fetal weight in g taken as mL at density 1.0)", "role": "test", "extrapolation": "none", "age_basis": "gestational weeks as printed (Table 2)", "read_depth": "review table, full text (read 2026-11-08, Golda library); primary source not named in the table", "record": "m.golda2026_11_08.miller2025_fluid_volume", "paper_id": "p-doi-10-1016-j-clinbiomech-2025-106513", "quote": "Table 2 Amniotic Fluid Volume Versus Fetal Volume at Increasing Gestational Age. Gestational Age (weeks) Amniotic Fluid Volume (mL) Fetal Weight (g) Fetal Volume* (mL) 10 60 30 30 12 100 50 50 16 250 145 145"}
---

test.miller2025.fluid_and_fetal_volume = {"amniotic_fluid_ml": {"wk10": 60, "wk12": 100, "wk16": 250, "wk20": 350}, "fetal_volume_ml": {"wk10": 30, "wk12": 50, "wk16": 145, "wk20": 330}, "at_12p5_interpolated": {"fluid_ml": 119, "fetal_ml": 62}, "conflict": "Nowlan 2015 (citing Brace & Wolf 1989; Gadd 1966) gives about 20 mL of fluid at 10 weeks, against 60 here; Miller's early rows likely come from Rhodes 1966 (in his reference list)", ...

Unit and reading: mL (fetal weight in g taken as mL at density 1.0).

Quote: "Table 2 Amniotic Fluid Volume Versus Fetal Volume at Increasing Gestational Age. Gestational Age (weeks) Amniotic Fluid Volume (mL) Fetal Weight (g) Fetal Volume* (mL) 10 60 30 30 12 100 50 50 16 250 145 145"

Role: test; extrapolation: none; age basis: gestational weeks as printed (Table 2); read depth: review table, full text (read 2026-11-08, Golda library); primary source not named in the table.

Source: [[@p-doi-10-1016-j-clinbiomech-2025-106513]].
