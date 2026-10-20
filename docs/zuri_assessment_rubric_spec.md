# Zuri assessment rubric specification

Powered by Telos. Designed by Lexington Advisory Group.

Owner: Cyrus Z. Kazi. Engineering: Sirri Ayongwa plus the AI assessment engineer. Version 1.0, 20 October 2026.

This is the document the 20 October sync said was missing. It defines how Zuri turns an interview into a score, what each number means, and how the system stays reliable in production instead of breaking. It builds on three files already in this repository and does not restate them: `agents/zuri_voice_and_prompts.md` (the prompts and the six dimensions), `docs/Zuri_Character_Spec.md` (her character and the behavioural state machine), and `docs/canonical_schema.md` (the AgentRun record and the data model). Where those stop, this begins: the sub-attributes behind each dimension, the aggregation math, the dynamic question logic, and the guardrails that keep it from falling over.

---

## 1. The two problems this solves

The sync named them directly.

1. **"95 percent based on what."** A score with no stated basis is not defensible and is not IP. This spec makes every dimension score traceable to named sub-attributes and to things the candidate actually said.

2. **"It works locally and breaks in production."** An assessment that depends on a free-form model reply is fragile: the model can return prose instead of JSON, miss a dimension, invent a number, or time out, and the dashboard that expects a fixed shape breaks. This spec makes the scoring a strict contract with code owning the structure and the model owning only the judgment inside each field.

The design rule that resolves both: **the model judges, code decides the shape and does the math.** The language layer rates evidence against named criteria. Code validates the response, fills gaps safely, aggregates, and bands. No screen ever reads a raw model reply.

---

## 2. What the score is made of

Six dimensions, already fixed in `agents/zuri_voice_and_prompts.md`. Each dimension is now defined by three to four sub-attributes. The sub-attributes are the answer to "based on what." They are shown to the candidate on the transparency view and they are the rubric's core IP.

### Technical depth
- Mechanical specificity: explains how, not just what. Names the actual approach, tool, or step.
- Decision quality: can say why this path over another, and the trade-off it cost.
- Edge awareness: knows where the approach breaks or fails at scale.
- Ownership of the technical work: drove it, did not just stand near it.

### Communication clarity
- Structure: an answer has a shape, not a ramble.
- Concision: makes the point without padding. (Spoken fillers and transcription noise are not penalised.)
- Precision of language: specific nouns and verbs, not vague gestures.
- Intelligibility to a non-local employer: would a hiring manager in another country follow this.

### Async and remote readiness
- Written-update habit: posts status without being chased.
- Proactive clarification: asks before guessing, flags blockers early.
- Self-direction: makes reasonable calls without waiting to be told.
- Timezone and handoff awareness: leaves work others can pick up.

### Professionalism
- Follow-through: does what was committed.
- Conduct under friction: stays even when pushed or challenged.
- Reliability signals: shows up to the commitment as made.
- Integrity: does not overclaim, corrects the record.

### Collaboration
- Credit honesty: distinguishes "I" from "we" truthfully.
- Conflict handling: disagreement without damage.
- Receptiveness: takes a correction and uses it.
- Lift: makes the people around them better.

### Problem solving
- Problem framing: distils a messy situation to the real question.
- Resourcefulness: solves with what is available, the "African hustle" strength named honestly as a strength.
- Systems thinking: sees upstream and downstream effects.
- Constraint awareness: names the limits and blind spots in their own solution, voluntarily.

A dimension score is a judgment across its sub-attributes, not a mechanical average of them. The sub-attributes are the evidence lens and the explanation; the dimension score is the honest read.

---

## 3. The bands

Fixed from the prompt library, repeated here because the whole system depends on them holding.

| Band | Range | Meaning |
|---|---|---|
| Exceptional | 90 to 100 | Rare. Reserve it. |
| Strong | 75 to 89 | Ready for enterprise work. |
| Solid | 60 to 74 | Capable with clear, nameable gaps. |
| Developing | 40 to 59 | Real gaps that would affect hiring. |
| Early | below 40 | Significant gaps to close before global roles. |

Bands stop grade inflation. A 95 means exceptional and rare, not "did well." The model is instructed to reserve the top band, and code does not override the model upward.

---

## 4. Aggregation: how the dimensions become a headline

The dashboard shows per-dimension scores and sometimes a single profile-strength number. That number is computed in code, never by the model, consistent with the repository rule that figures are calculated.

```
profileStrength = round( sum(dimensionScore_i * weight_i) )   // 0 to 100, Computed
```

The weights below are the ones already in the code (`WEIGHTS` in `App.jsx`), captured here as weight set v1 so they are documented rather than buried. They are tunable later with evidence, and every score stores the weight set id it used so any number is reproducible:

| Dimension | Weight set v1 (as built) |
|---|---|
| Technical depth | 0.30 |
| Communication clarity | 0.16 |
| Async and remote readiness | 0.16 |
| Professionalism | 0.14 |
| Collaboration | 0.12 |
| Problem solving | 0.12 |

A note for the owner: v1 leans hard on technical depth at 0.30. For a platform that also places non-technical professionals (the positioning widened to "professionals," not only engineers), that weighting may undersell communication and problem solving for non-engineering roles. Decide in section 10 whether to keep one weight set or vary it by role family.

The weights live in a versioned config, not in a prompt and not scattered in components. A score record stores the weight set id it used. Change the weights and old scores still explain themselves. This is also what lets a role or an employer later weight dimensions differently without rewriting the engine.

---

## 5. Dynamic questions, beyond five

The sync asked for three things: more than five questions, questions that adapt to the candidate's profile, and questions that are specific, not vague. The mechanism, using Zuri Prompt 1 as the base:

- **Coverage target, not a fixed count.** The interview continues until every dimension has enough evidence to score, within a floor and a ceiling (for example six to ten questions). Code tracks coverage per dimension and tells the prompt which dimensions are still thin.
- **Profile-seeded opening.** The first questions are shaped by the builder's stated role and profile, so a backend engineer and a nursing candidate do not get the same script.
- **Adaptive follow-up.** The behavioural state machine in `docs/Zuri_Character_Spec.md` already defines the follow-up logic: an "I" versus "we" probe, a specificity probe on jargon, an edge probe on a success, a neutral progression on a good answer. These run live, one question per turn.
- **Relevance guard.** A question that does not map to a dimension or a thread the candidate opened is not asked. The prompt is instructed to never ask filler.

Coverage tracking is code, not vibe. The model proposes the next question; code decides when coverage is sufficient to stop.

---

## 6. The data contract that stops the breakage

This is the heart of "function without breaking down." The assessment call returns one shape, and code guarantees the dashboard always receives a valid object.

**Model returns only this, no preamble, no fences** (already the Prompt 2 contract, extended with sub-attributes):

```json
{
  "dimensions": [
    {
      "name": "Technical depth",
      "score": 0,
      "rationale": "one specific sentence naming the real reason",
      "subAttributes": [
        { "name": "Mechanical specificity", "note": "short evidence-anchored note" }
      ]
    }
  ],
  "marketability": "one honest sentence",
  "recommendations": ["actionable step", "actionable step"]
}
```

**Code wraps every call with these guarantees, in order:**

1. **Strip and parse.** Remove any stray fences, parse JSON. If parse fails, go to step 5.
2. **Validate the shape.** Exactly the six dimension names, each score a number 0 to 100, rationale non-empty. Clamp any out-of-range score into range rather than trusting it.
3. **Fill safely.** A missing dimension is scored null and flagged "needs review," not silently zeroed and not invented. A missing rationale gets a neutral placeholder and a review flag.
4. **Aggregate in code.** Compute profileStrength from the validated dimension scores and the stored weight set. The model never produces this number.
5. **Fail soft, never dead.** On parse failure or a timeout, the candidate sees "we could not score this attempt, retry," with the interview answers preserved, not lost. One retry is automatic; a second failure routes to human review. The flow never ends on a stack trace, consistent with the error-handling rule in `docs/api_integration_notes.md`.
6. **Record it.** Write an AgentRun per `docs/canonical_schema.md`: agent "zuri," the input reference, the full validated output, the model id, the timestamp, and the weight set id. This is the record an admin reads when a candidate contests, and it is how the score is auditable.

Because the dashboard reads the validated, code-owned object and never the raw reply, a messy model response degrades to "retry" or "under review," never to a broken screen.

---

## 7. Determinism, so the same person is not scored differently each run

A pure language model is not deterministic, and an assessment that swings between runs is not trustworthy. Controls:

- **Low temperature** on the scoring call. Judgment, not creativity.
- **Fixed rubric, fixed bands, fixed sub-attributes** in the system prompt, versioned. The criteria do not drift between candidates.
- **Evidence anchoring required.** Every rationale must name something the candidate actually said. A score with no anchor is flagged for review, not shown as final.
- **Code owns all math.** Aggregation and banding are deterministic by construction.
- **Re-score reproducibility.** Because the transcript, the rubric version, and the weight set id are stored, a score can be re-derived and compared. Drift is detectable, not invisible.

The result is not bit-for-bit identical across runs, which no language assessment can promise, but it is stable, anchored, and auditable, which is what "does not break down" actually requires.

---

## 8. Fairness and the legal-risk surface

The platform scores real people across jurisdictions, so the rubric is a governance object as much as a product one. These are non-negotiable and tie to build plan Phase 4.

- **Transcription noise is never penalised.** Spoken fillers, accent, and transcription errors do not lower a score. This is stated in the prompt and must stay.
- **Accommodations do not lower the bar.** Extra time, a text interview instead of spoken, screen-reader mode. The text path is a first-class option, not an error fallback. Scoring spoken English disadvantages non-native speakers unless this exists.
- **Resourcefulness is a strength, not a deficit.** Informal and gig experience is scored as capability, per the Experience Alchemist philosophy. The rubric does not treat a non-Western career path as a gap.
- **Every score is contestable.** A candidate can challenge any dimension, the dimension shows "under review," a human looks, and the contest and outcome are logged. Build plan Phase 4 A and E.
- **Human review is always reachable**, not only before the assessment.
- **The fairness posture is published.** A page states what is tested, how bias is guarded against, and the honest limits. Build plan Phase 3 item 20.

---

## 9. What ships for December 31, and what is Track B

**December 31 (Track A):** sections 2 through 8 fully. Six dimensions with sub-attributes, bands, code-side aggregation, dynamic questions with coverage tracking, the hardened data contract, determinism controls, fairness and contestability. This is enough to be defensible in front of a user and an investor and to not break in production.

**Q1 and Q2 (Track B):** the rubric becomes an input to the Telos CCM. Sub-attribute signals become evidence edges in the reasoning graph (`ImpactEvidence -[:VERIFIES]-> Skill`), and the trajectory forecast uses them to compute, not seed, the "add this skill and your hire probability moves to X" claim. The rubric defined here is the on-ramp to that engine, not a throwaway.

---

## 10. Open decisions for the owner

1. **Weights.** The code ships weight set v1 at technical depth 0.30. Decide whether to keep that single set or vary weights by role family, given the platform now places professionals beyond engineering. Store whatever is chosen as a versioned set.
2. **Question floor and ceiling.** Section 5 suggests six to ten. Confirm the range.
3. **Who reviews contested and flagged scores** at launch, and the turnaround to promise a candidate.
4. **Pass semantics.** The product is explicitly not pass or fail; low scores trigger interventions. Confirm there is no hidden threshold that functions as a silent fail, because that would contradict the gamified-empowerment principle and create a fairness exposure.
