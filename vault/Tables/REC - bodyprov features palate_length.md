---
nodeTypeId: "trusoma-record"
nodeInstanceId: "3ba2df62-a88b-7727-b5f7-1ba4e2d02646"
dg_type: "Record"
record_file: "companion/source_audit/body_provenance_12p5_required.json"
code: "bodyprov"
order: 21
group: "features"
shape: "list"
data: {"id": "palate_length", "name": "Hard palate length", "spread": "12 wk: 6.38 +- 0.39 mm; 13 wk: 7.35 +- 0.50 mm (SD 6-7%), measured as the premaxilla-to-posterior distance; Liao 2025 Table 1, read 2026-11-10", "regions": ["palate_hard", "palate_soft"], "unit": "mm", "target_12_5": 5.12, "status": "derived", "source_ids": ["S10", "S08"], "data_range_weeks": [12, 20.9], "gap_weeks": 0, "method": "Sherer 2004 15-wk value scaled by the Liao 2025 PMD regression ratio (1.16 w - 7.86) from 12.5 wk; below 12.5 wk the 12.5 wk value is held at its OFD ratio", "real_data_available": {"liao_PMD_12.5": 6.64, "bridged_to_sherer_convention": 5.09}, "trusoma_ref": "growth7.palate_length (wrapper) + body7 LIAO_PMD_A/B", "note": "applied in c1m growth7 (1ea717d). Liao and Sherer measure the palate from different landmarks; the ratio is stable for length (about 1.30 over 15-20 wk)", "sculpt": {"measured": true, "region_dev_mm": {"palate_hard": {"n": 5815, "mean_abs_mm": 2.32, "signed_mm": -2.32, "mean_abs_R": 0.212, "verdict": "within 0.25 R of sourced"}, "palate_soft": {"n": 444, "mean_abs_mm": 1.3, "signed_mm": -1.3, "mean_abs_R": 0.119, "verdict": "within 0.25 R of sourced"}}}, "required_at_12_5": true, "used_by_trusoma": "oral7.pl", "applied_in_growth7": "c1m 1ea717d (2026-10-29)"}
---
