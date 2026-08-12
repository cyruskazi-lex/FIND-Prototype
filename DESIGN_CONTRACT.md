# Fumana design contract

The binding rules for every screen. Derived from `docs/fumana_brand_spec.html`, which is the visual source of truth, and `agents/zuri_voice_and_prompts.md`, which is the language source of truth. Where an older document disagrees, this file wins.

Powered by Telos. Designed by Lexington Advisory Group.

---

## 1. Which Zuri specification the build follows

Three Zuri documents exist and they contradict each other. The build follows one and a half of them. This contract settles it.

| Document | Status | Why |
| --- | --- | --- |
| `agents/zuri_voice_and_prompts.md` | **Canonical for language.** Followed. | Every system prompt in `App.jsx` is close to verbatim from Prompt 3: "warm in manner and strict in judgment: kind about how you say things, honest about what is true." |
| `docs/ZURI_Design_System_Specification_v1.md` | **Canonical for character and voice only.** Its visual mandate is superseded. | Personality (warm, intelligent, trustworthy), the never-list, and the audio voice charter are followed. The flat-vector `zuri-master.svg`, the 80x80 canvas, the expression-state machine, the blink timing, and the `<Zuri state size />` React API are not built and will not be. The build uses a photographic avatar and pre-rendered video, which the document forbids. |
| `docs/Zuri_Character_Spec.md` | **Superseded in full.** Not followed. | It specifies a cold, clinical evaluator with Assessment Red `#E63946`, "no faces or avatars", no praise, and radical brevity. Every one of those is contradicted by the shipped product and by the voice charter. |

**Ruling:** Zuri is warm in manner and strict in judgment. She has a face. Her language comes from the prompt library, her character from the design system, and her palette from this contract, not from the Assessment Red spec.

---

## 2. Fonts

Three families. No fourth without changing this file.

| Role | Family | Weights | Used for |
| --- | --- | --- | --- |
| Display | Hanken Grotesk | 700, 800 | Headings, the wordmark, figures that carry emphasis |
| Body | Inter | 400, 500, 600 | Paragraphs, labels, buttons, form text |
| Data | IBM Plex Mono | 400, 500 | **Every figure on screen**, micro-labels, eyebrows, timestamps, references |

Rules:

- Every number a user reads is set in IBM Plex Mono. Monospaced numerals are the trust signal.
- The wordmark is Hanken Grotesk 800, letter-spacing 3px, ink on paper.
- **IBM Plex Sans is not a Fumana font.** It appears in the current build only because the marketing page adopted it. It is removed by this contract. Body text is Inter.

---

## 3. Palette

The nine tokens from the brand spec. Nothing else.

| Token | Hex | Meaning and permitted use |
| --- | --- | --- |
| `paper` | `#ECEFF2` | The ground. Default background everywhere. |
| `surface` | `#FFFFFF` | Cards, tiles, raised surfaces. |
| `mute` | `#E3E8EB` | Filled tracks, inactive fills, secondary dividers. |
| `line` | `#D7DEE3` | Hairline borders and rules. |
| `ink` | `#0C1A26` | Primary text and structure. Dark surfaces (header, side nav, footer). |
| `slate` | `#5E6E7A` | Secondary text, captions, hairline rules. |
| `emerald` | `#066E5A` | **Verified, cleared, settled value only.** A confirmed score, a cleared figure, a completed state. Never decoration. |
| `vault` | `#05564A` | Pressed and hover states of emerald. Dense surfaces. Adds depth, not a new hue. |
| `brass` | `#B08A2E` | **Verification marks only.** The assay stamp. Never a button, never a background. |

Additions this contract permits, because the product needs them and the brand spec omitted them:

| Token | Hex | Use |
| --- | --- | --- |
| `alert` | `#A8431F` | Error states, destructive confirmation, a failing figure. Never decorative. |
| `onAccent` | `#F4F7F8` | Text on emerald or ink fills, where white would glare. |

Two rulings on colors already in the build:

- **`slate` is `#5E6E7A` for text at 16px and above, and `#4A5C68` for text below 16px.** The darker value exists because `#5E6E7A` fails WCAG AA on paper at small sizes. Accessibility wins; the brand tone is preserved at the sizes where it is legible. Both are named tokens, not ad hoc values.
- **`#F2F4F7` is not a Fumana color.** The build currently uses it as a second, competing paper in the app shell and across the marketing page. Everything resolves to `paper` `#ECEFF2`.

Every dark-chrome value in the shell (`#12222E`, `#24343F`, `#9FB0BC`, `#8BA0AD`, `#EEF3F8`) must become a named token derived from `ink`, or be replaced by one. No raw hex in a component.

---

## 4. Scale, surface, and rhythm

- **Spacing:** 8pt grid. Use 4, 8, 12, 16, 24, 32, 48. No other value.
- **Radius:** 12 for cards. 8 for inputs. 4 for chips. 0 for rules. **Nothing rounder than 12**, with one exception: a circular avatar may use `50%`.
- **Elevation:** hairline rules, not drop shadows. A 1px slate line reads as a ledger; a shadow reads as generic SaaS. **One soft shadow is permitted, on overlays only** (the modal). Docks, panels, and cards get a border, not a shadow.
- **Density:** real whitespace. Let the figures and the rules do the work.

## 5. The signature element

The derivation panel. Every important number shows its own math on the same screen, in tabular figures, closed with a brass verification stamp. This is the honesty principle made visual and the one thing the product is remembered by. Any screen that states a financial or impact figure owes the reader its derivation.

---

## 6. Voice

From the brand spec and the Zuri voice charter, binding on all interface copy.

1. **Sentence case everywhere.** No title case headers, no all-caps sentences. Uppercase is permitted only on IBM Plex Mono micro-labels under 12px, which is how the brand spec sets its own section headings.
2. **No em dashes.** Periods, colons, and semicolons carry the rhythm.
3. **Affirmative and direct.** State what is, not what is not.
4. **Never charity language.** Fumana clears talent as an asset. It does not help, rescue, uplift, or empower.
5. **Name actions by what the user does.** The button that says clear produces a state that says cleared. Not "Initialize Placement".
6. **Plain language.** No jargon, no corporate filler, no invented system vocabulary.
7. **Warm in manner, strict in judgment.** Kind about how it is said, honest about what is true. State the gap, then the path. No flattery openers.
8. **Specific over general.** Name the moment, the word, the choice.

---

## 7. Banned patterns

These are not style preferences. Each one makes the product assert something untrue, which is the single thing this brand cannot afford.

1. **Fake status badges.** No "System Live", no uptime pill, no green dot implying a monitored service. If a status is not read from a real signal, it is not displayed.
2. **Invented version numbers.** No "V2.4". The product has one version and it is not advertised on the hero.
3. **`MODULE:` and bracketed system labels.** No "[ Module: Arbitrage_Calc ]", no "ID:", no "REQ:", no "LOC:". These imitate a machine readout the product does not have.
4. **ALL_CAPS_SNAKE field names.** No `EXP_SALARY`, `Base_Salary`, `TOTAL_A`, `NET_SAVINGS_COMPUTED`, `SR_FULL_STACK`. Fields are named in sentence case, in words a person would say.
5. **Invented figures presented as product output.** No fabricated match percentages, score readouts, salary bands, or savings totals. A number on screen is computed from a real input or it is labelled illustrative at the point of use.
6. **Invented people.** No fictional named candidates with photos, locations, and scores. It reads as a testimonial and it is not one.
7. **Unsupportable claims.** No "zero-hallucination", no conversion statistics, no language certifications the platform does not test.
8. **Scoring vocabulary that does not match the product.** The six dimensions and their weights are defined in `App.jsx` `WEIGHTS`. No screen may advertise different dimensions or different weights.
9. **Brass on a fill.** Brass is a mark, never a background or a button.
10. **Emerald as decoration.** If it is not verified, cleared, or settled, it is not emerald.
11. **Raw hex in a component.** Every color resolves to a token in section 3.
12. **Drop shadows outside overlays.** See section 4.

---

## 8. The footer, on every screen

```
© FIND Services Limited. Powered by Telos. Designed by Lexington Advisory Group.
```
