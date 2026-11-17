---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "ef79d352-9846-7954-b43b-97a17f35ca03"
dg_type: "Issue"
dg_name: "M-071"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 184
data: {"id": "M-071", "category": "M", "priority": "P2", "ref": "companion/source_audit/batch_2026-11-04_undone/LIKELY_SOURCEABLE.md", "item": "GABA force in brainstem and neuron models is positive at every chloride state, so GABA can never excite; fetal data suggest excitation may persist at 12.5 weeks", "why": "Ren and Greer 2006 rat medulla: GABA agonist raises rhythm at E17, transition about E19; recorded Workman mapping puts 12.5 weeks at rat E16.9 and E19 at 15.5 weeks. Delpy 2008 mouse motoneurons: E_Cl above threshold to E15.5. Network effect and K+-dependent; the Workman lines were not rechecked", "resolve": "Recheck Workman Table 2 and compute the mouse mapping; read Wu 2026's source and Kirmse 2015, which the code cites; then decide whether the force needs a negative range at 12.5 weeks. A join to test, not a value to change from this log alone", "status": "in-progress", "evidence": "2026-11-06 OA search: Delpy 2008 fetal mouse gives D_mat about 1.0 at birth (model 2.0); Herb 2023 (Sci Adv, doi 10.1126/sciadv.adf6251) human SCN all GABAergic -> B1d_scn sign -1 against +1 (not applied; deferred sleep circuit). See batch_2026-11-06_oa_search/brainstem.md, sleep.md", "touched": "2026-11-06", "note": "2026-11-05: Wu 2026's 16-18 weeks traces to Tyzio 2006, rat, by its title, so it is not human evidence."}
---

GABA force in brainstem and neuron models is positive at every chloride state, so GABA can never excite; fetal data suggest excitation may persist at 12.5 weeks.

Why it matters: Ren and Greer 2006 rat medulla: GABA agonist raises rhythm at E17, transition about E19; recorded Workman mapping puts 12.5 weeks at rat E16.9 and E19 at 15.5 weeks. Delpy 2008 mouse motoneurons: E_Cl above threshold to E15.5. Network effect and K+-dependent; the Workman lines were not rechecked.

To resolve: Recheck Workman Table 2 and compute the mouse mapping; read Wu 2026's source and Kirmse 2015, which the code cites; then decide whether the force needs a negative range at 12.5 weeks. A join to test, not a value to change from this log alone.

Status: in-progress; priority: P2; category: M.

Evidence so far: 2026-11-06 OA search: Delpy 2008 fetal mouse gives D_mat about 1.0 at birth (model 2.0); Herb 2023 (Sci Adv, doi 10.1126/sciadv.adf6251) human SCN all GABAergic -> B1d_scn sign -1 against +1 (not applied; deferred sleep circuit). See batch_2026-11-06_oa_search/brainstem.md, sleep.md.

Note: 2026-11-05: Wu 2026's 16-18 weeks traces to Tyzio 2006, rat, by its title, so it is not human evidence.
