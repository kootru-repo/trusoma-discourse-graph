---
nodeTypeId: "node_LwROzkVH_Zck7ZxDgN91E"
nodeInstanceId: "db66edff-ce22-7946-98bc-92c2689dacf2"
dg_type: "Claim"
dg_name: "gweb edges address_collateral"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 75
group: "edges"
shape: "list"
data: {"id": "address_collateral", "source": "S.address", "target": "S.collateral", "sign": "+", "mechanism": "Lineage identity sets which relay neurons a collateral enters", "evidence": "built_mechanism", "phase": "growth", "records": [], "values": [], "note": "Afferent order in the tract (Erzurumlu 1992) and relay lineage identity (Oury 2006), abstracts; entry by lineage domain, fall-off within a domain open (M-116)", "equations": [], "code": "tools/trusoma/brain/relay_map.py grow_order (PA1)", "equation_gap": ""}
---

S.address acts on S.collateral (+): Lineage identity sets which relay neurons a collateral enters.

Growth web mechanism `address_collateral`; evidence class: built_mechanism; phase: growth.

Afferent order in the tract (Erzurumlu 1992) and relay lineage identity (Oury 2006), abstracts; entry by lineage domain, fall-off within a domain open (M-116).
