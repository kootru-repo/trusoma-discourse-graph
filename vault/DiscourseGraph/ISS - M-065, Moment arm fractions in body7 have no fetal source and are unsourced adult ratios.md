---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "2f9c7741-765f-7a0d-b2a1-7707697d777a"
dg_type: "Issue"
dg_name: "M-065"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 178
data: {"id": "M-065", "category": "M", "priority": "P2", "ref": "companion/source_audit/batch_2026-11-04_undone/res_biological_search.jsonl", "item": "Moment arm fractions in body7 have no fetal source and are unsourced adult ratios; Zhang 2024 gives adult rotator cuff arms 22.9-24.2 mm against sh_rot 0.15 of a segment length", "why": "They scale each joint's peak torque (body7 self.F), so they affect movement at 12.5 weeks", "resolve": "Read adult arm and segment lengths from one source per joint and declare how muscles are lumped, or measure arms on a fetal muscle model; keep as model choices until then", "status": "in-progress", "evidence": "Single-muscle arms are 2 to 4 times below the shoulder fractions, but whole-joint torque is only about 1.7 times high (M-067). Wrist, hip and knee fractions linked to adult data. Not changed", "touched": "2026-11-04", "note": ""}
---

Moment arm fractions in body7 have no fetal source and are unsourced adult ratios; Zhang 2024 gives adult rotator cuff arms 22.9-24.2 mm against sh_rot 0.15 of a segment length.

Why it matters: They scale each joint's peak torque (body7 self.F), so they affect movement at 12.5 weeks.

To resolve: Read adult arm and segment lengths from one source per joint and declare how muscles are lumped, or measure arms on a fetal muscle model; keep as model choices until then.

Status: in-progress; priority: P2; category: M.

Evidence so far: Single-muscle arms are 2 to 4 times below the shoulder fractions, but whole-joint torque is only about 1.7 times high (M-067). Wrist, hip and knee fractions linked to adult data. Not changed.
