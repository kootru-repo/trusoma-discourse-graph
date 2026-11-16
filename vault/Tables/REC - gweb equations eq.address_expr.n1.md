---
nodeTypeId: "trusoma-record"
nodeInstanceId: "d9e61d6d-83d0-775b-a69e-f96be9965ab1"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 347
group: "equations"
shape: "dictmap"
label: "eq.address_expr.n1"
data: {"edge": "address_expr", "kind": "equation", "form": "ρ(m) = [Γ(λ/δ + m)/(Γ(m + 1)Γ(λ/δ + γ/δ + m))] [Γ(λ/δ + γ/δ)/Γ(λ/δ)] (μ/δ)^m 1F1(λ/δ + m, λ/δ + γ/δ + m, −μ/δ) (1); in the limit of large γ/δ, ρ(k) = (1 + μ/γ)^{−λ/δ} [Γ(λ/δ + k)/(Γ(λ/δ)Γ(k + 1))] ((μ/γ)/(1 + μ/γ))^k (2)", "symbols": {"ρ(m)": "probability of having m mRNA", "λ": "rate of gene activation", "γ": "rate of gene inactivation", "μ": "rate of transcription in the active state", "δ": "rate of mRNA decay"}, "parameters": [{"name": "mRNA half-life", "value": "about 4 ± 1", "unit": "h", "kind": "measured"}, {"name": "λ/δ, μ/γ", "value": "by condition in Figure 3C, not transcribed", "unit": "-", "kind": "fitted"}], "system": "CHO reporter transgene, tet-off; model first examined by Peccoud and Ycart (closed, not read).", "paper_id": "p-pmid17048983", "locator": "Protocol S1, Eqs. 1-2, page image", "quote": "A steady-state solution to the discrete master equation exists, and is given by", "maps_to_edge": "Burst statistics of a gene give the fluctuation form around a mean.", "transfer_assumes": "Assumes inherited state sets the mean, for which no source links address to λ or μ; these rates are reporter values, not neural ones.", "transcription": "clean", "read_depth": "Protocol S1 page 2 read as page image; main text by keyword; fitted values only in Figure 3C, not transcribed", "record": "m.eq.address_expr.n1"}
---
