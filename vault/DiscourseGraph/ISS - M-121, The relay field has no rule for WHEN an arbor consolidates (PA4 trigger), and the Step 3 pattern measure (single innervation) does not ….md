---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "7f5820c8-b55e-724d-a8c2-fab60ec55f3a"
dg_type: "Issue"
dg_name: "M-121"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 255
data: {"id": "M-121", "category": "M", "priority": "P1", "ref": "tools/trusoma/brain/relay_map.py RelayField (PA4)", "item": "The relay field has no rule for WHEN an arbor consolidates (PA4 trigger), and the Step 3 pattern measure (single innervation) does not match what the sources measured (patch segregation between parts). Step 3 probe 2026-11-15: TR5, TR10, TR3/TR4 fail, TR6 not runnable, TR11 only by construction (RESULT_STEP3_RELAY_2026-11-15.md).", "why": "Without a consolidation trigger a late lesion acts like an early one and NMDA loss cannot be tested; without a matched measure TR5 and TR10 test nothing.", "resolve": "Source the consolidation trigger (NMDA-dependent, fetal or neonatal trigeminal) and the patch measure from Waite 2000, Henderson 1994, Chiaia 1992 and Lee 2005 full texts; bind, then re-register TR3-TR6 and TR10. Reach beyond the part stays with M-116.", "status": "blocked", "evidence": "Sourcing pass 2026-11-15 (RELAY_CONSOLIDATION_SOURCING_2026-11-15.md): pattern measure found (CO patch area; Chiaia 1992 20.1-36.9% = remaining patch area at P5-7; Lo 2011 convergence 3-6 fibres per PrV neuron, 4.67 at P1-P3, 3.00 at P7-P13); no consolidation rule and no text-stated arbor reach found. TR5b on the matched measure (relay_convergence_result.json, seeds 6-10): 3.2 at 216 h, 2.4 at 408 h, pass at the lower edge. Open: consolidation trigger source; patch-area read-out between parts; Chiaia 1994 and Waite 2000 read as abstracts only.", "touched": "2026-11-15", "note": "2026-11-15: PA4 consolidation rule built (RelayField.consolidate) with direction tests TR6 and TR3/TR4 that hold for any AMPA increment; the trigger magnitude and timing, arbor extension and reach remain unsourced."}
---

The relay field has no rule for WHEN an arbor consolidates (PA4 trigger), and the Step 3 pattern measure (single innervation) does not match what the sources measured (patch segregation between parts). Step 3 probe 2026-11-15: TR5, TR10, TR3/TR4 fail, TR6 not runnable, TR11 only by construction (RESULT_STEP3_RELAY_2026-11-15.md).

Why it matters: Without a consolidation trigger a late lesion acts like an early one and NMDA loss cannot be tested; without a matched measure TR5 and TR10 test nothing.

To resolve: Source the consolidation trigger (NMDA-dependent, fetal or neonatal trigeminal) and the patch measure from Waite 2000, Henderson 1994, Chiaia 1992 and Lee 2005 full texts; bind, then re-register TR3-TR6 and TR10. Reach beyond the part stays with M-116.

Status: blocked; priority: P1; category: M.

Evidence so far: Sourcing pass 2026-11-15 (RELAY_CONSOLIDATION_SOURCING_2026-11-15.md): pattern measure found (CO patch area; Chiaia 1992 20.1-36.9% = remaining patch area at P5-7; Lo 2011 convergence 3-6 fibres per PrV neuron, 4.67 at P1-P3, 3.00 at P7-P13); no consolidation rule and no text-stated arbor reach found. TR5b on the matched measure (relay_convergence_result.json, seeds 6-10): 3.2 at 216 h, 2.4 at 408 h, pass at the lower edge. Open: consolidation trigger source; patch-area read-out between parts; Chiaia 1994 and Waite 2000 read as abstracts only.

Note: 2026-11-15: PA4 consolidation rule built (RelayField.consolidate) with direction tests TR6 and TR3/TR4 that hold for any AMPA increment; the trigger magnitude and timing, arbor extension and reach remain unsourced.
