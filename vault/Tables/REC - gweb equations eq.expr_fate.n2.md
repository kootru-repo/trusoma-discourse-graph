---
recordTypeId: "trusoma-record"
nodeInstanceId: "d34fd19a-471d-7b47-9de7-f560032b5048"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 357
group: "equations"
shape: "dictmap"
label: "eq.expr_fate.n2"
data: {"edge": "expr_fate", "kind": "equation", "form": "dn_P/dτ = f(d̄_P) − n_P; dd_P/dτ = v{g(n_P) − d_P} (2); d̄_P = (1/r) Σ_P' d_P', the mean over the r immediate neighbours of P; f(x) = x^k/(a + x^k), g(x) = 1/(1 + b x^h) (4); τ = μt, v = ρ/μ; the homogeneous state is unstable when f'(d*)g'(n*) < −1 (3)", "symbols": {"n_P, d_P": "Notch and Delta activity in cell P, scaled by N_0 and D_0", "d̄_P": "mean Delta activity of the immediate neighbours", "μ, ρ": "decay rates, inverse lifetimes, of Notch and Delta activity", "v": "ρ/μ, relative time scales", "τ": "μt, nondimensional time; no real units are given"}, "parameters": [{"name": "a", "value": 0.01, "unit": "", "kind": "assumed"}, {"name": "b", "value": 100, "unit": "", "kind": "assumed"}, {"name": "v", "value": 1, "unit": "", "kind": "assumed"}, {"name": "k", "value": 2, "unit": "", "kind": "assumed"}, {"name": "h", "value": 2, "unit": "", "kind": "assumed"}, {"name": "μ, ρ", "value": "not given; time is nondimensional", "unit": "", "kind": "assumed"}], "system": "Generic Delta-Notch lateral inhibition on cell lattices, for neural and non-neural tissue; cell division neglected; parameters chosen for illustration", "paper_id": "p-pmid9015458", "locator": "Eqs. 2, 3, 4, 5; pp 432-434", "quote": "The parameter values used to generate the illustrations below are", "maps_to_edge": "Small differences between neighbours amplify through Delta-Notch feedback, the sign of this signal", "transfer_assumes": "A generic model applies to fetal brainstem progenitors; rates are not given in real time, and the paper neglects cell division", "transcription": "clean", "read_depth": "Full text PDF from the Oxford University Research Archive, read by the lead; equations compared with the printed page", "record": "m.eq.expr_fate.n2"}
---
