import { useEffect, useId, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

import bgRaw from './assets/zuri/Background.svg?raw';
import bodyRaw from './assets/zuri/Blazer.svg?raw';
import headRaw from './assets/zuri/Head.svg?raw';
import hairRaw from './assets/zuri/Hair.svg?raw';
import browsRaw from './assets/zuri/Eyebrows.svg?raw';
import eyesRaw from './assets/zuri/Eyes.svg?raw';
import glassesRaw from './assets/zuri/Glasses.svg?raw';
import mouthClosedRaw from './assets/zuri/MouthClosed.svg?raw';
import mouthOpenRaw from './assets/zuri/MouthOpen.svg?raw';
import mouthSmileRaw from './assets/zuri/MouthSmile.svg?raw';

/**
 * Zuri — the platform's AI career interviewer avatar.
 *
 * Governed by the Zuri Design System v1: a warm, credible Black African
 * professional woman. (The separate Character Spec governs her *words* — warm
 * in manner, strict in judgment — never her face; none of its no-avatar /
 * red-analytical direction applies here.)
 *
 * Architecture
 * ------------
 * The portrait is assembled from ten standalone SVG placeholder assets in
 * `./assets/zuri`, authored on the v1 canonical 80×80 canvas (centre 40,40).
 * Each asset wraps its artwork in `<g id="zuri-…">` groups. This component
 * inlines those groups once into a single `<defs>` and references them with
 * `<use>`, reproducing the v1 layer hierarchy:
 *
 *   background
 *   portrait → hair, ears, neck, blazer, shirt,
 *              face → skin, eyes, eyebrows, nose, mouth, glasses, earrings
 *
 * There is no duplicated artwork: state is expressed purely as transforms and
 * mouth swaps over that one library. Per the v1 expression system, ONLY the
 * eyebrows, eyelids, pupils, and mouth ever move — everything else is fixed.
 *
 *   resting      closed mouth, neutral brows
 *   speaking     mouth opens slightly and cycles (talk cadence)
 *   listening    brows lift subtly
 *   thinking     brows narrow, pupils glance up 1px
 *   encouraging  gentle smile
 *   celebrating  largest smile, slight teeth
 *
 * All motion is native SVG (SMIL `<animate>`): no canvas, no PNG, no CSS
 * animation. `prefers-reduced-motion` (or the `reducedMotion` prop) freezes
 * every animation to a stable pose.
 *
 * The geometry here is placeholder. Production artwork drops in by keeping the
 * same ids and the 80×80 coordinate space (see `assets/zuri/README.md`).
 */

export type ZuriState =
  | 'resting'
  | 'listening'
  | 'speaking'
  | 'thinking'
  | 'encouraging'
  | 'celebrating';

export const ZURI_STATES: readonly ZuriState[] = [
  'resting',
  'listening',
  'speaking',
  'thinking',
  'encouraging',
  'celebrating',
];

export interface ZuriProps {
  /** Expression / behaviour the avatar should portray. */
  state?: ZuriState;
  /** Enable the idle eye-blink (SMIL). Defaults to `true`. */
  blink?: boolean;
  /** Rendered square size in px. Defaults to `96`. */
  size?: number;
  /** Accessible label. Defaults to a sentence derived from `state`. */
  title?: string;
  /** Force-freeze all motion regardless of the user's OS preference. */
  reducedMotion?: boolean;
  className?: string;
  style?: CSSProperties;
}

// v1 canonical canvas.
const VIEWBOX = 80;

// The full symbol library (order here is irrelevant — these only populate <defs>).
const PIECES: readonly string[] = [
  bgRaw,
  bodyRaw,
  headRaw,
  hairRaw,
  browsRaw,
  eyesRaw,
  glassesRaw,
  mouthClosedRaw,
  mouthOpenRaw,
  mouthSmileRaw,
];

/** Extract the inner markup of an `<svg>…</svg>` document. */
const innerSvg = (raw: string): string => {
  const open = raw.indexOf('>', raw.indexOf('<svg')) + 1;
  const close = raw.lastIndexOf('</svg>');
  return raw.slice(open, close);
};

/**
 * Prefix every `zuri-*` id (and its `href` / `url()` references) with the
 * instance uid so any number of <Zuri /> instances can share a page without
 * colliding ids — each gets its own private symbol library.
 */
const namespaceIds = (svg: string, uid: string): string =>
  svg
    .replace(/id="(zuri-[^"]+)"/g, (_m, id: string) => `id="${uid}-${id}"`)
    .replace(
      /\b(xlink:href|href)="#(zuri-[^"]+)"/g,
      (_m, attr: string, id: string) => `${attr}="#${uid}-${id}"`,
    )
    .replace(/url\(#(zuri-[^)]+)\)/g, (_m, id: string) => `url(#${uid}-${id})`);

// Eyebrow poses — one shape per brow, repositioned by transform only (80×80, so
// movements are ~1–2px). Pivots: left brow ≈ (33,31), right brow ≈ (47,31).
const BROW_POSE: Record<ZuriState, { l?: string; r?: string }> = {
  resting: {},
  // Lift subtly.
  listening: { l: 'translate(0 -1.4)', r: 'translate(0 -1.4)' },
  speaking: {},
  // Narrow: inner ends drop and draw together.
  thinking: { l: 'rotate(7 33 31) translate(0 0.5)', r: 'rotate(-7 47 31) translate(0 0.5)' },
  // Gentle warmth.
  encouraging: { l: 'translate(0 -1)', r: 'translate(0 -1)' },
  celebrating: { l: 'translate(0 -1.8)', r: 'translate(0 -1.8)' },
};

// Pupils glance up 1px while thinking; otherwise centred.
const PUPIL_POSE: Partial<Record<ZuriState, string>> = {
  thinking: 'translate(0 -1)',
};

const SMILING_STATES: ReadonlySet<ZuriState> = new Set<ZuriState>([
  'encouraging',
  'celebrating',
]);

const STATE_LABEL: Record<ZuriState, string> = {
  resting: 'Zuri, resting',
  listening: 'Zuri is listening',
  speaking: 'Zuri is speaking',
  thinking: 'Zuri is thinking',
  encouraging: 'Zuri, encouraging',
  celebrating: 'Zuri, celebrating',
};

/** Track the user's reduced-motion preference (SSR-safe). */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return reduced;
}

export function Zuri({
  state = 'resting',
  blink = true,
  size = 96,
  title,
  reducedMotion,
  className,
  style,
}: ZuriProps) {
  const rawUid = useId();
  const uid = useMemo(() => 'z' + rawUid.replace(/[^a-zA-Z0-9]/g, ''), [rawUid]);

  const library = useMemo(
    () => PIECES.map((piece) => namespaceIds(innerSvg(piece), uid)).join('\n'),
    [uid],
  );

  const systemReduced = usePrefersReducedMotion();
  const animate = !(reducedMotion ?? systemReduced);

  const ref = (id: string) => `#${uid}-${id}`;
  const gid = (id: string) => `${uid}-${id}`;
  const brow = BROW_POSE[state];
  const label = title ?? STATE_LABEL[state];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      width={size}
      height={size}
      role="img"
      aria-label={label}
      className={className}
      style={style}
    >
      <title>{label}</title>

      {/* Per-instance symbol library — every reusable piece, defined once. */}
      <defs dangerouslySetInnerHTML={{ __html: library }} />

      {/* ---- v1 layer hierarchy ---- */}
      <use href={ref('zuri-background')} />

      <g id={gid('zuri-portrait')}>
        <use href={ref('zuri-hair')} />
        <use href={ref('zuri-ears')} />
        <use href={ref('zuri-neck')} />
        <use href={ref('zuri-blazer')} />
        <use href={ref('zuri-shirt')} />

        <g id={gid('zuri-face')}>
          <use href={ref('zuri-skin')} />

          {/* Eyes: static whites, pupils (glance for thinking), lids (blink). */}
          <g id={gid('zuri-eyes')}>
            <use href={ref('zuri-eye-base')} />
            <use href={ref('zuri-pupils')} transform={PUPIL_POSE[state]} />
            <use href={ref('zuri-eyelids')} opacity={0}>
              {blink && animate && (
                <animate
                  attributeName="opacity"
                  values="0;0;1;0;0"
                  keyTimes="0;0.94;0.952;0.964;1"
                  dur="5.2s"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              )}
            </use>
          </g>

          {/* Eyebrows: only their transform changes between states. */}
          <g id={gid('zuri-eyebrows')}>
            <use href={ref('zuri-brow-l')} transform={brow.l} />
            <use href={ref('zuri-brow-r')} transform={brow.r} />
          </g>

          <use href={ref('zuri-nose')} />

          {/* Mouth: the only thing that changes while speaking. */}
          <Mouth state={state} animate={animate} refId={ref} />

          <use href={ref('zuri-glasses')} />
          <use href={ref('zuri-earrings')} />
        </g>
      </g>
    </svg>
  );
}

interface MouthProps {
  state: ZuriState;
  animate: boolean;
  refId: (id: string) => string;
}

function Mouth({ state, animate, refId }: MouthProps) {
  if (state === 'speaking') {
    // Talk cadence: cross-fade closed ⇄ open. Mouth only — nothing else moves.
    if (!animate) return <use href={refId('zuri-mouth-open')} />;
    return (
      <>
        <use href={refId('zuri-mouth-closed')} opacity={1}>
          <animate
            attributeName="opacity"
            values="1;0;1;0;1;1"
            keyTimes="0;0.2;0.4;0.6;0.8;1"
            dur="0.62s"
            calcMode="discrete"
            repeatCount="indefinite"
          />
        </use>
        <use href={refId('zuri-mouth-open')} opacity={0}>
          <animate
            attributeName="opacity"
            values="0;1;0;1;0;0"
            keyTimes="0;0.2;0.4;0.6;0.8;1"
            dur="0.62s"
            calcMode="discrete"
            repeatCount="indefinite"
          />
        </use>
      </>
    );
  }

  if (SMILING_STATES.has(state)) {
    // Celebrating is the largest smile — scale the gentle smile up about its centre.
    const transform = state === 'celebrating' ? 'translate(40 48) scale(1.12) translate(-40 -48)' : undefined;
    return <use href={refId('zuri-mouth-smile')} transform={transform} />;
  }

  return <use href={refId('zuri-mouth-closed')} />;
}

export default Zuri;
