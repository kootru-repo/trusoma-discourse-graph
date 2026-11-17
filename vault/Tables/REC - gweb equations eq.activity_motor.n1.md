---
recordTypeId: "trusoma-record"
nodeInstanceId: "9d8f2774-eac8-7d93-9e9d-850a306d1547"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 339
group: "equations"
shape: "dictmap"
label: "eq.activity_motor.n1"
data: {"edge": "activity_motor", "kind": "proxy", "form": "β_i ≡ (k_a,i(α_i/K_i − ρ_i))/(γ_i(k_d,i + ρ_i)) (case I, section 4b, unnumbered)", "symbols": {"β_i": "competitive strength of axon i", "k_a,i, k_d,i": "association and dissociation constants", "α_i, K_i": "growth function parameters", "ρ_i": "complex degradation rate constant", "γ_i": "unoccupied receptor degradation rate constant"}, "parameters": [{"name": "k_a", "value": "4.8e7", "unit": "M^-1 s^-1", "kind": "measured"}, {"name": "k_d", "value": "1.0e-3", "unit": "s^-1", "kind": "measured"}, {"name": "γ", "value": "2.7e-5", "unit": "s^-1", "kind": "measured"}, {"name": "ρ", "value": "about 2.0e-5", "unit": "s^-1", "kind": "measured"}, {"name": "δ", "value": "about 1.0e-5", "unit": "s^-1", "kind": "measured"}, {"name": "σ", "value": "about 2.0e-16, varied in some runs", "unit": "M s^-1", "kind": "measured"}, {"name": "τ", "value": "2", "unit": "days", "kind": "assumed"}, {"name": "v", "value": "1.7e-11", "unit": "l", "kind": "assumed"}, {"name": "α_i, K_i, m", "value": "varied by case; fig. 2 uses α=300, K=100", "unit": "molecules h^-1; molecules", "kind": "assumed"}], "system": "Generic single target cell with n competing axons; values from NGF data in cited papers (measured there, those papers not read). No species or age fit.", "paper_id": "p-pmid10380678", "locator": "Section 4(b) and 4(e), p 885, page image", "quote": "Various factors in the innervating axon, some dependent on and some independent of its electrical activity", "maps_to_edge": "PROXY: activity raises competitive strength through growth or signalling parameters, and stronger axons survive.", "transfer_assumes": "Assumes activity acts through α_i, K_i or γ_i; the paper gives no equation from activity to these, and the edge concerns afferents supporting motoneurons, not an axon's own activity.", "transcription": "clean", "read_depth": "author-hosted PDF; pages 883-885 read as page images; rest by keyword in p-pmid10380678_pdftotext.txt, where symbols are garbled", "record": "m.eq.activity_motor.n1"}
---
