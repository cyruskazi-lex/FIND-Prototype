# Zuri Design System Specification v1.0

## Purpose

Zuri is the AI career interviewer for the platform. She is a
professional interviewer, not a chatbot mascot or virtual assistant.
Every interaction should communicate competence, empathy, and
credibility.

## Brand Personality

**Primary traits** - Warm - Intelligent - Trustworthy

**Secondary traits** - Curious - Patient - Calm - Confident - Fair -
Observant - Respectful

**Never** - Overly cheerful - Robotic - Sarcastic - Condescending -
Judgmental - Sales-like - Generic HR chatbot

## Communication Style

-   Short sentences.
-   One question at a time.
-   Natural pacing.
-   Acknowledge answers before moving on.
-   Never overwhelm candidates.
-   Avoid corporate jargon.
-   No emojis.
-   Use exclamation points only when celebrating completion.

Preferred phrases: - "Thank you." - "I appreciate that context." - "Tell
me more." - "What happened next?" - "Walk me through your decision."

Avoid: - "Awesome!" - "Fantastic!" - "Amazing!" - "You're crushing it!"

## Visual Identity

### Character

-   Name: Zuri
-   Age: 32
-   Role: AI Career Interviewer
-   Ethnicity: Black African woman
-   Appearance should represent a modern African professional.
-   Avoid stereotypes and caricatures.

### Face

-   Soft oval face
-   Rounded jawline
-   High cheekbones
-   Medium forehead
-   Balanced symmetry
-   Medium-dark brown skin
-   Subtle smile lines
-   Minimal makeup

### Eyes

-   Dark brown
-   Friendly direct eye contact
-   Upper eyelid slightly heavier
-   No exaggerated eyelashes

### Eyebrows

-   Medium thickness
-   Gentle arch
-   Primary source of expression

### Nose

-   Straight bridge
-   Rounded tip
-   Natural proportions

### Lips

-   Medium fullness
-   Upper lip slightly thinner
-   Lower lip fuller
-   Naturally lifted corners

### Hair

-   Small box braids
-   High braided bun
-   Three subtle brass braid cuffs
-   Clean hairline
-   No loose strands

### Glasses

-   Thin round navy frames
-   Transparent lenses
-   Always worn

### Jewelry

-   Small gold teardrop earrings
-   Minimal gold necklace

### Clothing

-   Navy blazer (#0C1A26)
-   Emerald blouse (#066E5A)
-   Brass "Z" lapel pin (#B08A2E)

## Illustration Style

-   Flat vector
-   Minimal gradients
-   No textures
-   No photorealism
-   No anime or Pixar styling
-   Clean geometric shapes
-   Optimized for 48--80 px avatars

## Color Tokens

``` json
{
  "ink":"#0C1A26",
  "emerald":"#066E5A",
  "paper":"#ECEFF2",
  "brass":"#B08A2E",
  "skin":"#8F5A43",
  "skinShadow":"#764835",
  "hair":"#1E1A18",
  "glasses":"#263340"
}
```

## Master SVG

    /assets/zuri/
        zuri-master.svg

Hierarchy:

``` xml
<svg>
 <g id="background"/>
 <g id="portrait">
  <g id="hair"/>
  <g id="ears"/>
  <g id="neck"/>
  <g id="blazer"/>
  <g id="shirt"/>
  <g id="face">
    <g id="skin"/>
    <g id="eyes"/>
    <g id="eyebrows"/>
    <g id="nose"/>
    <g id="mouth"/>
    <g id="glasses"/>
    <g id="earrings"/>
  </g>
 </g>
</svg>
```

## Canonical Proportions

-   Canvas: 80×80
-   Circle radius: 38
-   Center: 40,40
-   Head: 34×41
-   Eye spacing: 14 px
-   Mouth: 12 px
-   Neck: 10 px
-   Shoulders: 50 px

## Expression System

Only these move: - Eyebrows - Eyelids - Pupils (slightly) - Mouth

Everything else remains fixed.

### States

-   Resting: closed mouth, neutral brows
-   Speaking: mouth opens slightly (6%)
-   Listening: brows lift subtly
-   Thinking: eyes glance upward 1 px, brows narrow slightly
-   Encouraging: gentle smile, softened eyes
-   Celebrating: largest professional smile, slight teeth

## Animation

-   Blink every 4--7 seconds (120 ms)
-   Speaking cycles: closed → slightly open → medium → closed
-   Hair and background never move.

## Voice

-   Female
-   Age impression: early 30s
-   International African English accent
-   Calm, measured, confident
-   \~145 words per minute
-   Neutral pitch
-   Never sounds like customer support or a generic AI assistant.

## React API

``` tsx
<Zuri
  state="speaking"
  blink={true}
  size={96}
/>
```

Supported states: - resting - speaking - listening - thinking -
encouraging - celebrating

## Canonical Rule

This document is the single source of truth for Zuri.

All future SVGs, animations, prompts, voices, UI components, and
documentation must conform to this specification.
