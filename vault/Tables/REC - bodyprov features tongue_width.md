---
nodeTypeId: "trusoma-record"
nodeInstanceId: "dc5e2070-98af-7f31-8c6d-e83aee920502"
dg_type: "Record"
record_file: "companion/source_audit/body_provenance_12p5_required.json"
code: "bodyprov"
order: 20
group: "features"
shape: "list"
data: {"id": "tongue_width", "name": "Tongue width", "spread": "13 wk, n 23: median 6.5 mm, 5th-95th centile 5.4-7.6 (SD 0.67 mm, 10%); Koren 2023 Table 5, read 2026-11-10", "regions": ["tongue"], "unit": "mm", "target_12_5": 5.84, "status": "extrapolated", "source_ids": ["S07"], "data_range_weeks": [13, 40], "gap_weeks": 0.5, "method": "growth7 holds the Koren 2023 13-wk median (Tables 4 and 5: 8.0 x 6.5 mm) at its OFD ratio below 13 wk, linear to the 14-wk row between", "real_data_available": {"koren_13wk_median": 6.5, "koren_14wk_median": 7.8}, "trusoma_ref": "growth7.tongue (KOREN13_*)", "sculpt": {"measured": true, "value": 5.25, "deviation_pct": -9.0, "method": "as above (original 4.87)"}, "required_at_12_5": true, "used_by_trusoma": "oral7.tw and tongue7", "applied_in_growth7": "c1m 1ea717d (2026-10-29)"}
---
