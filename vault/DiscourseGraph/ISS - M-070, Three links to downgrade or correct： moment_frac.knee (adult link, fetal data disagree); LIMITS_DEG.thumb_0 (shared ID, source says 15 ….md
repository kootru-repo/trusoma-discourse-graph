---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "2fff4449-8b1c-723d-8c28-838764388d3f"
dg_type: "Issue"
dg_name: "M-070"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 183
data: {"id": "M-070", "category": "M", "priority": "P2", "ref": "companion/source_audit/batch_2026-11-04_undone/LIKELY_SOURCEABLE.md", "item": "Three links to downgrade or correct: moment_frac.knee (adult link, fetal data disagree); LIMITS_DEG.thumb_0 (shared ID, source says 15 degrees of extension); hip_ext_late.n0#1 (a week value, shared ID)", "why": "They count as sourced but are not supported as they stand: the true share is 291 of 945 without the two shared-ID keys", "resolve": "Split the shared IDs and downgrade the knee; the merge tool needs a bound review for a downgrade", "status": "verified", "evidence": "2026-11-05: moment_frac.knee status lowered to model-choice; LIMITS_DEG.thumb_0 split to body.limits_deg.thumb_lo and hip_ext_late.n0#1 split to body7.hip_ext_late.n0_week, both model-choice; constant_sources.jsonl last 5 lines, global_config.json. Master database now 290 of 945. The links stay in paper_links.csv as the record of what was read. needs_review in cid_fold.py lets a downgrade by user-ruling-2026-10-22 pass. No value changed. 2026-11-05 repair: the two split IDs had no real code site and failed cid_check, which I had not run; retired, status kept on the configuration records; cid_check passes.", "touched": "2026-11-05", "note": ""}
---

Three links to downgrade or correct: moment_frac.knee (adult link, fetal data disagree); LIMITS_DEG.thumb_0 (shared ID, source says 15 degrees of extension); hip_ext_late.n0#1 (a week value, shared ID).

Why it matters: They count as sourced but are not supported as they stand: the true share is 291 of 945 without the two shared-ID keys.

To resolve: Split the shared IDs and downgrade the knee; the merge tool needs a bound review for a downgrade.

Status: verified; priority: P2; category: M.

Evidence so far: 2026-11-05: moment_frac.knee status lowered to model-choice; LIMITS_DEG.thumb_0 split to body.limits_deg.thumb_lo and hip_ext_late.n0#1 split to body7.hip_ext_late.n0_week, both model-choice; constant_sources.jsonl last 5 lines, global_config.json. Master database now 290 of 945. The links stay in paper_links.csv as the record of what was read. needs_review in cid_fold.py lets a downgrade by user-ruling-2026-10-22 pass. No value changed. 2026-11-05 repair: the two split IDs had no real code site and failed cid_check, which I had not run; retired, status kept on the configuration records; cid_check passes.
