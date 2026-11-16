---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "5a69a2dd-8712-759f-89cb-e5f3a6d87018"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 246
data: {"id": "M-113", "category": "M", "priority": "P1", "ref": "tools/trusoma/brain/skin7.py", "item": "Slowly adapting (SA-I) afferents at 12.5 weeks are not supported by stage data (found 2026-11-14): at rat E15-E20, 97.5% of trigeminal ganglion cells give rapidly adapting responses to innocuous touch and 94.3% are silent without stimulation; 89% of vibrissa-related cells respond to one follicle only; 64% show rapid response decrement ('Prenatal development of the receptive fields of individual trigeminal ganglion cells in the rat', N. L. Chiaia, 1993, J Neurophysiol, doi:10.1152/jn.1993.69.4.1171, abstract). The 12.5 week model drives SA-I and FA-I afferents per skin unit.", "why": "the learner's input classes and the relay's activity at the stage depend on it; afferent background drive must be near zero", "resolve": "check human fetal afferent data; if none, give the 12.5 week body one rapidly adapting, decrementing afferent class with near-silent background, and move SA-I onset to the age its sources give", "status": "in-progress", "evidence": "Recorded 2026-11-14 (RESULT section 20): general movements 7.5-14.7% inside the source range on every seed, isolated arm 20-60 and leg 0-20 per h inside; touch reading fell 0.119-0.179 -> 0.108-0.122 (sustained SA-I input removed); homology still not supported; rapid response decrement still not modelled.", "touched": "2026-11-14", "note": ""}
---
