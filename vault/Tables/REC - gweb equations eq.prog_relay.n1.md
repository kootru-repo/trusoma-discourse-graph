---
recordTypeId: "trusoma-record"
nodeInstanceId: "ba88c8cc-3bc0-7af3-ae41-db25876c49a8"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 345
group: "equations"
shape: "dictmap"
label: "eq.prog_relay.n1"
data: {"edge": "prog_relay", "kind": "equation", "form": "PVE_N = P_1 × ∏_{n=2}^{N} 2 × P_n, (Equation 1); OUT_N = Q_1 + Σ_{n=2}^{N} 2 × Q_n × PVE_{n−1}, (Equation 2)", "symbols": {"PVE_N": "size of the proliferative epithelium after N cycles from a unit founder", "P_n": "P fraction of cell cycle n", "Q_n": "Q fraction of cell cycle n", "OUT_N": "cumulative output through N cycles"}, "parameters": [{"name": "Q and P in cycle 8", "value": "0.5, 0.5", "unit": "fraction", "kind": "measured"}, {"name": "Q in cycle 10", "value": "about 0.8", "unit": "fraction", "kind": "measured"}, {"name": "cell cycles", "value": "about 11", "unit": "count", "kind": "measured"}], "system": "Mouse dorsomedial neocortex, E11-E17; the model excludes cell death.", "paper_id": "p-pmid8815900", "locator": "Discussion, Equations 1-2", "quote": "Cycle-to-cycle growth is multiplicative, so that the size of the PVE (PVEN) derived from a unit founder population over the course of N cell cycles is:", "maps_to_edge": "Relay neurons come from a pool through cycle-by-cycle Q and P.", "transfer_assumes": "Assumes the neocortical Q schedule transfers to a brainstem relay nucleus, for which no Q or cycle time was found.", "transcription": "clean", "read_depth": "PMC page saved as text; model section read; Q values from abstract and Discussion, per-cycle table not read", "record": "m.eq.prog_relay.n1"}
---
