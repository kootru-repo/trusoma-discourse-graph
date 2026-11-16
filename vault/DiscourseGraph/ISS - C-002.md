---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "ffcfa424-bf0e-7002-9f25-4600dfd1330a"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 53
data: {"id": "C-002", "category": "C", "priority": "P2", "ref": "tools/trusoma/brain/map_readout.py", "item": "mutual-kNN graph, geodesic MDS, eigh, prototypes (classical analysis methods) inside the brain package and the approval tree hash", "why": "an instrument, not brain; the file says it is outside the learner (imported only by a probe and tests)", "resolve": "Move it out of the brain package, or keep it and label it an instrument in the approval record", "status": "declared", "evidence": "map_readout.py docstring labels it OUTSIDE the learner (readout + scoring); only probe_skin_score_d1.py and tests import it, no learner module does (grep 2026-10-30); its randomness sites are tagged 'instrument' (c1m 9d193cc). Kept in the package and labelled an instrument; no move. 2026-10-30", "touched": "2026-10-30", "note": ""}
---
