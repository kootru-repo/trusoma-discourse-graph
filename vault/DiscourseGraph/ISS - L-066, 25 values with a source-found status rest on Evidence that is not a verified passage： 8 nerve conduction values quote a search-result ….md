---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "5ae75bfa-a95f-72c2-a39b-b122e2f38721"
dg_type: "Issue"
dg_name: "L-066"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 266
data: {"id": "L-066", "category": "L", "priority": "P2", "ref": "doi:10.1055/s-2008-1037305: brainstem_s2.conduction_velocity.lit.n1, brainstem_s2.conduction_velocity.lit.n4, brainstem_s2.conduction_velocity.lit.n6, brainstem_s2.conduction_velocity.lit.n7, brainstem_s2.conduction_velocity.lit.n8, brainstem_s2.conduction_velocity.lit.n9, brainstem_s2.v34, brainstem_s2.v41; PMID 35396717: growth7.koren.n0.n2, growth7.koren.n1.hi, growth7.koren.n1.n2, growth7.koren.n2.hi, growth7.koren.n2.n2, growth7.koren.n3.hi, growth7.koren.n3.n2, growth7.koren.n4.hi, growth7.koren.n5.hi, growth7.koren.n5.n2, growth7.koren.n6.hi, growth7.koren.n6.n2, growth7.koren.n7.hi, growth7.koren.n7.n2, growth7.koren.n8.hi, growth7.koren.n8.lo, growth7.koren.n8.n2", "item": "25 values with a source-found status rest on Evidence that is not a verified passage: 8 nerve conduction values quote a search-result paraphrase of the abstract, marked NOT verified on an opened page; 17 Koren 2022 tongue width values have value_in_source 'not read' although the locator gives the Table 5 row and page", "why": "Found by the discourse graph closure review 2026-11-17 (local/dg_review_round3_closure.md, defect B); a sourced value needs a verbatim quote and page", "resolve": "Open the paper for the 8 conduction values and enter the verbatim passage and page, or set them unsourced; for Koren re-enter the quote from the stated table row through tools/dm/value_add.py", "status": "verified", "evidence": "2026-11-17: all 25 passages verified and recorded in a new property 'verified' on each Evidence note (no existing property changed). 17 Koren 2022 rows: each row named in the locator stands word for word on the stated page of the local PDF (Table 4 p. 6, Table 5 p. 7; pdftotext). 8 conduction values: PubMed abstract of PMID 6915862 (Pluta 1981, doi 10.1055/s-2008-1037305) opened and read: 'the median of the nerve conduction velocity rises almost in a straight line from 16.5 m/sec in the 34th week of gestation to 25.7 m/sec in the 41st week'; abstract only, the full text was not opened. The stale remarks ('not read', 'NOT verified') stay in the older properties, which are never edited.", "touched": "2026-11-17", "note": ""}
---

25 values with a source-found status rest on Evidence that is not a verified passage: 8 nerve conduction values quote a search-result paraphrase of the abstract, marked NOT verified on an opened page; 17 Koren 2022 tongue width values have value_in_source 'not read' although the locator gives the Table 5 row and page.

Why it matters: Found by the discourse graph closure review 2026-11-17 (local/dg_review_round3_closure.md, defect B); a sourced value needs a verbatim quote and page.

To resolve: Open the paper for the 8 conduction values and enter the verbatim passage and page, or set them unsourced; for Koren re-enter the quote from the stated table row through tools/dm/value_add.py.

Status: verified; priority: P2; category: L.

Evidence so far: 2026-11-17: all 25 passages verified and recorded in a new property 'verified' on each Evidence note (no existing property changed). 17 Koren 2022 rows: each row named in the locator stands word for word on the stated page of the local PDF (Table 4 p. 6, Table 5 p. 7; pdftotext). 8 conduction values: PubMed abstract of PMID 6915862 (Pluta 1981, doi 10.1055/s-2008-1037305) opened and read: 'the median of the nerve conduction velocity rises almost in a straight line from 16.5 m/sec in the 34th week of gestation to 25.7 m/sec in the 41st week'; abstract only, the full text was not opened. The stale remarks ('not read', 'NOT verified') stay in the older properties, which are never edited.
