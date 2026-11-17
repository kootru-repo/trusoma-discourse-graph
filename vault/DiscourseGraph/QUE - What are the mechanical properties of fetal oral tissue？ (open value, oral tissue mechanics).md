---
nodeTypeId: "node_4SqRl5RIkaUMb9fLOpdhq"
nodeInstanceId: "6cf05de3-4232-74d8-b79c-749627125a01"
dg_type: "Question"
dg_name: "open value, oral tissue mechanics"
record: "companion/source_audit/OPEN_VALUE_BLOCKERS.md"
quote: "no fetal or neonatal oral tissue mechanics for this term (2026-11-06 search; fetal muscle water 90.7% at 13-14 wk, Dickerson 1960, supports near-incompressibility but gives no value)"
asks: "What are the mechanical properties of fetal oral tissue?"
lead: "Forgacs 1998, Biophysical Journal 74:2227, doi 10.1016/s0006-3495(98)77932-9 (chick embryo tissue, read 2026-11-17: stress relaxation times in Table 1, seconds to tens of seconds; another tissue and no fast time); Akos 2020, Front Cell Dev Biol 8:674, doi 10.3389/fcell.2020.00674 (quail embryo, a creep time); Harada 2011, Int J CARS 6:797, doi 10.1007/s11548-011-0563-7 (rat fetus abdominal wall, closed). No measured Poisson ratio found"
values: ["[[CLM - our reading, palate 0.60 mm at y 7 (-7.10 to -6.50), 0.60 at y 8 (-6.90 to -6.30), 0.80 … (setting.tongue7.Tissue.__init__.h_palate_mm = 0.67)]]", "[[CLM - 'as the stiffness of passive tissues removed from a cadaver is known to be lower than the one measured … (tongue7.tissue.init.e_tongue = 6.2)]]", "[[CLM - tongue7.tissue.init.nu = 0.499, only an adult source exists, which this project does not accept, so not a sourced value]]", "[[CLM - an averaged maximal thickness of soft tissues of 6.4 ± 0.8 mm and a 4 ± 1 mm height for the phalanx … (tongue7.tissue.init.pulp_frac = 0.20)]]", "[[PAR - tongue7.tissue.init.pulp_g.n0 = 0.15, a model choice; current, changes the built 12.5 body]]", "[[PAR - tongue7.tissue.init.pulp_g.n1 = 0.15, a model choice; current, changes the built 12.5 body]]", "[[CLM - tongue7.tissue.init.pulp_tau.n0 = 0.07, only an adult source exists, which this project does not accept, so not a sourced value]]", "[[CLM - tongue7.tissue.init.pulp_tau.n1 = 1.4, only an adult source exists, which this project does not accept, so not a sourced value]]"]
---

What are the mechanical properties of fetal oral tissue?

From the record: "no fetal or neonatal oral tissue mechanics for this term (2026-11-06 search; fetal muscle water 90.7% at 13-14 wk, Dickerson 1960, supports near-incompressibility but gives no value)"

Next lead: Forgacs 1998, Biophysical Journal 74:2227, doi 10.1016/s0006-3495(98)77932-9 (chick embryo tissue, read 2026-11-17: stress relaxation times in Table 1, seconds to tens of seconds; another tissue and no fast time); Akos 2020, Front Cell Dev Biol 8:674, doi 10.3389/fcell.2020.00674 (quail embryo, a creep time); Harada 2011, Int J CARS 6:797, doi 10.1007/s11548-011-0563-7 (rat fetus abdominal wall, closed). No measured Poisson ratio found.

Values that wait on this question (a sourced one answers its part): [[CLM - our reading, palate 0.60 mm at y 7 (-7.10 to -6.50), 0.60 at y 8 (-6.90 to -6.30), 0.80 … (setting.tongue7.Tissue.__init__.h_palate_mm = 0.67)]], [[CLM - 'as the stiffness of passive tissues removed from a cadaver is known to be lower than the one measured … (tongue7.tissue.init.e_tongue = 6.2)]], [[CLM - tongue7.tissue.init.nu = 0.499, only an adult source exists, which this project does not accept, so not a sourced value]], [[CLM - an averaged maximal thickness of soft tissues of 6.4 ± 0.8 mm and a 4 ± 1 mm height for the phalanx … (tongue7.tissue.init.pulp_frac = 0.20)]], [[PAR - tongue7.tissue.init.pulp_g.n0 = 0.15, a model choice; current, changes the built 12.5 body]], [[PAR - tongue7.tissue.init.pulp_g.n1 = 0.15, a model choice; current, changes the built 12.5 body]], [[CLM - tongue7.tissue.init.pulp_tau.n0 = 0.07, only an adult source exists, which this project does not accept, so not a sourced value]], [[CLM - tongue7.tissue.init.pulp_tau.n1 = 1.4, only an adult source exists, which this project does not accept, so not a sourced value]].

Record file: `companion/source_audit/OPEN_VALUE_BLOCKERS.md`.
