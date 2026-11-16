---
nodeTypeId: "trusoma-record"
nodeInstanceId: "b8db2efd-6a77-728b-bff1-5d2bdc699b82"
dg_type: "Record"
record_file: "tools/trusoma/brain/other_config.json"
code: "ocfg"
order: 3
group: "registry"
shape: "dictmap"
label: "s2a_frozen_biases"
data: {"value": {"status": "S2-T6 b_eff CALIBRATED 2026-10-10; stored I_b REVISED same day: v1 used X_AS 0.6103 (the REM TIME SHARE, a misreading: the design says the REM-on RATE fraction); S2-T7 run 2 measured B1a_on_glu rate fraction 0.455 during REM-on (34.5 GA), so offset = 0.3 x 0.455 x 4 = 0.546; the pre-revision failure (generators silent, 0 twitches at 29.5 and 34.5 GA, stored I_b 0.5222 / 0.5175) is published in s2a_t7_run1.stdout and s2a_t7_run2_ga34.5.stdout; v1 file kept as s2a_frozen_biases_v1_X0.6103.json | FINAL x_AS: noise-free stage 1 at 34.5 GA (the calibration age; s2a_xas_34.5.stdout) = 0.4594 -> offset 0.3 x 0.4594 x 4 = 0.5512 (closed S2a run read 0.455, agreeing); at 29.5 GA noise-free x_AS is 0.3591 (offset 0.4309, reported, not used: biases are frozen across ages)", "ib_rn": 0.7034, "ib_sp": 0.6987, "b_eff_rn": 1.2546, "b_eff_sp": 1.2499, "offset": 0.5512, "notes": "rn: first two confirmation seeds 204.6 and 140.0 /h (miss: 204.6 is +50%), further step b_eff 1.2546 seeds 3,4: 175.4 (+29%, marginal) and 133.8 /h vs target 136; sp: 81.5 and 96.9 /h vs 81.6 (+19%); interval CV 1.27-1.35 (irregular); Poisson noise at ~90 events is ~11% so the acceptance is marginal; search runs: b 1.20 -> 0 events, 1.225 -> 3/h, 1.25 -> 83/h, 1.30 -> 3208/h (oscillator)"}, "db": "registry.s2a_frozen_biases", "note": "fitted values, moved from companion/a17_scripts/s2a_frozen_biases.json"}
---
