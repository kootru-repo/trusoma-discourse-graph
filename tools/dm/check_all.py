"""One process, one parse of the vault: regenerate-and-compare (build_from_vault check) and validate (validate_vault). Exit 1 if either fails. Run by build_sourcing_db.py --check."""
import sys
import build_from_vault, validate_vault
sys.argv = [sys.argv[0], "check"]
a = build_from_vault.main()
b = validate_vault.main()
sys.exit(1 if a or b else 0)
