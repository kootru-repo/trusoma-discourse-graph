---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "b81f28df-a9ee-7a07-9e18-8cba048706ef"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 174
data: {"id": "F-015", "category": "F", "priority": "P2", "ref": "companion/source_audit/batch_2026-11-04_undone/res_brainstem_lead.jsonl", "item": "Brainstem GABA polarity ends at a full sign reversal; Allain 2011 reports mouse motoneurons shift to shunting, still depolarizing, after E15.5", "why": "Direction sourced in mouse, end state differs, human timing not computed", "resolve": "Find human brainstem chloride reversal or KCC2 timing; decide if the end state should be shunting", "status": "in-progress", "evidence": "Earlier: direction from Allain 2011, mouse. Wu 2026 cites the GABA transition at 16-18 weeks from the Tyzio group, secondary, not read at source; if it applies to the human brainstem, our model's polarity at 12.5 weeks should still be depolarizing. 2026-11-04: Delpy 2008, Ren and Greer 2006, Sedmak 2016 and Broadbelt 2010 read; numbers in LIKELY_SOURCEABLE.md brainstem section. End state: rat medulla hyperpolarizing by P1 at 3 mM K+ (E_gly -64.2 against rest -58.8); mouse motoneuron E_Cl equals rest at P0 (-70.2), shunting. Human brainstem polarity still unmeasured. Start-state problem is M-071.", "touched": "2026-11-04", "note": ""}
---
