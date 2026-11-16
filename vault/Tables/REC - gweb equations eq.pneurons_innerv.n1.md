---
nodeTypeId: "trusoma-record"
nodeInstanceId: "d5e72617-0e1f-79ec-a5bc-77c3c540e6ef"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 338
group: "equations"
shape: "dictmap"
label: "eq.pneurons_innerv.n1"
data: {"edge": "pneurons_innerv", "kind": "proxy", "form": "τ dφ_i/dt = f_i(C_i) − φ_i, (4); f_i(C_i) = α_i C_i^m/(K_i^m + C_i^m). (5)", "symbols": {"φ_i": "receptor insertion rate (molecules per hour)", "τ": "time constant of growth", "α_i": "maximum of growth function", "K_i": "C_i at half maximum", "m": "exponent selecting the case of the growth function", "C_i": "neurotrophin-receptor complex on axon i (molecules)"}, "parameters": [{"name": "τ", "value": "2", "unit": "days", "kind": "assumed"}, {"name": "α_i, K_i, m", "value": "varied by case", "unit": "molecules h^-1; molecules", "kind": "assumed"}], "system": "Generic single target cell with n competing axons; values from NGF data in cited papers (measured there, those papers not read). No species or age fit.", "paper_id": "p-pmid10380678", "locator": "Eqs. 4-5, p 884, page image", "quote": "the capacity of an axon to bind neurotrophin will become larger", "maps_to_edge": "PROXY ONLY: an axon's receptor capacity grows with bound factor; neither terminal count nor neuron count is a variable.", "transfer_assumes": "Assumes total receptor stands for terminal arbor; no equation from neuron count to terminal count was found.", "transcription": "clean", "read_depth": "author-hosted PDF; pages 883-885 read as page images; rest by keyword in p-pmid10380678_pdftotext.txt, where symbols are garbled", "record": "m.eq.pneurons_innerv.n1"}
---
