---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "bd3aa7c9-86e9-7bd5-afe4-ed6831a9a666"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 58
data: {"id": "F-001", "category": "F", "priority": "P3", "ref": "companion/source_audit/FINDINGS.md row 1", "item": "head radius (body.py head_r = 0.5 x femur x 1.6, i.e. BPD = 1.6 x femur) | declared: BPD 22.5 / 42.0 / 60.2 / 76.8 / 91.4 / 103.8 mm at 14 / 18 / 22 / 26 / | source says: INTERGROWTH-21st BPD 50th centile (Papageorghiou et al., Lancet 2014;384:869, opened by two readers): 29.6 / 4", "why": "a revision candidate from the source audit, none applied (rule R4: labelled revision with before/after reruns and a tree review)", "resolve": "replace the 1.6 x femur rule by the BPD chart (head too large by 9.5 percent at 22 weeks and 18 percent at 34 weeks; too small by 24 percent at 14 weeks); mixes", "status": "verified", "evidence": "The S2 body module line 91 now sets head_r from the BPD chart, INTERGROWTH-21st 50th centile, so the 1.6 x femur rule is gone", "touched": "2026-11-04", "note": ""}
---
