---
nodeTypeId: "trusoma-record"
nodeInstanceId: "829e50f6-a03e-7255-965f-8dde61bfa27b"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 350
group: "equations"
shape: "dictmap"
label: "eq.fate_prog.n1"
data: {"edge": "fate_prog", "kind": "equation", "form": "Ṗ(t) = (λ(t) − γ(t))P(t) (equation 1); γ = ΔN/(P_iΔt)", "symbols": {"P": "number of progenitors", "Ṗ": "temporal change in progenitor number", "λ": "proliferation rate", "γ": "differentiation rate"}, "parameters": [{"name": "λ", "value": "about 0.08 before 40 hph", "unit": "h^-1", "kind": "measured"}, {"name": "γ of pMN", "value": "reaching 0.15 before 90 hph", "unit": "h^-1", "kind": "measured"}, {"name": "γ of p3 and more dorsal", "value": "<0.03", "unit": "h^-1", "kind": "measured"}], "system": "Mouse neural tube by domain, with chick comparison.", "paper_id": "p-pmid25258086", "locator": "Results, equation 1; Methods, differentiation rate", "quote": "We defined the differentiation rate as the number of neurons produced per unit time relative to the size of the progenitor domain", "maps_to_edge": "Differentiation removes cells from the dividing pool at rate γ.", "transfer_assumes": "Assumes mouse rates apply to human weeks; γ is not tied to Notch or Ascl1 state, so that link stays a model choice.", "transcription": "clean", "read_depth": "author manuscript XML via NCBI efetch; results and methods passages by keyword; figures and supplement not read", "record": "m.eq.fate_prog.n1"}
---
