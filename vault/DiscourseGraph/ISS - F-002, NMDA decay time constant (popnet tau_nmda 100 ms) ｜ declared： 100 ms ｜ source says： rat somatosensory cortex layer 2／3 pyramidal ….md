---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "c7300515-cae0-75e4-8829-84a38eae6846"
dg_type: "Issue"
dg_name: "F-002"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 59
data: {"id": "F-002", "category": "F", "priority": "P1", "ref": "companion/source_audit/FINDINGS.md row 2", "item": "NMDA decay time constant (popnet tau_nmda 100 ms) | declared: 100 ms | source says: rat somatosensory cortex layer 2/3 pyramidal cells, whole cell at -30 mV (Flint 1997, PMC6573498): 262.8 +- 20", "why": "a revision candidate from the source audit, none applied (rule R4: labelled revision with before/after reruns and a tree review)", "resolve": "declared value lies BELOW every neonatal rat age group; candidate age-dependent value (transfer rat P3-P9 -> human fetal weeks needs a declared map); affects ev", "status": "declared", "evidence": "Kept 100 ms as a declared model choice; FINDINGS row 2: it lies BELOW every sourced neonatal rat group (Flint 1997: 262.8 ms P3/4, 146 ms P8/9, 117.5 ms NR2A). Revision needs a declared rat-to-human-week map plus before/after reruns of every population; not applied. Direction of bias known: real NMDA decay is slower. 2026-10-30", "touched": "2026-11-04", "note": "Rechecked 2026-11-04: Flint 1997 re-read; Hestrin 1992 adds direction only; no human fetal decay found."}
---

NMDA decay time constant (popnet tau_nmda 100 ms) | declared: 100 ms | source says: rat somatosensory cortex layer 2/3 pyramidal cells, whole cell at -30 mV (Flint 1997, PMC6573498): 262.8 +- 20.

Why it matters: a revision candidate from the source audit, none applied (rule R4: labelled revision with before/after reruns and a tree review).

To resolve: declared value lies BELOW every neonatal rat age group; candidate age-dependent value (transfer rat P3-P9 -> human fetal weeks needs a declared map); affects ev.

Status: declared; priority: P1; category: F.

Evidence so far: Kept 100 ms as a declared model choice; FINDINGS row 2: it lies BELOW every sourced neonatal rat group (Flint 1997: 262.8 ms P3/4, 146 ms P8/9, 117.5 ms NR2A). Revision needs a declared rat-to-human-week map plus before/after reruns of every population; not applied. Direction of bias known: real NMDA decay is slower. 2026-10-30.

Note: Rechecked 2026-11-04: Flint 1997 re-read; Hestrin 1992 adds direction only; no human fetal decay found.
