---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "880dbf0f-44c4-7e90-ad5f-cd8ddd307bd3"
dg_type: "Issue"
dg_name: "M-010"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 9
data: {"id": "M-010", "category": "M", "priority": "P1", "ref": "CORTEX_CORE_DESIGN.md:55 (s2b 516789b)", "item": "3 unverified recalls: 0.1, L 30; this voltage rule is now the ablation ref='pair')] U5 voltage rule (Artola, Brocher & Singer 1990 [M, verify]; sliding threshold K12, BCM Bienenstock", "why": "U5 is the core plasticity-sign rule. The cortex default is signed covariance (CORTEX_CORE_DESIGN section 12, original voltage rule is ref='pair'): verify Artola 1990 AND the source for the signed-covariance default", "resolve": "Find the paper (download policy allows), read the cited passage, record page/figure, then mark verified, revised (value changed to the source) or declared (kept as a model choice with the reason)", "status": "declared", "evidence": "2026-10-30: g 0.1 and L 30 are declared fits to the T4A criterion (K14-10). Compressed gate run AND the declared-budget t4a_full (600 s, 3 seeds): chosen eta_scale 2.0, recovery 0.444 vs plasticity-off 0.148/0.148/0.093 (>= 2x). Artola 1990 / sliding threshold verified earlier (M-003, M-008). verification/2026-10-30_k14_formed_weights_zhu.md", "touched": "2026-11-04", "note": "Rechecked 2026-11-04: cortex design, outside the 12.5 scope; outcome stands."}
---

3 unverified recalls: 0.1, L 30; this voltage rule is now the ablation ref='pair')] U5 voltage rule (Artola, Brocher & Singer 1990 [M, verify]; sliding threshold K12, BCM Bienenstock.

Why it matters: U5 is the core plasticity-sign rule. The cortex default is signed covariance (CORTEX_CORE_DESIGN section 12, original voltage rule is ref='pair'): verify Artola 1990 AND the source for the signed-covariance default.

To resolve: Find the paper (download policy allows), read the cited passage, record page/figure, then mark verified, revised (value changed to the source) or declared (kept as a model choice with the reason).

Status: declared; priority: P1; category: M.

Evidence so far: 2026-10-30: g 0.1 and L 30 are declared fits to the T4A criterion (K14-10). Compressed gate run AND the declared-budget t4a_full (600 s, 3 seeds): chosen eta_scale 2.0, recovery 0.444 vs plasticity-off 0.148/0.148/0.093 (>= 2x). Artola 1990 / sliding threshold verified earlier (M-003, M-008). verification/2026-10-30_k14_formed_weights_zhu.md.

Note: Rechecked 2026-11-04: cortex design, outside the 12.5 scope; outcome stands.
