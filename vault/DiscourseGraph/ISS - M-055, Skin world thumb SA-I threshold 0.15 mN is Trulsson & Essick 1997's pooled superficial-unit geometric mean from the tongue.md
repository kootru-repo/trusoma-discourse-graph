---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "2cf56705-77fe-7967-8880-402b7e8df611"
dg_type: "Issue"
dg_name: "M-055"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 151
data: {"id": "M-055", "category": "M", "priority": "P2", "ref": "skin_world F_SA_THUMB; papers/trulsson-essick-1997", "item": "Skin world thumb SA-I threshold 0.15 mN is Trulsson & Essick 1997's pooled superficial-unit geometric mean from the tongue; the paper gives RA 0.11 mN, SA 0.27 and 0.31 mN", "why": "Value applied to the wrong afferent class and site", "resolve": "Choose the SA value or a thumb source, then correct the design entry and code", "status": "in-progress", "evidence": "Hand's own SA I median is 1.3 mN (Johansson 1980) against 0.15 mN taken from the tongue, about 9 times lower. Not changed: the parameter scales ln(1 + f/F), and no fetal threshold exists. Decide with the skin input join.", "touched": "2026-11-04", "note": "Not needed on the TouchSim hand route; still wrong in skin_world if that law is kept; not edited"}
---

Skin world thumb SA-I threshold 0.15 mN is Trulsson & Essick 1997's pooled superficial-unit geometric mean from the tongue; the paper gives RA 0.11 mN, SA 0.27 and 0.31 mN.

Why it matters: Value applied to the wrong afferent class and site.

To resolve: Choose the SA value or a thumb source, then correct the design entry and code.

Status: in-progress; priority: P2; category: M.

Evidence so far: Hand's own SA I median is 1.3 mN (Johansson 1980) against 0.15 mN taken from the tongue, about 9 times lower. Not changed: the parameter scales ln(1 + f/F), and no fetal threshold exists. Decide with the skin input join.

Note: Not needed on the TouchSim hand route; still wrong in skin_world if that law is kept; not edited.
