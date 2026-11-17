---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "9792c351-4de9-7dfd-aed9-24a4a6d07542"
dg_type: "Issue"
dg_name: "T-002"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 248
data: {"id": "T-002", "category": "T", "priority": "P2", "ref": "tools/trusoma/brain/test_skin7.py", "item": "test_skin7.py: 12 of 14 tests fail before and after the M-113 change (checked 2026-11-14 at HEAD and with the change: identical failure set): bodies at other ages do not build (embedded rest at GA 10 and 14; missing crown-rump length past 14 weeks, body7.py line 664), and test_frozen_schedule reports schedule drift.", "why": "the skin tests cannot guard the skin while the body fails at other ages", "resolve": "fix with M-114 (rest rows and size charts for other ages); re-run", "status": "open", "evidence": "", "touched": "2026-11-14", "note": ""}
---

test_skin7.py: 12 of 14 tests fail before and after the M-113 change (checked 2026-11-14 at HEAD and with the change: identical failure set): bodies at other ages do not build (embedded rest at GA 10 and 14; missing crown-rump length past 14 weeks, body7.py line 664), and test_frozen_schedule reports schedule drift.

Why it matters: the skin tests cannot guard the skin while the body fails at other ages.

To resolve: fix with M-114 (rest rows and size charts for other ages); re-run.

Status: open; priority: P2; category: T.
