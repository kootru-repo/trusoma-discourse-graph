---
recordTypeId: "trusoma-record"
nodeInstanceId: "9035953e-9624-79f0-96fd-c57e4d53940b"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 332
group: "equations"
shape: "dictmap"
label: "eq.load_grow.n1"
data: {"edge": "load_grow", "kind": "equation", "form": "γ(r, t) = Γ(M(r, t), p(r, t)), [1]; Γ(ξ, M) = Γ_M(M)[1 − q(ξ − ξ_0)^2] with Γ_0 = (M − M_0)θ(M − M_0)", "symbols": {"γ(r,t)": "local growth rate at position r and time t", "M": "morphogen concentration", "p": "local uniaxial compression stress within the cell layer", "ξ": "cell height; deformation is ξ − 1", "Γ_M": "maximal growth rate at morphogen level M", "q, ξ_0": "not defined in the passage read", "M_0": "morphogen threshold", "θ": "as printed; not defined in the passage read"}, "parameters": [{"name": "q, ξ_0, M_0", "value": "not in the main text; SI Table 1 not read", "unit": "not read", "kind": "assumed"}], "system": "Drosophila larval wing imaginal disc; simulated polygonal cell layer; functional form is the authors' parameterization.", "paper_id": "p-pmid17360439", "locator": "Eq. 1, Compression Model; Methods, Simulation; equation images", "quote": "where M represents the morphogen concentration and p represents the local uniaxial compression stress within the cell layer.", "maps_to_edge": "Stress lowers local growth rate, the sign of load_grow. As printed, the second line defines Γ_0 although the first uses Γ_M, apparently the same quantity. The paper says the exact form matters little, as long as growth falls with stress and needs morphogen above a threshold; its Fig. 3 is a schematic, and no numbers for q, m or M_0 appear in the main text despite Fig. 4's pointer to Methods", "transfer_assumes": "Assumes a fly epithelium compression rule carries to fetal tissue; no YAP term appears, while the web's numbers are postnatal mouse liver YAP.", "transcription": "clean", "read_depth": "Main text read by the lead from the USER's PDF, 2026-11-04; Methods form compared with the printed page. SI Text and SI Table 1 not read", "record": "m.eq.load_grow.n1"}
---
