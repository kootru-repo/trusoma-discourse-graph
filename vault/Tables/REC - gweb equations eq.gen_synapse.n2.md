---
recordTypeId: "trusoma-record"
nodeInstanceId: "65bb8381-4607-7d4e-8301-df550314b65b"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 343
group: "equations"
shape: "dictmap"
label: "eq.gen_synapse.n2"
data: {"edge": "gen_synapse", "kind": "equation", "form": "w_p = (c_p + νw)e^{−δt/τ_STDP} (1); w_d = (−c_d w + νw)e^{δt/τ_STDP} (2); dw(t)/dt = βw(t)[a_goal − a(t)] + γw(t)∫_0^t dt'[a_goal − a(t')] (3)", "symbols": {"c_p": "average potentiation after one pairing", "c_d": "average relative depression after one pairing", "ν": "Gaussian random variable, zero mean", "τ_STDP": "plasticity time constant", "a(t)": "slow postsynaptic activity sensor", "a_goal": "desired postsynaptic activity", "β, γ": "scaling constants"}, "parameters": [{"name": "c_p", "value": "7", "unit": "pS", "kind": "fitted"}, {"name": "c_d", "value": "0.003", "unit": "-", "kind": "fitted"}, {"name": "noise SD", "value": "0.015", "unit": "-", "kind": "fitted"}, {"name": "τ_STDP", "value": "20", "unit": "msec", "kind": "assumed"}, {"name": "a_goal", "value": "20", "unit": "Hz", "kind": "assumed"}, {"name": "sensor time constant", "value": "100", "unit": "sec", "kind": "assumed"}, {"name": "β, γ", "value": "adjusted to prevent oscillation", "unit": "-", "kind": "assumed"}], "system": "Simulated cultured neuron; plasticity values extracted from pairing data, parameters said to reflect a typical cultured neuron.", "paper_id": "p-pmid11102489", "locator": "Eqs. 1-3, Materials and Methods", "quote": "Equations 1 and 2 are the basis for this study.", "maps_to_edge": "Activity changes weights and scales them toward an activity goal.", "transfer_assumes": "Assumes values from cultured neurons hold for embryonic brainstem synapses, and weight stands for structure.", "transcription": "clean", "read_depth": "PMC page saved as text; Methods read", "record": "m.eq.gen_synapse.n2"}
---
