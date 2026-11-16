---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "26f5a8eb-d6a5-7f99-a3d0-232defa7adb0"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 258
data: {"id": "M-124", "category": "M", "priority": "P2", "ref": "companion/source_audit/paper_register.csv (skills trial 2026-11-15)", "item": "Crossref check of 211 register rows with a DOI (tools/skills/check_citation.py) finds 14 to review: 4 DOIs truncated at an opening bracket (p-pmid1951542, p-pmid7397496, p-pmid9570033, p-doi-10-1016-s0140-6736-14: not found); wrong or non-name first-author field (p-pmid136501 'Analysis' vs Stauffer, p-doi-10-1152-jn-00848-2015 'Current' vs Wakefield, p-peever2015 vs Fraigne, p-doi-10-1080-14722240410001700249 vs Pooh/RK, p-pmc11436331 Baba vs B.K, p-doi-10-1002-uog-1079 Sherer vs Kiserud); possible wrong DOI (p-pmid26428952 Delpy 2008 vs Crossref Sedmak 2016); year differences print vs online (Ohmura 2017/2018, Galis 2009/2010, Moore 2008/2009). Detail: companion/source_audit/skills_trial_2026-11-15/register_check_summary.txt", "why": "A register entry with a wrong DOI or author can attach a value to the wrong paper.", "resolve": "For each row open the paper page, correct the register (or its generator) and the dependent sourcing records only after the right paper is confirmed by title and the cited value is found in it.", "status": "open", "evidence": "", "touched": "2026-11-15", "note": ""}
---
