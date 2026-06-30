# Fumana demo acceptance criteria

The demo is done when every box below is true. Not before, and not after adding more. If a box is not checked, the demo is not done. If a feature is not on this list, it is out of scope for the demo.

Powered by Telos. Designed by Lexington Advisory Group.

---

## The one-line definition of done

A viewer can move through four beats in order, a builder's messy account becomes a verified profile, Telos shows why that builder fits an employer, the employer sees a masked profile and a generated SOW, and a placement produces an SROI figure that shows its own math and re-derives live when a currency move is triggered. All language output is live. All figures are computed.

---

## Beat 1, Builder

- [ ] The builder's informal account can be entered and edited.
- [ ] Running the Experience Alchemist makes a live model call and returns a headline, outcomes, skills, and an integrity note.
- [ ] Each outcome shows its basis, the part of the account it came from.
- [ ] The integrity note states what was claimed and what was not.
- [ ] While the call runs, a loading state is visible. On failure, a recovery action is shown, not a dead end.

## Beat 2, Telos match

- [ ] A causal confidence figure is shown and clearly marked as a seeded demo value.
- [ ] The named factors and their weights are visible.
- [ ] Asking Zuri makes a live model call and returns four to six sentences of causal reasoning.
- [ ] Zuri references the named factors and connects them to the employer need.

## Beat 3, Employer

- [ ] The builder profile is shown with name, location, photo, and gender withheld.
- [ ] Verified capabilities are visible.
- [ ] Generating the Statement of Work makes a live model call and returns title, scope, deliverables, IP clause, EOR note, and term.
- [ ] The EOR note references that remittance is handled, with no specific rate asserted.

## Beat 4, EESG impact

- [ ] The SROI derivation is shown as labelled rows: engagement, rate, gross local, retention, retained capital.
- [ ] Every figure is computed in code from the visible inputs, not produced by the model.
- [ ] SDG tags are shown.
- [ ] Triggering a currency move recomputes the figures in code and makes a live model call returning the two agents' narration.
- [ ] The before and after states are both reachable, and reset works.

---

## Cross-cutting

- [ ] The four beats are navigable in order, and a viewer can also move between them freely.
- [ ] The Fumana brand is applied: cool paper, navy ink, cleared emerald as the only hero, brass on verification only, Hanken Grotesk and IBM Plex Mono.
- [ ] Every figure on screen is set in monospaced numerals.
- [ ] No em dashes, sentence case, no charity language anywhere in the copy.
- [ ] The footer or header carries "Powered by Telos" and "Designed by Lexington Advisory Group".
- [ ] Loading and error states exist for all four live calls.
- [ ] The layout holds on a narrow mobile screen.

---

## Explicitly out of scope for the demo

These are real platform features, documented elsewhere, that the demo does not need. Building them now is gold-plating.

- Authentication, accounts, and enterprise SSO.
- A real Bayesian CCM engine. The match score is seeded.
- A Neo4j graph. The demo persists documents only.
- Payments, escrow, and real money movement.
- The admin portal, Nexus.
- FIND Squads, the anti-ghosting feedback engine, the Infrastructure Advance unlock, the upskilling tracks, and WhatsApp onboarding.
- Persistence across sessions. The demo can hold state in memory.

---

## How to use this

When every demo box is checked and nothing from the out-of-scope list has crept in, stop and ship the demo. New ideas go on a separate list for after the demo proves the thing works.
