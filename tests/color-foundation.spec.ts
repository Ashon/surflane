import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { contrastRatio } from '../demo/contrast'
import {
  contrast,
  difference,
  inGamut,
  lightnessFor,
  oklch,
  parseOklch,
  simulate,
  toGamut,
  toHex,
} from '../demo/oklch'
import {
  buildCategories,
  buildRamps,
  closestPair,
  dichromats,
  evaluate,
  harmonyHues,
  harmonyOffsets,
} from '../demo/palette'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
test('sRGB contrast uses linearized channels and unrounded comparison', () => {
  expect(contrastRatio([0, 0, 0], [255, 255, 255])).toBe(21)
  expect(contrastRatio([82, 247, 86], [82, 247, 86])).toBe(1)
  const borderline = contrastRatio([119, 119, 119], [255, 255, 255])
  expect(borderline).toBeCloseTo(4.478089, 5)
  expect(borderline).toBeLessThan(4.5)
  expect(contrastRatio([255, 255, 255], [119, 119, 119])).toBe(borderline)
})
for (const width of [1440, 320])
  for (const theme of ['light', 'dark']) {
    test(`color foundation uses measured semantic pairs and fits ${width}px ${theme}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto('/foundations/color')
      await waitForCatalogReady(page)
      if (theme === 'dark')
        await page.getByRole('button', { name: 'Toggle theme' }).click()
      await expect(page.locator('[data-color-measured]')).toHaveCount(1)
      const rows = page.locator('[data-color-row]')
      await expect(rows).toHaveCount(61)
      await expect
        .poll(async () =>
          (await page.locator('[data-color-verdict]').allTextContents()).every(
            (text) => text === 'Meets threshold',
          ),
        )
        .toBe(true)
      for (const row of await rows.all()) {
        const threshold = Number(await row.getAttribute('data-color-threshold'))
        const ratio = parseFloat(
          await row.locator('[data-color-ratio]').innerText(),
        )
        expect(ratio).toBeGreaterThanOrEqual(threshold)
      }
      expect(
        await page.evaluate(() => document.body.scrollWidth <= innerWidth),
      ).toBe(true)
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
      await expect(page.getByLabel('Semantic status examples')).toContainText(
        'Failed',
      )
    })
  }
test('theme changes refresh actual ratios and token links retain names', async ({
  page,
}) => {
  await page.goto('/foundations/color#contrast')
  await waitForCatalogReady(page)
  const ratio = page.locator('[data-color-row="Body"] [data-color-ratio]')
  await expect(ratio).toHaveText(/:1$/)
  const before = await ratio.textContent()
  await page.getByRole('button', { name: 'Toggle theme' }).click()
  await expect(ratio).not.toHaveText(before!)
  await page
    .locator('[data-color-row="Body"]')
    .getByRole('link', { name: '--ink-body', exact: true })
    .click()
  await waitForCatalogReady(page)
  await expect(page).toHaveURL(/tokens\?q=--ink-body/)
  await page.goBack()
  await waitForCatalogReady(page)
  await expect(page.locator('#page-title')).toHaveText('Color')
})
test('forced colors suppresses token certification and retains readable documentation', async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: 'active' })
  await page.goto('/foundations/color')
  await waitForCatalogReady(page)
  await expect(
    page.getByRole('status').filter({ hasText: 'Forced colors' }),
  ).toContainText('Forced colors')
  await expect(page.locator('[data-color-verdict]')).toHaveText(
    Array(61).fill('Not evaluated'),
  )
  await page.emulateMedia({ forcedColors: 'none' })
  await expect
    .poll(async () =>
      (await page.locator('[data-color-verdict]').allTextContents()).every(
        (text) => text === 'Meets threshold',
      ),
    )
    .toBe(true)
})

test('system theme refreshes all measured pairs when the OS scheme changes', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/foundations/color')
  await waitForCatalogReady(page)
  await page.evaluate(() =>
    document.documentElement.removeAttribute('data-theme'),
  )
  const ratio = page.locator('[data-color-row="Body"] [data-color-ratio]')
  const before = await ratio.innerText()
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(ratio).not.toHaveText(before)
  await expect(page.locator('[data-color-verdict]')).toHaveText(
    Array(61).fill('Meets threshold'),
  )
  await page.emulateMedia({ colorScheme: 'light' })
  await expect(ratio).toHaveText(before)
})

for (const theme of ['light', 'dark'])
  test(`surface steps stay distinguishable from what they sit on in ${theme}`, async ({
    page,
    context,
  }) => {
    await context.addCookies([
      { name: 'surflane-theme', value: theme, url: 'http://127.0.0.1:8066' },
    ])
    await page.goto('/foundations/color')
    await waitForCatalogReady(page)
    const colors = await page.evaluate(
      (tokens) => {
        const context = document
          .createElement('canvas')
          .getContext('2d', { willReadFrequently: true })!
        return Object.fromEntries(
          tokens.map((token) => {
            const probe = document.createElement('i')
            probe.style.color = `var(${token})`
            document.body.append(probe)
            const value = getComputedStyle(probe).color
            probe.remove()
            context.clearRect(0, 0, 1, 1)
            context.fillStyle = value
            context.fillRect(0, 0, 1, 1)
            return [
              token,
              [...context.getImageData(0, 0, 1, 1).data.slice(0, 3)],
            ]
          }),
        )
      },
      [
        '--chrome',
        '--canvas',
        '--surface',
        '--code-bg',
        '--hover',
        '--selected',
      ],
    )
    for (const [layer, base] of [
      ['--canvas', '--chrome'],
      ['--surface', '--canvas'],
      ['--code-bg', '--canvas'],
      ['--code-bg', '--chrome'],
      ['--hover', '--canvas'],
      ['--hover', '--chrome'],
      ['--selected', '--hover'],
    ])
      expect(
        contrastRatio(
          colors[layer] as [number, number, number],
          colors[base] as [number, number, number],
        ),
        `${theme}: ${layer} on ${base}`,
      ).toBeGreaterThanOrEqual(1.05)
  })

test('palette color math converts, measures and finds a passing lightness', () => {
  expect(contrast(oklch(1, 0, 0), oklch(0, 0, 0))).toBeCloseTo(21, 5)
  expect(toHex(oklch(1, 0, 0))).toBe('#ffffff')
  expect(toHex(oklch(0, 0, 0))).toBe('#000000')
  // An out-of-gamut request is clamped, never clipped per channel.
  const vivid = oklch(0.6, 0.4, 145)
  expect(inGamut(vivid)).toBe(false)
  expect(inGamut(toGamut(vivid))).toBe(true)
  const white = oklch(1, 0, 0)
  const pale = oklch(0.8, 0.1, 210)
  const l = lightnessFor(pale, white, 4.5)!
  expect(l).toBeLessThan(0.8)
  expect(contrast(toGamut({ ...pale, l }), white)).toBeGreaterThanOrEqual(4.5)
  // Grayscale sees two colors of one lightness as nearly the same; OKLCH lightness
  // tracks luminance closely but not exactly, so the gap is small, not zero.
  const [r, g, b] = simulate(oklch(0.6, 0.1, 30), 'achromatopsia')
  expect(r).toBe(g)
  expect(g).toBe(b)
  const coral = oklch(0.6, 0.1, 30),
    teal = oklch(0.6, 0.1, 210)
  expect(difference(coral, teal, 'achromatopsia')).toBeLessThan(
    difference(coral, teal) / 5,
  )
  expect(parseOklch('oklch(0.82 0.12 210)')).toEqual({
    l: 0.82,
    c: 0.12,
    h: 210,
  })
  expect(parseOklch('oklch(0.82 0.12 210 / 0.3)')).toBeNull()
})

test('palette lab scores the palette against the guidelines and applies a passing foreground', async ({
  page,
}) => {
  await page.goto('/foundations/color#lab')
  await waitForCatalogReady(page)
  const criteria = page.locator('[data-palette-criterion]')
  await expect(criteria).toHaveCount(9)
  await expect(
    page.locator('[data-palette-criterion="accent"] [data-palette-verdict]'),
  ).toHaveAttribute('data-palette-verdict', 'pass')
  // A pale swatch on white fails body text until the checker applies its suggestion.
  await page
    .getByRole('button', { name: /^Hue 210°, step 200,/ })
    .first()
    .click()
  const ratio = page.locator('[data-palette-ratio]')
  expect(parseFloat(await ratio.innerText())).toBeLessThan(4.5)
  await page
    .getByRole('button', {
      name: 'Apply the foreground for 4.5:1',
      exact: true,
    })
    .click()
  await expect
    .poll(async () => parseFloat(await ratio.innerText()))
    .toBeGreaterThanOrEqual(4.5)
  // Turning the base hue on the wheel toward caution amber asks for review.
  const base = page.getByRole('slider', { name: 'Base hue', exact: true })
  await base.focus()
  for (let i = 0; i < 8; i++) await page.keyboard.press('PageDown')
  await expect(base).toHaveAttribute('aria-valuenow', '90')
  await expect(
    page.locator('[data-palette-criterion="status"] [data-palette-verdict]'),
  ).toHaveAttribute('data-palette-verdict', 'review')
  // Turning a supporting hue keeps its own angle and makes the harmony custom.
  await page.locator('[data-wheel-marker="2"]').focus()
  await page.keyboard.press('Shift+ArrowRight')
  await expect(page.getByText('Hues: 90°, 60°, 135°')).toBeVisible()
  await page
    .getByRole('button', { name: 'Start from the brand', exact: true })
    .click()
  // The brand sets the base; the custom angles stay.
  await expect(base).toHaveAttribute('aria-valuenow', '210')
  await expect(page.getByText('Hues: 210°, 180°, 255°')).toBeVisible()
})

test('the wheel renderer matches the reference color math and reuses its buffers', async ({
  page,
}) => {
  await page.goto('/foundations/color')
  await waitForCatalogReady(page)
  const result = await page.evaluate(async () => {
    const renderer = await import('/wheelRenderer.ts')
    const math = await import('/oklch.ts')
    const size = 101
    const image = renderer.renderPlane(0.7, size)
    const pixel = (x: number, y: number) =>
      Array.from(image.data.slice((y * size + x) * 4, (y * size + x) * 4 + 4))
    const hex = (rgba: number[]) =>
      '#' +
      rgba
        .slice(0, 3)
        .map((v) => v.toString(16).padStart(2, '0'))
        .join('')
    // Straight up from the center is hue 0°; 20 of 50.5 pixels out is chroma 0.127.
    const expected = math.toHex(
      math.oklch(0.7, (20 / (size / 2)) * renderer.rimChroma, 0),
    )
    return {
      center: hex(pixel(50, 50)),
      gray: math.toHex(math.oklch(0.7, 0, 0)),
      inside: pixel(50, 30),
      expected,
      outside: pixel(50, 1)[3],
      corner: pixel(0, 0)[3],
      cached:
        renderer.planeBuffer(0.7, size) === renderer.planeBuffer(0.7, size),
    }
  })
  const channels = (hex: string) =>
    [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const near = (a: number[], b: number[]) =>
    a.every((value, i) => Math.abs(value - b[i]) <= 1)
  expect(near(channels(result.center), channels(result.gray))).toBe(true)
  expect(near(result.inside.slice(0, 3), channels(result.expected))).toBe(true)
  expect(result.inside[3]).toBe(255)
  // Near the rim at L 0.7, hue 0° is outside sRGB: the plane fades there.
  expect(result.outside).toBeLessThan(80)
  expect(result.corner).toBe(0)
  expect(result.cached).toBe(true)
})

test('the guideline check grades a palette by its thresholds', () => {
  const white = oklch(1, 0, 0),
    darkCanvas = oklch(0.2785, 0.0132, 253),
    ink = oklch(0.2369, 0.0097, 248)
  const hue = 210,
    chroma = 0.12
  const hues = harmonyHues(hue, harmonyOffsets.analogous)
  const ramps = buildRamps(hues, chroma)
  const categories = buildCategories({
    count: 6,
    lightness: 0.52,
    spread: 0.03,
    chroma,
    hue,
  })
  const verdicts = Object.fromEntries(
    evaluate({
      ramps,
      hues,
      hue,
      chroma,
      categories,
      canvas: white,
      white,
      darkCanvas,
      ink,
    }).map((guideline) => [guideline.criterion, guideline.verdict]),
  )
  // The brand cyan can't hold C 0.12 in its darker middle steps, and six evenly
  // spread hues collapse for a deuteranope: both are worth a second look.
  expect(verdicts).toEqual({
    textLight: 'pass',
    textDark: 'pass',
    gamut: 'review',
    area: 'pass',
    status: 'pass',
    accent: 'pass',
    distinct: 'pass',
    cvd: 'fail',
    visible: 'pass',
  })
  // Surflane's own light chart categories, which Chart backs with markers and patterns.
  const chart = [
    [0.5, 0.14, 255],
    [0.52, 0.09, 190],
    [0.52, 0.12, 140],
    [0.56, 0.12, 70],
    [0.54, 0.17, 25],
    [0.5, 0.15, 310],
  ].map(([l, c, h]) => oklch(l, c, h))
  expect(closestPair(chart, ['typical']).value).toBeGreaterThan(0.08)
  expect(closestPair(chart, dichromats).value).toBeGreaterThan(0.02)
})
