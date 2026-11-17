---
nodeTypeId: "node_LwROzkVH_Zck7ZxDgN91E"
nodeInstanceId: "47ddf1b2-2751-7c60-8d6d-c00415e49ccf"
dg_type: "Claim"
dg_name: "gweb edges muscle_motor"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 33
group: "edges"
shape: "list"
data: {"id": "muscle_motor", "source": "B.muscle", "target": "S.motor", "sign": "+", "mechanism": "Target size sets how many motoneurons survive", "evidence": "animal_number", "phase": "growth", "records": ["m.growth2.l1.n04", "m.growth2.l1.n05", "m.growth2.l1.n06", "m.growth2.l1.n07", "m.growth2.l1.n09"], "values": ["l1.lanser84_means", "l1.lanser86_means", "l1.limb_rescued_survive_pct", "l1.limb_survival_fold", "l1.limbless_loss_days", "l1.limbless_loss_pct", "l1.limbless_survive_pct", "l1.mouse_loss_days", "l1.mouse_loss_pct", "l1.normal_loss_brachial_pct", "l1.normal_loss_lumbar_pct", "l1.rescue_before_day", "l1.tanaka_dependency_cited", "l1.tanaka_motoneurons", "l1.tanaka_myotubes", "l1.target_survivor_r"], "note": "Chick, quail and mouse; no human target-size measurement. About twice as many motoneurons are made as survive; without a limb about 15% survive, and with one about 45%, so part of the loss does not depend on the target. Part of normal death may not be target competition", "equations": ["eq.muscle_motor.n1"], "code": "", "equation_gap": ""}
---

B.muscle acts on S.motor (+): Target size sets how many motoneurons survive.

Growth web mechanism `muscle_motor`; evidence class: animal_number; phase: growth.

Chick, quail and mouse; no human target-size measurement. About twice as many motoneurons are made as survive; without a limb about 15% survive, and with one about 45%, so part of the loss does not depend on the target. Part of normal death may not be target competition.
