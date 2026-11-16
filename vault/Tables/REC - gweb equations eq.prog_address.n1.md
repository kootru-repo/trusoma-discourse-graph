---
nodeTypeId: "trusoma-record"
nodeInstanceId: "bac01682-ee7a-7991-a707-830addb2015b"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 346
group: "equations"
shape: "dictmap"
label: "eq.prog_address.n1"
data: {"edge": "prog_address", "kind": "rule", "form": "Algorithm 2: Draw X(r)∼NN; ... if with probability 0.2 then Δx ← 0; else Draw Δx∼NN; X(d)←X(c)+Δx", "symbols": {"X(c), X(d)": "expression profile of parent c and daughter d", "NN": "Gaussian random vector NN(μ=0,σ=1)", "N": "number of genes"}, "parameters": [{"name": "N", "value": "500", "unit": "genes", "kind": "assumed"}, {"name": "σ", "value": "1", "unit": "expression units", "kind": "assumed"}, {"name": "symmetric divisions", "value": "20", "unit": "percent", "kind": "assumed"}], "system": "Simulated lineage; a simulation rule, not fit to expression data.", "paper_id": "p-pmid36006873", "locator": "Methods, Simulation of mitotic model, Algorithm 2", "quote": "the expression profile of each cell is a random variant of its parent", "maps_to_edge": "Daughter state is parent state plus a deviation, exactly this edge.", "transfer_assumes": "Assumes a Gaussian deviation has a meaningful scale for a fetal brainstem; printed as an algorithm, not a closed equation.", "transcription": "clean", "read_depth": "saved text; methods on mitotic and axon simulation read in full", "record": "m.eq.prog_address.n1"}
---
