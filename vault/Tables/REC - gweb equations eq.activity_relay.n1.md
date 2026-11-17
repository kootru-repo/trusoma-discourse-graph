---
recordTypeId: "trusoma-record"
nodeInstanceId: "0c2523ca-3182-75ac-8d3c-f223e147cb14"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 340
group: "equations"
shape: "dictmap"
label: "eq.activity_relay.n1"
data: {"edge": "activity_relay", "kind": "equation", "form": "K^+(n_i^r, v_i, a^r) = K^+ n_i^r v_i a^r. [7]; w_i^r = n_i^r[Σ_i' I_ii'(C_rr W_i'^r + C_rl w_i'^l)](1 − w_i^r) − β_1[Σ_i' I_ii'(w_i'^r + w_i'^l)]w_i^r, [11]; ṅ_i^r = [N_i − (n_i^r + n_i^l)]w_i^r − β_2 n_i^r, [12]", "symbols": {"w_i^r": "synaptic strength to cortical unit i from the right eye", "n_i^r": "trophic factor taken up at that synapse", "N_i": "total trophic factor at unit i", "C": "correlation between inputs", "I": "intracortical interaction function", "β_1": "LTD constant, with all constants absorbed", "β_2": "release of trophic factor to the free pool"}, "parameters": [{"name": "C_rr, C_ll", "value": "0.9", "unit": "-", "kind": "assumed"}, {"name": "C_rl, C_lr", "value": "0.3", "unit": "-", "kind": "assumed"}, {"name": "I_max, I_min, χ_1, χ_2", "value": "1.0, 0.15, 1.3, 2.6", "unit": "-", "kind": "assumed"}, {"name": "β_1, β_2, N_i", "value": "not read", "unit": "-", "kind": "assumed"}], "system": "Ocular dominance model, 30 x 30 cortical sheet, no species or age fit.", "paper_id": "p-pmid9275231", "locator": "Eqs. 7, 11, 12, p 9946; Fig. 1 legend; page images. Eq. 11 prints capital W once and any dot on its left side was not legible; both left as read", "quote": "We formulate the equations in terms of mass-action kinetics as a mathematical convenience", "maps_to_edge": "Correlated afferent activity and limited trophic factor rewire a relay's input weights. Eq. 11 prints a capital W in C_rr W, where Eq. 8 has lowercase w, apparently a misprint, kept as printed. The paper clips the LTP and LTD terms at zero in simulation", "transfer_assumes": "Assumes a thalamus-to-cortex rule applies to brainstem relays before birth; the source cites no embryonic data for this.", "transcription": "clean", "read_depth": "Page 9946 of the saved PDF read by the lead on 2026-11-04 and compared with the stored form", "record": "m.eq.activity_relay.n1"}
---
