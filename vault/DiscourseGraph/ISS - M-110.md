---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "f4bf9662-c0cb-718c-89a9-0e883b544ed1"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 243
data: {"id": "M-110", "category": "M", "priority": "P2", "ref": "tools/trusoma/brain/brainstem_s2.py:507", "item": "Vestibular system disconnected in the 12.5 week build (found 2026-11-14): the vestibular afferent current is K_VEST x |head angular velocity| with setting.brainstem_s2.K_VEST = 0.0, and VEST_nuc has no outgoing projection (it only receives from VEST_aff and the relays). No vestibular signal has affected any recording, pinned or free; the M-109 fix (whole-body rotation in the canal input) is correct but inert: a 240 s free-body recording with it is byte-identical in events and scores to one without.", "why": "the free body now turns and sinks, which a fetal vestibular system would sense; the brainstem cannot respond to it", "resolve": "source the fetal vestibular afferent gain and the vestibular nucleus projections at 12.5 weeks before setting K_VEST or wiring VEST_nuc; then re-record", "status": "open", "evidence": "", "touched": "2026-11-14", "note": ""}
---
