---
nodeTypeId: "trusoma-record"
nodeInstanceId: "6e7987da-67f8-713f-93f2-c6710e397b39"
dg_type: "Record"
record_file: "companion/source_audit/batch_2026-11-04_equations/equations.jsonl"
code: "eq"
order: 27
fmt: "default"
data: {"edge": "fate_prog", "equation": "Ṗ(t) = (λ(t) − γ(t))P(t) (equation 1); γ = ΔN/(P_iΔt)", "symbols": {"P": "number of progenitors", "Ṗ": "temporal change in progenitor number", "λ": "proliferation rate", "γ": "differentiation rate"}, "parameters": [{"name": "λ", "value": "about 0.08 before 40 hph", "unit": "h^-1", "kind": "measured"}, {"name": "γ of pMN", "value": "reaching 0.15 before 90 hph", "unit": "h^-1", "kind": "measured"}, {"name": "γ of p3 and more dorsal", "value": "<0.03", "unit": "h^-1", "kind": "measured"}], "system": "Mouse neural tube by domain, with chick comparison.", "paper_id": "p-pmid25258086", "citation": "Kicheva A, Bollenbach T, Ribeiro A, et al. Coordination of progenitor specification and growth in mouse and chick spinal cord. Science 2014;345:1254927.", "doi": "10.1126/science.1254927", "pmid": "25258086", "local_file": "C:\\Projects\\trusoma-archive\\montyjepa-engine\\papers\\growth_sources\\p-pmid25258086_eq.txt", "locator": "Results, equation 1; Methods, differentiation rate", "quote": "We defined the differentiation rate as the number of neurons produced per unit time relative to the size of the progenitor domain", "maps_to_edge": "Differentiation removes cells from the dividing pool at rate γ.", "transfer_assumes": "Assumes mouse rates apply to human weeks; γ is not tied to Notch or Ascl1 state, so that link stays a model choice.", "transcription_confidence": "clean", "how_far_read": "author manuscript XML via NCBI efetch; results and methods passages by keyword; figures and supplement not read", "found": true}
---
