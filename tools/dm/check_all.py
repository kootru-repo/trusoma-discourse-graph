"""One process, one parse of the vault: regenerate-and-compare (build_from_vault check) and validate (validate_vault). the schema check (schema_tool) and the repeated passages index (passages). Exit 1 if any fails. Run by build_sourcing_db.py --check."""
import sys
import build_from_vault, validate_vault, schema_tool, passages
sys.argv = [sys.argv[0], "check"]
a = build_from_vault.main()
b = validate_vault.main()
sys.argv = [sys.argv[0], "check"]
c = schema_tool.main()
sys.argv = [sys.argv[0], "check"]
d = passages.main()
sys.exit(1 if a or b or c or d else 0)
