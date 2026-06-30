# Zuri avatar assets

Ten placeholder SVG pieces composed by [`../../Zuri.tsx`](../../Zuri.tsx) into the
`<Zuri />` avatar, following the **Zuri Design System v1** (warm, credible Black
African professional woman). The geometry here is **placeholder** — it locks the
architecture, coordinate space, palette, and public IDs. Replace each file with
production artwork without touching the component, provided you keep the contract
below.

## Contract

- **Canvas:** every file is authored on the v1 canonical `80 × 80` viewBox,
  centre `40,40`. All pieces share this one coordinate space, so they stack
  without per-piece positioning.
- **Color tokens** (v1): skin `#8F5A43`, skin-shadow `#764835`, hair `#1E1A18`,
  blazer/ink `#0C1A26`, blouse/emerald `#066E5A`, glasses `#263340`, paper
  `#ECEFF2`. **Brass `#B08A2E` is reserved for the hair cuffs only**; other
  jewelry uses gold `#C7A24A`.
- **Public IDs** (the component references these via `<use>`):

  | File              | Group id(s)                                  | v1 layer |
  | ----------------- | -------------------------------------------- | -------- |
  | `Background.svg`  | `zuri-background`                            | background |
  | `Hair.svg`        | `zuri-hair`                                  | portrait › hair |
  | `Head.svg`        | `zuri-ears`, `zuri-skin`, `zuri-nose`, `zuri-earrings` | portrait › ears / face › skin, nose, earrings |
  | `Blazer.svg`      | `zuri-neck`, `zuri-blazer`, `zuri-shirt`     | portrait › neck, blazer, shirt |
  | `Eyes.svg`        | `zuri-eye-base`, `zuri-pupils`, `zuri-eyelids` | face › eyes |
  | `Eyebrows.svg`    | `zuri-brow-l`, `zuri-brow-r`                 | face › eyebrows |
  | `Glasses.svg`     | `zuri-glasses`                               | face › glasses |
  | `MouthClosed.svg` | `zuri-mouth-closed`                          | face › mouth |
  | `MouthOpen.svg`   | `zuri-mouth-open`                            | face › mouth |
  | `MouthSmile.svg`  | `zuri-mouth-smile`                           | face › mouth |

  The `zuri-` prefix is the namespacing convention; the names map 1:1 to the v1
  hierarchy (`portrait → {hair, ears, neck, blazer, shirt, face → {skin, eyes,
  eyebrows, nose, mouth, glasses, earrings}}`). The component assembles the
  nesting and rewrites these to per-instance ids at runtime so multiple avatars
  can coexist (the rewrite keys off the `zuri-` prefix and covers `id`,
  `href`/`xlink:href`, and `url(#…)`).

- **Layering:** eyelids/pupils sit over the eyes; both brows over the eyebrows
  slot. Author them in place — do not pre-hide them. The component layers and
  animates them.
- **Prefer fills over strokes** for anything that must read at 48–80px (and so it
  survives every rasteriser): glasses frames are even-odd filled rings, and the
  brows / nose / lips are filled shapes.

## What the component drives (v1 expression system — not the assets)

Per v1, **only the eyebrows, eyelids, pupils, and mouth move**; everything else is
fixed. State is applied in `Zuri.tsx`, never baked into the art:

- **resting** closed mouth, neutral brows.
- **speaking** swaps/cycles the mouth (open ⇄ closed); nothing else moves.
- **listening** lifts the brows subtly.
- **thinking** narrows the brows and glances the pupils up ~1px.
- **encouraging** gentle smile; **celebrating** the largest smile (slight teeth).
- **blink** fades the eyelids in over the open eyes (~every 5s).

Animation is native SVG (SMIL). No canvas, no PNG, no CSS animation. Motion
freezes under `prefers-reduced-motion` or the `reducedMotion` prop.

## API (unchanged)

```tsx
<Zuri state="speaking" blink={true} size={96} reducedMotion={false} />
```
