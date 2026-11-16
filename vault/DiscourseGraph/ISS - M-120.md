---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "1ef699a1-8250-70fa-8428-f4cf91427e39"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 254
data: {"id": "M-120", "category": "M", "priority": "P1", "ref": "tools/trusoma/brain/body7.py _root_step", "item": "Free body (M-104) diverges under sustained twitch drive at 17 weeks: in TR13d one of three bodies reached root position 1e104 mm at epoch 1,219 (about 307 s), joint speed 263 rad/s, then math domain error in _root_step (seed 3 of twitch_worker.py; deterministic)", "why": "every closed-loop test at 14-17 weeks uses the free body; a silent blow-up before the crash would corrupt recordings", "resolve": "find the onset in run 4's per-epoch root record; fix the cause in the coupled root contact; add a finite-state check so a diverging body stops with a report", "status": "verified", "evidence": "Fix in commit 44573b7 (split parts keep the undivided push-out speed; wall impulse per row uses its own interval length; cause and replay in m120_repro3.log). Confirmed over long streams on 2026-11-15: TR13f batch 2 (seeds 4-6) and the seed 3 re-run, four streams of 1,667 epochs each (552 ms per epoch) with no body failure; seed 3 had diverged at epoch 92 on the unfixed body (tr13f_b1.log). test_free7 FT1-FT5 pass, provenance 245635, isolation passes.", "touched": "2026-11-15", "note": ""}
---
