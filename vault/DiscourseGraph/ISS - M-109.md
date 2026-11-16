---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "ad7c07fa-1adb-7f1d-ab59-1951893f094c"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 242
data: {"id": "M-109", "category": "M", "priority": "P1", "ref": "tools/trusoma/brain/transduction7.py:6", "item": "Vestibular input misses whole-body rotation in the free body (found 2026-11-14): transduction7 takes the head's angular velocity as the two neck joint rates because the thorax was body7's fixed frame; with Body7(free=True) the trunk rotates (root angular velocity rw, tens of degrees per second while settling), and the canals should sense head rotation = root rotation plus neck rotation. No otolith (linear acceleration or gravity) input either, as in v6.", "why": "the brainstem's vestibular drive is wrong whenever the free body turns; it may also bear on M-108", "resolve": "in free mode, hand over the head's angular velocity as rw (womb frame, rotated into the head frame) plus the neck rates; check the transducer law's source covers whole-head rotation; re-record", "status": "verified", "evidence": "Code fix in place (transduction7.head_state adds root rotation along the neck axes in free mode; cost 0.01 ms per call). The 240 s recording m104_vest_240s is identical in events and scores to m104_coupled_240s because the vestibular pathway is disconnected (K_VEST 0, VEST_nuc has no outputs; see M-110).", "touched": "2026-11-14", "note": ""}
---
