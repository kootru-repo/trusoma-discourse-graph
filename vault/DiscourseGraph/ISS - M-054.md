---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "f6359e28-2fd2-7ac8-ab67-39686820af33"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 141
data: {"id": "M-054", "category": "M", "priority": "P1", "ref": "Kootru-Labs PROPOSED_GROWTH7_CHANGES.md", "item": "growth7 palate (4.80x5.09 mm) and tongue (6.80x5.77 mm) at 12.5 wk are OFD-ratio extrapolations; measured data exist: Liao 2025 CPCJ 62:21-27 regressions PMD=1.16*GA-7.86 and transverse=0.71*GA-1.04 (12-20+6 wk), Koren 2023 JUM 42:59-70 Table 4 13-wk median tongue length 8.0 mm. Apply the proposal (palate 5.12x6.37, tongue 7.19x5.84 at 12.5).", "why": "numbers checked against both PDFs 2026-10-29; c1m binds constants through the cid log (K1-K4) and replacing sourced cids needs a CID-APPROVE line with VERDICT: CLEAN, which the no-review rule and the brain guard do not let Claude produce", "resolve": "owner: append the new cids with [V] appendix entries (Liao 2025, Koren 2023) in c1m, approve the supersede lines, then re-gate and re-seal contact tests", "status": "verified", "evidence": "c1m commit c1c2f7d registry verify ops 2026-10-29: Liao 2025 PMD = 1.16X - 7.86 (R2 0.967), transverse 0.71X - 1.04, valid from 12 wk; Koren 2023 Tables 4/5 at 13 wk 8.0 x 6.5 mm (N 23); growth7 12.5 wk values derive from these", "touched": "2026-10-29", "note": ""}
---
