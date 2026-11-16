---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "c8f7d743-457c-70d8-ab38-ae2d83efc3c3"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 260
data: {"id": "L-060", "category": "L", "priority": "P2", "ref": "doi:10.1113/jphysiol.1997.sp021912; doi:10.1152/jn.1992.68.4.1373", "item": "T-type Ca2+ of developing relay neurons: partial. Neonatal rat P12-17 laterodorsal thalamus kinetics and inactivation (Tarasenko 1997, abstract), Coulter 1989 and Huguenard 1992 abstracts with ages unverified; no activation half-voltage, slope or conductance density; PrV has presence only (Lo 1999).", "why": "RS1 T-type current stays off until a developing-neuron parameter set exists.", "resolve": "Read the full texts of Tarasenko 1997 (and Huguenard 1992 ages) for activation V1/2, slope and current density; if found, build the T-type current with a test of the rebound burst (Lo 1999: Ni2+-sensitive rebound in interbarrelette cells).", "status": "verified", "evidence": "T-type found and built 2026-11-15: Coulter 1989 (PMC1189159, full text read, page 597 checked on the image; 2-25 day old Wistar rats, 23 C) gives the m3h gates, V1/2 and k of activation and inactivation and the time-constant ends; Tarasenko 1997 (PMC1159338, full text) cross-checks the kinetics in P12-P17 thalamus. Eleven values bound to phase1_substrate with [V] lines and source-basis rows (join J-RL14); SubstrateNeuron mT, hT; test_rs1_ttype_gates_and_rebound passes; provenance 245635, isolation passes. Conductance and reversal are caller inputs (no source); the activation Q10 values are recorded but not applied.", "touched": "2026-11-15", "note": ""}
---
