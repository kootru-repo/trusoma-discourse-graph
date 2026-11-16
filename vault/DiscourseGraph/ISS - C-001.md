---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "48170e6c-9801-7979-9fa2-ceec5ce64e2a"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 52
data: {"id": "C-001", "category": "C", "priority": "P1", "ref": "tools/trusoma/brain/cortex_core.py:381 (M-TH, default off)", "item": "np.clip(w*exp((rho-xbar)/(rho*tau)), MTH_LO*W_RELAY, MTH_HI*W_RELAY): a clamp after an unconstrained multiplicative step", "why": "contradicts the package principle that every bound follows from the rule itself (no clamp after an unconstrained step)", "resolve": "Replace by an exact bounded solution of the same dynamics (as bounded()/scale() do) or record a declared exception with its rationale; check behaviour when M-TH is enabled", "status": "declared", "evidence": "M-TH (cortex_core.py:381, c1m) is default off, bit-identical when off, and NOT adopted (M0_LIPS_FIRST_LEARNER_DESIGN:41 'not adopted, fragile'; BRAINSTEM_APPENDIX_A:401). Declared exception: the clamp is the M-TH arm's own bound, an exact bounded solution would change a rejected arm's dynamics; revisit only if M-TH is ever adopted. 2026-10-30", "touched": "2026-10-30", "note": ""}
---
