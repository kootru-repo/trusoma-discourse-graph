---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "b3a1fc69-181c-7cbc-816e-a07ba5aac4f5"
dg_type: "Issue"
dg_name: "M-108"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 241
data: {"id": "M-108", "category": "M", "priority": "P1", "ref": "companion/audit_log/verification/research_grade_2026-11-09/RESULT_PATH_STEPS_1_2.md", "item": "Free body with coupled wall contact suppresses arm movements (2026-11-14, section 18): isolated arm movements 0 per h and general movements 0% on seeds 7-9 (pinned 20-60 per h and 4.6-11.2%; source 6-104 per h and 6-18%); the touch reading rose to 0.117-0.184. Cause not found.", "why": "the free body is now the recording default; movement counts cannot be read until this is explained", "resolve": "compare per-part joint speed and travel, pinned against free, same seeds; check whether the arms are held on the wall after settling and whether the coupled neck contact removes energy the generators spread to the arms", "status": "verified", "evidence": "Not a free-body effect: generator cycle (active 0-30 s, recovery tau_rec 107 s, active again from about 165 s) plus 180 s recordings that miss the second episode; pinned at 180 s shows the same 0% general movements. At equal length (240 s) the free body gives general movements 4.8-16.4% (pinned 4.6-11.2%), RESULT_PATH_STEPS_1_2.md section 19.", "touched": "2026-11-14", "note": ""}
---

Free body with coupled wall contact suppresses arm movements (2026-11-14, section 18): isolated arm movements 0 per h and general movements 0% on seeds 7-9 (pinned 20-60 per h and 4.6-11.2%; source 6-104 per h and 6-18%); the touch reading rose to 0.117-0.184. Cause not found.

Why it matters: the free body is now the recording default; movement counts cannot be read until this is explained.

To resolve: compare per-part joint speed and travel, pinned against free, same seeds; check whether the arms are held on the wall after settling and whether the coupled neck contact removes energy the generators spread to the arms.

Status: verified; priority: P1; category: M.

Evidence so far: Not a free-body effect: generator cycle (active 0-30 s, recovery tau_rec 107 s, active again from about 165 s) plus 180 s recordings that miss the second episode; pinned at 180 s shows the same 0% general movements. At equal length (240 s) the free body gives general movements 4.8-16.4% (pinned 4.6-11.2%), RESULT_PATH_STEPS_1_2.md section 19.
