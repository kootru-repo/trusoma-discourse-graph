---
nodeTypeId: "node_LwROzkVH_Zck7ZxDgN91E"
nodeInstanceId: "e8abee1c-ded8-7139-bfe8-3f6cf1bdb7af"
dg_type: "Claim"
dg_name: "gweb edges relay_synapse"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 47
group: "edges"
shape: "list"
data: {"id": "relay_synapse", "source": "S.relay", "target": "S.synapse", "sign": "+", "mechanism": "Afferent synapses join after motor ones", "evidence": "human_number", "phase": "growth", "records": ["m.growth2.l3.n09", "m.growth2.timing.n10", "m.growth2.timing.n11", "m.growth2.timing.n12"], "values": ["test.ashwell2012.spinal_onsets_wg"], "note": "Human timing; sources disagree on the stage and date of first synapses. Human order (Ashwell & Mai 2012, citing Okado): spindle afferents cross the dorsal horn by 9.5 w.g. and contact motoneurons by 11 w.g.; ventral horn synaptophysin from 12-14 w.g.; timing only, still no equation", "equations": [], "code": "", "equation_gap": "NONE FOUND: no equation for afferent synapses joining after motor ones. The edge is a timing order; the weight rules under relay_gen and gen_synapse contain no such order."}
---

S.relay acts on S.synapse (+): Afferent synapses join after motor ones.

Growth web mechanism `relay_synapse`; evidence class: human_number; phase: growth.

Human timing; sources disagree on the stage and date of first synapses. Human order (Ashwell & Mai 2012, citing Okado): spindle afferents cross the dorsal horn by 9.5 w.g. and contact motoneurons by 11 w.g.; ventral horn synaptophysin from 12-14 w.g.; timing only, still no equation.

Open: NONE FOUND: no equation for afferent synapses joining after motor ones. The edge is a timing order; the weight rules under relay_gen and gen_synapse contain no such order.
