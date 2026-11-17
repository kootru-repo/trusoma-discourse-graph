---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "2cda5f34-cd2e-7698-bafa-7166aa92f3df"
dg_type: "Issue"
dg_name: "C-008"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 161
data: {"id": "C-008", "category": "C", "priority": "P2", "ref": ".claude/hooks/brain_guard.py guarded_names; .claude/hooks/test_brain_guard.py line 51", "item": "test_brain_guard fails one case: a python writer naming cortex_core.py is not blocked. guarded_names looks for sibling montyjepa-* checkouts, but c1m and v7 moved to C:/Projects/trusoma-archive/worktrees on 2026-10-24, so sibling-only brain files lost shell-write protection from the engine tree. Not caused by the 2026-11-03 config migration: neither file changed and the engine has no cortex_core.py", "why": "A guard gap: scripted writes to files only in c1m or v7 are not blocked when run from the engine tree", "resolve": "Point guarded_names at trusoma/worktrees, rerun the guard test", "status": "verified", "evidence": "The guard test suite passes ALL on trusoma-main: with one tree the worktree move no longer matters; retired worktrees removed 2026-11-03", "touched": "2026-11-03", "note": ""}
---

test_brain_guard fails one case: a python writer naming cortex_core.py is not blocked. guarded_names looks for sibling montyjepa-* checkouts, but c1m and v7 moved to C:/Projects/trusoma-archive/worktrees on 2026-10-24, so sibling-only brain files lost shell-write protection from the engine tree. Not caused by the 2026-11-03 config migration: neither file changed and the engine has no cortex_core.py.

Why it matters: A guard gap: scripted writes to files only in c1m or v7 are not blocked when run from the engine tree.

To resolve: Point guarded_names at trusoma/worktrees, rerun the guard test.

Status: verified; priority: P2; category: C.

Evidence so far: The guard test suite passes ALL on trusoma-main: with one tree the worktree move no longer matters; retired worktrees removed 2026-11-03.
