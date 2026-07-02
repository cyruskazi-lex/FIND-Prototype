# Trajectory Forecast spec

Telos shows the candidate which single intervention raises their Profile Strength fastest, computed from their dimension scores. Not a generic recommendation list. One specific, ranked forecast.

Powered by Telos. Designed by Lexington Advisory Group.

---

## What this is

After a candidate completes their assessment, they have six dimension scores with weights. The Trajectory Forecast computes exactly which upskilling action moves their composite Profile Strength the most per hour of effort. It is a decision engine, not a motivation tool.

NO MODEL for the forecast computation. The forecast is computed in code from the scores and weights. The narrative explanation is NEEDS MODEL, inert-aware.

---

## Location

A new tile on the Growth Dashboard, below the dimension scores and above the recommended next step. Label: "Trajectory Forecast" in IBM Plex Mono. Subtitle: "Computed by Telos. The single intervention that moves your score fastest."

---

## Computation (in code, never model-generated)

For each dimension, compute the "gain potential":

```
gainPotential(dim) = (100 - dim.score) * WEIGHTS[dim.name]
```

The dimension with the highest gain potential is the "forecast intervention." This is mathematically the dimension where improvement yields the most composite score movement, given the weighting.

Compute the projected new score if that dimension moves to 75 (a realistic target):

```
projectedStrength = currentStrength - (currentDimScore * weight) + (75 * weight)
```

Show:
- Current Profile Strength.
- Forecast intervention: the dimension name and its current score.
- Projected Profile Strength if that dimension reaches 75.
- The delta: "+N points."
- The matching upskilling module for that dimension.
- Estimated effort: map each module to an effort estimate (Culture Shock Simulator: 45 mins, Async Operating Rhythm: 2 hours, Professional Presence: 1.5 hours, Collaboration and Code Review: 2 hours, Structured Problem Solving: 2.5 hours, Technical Deep Dive: 3 hours).

A plain note: "Forecast computed by Telos from your dimension scores and the disclosed weighting formula. Projected score assumes the target dimension reaches 75. No figure is model-generated."

---

## Telos narrative (NEEDS MODEL, inert-aware)

Below the computed forecast, a short Telos narrative explains the reasoning in plain language. One call to /api/claude:

```
System: "You are Telos, the intelligence layer for FIND. In two to three sentences, explain in plain language why this specific dimension is the highest-leverage intervention for this candidate right now, grounded in the weighting formula and their current scores. Be specific. No flattery. No em dashes. Do not invent figures; reference only the numbers provided."

User: "Profile Strength: [X]. Weakest high-weight dimension: [name] at [score], weight [w]. Projected strength if this dimension reaches 75: [Y]. Other dimensions: [list]."
```

Inert-aware: if no provider, show "Telos narrative available once a provider is connected" in the same tile.

---

## Done when

- Trajectory Forecast tile appears on the Growth Dashboard after assessment.
- Computation is correct: the dimension with the highest gain potential is selected.
- Projected score is mathematically accurate.
- The matching module and effort estimate are shown.
- Telos narrative fires when a provider is set, inert-aware when not.
- FigNote at foot of tile: "Forecast computed by Telos from your dimension scores and the disclosed weighting formula."
- vite build, tsc, oxlint clean.
