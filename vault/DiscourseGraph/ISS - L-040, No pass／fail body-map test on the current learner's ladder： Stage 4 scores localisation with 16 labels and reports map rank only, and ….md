---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "aa523136-83ac-7757-8cd0-3552e8ac7fe1"
dg_type: "Issue"
dg_name: "L-040"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 156
data: {"id": "L-040", "category": "L", "priority": "P2", "ref": "companion/NSF_SEED_FUND_TARGET.md; companion/TRUSOMA_STAGE4_LOCALISE.md; rf_bench/bjepa_topo_score.py", "item": "No pass/fail body-map test on the current learner's ladder: Stage 4 scores localisation with 16 labels and reports map rank only, and it is discarded for the dense form. A project scorer (map_readout) was used on an earlier, different learner", "why": "A self-calibrating body map is the product claim, yet no stage decides on a map", "resolve": "Read map_readout and pre-register a layout-blind map criterion before any Stage 2b score", "status": "verified", "evidence": "Pass/fail map test pre-registered in companion/TRUSOMA_STAGE5_MAP.md before any Stage 1b or 2b score; project scorer map_readout.py used unchanged; raw-only check run", "touched": "2026-11-03", "note": ""}
---

No pass/fail body-map test on the current learner's ladder: Stage 4 scores localisation with 16 labels and reports map rank only, and it is discarded for the dense form. A project scorer (map_readout) was used on an earlier, different learner.

Why it matters: A self-calibrating body map is the product claim, yet no stage decides on a map.

To resolve: Read map_readout and pre-register a layout-blind map criterion before any Stage 2b score.

Status: verified; priority: P2; category: L.

Evidence so far: Pass/fail map test pre-registered in companion/TRUSOMA_STAGE5_MAP.md before any Stage 1b or 2b score; project scorer map_readout.py used unchanged; raw-only check run.
