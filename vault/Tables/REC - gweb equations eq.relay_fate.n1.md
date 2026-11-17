---
recordTypeId: "trusoma-record"
nodeInstanceId: "7046e290-c2ca-7f4d-87de-1b207951cefd"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 359
group: "equations"
shape: "dictmap"
label: "eq.relay_fate.n1"
data: {"edge": "relay_fate", "kind": "proxy", "form": "dn_P/dτ = f(d̄_P) − n_P; dd_P/dτ = v{g(n_P) − d_P} (2); d̄_P = (1/r) Σ_P' d_P', the mean over the r immediate neighbours of P; f(x) = x^k/(a + x^k), g(x) = 1/(1 + b x^h) (4); τ = μt, v = ρ/μ; the homogeneous state is unstable when f'(d*)g'(n*) < −1 (3)", "symbols": {"n_P, d_P": "Notch and Delta activity in cell P, scaled by N_0 and D_0", "d̄_P": "mean Delta activity of the immediate neighbours", "μ, ρ": "decay rates, inverse lifetimes, of Notch and Delta activity", "v": "ρ/μ, relative time scales", "τ": "μt, nondimensional time; no real units are given"}, "parameters": [{"name": "a", "value": 0.01, "unit": "", "kind": "assumed"}, {"name": "b", "value": 100, "unit": "", "kind": "assumed"}, {"name": "v", "value": 1, "unit": "", "kind": "assumed"}, {"name": "k", "value": 2, "unit": "", "kind": "assumed"}, {"name": "h", "value": 2, "unit": "", "kind": "assumed"}, {"name": "μ, ρ", "value": "not given; time is nondimensional", "unit": "", "kind": "assumed"}], "system": "Generic Delta-Notch lateral inhibition on cell lattices, for neural and non-neural tissue; cell division neglected; parameters chosen for illustration", "paper_id": "p-pmid9015458", "locator": "Eqs. 2, 3, 4, 5; pp 432-434", "quote": "The parameter values used to generate the illustrations below are", "maps_to_edge": "A newborn relay neuron's Delta inhibits its neighbours' fate through this feedback", "transfer_assumes": "Lateral inhibition with newborn neurons signaling applies in human sensory relays; the paper's general model does not test this tissue or age", "transcription": "clean", "read_depth": "Full text PDF from the Oxford University Research Archive, read by the lead; equations compared with the printed page", "record": "m.eq.relay_fate.n1"}
---
