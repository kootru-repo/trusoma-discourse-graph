---
nodeTypeId: "trusoma-record"
nodeInstanceId: "7f22ba1c-58b0-7353-8ce5-a0a49d488e38"
dg_type: "Record"
record_file: "companion/source_audit/body_provenance_12p5_required.json"
code: "bodyprov"
order: 16
group: "features"
shape: "list"
data: {"id": "tibia", "name": "Tibia length", "regions": ["L_leg", "R_leg"], "unit": "mm", "target_12_5": 11.49, "status": "derived", "source_ids": ["S05", "S04"], "method": "14-wk tibia/femur ratio x the whole femur 14.19 mm", "gap_weeks": 1.5, "trusoma_ref": "growth7.limbs", "sculpt": {"measured": true, "region_dev_mm": {"L_leg": {"n": 1599, "mean_abs_mm": 2.85, "signed_mm": 2.85, "mean_abs_R": 0.261, "verdict": "sculpt larger than sourced"}, "R_leg": {"n": 2139, "mean_abs_mm": 2.58, "signed_mm": 2.58, "mean_abs_R": 0.236, "verdict": "within 0.25 R of sourced"}}}, "required_at_12_5": true, "used_by_trusoma": "body7 segment length", "note": "2026-11-11: target changed from the ultrasound shaft length to the whole bone the physics body has used since 2026-11-05 (audit item M-068); the sculpt figures below were taken against the shaft target"}
---
