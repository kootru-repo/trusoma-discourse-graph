---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "3b491c6a-bab8-79c1-a95e-d720c370594b"
dg_type: "Issue"
dg_name: "M-085"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 198
data: {"id": "M-085", "category": "M", "priority": "P3", "ref": "companion/source_audit/batch_2026-11-05_values/LIMITS.md", "item": "Shoulder abduction upper limit: Park 2009 gives 180 deg (adult normal); the model holds 120 because 180 is an exempt unit literal in provenance_check, so the constant-ID check cannot bind it at its site", "why": "A sourced limit cannot be put in without a rebind of the site", "resolve": "Rebind body7.limits_deg.sh_abd so the value is read without a code literal (or exempt the site), then set 180", "status": "verified", "evidence": "USER approved 2026-11-06; unbound via companion/reviews_v2/2026-11-06_cid_approval_sh_abd_unbind.md; value 180 source-found-transfer (Park 2009); cid_check staged PASS; OA2-OA4 pass; loop spread 0.69/0.73 guard 0; commit 558de5a", "touched": "2026-11-06", "note": ""}
---

Shoulder abduction upper limit: Park 2009 gives 180 deg (adult normal); the model holds 120 because 180 is an exempt unit literal in provenance_check, so the constant-ID check cannot bind it at its site.

Why it matters: A sourced limit cannot be put in without a rebind of the site.

To resolve: Rebind body7.limits_deg.sh_abd so the value is read without a code literal (or exempt the site), then set 180.

Status: verified; priority: P3; category: M.

Evidence so far: USER approved 2026-11-06; unbound via companion/reviews_v2/2026-11-06_cid_approval_sh_abd_unbind.md; value 180 source-found-transfer (Park 2009); cid_check staged PASS; OA2-OA4 pass; loop spread 0.69/0.73 guard 0; commit 558de5a.
