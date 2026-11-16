---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "de852e9f-dcb6-7f31-a806-cd7a3fd868bb"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 143
data: {"id": "L-029", "category": "L", "priority": "P2", "ref": "CF2_CONSTANTS_APPENDIX K14-1 / cortex_core.adopt_set_points (c1m f265fbc)", "item": "K14-1 wiring: nothing calls adopt_set_points(). 'The unit's preceding developmental period' has no sourced length or boundary; choosing one (a week, a session, a sleep) would add an unsourced constant to the brain package, which brain_guard forbids", "why": "the per-unit set point is coded and tested but inert; H1 still scales to the module RHO", "resolve": "Find a source that fixes the period over which cortical units' mean rate sets their homeostatic target (Turrigiano 1998 / Desai 1999 give the 48 h return, not the averaging window), bind it as a [V] entry, then call enable_set_point at developmental start and adopt_set_points at each period end in the life driver", "status": "blocked", "evidence": "Searched for a source fixing the set-point averaging window. Hengen et al. 2013 (PMC3816084, PMID 24139038) gives firing return to baseline over 2-3 days after a 2-day suppression, i.e. a recovery time, not an averaging window; Turrigiano 1998 / Desai 1999 give the 48 h return. No source found that defines the period; choosing one would add an unsourced constant to the brain package (brain_guard forbids). 2026-10-30", "touched": "2026-10-30", "note": ""}
---
