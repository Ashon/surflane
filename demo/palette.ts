// Palette construction and the guideline check for the palette lab, as plain data:
// the lab renders it, and tests can read it without a page.
import {
  contrast,
  difference,
  hueDistance,
  inGamut,
  oklch,
  toGamut,
  wrapHue,
  type Oklch,
  type Vision,
} from './oklch'

export type Harmony =
  | 'monochromatic'
  | 'analogous'
  | 'complementary'
  | 'split'
  | 'triadic'
  | 'square'
/** Supporting hues as angles from the base hue. */
export const harmonyOffsets: Record<Harmony, number[]> = {
  monochromatic: [0],
  analogous: [0, -30, 30],
  complementary: [0, 180],
  split: [0, 150, 210],
  triadic: [0, 120, 240],
  square: [0, 90, 180, 270],
}
export const dichromats: Vision[] = ['protanopia', 'deuteranopia', 'tritanopia']
export const visions: Vision[] = ['typical', ...dichromats, 'achromatopsia']

/** Ramp steps at fixed lightness, light to dark. */
export const rampSteps = [
  [50, 0.97],
  [100, 0.93],
  [200, 0.87],
  [300, 0.79],
  [400, 0.71],
  [500, 0.63],
  [600, 0.55],
  [700, 0.47],
  [800, 0.39],
  [900, 0.31],
  [950, 0.24],
] as const
/** Chroma peaks at mid lightness and thins toward white and black. */
const chromaAt = (l: number, chroma: number) =>
  chroma * Math.max(0.15, 1 - ((l - 0.6) / 0.45) ** 2)
/** The system's accent fill lightness, as the theme builder fixes it. */
const accentLightness = 0.82
const statusHues = [
  ['danger', 27],
  ['caution', 94],
] as const

export type Step = {
  name: number
  /** The color the step asks for, before the gamut. */
  wanted: Oklch
  color: Oklch
  clamped: boolean
}
export const harmonyHues = (hue: number, offsets: number[]) =>
  offsets.map((offset) => wrapHue(hue + offset))

/** A ramp per hue: each step at its lightness, its chroma clamped to sRGB. */
export const buildRamps = (hues: number[], chroma: number): Step[][] =>
  hues.map((h) =>
    rampSteps.map(([name, l]) => {
      const wanted = oklch(l, chromaAt(l, chroma), h)
      return { name, wanted, color: toGamut(wanted), clamped: !inGamut(wanted) }
    }),
  )

/** Hues spread evenly from the base, neighbors alternating around the band. */
export const buildCategories = ({
  count,
  lightness,
  spread,
  chroma,
  hue,
}: {
  count: number
  lightness: number
  spread: number
  chroma: number
  hue: number
}) =>
  Array.from({ length: count }, (_, index) =>
    toGamut(
      oklch(
        lightness + (index % 2 ? spread : -spread),
        chroma,
        hue + (index * 360) / count,
      ),
    ),
  )

export type Closest = { vision: Vision; i: number; j: number; value: number }
/** The two categories nearest each other, as any of these visions sees them. */
export function closestPair(categories: Oklch[], seen: Vision[]): Closest {
  let best: Closest = { vision: seen[0], i: 0, j: 0, value: Infinity }
  for (const vision of seen)
    for (let i = 0; i < categories.length; i++)
      for (let j = i + 1; j < categories.length; j++) {
        const value = difference(categories[i], categories[j], vision)
        if (value < best.value) best = { vision, i, j, value }
      }
  return best
}

export type Verdict = 'pass' | 'review' | 'fail'
/** Each guideline with what was measured, for the table to word. */
export type Guideline =
  | { criterion: 'textLight' | 'textDark'; steps: number; verdict: Verdict }
  | { criterion: 'gamut'; step: number; kept: number; verdict: Verdict }
  | { criterion: 'area'; chroma: number; verdict: Verdict }
  | {
      criterion: 'status'
      hue: number
      distance: number
      status: 'danger' | 'caution'
      verdict: Verdict
    }
  | { criterion: 'accent'; ratio: number; verdict: Verdict }
  | ({ criterion: 'distinct' | 'cvd'; verdict: Verdict } & Closest)
  | { criterion: 'visible'; index: number; ratio: number; verdict: Verdict }

const grade = (value: number, pass: number, review: number): Verdict =>
  value >= pass ? 'pass' : value >= review ? 'review' : 'fail'

/** The palette measured against the principles' thresholds. */
export function evaluate({
  ramps,
  hues,
  hue,
  chroma,
  categories,
  canvas,
  white,
  darkCanvas,
  ink,
}: {
  ramps: Step[][]
  hues: number[]
  hue: number
  chroma: number
  categories: Oklch[]
  canvas: Oklch
  white: Oklch
  darkCanvas: Oklch
  ink: Oklch
}): Guideline[] {
  const base = ramps[0]
  const textSteps = (background: Oklch) =>
    base.filter(({ color }) => contrast(color, background) >= 4.5).length
  const light = textSteps(white),
    dark = textSteps(darkCanvas)
  // The middle steps carry the ramp's character; the ends always thin out.
  const middle = base
    .slice(3, 8)
    .map(({ name, wanted, color }) => ({
      name,
      kept: wanted.c ? color.c / wanted.c : 1,
    }))
    .sort((a, b) => a.kept - b.kept)[0]
  const nearest = hues
    .flatMap((h) =>
      statusHues.map(([status, statusHue]) => ({
        hue: h,
        status,
        distance: hueDistance(h, statusHue),
      })),
    )
    .sort((a, b) => a.distance - b.distance)[0]
  const accentRatio = contrast(
    ink,
    toGamut(oklch(accentLightness, chroma, hue)),
  )
  const typical = closestPair(categories, ['typical'])
  const deficient = closestPair(categories, dichromats)
  const weakest = categories
    .map((color, index) => ({ index, ratio: contrast(color, canvas) }))
    .sort((a, b) => a.ratio - b.ratio)[0]
  return [
    { criterion: 'textLight', steps: light, verdict: grade(light, 3, 1) },
    { criterion: 'textDark', steps: dark, verdict: grade(dark, 3, 1) },
    {
      criterion: 'gamut',
      step: middle.name,
      kept: middle.kept,
      verdict: grade(middle.kept, 0.8, 0.6),
    },
    {
      criterion: 'area',
      chroma,
      verdict: chroma <= 0.16 ? 'pass' : 'review',
    },
    {
      criterion: 'status',
      ...nearest,
      verdict: nearest.distance < 20 ? 'review' : 'pass',
    },
    {
      criterion: 'accent',
      ratio: accentRatio,
      verdict: accentRatio >= 4.5 ? 'pass' : 'fail',
    },
    {
      criterion: 'distinct',
      ...typical,
      verdict: grade(typical.value, 0.08, 0.05),
    },
    {
      criterion: 'cvd',
      ...deficient,
      verdict: grade(deficient.value, 0.02, 0.01),
    },
    {
      criterion: 'visible',
      ...weakest,
      verdict: weakest.ratio >= 3 ? 'pass' : 'fail',
    },
  ]
}
