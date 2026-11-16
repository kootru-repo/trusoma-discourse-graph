---
nodeTypeId: "trusoma-record"
nodeInstanceId: "d58f812c-ad38-7ec9-94c3-7353822d076d"
dg_type: "Record"
record_file: "companion/source_audit/batch_2026-11-04_equations/equations.jsonl"
code: "eq"
order: 22
fmt: "default"
data: {"edge": "address_expr", "equation": "ρ(m) = [Γ(λ/δ + m)/(Γ(m + 1)Γ(λ/δ + γ/δ + m))] [Γ(λ/δ + γ/δ)/Γ(λ/δ)] (μ/δ)^m 1F1(λ/δ + m, λ/δ + γ/δ + m, −μ/δ) (1); in the limit of large γ/δ, ρ(k) = (1 + μ/γ)^{−λ/δ} [Γ(λ/δ + k)/(Γ(λ/δ)Γ(k + 1))] ((μ/γ)/(1 + μ/γ))^k (2)", "symbols": {"ρ(m)": "probability of having m mRNA", "λ": "rate of gene activation", "γ": "rate of gene inactivation", "μ": "rate of transcription in the active state", "δ": "rate of mRNA decay"}, "parameters": [{"name": "mRNA half-life", "value": "about 4 ± 1", "unit": "h", "kind": "measured"}, {"name": "λ/δ, μ/γ", "value": "by condition in Figure 3C, not transcribed", "unit": "-", "kind": "fitted"}], "system": "CHO reporter transgene, tet-off; model first examined by Peccoud and Ycart (closed, not read).", "paper_id": "p-pmid17048983", "citation": "Raj A, Peskin CS, Tranchina D, Vargas DY, Tyagi S. Stochastic mRNA synthesis in mammalian cells. PLoS Biol 2006;4:e309, with Protocol S1.", "doi": "10.1371/journal.pbio.0040309", "pmid": "17048983", "local_file": "C:\\Projects\\trusoma-archive\\montyjepa-engine\\papers\\growth_sources\\pdf\\p-pmid17048983_S1.pdf", "locator": "Protocol S1, Eqs. 1-2, page image", "quote": "A steady-state solution to the discrete master equation exists, and is given by", "maps_to_edge": "Burst statistics of a gene give the fluctuation form around a mean.", "transfer_assumes": "Assumes inherited state sets the mean, for which no source links address to λ or μ; these rates are reporter values, not neural ones.", "transcription_confidence": "clean", "how_far_read": "Protocol S1 page 2 read as page image; main text by keyword; fitted values only in Figure 3C, not transcribed", "found": true}
---
