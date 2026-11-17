---
nodeTypeId: "node_LwROzkVH_Zck7ZxDgN91E"
nodeInstanceId: "04c1d487-e8b9-7bc4-91f6-e0f9fd245df0"
dg_type: "Claim"
dg_name: "gweb edges move_load"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 28
group: "edges"
shape: "list"
data: {"id": "move_load", "source": "B.move", "target": "B.load", "sign": "+", "mechanism": "Movement loads tissue", "evidence": "built_mechanism", "phase": "growth", "records": [], "values": [], "note": "From physics on the mesh", "equations": [], "code": "tools/trusoma/brain/body7.py Body7.step, joint moments; tissue load on the mesh is still to build", "equation_gap": ""}
---

B.move acts on B.load (+): Movement loads tissue.

Growth web mechanism `move_load`; evidence class: built_mechanism; phase: growth.

From physics on the mesh.
