---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "6eabf19d-d31d-7653-932d-3d58480c16ae"
dg_type: "Issue"
dg_name: "C-012"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 165
data: {"id": "C-012", "category": "C", "priority": "P3", "ref": "companion/source_audit/VALUES_AUDIT_2026-11-03.md", "item": "Eight old tools outside the package hold about 760 hard-coded numbers and read no configuration; listed in gap 4 of the report; nothing outside the set imports them", "why": "Could be mistaken for current body values", "resolve": "Archive and remove them, or move their values to the tools configuration", "status": "verified", "evidence": "Archived to C:/Projects/trusoma-archive/archive/old_tools_2026-11-03 and removed from the tree; test_tongue7 passes on stored digests", "touched": "2026-11-03", "note": ""}
---

Eight old tools outside the package hold about 760 hard-coded numbers and read no configuration; listed in gap 4 of the report; nothing outside the set imports them.

Why it matters: Could be mistaken for current body values.

To resolve: Archive and remove them, or move their values to the tools configuration.

Status: verified; priority: P3; category: C.

Evidence so far: Archived to C:/Projects/trusoma-archive/archive/old_tools_2026-11-03 and removed from the tree; test_tongue7 passes on stored digests.
