---
nodeTypeId: "node_LwROzkVH_Zck7ZxDgN91E"
nodeInstanceId: "fdd0b901-319e-7b79-99b8-b86fcf3c7949"
dg_type: "Claim"
dg_name: "m.oa2026_11_08.brainstem_lengths"
record_file: "companion/source_audit/sourcing_records.jsonl"
code: "records"
order: 452
fmt: "default"
data: {"kind": "value", "id": "m.oa2026_11_08.brainstem_lengths", "part": "hypothesis", "quantity": "rostrocaudal length of midbrain, pons and medulla at 12.5 weeks GA (for SYN_MS + L/v path delays)", "value": {"dovjak_k_d_50th": {"midbrain": [0.22, 2.96], "pons": [0.48, -2.38], "medulla": [0.27, 2.76]}, "at_12p5_wk_mm": {"midbrain": 5.71, "pons": 3.62, "medulla": 6.14}, "takakuwa_crl60_mm": {"midbrain": 6.0, "basal_pons": 2.4}, "takakuwa_crl60_deg": {"pontine_flexure": 57, "cervical_flexure": 53}}, "unit": "mm (Dovjak: size = k x GA + d, GA weeks, measured 14-39 weeks; extrapolated 1.5 weeks); Takakuwa read by eye from Fig. 10", "paper_id": "p-pmid32730667", "also": ["p-pmid33754346"], "locator": "Dovjak Table 1; Takakuwa Fig. 10a-b", "species": "human fetus (in vivo MRI 14-39 weeks; Kyoto specimens CRL 22-122 mm)", "limit": "Dovjak below its range at 12.5 weeks; Takakuwa midbrain agrees within 5%; cervical segment not covered", "state": "bounds: d_b3_rn >= 13.7 ms and d_b1e >= 7.1 ms at 1 m/s (now 5 and 6); M-089", "evidence": "companion/source_audit/batch_2026-11-08_oa_library/FINDINGS.md", "doc": "companion/source_audit/batch_2026-11-08_oa_library/FINDINGS.md"}
kind: "value"
source: "[[@Dovjak GO, Schmidbauer V, Brugger PC, et al.. Normal human brainstem development ＜i＞in vivo＜／i＞： a quantitative fetal … (p-pmid32730667)]]"
---

rostrocaudal length of midbrain, pons and medulla at 12.5 weeks GA (for SYN_MS + L/v path delays).

Value record `m.oa2026_11_08.brainstem_lengths`, part: hypothesis.

Value: {"dovjak_k_d_50th": {"midbrain": [0.22, 2.96], "pons": [0.48, -2.38], "medulla": [0.27, 2.76]}, "at_12p5_wk_mm": {"midbrain": 5.71, "pons": 3.62, "medulla": 6.14}, "takakuwa_crl60_mm": {"midbrain": 6.0, "basal_pons": 2.4}, "takakuwa_crl60_deg": {"pontine_flexure": 57, "cervical_flexure": 53}} (mm (Dovjak: size = k x GA + d, GA weeks, measured 14-39 weeks; extrapolated 1.5 weeks); Takakuwa read by eye from Fig. 10).

Where in the source: Dovjak Table 1; Takakuwa Fig. 10a-b.

Species and age: human fetus (in vivo MRI 14-39 weeks; Kyoto specimens CRL 22-122 mm).

Limit: Dovjak below its range at 12.5 weeks; Takakuwa midbrain agrees within 5%; cervical segment not covered.

State: bounds: d_b3_rn >= 13.7 ms and d_b1e >= 7.1 ms at 1 m/s (now 5 and 6); M-089.

Source: [[@Dovjak GO, Schmidbauer V, Brugger PC, et al.. Normal human brainstem development ＜i＞in vivo＜／i＞： a quantitative fetal … (p-pmid32730667)]].
