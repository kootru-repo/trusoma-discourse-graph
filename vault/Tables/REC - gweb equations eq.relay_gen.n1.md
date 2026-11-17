---
recordTypeId: "trusoma-record"
nodeInstanceId: "6da811db-da4d-722b-bd47-e7ff58da77c7"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 341
group: "equations"
shape: "dictmap"
label: "eq.relay_gen.n1"
data: {"edge": "relay_gen", "kind": "equation", "form": "Δw_{i,j,t} = −η m_{i,t−1}(ṡ_{j,t} + m_{i,t−1} w_{i,j,t}) (5); m_{i,t} = G_p^Ia Σ_{i=1}^{M} w_{i,j}^Ia s_{j,t−1}^Ia + G_p^II Σ_{i=1}^{M} w_{i,j}^II s_{j,t−1}^II (6)", "symbols": {"w_{i,j,t}": "connection between motor element of muscle i and receptor j at time t", "m_{i,t}": "motor activity of muscle i at time t", "s_{j,t}": "sensor activity of receptor j at time t", "η": "learning rate", "G_p^Ia, G_p^II": "global gains at movement phase p"}, "parameters": [{"name": "η", "value": "1000", "unit": "-", "kind": "assumed"}, {"name": "G_p^Ia, G_p^II", "value": "tuned manually", "unit": "-", "kind": "assumed"}, {"name": "twitches", "value": "10 per muscle, 4.75 s apart", "unit": "count; s", "kind": "assumed"}], "system": "Simulated leg; reflexes self-organized from twitches; rule said to follow refs [29,30] (Petersson 2003 is closed, not read).", "paper_id": "p-pmid25057775", "locator": "Eqs. 5-6, p 5, page image; Eq. 6 summation index printed as i=1, left as printed", "quote": "Using the anti-Oja rule, the change in the reflex connection strength at time t is given by:", "maps_to_edge": "Twitch-driven correlation of sensor and motor signals builds the reflex network a generator would use.", "transfer_assumes": "Assumes this learning rule, not fit to embryo data, applies before birth; the web already notes no source in any embryo.", "transcription": "clean", "read_depth": "publisher PDF; pages 3-5 read as page images; assumptions section by keyword", "record": "m.eq.relay_gen.n1"}
---
