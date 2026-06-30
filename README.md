# Fumana

Africa talent clearing house. This repository holds the demo prototype and the handoff packet for the MVP.

Powered by Telos. Designed by Lexington Advisory Group.

---

## What this is

A clickable four-beat demo plus the documents an engineer needs to build the real thing. The demo proves one idea: Fumana verifies talent and shows its reasoning, where a keyword job board cannot.

Start with `docs/demo_brief.md`. It is the front door.

## Read in this order

1. `docs/demo_brief.md` - what the demo is and the moment that makes it land.
2. `prototype/FumanaDemo.jsx` - the clickable demo and the single source of UX truth.
3. `docs/fumana_brand_spec.html` - the one visual system. Open in a browser.
4. `docs/canonical_schema.md` - the one data model. Supersedes older drafts.
5. `agents/agent_prompt_library.md` - how to reproduce Telos behaviour.
6. `docs/api_integration_notes.md` - how the prototype calls Claude and what changes in production.
7. `docs/acceptance_criteria.md` - when the demo is done. Stop when every box is checked.

## Folder map

```
FIND/
  prototype/   the clickable demo
  docs/        brief, brand spec, schema, acceptance criteria, integration notes
  agents/      the behavioural spec for Telos
```

## Two things every contributor must know

- **Figures are computed, never generated.** Financial and impact numbers are calculated in code from visible inputs. The model narrates reasoning only.
- **The match score is seeded.** The real Bayesian CCM engine does not exist yet. The confidence figure is a labelled demo value. The language output is live.

## Running the prototype

`prototype/FumanaDemo.jsx` is a single React component. It runs as-is inside Claude, where it was built and validated. To run it on a developer machine, drop it into a React build setup. In production the browser must not hold the Anthropic key. See `docs/api_integration_notes.md`.

## Status

Demo validated end to end. All four live calls fire. Packet complete. Ready for developer handoff.
