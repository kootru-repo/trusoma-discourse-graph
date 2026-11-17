---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "cfc557f2-ca3c-70a9-adab-c24ee54c5239"
dg_type: "Issue"
dg_name: "F-013"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 142
data: {"id": "F-013", "category": "F", "priority": "P2", "ref": "githooks pre-commit", "item": "Add the body provenance gate: insert before the DOCS= line of the pre-commit hook: python -B -E companion/source_audit/validate_body_provenance.py || { echo 'pre-commit: body provenance at GA 12.5 failed; commit refused'; exit 1; }", "why": "the pre-commit hook is a gate file; the brain guard refuses edits unless the USER writes the unlock file with today's date", "resolve": "user writes the unlock for the day, then one Edit; the validator already passes (16 values, 6 extrapolated, 0 unsourced)", "status": "closed-na", "evidence": "pre-commit now runs companion/source_audit/validate_body_provenance.py before the brain_check step (validator passes: 16 values, 6 extrapolated, 0 unsourced); applied after the user disabled the gate-file lock 2026-10-29", "touched": "2026-10-29", "note": ""}
---

Add the body provenance gate: insert before the DOCS= line of the pre-commit hook: python -B -E companion/source_audit/validate_body_provenance.py || { echo 'pre-commit: body provenance at GA 12.5 failed; commit refused'; exit 1; }.

Why it matters: the pre-commit hook is a gate file; the brain guard refuses edits unless the USER writes the unlock file with today's date.

To resolve: user writes the unlock for the day, then one Edit; the validator already passes (16 values, 6 extrapolated, 0 unsourced).

Status: closed-na; priority: P2; category: F.

Evidence so far: pre-commit now runs companion/source_audit/validate_body_provenance.py before the brain_check step (validator passes: 16 values, 6 extrapolated, 0 unsourced); applied after the user disabled the gate-file lock 2026-10-29.
