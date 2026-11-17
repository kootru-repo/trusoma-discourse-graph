---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "3ea6aaf8-5f6d-7de6-8e7b-aabd06c23db2"
dg_type: "Issue"
dg_name: "M-103"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 227
data: {"id": "M-103", "category": "M", "priority": "P3", "ref": "companion/audit_log/verification/sculpt_refit_2026-11-11/RESULT_PASS3.md", "item": "Refitted sculpt (pass 3, illustration only since 2026-11-12): crown-rump 47.5 mm against the sourced 61.65 (trunk not refitted; original sculpt 44.4), so the arms, set to the sourced 14.37 and 10.10 mm, read 30% of crown-rump in the side picture against the sourced 23%. Nape hump: pass 2 moved the head block back 3.03 mm and carried nape skin with it; on the midline the back skin steps 4.4 mm between 12 and 16 mm below the head centre (original sculpt 1.0 mm) and lies 5.4 to 6.8 mm behind the physics neck at 10 to 12 mm below the head centre", "why": "Nothing sourced calls for a hump; it is a refit artefact. The picture misstates arm-to-body proportion", "resolve": "Pass 4: refit the trunk to the physics trunk (hips 10 mm lower), end the head weight at the base of the physics skull so the nape follows the neck and trunk; re-render. Scripts hump_profile.py and sideview_measure.py in the same folder repeat the readings", "status": "in-progress", "evidence": "2026-11-13 pass 4 (companion/audit_log/verification/sculpt_refit_2026-11-11/RESULT_PASS4.md, pass4_verify.json): crown-rump 47.5 -> 60.0 mm (sourced 61.65); nape step gone (largest change between 2 mm rows 2.65 -> 1.20 mm); arms unmoved; vertices inside the body 618 -> 0; 0 folded faces. Open: trunk stretched 1.63 x, not fitted to the physics trunk shape (belly 6.7 mm less deep in front); knees 10.9 and 12.9 mm from the physics knees; thighs not set", "touched": "2026-11-13", "note": ""}
---

Refitted sculpt (pass 3, illustration only since 2026-11-12): crown-rump 47.5 mm against the sourced 61.65 (trunk not refitted; original sculpt 44.4), so the arms, set to the sourced 14.37 and 10.10 mm, read 30% of crown-rump in the side picture against the sourced 23%. Nape hump: pass 2 moved the head block back 3.03 mm and carried nape skin with it; on the midline the back skin steps 4.4 mm between 12 and 16 mm below the head centre (original sculpt 1.0 mm) and lies 5.4 to 6.8 mm behind the physics neck at 10 to 12 mm below the head centre.

Why it matters: Nothing sourced calls for a hump; it is a refit artefact. The picture misstates arm-to-body proportion.

To resolve: Pass 4: refit the trunk to the physics trunk (hips 10 mm lower), end the head weight at the base of the physics skull so the nape follows the neck and trunk; re-render. Scripts hump_profile.py and sideview_measure.py in the same folder repeat the readings.

Status: in-progress; priority: P3; category: M.

Evidence so far: 2026-11-13 pass 4 (companion/audit_log/verification/sculpt_refit_2026-11-11/RESULT_PASS4.md, pass4_verify.json): crown-rump 47.5 -> 60.0 mm (sourced 61.65); nape step gone (largest change between 2 mm rows 2.65 -> 1.20 mm); arms unmoved; vertices inside the body 618 -> 0; 0 folded faces. Open: trunk stretched 1.63 x, not fitted to the physics trunk shape (belly 6.7 mm less deep in front); knees 10.9 and 12.9 mm from the physics knees; thighs not set.
