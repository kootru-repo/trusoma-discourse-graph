---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "e1639d8e-2680-7ae6-841e-9f950378ca32"
dg_type: "Issue"
dg_name: "C-010"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 163
data: {"id": "C-010", "category": "C", "priority": "P3", "ref": "companion/source_audit/VALUES_AUDIT_2026-11-03.md", "item": "Sourcing references: the thumb limit values sit under setting keys that reference themselves; 22 configuration entries have an empty status while the log has one; 296 setting values have no log entry; 475 tool settings have no source fields", "why": "A value must carry a usable database reference", "resolve": "Point the thumb keys at the log constant; regenerate status and entries from the log; declare settings or log them", "status": "verified", "evidence": "Rerun audit: no live log constant missing, every entry has a status, 307 settings declared unresearched, 475 tool settings marked", "touched": "2026-11-03", "note": "Declared, not sourced"}
---

Sourcing references: the thumb limit values sit under setting keys that reference themselves; 22 configuration entries have an empty status while the log has one; 296 setting values have no log entry; 475 tool settings have no source fields.

Why it matters: A value must carry a usable database reference.

To resolve: Point the thumb keys at the log constant; regenerate status and entries from the log; declare settings or log them.

Status: verified; priority: P3; category: C.

Evidence so far: Rerun audit: no live log constant missing, every entry has a status, 307 settings declared unresearched, 475 tool settings marked.

Note: Declared, not sourced.
