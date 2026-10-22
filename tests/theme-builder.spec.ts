import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFileSync } from 'node:fs'
import postcss, { type AtRule } from 'postcss'
// @ts-ignore Culori is a build/test-only color conversion utility.
import { converter, inGamut } from 'culori'
import {
  accentPresets,
  contrastRatio,
  createTheme,
  neutralPresets,
  radiusPresets,
  themeCss,
} from '../packages/tokens/theme-builder.js'

const source = postcss.parse(readFileSync('packages/tokens/tokens.css', 'utf8'))
const declared = (context: string) => {
  const values: Record<string, string> = {}
  source.walkRules((rule) => {
    if (rule.selector.replace(/\s+/g, ' ') !== context) return
    rule.walkDecls(/^--/, (decl) => {
      values[decl.prop] = decl.value.replace(/\s+/g, ' ')
    })
  })
  return values
}
const rgb = converter('rgb')
const same = (a: string, b: string) => {
  const [x, y] = [rgb(a), rgb(b)]
  for (const channel of ['r', 'g', 'b', 'alpha'] as const)
    expect(x[channel] ?? 1, `${a} vs ${b}`).toBeCloseTo(y[channel] ?? 1, 6)
}

test('the default inputs reproduce every role in tokens.css', () => {
  const theme = createTheme({
    neutral: neutralPresets.slate,
    accent: accentPresets.cyan,
    radius: radiusPresets.default,
  })
  const dark = declared(':root, [data-theme]')
  const light = declared(":root[data-theme='light'], [data-theme='light']")
  for (const [token, value] of Object.entries(theme.dark))
    same(value, dark[token])
  for (const [token, value] of Object.entries(theme.light))
    same(value, light[token])
  for (const [token, value] of Object.entries(theme.shared))
    expect(value, token).toBe(dark[token])
})

test('every preset combination stays in gamut and keeps text at 4.5:1', () => {
  const pairs = [
    ['--ink-body', '--canvas'],
    ['--ink-muted', '--canvas'],
    ['--ink', '--chrome'],
    ['--ink-muted', '--surface'],
    ['--on-brand', '--brand'],
    ['--brand-ink', '--canvas'],
  ]
  for (const neutral of Object.values(neutralPresets))
    for (const accent of Object.values(accentPresets)) {
      const theme = createTheme({ neutral, accent })
      for (const mode of ['dark', 'light'] as const) {
        for (const value of Object.values(theme[mode]))
          expect(inGamut('rgb')(value), value).toBe(true)
        for (const [fg, bg] of pairs)
          expect(
            contrastRatio(theme[mode][fg], theme[mode][bg]),
            `${mode} ${fg} on ${bg}`,
          ).toBeGreaterThanOrEqual(4.5)
      }
    }
})

test('accent chroma is clamped to the gamut and success keeps its own color', () => {
  const theme = createTheme({ accent: { hue: 255, chroma: 0.3 } })
  expect(inGamut('rgb')(theme.dark['--brand'])).toBe(true)
  expect(theme.dark['--brand']).toMatch(/^oklch\(0\.82 0\.0\d+ 255\)$/)
  expect(Object.keys(theme.dark)).not.toContain('--success')
  // Light text on a light accent would fail, so light links stay on the neutral ink.
  expect(Object.keys(theme.light)).not.toContain('--brand-ink')
})

test('theme CSS keeps dark values out of light regions and mirrors the system context', () => {
  const css = themeCss(
    createTheme({
      neutral: neutralPresets.stone,
      accent: accentPresets.violet,
      radius: radiusPresets.small,
    }),
  )
  const [order, layer] = postcss.parse(css).nodes as [AtRule, AtRule]
  // A theme sits in the themes layer, above the tokens, whichever file loads first.
  expect(order.toString()).toBe(
    '@layer surflane.tokens, surflane.themes, surflane.base, surflane.components',
  )
  expect(`${layer.name} ${layer.params}`).toBe('layer surflane.themes')
  const rules = layer.nodes!
  const selectors = rules.map((node) =>
    node.type === 'rule'
      ? node.selector.replace(/\s+/g, ' ')
      : node.type === 'atrule'
        ? `@${node.name} ${node.params}`
        : '',
  )
  expect(selectors).toEqual([
    ':root, [data-theme]',
    ":root, [data-theme]:not([data-theme='light'])",
    ":root[data-theme='light'], [data-theme='light']",
    '@media (prefers-color-scheme: light)',
  ])
  expect(css).toContain('--radius-md: 6px;')
  expect(css).toContain(':root:not([data-theme])')
})

test('preset files match the theme builder', () => {
  const presets = [
    ...Object.entries(neutralPresets).map(([name, neutral]) => [
      name,
      { neutral },
    ]),
    ...Object.entries(accentPresets).map(([name, accent]) => [
      `accent-${name}`,
      { accent },
    ]),
    ...Object.entries(radiusPresets).map(([name, radius]) => [
      `radius-${name}`,
      { radius },
    ]),
  ] as const
  for (const [file, input] of presets) {
    const css = readFileSync(`packages/tokens/themes/${file}.css`, 'utf8')
    const body = themeCss(createTheme(input))
    expect(css.slice(css.indexOf('*/') + 3), file).toBe(body)
  }
})

test('the shadcn bridge only reads Surflane tokens that exist', () => {
  const catalog = JSON.parse(
    readFileSync('packages/tokens/catalog.json', 'utf8'),
  )
  const names = new Set(
    catalog.tokens.map((token: { name: string }) => token.name),
  )
  const bridge = postcss.parse(
    readFileSync('packages/tokens/shadcn.css', 'utf8'),
  )
  let count = 0
  bridge.walkDecls(/^--/, (decl) => {
    count++
    expect(names.has(decl.prop), `${decl.prop} redefines a token`).toBe(false)
    const target = /^var\((--[\w-]+)\)$/.exec(decl.value)?.[1]
    expect(target && names.has(target), `${decl.prop}: ${decl.value}`).toBe(
      true,
    )
  })
  expect(count).toBeGreaterThanOrEqual(30)
})

test.describe('theme builder page', () => {
  test.use({ reducedMotion: 'reduce' })
  test('presets restyle only the preview, keep success, pass contrast and produce matching CSS', async ({
    page,
  }) => {
    await page.goto('/foundations/themes')
    await page.locator('.theme-preview').waitFor()
    const preview = page.locator('.theme-preview')
    const token = (name: string) =>
      preview.evaluate(
        (el, name) => getComputedStyle(el).getPropertyValue(name).trim(),
        name,
      )
    const inputs = page.getByRole('region', { name: 'Theme inputs' })
    await inputs.getByRole('button', { name: 'Stone', exact: true }).click()
    await inputs.getByRole('button', { name: 'Violet', exact: true }).click()
    await inputs.getByRole('button', { name: 'Small', exact: true }).click()
    expect(await token('--brand')).toBe('oklch(0.82 0.105 300)')
    expect(await token('--radius-md')).toBe('6px')
    // Success mixes its own base with the neutral ink; the accent never enters it.
    const success = (await token('--status-success-fg'))
      .replace(/\s+/g, ' ')
      .replace(/\( /g, '(')
      .replace(/ \)/g, ')')
    expect(success).toContain('oklch(0.82 0.12 210)')
    expect(success).not.toContain('300)')
    // The catalog outside the preview keeps its own theme.
    expect(
      await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue('--brand')
          .trim(),
      ),
    ).toBe('oklch(0.82 0.12 210)')
    const report = page.getByRole('table', {
      name: 'Contrast of text pairs in the current theme',
    })
    await expect(report.getByRole('row')).toHaveCount(7)
    await expect(report.getByText('Passes', { exact: true })).toHaveCount(6)
    const code = page.locator('pre').filter({
      hasText: 'Surflane theme: stone, accent violet, radius small',
    })
    await expect(code).toContainText('--brand: oklch(0.82 0.105 300);')
    await expect(page.getByText("themes/accent-violet.css';")).toBeVisible()
    await expect(page.getByText("themes/radius-small.css';")).toBeVisible()
  })

  test('chroma beyond the gamut is clamped and announced, and the page passes axe in both themes', async ({
    page,
  }) => {
    await page.goto('/foundations/themes')
    await page.locator('.theme-preview').waitFor()
    const inputs = page.getByRole('region', { name: 'Theme inputs' })
    await inputs.getByRole('button', { name: 'Violet', exact: true }).click()
    await inputs.getByRole('slider', { name: 'Accent chroma' }).focus()
    await page.keyboard.press('End')
    await expect(
      inputs.getByText(/the most this hue can show in sRGB/),
    ).toHaveAttribute('role', 'status')
    for (const mode of ['Dark', 'Light']) {
      await page
        .locator('.theme-stage')
        .getByRole('button', { name: mode, exact: true })
        .click()
      expect(
        (await new AxeBuilder({ page }).include('#main-content').analyze())
          .violations,
      ).toEqual([])
    }
  })
})
