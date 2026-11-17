---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "3d4a7d9a-e2cf-7586-a03a-ae7422ef576c"
dg_type: "Issue"
dg_name: "M-125"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 268
data: {"id": "M-125", "category": "M", "priority": "P3", "ref": "tools/trusoma/brain/test_body7.py", "item": "test_body7.py is stale against the current body: 13 of 24 checks fail at HEAD 2d4693e3 and equally after the 2026-11-17 phalanx values (9 with a missing crown-rump length in the size table at some ages, 2 with no embedded rest row at GA 9 and 11.5, 2 with foot overlaps at GA 9).", "why": "a body value change cannot be checked by this file until it is mended", "resolve": "mend the test or the size table, then rerun the file", "status": "open", "evidence": "", "touched": "2026-11-17", "note": ""}
---

test_body7.py is stale against the current body: 13 of 24 checks fail at HEAD 2d4693e3 and equally after the 2026-11-17 phalanx values (9 with a missing crown-rump length in the size table at some ages, 2 with no embedded rest row at GA 9 and 11.5, 2 with foot overlaps at GA 9).

Why it matters: a body value change cannot be checked by this file until it is mended.

To resolve: mend the test or the size table, then rerun the file.

Status: open; priority: P3; category: M.
