// Color math for the palette lab: OKLCH in, sRGB and WCAG contrast out. OKLab is
// Björn Ottosson's; the color vision matrices are Machado, Oliveira and Fernandes
// (2009) at full severity, applied to linear sRGB.
import { maxChroma } from '@surflane/design-tokens/theme-builder'

export { maxChroma }
export type Oklch = { l: number; c: number; h: number }
type Vector = [number, number, number]

/** A hue angle in 0–360. */
export const wrapHue = (hue: number) => ((hue % 360) + 360) % 360
/** The shorter angle between two hues, 0–180. */
export const hueDistance = (a: number, b: number) => {
  const d = wrapHue(a - b)
  return Math.min(d, 360 - d)
}
export const oklch = (l: number, c: number, h: number): Oklch => ({
  l,
  c,
  h: wrapHue(h),
})

/** Linear sRGB for an OKLCH color; channels outside 0–1 are out of gamut. */
export function toLinear({ l, c, h }: Oklch): Vector {
  const radians = (h * Math.PI) / 180
  const a = c * Math.cos(radians),
    b = c * Math.sin(radians)
  const long = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const medium = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const short = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
    -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
    -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
  ]
}
const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/** True when sRGB can show the color without clipping. */
export const inGamut = (color: Oklch) =>
  toLinear(color).every((value) => value >= -1e-6 && value <= 1 + 1e-6)

/** The color with its chroma reduced to what sRGB can show at its lightness and hue. */
export const toGamut = (color: Oklch): Oklch =>
  // Most colors already fit; only the rest pay for the chroma search.
  inGamut(color)
    ? color
    : { ...color, c: Math.min(color.c, maxChroma(color.l, color.h)) }

const encode = (value: number) =>
  Math.round(
    255 *
      (value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055),
  )
export const toHex = (color: Oklch) =>
  '#' +
  toLinear(toGamut(color))
    .map((value) => encode(clamp01(value)).toString(16).padStart(2, '0'))
    .join('')

const round = (value: number, digits: number) =>
  Number(value.toFixed(digits)).toString()
export const toCss = ({ l, c, h }: Oklch) =>
  `oklch(${round(l, 3)} ${round(c, 3)} ${round(h, 1)})`

/** Reads oklch(L C H) as a token's computed value spells it. */
export function parseOklch(value: string): Oklch | null {
  const match =
    /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+%?))?\s*\)/.exec(
      value.replace(/\s+/g, ' '),
    )
  if (!match || (match[4] && Number.parseFloat(match[4]) < 1)) return null
  const lightness = match[1].endsWith('%')
    ? Number.parseFloat(match[1]) / 100
    : Number(match[1])
  return oklch(lightness, Number(match[2]), Number(match[3]))
}

const luminanceOf = ([r, g, b]: Vector) =>
  0.2126 * clamp01(r) + 0.7152 * clamp01(g) + 0.0722 * clamp01(b)
export const luminance = (color: Oklch) => luminanceOf(toLinear(toGamut(color)))

/** WCAG 2 contrast ratio, from relative luminance in sRGB. */
export function contrast(foreground: Oklch, background: Oklch) {
  const [high, low] = [luminance(foreground), luminance(background)].sort(
    (x, y) => y - x,
  )
  return (high + 0.05) / (low + 0.05)
}

/**
 * The lightness nearest the foreground's own that reaches the target ratio on the
 * background, keeping hue and as much chroma as the gamut allows; null when no
 * lightness does.
 */
export function lightnessFor(
  foreground: Oklch,
  background: Oklch,
  target: number,
): number | null {
  const ratio = (l: number) =>
    contrast(toGamut({ ...foreground, l }), background)
  const search = (towards: 0 | 1) => {
    if (ratio(towards) < target) return null
    let near = foreground.l,
      far: number = towards
    if (ratio(near) >= target) return near
    for (let i = 0; i < 40; i++) {
      const mid = (near + far) / 2
      if (ratio(mid) >= target) far = mid
      else near = mid
    }
    return far
  }
  const candidates = [search(0), search(1)].filter(
    (value): value is number => value !== null,
  )
  if (!candidates.length) return null
  return candidates.sort(
    (a, b) => Math.abs(a - foreground.l) - Math.abs(b - foreground.l),
  )[0]
}

export type Vision =
  'typical' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'
const matrices: Record<
  Exclude<Vision, 'typical' | 'achromatopsia'>,
  number[]
> = {
  protanopia: [
    0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882,
    -0.048116, 1.051998,
  ],
  deuteranopia: [
    0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182,
    0.04294, 0.968881,
  ],
  tritanopia: [
    1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733,
    0.691367, 0.3039,
  ],
}
/** Linear sRGB as a person with the given color vision sees it. */
export function simulate(color: Oklch, vision: Vision): Vector {
  const linear = toLinear(toGamut(color)).map(clamp01) as Vector
  if (vision === 'typical') return linear
  if (vision === 'achromatopsia') {
    const y = luminanceOf(linear)
    return [y, y, y]
  }
  const m = matrices[vision]
  return [0, 1, 2].map((row) =>
    clamp01(
      m[row * 3] * linear[0] +
        m[row * 3 + 1] * linear[1] +
        m[row * 3 + 2] * linear[2],
    ),
  ) as Vector
}
export const linearToHex = (linear: Vector) =>
  '#' +
  linear
    .map((value) => encode(clamp01(value)).toString(16).padStart(2, '0'))
    .join('')

function oklab([r, g, b]: Vector): Vector {
  const long = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const medium = Math.cbrt(
    0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b,
  )
  const short = Math.cbrt(
    0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b,
  )
  return [
    0.2104542553 * long + 0.793617785 * medium - 0.0040720468 * short,
    1.9779984951 * long - 2.428592205 * medium + 0.4505937099 * short,
    0.0259040371 * long + 0.7827717662 * medium - 0.808675766 * short,
  ]
}
/** Euclidean distance in OKLab between two colors as the given vision sees them. */
export function difference(a: Oklch, b: Oklch, vision: Vision = 'typical') {
  const [x, y] = [oklab(simulate(a, vision)), oklab(simulate(b, vision))]
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2])
}
