---
nodeTypeId: "node_LwROzkVH_Zck7ZxDgN91E"
nodeInstanceId: "7754373e-b8a6-7fca-ba7f-6060a2fdf822"
dg_type: "Claim"
record_file: "companion/source_audit/sourcing_records.jsonl"
code: "records"
order: 400
fmt: "compact"
data: {"kind": "value", "id": "m.brainstem.depression.pmc2853287", "part": "brainstem", "quantity": "brainstem generator depression and per-synapse delay", "value": {"brainstem_s2.k_dep": 0.05}, "unit": "s / rate fraction / ms", "paper_id": "p-pmc2853287", "locator": "companion/source_audit/batch_2026-11-05_values/BRAINSTEM_TABAK.md", "species": "Tabak 2010 mean-field model of developing excitatory networks (built on the chick embryo cord), Table 2 parameter", "limit": "Tabak's a (mean activity, 0-1) -> popnet's filtered rate fraction e; the slope of popnet's logistic h(e) equals k_s (value kept); the threshold TH_DEP stays declared (0.5 against theta_s 0.2, moved for PopNet's resting rates)", "state": "read by the lead"}
kind: "value"
source: "[[@p-pmc2853287]]"
---
