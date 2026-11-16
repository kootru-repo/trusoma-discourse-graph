---
nodeTypeId: "trusoma-record"
nodeInstanceId: "6fad246c-d44d-7b70-bd07-61e7e7d57c97"
dg_type: "Record"
record_file: "companion/source_audit/body_provenance_12p5_required.json"
code: "bodyprov"
order: 8
group: "features"
shape: "list"
data: {"id": "bpd", "name": "Biparietal diameter", "regions": ["cranium"], "unit": "mm", "target_12_5": 21.88, "status": "sourced_interpolated", "source_ids": ["S02"], "data_range_weeks": [12, 12.86], "gap_weeks": 0, "independent_check": {"gjessing_linear_between_12+0_and_12+6_mm": 21.54, "growth7_pct_diff": 1.6}, "method": "12+0 wk anchor blended to INTERGROWTH at 14 wk; Gjessing gives 19.5 mm at 12+0 and 23.0 mm at 12+6, so 12.5 wk lies between two published points", "trusoma_ref": "growth7.bpd", "sculpt": {"measured": true, "value": 18.52, "deviation_pct": -15.4, "method": "skin vertices within 0.5 R of the sourced head ellipsoid (skin adds 1-2 mm)"}, "required_at_12_5": true, "used_by_trusoma": "body7.Template R = bpd/2"}
---
