---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "26ba1d83-3910-7734-961d-e80ca629edbd"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 257
data: {"id": "M-123", "category": "M", "priority": "P1", "ref": "TR12 yoke test (PB3); tools/tools_config.json yoke_test.py", "item": "TR12 cannot be built yet: (1) body7 has no link between two limbs (the yoke: a rigid link between the ankles at their rest distance), (2) the reflex learner does not act on the motor pools (PB1, plastic relay-to-motor synapses, is not built; learn_from_body only records), (3) the one learning rule (PB2) is not supported in the free body (M-122), (4) the protocol is 65 simulated minutes per arm, about 11 h of wall time at the measured 10.5 s per simulated second at 17 weeks, so it needs chunked, resumable runs of under an hour each. The script yoke_test.py named in tools_config.json does not exist.", "why": "TR12 was the Part B endpoint thought independent of TR13; it shares the missing motor path and the rule.", "resolve": "After M-122 gives a sourced fetal-stage rule: build the ankle link as a body constraint row with its own test, build PB1 so learned weights drive the pools, write yoke_test.py chunked and resumable, pre-register TR12.", "status": "in-progress", "evidence": "", "touched": "2026-11-15", "note": "2026-11-15: compressed baseline yoke probe run (130 s, two arms, closed loop, 17 weeks; RESULT_YOKE_BASELINE_2026-11-15.md): link holds, no yoke effect without a learner at any threshold. Remaining: a learner that drives the limbs, a sourced limb-movement definition, the 65 minute arms (about 12 h each)."}
---
