---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "4b8f92f4-aab9-725e-b652-f192dc1e8adc"
dg_type: "Issue"
dg_name: "L-028"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 137
data: {"id": "L-028", "category": "L", "priority": "P1", "ref": "CF2_CELL_SPEC C2 vs He 2015", "item": "C2 time constants do not follow from the quoted data: the spec says LTP is halved at a 5 s delay, which for an exponential tag means tau_LTP = 5/ln2 = 7.2 s, but the spec and appendix use tau_LTP 2 s (60 ticks) and tau_LTD 1 s (30 ticks); He 2015 full text could not be opened (PMC blocks, Europe PMC 500)", "why": "", "resolve": "Obtain the He 2015 PDF, read the delay results, then fit tau_LTP and tau_LTD (K14-2) and correct spec and appendix.", "status": "revised", "evidence": "2026-10-30 APPLIED (c1m 4c362dc, full gate passed): TAU_LTP 60->290, TAU_LTD 30->164 ticks (He 2015 Fig 6 fits 9.56 s / 5.40 s); ETA 0.05->0.0103 (x60/290) and L_COV 30->5.5 (x30/164) keep the tag charge per event, which fixes the T7/T4A failure of applying the taus alone: T4A recovery 2.4-5.2x plasticity-off, cross/nn <= 0.58, test_cortex_core passes. Synced: core_v0 (4 learning constants), cid log value ops + new tau_ltp cids (cortex_core, core_v0), appendix text (CF2_CONSTANTS_APPENDIX, BRAINSTEM A20/A27), pins (test_self_assembly x3, test_wp3, test_core_v0 snapshot). Supersedes the 'declared, kept old taus' decision of earlier today.", "touched": "2026-10-30", "note": ""}
---

C2 time constants do not follow from the quoted data: the spec says LTP is halved at a 5 s delay, which for an exponential tag means tau_LTP = 5/ln2 = 7.2 s, but the spec and appendix use tau_LTP 2 s (60 ticks) and tau_LTD 1 s (30 ticks); He 2015 full text could not be opened (PMC blocks, Europe PMC 500).

To resolve: Obtain the He 2015 PDF, read the delay results, then fit tau_LTP and tau_LTD (K14-2) and correct spec and appendix.

Status: revised; priority: P1; category: L.

Evidence so far: 2026-10-30 APPLIED (c1m 4c362dc, full gate passed): TAU_LTP 60->290, TAU_LTD 30->164 ticks (He 2015 Fig 6 fits 9.56 s / 5.40 s); ETA 0.05->0.0103 (x60/290) and L_COV 30->5.5 (x30/164) keep the tag charge per event, which fixes the T7/T4A failure of applying the taus alone: T4A recovery 2.4-5.2x plasticity-off, cross/nn <= 0.58, test_cortex_core passes. Synced: core_v0 (4 learning constants), cid log value ops + new tau_ltp cids (cortex_core, core_v0), appendix text (CF2_CONSTANTS_APPENDIX, BRAINSTEM A20/A27), pins (test_self_assembly x3, test_wp3, test_core_v0 snapshot). Supersedes the 'declared, kept old taus' decision of earlier today.
