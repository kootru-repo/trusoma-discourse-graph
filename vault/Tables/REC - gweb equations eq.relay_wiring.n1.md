---
nodeTypeId: "trusoma-record"
nodeInstanceId: "d5c5acc7-93cc-77ce-9423-c820d39ed379"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 353
group: "equations"
shape: "dictmap"
label: "eq.relay_wiring.n1"
data: {"edge": "relay_wiring", "kind": "proxy", "form": "ΔD_i^exc = −ν · ΔF̄_i · D_i^exc; ΔD_i^inh = ν · ΔF̄_i · D_i^inh; ΔA_i = ν · ΔF̄_i · A_i", "symbols": "D, A: numbers of dendritic and axonal elements of neuron i; F̄: sliding average of firing probability over 1000 steps; ΔF̄ = F̄ minus the activity target; ν: sensitivity", "parameters": [{"name": "ν", "value": "assumed by the authors", "unit": "", "kind": "assumed"}, {"name": "activity target", "value": 0.5, "unit": "probability", "kind": "assumed"}], "system": "Simulated cortical network; not developmental tissue", "paper_id": "p-pmc2726035", "locator": "Eqs. 6, 7 and 8", "quote": "changes in the number of axonal elements", "maps_to_edge": "Connection elements follow a neuron's activity, standing for how relay activity sets wiring into the learner", "transfer_assumes": "A homeostatic adult cortical rewiring rule applies to relay-to-learner wiring in the fetus; it sets element numbers, not weights, and every rate and target is assumed", "transcription": "clean", "read_depth": "read in part", "record": "m.eq.relay_wiring.n1"}
---
