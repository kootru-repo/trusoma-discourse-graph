---
nodeTypeId: "trusoma-record"
nodeInstanceId: "9af98c5e-f788-7306-a1f5-5c6f2a186fe5"
dg_type: "Record"
record_file: "companion/source_audit/batch_2026-11-04_equations/equations.jsonl"
code: "eq"
order: 0
fmt: "default"
data: {"edge": "load_grow", "equation": "γ(r, t) = Γ(M(r, t), p(r, t)), [1]; Γ(ξ, M) = Γ_M(M)[1 − q(ξ − ξ_0)^2] with Γ_0 = (M − M_0)θ(M − M_0)", "symbols": {"γ(r,t)": "local growth rate at position r and time t", "M": "morphogen concentration", "p": "local uniaxial compression stress within the cell layer", "ξ": "cell height; deformation is ξ − 1", "Γ_M": "maximal growth rate at morphogen level M", "q, ξ_0": "not defined in the passage read", "M_0": "morphogen threshold", "θ": "as printed; not defined in the passage read"}, "parameters": [{"name": "q, ξ_0, M_0", "value": "not read (SI Table 1)", "unit": "not read", "kind": "assumed"}], "system": "Drosophila larval wing imaginal disc; simulated polygonal cell layer; functional form is the authors' parameterization.", "paper_id": "p-pmid17360439", "citation": "Hufnagel L, Teleman AA, Rouault H, Cohen SM, Shraiman BI. On the mechanism of wing size determination in fly development. PNAS 2007;104.", "doi": "10.1073/pnas.0607134104", "pmid": "17360439", "local_file": "C:\\Projects\\trusoma-archive\\montyjepa-engine\\papers\\growth_sources\\p-pmid17360439_pmc.txt", "locator": "Eq. 1, Compression Model; Methods, Simulation; equation images", "quote": "where M represents the morphogen concentration and p represents the local uniaxial compression stress within the cell layer.", "maps_to_edge": "Stress lowers local growth rate, the sign of load_grow.", "transfer_assumes": "Assumes a fly epithelium compression rule carries to fetal tissue; no YAP term appears, while the web's numbers are postnatal mouse liver YAP.", "transcription_confidence": "clean", "how_far_read": "PMC page saved as text; equation images saved in pdf\\hufnagel_eq and read; SI Table 1 not read", "found": true}
---
