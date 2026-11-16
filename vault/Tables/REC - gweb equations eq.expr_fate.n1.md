---
nodeTypeId: "trusoma-record"
nodeInstanceId: "788484ad-1176-7fe3-a433-9817bfc32fd0"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 348
group: "equations"
shape: "dictmap"
label: "eq.expr_fate.n1"
data: {"edge": "expr_fate", "kind": "equation", "form": "dN_i/dt = β_N − γN_i − N_i<D_j>_i/k_t (7); dD_i/dt = β_D 1/(1 + R_i^m) − γD_i − D_i<N_j>_i/k_t (8); dR_i/dt = β_R (N_i<D_j>_i)^n/(k_RS + (N_i<D_j>_i)^n) − γ_R R_i (9). LIMI adds −N_iD_i/k_c to Eqs. 7 and 8, as (10)-(12)", "symbols": {"N_i, D_i, R_i": "Notch, DSL and Reporter in cell i", "β_N, β_D, β_R": "production rates", "k_c^-1, k_t^-1": "strengths of the cis and trans interactions", "γ, γ_R": "degradation rates", "k_RS, n": "affinity and Hill coefficient of Reporter induction", "m": "not defined in the passage read", "<D_j>_i": "average DSL in the neighbours of cell i"}, "parameters": [{"name": "all rates and affinities", "value": "not read (Table S1)", "unit": "not read", "kind": "assumed"}], "system": "Generic lateral inhibition model on a cell lattice; values in Table S1 are not stated as measured in the passage read.", "paper_id": "p-pmid21695234", "locator": "Methods p 9, Eqs. 7-12, page image", "quote": "Lateral Inhibition (LI):", "maps_to_edge": "Neighbour signalling amplifies small differences toward distinct fates.", "transfer_assumes": "Assumes a generic Notch-DSL form applies to brainstem progenitors; nothing links random bursting to the starting difference, and no measured rates exist (prior pass).", "transcription": "clean", "read_depth": "publisher PDF; Methods page 9 read as page image; Table S1 (parameter values) and Text S1 not read", "record": "m.eq.expr_fate.n1"}
---
