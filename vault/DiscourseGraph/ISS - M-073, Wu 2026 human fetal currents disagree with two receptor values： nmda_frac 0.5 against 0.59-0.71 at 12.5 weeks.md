---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "4063ca19-d752-7152-8963-f86ffaa0e582"
dg_type: "Issue"
dg_name: "M-073"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 186
data: {"id": "M-073", "category": "M", "priority": "P2", "ref": "companion/source_audit/batch_2026-11-04_undone/LIKELY_SOURCEABLE.md", "item": "Wu 2026 human fetal currents disagree with two receptor values: nmda_frac 0.5 against 0.59-0.71 at 12.5 weeks; tau_nmda_ms 100 ms against about 90 ms at 28 C, 44-56 ms at 37 C", "why": "These set the slow part of brainstem excitation. The decay comes from one digitised example trace per group, the model has no Mg block, and other sources span 44-139 ms", "resolve": "In the correction block, decide each value with a labelled log line and link Wu 2026; run only the one relevant brainstem test", "status": "verified", "evidence": "2026-11-05: nmda_frac 0.59, tau_nmda_ms 50. Probe could not separate this from chaos: firing 0.07-0.09 against a floor of 0.18.", "touched": "2026-11-05", "note": ""}
---

Wu 2026 human fetal currents disagree with two receptor values: nmda_frac 0.5 against 0.59-0.71 at 12.5 weeks; tau_nmda_ms 100 ms against about 90 ms at 28 C, 44-56 ms at 37 C.

Why it matters: These set the slow part of brainstem excitation. The decay comes from one digitised example trace per group, the model has no Mg block, and other sources span 44-139 ms.

To resolve: In the correction block, decide each value with a labelled log line and link Wu 2026; run only the one relevant brainstem test.

Status: verified; priority: P2; category: M.

Evidence so far: 2026-11-05: nmda_frac 0.59, tau_nmda_ms 50. Probe could not separate this from chaos: firing 0.07-0.09 against a floor of 0.18.
