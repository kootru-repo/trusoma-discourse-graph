---
recordTypeId: "trusoma-record"
nodeInstanceId: "bc6922d9-2957-770c-a5c3-142c7b0801c3"
dg_type: "Record"
record_file: "companion/source_audit/batch_2026-11-04_equations/equations.jsonl"
code: "eq"
order: 21
fmt: "default"
data: {"edge": "prog_address", "equation": "Algorithm 2: Draw X(r)∼NN; ... if with probability 0.2 then Δx ← 0; else Draw Δx∼NN; X(d)←X(c)+Δx", "symbols": {"X(c), X(d)": "expression profile of parent c and daughter d", "NN": "Gaussian random vector NN(μ=0,σ=1)", "N": "number of genes"}, "parameters": [{"name": "N", "value": "500", "unit": "genes", "kind": "assumed"}, {"name": "σ", "value": "1", "unit": "expression units", "kind": "assumed"}, {"name": "symmetric divisions", "value": "20", "unit": "percent", "kind": "assumed"}], "system": "Simulated lineage; a simulation rule, not fit to expression data.", "paper_id": "p-pmid36006873", "citation": "Kerstjens S, et al. Constructive connectomics: How neuronal axons get from here to there using gene-expression maps derived from their family trees. PLoS Comput Biol 2022.", "doi": "10.1371/journal.pcbi.1010382", "pmid": "36006873", "local_file": "C:\\Projects\\trusoma-archive\\montyjepa-engine\\papers\\growth_sources\\Kerstjens2022.txt", "locator": "Methods, Simulation of mitotic model, Algorithm 2", "quote": "the expression profile of each cell is a random variant of its parent", "maps_to_edge": "Daughter state is parent state plus a deviation, exactly this edge.", "transfer_assumes": "Assumes a Gaussian deviation has a meaningful scale for a fetal brainstem; printed as an algorithm, not a closed equation.", "transcription_confidence": "clean", "how_far_read": "saved text; methods on mitotic and axon simulation read in full", "found": true}
---
