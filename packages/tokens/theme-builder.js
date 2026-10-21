// Surflane themes from a few inputs: a neutral tint, an accent and a radius scale.
// Lightness never changes, so every theme keeps the contrast the default palette was
// measured for. Hue and chroma move; chroma is clamped to the sRGB gamut.

/** Default gray steps as [lightness, chroma, hue]. Each theme role uses one step. */
const grays = {
  10: [0.9781762, 0.0034179, 247.8580546],
  20: [0.95972296, 0.00515149, 247.87778139],
  30: [0.93531009, 0.01353396, 240.96010253],
  40: [0.91321146, 0.017061, 242.44074644],
  50: [0.81668066, 0.0183769, 253.3626611],
  70: [0.37866351, 0.01730498, 248.2836448],
  75: [0.31355761, 0.01463569, 251.36854651],
  80: [0.27850211, 0.01320057, 253.03643104],
  90: [0.2368845, 0.00973297, 248.23792711],
  95: [0.2050126, 0.00860311, 247.9381172],
}
const neutralRoles = {
  dark: {
    '--chrome': 90,
    '--canvas': 80,
    '--surface': 90,
    '--code-bg': 95,
    '--hover': 75,
    '--selected': 70,
    '--line': 70,
    '--ink-muted': 50,
    '--ink-body': 40,
    '--ink': 10,
    '--on-brand': 90,
    '--grid-minor': 90,
    '--grid-major': 70,
    '--guide': 70,
  },
  light: {
    '--chrome': 10,
    '--canvas': 'white',
    '--surface': 10,
    '--code-bg': 20,
    '--hover': 20,
    '--selected': 30,
    '--line': 30,
    '--ink-muted': 70,
    '--ink-body': 80,
    '--ink': 90,
    '--brand-ink': 90,
    '--on-brand': 90,
    '--grid-minor': 20,
    '--grid-major': 30,
    '--guide': 40,
  },
}
/** Accent fills keep this lightness, so text on them keeps its contrast. */
const accentLightness = 0.82
const tintAlpha = { dark: 64 / 255, light: 77 / 255 }
const radii = {
  '--radius-sm': 6,
  '--radius-md': 10,
  '--radius-lg': 16,
  '--radius-sheet': 20,
  '--control-radius': 8,
}

/** hue omitted keeps each default step's own hue; chroma scales every step's chroma. */
export const neutralPresets = {
  slate: { chroma: 1 },
  neutral: { hue: 0, chroma: 0 },
  zinc: { hue: 286, chroma: 0.6 },
  stone: { hue: 70, chroma: 0.6 },
}
export const accentPresets = {
  cyan: { hue: 210, chroma: 0.12 },
  blue: { hue: 255, chroma: 0.09 },
  violet: { hue: 300, chroma: 0.105 },
  green: { hue: 150, chroma: 0.14 },
  amber: { hue: 80, chroma: 0.14 },
  rose: { hue: 10, chroma: 0.1 },
}
export const radiusPresets = { none: 0, small: 0.6, default: 1, large: 1.4 }

function linearSrgb(l, c, h) {
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
const inGamut = (l, c, h) =>
  linearSrgb(l, c, h).every((v) => v >= -1e-6 && v <= 1 + 1e-6)
/**
 * The largest chroma at this lightness and hue that sRGB can show, less a 0.5%
 * margin so other OKLab implementations agree the color is in gamut.
 */
export function maxChroma(l, h) {
  let low = 0,
    high = 0.4
  for (let i = 0; i < 30; i++) {
    const mid = (low + high) / 2
    if (inGamut(l, mid, h)) low = mid
    else high = mid
  }
  return low * 0.995
}
const parse = (value) => {
  const match = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(value)
  if (!match) throw new Error(`Not an OKLCH color: ${value}`)
  return match.slice(1, 4).map(Number)
}
/** WCAG 2 contrast ratio between two opaque oklch() colors. */
export function contrastRatio(foreground, background) {
  const luminance = (value) => {
    const [r, g, b] = linearSrgb(...parse(value)).map((v) =>
      Math.min(1, Math.max(0, v)),
    )
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const [high, low] = [luminance(foreground), luminance(background)].sort(
    (x, y) => y - x,
  )
  return (high + 0.05) / (low + 0.05)
}
const round = (value, digits) => Number(value.toFixed(digits))
const oklch = (l, c, h, alpha) =>
  `oklch(${round(l, 8)} ${round(c, 8)} ${round(h, 8)}${alpha === undefined ? '' : ` / ${round(alpha, 8)}`})`

/**
 * Token values for a theme. Leave a dimension out to keep its defaults.
 * @returns {{ dark: Record<string, string>, light: Record<string, string>, shared: Record<string, string> }}
 */
export function createTheme({ neutral, accent, radius } = {}) {
  const theme = { dark: {}, light: {}, shared: {} }
  if (neutral) {
    const scale = Math.max(0, neutral.chroma ?? 1)
    const step = (name) => {
      const [l, c, h] = grays[name]
      const hue = neutral.hue ?? h
      return oklch(l, Math.min(c * scale, maxChroma(l, hue)), hue)
    }
    for (const mode of ['dark', 'light'])
      for (const [token, name] of Object.entries(neutralRoles[mode]))
        theme[mode][token] = name === 'white' ? 'oklch(1 0 0)' : step(name)
  }
  if (accent) {
    const hue = ((accent.hue % 360) + 360) % 360
    const chroma = Math.min(
      Math.max(0, accent.chroma),
      maxChroma(accentLightness, hue),
    )
    for (const mode of ['dark', 'light']) {
      theme[mode]['--brand'] = oklch(accentLightness, chroma, hue)
      theme[mode]['--brand-tint'] = oklch(
        accentLightness,
        chroma,
        hue,
        tintAlpha[mode],
      )
    }
    theme.dark['--brand-ink'] = theme.dark['--brand']
  }
  if (radius !== undefined)
    for (const [token, size] of Object.entries(radii))
      theme.shared[token] = `${Math.round(size * Math.max(0, radius))}px`
  return theme
}

const block = (selectors, values, indent = '') =>
  Object.keys(values).length
    ? `${indent}${selectors.join(`,\n${indent}`)} {\n${Object.entries(values)
        .map(([token, value]) => `${indent}  ${token}: ${value};`)
        .join('\n')}\n${indent}}\n`
    : ''
/**
 * CSS for a theme that mirrors the contexts in tokens.css. Load it after the
 * Surflane tokens. Dark values skip light regions, so a later file never lets a
 * dark value reach a scoped data-theme="light" region.
 */
export function themeCss(theme, comment) {
  const light = theme.light
  return [
    comment ? `/* ${comment} */\n` : '',
    block([':root', '[data-theme]'], theme.shared),
    block([':root', "[data-theme]:not([data-theme='light'])"], theme.dark),
    block([":root[data-theme='light']", "[data-theme='light']"], light),
    Object.keys(light).length
      ? `@media (prefers-color-scheme: light) {\n${block([':root:not([data-theme])'], light, '  ')}}\n`
      : '',
  ].join('')
}
