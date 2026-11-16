"""One-time seed of the probe record as discourse notes (plan section 18, O2): Question, Hypothesis, Experiment, Result. After the seed the notes are the authored record; add later
ones with `value_add.py discourse`. Every note names its record file and quotes it verbatim (the validator refuses a quote that is not in the file), so nothing here is written
from memory. `prereg` is true only where the record itself says the criterion was written before the reading. `counted` is false for every probe reading and exploratory run.
usage: python seed_discourse.py"""
import dmlib as D

P = "companion/TRUSOMA_PROBES.md"
C = "companion/RESONANT_BUILD_CHECKLIST_2026-11-15.md"
L = lambda kind, *names: [D.link(kind, n) for n in names]
S = "phase1_substrate."

QUESTIONS = [
    ("sparse afferents alive and selective", P, "Do sparse afferents stay alive and selective on simple input?", {}),
    ("orientation reaches spikes with sparse afferents", P, "Does orientation survive to spikes with sparse afferents?", {}),
    ("body map in the afferent weights", P, "Is there a body map in the afferent weights?", {}),
    ("why learned placement does worse than random", P, "Why learned placement does worse than random is unknown.", {}),
]
HYPOTHESES = [   # name, record, quote (the criterion), prereg, extra
    ("probe 1b sparse afferents criterion", P, "Rate at least 10 % of untrained and under 45 Hz; S_cv and C above shuffled on all seeds; S_cv above untrained", True,
     {"question": D.link("Question", "sparse afferents alive and selective")}),
    ("probe 2b orientation criterion", P, "Error below shuffled and untrained on all seeds", True, {"question": D.link("Question", "orientation reaches spikes with sparse afferents")}),
    ("probe 5 body map criterion", P, "per_column above shuffled and untrained on all seeds", True, {"question": D.link("Question", "body map in the afferent weights")}),
    ("strongest afferents sit closer on the skin (post hoc)", P, "Each unit's 10 strongest afferents sit 7-8% closer on the skin than its own wiring gives by chance on all three kept checkpoints", False,
     {"question": D.link("Question", "body map in the afferent weights")}),
    ("S2 NMDA share and excitatory GABA-A", C, "S2 test: NMDA about 75% of the relay response, excitatory GABA-A", False, {"informed_by": L("Claim", S + "NMDA_SHARE_E16", S + "EGABA_MV")}),
    ("TR9 dynamic Ih against a static conductance", C, "Ih replaced by a static conductance with the same steady-state I-V curve", False, {"informed_by": L("Claim", S + "IH_TAU_MS", S + "IH_VHALF_MV")}),
    ("TR8 synaptic filter direction", C, "depressing synapses lose efficacy with spike rate, facilitating ones gain", False, {"informed_by": L("Claim", S + "STP_TAU_FACIL_MS", S + "STP_P_FAST")}),
    ("S1 collaterals entered and branched, no patches at 12.5 weeks", C, "S1 test: collaterals entered and branched, no patches at 12.5 weeks", False, {}),
    ("S4 arm-movement interval about 1 s", C, "S4 test: arm-movement interval about 1 s", False, {}),
    ("TR12 yoke learning", C, "TR12 yoke learning, R5 comparison", False, {"issues": L("Issue", "M-123")}),
    ("PB1 PB2 TR13 plastic relay-to-motor synapses and reflex rule", C, "PB1 plastic relay-to-motor synapses, PB2 reflex rule, TR13", False, {"issues": L("Issue", "M-122", "M-118")}),
    ("resonance read-out of a body map", C, "Resonance read-out of a body map (the learner's endpoint)", False,
     {"question": D.link("Question", "body map in the afferent weights"), "issues": L("Issue", "M-121", "M-123")}),
]
H = lambda *n: L("Hypothesis", *n)
EXPERIMENTS = [   # name, record, quote, date, extra
    ("probe 1 existing checkpoints 2026-11-03", P, "Scoring took 7 minutes (14:12:30 to 14:19:23)", "2026-11-03",
     {"hypotheses": H("probe 1b sparse afferents criterion", "probe 2b orientation criterion", "probe 5 body map criterion")}),
    ("probe 5 noise check 2026-11-03", P, "`probe5_noise.py` with 20 shuffles per seed", "2026-11-03", {"hypotheses": H("probe 5 body map criterion")}),
    ("growth by division probe 2026-11-04", P, "a learner that doubles twice by division", "2026-11-04", {}),
    ("scorer positive control 2026-11-09", P, "No learner ran; 52 s.", "2026-11-09", {"hypotheses": H("probe 5 body map criterion")}),
    ("the body's own touch 2026-11-09", P, "180 simulated seconds, 3 brainstem seeds, 860-1060 s of wall time each", "2026-11-09", {}),
    ("test rs3 s2 gaba and nmda share e4707cd", C, "DONE e4707cd: test_rs3_s2_gaba_and_nmda_share", "2026-11-15", {"hypotheses": H("S2 NMDA share and excitatory GABA-A"), "commit": "e4707cd"}),
    ("test tr9 static ih e4707cd", C, "DONE e4707cd: test_tr9_static_ih_same_steady_state", "2026-11-15", {"hypotheses": H("TR9 dynamic Ih against a static conductance"), "commit": "e4707cd"}),
    ("test tr8 synaptic filter e4707cd", C, "DONE e4707cd: test_tr8_synaptic_filter_direction", "2026-11-15", {"hypotheses": H("TR8 synaptic filter direction"), "commit": "e4707cd"}),
    ("S1 relay field run 2026-11-15", C, "RESULT_S1_2026-11-15.md", "2026-11-15", {"hypotheses": H("S1 collaterals entered and branched, no patches at 12.5 weeks")}),
    ("yoke compressed baseline 2026-11-15", C, "RESULT_YOKE_BASELINE_2026-11-15.md", "2026-11-15", {}),
    ("step 3 relay probes TR3-TR6 TR10 TR11", C, "RESULT_STEP3_RELAY_2026-11-15.md; M-121", "2026-11-15", {"issues": L("Issue", "M-121")}),
    ("S4 recorded closed-loop runs", C, "passes in the recorded closed-loop runs; not a unit test", "2026-11-15", {"hypotheses": H("S4 arm-movement interval about 1 s")}),
]
E = lambda n: D.link("Experiment", n)
RESULTS = [   # name, record, quote, reading, counted, experiment, extra
    ("probe 1b S_cv signal", P, "| 1b S_cv | **Signal** | 0.989-0.992 | 0.375-0.400 | 0.207-0.216 | Not applicable |", "signal", False, "probe 1 existing checkpoints 2026-11-03",
     {"consistent_with": H("probe 1b sparse afferents criterion")}),
    ("probe 2b orientation no signal", P, "| 2b error, degrees | **No signal** | 9.6-11.4 | 6.4-6.9 | 25.4-28.0 | raw_matched 2.6-2.8 |", "no-signal", False, "probe 1 existing checkpoints 2026-11-03", {}),
    ("probe 5 per_column no signal", P, "| 5 per_column | **No signal** at 900 of 2000 | 0.0046-0.0053 |", "no-signal", False, "probe 1 existing checkpoints 2026-11-03", {}),
    ("probe 5 learned inside the shuffled range", P, "puts learned at z 1.0-1.3 and inside the shuffled range on every seed", "no-signal", False, "probe 5 noise check 2026-11-03", {}),
    ("growth by division no better map", P, "No signal: a learner that doubles twice by division forms no better map than the fixed learner", "no-signal", False, "growth by division probe 2026-11-04", {}),
    ("stage 5 scorer is not blind", P, "scores `per_column` 0.110 against 0.003 shuffled", "pass", False, "scorer positive control 2026-11-09", {}),
    ("strongest afferents closer on the skin (exploratory)", P, "(z -5.8 to -9.8)", "signal", False, "scorer positive control 2026-11-09",
     {"consistent_with": H("strongest afferents sit closer on the skin (post hoc)")}),
    ("touch coverage 52-106 of 230 units", P, "**52-106 of 230 live skin units are ever touched.**", "observation", False, "the body's own touch 2026-11-09", {}),
    ("surface identity in the raw touch input", P, "same-surface partners 0.68-0.82 against 0.16-0.28 time-shuffled, on every seed", "signal", False, "the body's own touch 2026-11-09", {}),
    ("no neighbour order within a surface in raw touch", P, "**No signal for neighbour order within a surface** in the raw input", "no-signal", False, "the body's own touch 2026-11-09", {}),
    ("S2 recovers the bound share and the GABA-A sign", C, "recovers the bound share and the sign of the GABA-A effect; passes by construction of the bound values (stated in the test)", "pass", True,
     "test rs3 s2 gaba and nmda share e4707cd", {"consistent_with": H("S2 NMDA share and excitatory GABA-A"), "supports": L("Claim", S + "NMDA_SHARE_E16", S + "EGABA_MV"), "by_construction": True}),
    ("TR9 sag 1.79 against 0.16 mV", C, "(sag 1.79 vs 0.16 mV, same end voltage)", "pass", True, "test tr9 static ih e4707cd", {"consistent_with": H("TR9 dynamic Ih against a static conductance")}),
    ("TR8 filter direction holds", C, "direction holds for any U and f above 0", "pass", True, "test tr8 synaptic filter e4707cd", {"consistent_with": H("TR8 synaptic filter direction")}),
    ("S1 fails on 0 of 5 seeds", C, "0 of 5 seeds (40% of afferents lose every branch by E17)", "fail", False, "S1 relay field run 2026-11-15", {}),
    ("yoke baseline arms identical", C, "link holds in the closed loop (0.0000019 mm); arms identical at the pre-registered threshold; post-hoc low thresholds show no yoke effect", "no-signal", False,
     "yoke compressed baseline 2026-11-15", {}),
    ("step 3 relay probes failed or blocked", C, "DONE (run, failed or blocked)", "fail", False, "step 3 relay probes TR3-TR6 TR10 TR11", {}),
    ("S4 interval passes in closed-loop runs", C, "passes in the recorded closed-loop runs; not a unit test", "pass", False, "S4 recorded closed-loop runs", {"consistent_with": H("S4 arm-movement interval about 1 s")}),
]


def main():
    n = 0
    for name, rec, quote, extra in QUESTIONS:
        D.write_note_kind("Question", name, {"record": rec, "quote": quote, **extra}); n += 1
    for name, rec, quote, prereg, extra in HYPOTHESES:
        D.write_note_kind("Hypothesis", name, {"record": rec, "quote": quote, "prereg": prereg, **extra}); n += 1
    for name, rec, quote, date, extra in EXPERIMENTS:
        D.write_note_kind("Experiment", name, {"date": date, "record": rec, "quote": quote, **extra}); n += 1
    for name, rec, quote, reading, counted, exp, extra in RESULTS:
        D.write_note_kind("Result", name, {"reading": reading, "counted": counted, "record": rec, "quote": quote, "experiment": E(exp), **extra}); n += 1
    print("discourse notes written:", n)


if __name__ == "__main__":
    main()
