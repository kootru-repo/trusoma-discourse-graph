---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "78757e38-c253-7172-ba35-f7165013be49"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 206
data: {"id": "M-089", "category": "M", "priority": "P2", "ref": "companion/source_audit/batch_2026-11-08_oa_library/FINDINGS.md", "item": "Brainstem path delays too short by human fetal geometry: Dovjak 2021 (doi:10.1002/uog.22162) and Takakuwa 2021 (doi:10.1111/joa.13433) give 12.5-week midbrain 5.7-6.0, pons 3.6, medulla 6.1 mm; with central v 0.56-1 m/s, d_b3_rn >= 13.7 ms (now 5) and d_b1e >= 7.1 ms (now 6) before the cervical segment", "why": "the delays shape the brainstem loop timing; current values imply paths shorter than the fetal brainstem", "resolve": "add the foramen magnum to C5-C8 cervical length from Bayer & Altman spinal cord atlas (doi:10.1201/9781003274704, library list), then set the three delays as SYN_MS + L/v and log the derivation", "status": "revised", "evidence": "Applied 2026-11-08: d_b3_rn 37, d_b1e 25, d_atonia 20, d_relay_lc 15 ms; brainstem lengths Dovjak 2021 (Takakuwa 2021 check), cervical path 7.38 mm by vertebral level (Tanaka 2020 Kyoto, Kaiser 2024 scan), v 0.56 m/s (Radivojevic 2023); specs spec_path_delays_vertebral.json, spec_relay_lc_kvest.json; companion/source_audit/batch_2026-11-08_oa_library/FINDINGS.md", "touched": "2026-11-08", "note": ""}
---
