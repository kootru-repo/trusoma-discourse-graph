---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "4da17f49-9bb5-726b-8855-5eaf8e6d8cf8"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 207
data: {"id": "M-090", "category": "M", "priority": "P2", "ref": "companion/source_audit/batch_2026-11-08_oa_library/FINDINGS.md", "item": "tau_m decline starts before 14 weeks in human fetal neurons: Tadros 2015 (doi:10.1152/jn.00682.2015) Rin 795 to 279 MOhm between 10-12 and 13-15 WG; Wu 2026 midbrain tau 41 to 31 ms GW10 to GW13.5; conflicts with brainstem_net7.tau_m_ms.lit.n1 = 14 (rat transfer)", "why": "the kink age sets whether the 12.5-week tau_m is the flat early value", "resolve": "define the kink from human fetal data (fit Wu midbrain and pons tau by GW) and decide whether 12.5 weeks lies on the decline", "status": "revised", "evidence": "Applied 2026-11-08 (spec_tau_m_kink.json): brainstem_net7.tau_m_ms.lit.n1 14 -> 10, source-found-fetal (Wu 2026 Fig 2H/2P; Tadros 2015 Table 1); tau_m at 12.5 weeks 56.25 ms; companion/source_audit/batch_2026-11-08_oa_library/FINDINGS.md", "touched": "2026-11-08", "note": ""}
---
