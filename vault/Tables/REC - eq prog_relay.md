---
recordTypeId: "trusoma-record"
nodeInstanceId: "0fd99135-93e0-702f-afff-e20266d848f0"
dg_type: "Record"
record_file: "companion/source_audit/batch_2026-11-04_equations/equations.jsonl"
code: "eq"
order: 20
fmt: "default"
data: {"edge": "prog_relay", "equation": "PVE_N = P_1 × ∏_{n=2}^{N} 2 × P_n, (Equation 1); OUT_N = Q_1 + Σ_{n=2}^{N} 2 × Q_n × PVE_{n−1}, (Equation 2)", "symbols": {"PVE_N": "size of the proliferative epithelium after N cycles from a unit founder", "P_n": "P fraction of cell cycle n", "Q_n": "Q fraction of cell cycle n", "OUT_N": "cumulative output through N cycles"}, "parameters": [{"name": "Q and P in cycle 8", "value": "0.5, 0.5", "unit": "fraction", "kind": "measured"}, {"name": "Q in cycle 10", "value": "about 0.8", "unit": "fraction", "kind": "measured"}, {"name": "cell cycles", "value": "about 11", "unit": "count", "kind": "measured"}], "system": "Mouse dorsomedial neocortex, E11-E17; the model excludes cell death.", "paper_id": "p-pmid8815900", "citation": "Takahashi T, Nowakowski RS, Caviness VS. The leaving or Q fraction of the murine cerebral proliferative epithelium: a general model of neocortical neuronogenesis. J Neurosci 1996;16:6183-6196.", "doi": "10.1523/jneurosci.16-19-06183.1996", "pmid": "8815900", "local_file": "C:\\Projects\\trusoma-archive\\montyjepa-engine\\papers\\growth_sources\\p-pmid8815900_pmc.txt", "locator": "Discussion, Equations 1-2", "quote": "Cycle-to-cycle growth is multiplicative, so that the size of the PVE (PVEN) derived from a unit founder population over the course of N cell cycles is:", "maps_to_edge": "Relay neurons come from a pool through cycle-by-cycle Q and P.", "transfer_assumes": "Assumes the neocortical Q schedule transfers to a brainstem relay nucleus, for which no Q or cycle time was found.", "transcription_confidence": "clean", "how_far_read": "PMC page saved as text; model section read; Q values from abstract and Discussion, per-cycle table not read", "found": true}
---
