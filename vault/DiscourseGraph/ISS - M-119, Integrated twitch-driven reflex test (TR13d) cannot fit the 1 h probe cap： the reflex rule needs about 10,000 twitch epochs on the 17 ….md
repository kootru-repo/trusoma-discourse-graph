---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "7a24ce27-9b27-78f7-a1c5-3b583405fdbd"
dg_type: "Issue"
dg_name: "M-119"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 253
data: {"id": "M-119", "category": "M", "priority": "P1", "ref": "tools/trusoma/brain/body7.py", "item": "Integrated twitch-driven reflex test (TR13d) cannot fit the 1 h probe cap: the reflex rule needs about 10,000 twitch epochs on the 17 week body (offline median r 0.005/0.022/0.057/0.182/0.905 at 300/600/1200/2500/10000 epochs), i.e. about 2.5 M body steps at 6.7 ms (17 weeks, free body with contact; skin 0.5 ms) = about 4.7 h", "why": "Part B can only be tested in the moving body if the body steps several times faster or the USER allows a longer chunked run", "resolve": "move the free-body path (gravity_torque, root contacts, _contacts_oral) to the numba mirror body7_nb or vectorise it exactly (profile 2026-11-14: _contacts_oral 1.5 s, gravity_torque 1.2 s per 500 steps), keeping the 12.5 digest; then run TR13d", "status": "in-progress", "evidence": "2026-11-14: compiled contact kernel evaluates the scan face and chin (commit 9a37a8a): 17 week free body 9.9 -> 2.6 ms/step, rounding-level; TR13d (10,000 twitch epochs over three parallel bodies, about 36 min) launched", "touched": "2026-11-14", "note": ""}
---

Integrated twitch-driven reflex test (TR13d) cannot fit the 1 h probe cap: the reflex rule needs about 10,000 twitch epochs on the 17 week body (offline median r 0.005/0.022/0.057/0.182/0.905 at 300/600/1200/2500/10000 epochs), i.e. about 2.5 M body steps at 6.7 ms (17 weeks, free body with contact; skin 0.5 ms) = about 4.7 h.

Why it matters: Part B can only be tested in the moving body if the body steps several times faster or the USER allows a longer chunked run.

To resolve: move the free-body path (gravity_torque, root contacts, _contacts_oral) to the numba mirror body7_nb or vectorise it exactly (profile 2026-11-14: _contacts_oral 1.5 s, gravity_torque 1.2 s per 500 steps), keeping the 12.5 digest; then run TR13d.

Status: in-progress; priority: P1; category: M.

Evidence so far: 2026-11-14: compiled contact kernel evaluates the scan face and chin (commit 9a37a8a): 17 week free body 9.9 -> 2.6 ms/step, rounding-level; TR13d (10,000 twitch epochs over three parallel bodies, about 36 min) launched.
