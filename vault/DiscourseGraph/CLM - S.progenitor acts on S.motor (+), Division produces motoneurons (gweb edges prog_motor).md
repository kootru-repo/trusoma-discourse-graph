---
nodeTypeId: "node_LwROzkVH_Zck7ZxDgN91E"
nodeInstanceId: "18c0dd9c-c099-7fb0-9a6c-defa5b16b1ad"
dg_type: "Claim"
dg_name: "gweb edges prog_motor"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 49
group: "edges"
shape: "list"
data: {"id": "prog_motor", "source": "S.progenitor", "target": "S.motor", "sign": "+", "mechanism": "Division produces motoneurons", "evidence": "human_number", "phase": "growth", "records": ["m.growth2.counts.n01", "m.growth2.timing.n06", "m.growth2.counts.n04", "m.growth2.start.n08"], "values": ["l6.cycle_h", "l6.cycle_sd_h", "l6.cycle_lo_h", "l6.cycle_hi_h", "l6.tempo_vs_mouse"], "note": "Cycle time is neuroepithelial, not brainstem or spinal", "equations": ["eq.prog_motor.n1"], "code": "", "equation_gap": ""}
---

S.progenitor acts on S.motor (+): Division produces motoneurons.

Growth web mechanism `prog_motor`; evidence class: human_number; phase: growth.

Cycle time is neuroepithelial, not brainstem or spinal.
