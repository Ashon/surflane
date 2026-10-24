// @surflane/design-tokens/theme-builder: the public API that writes custom themes.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  accentPresets,
  contrastRatio,
  createTheme,
  layerOrder,
  maxChroma,
  themeCss,
} from '@surflane/design-tokens/theme-builder'

test('contrastRatio spans 1 to 21 and ignores argument order', () => {
  assert.equal(contrastRatio('oklch(0 0 0)', 'oklch(1 0 0)'), 21)
  assert.equal(contrastRatio('oklch(0.5 0.1 200)', 'oklch(0.5 0.1 200)'), 1)
  assert.equal(
    contrastRatio('oklch(0.3 0.05 250)', 'oklch(0.9 0.02 90)'),
    contrastRatio('oklch(0.9 0.02 90)', 'oklch(0.3 0.05 250)'),
  )
})

test('maxChroma stays inside sRGB and shrinks toward black and white', () => {
  const mid = maxChroma(0.6, 210)
  assert.ok(mid > 0.05 && mid < 0.4)
  assert.ok(maxChroma(0.99, 210) < mid)
  assert.ok(maxChroma(0.05, 210) < mid)
})

test('radius scales every corner, and 0 squares them', () => {
  const pill = (radius) => createTheme({ radius }).shared['--surf-radius-pill']
  assert.equal(pill(1), '22px')
  assert.equal(pill(0.5), '11px')
  for (const value of Object.values(createTheme({ radius: 0 }).shared))
    assert.equal(value, '0px')
})

test('an accent keeps light accent text on the ink', () => {
  const theme = createTheme({ accent: { hue: 140, chroma: 0.15 } })
  assert.equal(theme.dark['--surf-brand'], theme.light['--surf-brand'])
  assert.equal(theme.dark['--surf-brand-ink'], theme.dark['--surf-brand'])
  assert.equal(theme.light['--surf-brand-ink'], 'var(--surf-ink)')
})

test('every accent preset stays in gamut', () => {
  for (const [name, accent] of Object.entries(accentPresets)) {
    const brand = createTheme({ accent }).dark['--surf-brand']
    const [, l, c, h] = /oklch\(([\d.]+) ([\d.]+) ([\d.]+)/
      .exec(brand)
      .map(Number)
    assert.ok(c <= maxChroma(l, h) + 1e-6, name)
  }
})

test('an accent chroma past the gamut is clamped', () => {
  const theme = createTheme({ accent: { hue: 140, chroma: 2 } })
  const chroma = Number(
    /oklch\([\d.]+ ([\d.]+)/.exec(theme.dark['--surf-brand'])[1],
  )
  assert.ok(chroma <= maxChroma(0.82, 140) + 1e-6)
})

test('themeCss declares the layers and scopes themes to dark or light only', () => {
  const css = themeCss(createTheme({ accent: accentPresets.green, radius: 0 }))
  assert.ok(css.startsWith(layerOrder))
  assert.match(css, /@layer surflane\.themes \{/)
  assert.doesNotMatch(css, /\[data-theme\](?!=)/)
  assert.doesNotMatch(css, /\[data-theme=['"](?!dark|light)/)
})

test('a token a theme sets only for dark reverts in light', () => {
  const css = themeCss({
    dark: { '--surf-brand': 'oklch(0.8 0.1 200)' },
    light: {},
    shared: {},
  })
  const light = css.slice(css.indexOf("[data-theme='light'] {"))
  assert.match(light, /--surf-brand: revert-layer;/)
})
