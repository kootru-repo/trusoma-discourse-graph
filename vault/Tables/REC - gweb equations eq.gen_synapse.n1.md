---
nodeTypeId: "trusoma-record"
nodeInstanceId: "db3e1084-33de-70fd-bc31-01225b8831ec"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 342
group: "equations"
shape: "dictmap"
label: "eq.gen_synapse.n1"
data: {"edge": "gen_synapse", "kind": "equation", "form": "τ_a ȧ = a_∞(n·s·d·a) − a, (4); τ_d ḋ = d_∞(a) − d, (5); τ_s ṡ = s_∞(a) − s. (6); a_∞(I_eff) = 1/(1 + e^{−(I_eff−θ)/k_a}); d_∞(a) = 1/(1 + e^{(a−θ_d)/k_d}); s_∞(a) = 1/(1 + e^{(a−θ_s)/k_s})", "symbols": {"a": "population activity or mean firing rate", "d": "fast depression variable, the fraction of synapses not affected", "s": "fraction of synapses not affected by the slow synaptic depression", "n": "network connectivity, arbitrary units", "θ_x, k_x": "half-activation point and steepness"}, "parameters": [{"name": "n", "value": "1", "unit": "arbitrary", "kind": "assumed"}, {"name": "τ_a, τ_d, τ_s", "value": "1, 2, 500", "unit": "not stated in the table", "kind": "assumed"}, {"name": "θ, k_a", "value": "0.18, 0.05", "unit": "-", "kind": "assumed"}, {"name": "θ_d, k_d", "value": "0.5, 0.2", "unit": "-", "kind": "assumed"}, {"name": "θ_s, k_s", "value": "0.14, 0.02", "unit": "-", "kind": "assumed"}], "system": "Mean-field model of episodic activity in chick embryo spinal cord (E7.5, E10 recordings shown); Table 1, s-model column.", "paper_id": "p-pmid10751456", "locator": "Eqs. 4-6, Table 1, Materials and Methods; the saved text flattens fractions, restored only where the sigmoid definition states them", "quote": "The equations for the models are:", "maps_to_edge": "Generator activity changes a slow synaptic efficacy variable s.", "transfer_assumes": "Assumes efficacy stands for synaptic structure, and chick kinetics transfer; s falls with activity, while the edge is signed plus.", "transcription": "clean", "read_depth": "PMC page saved as text; Methods equations and Table 1 read; Results by keyword; 2026-11-04 rechecked, fraction bars lost in saved text, restored from the paper's statement that a_inf(theta)=1/2", "record": "m.eq.gen_synapse.n1"}
---
