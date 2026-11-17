---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "06a8eb18-2dfa-7148-a1d1-49739f0251a5"
dg_type: "Issue"
dg_name: "M-111"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 244
data: {"id": "M-111", "category": "M", "priority": "P1", "ref": "tools/trusoma/brain/brainstem_s2.py", "item": "No fetal breathing or hiccup movements in the model (found 2026-11-14): no breathing or hiccup generator in the brainstem and no chest or diaphragm DOF in Body7. Human fetal breathing movements run from about 10 weeks with a preferred interval of 2-3 s, hiccups every 1-3 s (de Vries 1985, doi:10.1016/0378-3782(85)90174-4); a brainstem breathing rhythm generator starts at mouse E15 = 12.5 weeks (Thoby-Brisson 2005, doi:10.1523/jneurosci.0551-05.2005; embryonic pacemaker currents: Chevalier 2016, doi:10.7554/elife.16125).", "why": "the learner design (RESONANT_LEARNER_DESIGN_V3.md section 3) takes the body's rhythms as the harmonic drive; the best-sourced rhythm at the stage is absent", "resolve": "source fetal breathing movement kinematics (chest and abdominal wall excursion, diaphragm) and rate at 10-13 weeks, add a breathing DOF to the body and a sourced embryonic rhythm generator to the brainstem; check the rate against de Vries 1985", "status": "in-progress", "evidence": "Proposal written 2026-11-14 (design v3 section 3c): breathing DOF (chest and abdominal wall excursion) plus a brainstem rhythm generator outside the learner (form from Thoby-Brisson 2005, Chevalier 2016), hiccups as recurring events; tests against de Vries 1985 intervals; values pending the gap-solutions research.", "touched": "2026-11-14", "note": ""}
---

No fetal breathing or hiccup movements in the model (found 2026-11-14): no breathing or hiccup generator in the brainstem and no chest or diaphragm DOF in Body7. Human fetal breathing movements run from about 10 weeks with a preferred interval of 2-3 s, hiccups every 1-3 s (de Vries 1985, doi:10.1016/0378-3782(85)90174-4); a brainstem breathing rhythm generator starts at mouse E15 = 12.5 weeks (Thoby-Brisson 2005, doi:10.1523/jneurosci.0551-05.2005; embryonic pacemaker currents: Chevalier 2016, doi:10.7554/elife.16125).

Why it matters: the learner design (RESONANT_LEARNER_DESIGN_V3.md section 3) takes the body's rhythms as the harmonic drive; the best-sourced rhythm at the stage is absent.

To resolve: source fetal breathing movement kinematics (chest and abdominal wall excursion, diaphragm) and rate at 10-13 weeks, add a breathing DOF to the body and a sourced embryonic rhythm generator to the brainstem; check the rate against de Vries 1985.

Status: in-progress; priority: P1; category: M.

Evidence so far: Proposal written 2026-11-14 (design v3 section 3c): breathing DOF (chest and abdominal wall excursion) plus a brainstem rhythm generator outside the learner (form from Thoby-Brisson 2005, Chevalier 2016), hiccups as recurring events; tests against de Vries 1985 intervals; values pending the gap-solutions research.
