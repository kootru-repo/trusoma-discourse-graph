---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "3ace0f0e-a54c-7ec3-af94-34721778427a"
dg_type: "Issue"
dg_name: "L-027"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 136
data: {"id": "L-027", "category": "L", "priority": "P1", "ref": "cortex_core.py vs CF2_CELL_SPEC C3/H2", "item": "CODE SYNC: C3 still draws binomial(S, K_CONV*ne) and consumes the tag (cortex_core.py:160, tg.py:91); H2 still uses conserve(W_BUDGET, ETA_N); spec now says dw/dt = M x e and a heterosynaptic term", "why": "", "resolve": "Implement after K14-2 and K14-7 give the constants; then tests and provenance.", "status": "blocked", "evidence": "2026-10-30: C3 HALF DONE (c1m b4b72a4, full gate passed): conversion is dw/dt = M x e, no per-tick binomial draw, no tag consumption, in cortex_core and tg; ETA 0.0103->0.0042 and L_COV 5.5->3.0 keep the charge per tag event (1 + k_conv x tau = 2.45 / 1.82); T4A recovery 2.4-4.2x off, cross/nn <= 0.61; T5 test now asserts the deterministic rate; CORE_V0, cid log, appendix, pins synced. H2 HALF BLOCKED: heterosynaptic dw_i/dt = -beta g(post)(w_i - w_ref_i) needs K14-7 (beta, g, reference time scale), which needs the Royer & Pare 2003 full text (abstract only is public) - conserve(W_BUDGET, ETA_N) stays until then.", "touched": "2026-10-30", "note": ""}
---

CODE SYNC: C3 still draws binomial(S, K_CONV*ne) and consumes the tag (cortex_core.py:160, tg.py:91); H2 still uses conserve(W_BUDGET, ETA_N); spec now says dw/dt = M x e and a heterosynaptic term.

To resolve: Implement after K14-2 and K14-7 give the constants; then tests and provenance.

Status: blocked; priority: P1; category: L.

Evidence so far: 2026-10-30: C3 HALF DONE (c1m b4b72a4, full gate passed): conversion is dw/dt = M x e, no per-tick binomial draw, no tag consumption, in cortex_core and tg; ETA 0.0103->0.0042 and L_COV 5.5->3.0 keep the charge per tag event (1 + k_conv x tau = 2.45 / 1.82); T4A recovery 2.4-4.2x off, cross/nn <= 0.61; T5 test now asserts the deterministic rate; CORE_V0, cid log, appendix, pins synced. H2 HALF BLOCKED: heterosynaptic dw_i/dt = -beta g(post)(w_i - w_ref_i) needs K14-7 (beta, g, reference time scale), which needs the Royer & Pare 2003 full text (abstract only is public) - conserve(W_BUDGET, ETA_N) stays until then.
