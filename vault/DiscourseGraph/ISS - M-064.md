---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "29e72045-8e7e-7b54-bfde-3799e5dca21f"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 177
data: {"id": "M-064", "category": "M", "priority": "P2", "ref": "companion/source_audit/batch_2026-11-04_undone/res_biological_search.jsonl", "item": "growth7 HEAD_ANCHOR_9 is 0.5, the top of its declared range 0.40-0.50; Blaas 1998 curves give BPD/CRL about 0.42 at 9.0 weeks", "why": "Ultrasound curves already stored in the growth web; this could add to the low readings below 9 weeks in M-060, not checked", "resolve": "Check what the anchor changes in growth7 and decide whether to set it from Blaas with a labelled log line", "status": "in-progress", "evidence": "Not changed: the rest tables and NOSE_Y are derived at this anchor and the code refuses another without re-deriving them; the anchor acts below 12 weeks, so the 12.5 body is untouched 2026-11-05: anchor set to 0.42 from Blaas 1998; no effect at 12.5 weeks. Rest tables below 12.5 not re-derived, M-077.", "touched": "2026-11-05", "note": ""}
---
