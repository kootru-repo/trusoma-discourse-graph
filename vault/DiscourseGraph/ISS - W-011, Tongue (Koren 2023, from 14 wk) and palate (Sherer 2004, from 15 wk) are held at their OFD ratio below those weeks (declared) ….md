---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "e9483181-0bb4-74a0-83f9-9904d02af1a3"
dg_type: "Issue"
dg_name: "W-011"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 138
data: {"id": "W-011", "category": "W", "priority": "P2", "ref": "growth7.py tongue/palate below 14-15 wk", "item": "Tongue (Koren 2023, from 14 wk) and palate (Sherer 2004, from 15 wk) are held at their OFD ratio below those weeks (declared); measured human mandible data for 8-37 wk exist (Mapping the Prenatal Growth of the Mandible, J Craniofac Surg 2026, PMC13200890; Zenodo 16352519; coefficients in Supplemental Table 3, headerless CSVs) and crown-chin length 10-14 wk (Sepulveda 1997, PMID 9125610); no fetal tongue or lip size before 14 wk found", "why": "", "resolve": "Get Supplemental Table 3 (links.lww.com/SCS/J46); use mandible body length for the jaw below 14 wk; keep tongue and lip as declared ratio extrapolation or find a source.", "status": "declared", "evidence": "Zenodo 16352519 downloaded and fitted (companion/audit_log/verification/2026-10-30_w011_mandible_zenodo.md): mandible body length -0.006461 GA^2 + 1.51997 GA - 11.6405 mm, R2 0.990, 8.6-37 wk. growth7.py has no jaw-length function, so nothing to replace; tongue and lip below 14 wk stay declared ratio extrapolations. 2026-10-30", "touched": "2026-11-04", "note": "Rechecked 2026-11-04: outcome stands."}
---

Tongue (Koren 2023, from 14 wk) and palate (Sherer 2004, from 15 wk) are held at their OFD ratio below those weeks (declared); measured human mandible data for 8-37 wk exist (Mapping the Prenatal Growth of the Mandible, J Craniofac Surg 2026, PMC13200890; Zenodo 16352519; coefficients in Supplemental Table 3, headerless CSVs) and crown-chin length 10-14 wk (Sepulveda 1997, PMID 9125610); no fetal tongue or lip size before 14 wk found.

To resolve: Get Supplemental Table 3 (links.lww.com/SCS/J46); use mandible body length for the jaw below 14 wk; keep tongue and lip as declared ratio extrapolation or find a source.

Status: declared; priority: P2; category: W.

Evidence so far: Zenodo 16352519 downloaded and fitted (companion/audit_log/verification/2026-10-30_w011_mandible_zenodo.md): mandible body length -0.006461 GA^2 + 1.51997 GA - 11.6405 mm, R2 0.990, 8.6-37 wk. growth7.py has no jaw-length function, so nothing to replace; tongue and lip below 14 wk stay declared ratio extrapolations. 2026-10-30.

Note: Rechecked 2026-11-04: outcome stands.
