---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "a53f95b0-40b1-7d7c-97cc-7253055607ed"
dg_type: "Issue"
dg_name: "F-007"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 64
data: {"id": "F-007", "category": "F", "priority": "P2", "ref": "companion/source_audit/FINDINGS.md row 7", "item": "stretch-arc weight W_IA_MN (0.6) | declared: tagged to Prochazka and Gorassini 1998 | source says: that paper gives the velocity exponent (f = 4.3 v^0.6 + 2 d + 82, adult cat hamstring Ia, nine cats), not a sy", "why": "a revision candidate from the source audit, none applied (rule R4: labelled revision with before/after reruns and a tree review)", "resolve": "provenance tag is a mis-attribution; classify W_IA_MN as model-choice", "status": "verified", "evidence": "c1m brainstem_s2.py:42 and constants_audit.csv already classify W_IA_MN (0.6) as model-choice (F7 WEAK, derivation table open); Prochazka & Gorassini 1998 gives only the velocity exponent. The mis-attribution is not in the code tag. 2026-10-30", "touched": "2026-10-30", "note": ""}
---

stretch-arc weight W_IA_MN (0.6) | declared: tagged to Prochazka and Gorassini 1998 | source says: that paper gives the velocity exponent (f = 4.3 v^0.6 + 2 d + 82, adult cat hamstring Ia, nine cats), not a sy.

Why it matters: a revision candidate from the source audit, none applied (rule R4: labelled revision with before/after reruns and a tree review).

To resolve: provenance tag is a mis-attribution; classify W_IA_MN as model-choice.

Status: verified; priority: P2; category: F.

Evidence so far: c1m brainstem_s2.py:42 and constants_audit.csv already classify W_IA_MN (0.6) as model-choice (F7 WEAK, derivation table open); Prochazka & Gorassini 1998 gives only the velocity exponent. The mis-attribution is not in the code tag. 2026-10-30.
