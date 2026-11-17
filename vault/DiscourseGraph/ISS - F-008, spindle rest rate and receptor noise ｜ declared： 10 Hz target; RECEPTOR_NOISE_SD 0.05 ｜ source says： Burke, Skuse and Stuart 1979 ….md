---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "ccc90eec-a522-7b3f-8bf3-84f3f8f6bcf0"
dg_type: "Issue"
dg_name: "F-008"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 65
data: {"id": "F-008", "category": "F", "priority": "P2", "ref": "companion/source_audit/FINDINGS.md row 8", "item": "spindle rest rate and receptor noise | declared: 10 Hz target; RECEPTOR_NOISE_SD 0.05 | source says: Burke, Skuse and Stuart 1979 (normal human subjects): mean rest rate 11.1 Hz (4.8-22.1) in the 24 of 39 ending", "why": "a revision candidate from the source audit, none applied (rule R4: labelled revision with before/after reruns and a tree review)", "resolve": "supports the 10 Hz order of magnitude; the noise does not map directly (CV of intervals vs additive drive sd); in the same paper 15 of 39 endings were silent at", "status": "declared", "evidence": "FINDINGS.md row 8: Burke 1979 mean rest 11.1 Hz supports the 10 Hz order; RECEPTOR_NOISE_SD 0.05 has no direct mapping, kept as declared model choice", "touched": "2026-11-04", "note": "Rechecked 2026-11-04: outcome stands; no new source for the noise."}
---

spindle rest rate and receptor noise | declared: 10 Hz target; RECEPTOR_NOISE_SD 0.05 | source says: Burke, Skuse and Stuart 1979 (normal human subjects): mean rest rate 11.1 Hz (4.8-22.1) in the 24 of 39 ending.

Why it matters: a revision candidate from the source audit, none applied (rule R4: labelled revision with before/after reruns and a tree review).

To resolve: supports the 10 Hz order of magnitude; the noise does not map directly (CV of intervals vs additive drive sd); in the same paper 15 of 39 endings were silent at.

Status: declared; priority: P2; category: F.

Evidence so far: FINDINGS.md row 8: Burke 1979 mean rest 11.1 Hz supports the 10 Hz order; RECEPTOR_NOISE_SD 0.05 has no direct mapping, kept as declared model choice.

Note: Rechecked 2026-11-04: outcome stands; no new source for the noise.
