---
nodeTypeId: "node_LwROzkVH_Zck7ZxDgN91E"
nodeInstanceId: "64911c55-a02d-7950-8d99-a18de52747a1"
dg_type: "Claim"
dg_name: "m.atlas2026_11_16.kronman_brainstem_volumes"
record_file: "companion/source_audit/sourcing_records.jsonl"
code: "records"
order: 540
fmt: "compact"
data: {"kind": "value", "id": "m.atlas2026_11_16.kronman_brainstem_volumes", "part": "hypothesis", "quantity": "volume of midbrain and of the prepontine, pontine, pontomedullary and medullary hindbrain in the mouse embryo at E11.5, E13.5, E15.5 and E18.5 (animal fetal reference for brainstem region growth)", "value": {"mean_by_mouse_embryonic_day": {"E11.5": {"n": 6, "midbrain": 0.7536, "prepontine_hindbrain": 0.6078, "pontine_hindbrain": 0.4574, "pontomedullary_hindbrain": 0.1801, "medullary_hindbrain": 0.4871}, "E13.5": {"n": 9, "midbrain": 2.5709, "prepontine_hindbrain": 1.5904, "pontine_hindbrain": 1.6623, "pontomedullary_hindbrain": 0.842, "medullary_hindbrain": 2.2339}, "E15.5": {"n": 9, "midbrain": 4.6264, "prepontine_hindbrain": 3.3194, "pontine_hindbrain": 2.9427, "pontomedullary_hindbrain": 1.3901, "medullary_hindbrain": 3.9538}, "E18.5": {"n": 8, "midbrain": 8.8803, "prepontine_hindbrain": 6.6374, "pontine_hindbrain": 4.0903, "pontomedullary_hindbrain": 3.2582, "medullary_hindbrain": 5.4598}}, "sample_sd_recomputed_not_quoted": {"E11.5": {"midbrain": 0.105, "prepontine_hindbrain": 0.058, "pontine_hindbrain": 0.029, "pontomedullary_hindbrain": 0.013, "medullary_hindbrain": 0.045}, "E13.5": {"midbrain": 0.14, "prepontine_hindbrain": 0.09, "pontine_hindbrain": 0.079, "pontomedullary_hindbrain": 0.059, "medullary_hindbrain": 0.07}, "E15.5": {"midbrain": 0.565, "prepontine_hindbrain": 0.464, "pontine_hindbrain": 0.358, "pontomedullary_hindbrain": 0.185, "medullary_hindbrain": 0.493}, "E18.5": {"midbrain": 0.231, "prepontine_hindbrain": 0.317, "pontine_hindbrain": 0.154, "pontomedullary_hindbrain": 0.124, "medullary_hindbrain": 0.188}}}, "unit": "mm3; means are the paper's own pivot cells in the Source Data sheet, rounded here to 4 decimals; SDs are sample SDs recomputed from the per-subject rows of the same sheet, not quoted; n = MRI samples per age", "paper_id": "p-pmid39433760", "locator": "Methods, 'Volumetric growth curves'; Table 2 (samples per age); Source Data file 41467_2024_53254_MOESM6_ESM.xlsx, sheet 'Fig 4g & SuppFig5 Subj ROI Vol', block 'Average Volume by Parent ROI', columns M, PPH, PH, PMH, MH, rows E11-5 to E18-5", "species": "mouse embryo, C57bl/6J, both sexes (ex vivo in-skull MRI, paraformaldehyde fixed)", "limit": "mouse, not human; no mapping from mouse embryonic day to human week is made or sourced; fixation shrinkage against living tissue not quantified in the text read; Supplementary Information PDF not read; the P4, P14 and P56 rows and the cortex-side regions of the sheet are not entered (P56 is adult)", "state": "growth web test value on brainstem_size (reference only, role test, no code reads it); audit item L-064", "evidence": "companion/audit_log (L-064)", "doc": "companion/DECISIONS_PENDING.md"}
kind: "value"
source: "[[@Kronman FN, Liwang JK, Betty R, et al. Developmental mouse brain common coordinate framework (p-pmid39433760)]]"
later_record: {"on": "2026-11-17", "remark": "Supplementary Information PDF not read", "now": "the Supplementary Information PDF was read on 2026-11-16: 10 pages, figure legends only, no volumes and no shrinkage statement", "basis": "audit item L-064, note text 'Open points checked 2026-11-16: (1) Supplementary Information PDF read (10 pages, figure legends only ...)'"}
---

volume of midbrain and of the prepontine, pontine, pontomedullary and medullary hindbrain in the mouse embryo at E11.5, E13.5, E15.5 and E18.5 (animal fetal reference for brainstem region growth).

Value record `m.atlas2026_11_16.kronman_brainstem_volumes`, part: hypothesis.

Value: {"mean_by_mouse_embryonic_day": {"E11.5": {"n": 6, "midbrain": 0.7536, "prepontine_hindbrain": 0.6078, "pontine_hindbrain": 0.4574, "pontomedullary_hindbrain": 0.1801, "medullary_hindbrain": 0.4871}, "E13.5": {"n": 9, "midbrain": 2.5709, "prepontine_hindbrain": 1.5904, "pontine_hindbrain": 1.6623, " ... (mm3; means are the paper's own pivot cells in the Source Data sheet, rounded here to 4 decimals; SDs are sample SDs recomputed from the per-subject rows of the same sheet, not quoted; n = MRI samples per age).

Where in the source: Methods, 'Volumetric growth curves'; Table 2 (samples per age); Source Data file 41467_2024_53254_MOESM6_ESM.xlsx, sheet 'Fig 4g & SuppFig5 Subj ROI Vol', block 'Average Volume by Parent ROI', columns M, PPH, PH, PMH, MH, rows E11-5 to E18-5.

Species and age: mouse embryo, C57bl/6J, both sexes (ex vivo in-skull MRI, paraformaldehyde fixed).

Limit: mouse, not human; no mapping from mouse embryonic day to human week is made or sourced; fixation shrinkage against living tissue not quantified in the text read; Supplementary Information PDF not read; the P4, P14 and P56 rows and the cortex-side regions of the sheet are not entered (P56 is adult).

State: growth web test value on brainstem_size (reference only, role test, no code reads it); audit item L-064.

Source: [[@Kronman FN, Liwang JK, Betty R, et al. Developmental mouse brain common coordinate framework (p-pmid39433760)]].
