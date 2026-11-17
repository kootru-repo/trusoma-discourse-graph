---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "bcc3cc5f-1c53-73d6-b64c-8a5869675b58"
dg_type: "Issue"
dg_name: "C-003"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 54
data: {"id": "C-003", "category": "C", "priority": "P2", "ref": "tools/trusoma/brain/*.py (115 call sites)", "item": "randomness: rand/randn/poisson/binomial/normal/Generator/manual_seed; none carries a same-line level tag", "why": "each draw should map to a harnessed-variability level (N1) or be declared noise", "resolve": "Tag each site with its level (L0 membrane noise ... L5 cell variation) or declare it; consider a static rule that requires the tag", "status": "declared", "evidence": "c1m 9d193cc: 68 randomness sites in tools/trusoma/brain tagged '# rng: <level>' (L0 receptor/channel, L1 neuron, L2 synapse population, L4 map, L5 behaviour, or instrument), comments only; the rest of the 78 grep hits are docstrings or seed-only lines. A static rule requiring the tag is not added. 2026-10-30", "touched": "2026-10-30", "note": ""}
---

randomness: rand/randn/poisson/binomial/normal/Generator/manual_seed; none carries a same-line level tag.

Why it matters: each draw should map to a harnessed-variability level (N1) or be declared noise.

To resolve: Tag each site with its level (L0 membrane noise ... L5 cell variation) or declare it; consider a static rule that requires the tag.

Status: declared; priority: P2; category: C.

Evidence so far: c1m 9d193cc: 68 randomness sites in tools/trusoma/brain tagged '# rng: <level>' (L0 receptor/channel, L1 neuron, L2 synapse population, L4 map, L5 behaviour, or instrument), comments only; the rest of the 78 grep hits are docstrings or seed-only lines. A static rule requiring the tag is not added. 2026-10-30.
