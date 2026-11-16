---
nodeTypeId: "node_LwROzkVH_Zck7ZxDgN91E"
nodeInstanceId: "8e035aaf-1268-7d9f-b23b-370cc739b79d"
dg_type: "Claim"
record_file: "companion/source_audit/sourcing_records.jsonl"
code: "records"
order: 450
fmt: "default"
data: {"kind": "value", "id": "m.adult_transition.c8_ou_tau_i", "part": "hypothesis", "quantity": "decay time constant of spontaneous GABA/glycine IPSCs in fetal motoneurons (candidate for popnet.popnet.init.ou_tau_i_ms, now 10 ms from adult cat)", "value": {"sIPSC_WT": 21.89, "sIPSC_WT_sem": 0.42, "mIPSC_WT": 16.11, "mIPSC_WT_sem": 0.4, "pure_GABA_mIPSC_WT": 19.51, "pure_glycine_mIPSC_WT": 6.53, "sIPSC_IEI_WT_ms": 157.9, "sIPSC_amp_WT_pA": 61.7}, "unit": "ms (mean +/- SEM), 30 C", "paper_id": "p-pmid31868588", "locator": "Results, Figure 4A4, 4A6, 4B1-B4 (WT littermates)", "species": "mouse fetus E17.5, lumbar spinal motoneurons, isolated spinal cord; E15 is about human 12.5 weeks GA by Workman 2013, so E17.5 is a little later", "limit": "spinal, not brainstem; recorded at 30 C, not 37 C, and no sourced fetal Q10 to correct it (a correction would shorten it); human fetal check: Wu 2026 accepted sIPSCs with decay 10-30 ms at GW10-17 (an inclusion window, not a measurement)", "state": "read in full 2026-11-08; candidate 21.9 ms; to apply after the adult-value probe finishes (it perturbs this value)"}
kind: "value"
source: "[[@p-pmid31868588]]"
---
