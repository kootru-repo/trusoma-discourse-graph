# CORTEX (cf2) CONSTANTS APPENDIX (v3 DRAFT, 2026-10-08)

v1 failed the appendix review (answers [A1-Cn]). Companion to CF2_CELL_SPEC.md v5. Values SOURCED [V], RULE, or D (declared); frozen before the build; per synapse class, independent of body size; never tuned on performance. Unit convention as BRAINSTEM_APPENDIX_A A0 (population-mean conductances of drawn spikes, g_L = 1, bias per population) [A1-C3].

## K1. Neuron (shared model)
r_max 10 rate units = 200 imp/s (1 unit = 20 imp/s) [J3-1]; forces 4.0 / 1.0 / D_mat 2.0; J_th 0.5; s_ch 0.5 (graded f-I; BRAINSTEM A0b); tau_m(age) 60 ms at 14 GA -> 15 ms at 40 GA (shared table, A1) integrated exactly over the 33 ms tick [A1-C9]; input gain(age) 4 -> 1 from 20 GA to term (D); OU background conductance: mean 0, sd 0.2, tau 10 ms (point-conductance form, D).
Cortical chloride: ONE table, +1 until 20 GA, linear to -1 at 40 GA (CF2 U1) [J3-8] [SUPERSEDED 2026-10-18 for the cortex by BRAINSTEM_APPENDIX_A A20 'BRAIN VALUES FIX F2': -1 at 92 GA, zero at 56 GA, a declared late-end reading]; d_rest (Vogels switch-on) = 0 (D).

## K2. Populations and wiring
nE 12, nI 4 per column; P8 GE 52, GI 12 per surface; reach factor 2.8; summation = population mean (A0) [A1-C3]. Bias I_b: P3 -0.2, P4 0.0, P5 -0.2, P6 0.3, P7 0.0, P8 E -0.2, P8 I 0.0 (D). Innate weights [SUPERSEDED for the column by K12: relay -> P3 0.6, relay -> P4 0.1, P4 -> P3 0.5; joint review 5, 2026-10-10]: relay -> P3 own 0.25 (initial; a full afferent then adds 1.0 of drive x gain) [J3-5], neighbours 0 (formed by H3); relay -> P4 1.0; P3 -> P4 1.0; P4 -> P3 1.5 (GABA); P3 -> P5 initial uniform [0, 0.1]; tonic -> P5 initial 0.5; P5 -> P8 0.5 (fixed); P8 E -> P8 all 0.6, P8 I -> P8 E 1.5 (chosen so paper_check finds no self-sustained UP state without input at d = +1 and d = -1: to be confirmed and published) [J3-5]; P8 -> P3/P5 apical initial [0, 0.1]; relay -> P6 (e) 1.5; P5 -> P6 (p) 1.5; P7 relay weights initial 1.0 (fixed for d >= 0); recurrent P3 -> P3 (within column and reach-neighbours, D1) 0.8 with short-term depression U = 0.3, tau_rec = 2 s (Tabak et al. 2000 [M] form); gap-junction coupling k_gj(age) 0.3 at 16 GA -> 0.05 at 34 GA (D). Bound check (A0) before the build: P3 with own afferent at full rate and gain 4 must not exceed r_max (sigmoid) and must not saturate on average; P8 must be sub-threshold without drive (published).

## K3. Learning (activity clock)
w_max 1.0; eta 0.0042 (0.05 x 60/290 / 2.45: the tag charge per event is kept when tau_LTP is 290 ticks and the tag is not consumed, 2.45 = 1 + k_conv x tau_LTP, K14-2 and C3); eta_rel 0.002; tags: tau_f(age) 4.0 -> 1.8 ticks (Flint 1997 endpoints corrected to 35 C with Korinek 2010, midpoints of 3.5-4.6 and 1.6-2.1 ticks; CF2_CELL_SPEC C1) [V], k_tag 0.2, tau_LTP 290 ticks, tau_LTD 164 ticks (He et al. 2015 Fig 6 fits, 9.56 s and 5.40 s at 33 ms per tick [V]; K14-2); k_conv 0.005 per tick at full NE / 5-HT (conversion within the tag lifetime: LTP ~23 percent, LTD ~13 percent at full tone; scales with the tone) [J3 SHOULD]; eta_Y 0.01, theta_Y 0.5, lambda_Y 1e-4 (D); node-perturbation weight 0.1, ON (D; the Noble L1 harness) [J3-13]; synaptic sampling temperature T from intrinsic spine-volume fluctuations (Yasumatsu et al. 2008 [V]: the daily SD of spine volume change is about 0.2 V + 0.01 um^3 per day, V being spine volume; rat hippocampal slice culture) giving a per-tick sd of ~1e-4 of the theta range (D, to fix from the paper's values before freezing) [A1-C2]; Gaussian prior on theta: mean -2 (sparse), sd 1.5 (D); critical-period M = 4 (the peak plasticity gain, D); PV onset programme ramp 22-28 GA (D); net closure time constant ~6 weeks of developmental time (D); Otx2-like experience variable: accumulates with the column's mean relay activity, time constant 1 week of developmental time (D) [A1-C8].

## K4. Homeostasis and structure (DEVELOPMENTAL clock) [A1-C1]
All slow rates are per unit of REAL developmental time and applied per tick as rate x 33 ms within a session (so they barely move), and integrated over the gap at boundaries (L3): scaling time constant 48 h (Turrigiano et al. 1998 [V]; within a session: 1/(48 h / 33 ms) = 1.9e-7 per tick); intrinsic threshold time constant 48 h (Desai 1999 [V]); structural formation p_build = 1 per site per 3 days (transient spines live days, Holtmaat 2005 [V]); deletion after Fauth 2015 [V]: p_del = p_build x rho x exp(-a^2 w^(4/3)) with a 2.0 and rho 0.125 on Fauth's weight scale and no w0 (the earlier rho_s 1.5, a_del 6, w0 0.2 are retired); the map from Fauth's weight scale to w_max is fixed by calibration K14-3 (Holtmaat 2005 persistence fractions); apoptosis lambda = 1 per 30 days at rate < 0.2 rho (D); rho 0.05 r_max [SUPERSEDED 2026-10-18 for the cortex core by BRAINSTEM_APPENDIX_A A20 'BRAIN VALUES FIX F1 + F1b': 0.0025 r_max]; b_max 2.0. Conservation (activity clock, fast): W_budget 3.0, eta_n 0.1 per tick (D).

## K5. Sleep downscaling (activity clock)
eta_ds: synapse size 18.9 percent smaller after about 7 h of sleep than after spontaneous wake (de Vivo et al. 2017 [V], as-submitted manuscript; the earlier figure of 18 percent over 4 h was not in that paper) [A1-C7]; s(w) = max(0, 1 - (w/w_c)^2) with w_c by calibration K14-4 (the earlier w_spare 0.6 and kappa 0.05 are retired; 80/20 split checked in P-4).

## K6. Release and noise
p_rel uniform 0.1-0.9 per synapse (Branco & Staras 2009 [V] range); spike counts Poisson per 1 ms (brainstem) or per tick from the tick rate (cortex); seed streams: one per population and synapse class, seeded from (life seed, id).

## K7. Values for 14-20 GA [A1-C8]
Before thalamic invasion (~16-17 GA) the cortex receives no afferent input; maturation ramps that start at 20 GA hold their 20-GA values before 20 GA; P3 recurrence and gap junctions are active from the start (spontaneous network activity).

## K8. Voltage rule and sampling (v3) [J3-12, J3-11]
theta_minus = J_th + 0.0 (onset of the LTD range), theta_plus = J_th + the K14-9 gap (LTP above; the earlier +1.0 is retired; Artola et al. 1990 form); sampling: intrinsic spine fluctuation SD about 0.2 V + 0.01 um^3 per day, V = spine volume (Yasumatsu 2008 [V]; multiplicative in volume, applied here as additive noise on theta (D)) -> theta SD per tick on the developmental clock (~1.2e-4 within sessions; integrated over gaps); prior N(-2, 1.5) (D).
## K9. Units and spikes [J3-1]
rate units: r_max 10 = 200 imp/s, i.e. 20 imp/s per rate unit (hz_per_unit 20, D); spikes per 1 ms ~ Poisson(x x 200 Hz x 1 ms); teacher criterion on the noise-free replica: x x 200 Hz x 33 ms >= 1, i.e. x >= 0.15.

## K10. Published paper_check result (2026-10-08) [J3-5]
P8 (E->all 0.6, I->E 1.5, I_b E -0.2, I 0.0, s_ch 0.5): without input ONE stable fixed point, E 0.034 / I 0.055 at d=+1 and E 0.027 / I 0.054 at d=-1 (no self-sustained UP state); with an input drive of 1.5 to E: E 0.93 at d=+1, 0.48 at d=-1 (stable).

## K11. Synaptic kinetics (shared model, BRAINSTEM A1) 
AMPA 5 ms, NMDA 100 ms (half of excitatory conductance), GABA-A 15 ms (D); in the 33 ms cortex the filters are applied exactly per tick.


## K12. COLUMN AND P8 BY COMPUTATION (joint review 4 answers [J4-6, J4-7], 2026-10-08). SUPERSEDES K2/K10 values.
- COLUMN [relay -> P3, relay -> P4 and the P3 / P4 biases SUPERSEDED 2026-10-18 for the cortex core by BRAINSTEM_APPENDIX_A A20 'BRAIN VALUES FIX F1 + F1b' (the same K12 rule re-solved at the new rate target)]: relay -> P3 0.6, relay -> P4 0.1, P4 -> P3 0.5, P3 -> P4 1.0, recurrent P3 -> P3 0.4 with short-term depression (U 0.3, tau_rec 2 s, r in imp/s) (the bursts of D1); the cortical input gain multiplies all synaptic inputs. paper_check (s_ch 0.5): rest P3 0.03 at gains 4/2/1; full touch P3 1.0 / 1.0 / 0.89; without depression a second (UP) state exists at gain 4 at rest, which the recurrent depression turns into transient network bursts (to confirm in time simulation).
- P8: E -> E 0.3, E -> I 0.6, I -> E 1.5 (x gain): paper_check at gains 4/3/2/1: rest single low state (E 0.02); driven: E 1.0 / no fixed point (oscillatory) / 0.26 / 0.17. No self-sustained UP state at any age (K10 superseded). Heterogeneity of P8 timescales comes from an intrinsic slow current per unit (time constant 2-10 ticks, log-uniform, D), NOT from tau_m (one tau_m table) [J4-9].
- VOLTAGE RULE WITH A SLIDING THRESHOLD [J4-7]: theta_minus = V_bar, theta_plus = V_bar + the K14-9 gap (the earlier 1.0 is retired), where V_bar is the unit's own running mean membrane potential (time constant 10 min of activity, D): a BCM-type sliding modification threshold (Bienenstock, Cooper & Munro 1982 [M]; experimental sliding threshold, Kirkwood, Rioult & Bear 1996, Nature 381:526 [M]); LTP then requires a rise ABOVE the unit's usual level (an unpredicted touch's error current), a correctly predicted touch produces none. g_mod (modulatory gain of P8 and error currents onto the soma) = 0.5 (D); P5's tonic source rate x = 0.2 (D). Loop (2): P8-correlated fluctuations above V_bar still give Hebbian LTP independent of error: DECLARED (context-associated Hebbian plasticity) and measured in P-4.
- C5c fluctuation is taken at t-1 (the activity that produced the prediction) [J4 SHOULD]. Sampling relaxation: with the stated SD and prior, the relaxation time is ~170 days (not 60) [J4 SHOULD].

## K13. ACh ENCODING MODULATION OF P3/P4 (USER 2026-10-23; Joshi et al. 2026 PNAS, doi 10.1073/pnas.2609893123, taken as true)
STATUS: ENTRY OPENED, NO VALUES. Per-class (P3 excitatory, P4 inhibitory) ACh modulation of threshold/bias, adaptation and input gain. Directions and magnitudes must be taken from the paper's full text (only the abstract was read: neuromodulators changed information transfer and firing output cell-type- and receptor-specifically). No literal may enter code until a value here is marked [V] with its clause. Dopamine (D1/D2) values wait for the budget-channel trigger (CF2_CELL_SPEC section 9).

## K14. CALIBRATION REGISTRY (2026-10-24; each constant below is fixed by a named fit to a published measurement, run before the freeze; until the fit has run the value in the code is provisional)
Rodent measurements enter only through the age mapping of CF2_CELL_SPEC C1 (Ohmura & Kuniyoshi 2017 [V]); no fetal measurement exists for any entry.
- K14-1 (H1, H7) set point rho and bias I_b: rho is the unit's own mean rate over its preceding developmental period; I_b moves until the unit's rate equals rho, over the 2-day deprivation time scale of Desai 1999 and the 48 h return of Turrigiano 1998 [V].
- K14-2 (C2, C3) k_tag, k_conv, tau_LTP, tau_LTD: fitted in a single-synapse simulation to He et al. 2015 [V]: LTP halved at a 5 s delay and abolished at 10 s, LTD abolished at 5 s.
- K14-3 (H3) map from Fauth's weight scale to w_max: fitted to the persistent-spine fractions of Holtmaat et al. 2005 [V].
- K14-4 (H5) w_c: chosen so that over 80 percent of synapses have s(w) above 0.5 and the mean size change after the sleep period is -18.9 percent (de Vivo et al. 2017 [V]); the paper's supplement coefficients replace the choice when read.
- K14-5 (C5d) prior mean and sd: the prior-mean weight equals the mean weight of the formed network at term; T from Yasumatsu et al. 2008 [V] as in K3.
- K14-6 (H4) apoptosis threshold and rate: fitted to the activity-dependent death fractions in Blanquie et al. 2017 [V] (full text in papers/learning_rules).
- K14-7 (H2) beta, g(post) and the reference-weight time scale (replacing the retired W_budget and eta_n): set so the total weight per class changes by no more than the tolerance reported in Royer & Pare 2003 [V] under paired potentiation and depression, and so that beta = 0 reproduces the runaway Zenke et al. 2015 [V] report.
- K14-8 (C8) critical-period gain M and the onset and closure times: fitted to the onset and closure ages of Sugiyama et al. 2008 and Pizzorusso et al. 2002 [V], translated by the C1 age mapping.
- K14-9 (U5, C6) U5 threshold gap = J_th minus the resting level (Clopath & Gerstner 2010 fix the thresholds at the resting and firing levels) and the LTP/LTD amplitude ratio from their Table 2, unit-converted; C6 target rate rho equals the H1 set point and its learning rate follows Vogels' alpha = 2 x tau x rho (ModelDB 143751).
- K14-10 (A1) g and L: fitted to the T4A recovery criterion of CORTEX_CORE_DESIGN section 12; the sign pattern is Stanton & Sejnowski 1989 [V].
RETIRED 2026-10-24: lambda_Y (C5b), k_conv x max <= 1 and the Bernoulli conversion (C3), the node-perturbation weight 0.1 (now 1/sigma^2, C5c), w_spare and kappa (H5), W_budget and eta_n (H2). NOT COVERED: the learning-speed scalings eta, eta_rel, eta_Y, theta_Y, the gap-junction and release-probability constants and the OU background have no measured counterpart in this registry.

## K15. JEPA LEARNER NETWORK (K14 in the s2a-v6 branch) (CF2_CELL_SPEC section 16; USER goal 2026-11-02)
Source for every value here: Asabuki & Clopath 2024 eLife 13:RP95243, Embedding stochastic dynamics of the environment in spontaneous activity by prediction-based plasticity, Methods and Table 2, read 2026-11-02, with the mechanism checked against the authors' training.py.
Population 500 excitatory units [V] 2024; 500 inhibitory units [V] 2024; connection probability 0.5 [V] 2024.
Membrane time constant 15 ms [V] 2024; synaptic time constant 5 ms [V] 2024; synaptic current scaling 25 [V] 2024; time step 1 ms [V] 2024.
Maximum firing rate 50 Hz [V] 2024; memory trace time constant 10 s [V] 2024.
Sigmoid gain 2 [V] 2024; slope 5 [V] 2024; threshold 1 [V] 2024; the response s(2 u / h) is the form in training.py, because the printed Eq. 3 places these differently and cannot be what was simulated [V] 2024.
Learning rate 1e-4 [V] 2024.
Initial weight factor onto excitatory units 0.1 [V] 2024; the inverse root of p N is from training.py, the paper's text has no root [V] 2024.
Initial memory trace 1, training.py, the paper gives no initial value [V] 2024.
Initial afferent weight spread 0.1 divided by the root of the input count, Asabuki & Fukai 2024 prior_net_code.py [V] 2024.
Afferent inputs per excitatory unit, sparse form only (Stage 2b, companion/TRUSOMA_STAGE2B_SPARSE.md): 80, the estimate of 80 +- 10 thalamic inputs per layer 4 neuron of Lien & Scanziani 2018, as reported and reconciled with 2-6 dominant inputs by Ringach 2021 Curr Biol 31:2199, read 2026-11-03 [V] 2021. Mouse visual cortex, not touch; a declared transfer. Lien & Scanziani's own paper is not read.


## K16. PHASE 1 LEARNER RESONANCE SUBSTRATE (2026-11-14; CF2_CELL_SPEC section 17; TRUSOMA_PHASE1_LEARNER_METHODS.md; each value re-read on its PMC page)
- RMP_BARRELETTE_MV -62.1 mV [V] (p-lo1999, Results, Fig. 4A; rat postnatal day 4-12, PrV slice, transfer J-RL8; rule RS1).
- RMP_INTERBARRELETTE_MV -60.4 mV [V] (p-lo1999, Results, Fig. 4A; rat postnatal day 4-12, PrV slice, transfer J-RL8; rule RS1).
- RIN_BARRELETTE_MOHM 633.0 MOhm [V] (p-lo1999, Results, Fig. 4A; rat postnatal day 4-12, PrV slice, transfer J-RL8; rule RS1).
- RIN_INTERBARRELETTE_MOHM 417.0 MOhm [V] (p-lo1999, Results, Fig. 4A; rat postnatal day 4-12, PrV slice, transfer J-RL8; rule RS1).
- CM_BURST_PF 82.3 pF [V] (p-tsuruyama2013, Table 1; rat postnatal day 8-12, PrV slice, transfer J-RL8; rule RS1).
- CM_NONBURST_PF 55.4 pF [V] (p-tsuruyama2013, Table 1; rat postnatal day 8-12, PrV slice, transfer J-RL8; rule RS1).
- VTHR_BURST_MV -43.39 mV [V] (p-tsuruyama2013, Table 1; rat postnatal day 8-12, PrV slice, transfer J-RL8; rule RS1).
- INAP_PEAK_PA 30.9 pA [V] (p-tsuruyama2013, Results (persistent Na+ current); rat postnatal day 8-12, PrV slice, transfer J-RL8; rule RS1).
- INAP_PEAK_MV -37.2 mV [V] (p-tsuruyama2013, Results (persistent Na+ current); rat postnatal day 8-12, PrV slice, transfer J-RL8; rule RS1).
- INAP_ONSET_MV -61.1 mV [V] (p-tsuruyama2013, Results (persistent Na+ current); rat postnatal day 8-12, PrV slice, transfer J-RL8; rule RS1).
- ICAN_EREV_MV -1.6 mV [V] (p-tsuruyama2013, Results, Fig. 6C; rat postnatal day 8-12, PrV slice, transfer J-RL8; rule RS1).
- EGABA_MV -42.3 mV [V] (p-ren2006, Results, Fig. 10D; rat embryonic day 17, medullary slice, transfer J-RL8; rule RS3).
- IH_VHALF_MV -94.0 mV [V] (p-vasilyev2002, Table (Ih activation by age), P1, CA1; mouse postnatal day 1, hippocampal CA1, transfer J-RL8; rule RS1).
- IH_SLOPE_MV 7.9 mV [V] (p-vasilyev2002, Table (Ih activation by age), P1, CA1; mouse postnatal day 1, hippocampal CA1, transfer J-RL8; rule RS1).
- PPR_MEAN_PCT 102.9 % [V] (p-lo2011pr, Results (paired-pulse ratio distribution); rat postnatal, PrV, transfer J-RL8; rule RS2).
- PPR_SD_PCT 29.1 % [V] (p-lo2011pr, Results (paired-pulse ratio distribution); rat postnatal, PrV, transfer J-RL8; rule RS2).
- BURST_OVERLAP_PCT 21.3 % [V] (p-butts2007, Results; rat postnatal day 7-11, LGN slice, transfer J-RL8; rule PA5).
- BURST_NONOVERLAP_PCT -5.9 % [V] (p-butts2007, Fig. (non-overlapping pairing) legend; rat postnatal day 7-11, LGN slice, transfer J-RL8; rule PA5).
- Chevalier 2016 model neuron (eLife, doi:10.7554/elife.16125, Table 1, after Toporikova 2015; model of a mouse E16.5-E18.5 pre-Botzinger neuron; computational model parameters, rule RS1): CHEV_GNAP_NS 2.5 nS [V]; CHEV_NAP_VH_MV -48.0 mV [V]; CHEV_NAP_SH_MV 5.0 mV [V]; CHEV_NAP_TAUH_MS 10000.0 ms [V]; CHEV_ENA_NAP_MV 50.0 mV [V]; CHEV_GNA_NS 28.0 nS [V]; CHEV_ENA_MV 50.0 mV [V]; CHEV_NA_VM_MV -40.0 mV [V]; CHEV_NA_SM_MV -6.0 mV [V]; CHEV_TAUN_MS 10.0 ms [V]; CHEV_GCAN_NS 2.5 nS [V]; CHEV_KCAN_UM 0.74 uM [V]; CHEV_GK_NS 11.2 nS [V]; CHEV_EK_MV -65.0 mV [V]; CHEV_GL_NS 2.7 nS [V]; CHEV_EL_MV -60.0 mV [V]; CHEV_GCA_NS 0.05 nS [V]; CHEV_ECA_MV 150.0 mV [V]; CHEV_ALPHA 0.055  [V]; CHEV_VPMCA 2.0  [V]; CHEV_KPMCA 0.3  [V]; CHEV_LAMBDA_ER 0.03  [V]; CHEV_FI 0.0001  [V]; CHEV_IP3_UM 1.0 uM [V]; CHEV_VI_UM 4.0 uM [V]; CHEV_A 0.0005  [V]; CHEV_VSERCA_AMOL_S 400.0 aMol/s [V]; CHEV_KSERCA 0.2  [V]; CHEV_SIGMA 0.185  [V]; CHEV_LIP3R_PL_S 0.37 pL/s [V]; CHEV_PIP3R_PL_S 31000.0 pL/s [V]; CHEV_KI_UM 1.0 uM [V]; CHEV_KD_UM 0.4 uM [V]; CHEV_KA_UM 0.4 uM [V]; CHEV_CM_PF 21.0 pF [V].

- Toporikova and Butera 2011 two-compartment inspiratory neuron (J Comput Neurosci 30:515, doi:10.1007/s10827-010-0274-z, section 2.1; model parameters, rule RS1): TB_VM_MV -34.0 [V]; TB_SM_MV -5.0 [V]; TB_VN_MV -29.0 [V]; TB_SN_MV -4.0 [V]; TB_VP_MV -40.0 [V]; TB_SP_MV -6.0 [V]; TB_VH_MV -48.0 [V]; TB_SH_MV 5.0 [V]; TB_TAUN_MS 10.0 [V]; TB_TAUH_MS 10000.0 [V]; TB_GK_NS 11.2 [V]; TB_GNA_NS 28.0 [V]; TB_GNAP_SOMATIC_NS 2.0 [V]; TB_GNAP_DENDRITIC_NS 1.5 [V]; TB_GCAN_NS 1.5 [V]; TB_FI 2.5e-05 [V]; TB_A 0.005 [V]; TB_KD_UM 0.4 [V]; TB_PIP3R 31000.0 [V]; TB_LIP3R 0.37 [V]; TB_IP3_UM 1.0 [V]; TB_IP3_LOW_UM 0.9 [V]; TB_KI_UM 1.0 [V]; TB_KA_UM 0.4 [V]; TB_VSERCA 400.0 [V]; TB_KSERCA 0.2 [V]; TB_CATOT_UM 1.25 [V]; TB_SIGMA 0.185 [V]; TB_KCAN_UM 0.74 [V]; TB_NC 0.97 [V]; TB_K_AREA 0.3 [V]; TB_ENA_MV 50.0 [V]; TB_EK_MV -85.0 [V]; TB_EL_MV -57.0 [V]; TB_CMS_PF 21.0 [V]; TB_CMD_PF 5.0 [V]; TB_GL_NS 2.3 [V]; TB_GC_NS 1.0 [V]; TB_DT_MS 0.1 [V].
- Toporikova and Butera 2011 equation exponents (rule RS1): TB_NA_M_EXP 3.0 [V]; TB_K_N_EXP 4.0 [V]; TB_IP3R_EXP 3.0 [V].
- Short-term depression recovery (rule RS2): STP_TAU_FAST_MS 150.0 [V] (p-yang2025, Results, Fig. 4B (immature WT, P7-11)); STP_TAU_SLOW_MS 3980.0 [V] (p-yang2025, Results, Fig. 4B); STP_P_FAST 0.259 [V] (p-yang2025, Results, Fig. 4B); STP_P_SLOW 0.711 [V] (p-yang2025, Results, Fig. 4B); PPR_ISI_MS 200.0 [V] (p-lo2011pr, Results (PPD magnitude at ISI of 200 ms; PPR flat at 50-200 ms ISI)); transfers J-RL7, J-RL8.
- Relay paired-pulse range (rule RS2): PPR_MIN_PCT 40.0 [V], PPR_MAX_PCT 175.0 [V] (p-lo2011pr, abstract; transfer J-RL7).
- Crins 2011 facilitation decay at the rat calyx of Held, P4-P6 in vivo (J Neurosci 31:11706, doi:10.1523/JNEUROSCI.1995-11.2011, Fig. 4A; rule RS2, J-RL7b): STP_TAU_FACIL_MS 123.0 [V].
- Takahashi 1990 Ih (inward rectifier) of neonatal rat spinal motoneurones (J Physiol 423:47, doi:10.1113/jphysiol.1990.sp018010, pages 49, 55, 60; rule RS1, J-RL8c): IH_E_MV -43.8 [V]; IH_G_CHORD_NS 0.8 [V]; IH_V_CHORD_MV -100.0 [V]; IH_VH_MV -95.0 [V]; IH_K_MV 13.5 [V]; IH_TAU_MS 2400.0 [V].
- Waite 2000 NMDA share of the postsynaptic response in the rat trigeminal principal nucleus at E16 (Eur J Neurosci 12:2781, doi:10.1046/j.1460-9568.2000.00161.x, Results; the 75% of the abstract read directly, the 75.5 +/- 0.7% (SD) of the full text read through the USER's reading assistant; rule RS5, J-RL13): NMDA_SHARE_E16 0.755 [V].
- Coulter, Huguenard and Prince 1989 T-type Ca2+ current of rat thalamic relay neurones (J Physiol 414:587, doi:10.1113/jphysiol.1989.sp017705; full text read 2026-11-15 from the PMC scan, page 597 checked on the page image; 2- to 25-day-old Wistar rats, 23 C; rule RS1 (T-type), J-RL14): TT_M_VHALF_MV -63.0 [V]; TT_M_K_MV 7.8 [V]; TT_H_VHALF_MV -83.5 [V]; TT_H_K_MV 6.3 [V]; TT_M_EXP 3.0 [V]; TT_TAU_V1_MV -60.0 [V]; TT_TAU_V2_MV -10.0 [V]; TT_TAUM_V1_MS 8.0 [V]; TT_TAUM_V2_MS 2.0 [V]; TT_TAUH_V1_MS 50.0 [V]; TT_TAUH_V2_MS 20.0 [V].

## K17. PHASE 1 REFLEX LEARNER (2026-11-14; CF2_CELL_SPEC section 17 rule PB2; TRUSOMA_PHASE1_LEARNER_METHODS.md)
Petersson 2003 (Nature, doi:10.1038/nature01719; supplementary MATLAB programme MOESM26 read directly; thesis p.16), rat postnatal withdrawal-reflex model, Oja rule driven by each module's own twitch, dw = eta RE (SG - RE w): ETA 0.006 [V]; TWITCH_P 0.0625 [V]; W_INIT_AMP 0.8 [V]; SENSORY_NOISE 1.0 [V]; AB_BASAL 1.0 [V]; SG_BASAL 0.2 [V]; AB_SG_RATIO 0.8 [V]; PSI_OFFSET 5.0 [V]; PSI_FLOOR 0.01 [V]; EPOCHS 10000 [V]; NULL_THRESHOLD 260.0 [V]. Computational model parameters; transfer J-RL9.
- Inacio 2016 twitch duration, rat P5-P7 (Nat Commun 7:13060, doi:10.1038/ncomms13060, Results; rule PB2, J-RL9): TWITCH_MS 252.0 [V].
- Petersson 2003 thesis, conditioning criterion (Methods; rule PB4, J-RL9c): TWITCH_REST_MS 300.0 [V] (twitches counted after >300 ms immobility; rat P12-P17).

## K18. PHASE 1 TROPHIC COMPETITION (2026-11-14; CF2_CELL_SPEC section 17 rule PA2)
van Ooyen and Willshaw 1999 (Proc R Soc B 266:883, doi:10.1098/rspb.1999.0719, equations (1)-(5), section 3; NGF data; model parameters, join J-RL1): KA_PER_M_S 48000000.0 M^-1 s^-1 [V]; KD_PER_S 0.001 s^-1 [V]; GAMMA_RECEPTOR_PER_S 2.7e-05 s^-1 [V]; RHO_COMPLEX_PER_S 2e-05 s^-1 [V]; DELTA_PER_S 1e-05 s^-1 [V]; SIGMA_M_PER_S 2e-16 M s^-1 [V]; TAU_GROWTH_H 48.0 h [V]; VOLUME_L 1.7e-11 l [V]; PHI0_PER_H 10.0 molecules h^-1 [V]; ALPHA_PER_H 300.0 molecules h^-1 [V]; K_HALF 100.0 molecules [V]; M_HILL 1.0  [V]. Avogadro constant 6.02214076e23 mol^-1 [V] (CODATA 2018, exact).
- van Ooyen and Willshaw 1999 dual-constraint model (J Theor Biol 196:495, doi:10.1006/jtbi.1998.0849, equations (8)-(12), Figures 2, 5 and 12; non-dimensional model parameters, rule PA6): DC_M_EXP 1.0 [V]; DC_G 17.0 [V]; DC_K 2.0 [V]; DC_A0 0.8 [V]; DC_K_HIGH 4.0 [V]; DC_G_3N 50.0 [V]; DC_A0_3N 0.6 [V].

## Learner value table (generated from the vault, one line per bound learner value; the entries above are the hand-written reading notes for the same values)
<!-- GENERATED from the vault by tools/dm/build_from_vault.py: do not edit between this line and the END line; edit the vault note and regenerate -->
- phase1_substrate.RMP_BARRELETTE_MV -62.1 [V] (p-lo1999, Lo 1999; Results, Fig. 4A)
- phase1_substrate.RMP_INTERBARRELETTE_MV -60.4 [V] (p-lo1999, Lo 1999; Results, Fig. 4A)
- phase1_substrate.RIN_BARRELETTE_MOHM 633.0 [V] (p-lo1999, Lo 1999; Results, Fig. 4A)
- phase1_substrate.RIN_INTERBARRELETTE_MOHM 417.0 [V] (p-lo1999, Lo 1999; Results, Fig. 4A)
- phase1_substrate.CM_BURST_PF 82.3 [V] (p-tsuruyama2013, Tsuruyama 2013; Table 1)
- phase1_substrate.CM_NONBURST_PF 55.4 [V] (p-tsuruyama2013, Tsuruyama 2013; Table 1)
- phase1_substrate.VTHR_BURST_MV -43.39 [V] (p-tsuruyama2013, Tsuruyama 2013; Table 1)
- phase1_substrate.INAP_PEAK_PA 30.9 [V] (p-tsuruyama2013, Tsuruyama 2013; Results (persistent Na+ current))
- phase1_substrate.INAP_PEAK_MV -37.2 [V] (p-tsuruyama2013, Tsuruyama 2013; Results (persistent Na+ current))
- phase1_substrate.INAP_ONSET_MV -61.1 [V] (p-tsuruyama2013, Tsuruyama 2013; Results (persistent Na+ current))
- phase1_substrate.ICAN_EREV_MV -1.6 [V] (p-tsuruyama2013, Tsuruyama 2013; Results, Fig. 6C)
- phase1_substrate.EGABA_MV -42.3 [V] (p-ren2006, Ren 2006; Results, Fig. 10D)
- phase1_substrate.IH_VHALF_MV -94.0 [V] (p-vasilyev2002, Vasilyev 2002; Table (Ih activation by age), P1, CA1)
- phase1_substrate.IH_SLOPE_MV 7.9 [V] (p-vasilyev2002, Vasilyev 2002; Table (Ih activation by age), P1, CA1)
- phase1_substrate.PPR_MEAN_PCT 102.9 [V] (p-lo2011pr, Lo 2011; Results (paired-pulse ratio distribution))
- phase1_substrate.PPR_SD_PCT 29.1 [V] (p-lo2011pr, Lo 2011; Results (paired-pulse ratio distribution))
- phase1_substrate.BURST_OVERLAP_PCT 21.3 [V] (p-butts2007, Butts 2007; Results)
- phase1_substrate.BURST_NONOVERLAP_PCT -5.9 [V] (p-butts2007, Butts 2007; Fig. (non-overlapping pairing) legend)
- phase1_substrate.CHEV_GNAP_NS 2.5 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_NAP_VH_MV -48.0 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_NAP_SH_MV 5.0 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_NAP_TAUH_MS 10000.0 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_ENA_NAP_MV 50.0 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_GNA_NS 28.0 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_ENA_MV 50.0 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_NA_VM_MV -40.0 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_NA_SM_MV -6.0 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_TAUN_MS 10.0 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_GCAN_NS 2.5 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_KCAN_UM 0.74 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_GK_NS 11.2 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_EK_MV -65.0 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_GL_NS 2.7 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_EL_MV -60.0 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_GCA_NS 0.05 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_ECA_MV 150.0 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_ALPHA 0.055 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_VPMCA 2.0 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_KPMCA 0.3 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_LAMBDA_ER 0.03 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_FI 0.0001 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_IP3_UM 1.0 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_VI_UM 4.0 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_A 0.0005 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_VSERCA_AMOL_S 400.0 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_KSERCA 0.2 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_SIGMA 0.185 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_LIP3R_PL_S 0.37 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_PIP3R_PL_S 31000.0 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_KI_UM 1.0 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_KD_UM 0.4 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_KA_UM 0.4 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.CHEV_CM_PF 21.0 [V] (p-chevalier2016, Chevalier 2016; Table 1 (model inspiratory neuron, after Toporikova et al. 2015))
- phase1_substrate.TB_VM_MV -34.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_SM_MV -5.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_VN_MV -29.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_SN_MV -4.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_VP_MV -40.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_SP_MV -6.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_VH_MV -48.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_SH_MV 5.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_TAUN_MS 10.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_TAUH_MS 10000.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_GK_NS 11.2 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_GNA_NS 28.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_GNAP_SOMATIC_NS 2.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_GNAP_DENDRITIC_NS 1.5 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_GCAN_NS 1.5 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_FI 2.5e-05 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_A 0.005 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_KD_UM 0.4 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_PIP3R 31000.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_LIP3R 0.37 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_IP3_UM 1.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_IP3_LOW_UM 0.9 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_KI_UM 1.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_KA_UM 0.4 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_VSERCA 400.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_KSERCA 0.2 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_CATOT_UM 1.25 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_SIGMA 0.185 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_KCAN_UM 0.74 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_NC 0.97 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_K_AREA 0.3 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_ENA_MV 50.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_EK_MV -85.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_EL_MV -57.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_CMS_PF 21.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_CMD_PF 5.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_GL_NS 2.3 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_GC_NS 1.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_DT_MS 0.1 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 (author manuscript pages 2-4))
- phase1_substrate.TB_NA_M_EXP 3.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 equations (author manuscript pages 2-3))
- phase1_substrate.TB_K_N_EXP 4.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 equations (author manuscript pages 2-3))
- phase1_substrate.TB_IP3R_EXP 3.0 [V] (p-toporikova2011, Toporikova 2011; Section 2.1 equations (author manuscript pages 2-3))
- phase1_substrate.STP_TAU_FAST_MS 150.0 [V] (p-yang2025, Yang 2025; Results, Fig. 4B (immature WT, P7-11))
- phase1_substrate.STP_TAU_SLOW_MS 3980.0 [V] (p-yang2025, Yang 2025; Results, Fig. 4B)
- phase1_substrate.STP_P_FAST 0.259 [V] (p-yang2025, Yang 2025; Results, Fig. 4B)
- phase1_substrate.STP_P_SLOW 0.711 [V] (p-yang2025, Yang 2025; Results, Fig. 4B)
- phase1_substrate.PPR_ISI_MS 200.0 [V] (p-lo2011pr, Lo 2011; Results (PPD magnitude at ISI of 200 ms; PPR flat at 50-200 ms ISI))
- phase1_substrate.PPR_MIN_PCT 40.0 [V] (p-lo2011pr, Lo 2011; Abstract)
- phase1_substrate.PPR_MAX_PCT 175.0 [V] (p-lo2011pr, Lo 2011; Abstract)
- phase1_substrate.STP_TAU_FACIL_MS 123.0 [V] (p-crins2011, Crins 2011; Results, in vivo spontaneous activity (Fig. 4A); Methods, STP model (facilitation increment f per AP, exponential recovery))
- phase1_substrate.IH_E_MV -43.8 [V] (p-takahashi1990, Takahashi 1990; Results, tail currents (Fig. 5), p.54)
- phase1_substrate.IH_G_CHORD_NS 0.8 [V] (p-takahashi1990, Takahashi 1990; Discussion p.60 (Fig. 5))
- phase1_substrate.IH_V_CHORD_MV -100.0 [V] (p-takahashi1990, Takahashi 1990; Discussion p.60 (Fig. 5))
- phase1_substrate.IH_VH_MV -95.0 [V] (p-takahashi1990, Takahashi 1990; Results p.55 (Fig. 7))
- phase1_substrate.IH_K_MV 13.5 [V] (p-takahashi1990, Takahashi 1990; Results p.55 (Fig. 7))
- phase1_substrate.IH_TAU_MS 2400.0 [V] (p-takahashi1990, Takahashi 1990; Results p.49 (Fig. 1C, D))
- phase1_substrate.NMDA_SHARE_E16 0.755 [V] (p-waite2000, Waite 2000; Results (E16 recordings); abstract gives 75%)
- phase1_substrate.TT_M_VHALF_MV -63.0 [V] (p-coulter1989, Coulter 1989; Fig. 6C legend, page 597)
- phase1_substrate.TT_M_K_MV 7.8 [V] (p-coulter1989, Coulter 1989; Fig. 6C legend, page 597)
- phase1_substrate.TT_H_VHALF_MV -83.5 [V] (p-coulter1989, Coulter 1989; Summary item 6 and equation 3, page 597)
- phase1_substrate.TT_H_K_MV 6.3 [V] (p-coulter1989, Coulter 1989; Summary item 6 and equation 3, page 597)
- phase1_substrate.TT_M_EXP 3.0 [V] (p-coulter1989, Coulter 1989; Summary item 5; Results (activation kinetics, Fig. 4), page 595)
- phase1_substrate.TT_TAU_V1_MV -60.0 [V] (p-coulter1989, Coulter 1989; Summary item 5; Fig. 5C, D)
- phase1_substrate.TT_TAU_V2_MV -10.0 [V] (p-coulter1989, Coulter 1989; Summary item 5; Fig. 5C, D)
- phase1_substrate.TT_TAUM_V1_MS 8.0 [V] (p-coulter1989, Coulter 1989; Summary item 5; Fig. 5C)
- phase1_substrate.TT_TAUM_V2_MS 2.0 [V] (p-coulter1989, Coulter 1989; Summary item 5; Fig. 5C)
- phase1_substrate.TT_TAUH_V1_MS 50.0 [V] (p-coulter1989, Coulter 1989; Summary item 5; Fig. 5D)
- phase1_substrate.TT_TAUH_V2_MS 20.0 [V] (p-coulter1989, Coulter 1989; Summary item 5; Fig. 5D)
- phase1_reflex.ETA 0.006 [V] (p-petersson2003, Petersson 2003; Nature supplementary MOESM26 (MATLAB, 20030313), parameter block; thesis (Lund 2003) p.16)
- phase1_reflex.TWITCH_P 0.0625 [V] (p-petersson2003, Petersson 2003; Nature supplementary MOESM26 (MATLAB, 20030313), parameter block; thesis (Lund 2003) p.16)
- phase1_reflex.W_INIT_AMP 0.8 [V] (p-petersson2003, Petersson 2003; Nature supplementary MOESM26 (MATLAB, 20030313), parameter block; thesis (Lund 2003) p.16)
- phase1_reflex.SENSORY_NOISE 1.0 [V] (p-petersson2003, Petersson 2003; Nature supplementary MOESM26 (MATLAB, 20030313), parameter block; thesis (Lund 2003) p.16)
- phase1_reflex.AB_BASAL 1.0 [V] (p-petersson2003, Petersson 2003; Nature supplementary MOESM26 (MATLAB, 20030313), parameter block; thesis (Lund 2003) p.16)
- phase1_reflex.SG_BASAL 0.2 [V] (p-petersson2003, Petersson 2003; Nature supplementary MOESM26 (MATLAB, 20030313), parameter block; thesis (Lund 2003) p.16)
- phase1_reflex.AB_SG_RATIO 0.8 [V] (p-petersson2003, Petersson 2003; Nature supplementary MOESM26 (MATLAB, 20030313), parameter block; thesis (Lund 2003) p.16)
- phase1_reflex.PSI_OFFSET 5.0 [V] (p-petersson2003, Petersson 2003; Nature supplementary MOESM26 (MATLAB, 20030313), parameter block; thesis (Lund 2003) p.16)
- phase1_reflex.PSI_FLOOR 0.01 [V] (p-petersson2003, Petersson 2003; Nature supplementary MOESM26 (MATLAB, 20030313), parameter block; thesis (Lund 2003) p.16)
- phase1_reflex.EPOCHS 10000 [V] (p-petersson2003, Petersson 2003; Nature supplementary MOESM26 (MATLAB, 20030313), parameter block; thesis (Lund 2003) p.16)
- phase1_reflex.NULL_THRESHOLD 260.0 [V] (p-petersson2003, Petersson 2003; Nature supplementary MOESM26 (MATLAB, 20030313), parameter block; thesis (Lund 2003) p.16)
- phase1_reflex.TWITCH_MS 252.0 [V] (p-inacio2016, Inacio 2016; Results, 'Network dynamics during twitches and complex movements' (PMC5494195, page read 2026-11-14))
- phase1_reflex.TWITCH_REST_MS 300.0 [V] (p-petersson2003, Petersson 2003; Petersson 2003 Lund thesis, Methods 'Conditioning stimulation' (papers/phase1_blockers_2/petersson_thesis2003.txt lines 611-620))
- phase1_dual.DC_M_EXP 1.0 [V] (p-vanooyen1999jtb, van Ooyen 1999; section 4, Fig 2-12; equations (8)-(12))
- phase1_dual.DC_G 17.0 [V] (p-vanooyen1999jtb, van Ooyen 1999; section 4, Fig 2, 12 legends; equations (8)-(12))
- phase1_dual.DC_K 2.0 [V] (p-vanooyen1999jtb, van Ooyen 1999; section 4, Fig 2, 12 legends; equations (8)-(12))
- phase1_dual.DC_A0 0.8 [V] (p-vanooyen1999jtb, van Ooyen 1999; section 4, Fig 12 legend; equations (8)-(12))
- phase1_dual.DC_K_HIGH 4.0 [V] (p-vanooyen1999jtb, van Ooyen 1999; section 4, Fig 12(d) legend; equations (8)-(12))
- phase1_dual.DC_G_3N 50.0 [V] (p-vanooyen1999jtb, van Ooyen 1999; section 4, Fig 5(c, d) legend; equations (8)-(12))
- phase1_dual.DC_A0_3N 0.6 [V] (p-vanooyen1999jtb, van Ooyen 1999; section 4, Fig 5(c, d) legend; equations (8)-(12))
- phase1_trophic.KA_PER_M_S 48000000.0 [V] (p-vanooyen1999, van Ooyen 1999; Section 3 'Units and parameter values' (page 884); equations (1)-(5) section 2)
- phase1_trophic.KD_PER_S 0.001 [V] (p-vanooyen1999, van Ooyen 1999; Section 3 'Units and parameter values' (page 884); equations (1)-(5) section 2)
- phase1_trophic.GAMMA_RECEPTOR_PER_S 2.7e-05 [V] (p-vanooyen1999, van Ooyen 1999; Section 3 'Units and parameter values' (page 884); equations (1)-(5) section 2)
- phase1_trophic.RHO_COMPLEX_PER_S 2e-05 [V] (p-vanooyen1999, van Ooyen 1999; Section 3 'Units and parameter values' (page 884); equations (1)-(5) section 2)
- phase1_trophic.DELTA_PER_S 1e-05 [V] (p-vanooyen1999, van Ooyen 1999; Section 3 'Units and parameter values' (page 884); equations (1)-(5) section 2)
- phase1_trophic.SIGMA_M_PER_S 2e-16 [V] (p-vanooyen1999, van Ooyen 1999; Section 3 'Units and parameter values' (page 884); equations (1)-(5) section 2)
- phase1_trophic.TAU_GROWTH_H 48.0 [V] (p-vanooyen1999, van Ooyen 1999; Section 3 'Units and parameter values' (page 884); equations (1)-(5) section 2)
- phase1_trophic.VOLUME_L 1.7e-11 [V] (p-vanooyen1999, van Ooyen 1999; Section 3 'Units and parameter values' (page 884); equations (1)-(5) section 2)
- phase1_trophic.PHI0_PER_H 10.0 [V] (p-vanooyen1999, van Ooyen 1999; Section 3 'Units and parameter values' (page 884); equations (1)-(5) section 2)
- phase1_trophic.ALPHA_PER_H 300.0 [V] (p-vanooyen1999, van Ooyen 1999; Section 3 'Units and parameter values' (page 884); equations (1)-(5) section 2)
- phase1_trophic.K_HALF 100.0 [V] (p-vanooyen1999, van Ooyen 1999; Section 3 'Units and parameter values' (page 884); equations (1)-(5) section 2)
- phase1_trophic.M_HILL 1.0 [V] (p-vanooyen1999, van Ooyen 1999; Section 3 'Units and parameter values' (page 884); equations (1)-(5) section 2)
- phase1_trophic.AVOGADRO_PER_MOL 6.02214076e+23 [V] (p-codata2018, Tiesinga 2021; CODATA 2018 recommended values (Avogadro constant, exact))
- predictive_net.N_E 500 [V] (p-pmid40497329, Asabuki 2025; Table 2)
- predictive_net.N_I 500 [V] (p-pmid40497329, Asabuki 2025; Table 2)
- predictive_net.P_CONNECT 0.5 [V] (p-pmid40497329, Asabuki 2025; Table 2)
- predictive_net.DT 1.0 [V] (p-pmid40497329, Asabuki 2025; Table 2)
- predictive_net.TAU 15.0 [V] (p-pmid40497329, Asabuki 2025; Table 2)
- predictive_net.TAU_S 5.0 [V] (p-pmid40497329, Asabuki 2025; Table 2)
- predictive_net.X0 25.0 [V] (p-pmid40497329, Asabuki 2025; Table 2)
- predictive_net.RATE_MAX 50.0 [V] (p-pmid40497329, Asabuki 2025; Table 2)
- predictive_net.TAU_H_S 10.0 [V] (p-pmid40497329, Asabuki 2025; Table 2)
- predictive_net.GAIN 2.0 [V] (p-pmid40497329, Asabuki 2025; Table 2)
- predictive_net.BETA 5.0 [V] (p-pmid40497329, Asabuki 2025; Table 2)
- predictive_net.THETA 1.0 [V] (p-pmid40497329, Asabuki 2025; Table 2)
- predictive_net.EPS 0.0001 [V] (p-pmid40497329, Asabuki 2025; Table 2)
- predictive_net.W_FACTOR_ONTO_E 0.1 [V] (local-asabuki-code, Asabuki 2024; training.py)
- predictive_net.W_IN_SPREAD 0.1 [V] (p-pmid40522720, Asabuki 2025; prior_net_code.py)
- predictive_net.K_IN 80 [V] (p-ringach2021, Ringach 2021; Summary and Discussion)
- predictive_net.MS_PER_S 1000.0 (no source recorded in the vault: no status)
<!-- END GENERATED -->
