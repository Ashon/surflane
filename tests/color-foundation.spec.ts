import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { contrastRatio } from '../demo/contrast'
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
      await expect(rows).toHaveCount(49)
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
  await expect(page.locator('#page-title')).toHaveText('Color / contrast')
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
    Array(49).fill('Not evaluated'),
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
    Array(49).fill('Meets threshold'),
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
