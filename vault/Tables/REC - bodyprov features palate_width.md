---
recordTypeId: "trusoma-record"
nodeInstanceId: "6df85b4f-7f30-70fa-9ecc-dbcfdac06608"
dg_type: "Record"
record_file: "companion/source_audit/body_provenance_12p5_required.json"
code: "bodyprov"
order: 22
group: "features"
shape: "list"
data: {"id": "palate_width", "name": "Hard palate width", "spread": "12 wk: 7.46 +- 0.41 mm; 13 wk: 8.44 +- 0.47 mm (SD 5.5%); Liao 2025 Table 1, read 2026-11-10", "regions": ["palate_hard"], "unit": "mm", "target_12_5": 6.37, "status": "derived", "source_ids": ["S10", "S08"], "data_range_weeks": [12, 20.9], "gap_weeks": 0, "method": "Sherer 2004 15-wk value scaled by the Liao 2025 transverse regression ratio (0.71 w - 1.04) from 12.5 wk; below 12.5 wk the 12.5 wk value is held at its OFD ratio", "real_data_available": {"liao_transverse_12.5": 7.84, "bridged_to_sherer_convention": 6.8, "bridge_range": [6.4, 7.2]}, "trusoma_ref": "growth7.palate_width (wrapper) + body7 LIAO_TR_A/B", "sculpt": {"measured": false}, "required_at_12_5": true, "used_by_trusoma": "oral7.pw", "note": "applied in c1m growth7 (1ea717d). CAVEAT: the landmark offset between Liao and Sherer drifts for width (ratio 1.23 down to 1.09 over 15-20 wk), so the 12.5 wk width carries more uncertainty than the length", "applied_in_growth7": "c1m 1ea717d (2026-10-29)"}
---
