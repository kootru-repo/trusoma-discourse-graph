---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "6d2efd1c-005e-764d-9838-02624e1bfe48"
dg_type: "Issue"
dg_name: "M-080"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 193
data: {"id": "M-080", "category": "M", "priority": "P2", "ref": "companion/source_audit/batch_2026-11-05_values/FACE.md", "item": "The scan face runs on the numpy path only: a 15 s brainstem loop takes about 100 s against 37 s with the compiled engine", "why": "Every run is slower, which limits probes under the one-hour rule", "resolve": "Add the grid lookup to the numba contact kernel in body7_nb.py and check it matches the numpy path", "status": "open", "evidence": "", "touched": "2026-11-05", "note": ""}
---

The scan face runs on the numpy path only: a 15 s brainstem loop takes about 100 s against 37 s with the compiled engine.

Why it matters: Every run is slower, which limits probes under the one-hour rule.

To resolve: Add the grid lookup to the numba contact kernel in body7_nb.py and check it matches the numpy path.

Status: open; priority: P2; category: M.
