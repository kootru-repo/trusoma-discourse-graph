---
recordTypeId: "trusoma-record"
nodeInstanceId: "a85bc4ea-1f48-7d85-918a-5b504f97ac13"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 334
group: "equations"
shape: "dictmap"
label: "eq.load_joint.n1"
data: {"edge": "load_joint", "kind": "equation", "form": "dε/dt = dε_b/dt + dε_m/dt; dε_b/dt = ε̇_b = C_d = (0.14 − 0.87ξ^2 − 2.66ξ^3); dε_m/dt = ε̇_m = −C_d*((Σ_{i=1}^{N} σ_hi)/N)", "symbols": {"ε̇_b": "biological contribution to growth", "ε̇_m": "mechanobiological contribution to growth", "C_d": "chondrocyte density, a function of ξ", "ξ": "distance from the end of the rudiment", "σ_h": "compressive hydrostatic stress", "N": "number of movements per step"}, "parameters": [{"name": "C_d coefficients", "value": "0.14, −0.87, −2.66", "unit": "as printed", "kind": "assumed"}, {"name": "pelvic biological maximum", "value": "half that of the femur, from mouse growth rates", "unit": "ratio", "kind": "assumed"}, {"name": "initial shape", "value": "proportions of a human hip at GW 11; dimensions arbitrary", "unit": "-", "kind": "assumed"}], "system": "Finite element model of the prenatal human hip starting at gestational week 11; rule credited to Shefelbine and Carter 2004 and Giorgi 2014, neither read.", "paper_id": "p-pmid26163754", "locator": "Section 2.3, equations from MathML in the XML", "quote": "The total growth was the sum of the biological and mechanobiological contributions as shown by the equations below", "maps_to_edge": "Compressive load adds growth at each cartilage node, a direct form for this edge at about the right age.", "transfer_assumes": "Assumes hip-derived growth carries to other joints and to the weeks before GW 11; magnitudes are not measured.", "transcription": "clean", "read_depth": "Europe PMC XML; section 2.3 read; rest by keyword; 2026-11-04 printed text rechecked", "record": "m.eq.load_joint.n1"}
---
