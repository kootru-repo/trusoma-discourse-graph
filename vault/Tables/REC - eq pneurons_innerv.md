---
nodeTypeId: "trusoma-record"
nodeInstanceId: "92d0da28-1b13-76a8-b17e-b21f890f11ea"
dg_type: "Record"
record_file: "companion/source_audit/batch_2026-11-04_equations/equations.jsonl"
code: "eq"
order: 8
fmt: "default"
data: {"edge": "pneurons_innerv", "equation": "τ dφ_i/dt = f_i(C_i) − φ_i, (4); f_i(C_i) = α_i C_i^m/(K_i^m + C_i^m). (5)", "symbols": {"φ_i": "receptor insertion rate (molecules per hour)", "τ": "time constant of growth", "α_i": "maximum of growth function", "K_i": "C_i at half maximum", "m": "exponent selecting the case of the growth function", "C_i": "neurotrophin-receptor complex on axon i (molecules)"}, "parameters": [{"name": "τ", "value": "2", "unit": "days", "kind": "assumed"}, {"name": "α_i, K_i, m", "value": "varied by case", "unit": "molecules h^-1; molecules", "kind": "assumed"}], "system": "Generic single target cell with n competing axons; values from NGF data in cited papers (measured there, those papers not read). No species or age fit.", "paper_id": "p-pmid10380678", "citation": "van Ooyen A, Willshaw DJ. Competition for neurotrophic factor in the development of nerve connections. Proc R Soc Lond B 1999;266:883-892.", "doi": "10.1098/rspb.1999.0719", "pmid": "10380678", "local_file": "C:\\Projects\\trusoma-archive\\montyjepa-engine\\papers\\growth_sources\\pdf\\p-pmid10380678.pdf", "locator": "Eqs. 4-5, p 884, page image", "quote": "the capacity of an axon to bind neurotrophin will become larger", "maps_to_edge": "PROXY ONLY: an axon's receptor capacity grows with bound factor; neither terminal count nor neuron count is a variable.", "transfer_assumes": "Assumes total receptor stands for terminal arbor; no equation from neuron count to terminal count was found.", "transcription_confidence": "clean", "how_far_read": "author-hosted PDF; pages 883-885 read as page images; rest by keyword in p-pmid10380678_pdftotext.txt, where symbols are garbled", "found": true}
---
