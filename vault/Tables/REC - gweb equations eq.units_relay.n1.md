---
recordTypeId: "trusoma-record"
nodeInstanceId: "76c92312-ddb1-7d47-9d20-0fbd994abd34"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 354
group: "equations"
shape: "dictmap"
label: "eq.units_relay.n1"
data: {"edge": "units_relay", "kind": "proxy", "form": "In words only; the equations are in figs. S2 and S3: one differential equation per neuron for trophic signal, NGF-bound TrkA; one for NGF at the target, produced at a constant rate; a neuron dies at 10% or less of the maximum signal. Competition needs NGF to raise both TrkA expression and signal duration. Added: NGF raises apoptotic signals, which spare neurons with high signal", "symbols": "NGF: target factor; TrkA: its receptor; trophic signal: amount of NGF-bound TrkA in a neuron; p75, BDNF, NT4: apoptotic signaling", "parameters": [{"name": "death threshold", "value": 0.1, "unit": "fraction of maximum signal", "kind": "assumed"}, {"name": "all rates", "value": "in figs. S2 and S3, not read", "unit": "", "kind": "assumed"}], "system": "Simulated 100 sympathetic neurons, with mouse and rat experiments; outcome fairly independent of starting conditions", "paper_id": "p-pmid18323418", "locator": "Main text; Figs. 2 and 4", "quote": "Our model assigns one differential equation per neuron, representing the relative magnitude of trophic signaling", "maps_to_edge": "A target's limited factor decides which innervating neurons live, standing for how the learner, as the relay's target, affects relay survival. For a printed form use van Ooyen & Willshaw 1999, Eqs. 1-5, which have the same receptor feedback; the supplement holding Deppmann's own equations could not be obtained", "transfer_assumes": "A sympathetic neuron and NGF rule applies to relay neurons and a learner target; nothing shows the learner or brainstem relays compete this way", "transcription": "uncertain", "read_depth": "main text read by the lead from the USER's PDF; figs. S2 and S3, which hold the equations, not read", "record": "m.eq.units_relay.n1"}
---
