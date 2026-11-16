---
nodeTypeId: "node_2unblKFUVJkOdOnT8MstZ"
nodeInstanceId: "972e97d9-d8a7-73dd-9a69-0ec93b09576f"
dg_type: "Issue"
record_file: "companion/audit_log/nonbrain_audit_log.csv"
code: "audit"
order: 55
data: {"id": "C-004", "category": "C", "priority": "P3", "ref": "tools/trusoma/brain/*.py (41 sites)", "item": "np.where / torch.where conditional selections not inspected one by one", "why": "a conditional on state could be a hidden threshold rule", "resolve": "Inspect each; classify as numerical guard, mask, or rule (rules need a spec ID)", "status": "open", "evidence": "", "touched": "", "note": ""}
---
