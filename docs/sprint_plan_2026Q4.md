# Fumana sprint plan: now to December 31 soft launch, with Q1 and Q2 outline

Powered by Telos. Designed by Lexington Advisory Group.

Companion to `docs/roadmap_2026Q4_to_2027Q2.md`. The roadmap says what and why. This says when and who, sprint by sprint. Ten weeks to the soft launch, in five two-week sprints, then a Q1 and Q2 outline.

Cadence: two-week sprints, bi-weekly executive review already on the calendar. Each sprint lists its goal, the deliverables with an owner, the exit check, and the gate work that runs alongside. Owners are role-based: ENG (Sirri plus engineers), PROD (Cyrus), SWE-AI (the specialist prompt and assessment engineer the team agreed to engage), GTM (Jeremy), MKT (Sam and Vicki), LEGAL (the delegated reviewer).

A note on capacity. This is a bootstrapped team with a part-time revenue lead and an engineering lead who is also a job seeker and a student. The plan is aggressive for that reality. Where a sprint is overloaded, the "if something gives" line says what to protect.

---

## Sprint 0: stop the bleeding (20 Oct to 31 Oct)

**Goal.** The assessment completes on the hosted site, and there is a real backend to serve the model proxy. Nothing else matters until this is true.

| Deliverable | Owner | Track |
|---|---|---|
| Diagnose and fix the production break. The model proxy is a dev-only Vite plugin, so a static build has no `/api/claude`. Stand up a real backend that serves it (a small Node service, or serverless functions on the host). | ENG | A |
| Move the four live calls to the real backend. Browser never holds the key. Confirm the hosted assessment runs end to end with a provider configured. | ENG | A |
| Set `DEMO_MODE` correctly per environment: true for pitch demos, false with a provider for the live path. Document the switch in the deploy runbook. | ENG | A |
| Fix the specific assessment flow break Vicki hit. Reproduce on hosted, confirm fixed on hosted, not only local. | ENG | A |
| Write the deploy runbook: build, env, backend, health check. | ENG | A |

**Exit check.** A new person can sign in to the hosted site, complete the assessment, and see a score, with a provider live. The same flow does not 404 on `/api/claude`.

**Gate work alongside.** PROD drafts the Lexington licensing proposal (owed this week). PROD writes the rubric (Saturday 25 Oct target), which feeds Sprint 1.

**If something gives.** Nothing. This sprint is the floor. Everything downstream assumes a working hosted assessment and a real backend.

---

## Sprint 1: the rubric is real, and the shell is paid down (1 Nov to 14 Nov)

**Goal.** Scoring shows its basis, the question set is dynamic beyond five, and the Carbon shell lands so later features are not rebuilt.

| Deliverable | Owner | Track |
|---|---|---|
| Implement the assessment rubric per `docs/zuri_assessment_rubric_spec.md`: six dimensions, bands, per-dimension sub-attributes, deterministic aggregation in code. | SWE-AI, ENG | A |
| Expand the interview beyond five questions, dynamic from profile and prior answers, per Zuri Prompt 1. Retire the five pre-recorded videos as the sole path, or keep them only as a labelled fallback. | SWE-AI | A |
| Score transparency: the dashboard shows, per dimension, the score, the band, and the one-sentence basis. "95 based on what" is answered on screen. | ENG | A |
| Carbon shell, shared across candidate and employer, per build plan Phase 0 item 1. | ENG | A |
| Shared in-memory store: a profile finished on the candidate side appears, masked, in employer search. Build plan Phase 0 item 2. | ENG | A |

**Exit check.** A completed interview yields a rubric-based score whose every dimension shows its basis, and the finished profile appears masked in employer search. Both portals render in the Carbon shell.

**Gate work alongside.** LEGAL continues document review. MKT resolves the website positioning copy (professionals, not only engineers).

**If something gives.** Protect the rubric and score transparency. The Carbon shell can slip a few days into Sprint 2 if forced, but the longer it waits the more rework it causes.

---

## Sprint 2: candidate portal end to end (15 Nov to 28 Nov)

**Goal.** A builder can go from sign-up to a complete, honest, contestable profile.

| Deliverable | Owner | Track |
|---|---|---|
| Experience Alchemist as a first-class screen: live call, outcomes with basis, integrity note, save and copy. | ENG, SWE-AI | A |
| Applications and hub: matches, applied roles, interview invites, status per application, reading the shared store. | ENG | A |
| Wallet and payouts UI: balance, partner-held funds, payout history, gateway placeholders (M-Pesa, Paystack, Flutterwave), all computed and flagged that real payments are backend. | ENG | A |
| Settings and the data vault: language, notification toggles, export, delete. | ENG | A |
| Contest a score, request human review, decision audit trail. Build plan Phase 4 A, B, E. | ENG | A |
| Accommodations on the responsible-AI step, text-only path promoted to a chosen option. Build plan Phase 4 C. | ENG | A |

**Exit check.** A builder completes onboarding, assessment, and Alchemist, sees a transparent score, can contest it, and can read a log of what happened to their data.

**Gate work alongside.** PROD and LEGAL review the governance copy draft. Brand decision due by 1 Dec, so the footer and consent copy are final before Sprint 3 ends.

**If something gives.** Protect assessment, Alchemist, and contest-a-score. Wallet UI can ship thinner.

---

## Sprint 3: employer and lean admin (29 Nov to 12 Dec)

**Goal.** An employer can find, shortlist, and generate an SOW for a masked builder. An admin can run the launch.

| Deliverable | Owner | Track |
|---|---|---|
| Employer auth: enterprise SSO if ready, otherwise a credible interim sign-in. Admin auth with role-based access. | ENG | A |
| Engage Experts search rebuilt on the shared store, bias-shielded cards, reveal-and-interview gate. | ENG | A |
| Talent pipeline Kanban: shortlisted, interviewing, SOW pending, cards move. | ENG | A |
| SOW generation: localized, engagement route and IP assignment language, no asserted tax rates. | ENG, SWE-AI | A |
| Investments and fee waterfall, computed. | ENG | A |
| Lean admin: user list, verify and suspend, AgentRun audit-trail view, launch metrics. | ENG | A |
| EESG impact Beat 4 confirmed solid for the pitch: live re-derivation, reset works. | ENG | A |

**Exit check.** An employer signs in, searches, shortlists a masked builder, and generates an SOW. An admin verifies a user and reads the model-call audit trail. The four-beat demo runs clean start to finish.

**Code freeze for hardening begins 12 Dec.**

**If something gives.** Protect employer search, the reveal gate, SOW generation, and the four-beat demo. Admin can ship with user management and the audit trail only; metrics can come from Google Analytics directly if the in-app metrics view slips.

---

## Sprint 4: harden and clear the gates (13 Dec to 31 Dec)

**Goal.** No new features. Make what exists not break, and clear everything that is not code.

| Deliverable | Owner | Track |
|---|---|---|
| Loading, error, empty, and retry states on every live call and every list. No dead ends. | ENG | A |
| Low-bandwidth pass: the `isLowBandwidth` behaviour real, initial load within the stated budget, assets lazy. | ENG | A |
| Accessibility pass: keyboard nav, focus, alt text, contrast against the Fumana palette, touch targets, the interview text fallback honored as an accommodation. | ENG | A |
| Mobile pass: every screen holds on a narrow screen. | ENG | A |
| Google Analytics wired, events for the funnel. | ENG, GTM | A |
| Final copy pass: no em dashes, sentence case, no charity language, footer line correct, brand decision applied. | PROD, MKT | A |
| Investor deck final, short platform videos on F6S. | PROD, GTM | A |

**Gates, all due before launch.** Lexington license executed (15 Dec). Brand ratified (1 Dec, applied here). Legal and governance copy reviewed (19 Dec).

**Exit check.** The soft launch definition in the roadmap is met: live, taking sign-ups, analytics flowing, pitch-ready, gates cleared.

**If something gives.** Nothing ships that asserts a legal specific not verified, and nothing ships carrying Telos or E2SG if the license is not signed. Those are hard stops, not trade-offs.

---

## Q1 2027 outline (Jan to Mar): acquisition and depth

Run in two-week sprints against two parallel tracks.

- **GTM track:** contact-list build across Africa, the two-month TikTok and Instagram campaign, investor meetings off live metrics.
- **Product track (A):** FIND Squads functional, upskilling tracks wired to rubric gaps, anti-ghosting feedback engine, employer compliance hub, score transparency plus, fairness posture page.

Milestone: a real assessed cohort visible to employers, one engagement through to an SOW, a clean metrics story.

---

## Q2 2027 outline (Apr to Jun): the engine (Track B)

- Telos CCM phase one: reasoning graph projected from the document store, Bayesian match confidence replacing the seeded value, real trajectory forecast.
- MOE agents as named services with audit records.
- Admin Nexus operational: economic governor, FX corridors, crisis kill-switch, infrastructure telemetry, arbitration workspace.
- Infrastructure Advance real, tied to a workspace verifier.

Milestone: a computed trajectory probability with named factors, and an admin economic multiplier that propagates.

---

## Dependencies that will bite if ignored

1. The real backend (Sprint 0) gates every live feature after it.
2. The Carbon shell (Sprint 1) gates clean feature work; the longer it waits, the more rework.
3. The rubric (Sprint 1) gates the dashboard, contest-a-score, and the fairness page.
4. The shared store (Sprint 1) gates employer search and the pipeline.
5. The Lexington license gates the entire production launch, not a feature. Move it early.
6. Splitting the 2,831-line `App.jsx` is assumed work inside Sprints 1 to 3, not a separate line. If it is not done incrementally, Sprint 4 hardening becomes very hard.
