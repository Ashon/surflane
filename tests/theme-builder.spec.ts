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
  const dark = declared(":root, [data-theme='dark'], [data-theme='light']")
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
    ['--surf-ink-body', '--surf-canvas'],
    ['--surf-ink-muted', '--surf-canvas'],
    ['--surf-ink', '--surf-chrome'],
    ['--surf-ink-muted', '--surf-surface'],
    ['--surf-on-brand', '--surf-brand'],
    ['--surf-brand-ink', '--surf-canvas'],
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
  expect(inGamut('rgb')(theme.dark['--surf-brand'])).toBe(true)
  expect(theme.dark['--surf-brand']).toMatch(/^oklch\(0\.82 0\.0\d+ 255\)$/)
  expect(Object.keys(theme.dark)).not.toContain('--surf-success')
  // Light text on a light accent would fail, so light links stay on the neutral ink.
  expect(theme.light['--surf-brand-ink']).toBe('var(--surf-ink)')
})

test('a preset never carries a dark value into light, chosen or from the system', async ({
  page,
}) => {
  const tokens = readFileSync('packages/tokens/tokens.css', 'utf8')
  const accent = readFileSync(
    'packages/tokens/themes/accent-violet.css',
    'utf8',
  )
  // A token the theme sets only for dark keeps the tokens' own light value.
  const custom = themeCss({
    dark: { '--surf-canvas': 'oklch(0.5 0.2 30)' },
    light: {},
    shared: {},
  })
  const read = (theme?: string) =>
    page.evaluate((theme) => {
      if (theme) document.documentElement.dataset.theme = theme
      else delete document.documentElement.dataset.theme
      const style = getComputedStyle(document.documentElement)
      const value = (name: string) => style.getPropertyValue(name).trim()
      return {
        brandInk: value('--surf-brand-ink'),
        ink: value('--surf-ink'),
        canvas: value('--surf-canvas'),
      }
    }, theme)
  await page.setContent(
    `<style>${tokens}</style><style>${accent}</style><style>${custom}</style>`,
  )
  for (const [colorScheme, theme] of [
    ['dark', 'light'],
    ['light', undefined],
  ] as const) {
    await page.emulateMedia({ colorScheme })
    const light = await read(theme)
    expect(light.brandInk, `${colorScheme} ${theme}`).toBe(light.ink)
    expect(light.canvas, `${colorScheme} ${theme}`).toBe('oklch(1 0 0)')
  }
  await page.emulateMedia({ colorScheme: 'dark' })
  const dark = await read()
  expect(dark.brandInk).toBe('oklch(0.82 0.105 300)')
  expect(dark.canvas).toBe('oklch(0.5 0.2 30)')
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
    '@layer surflane.tokens, surflane.themes, surflane.base, surflane.components, surflane.sizes',
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
    ":root, [data-theme='dark'], [data-theme='light']",
    ":root, [data-theme='dark']",
    ":root[data-theme='light'], [data-theme='light']",
    '@media (prefers-color-scheme: light)',
  ])
  expect(css).toContain('--surf-radius-md: 6px;')
  expect(css).toContain(
    ":root:not([data-theme='dark']):not([data-theme='light'])",
  )
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
    // An alias, or a relative color of one token: either way it only reads tokens.
    const target = (/^var\((--[\w-]+)\)$/.exec(decl.value) ??
      /^oklch\(from var\((--[\w-]+)\) [^()]*(?:\([^()]*\)[^()]*)*\)$/.exec(
        decl.value,
      ))?.[1]
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
    expect(await token('--surf-brand')).toBe('oklch(0.82 0.105 300)')
    expect(await token('--surf-radius-md')).toBe('6px')
    // Success mixes its own base with the neutral ink; the accent never enters it.
    const success = (await token('--surf-status-success-fg'))
      .replace(/\s+/g, ' ')
      .replace(/\( /g, '(')
      .replace(/ \)/g, ')')
    expect(success).toContain('oklch(0.74 0.15 155)')
    expect(success).not.toContain('300)')
    // The catalog outside the preview keeps its own theme.
    expect(
      await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue('--surf-brand')
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
    await expect(code).toContainText('--surf-brand: oklch(0.82 0.105 300);')
    await expect(page.getByText("themes/accent-violet.css';")).toBeVisible()
    await expect(page.getByText("themes/radius-small.css';")).toBeVisible()
  })

  test('pills scale with the radius: larger parts round first, and radius 0 squares them', async ({
    page,
  }) => {
    await page.goto('/foundations/themes')
    await page.locator('.theme-preview').waitFor()
    const corner = (selector: string) =>
      page
        .locator(`.theme-preview ${selector}`)
        .first()
        .evaluate((el) => {
          const box = el.getBoundingClientRect()
          // The rendered corner: a radius past half the height draws as a pill.
          return Math.min(
            parseFloat(getComputedStyle(el).borderTopLeftRadius),
            box.height / 2,
          )
        })
    const height = (selector: string) =>
      page
        .locator(`.theme-preview ${selector}`)
        .first()
        .evaluate((el) => el.getBoundingClientRect().height)
    const inputs = page.getByRole('region', { name: 'Theme inputs' })
    // Default: every pill part is a full pill.
    for (const selector of ['.surf-button', '.surf-switch', '.surf-badge'])
      expect(await corner(selector), selector).toBe(
        (await height(selector)) / 2,
      )
    // Small: 13px rounds the button's corners, while the shorter badge stays a pill.
    await inputs.getByRole('button', { name: 'Small', exact: true }).click()
    expect(await corner('.surf-button')).toBe(13)
    expect(await corner('.surf-badge')).toBe((await height('.surf-badge')) / 2)
    await inputs.getByRole('button', { name: 'None', exact: true }).click()
    for (const selector of ['.surf-button', '.surf-switch', '.surf-badge'])
      expect(await corner(selector), selector).toBe(0)
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

test('data-theme takes dark or light; any other value keeps the theme around it, and on the root follows the system', async ({
  page,
}) => {
  const tokens = readFileSync('packages/tokens/tokens.css', 'utf8')
  await page.setContent(
    `<style>${tokens}</style><div id="light" data-theme="light"><div id="odd" data-theme="brand"></div></div>`,
  )
  const canvas = (selector: string) =>
    page
      .locator(selector)
      .evaluate((el) =>
        getComputedStyle(el).getPropertyValue('--surf-canvas').trim(),
      )
  // Inside a light region, an unknown value inherits light instead of turning dark.
  expect(await canvas('#odd')).toBe(await canvas('#light'))
  // On the root, an unknown value follows the system preference.
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme })
    await page.evaluate(
      () => (document.documentElement.dataset.theme = 'brand'),
    )
    const root = await canvas('html')
    await page.evaluate(
      (scheme) => (document.documentElement.dataset.theme = scheme),
      colorScheme,
    )
    expect(root, colorScheme).toBe(await canvas('html'))
  }
})
