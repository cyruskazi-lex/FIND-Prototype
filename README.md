# Fumana

Fumana is a talent and remote-work platform that matches independent professionals ("builders") with employers. An AI agent named Zuri guides assessment and interviews, and narrates results. Matching itself is computed in code. This repository holds the working web application, the product documentation, and the agent specs.

> Repo naming: the folder is named `FIND` (the venture is FIND Services). The product is **Fumana**.

## Repository structure

| Path | What it is |
|------|------------|
| `app/` | The live application. This is the real, current build. Start here. |
| `docs/` | Product vision, brand spec, acceptance criteria, build plan. |
| `agents/` | Zuri agent specs, voice, and prompt library. |
| `prototype/` | Earlier standalone prototype. Superseded by `app/`. Not current. |

If an older note points you at `prototype/FumanaDemo.jsx` as the source of truth, ignore it. The current UX lives in `app/src`.

## Two things every contributor must know

- **Figures are computed, never generated.** Financial and impact numbers are calculated in code from visible inputs. The model narrates reasoning only, and is never asked to produce a number. This is the rule that lets the impact layer survive an investor asking where a figure came from. See `docs/api_integration_notes.md`.
- **The match score is seeded.** The real Bayesian CCM engine does not exist yet. Search fit is computed from profile strength and role and skill overlap, and is a labelled demo value. The language output is live.

## Getting started

Prerequisites: Node.js (a recent LTS release) and npm.

```bash
cd app
npm install
cp .env.demo .env
npm run dev
```

Vite prints a local URL (usually `http://localhost:5173/`). Open it in your browser. The dev server hot-reloads on save.

The `cp .env.demo .env` step matters. `.env` is gitignored and is not in the repo, so a fresh clone has no environment file at all. Copying `.env.demo` sets `DEMO_MODE=true`, which is what makes every AI feature respond without an API key. Skip it and the model proxy returns 501 and the AI screens stay inert.

Other scripts:
- `npm run build` produces a production build
- `npm run preview` serves the production build locally
- `npm run typecheck` runs the TypeScript check
- `npm run lint` runs oxlint

## Demo mode (read this before assuming anything is broken)

Following Getting started puts you in demo mode, because `.env.demo` sets `DEMO_MODE=true`. In this mode, every AI call (interviews, scoring, Zuri responses) returns canned answers from `app/server/demo-responses.js`. This is deliberate: it lets the whole app run with no API key.

So if Zuri repeats the same answers or scores look fixed, that is demo mode behaving as intended. The AI features are simulated while demo mode is on.

## Environment config

Demo mode, no key needed:

```bash
cp .env.demo .env
```

To run against a real model instead:

```bash
cp .env.example .env
```

Then set `DEMO_MODE=false` and fill in `LLM_PROVIDER` and `LLM_API_KEY`. The model proxy supports Anthropic and OpenAI through that environment switch. `.env.example` documents every variable, including the optional ElevenLabs key for Zuri's voice. Real keys stay out of git, since `.env` is gitignored.

Note that `.env.example` ships with `DEMO_MODE=false` and empty keys, so copying it without filling in a provider leaves the AI features inert.

## Backend note

The API endpoints (model proxy and text-to-speech) currently run as Vite plugins, mounted only on the dev and preview servers. There is no standalone production backend yet, so a static `npm run build` deploy serves the UI without the API routes.

## Current status

Working today: the candidate assessment funnel (onboarding through scored dashboard), employer search and pipeline, Zuri voice and TTS, wallet and finance screens, and the CV builder. See `docs/` for the full product vision. The largest open roadmap item is the employer-side currency derivation panel ("Beat 4").

## Key files

- `app/src/App.jsx`: the single-page application (all portals and screens)
- `app/src/marketing.tsx`: the public landing page
- `app/server/demo-responses.js`: canned demo-mode responses
- `app/server/`: dev-only API endpoints
