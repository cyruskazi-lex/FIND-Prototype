# Fumana product and engineering roadmap: soft launch to Q2 2027

Powered by Telos. Designed by Lexington Advisory Group.

Owner: Cyrus Z. Kazi (product). Engineering: Sirri Ayongwa. Prepared 20 October 2026.

This roadmap sequences the work from today to the end of Q2 2027. It is built on three documents that already govern this repository, and it does not restate them: `docs/canonical_schema.md` for the data model, `docs/fumana_build_plan.md` for the phased feature build, and `docs/acceptance_criteria.md` for the demo definition of done. Where this roadmap adds time boxes, gates, and scope cuts that those documents do not carry, it says so plainly.

---

## 1. What changed on 20 October, and why this roadmap exists

Three decisions from the 20 October executive sync reset the plan.

1. **December 31 is an internal soft launch, not a public hard launch.** The target is a live platform that can take real sign-ups, feed Google Analytics, support investor pitching, and anchor a two-month Q1 acquisition push across Africa. It is a soft launch by design. The polish bar is "credible in front of an investor and a first cohort of real users," not "feature-complete."

2. **The assessment broke in production.** It runs locally and fails on the hosted deployment. The scoring rubric that defines how Zuri turns an interview into a number does not exist yet in written form. Both are now the highest-priority engineering and product items, and both have dedicated specs in this set (`docs/uiux_audit_and_build_plan.md` for the break, `docs/zuri_assessment_rubric_spec.md` for the rubric).

3. **Two non-code gates now sit in front of launch.** The Lexington licensing agreement for Telos and the E2SG framework must be executed before anything carrying those names goes to production. The brand architecture between Fumana and FIND Services is not settled. Neither is an engineering task. Both can stop a launch that is otherwise ready, so both are tracked here as gates.

---

## 2. The scope reconciliation you need to see first

You asked for a full three-portal MVP and for nothing to be left unturned. The existing `docs/acceptance_criteria.md` puts the admin portal, FIND Squads, auth, and payments explicitly out of scope. Those two instructions disagree. Rather than silently pick one, here is the reconciliation this roadmap runs on.

- **The four-beat demo is the spine, and it must be bulletproof.** Builder profile through Experience Alchemist, Telos match with reasoning, employer masked view with generated SOW, EESG impact with live re-derivation. This is what wins an investor meeting. It is mostly built. It must never break in a pitch.
- **The soft launch builds the candidate and employer portals outward from that spine into something a real user can complete end to end.** This is more than the demo and less than the full PRD platform.
- **The admin portal ships lean and operational, not full Nexus.** For a soft launch with a small cohort, admin means: see users, verify or suspend them, watch the model-call audit trail, and pull the metrics an investor will ask for. The full Nexus command surface (economic governor, FX corridors, infrastructure telemetry, arbitration fortress) is Q1 and Q2 work. A bootstrapped team cannot build the God-view in ten weeks, and it does not need to for a soft launch.

The cut line is in section 5. If you want admin to be more than lean for December 31, that decision costs candidate and employer depth, and section 5 shows the trade.

---

## 3. The two tracks

The architecture documents describe the Telos CCM: a Neo4j reasoning graph, a Bayesian belief network, multi-hop causal inference. The live build is a React application with a provider-agnostic LLM proxy, and the match score is a seeded, labelled value. That is not a contradiction to hide. It is the plan.

- **Track A, the product that ships.** React, the LLM proxy behind a real backend, documents in a document store, figures computed in code, language generated live. Everything in the December 31 soft launch is Track A.
- **Track B, the engine that earns the moat.** The CCM graph, Bayesian trajectory forecasting, the MOE agents as real services. Track B is Q1 and Q2. It projects from the same canonical entities, so Track A data is not thrown away when Track B arrives.

Every item below is tagged A or B.

---

## 4. Milestones

| Milestone | Date | Definition |
|---|---|---|
| Production break fixed | 31 Oct 2026 | Assessment completes on the hosted deployment, not only locally. A real backend serves the model proxy. |
| Rubric defined and wired | 7 Nov 2026 | The scoring rubric is written, versioned, and the assessment reads it. Scores show their basis. |
| Feature-complete for soft launch | 12 Dec 2026 | All December scope built and in staging. Code freeze for hardening begins. |
| Gates cleared | 19 Dec 2026 | Lexington license executed. Brand decision made. Legal copy reviewed. |
| Soft launch | 31 Dec 2026 | Live, taking real sign-ups, analytics flowing, pitch-ready. |
| Q1 acquisition and depth | 31 Mar 2027 | Two-month campaign run. Squads, upskilling, anti-ghosting, employer depth shipped. |
| Q2 engine and scale | 30 Jun 2027 | CCM graph live for trajectory forecasting. Admin Nexus operational. Infrastructure Advance real. |

---

## 5. December 31 soft launch: the scope cut

This is the hard list. In scope is built and hardened by December 12. Everything else moves to Q1 or later.

### In scope, candidate portal (Track A)

- Onboarding, consent, and the responsible-AI step, including accommodations (text-only path promoted from fallback to a chosen option).
- The assessment: interview, dynamic question set beyond the current five, rubric-based scoring that shows its basis per dimension. This is the centre of the launch.
- Growth dashboard: scores with per-dimension evidence, profile strength, trajectory view as a computed and labelled near-term version.
- Experience Alchemist as a first-class screen.
- Applications and hub, wallet and payouts as display and computed (funds held by licensed partners) (real payments are backend, flagged), settings with the data vault.
- Contest a score, request human review, decision audit trail. These are launch-critical because the platform judges people, and a soft launch still judges real people.

### In scope, employer portal (Track A)

- SSO sign-in, or a credible interim auth if enterprise SSO is not ready. Auth is required for a real soft launch; the demo had none.
- Engage Experts search on the shared store, bias-shielded cards, reveal-and-interview gate.
- Talent pipeline Kanban: shortlisted, interviewing, SOW pending.
- SOW generation, localized, with the engagement route and IP assignment language, general and honest, no asserted tax rates.
- Investments and the fee waterfall, all computed.

### In scope, admin portal, lean (Track A)

- Admin auth with role-based access.
- User management: list, verify, suspend builders and employers.
- The model-call audit trail (AgentRun records) as a readable view. This is how you answer "why did Zuri score this person that way" when a user contests.
- Launch metrics: sign-ups, completions, matches, for the investor conversation and Google Analytics cross-check.

### Deferred to Q1, with reason

- FIND Squads. Real multiplayer needs the shared store mature and squad bidding flows; it is depth, not launch.
- Upskilling tracks and anti-ghosting intervention engine. Valuable, but they assume score data at volume that a soft launch does not yet have.
- Infrastructure Advance unlock, Global Worth Simulator as full feature, Culture Shock Simulator. Documented, not launch-critical.
- WhatsApp onboarding.

### Deferred to Q2, with reason

- The full Nexus admin command surface: economic governor, FX corridor management, crisis kill-switch, infrastructure telemetry God-view, arbitration fortress.
- The Telos CCM engine itself: Neo4j graph, Bayesian trajectory forecasting, MOE agents as services. Track B.

---

## 6. The gates that are not code

A gate blocks launch even when the software is ready. Do not let these slip to late December.

### Gate 1: Lexington licensing (owner: Cyrus, recused from the vote)

Telos, the E2SG framework, and the tool referred to as "Hello" are Lexington property. They were used for the demo. Production use needs a formal licensing agreement between Lexington Advisory Group and FIND Services, plus the code review by Lexington's lead engineer that the proposal describes. Until that paper is signed, the product cannot ship to production carrying those names or that framework. Target execution: 15 December. If it is at risk, the fallback is a launch that holds the Telos brand and the E2SG framework out of the production surface until the license lands, which is worse for the pitch and should be avoided by moving the paper early.

### Gate 2: brand architecture (owner: executive team)

Fumana is the product. FIND Services is the venture. The single-brand direction (Fumana forward, FIND Services as the umbrella in the footer) is proposed and not ratified. The product footer, the marketing site, the SSO consent screens, and the investor deck all need one answer. Decide by 1 December so the copy and the deck are not rebuilt in the final sprint. This roadmap and the other documents use "Fumana (platform), FIND Services (umbrella)" until told otherwise.

### Gate 3: legal and AI-governance copy (owner: delegated legal reviewer, with Sirri)

The platform makes automated decisions about people across jurisdictions. The plain-language ethics and data page, the fair-terms pledge, and any statutory references must be reviewed before real users arrive. No unverified legal specifics in the product. Target: 19 December.


### Gates added on 23 October

- **Data residency.** Counsel approves the design before real users arrive. Storage, speech to text, and identifier scrubbing run in region, and nothing identifying leaves without consent and a processor agreement.
- **Employer demand.** Twenty employer interviews and three signed letters of intent by 18 December, before the Q1 campaign.
- **Engagement model.** Fumana is not the employer of record. Every statement of work names an engagement route, and no text says Fumana employs anyone or handles tax.

---

## 7. Q1 2027: acquisition and depth

Two things run in parallel.

- **Go to market.** The two-month campaign: candidate and employer contact lists across Africa, the TikTok and Instagram program on the "AI makes your work better" message, investor pitching off the live platform and real early metrics.
- **Product depth (Track A).** FIND Squads functional, upskilling tracks wired to rubric gaps, the anti-ghosting feedback engine (rejection produces a named missing-skill reason and a next step), employer compliance hub, score transparency plus, fairness posture page.

Exit criteria for Q1: a real cohort of builders assessed and visible to employers, at least one employer engagement moving through the pipeline to an SOW, and a metrics story an investor can read without a footnote.

---

## 8. Q2 2027: the engine and scale (Track B)

This is where the architecture documents become real.

- **Telos CCM, phase one.** Stand up the reasoning graph projected from the document store, per `docs/canonical_schema.md`. Replace the seeded match confidence with a computed Bayesian value. Trajectory forecast becomes real: the "add this skill, your hire probability moves to X" claim is math, not a seeded display.
- **MOE agents as services.** Ingestion, Compliance, Economics, Infrastructure as named Telos agents behind the proxy, each with its own audit record.
- **Admin Nexus, operational.** Economic governor for PPP multipliers, FX corridor health, the crisis kill-switch, infrastructure telemetry, the arbitration workspace that audits artifacts against SOWs.
- **Infrastructure Advance, real.** The Starlink and solar unlock tied to a workspace verifier signal, not a static badge.

Exit criteria for Q2: a candidate's trajectory forecast is a computed probability with named factors, and an admin can adjust an economic multiplier and see it propagate.

---

## 9. How the MOE agents work together, in one concrete case

Per the project communication rules, here is one worked example of agent interaction, a currency crisis during an active engagement.

A builder in Lagos has an active Engagement at a fixed monthly USD figure. The naira drops sharply. The Telos Economics Agent detects the FX move against the stored FxRate and proposes an inflation patch: the local-currency value of the same USD payment has shifted, and the PPP multiplier that keeps pay equitable needs review. It does not change the contract. It hands the Compliance Agent a proposed, localized update to the Statement of Work: the same USD scope, with the dignity-floor language and any statutory reference re-checked against the Jurisdiction record. The Compliance Agent regenerates the SOW narration, asserting no specific tax rate, only that remittance is handled. Every figure in the new SROI row is computed in code from the new FxRate and stored with its inputs, so the derivation is inspectable. Zuri narrates the change to both sides in plain language, and the whole exchange is logged as AgentRun records. The model explains; it never invents the number.

In the December build this runs as Beat 4 with live re-derivation. In Q2 it runs continuously as real agent services.

---

## 10. The honest risks

- **Ten weeks, bootstrapped, to a three-portal soft launch is tight.** The candidate assessment alone, done to the rubric standard, is most of November. If something has to give, protect the assessment and the four-beat spine. A thin but flawless demo beats a broad but broken platform in a pitch.
- **One 2,831-line `App.jsx` holds every portal and screen.** That is the biggest structural drag on the December pace. The build plan's Phase 0 Carbon shell is the right pay-down, but splitting this file is itself a sprint of work. Budget for it.
- **The production backend does not exist yet.** The model proxy is a dev-only Vite plugin. A real deployable backend is a hard dependency for the October 31 milestone, not a detail.
- **Auth is absent.** A real soft launch with real users needs sign-in on at least the employer side and admin. This was out of scope for the demo and is in scope now, and it is not small.
- **The rubric is IP and a legal-risk surface at once.** Getting it written is a product task; getting it defensible (bias, accommodations, contestability) is a governance task. Both are on the critical path.

Sprint-level detail for all of this is in `docs/sprint_plan_2026Q4.md`.
