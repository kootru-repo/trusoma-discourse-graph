---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "97a0a88f-b4bc-70dd-a4da-9a53bffb40cc"
dg_type: "Issue"
dg_name: "M-088"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 201
data: {"id": "M-088", "category": "M", "priority": "P3", "ref": "companion/source_audit/batch_2026-11-05_values/BODY_STATUS.md", "item": "Brainstem generator depletion terms (TAU_DEP_S 30 s, TH_DEP 0.5, K_DEP 0.05) unsourced; Tabak 2000 s-model (J Neurosci 20:3041, PMC6772224, Table 1) gives theta_s 0.14, k_s 0.02 and ONE time constant for depletion and recovery, in a different equation form (tau_s ds/dt = s_inf(a) - s) from popnet's (separate tau_rec and tau_dep with h(e))", "why": "A direct copy is not a transfer: the forms differ, and the values would retune the generator", "resolve": "Derive the popnet tuple that reproduces Tabak's s_inf and tau_s (steady state and effective time constant), then run the 15 s loop; brain-lane change, so its own probe", "status": "open", "evidence": "", "touched": "2026-11-06", "note": ""}
---

Brainstem generator depletion terms (TAU_DEP_S 30 s, TH_DEP 0.5, K_DEP 0.05) unsourced; Tabak 2000 s-model (J Neurosci 20:3041, PMC6772224, Table 1) gives theta_s 0.14, k_s 0.02 and ONE time constant for depletion and recovery, in a different equation form (tau_s ds/dt = s_inf(a) - s) from popnet's (separate tau_rec and tau_dep with h(e)).

Why it matters: A direct copy is not a transfer: the forms differ, and the values would retune the generator.

To resolve: Derive the popnet tuple that reproduces Tabak's s_inf and tau_s (steady state and effective time constant), then run the 15 s loop; brain-lane change, so its own probe.

Status: open; priority: P3; category: M.
