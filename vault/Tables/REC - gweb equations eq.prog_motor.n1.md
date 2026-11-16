---
nodeTypeId: "trusoma-record"
nodeInstanceId: "10c7e48b-c7e1-7b80-998e-9f740785dacf"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 344
group: "equations"
shape: "dictmap"
label: "eq.prog_motor.n1"
data: {"edge": "prog_motor", "kind": "equation", "form": "dN/dt = γP; γ = ΔN/(P_iΔt); (P_Olig2(t2) − P_Olig2(t_1))/Δt = λP_Olig2(t_1) − ΔMN/Δt − ψP_Olig2(t_1), (equation 9)", "symbols": {"N": "neurons", "P": "progenitors", "γ": "differentiation rate", "P_i": "progenitor number in the middle of the interval", "λ": "proliferation rate", "ΔMN": "number of labelled motor neurons", "ψ": "rate of loss of Olig2 identity"}, "parameters": [{"name": "λ", "value": "about 0.08 before 40 hph (cycle about 9 h)", "unit": "h^-1", "kind": "measured"}, {"name": "γ of pMN", "value": "reaching 0.15 before 90 hph", "unit": "h^-1", "kind": "measured"}, {"name": "apoptosis", "value": "<0.0025", "unit": "h^-1", "kind": "measured"}, {"name": "ψ", "value": "Fig. 5C, approximate, not transcribed", "unit": "h^-1", "kind": "measured"}], "system": "Mouse neural tube, with chick comparison, up to about E11.", "paper_id": "p-pmid25258086", "locator": "Methods, differentiation rate; equation 9", "quote": "Neurons (N) are produced from progenitors (P) with a rate of differentiation", "maps_to_edge": "Division and exit give motoneuron output from a progenitor pool, with measured spinal rates.", "transfer_assumes": "Assumes mouse hours map to human weeks, and that the web's window still contains motoneuron birth, which was not checked here.", "transcription": "clean", "read_depth": "author manuscript XML via NCBI efetch; results and methods passages by keyword; figures and supplement not read", "record": "m.eq.prog_motor.n1"}
---
