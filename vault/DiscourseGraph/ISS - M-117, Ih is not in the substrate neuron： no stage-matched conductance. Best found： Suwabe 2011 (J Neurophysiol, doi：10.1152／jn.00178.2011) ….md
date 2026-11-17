---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "7ad5b636-1f99-7098-9213-5bdf18e0b737"
dg_type: "Issue"
dg_name: "M-117"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 251
data: {"id": "M-117", "category": "M", "priority": "P2", "ref": "tools/trusoma/brain/substrate.py", "item": "Ih is not in the substrate neuron: no stage-matched conductance. Best found: Suwabe 2011 (J Neurophysiol, doi:10.1152/jn.00178.2011) embryonic rat solitary-tract relay E14/16 Ih 12 +/- 3 pA, 31 +/- 1 pF (Table 1), step voltage not stated, no stage-matched reversal (Bayliss 1994 reversal is adult, excluded)", "why": "RS1 lists Ih as a resonance capability; resonance is core (USER 2026-11-14)", "resolve": "find an embryonic or neonatal brainstem Ih reversal or a conductance (nS) at a stated voltage; then add I_h = g_h m_h (V - E_h) with the bound Vasilyev 2002 activation", "status": "verified", "evidence": "Takahashi 1990 J Physiol 423:47 (doi:10.1113/jphysiol.1990.sp018010) scanned full text pages 49, 55, 60 read from page images 2026-11-14: E_h -43.8 mV, chord 0.8 nS at -100 mV, Vh -95 mV, k 13.5 mV, tau 2.4 s at -100 mV (22-24 C); bound phase1_substrate K16; Ih added to substrate.SubstrateNeuron (always on); test_rs1_ih_sag: sag 1.79 mV vs 0.13 without (pre-registered 2 mV missed, recorded); Table 1 burster types kept with Ih on", "touched": "2026-11-14", "note": ""}
---

Ih is not in the substrate neuron: no stage-matched conductance. Best found: Suwabe 2011 (J Neurophysiol, doi:10.1152/jn.00178.2011) embryonic rat solitary-tract relay E14/16 Ih 12 +/- 3 pA, 31 +/- 1 pF (Table 1), step voltage not stated, no stage-matched reversal (Bayliss 1994 reversal is adult, excluded).

Why it matters: RS1 lists Ih as a resonance capability; resonance is core (USER 2026-11-14).

To resolve: find an embryonic or neonatal brainstem Ih reversal or a conductance (nS) at a stated voltage; then add I_h = g_h m_h (V - E_h) with the bound Vasilyev 2002 activation.

Status: verified; priority: P2; category: M.

Evidence so far: Takahashi 1990 J Physiol 423:47 (doi:10.1113/jphysiol.1990.sp018010) scanned full text pages 49, 55, 60 read from page images 2026-11-14: E_h -43.8 mV, chord 0.8 nS at -100 mV, Vh -95 mV, k 13.5 mV, tau 2.4 s at -100 mV (22-24 C); bound phase1_substrate K16; Ih added to substrate.SubstrateNeuron (always on); test_rs1_ih_sag: sag 1.79 mV vs 0.13 without (pre-registered 2 mV missed, recorded); Table 1 burster types kept with Ih on.
