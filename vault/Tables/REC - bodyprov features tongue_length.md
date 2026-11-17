---
recordTypeId: "trusoma-record"
nodeInstanceId: "dbfc8800-ce57-7045-8b03-8f699353066d"
dg_type: "Record"
record_file: "companion/source_audit/body_provenance_12p5_required.json"
code: "bodyprov"
order: 19
group: "features"
shape: "list"
data: {"id": "tongue_length", "name": "Tongue length", "spread": "13 wk, n 23: median 8.0 mm, 5th-95th centile 6.9-9.0 (SD 0.64 mm, 8%); Koren 2023 Table 4, read 2026-11-10", "regions": ["tongue"], "unit": "mm", "target_12_5": 7.19, "status": "extrapolated", "source_ids": ["S07"], "data_range_weeks": [13, 40], "gap_weeks": 0.5, "method": "growth7 holds the Koren 2023 13-wk median (Tables 4 and 5: 8.0 x 6.5 mm) at its OFD ratio below 13 wk, linear to the 14-wk row between", "real_data_available": {"koren_13wk_median": 8.0, "koren_14wk_median": 9.2}, "trusoma_ref": "growth7.tongue (KOREN13_*)", "sculpt": {"measured": true, "value": 6.69, "deviation_pct": -1.6, "method": "PCA extent of the tongue mesh after the x1.21 scale (original 5.53)"}, "required_at_12_5": true, "used_by_trusoma": "tongue7 G7.tongue", "applied_in_growth7": "c1m 1ea717d (2026-10-29)"}
---
