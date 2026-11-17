---
recordTypeId: "trusoma-record"
nodeInstanceId: "24ab952e-b9fc-71b9-9fd6-9a38e8350cc0"
dg_type: "Record"
record_file: "companion/source_audit/body_provenance_12p5_required.json"
code: "bodyprov"
order: 12
group: "features"
shape: "list"
data: {"id": "neck", "name": "Neck circumference", "spread": "SD 6.5 mm at 12.5 wk (19%), from the nomogram's own equation SD (cm) = 3.15 - 0.3823 GA + 0.01733 GA^2 - 0.0002179 GA^3, extrapolated 1.5 wk below its data (14-40 wk); Sherer 2007 (J Ultrasound Med 26:1529-37, PMID 17957047), abstract read 2026-11-10; its mean equation gives 34.86 mm", "regions": [], "unit": "mm", "target_12_5": 34.86, "status": "extrapolated", "source_ids": ["S11"], "data_range_weeks": [14, 40], "gap_weeks": 1.5, "method": "14-wk ratio to the head held", "trusoma_ref": "growth7.neck_circ", "sculpt": {"measured": false}, "required_at_12_5": true, "used_by_trusoma": "body7.neck_xy (growth7.neck_circ, 14-wk ratio held)"}
---
