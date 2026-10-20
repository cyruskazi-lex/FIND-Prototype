# Decision and reconciliation note: 20 October 2026

Powered by Telos. Designed by Lexington Advisory Group.

A short record of what the 20 October executive sync changed, and how the new roadmap set reconciles with the documents already in this repository. This note does not restate or replace the canon. Where it names a conflict, it says which document wins.

---

## Decisions taken on 20 October

1. **December 31 is an internal soft launch**, not a public hard launch. Target: live sign-ups, Google Analytics, investor pitching, and the start of a two-month Q1 acquisition push.
2. **Bi-weekly executive leadership team cadence** reinstated, with a standing agenda. The co-founder space is now the ELT space.
3. **Brand direction proposed, not ratified:** Fumana is the product, FIND Services is the umbrella holding entity, single-brand in the OpenAI and ChatGPT style. Deferred to the full team.
4. **Assessment is the priority fix.** It breaks in production and the scoring rubric is not yet written. Both are now owned and specced.
5. **Lexington licensing is required before production.** Telos, the E2SG framework, and the tool referred to as "Hello" are Lexington property. A formal licensing agreement between Lexington Advisory Group and FIND Services must be executed before launch, with Cyrus recused from the vote.
6. **Website positioning widened** from "verified African engineers" to "verified African professionals," to include non-technical talent.

---

## How this reconciles with the existing canon

- **Data model:** unchanged. `docs/canonical_schema.md` remains the one schema. The roadmap and rubric build on it and add nothing that conflicts.
- **Brand naming:** unchanged as a standard. `docs/brand_naming.md` still governs in-product language (Telos the intelligence brand, CCM internal only, Zuri human-facing, the fixed footer). The open item is the Fumana-versus-FIND-Services site architecture, which is a marketing and domain decision, not an in-product naming change.
- **Zuri:** `docs/Zuri_Character_Spec.md` and `agents/zuri_voice_and_prompts.md` remain authoritative for character, voice, and the six dimensions. The new `docs/zuri_assessment_rubric_spec.md` extends them with sub-attributes, aggregation math, dynamic-question logic, and the production guardrails; it does not change the voice or the dimensions.
- **Scope:** `docs/acceptance_criteria.md` scoped a four-beat investor demo and put admin, Squads, auth, and payments out of scope. The soft launch is a wider target. The roadmap keeps the four-beat demo as the bulletproof spine and builds the three-portal MVP outward from it, with admin shipping lean. Read the acceptance criteria as the demo's definition of done, and the roadmap as the soft launch's.
- **Build sequence:** `docs/fumana_build_plan.md` remains the feature-by-phase source. The new sprint plan time-boxes those phases to the December 31 date and adds the non-code gates.

---

## The documents added in this set

- `docs/roadmap_2026Q4_to_2027Q2.md`: what and why, soft launch through Q2.
- `docs/sprint_plan_2026Q4.md`: when and who, five sprints to launch plus Q1 and Q2 outline.
- `docs/uiux_audit_and_build_plan.md`: the real-code audit and the gap-to-ticket plan.
- `docs/zuri_assessment_rubric_spec.md`: the scoring rubric, the item the sync said was missing.

---

## Open decisions still owned by the team

1. Brand architecture: single-brand Fumana forward, or dual-brand. Decide by 1 December.
2. Lexington licensing execution. Target 15 December. This gates the whole production launch.
3. Rubric weights: keep the single as-built set or vary by role family. See the rubric spec, section 10.
4. Admin depth for December 31: lean, or more, and what candidate or employer depth moves to Q1 if more.
