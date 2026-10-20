# Fumana UI/UX audit and beta build plan

Powered by Telos. Designed by Lexington Advisory Group.

Owner: Sirri Ayongwa (engineering). Prepared 20 October 2026. Audit target: the real application in `app/src`, not the superseded `prototype/` files.

This audits the application as it actually exists in code, then turns every gap into a build item ordered for the December 31 soft launch. It reads against `docs/acceptance_criteria.md`, `docs/fumana_build_plan.md`, and the sprint plan in `docs/sprint_plan_2026Q4.md`. Line references point at `app/src/App.jsx` (2,831 lines) and `app/src/marketing.tsx` unless noted.

---

## 1. The headline findings

Five things set the shape of the work.

1. **There is no running backend in a production build, so the assessment cannot complete on the hosted site.** This is the "works locally, breaks in production" bug Vicki hit. It is an architecture decision, not a code tweak, and it blocks the entire funnel. Highest severity.

2. **The admin portal does not exist in the code.** There is no Nexus, no admin screens, zero references. You asked for a full three-portal MVP. Two portals are built; the third is a from-scratch build. That reality has to drive the December scope, and it is the single biggest reason the full-Nexus ambition cannot land by the 31st.

3. **The design system is in good shape and matches the current spec.** Cool paper, navy ink, emerald hero, brass on verification, IBM Plex Mono for figures, the IBM Carbon shell. The old prototype palette is gone. This is a real asset; the team is not starting the look from zero.

4. **The accessibility and honesty foundations are unusually strong for a prototype.** Focus-trapped modals, aria-live toasts, genuine text-only and written interview accommodations, computed-not-generated figures, honest "backend step" labels, empty states everywhere. This is the hard-to-retrofit stuff, and it is already here.

5. **Several headline capabilities are present only as surface.** The EN and FR language toggle has no translations behind it. Low-bandwidth support does not exist in code despite being core to the mission. Auth is a pass-through on every button. These are the gaps between the pitch and the product.

---

## 2. What is actually built

- **No router.** Navigation is `useState` string switching at three levels: root `view`, per-portal `screen`, and in-portal views inside a shared `Shell`. Fine for now; a real router is a Q1 concern, not a launch blocker.
- **Candidate portal:** sign-in, consent, onboarding, assessment info, interview, dashboard, upskill, applications, wallet, coach, worth simulator, community, alchemist, CV builder, settings, fairness, audit trail, report, ethics. Broad and real.
- **Employer portal:** welcome, auth, company info, alignment, then tabs for dashboard, engage (search), pipeline, compliance and SOW, investments, saved, team, trust, fairness, report, ethics, account. Broad and real.
- **Admin portal:** none.
- **The shared store works.** A candidate who completes the assessment is written to a root-level store and appears, masked, in employer search, ranked by computed fit, behind a reveal-and-interview gate. This is the one true cross-portal data flow and it is the spine of the demo. It is also why finding 1 is so damaging: if scoring cannot complete, the candidate never enters the store, and the employer demo is unreachable.

---

## 3. The assessment, traced

This is the most important flow, so it gets its own section.

- Entry: sign-in, consent, onboarding (name, role, city, free-text experience), assessment info with accommodations, then the interview.
- **The interview is five static pre-recorded Zuri videos with fixed captions.** There is no dynamic question generation in the scored assessment. The dynamic-question capability exists only in the separate CV builder path, which is not scored.
- Three accommodation paths converge on one scoring call: default video, text-only, and a written single-form path. The accommodations are genuine, selectable up front.
- Scoring is a live call to `/api/claude` that asks for JSON over the six dimensions. The composite is then computed in code with the v1 weights, and the tier is assigned in code. The model returns only the 0-to-100 scores and rationales; all arithmetic is in code. That is correct and matches the computed-not-generated rule.
- **In demo mode, every candidate receives the identical fixed score** regardless of answers, because the demo responder returns one constant. Correct for a scripted pitch, misleading if anyone mistakes it for real scoring during a beta.

Against the rubric spec (`docs/zuri_assessment_rubric_spec.md`), the build needs: the five-video script replaced or supplemented by dynamic questions with coverage tracking, per-dimension sub-attributes surfaced, and the hardened data contract so a bad model reply degrades to retry or review instead of a dead end.

---

## 4. The production break, precisely

The `/api/claude` and `/api/tts` endpoints are Vite middleware registered only on the dev and preview servers. They are not part of a static build. The Vite config targets a static host. So on the hosted deployment there is no Node process serving those routes, and `POST /api/claude` returns the host's 404 or 405 HTML, never JSON.

Downstream, in a static deploy with no backend:

- The scoring call fails, the interview shows "scoring did not complete," and retry fails the same way forever.
- The candidate never reaches the dashboard, never enters the shared store, and the employer search demo is unreachable.
- The polite "waiting on a provider" state only appears on an HTTP 501, which the configured server returns when no provider is set. A static host returns 404 or 405 instead, so users get the harsher failure, not the graceful one.

The fix is a deployment decision: either host the two endpoints as real serverless functions on the same domain, or ship a static build pinned to a client-side demo responder for pitch-only use. For a soft launch that takes real sign-ups, it has to be the serverless backend. This is Sprint 0.

---

## 5. Gap register, by severity

Severity 1 blocks the launch. Severity 2 is visible to users or investors. Severity 3 is polish.

### Severity 1

| # | Gap | Fix | Sprint |
|---|---|---|---|
| 1 | No backend in a production build; assessment and every live-model feature 404 and dead-end. | Deploy `/api/claude` and `/api/tts` as serverless functions, or a documented static demo build. Browser never holds the key. | 0 |
| 2 | Interview score path is not 501-aware; failures show the harsh path. | Route all `/api/claude` failures through the graceful "waiting on provider" vs "retry" split the other features already use. | 0 |
| 3 | No auth or session anywhere; every sign-in button is a pass-through. | Real sign-in on employer and admin at minimum. Enterprise SSO if ready, credible interim auth if not. | 3 |
| 4 | Admin portal does not exist. | Build the lean admin defined in the roadmap: auth and roles, user management, AgentRun audit view, launch metrics. | 3 |
| 5 | Assessment is five static videos, no dynamic questions, no sub-attributes, no hardened contract. | Implement `docs/zuri_assessment_rubric_spec.md`. | 1 |

### Severity 2

| # | Gap | Fix | Sprint |
|---|---|---|---|
| 6 | Low-bandwidth support absent; no `isLowBandwidth`, no connection detection; six autoplay videos with no light path. | Add the bandwidth-aware behaviour the design doc already promises: detect, disable heavy assets and autoplay, lazy-load, keep the text path one tap away. This is core to the Africa mission, not polish. | 4 |
| 7 | EN and FR toggle is fake; no translations exist; French is claimed in marketing but absent. | Either wire real i18n for at least EN and FR, or remove the language claims until it is real. Do not ship a toggle that does nothing to real users. | 4, or cut the claim now |
| 8 | Demo scoring is identical for everyone; demo routing is brittle substring matching on the system prompt. | Acceptable for pitch demos if labelled. For beta, the live path must be the default, and the demo responder must never be mistaken for real scoring. | 1 |
| 9 | Form validation is length-only; no email format, no employer domain validation, numeric fields accept absurd values. | Add real validation on onboarding, employer email domain, and all numeric inputs. | 2, 3 |
| 10 | Touch targets below 44px on small buttons, mono links, and the mobile bottom nav. | Raise interactive targets to the mobile minimum. | 4 |
| 11 | Small mono micro-copy at 10.5 to 11px in light slate likely fails AA contrast. | Raise size or darken for small text to pass AA. | 4 |

### Severity 3

| # | Gap | Fix | Sprint |
|---|---|---|---|
| 12 | Body font drift: Inter in the app and IBM Plex Sans in marketing, beyond the Hanken Grotesk plus IBM Plex Mono spec. | Decide the body face and apply it on both sides, or document the third face as intended. | 4 |
| 13 | Marketing copy uses uppercase mono and techy strings that read against the soft sentence-case rule. | Copy pass for the sentence-case and no-screaming rule. | 4 |
| 14 | In-video interview has no in-flight "switch to text" escape; accommodations are opt-in before starting only. | Add a mid-interview switch to the text path. | 2 |
| 15 | State resets on reload; in-memory only. | Acceptable for the demo. For beta, persist profiles to the document store. | 2, 3 |
| 16 | The Zuri dock has no retry on a failed send. | Add the retry pattern the other features use. | 4 |

---

## 6. What is already good, so it is not broken in the rush

Keep these. They are the expensive-to-build parts and they are done well.

- The Carbon shell shared across portals. Phase 0 item 1 is complete.
- The shared candidate-to-employer store. Phase 0 item 2 is complete.
- Focus-trapped modals, aria-live toasts, aria-current nav, reduced-motion support, the font-size control.
- Genuine interview accommodations: text-only and written paths.
- Computed-not-generated figures throughout, with illustrative figures honestly labelled.
- Honest "runs on the backend" labels instead of fake success.
- Empty states on every list, loading spinners on every model call, and a graceful TTS fallback to the browser speech engine.
- The governance surface: contest, human review, audit trail, fairness page, ethics page, all present even if some queues are stubbed.

---

## 7. The build plan, ordered

This maps the gap register onto the sprints in `docs/sprint_plan_2026Q4.md`. The audit does not change the sprint sequence; it populates it with specifics.

- **Sprint 0:** gaps 1, 2. The backend and the graceful failure path. Nothing else until the hosted assessment completes.
- **Sprint 1:** gaps 5, 8. The rubric, dynamic questions, sub-attributes, hardened contract, live path as default.
- **Sprint 2:** gaps 9 (candidate), 14, 15 (candidate). Validation, the mid-interview text escape, profile persistence.
- **Sprint 3:** gaps 3, 4, 9 (employer), 15 (employer). Auth, the lean admin portal, employer validation and persistence.
- **Sprint 4:** gaps 6, 7, 10, 11, 12, 13, 16. The hardening pass: low-bandwidth, i18n decision, touch targets, contrast, fonts, copy, dock retry.

---

## 8. The one thing to decide now

The full three-portal MVP you asked for requires building the admin portal from nothing while also hardening two portals and fixing the production break, in ten weeks, bootstrapped. It is possible only if admin stays lean: user management, the audit trail, and metrics. If admin needs to be more than that for December 31, something in the candidate or employer depth has to move to Q1. The roadmap holds the lean-admin line by default. Say the word if you want the trade run the other way.
