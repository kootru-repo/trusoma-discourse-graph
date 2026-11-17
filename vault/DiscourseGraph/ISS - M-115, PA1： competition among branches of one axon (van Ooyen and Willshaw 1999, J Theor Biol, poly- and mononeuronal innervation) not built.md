---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "1a250591-4194-7a96-9f8a-a66badf9124c"
dg_type: "Issue"
dg_name: "M-115"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 249
data: {"id": "M-115", "category": "M", "priority": "P2", "ref": "relay_map.RelayField", "item": "PA1: competition among branches of one axon (van Ooyen and Willshaw 1999, J Theor Biol, poly- and mononeuronal innervation) not built; branches of one afferent are independent, so the strongest afferent of a lineage domain wins every relay neuron of it (test_pa1_field)", "why": "van Ooyen 1999 Proc R Soc B p.889 names this competition for the multi-target case; its form is not read", "resolve": "read the J Theor Biol 1999 model, list its form and values, then build it in RelayField", "status": "verified", "evidence": "van Ooyen and Willshaw 1999 J Theor Biol 196:495 (doi:10.1006/jtbi.1998.0849) full text read 2026-11-14; dual-constraint form built as relay_map.DualConstraint (rule PA6, module phase1_dual K18, join J-RL11); test_pa6_dual_constraint reproduces Figs 12a, 12d, 5d and gives one-to-one innervation when an afferent shares a relay neuron (commit a215733); combining PA6 with the trophic PA2 field not built (separate arms)", "touched": "2026-11-14", "note": ""}
---

PA1: competition among branches of one axon (van Ooyen and Willshaw 1999, J Theor Biol, poly- and mononeuronal innervation) not built; branches of one afferent are independent, so the strongest afferent of a lineage domain wins every relay neuron of it (test_pa1_field).

Why it matters: van Ooyen 1999 Proc R Soc B p.889 names this competition for the multi-target case; its form is not read.

To resolve: read the J Theor Biol 1999 model, list its form and values, then build it in RelayField.

Status: verified; priority: P2; category: M.

Evidence so far: van Ooyen and Willshaw 1999 J Theor Biol 196:495 (doi:10.1006/jtbi.1998.0849) full text read 2026-11-14; dual-constraint form built as relay_map.DualConstraint (rule PA6, module phase1_dual K18, join J-RL11); test_pa6_dual_constraint reproduces Figs 12a, 12d, 5d and gives one-to-one innervation when an afferent shares a relay neuron (commit a215733); combining PA6 with the trophic PA2 field not built (separate arms).
