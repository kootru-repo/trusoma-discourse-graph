---
nodeTypeId: "node_xQmEzWQFHdHy2swhrugrF"
nodeInstanceId: "c7da8d1c-cb1e-731e-82e3-d4356a4d6333"
dg_type: "Evidence"
dg_name: "gweb values test.herb2023.hypothalamic_peptides_gw"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 292
group: "values"
shape: "dictmap"
label: "test.herb2023.hypothalamic_peptides_gw"
data: {"value": {"POMC_ARC": 10, "TRH_PVH": 10, "KISS1_ARC": 12, "OXT_AVP_PVH": 16, "AGRP_ARC": 18}, "unit": "gestational weeks (GW), first detection in scRNA-seq; sampled GW6-8, 10, 12, then 15 onward", "role": "test", "extrapolation": "none", "age_basis": "GW as printed", "read_depth": "full text", "record": "m.growth.upper_core.herb2023.hypothalamic_peptides_gw", "paper_id": "p-pmid37939194", "quote": "In the ARC, POMC was detected at low levels in the first trimester (GW10) ... KISS1 was detected by GW12, and AGRP was observed by GW18 (fig. S14). In the PVH, the canonical neuropeptide TRH was detected in trimester 1 (GW10) ... Many other neuropeptides such as OXT and AVP were not observed until the second trimester (GW16; fig. S14)."}
opposes: ["[[CLM - onsets wk, weeks of gestation as printed, human abortuses, immunocytochemistry (m.growth.upper_core.yew1999.onsets_wk)]]"]
opposes_basis: "hypothalamic peptides conflict with Herb 2023 (OXT and AVP transcripts not seen until GW16; Herb has no sample between GW12 and GW15)"
---

test.herb2023.hypothalamic_peptides_gw = {"POMC_ARC": 10, "TRH_PVH": 10, "KISS1_ARC": 12, "OXT_AVP_PVH": 16, "AGRP_ARC": 18}.

Unit and reading: gestational weeks (GW), first detection in scRNA-seq; sampled GW6-8, 10, 12, then 15 onward.

Quote: "In the ARC, POMC was detected at low levels in the first trimester (GW10) ... KISS1 was detected by GW12, and AGRP was observed by GW18 (fig. S14). In the PVH, the canonical neuropeptide TRH was detected in trimester 1 (GW10) ... Many other neuropeptides such as OXT and AVP were not observed until the second trimester (GW16; fig. S14)."

Role: test; extrapolation: none; age basis: GW as printed; read depth: full text.

Source: [[@p-pmid37939194]].

Opposes: [[CLM - onsets wk, weeks of gestation as printed, human abortuses, immunocytochemistry (m.growth.upper_core.yew1999.onsets_wk)]].

The conflict as the vault states it: "hypothalamic peptides conflict with Herb 2023 (OXT and AVP transcripts not seen until GW16; Herb has no sample between GW12 and GW15)"
