---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "0c6f646c-d9e3-72dd-b3dd-b92370800012"
dg_type: "Issue"
dg_name: "M-105"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 233
data: {"id": "M-105", "category": "M", "priority": "P2", "ref": "tools/trusoma/brain/body7.py:_root_init", "item": "Free-body joins unsourced (M-104, 2026-11-14): J-FB1 whole fetus as its equal-volume sphere for drag and added mass; J-FB2 rotational drag area shared by volume^(2/3); J-FB3 limb momentum relative to the trunk and gyroscopic term neglected; J-FB4 joint net-weight torque kept as on a supported trunk; J-FB5 head/trunk wall contact rigid on the root, inelastic; J-FB6 maternal posture and side drawn uniform per recording (presentation by breech_probability).", "why": "each changes how the free body moves; none is read from a source", "resolve": "a fetal or fluid-dynamics source for each, or a measured fetal whole-body motion to fit against (e.g. fetal rotations per hour)", "status": "in-progress", "evidence": "2026-11-14: J-FB5 replaced: head, chin and lower-trunk wall contacts are now solved together over the root velocity AND the joints that carry them (neck, jaw, spine), with the joints' own inertias, by the limb rows' least-distance solver; inelastic; depth pushed out by position at PEN_CORR per step. The first two versions failed: full-depth position jumps made the joints jitter and the body roll 160+ degrees in 20 s; velocity-level push-out pumped energy from the neck into the root until it diverged at 2.5 s. The coupled version on seed 7 (90 s) rolls once to about 70 degrees by 40 s and rests; any part moving 13% of the last 30 s (pinned 44%).", "touched": "2026-11-14", "note": ""}
---

Free-body joins unsourced (M-104, 2026-11-14): J-FB1 whole fetus as its equal-volume sphere for drag and added mass; J-FB2 rotational drag area shared by volume^(2/3); J-FB3 limb momentum relative to the trunk and gyroscopic term neglected; J-FB4 joint net-weight torque kept as on a supported trunk; J-FB5 head/trunk wall contact rigid on the root, inelastic; J-FB6 maternal posture and side drawn uniform per recording (presentation by breech_probability).

Why it matters: each changes how the free body moves; none is read from a source.

To resolve: a fetal or fluid-dynamics source for each, or a measured fetal whole-body motion to fit against (e.g. fetal rotations per hour).

Status: in-progress; priority: P2; category: M.

Evidence so far: 2026-11-14: J-FB5 replaced: head, chin and lower-trunk wall contacts are now solved together over the root velocity AND the joints that carry them (neck, jaw, spine), with the joints' own inertias, by the limb rows' least-distance solver; inelastic; depth pushed out by position at PEN_CORR per step. The first two versions failed: full-depth position jumps made the joints jitter and the body roll 160+ degrees in 20 s; velocity-level push-out pumped energy from the neck into the root until it diverged at 2.5 s. The coupled version on seed 7 (90 s) rolls once to about 70 degrees by 40 s and rests; any part moving 13% of the last 30 s (pinned 44%).
