---
recordTypeId: "trusoma-record"
nodeInstanceId: "4e6c7375-f079-7911-a289-a20490c8746a"
dg_type: "Record"
record_file: "companion/source_audit/growth_web_12p5.json"
code: "gweb"
order: 333
group: "equations"
shape: "dictmap"
label: "eq.gen_move.n1"
data: {"edge": "gen_move", "kind": "equation", "form": "F'_M = F_C + F_S + F_D (1); F_S = K_M Δl, F_D = B_M l-dot (2); F_M = F'_M if F'_M > 0, 0 otherwise (3); stated in text: F_C = f(m) is proportional to the activation m", "symbols": {"F'_M": "total force of a muscle", "F_C": "force of the contractile element", "F_S": "force of the parallel elastic element", "F_D": "force of the parallel damping element", "K_M": "spring constant", "B_M": "damping constant", "Δl": "muscle deformation, current minus resting length", "l-dot": "rate of change of muscle length", "m": "muscle activation, the motor signal"}, "parameters": [{"name": "K_M", "value": "1 in most runs; 73.5 identified in cited [35]", "unit": "N/m", "kind": "assumed"}, {"name": "B_M", "value": "1 in most runs; 49 identified in cited [35]", "unit": "Ns/m", "kind": "assumed"}, {"name": "twitch m_i", "value": "0.01 for 0.25 s", "unit": "as printed", "kind": "assumed"}, {"name": "activation filter", "value": "time constant 1/500, passband gain 1/500", "unit": "as printed", "kind": "assumed"}], "system": "Simulated rigid leg with adult human segment lengths (1.80 m human), 1 kg segments; not fetal.", "paper_id": "p-pmid25057775", "locator": "Eqs. 1-3, pp 3-4, page images", "quote": "The total force, F'M, produced by a given muscle is given by:", "maps_to_edge": "Motor activation gives muscle force on a limb, the step from generator output to movement.", "transfer_assumes": "Assumes an adult-proportioned Hill-type muscle holds for a fetal limb, with no fetal K_M or B_M; no equation here gives the generator's own output.", "transcription": "clean", "read_depth": "publisher PDF; pages 3-5 read as page images; assumptions section by keyword", "record": "m.eq.gen_move.n1"}
---
