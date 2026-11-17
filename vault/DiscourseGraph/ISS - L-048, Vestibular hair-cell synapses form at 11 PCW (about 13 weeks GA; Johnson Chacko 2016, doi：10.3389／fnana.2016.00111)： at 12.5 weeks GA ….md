---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "abe3ca09-e6ac-7a22-85e4-1c5bd966e88a"
dg_type: "Issue"
dg_name: "L-048"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 208
data: {"id": "L-048", "category": "L", "priority": "P2", "ref": "companion/source_audit/batch_2026-11-08_oa_library/FINDINGS.md", "item": "Vestibular hair-cell synapses form at 11 PCW (about 13 weeks GA; Johnson Chacko 2016, doi:10.3389/fnana.2016.00111): at 12.5 weeks GA the model's resting vestibular afferent drive (VEST_AFF_BIAS, W_VEST_NUC) is ahead of the anatomy", "why": "Phase 1 inputs should exist in the 12.5-week anatomy (body is the source)", "resolve": "gate vestibular afferent input on the growth web (onset 11 PCW) or record it as a declared early input; decide in the growth plan", "status": "revised", "evidence": "Decided and applied 2026-11-08: setting.brainstem_s2.K_VEST 0.5 -> 0 (source-found-fetal, Johnson Chacko 2016: hair-cell contacts at 11 PCW, about 13 GA); afferent bias and noise kept; growth web test 'vestibular' holds the onset for later phases; spec_relay_lc_kvest.json; DECISIONS_PENDING 2026-11-08", "touched": "2026-11-08", "note": ""}
---

Vestibular hair-cell synapses form at 11 PCW (about 13 weeks GA; Johnson Chacko 2016, doi:10.3389/fnana.2016.00111): at 12.5 weeks GA the model's resting vestibular afferent drive (VEST_AFF_BIAS, W_VEST_NUC) is ahead of the anatomy.

Why it matters: Phase 1 inputs should exist in the 12.5-week anatomy (body is the source).

To resolve: gate vestibular afferent input on the growth web (onset 11 PCW) or record it as a declared early input; decide in the growth plan.

Status: revised; priority: P2; category: L.

Evidence so far: Decided and applied 2026-11-08: setting.brainstem_s2.K_VEST 0.5 -> 0 (source-found-fetal, Johnson Chacko 2016: hair-cell contacts at 11 PCW, about 13 GA); afferent bias and noise kept; growth web test 'vestibular' holds the onset for later phases; spec_relay_lc_kvest.json; DECISIONS_PENDING 2026-11-08.
