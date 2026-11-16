---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "ce242c20-8f96-783f-8153-6e6ee9485c6d"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 173
data: {"id": "F-014", "category": "F", "priority": "P2", "ref": "companion/source_audit/batch_2026-11-04_undone/res_brainstem_lead.jsonl", "item": "Membrane time constant 60 ms at the early age point looks too long: Wu 2026 capacitance 14.1 pF x Tadros 2015 input resistance 795 Mohm gives about 11 ms", "why": "My derivation across two regions and temperatures; a bound, not a measurement", "resolve": "Read tau and input resistance in Wu 2026 Fig. 2G/H (on the USER prompt sheet), then compare; report, and change only with a sourced value", "status": "revised", "evidence": "RETRACTED 2026-11-04. Wu 2026 Fig. 2 measures the time constant directly: peaks midbrain 41 and pons 78 ms at GW10, 31 and 59 ms at GW13.5, 18 and 29 ms at GW17, at 28 C. Our 60 ms at 12.5 weeks lies within them, at the pons value, twice midbrain. My 11 ms used input resistance x capacitance, which is 6-8 times below the measured value in Wu's own data. Remaining doubts: our single value hides a twofold region difference, and our line falls too slowly, 54.8 ms at 17 wk against 18-29; this is past Phase 1.", "touched": "2026-11-04", "note": ""}
---
