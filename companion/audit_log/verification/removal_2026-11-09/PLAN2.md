# Removal probe, chunk 2 (USER 2026-11-09: "Remove. Proceed until all are checked")

Fixed before the run. Ran without review under the 2026-10-22 ruling. A probe, a reading, not a proof.

**Code state.** After ce003be: emd_ms, tongue bio.fetal and act_ratio are removed. The new baselines and floors come from this code.

**Tests.** 48 single-value null forms (driver2.py `T`), each on seeds 1-3 unless stated:
- **CORD_FRAC** = 0 on new seeds 4-6, to confirm chunk 1 (it conflicts with the 2026-11-08 probe).
- **Tongue tissue:**
  - tongue_tan_delta = 0. Removing viscosity also leaves the eta frequency unused, since eta = tan_delta / (2 pi x eta).
  - pulp_g n0 = 0 and pulp_g n1 = 0. If both are removable, pulp_tau n0/n1 go too.
- **Popnet:** D_mat = 1.0; ou_tau_e = the sourced ou_tau_i, 21.9 ms.
- **Receptor noise:** skin_world sd = 0 and transduction sd = 0, separately.
- **Rest posture:** fingers left = right; pronation left = right.
- **Geometry and material merges** (values that had no null form in chunk 1):
  - curl n1 = n2
  - phalanx n0 = n1
  - pulp removed (bio.pulp_frac = 0; e_pulp, pulp_g and pulp_tau then unused)
  - rigid palate (e_palate = 1e9)
- **Joint limits:** each of the 10, removed one at a time (+-180 deg).
- **Moment fractions:** each of the 11 set to the sourced neck_flex 0.297.
- **Skin densities:** each of the 15 set to the shared median 87.9. ridge_upper and palate are already 87.9, so they cannot be tested alone; they go if the rest of the merge holds.

**Floors and baselines.** x1.001 on every tested key, one floor per seed (1-6). Baselines are rerun on each resume.

**Rule.** Unchanged from PLAN.md as amended. A value is REMOVABLE if no run refused or failed and no measure is changed. A measure is changed when its median over seeds exceeds 2 x the floor median AND, for pattern, where, structure and firing, also exceeds 0.05. The floor median is taken over all floor runs.

**Chunks.** Each run of the driver gets a deadline under one hour (resumable). Two workers; the driver waits while RAM is at 90% or more or commit charge at 94% or more.

**TH_DEP long-window check (dep_check.py).**
- One 60 s baseline run logging the depletion resource s and the populations' own rate e.
- In a 2 s smoke test, e already reached 0.98 and s was falling (0.981). Depletion does engage, on its 30 s time constant.
- If s falls well below 1 within 60 s, TH_DEP is needed and the chunk-1 REMOVABLE reading was a window artifact.

**Use.** REMOVABLE values are removed in code with a test of the change. Merges become one value. Multiple comparisons: with 48 tests, single borderline readings are expected; results are reported with their margins.

**TH_DEP result (dep_check_60s.jsonl, 60 s, seed 1).** The minimum of s over the 9 depressing populations:

| Time | s |
|---|---|
| 2 s | 0.98 |
| 5 s | 0.89 |
| 10 s | 0.76 |
| 20 s | 0.57 |
| 30 s | 0.47 |
| 40 s | 0.52 |
| 60 s | 0.49 |

After 30 s it cycles. Depletion roughly halves the generators' self-excitation, so **TH_DEP is NEEDED**. The chunk-1 REMOVABLE reading was a 10 s window artifact.

**Coverage result (coverage_60s.jsonl, 60 s, seed 1; recorded before chunk 2 finished).**
- **Tongue contact updates by class:** palate (1) 1725; floor (2) 14998; back (6) 14447; lips/front (4) 13183; walls (3) 17; thumb pulp (5) **0**.
- **Joints pressed against their limits:** neck_flex upper (0.0 deg margin), both thumbs lower (0.0), jaw_open upper and jaw_lat upper (0.0).
- **Joints far from their limits:** neck_flex lower 114 deg, fingers lower 40-51 deg, elbow lower 88-91 deg, sh_abd lower 45-79 deg.

**Reading rule added for zero or near-zero results (decided before the chunk 2 results were tallied).** A null form that changes nothing because its event never happens (a contact class or a limit never reached in 60 s) is **not exercised**, not REMOVABLE. Phase 1 brings the learner and hand-mouth contact, which will reach those states. Such values stay.
- REMOVABLE requires the event to occur and the null form to make no difference.
- Palate contact does occur, and a rigid palate changed nothing, so e_palate is REMOVABLE.
- e_pulp and bio.pulp_frac are read only by Tongue7.pressure(thumb=...), which no 12.5 code calls: contacts() passes no pulp thickness, so the live thumb is rigid. They are **unused by the 12.5 run**, and an audit item records the rigid live thumb.
