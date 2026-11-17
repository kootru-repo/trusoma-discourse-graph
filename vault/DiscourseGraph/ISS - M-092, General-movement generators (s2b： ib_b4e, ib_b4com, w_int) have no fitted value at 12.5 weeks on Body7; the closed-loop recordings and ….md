---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "3bf70787-7cc9-723a-b5f5-57ca2ddd5a69"
dg_type: "Issue"
dg_name: "M-092"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 216
data: {"id": "M-092", "category": "M", "priority": "P1", "ref": "companion/audit_log/verification/research_grade_2026-11-09/RESULT_PATH_STEPS_1_2.md", "item": "General-movement generators (s2b: ib_b4e, ib_b4com, w_int) have no fitted value at 12.5 weeks on Body7; the closed-loop recordings and both 2026-11-08 sensitivity probes ran without them, so the limbs do not move (joint spread under 1 degree) and the hand touches nothing", "why": "Path plan step 2: no recording shows the body's own movement until they are fitted", "resolve": "Fit at 12.5 weeks against de Vries 1985 movement counts (BRAINSTEM_APPENDIX_A B4 rows); hand-face contact per hour as validation only; then re-record", "status": "in-progress", "evidence": "2026-11-11 fit A (ib_b4com -1.36, ib_b4e -0.24, w_int 1.11), not bound. 300 s seeds 4-6: general movement 9.7-12.0% of time; 240 s seeds 7-9 with skin: 13.5-14.6% (source medians 11.5-12.5, range 6-18). Hand-face contacts 0 per h on all 6 seeds, least gap 1.1-3.1 mm (source median 21-23.5 per h; validation class). Isolated counts unread at these lengths. Touch re-recorded: RESULT_PATH_STEPS_1_2.md section 5. Open: hand-face contact; bind with a sourcing record.", "touched": "2026-11-11", "note": ""}
---

General-movement generators (s2b: ib_b4e, ib_b4com, w_int) have no fitted value at 12.5 weeks on Body7; the closed-loop recordings and both 2026-11-08 sensitivity probes ran without them, so the limbs do not move (joint spread under 1 degree) and the hand touches nothing.

Why it matters: Path plan step 2: no recording shows the body's own movement until they are fitted.

To resolve: Fit at 12.5 weeks against de Vries 1985 movement counts (BRAINSTEM_APPENDIX_A B4 rows); hand-face contact per hour as validation only; then re-record.

Status: in-progress; priority: P1; category: M.

Evidence so far: 2026-11-11 fit A (ib_b4com -1.36, ib_b4e -0.24, w_int 1.11), not bound. 300 s seeds 4-6: general movement 9.7-12.0% of time; 240 s seeds 7-9 with skin: 13.5-14.6% (source medians 11.5-12.5, range 6-18). Hand-face contacts 0 per h on all 6 seeds, least gap 1.1-3.1 mm (source median 21-23.5 per h; validation class). Isolated counts unread at these lengths. Touch re-recorded: RESULT_PATH_STEPS_1_2.md section 5. Open: hand-face contact; bind with a sourcing record.
