---
nodeTypeId: "node_LwROzkVH_Zck7ZxDgN91E"
nodeInstanceId: "4e73e706-2b68-73c1-a5b7-58d5a92eb665"
dg_type: "Claim"
dg_name: "m.brainstem.depression.pmc6772224"
record_file: "companion/source_audit/sourcing_records.jsonl"
code: "records"
order: 401
fmt: "compact"
data: {"kind": "value", "id": "m.brainstem.depression.pmc6772224", "part": "brainstem", "quantity": "brainstem generator depression and per-synapse delay", "value": {"brainstem_s2.tau_dep_s": 30.0}, "unit": "s / rate fraction / ms", "paper_id": "p-pmc6772224", "locator": "companion/source_audit/batch_2026-11-05_values/BRAINSTEM_TABAK.md", "species": "chick embryo E9-11 isolated spinal cord, 26-28 C; Q10 from neonatal mouse (P2-4) spinal cord", "limit": "chick embryo cord at 26-28 C -> human fetal brainstem generator at 37 C (species, temperature via the tau_rec Q10); Tabak's single tau_s serves depletion and recovery, popnet splits them: recovery 107 s (Tabak 2001), depletion 30 s inside the tau_s range (value kept)", "state": "read by the lead"}
kind: "value"
source: "[[@Tabak J, Senn W, O'Donovan MJ, Rinzel J. Modeling of spontaneous activity in developing spinal cord using activity-dependent … (p-pmc6772224)]]"
---

brainstem generator depression and per-synapse delay.

Value record `m.brainstem.depression.pmc6772224`, part: brainstem.

Value: {"brainstem_s2.tau_dep_s": 30.0} (s / rate fraction / ms).

Where in the source: companion/source_audit/batch_2026-11-05_values/BRAINSTEM_TABAK.md.

Species and age: chick embryo E9-11 isolated spinal cord, 26-28 C; Q10 from neonatal mouse (P2-4) spinal cord.

Limit: chick embryo cord at 26-28 C -> human fetal brainstem generator at 37 C (species, temperature via the tau_rec Q10); Tabak's single tau_s serves depletion and recovery, popnet splits them: recovery 107 s (Tabak 2001), depletion 30 s inside the tau_s range (value kept).

State: read by the lead.

Source: [[@Tabak J, Senn W, O'Donovan MJ, Rinzel J. Modeling of spontaneous activity in developing spinal cord using activity-dependent … (p-pmc6772224)]].
