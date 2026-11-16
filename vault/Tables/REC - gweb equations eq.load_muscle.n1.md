---
nodeTypeId: "trusoma-record"
nodeInstanceId: "c15dc8db-81e3-7b80-8e78-8b334cba3c93"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 335
group: "equations"
shape: "dictmap"
label: "eq.load_muscle.n1"
data: {"edge": "load_muscle", "kind": "equation", "form": "ϑ̇ = k(ϑ) φ(λ^e), (9); k = (1/τ) [(ϑ^max − ϑ)/(ϑ^max − 1)]^γ. (10); φ = <λ^e − λ^crit> = <λ/ϑ − λ^crit>. (11)", "symbols": {"ϑ": "serial sarcomere number", "λ": "total muscle fibre stretch", "λ^e": "elastic fibre stretch", "λ^crit": "critical stretch threshold", "<>": "Macaulay brackets", "τ": "sarcomere deposition time (adaptation speed)", "γ": "deposition nonlinearity (shape)", "ϑ^max": "maximum serial sarcomere number"}, "parameters": [{"name": "τ", "value": "5.000", "unit": "days", "kind": "fitted"}, {"name": "γ", "value": "0.250", "unit": "-", "kind": "fitted"}, {"name": "ϑ^max", "value": "2.000", "unit": "-", "kind": "assumed"}, {"name": "λ^crit", "value": "1.000", "unit": "-", "kind": "assumed"}, {"name": "L, G (elastic part)", "value": "0.714, 0.179", "unit": "N/mm2", "kind": "assumed"}], "system": "Adult rabbit extensor digitorum lateralis under chronic lengthening; τ and γ calibrated to data cited as [8].", "paper_id": "p-pmid23049683", "locator": "Eqs. 9-11 p 3; Table 1 p 4; page images", "quote": "We model longitudinal muscle growth as a strain-driven process", "maps_to_edge": "Stretch beyond a threshold adds serial sarcomeres, a form for load to muscle growth.", "transfer_assumes": "Assumes adult rabbit calibration and imposed stretch apply to fetal muscle; covers serial number only, not the paralysed rat fetus growth deficit.", "transcription": "clean", "read_depth": "publisher PDF; pages 3-4 read as page images; rest by keyword", "record": "m.eq.load_muscle.n1"}
---
