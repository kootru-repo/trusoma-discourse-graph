---
nodeTypeId: "node_LwROzkVH_Zck7ZxDgN91E"
nodeInstanceId: "2279e176-1f92-7e8a-8daa-f55533d60b9f"
dg_type: "Claim"
dg_name: "gweb edges relay_trophic"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 72
group: "edges"
shape: "list"
data: {"id": "relay_trophic", "source": "S.relay", "target": "S.trophic", "sign": "+", "mechanism": "Relay neurons release the competed trophic factor", "evidence": "built_mechanism", "phase": "growth", "records": [], "values": [], "note": "van Ooyen 1999 equation (3) release sigma per relay neuron; generic factor (J-RL1)", "equations": [], "code": "tools/trusoma/brain/relay_map.py TrophicTarget, RelayField (PA1, PA2)", "equation_gap": ""}
---

S.relay acts on S.trophic (+): Relay neurons release the competed trophic factor.

Growth web mechanism `relay_trophic`; evidence class: built_mechanism; phase: growth.

van Ooyen 1999 equation (3) release sigma per relay neuron; generic factor (J-RL1).
