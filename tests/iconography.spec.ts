import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import tokenCatalog from '../packages/tokens/catalog.json' with { type: 'json' }
import { iconNames } from '../packages/ui/src/icon'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
test('icon sizes follow the component scale, the stroke is shape metadata and vocabulary names are unique', () => {
  expect(new Set(iconNames).size).toBe(iconNames.length)
  expect(iconNames).toHaveLength(30)
  for (const [name, category] of [
    ['--size-icon-small', 'Controls'],
    ['--size-icon-default', 'Controls'],
    ['--size-icon-large', 'Controls'],
    ['--icon-stroke-width', 'Shape'],
  ]) {
    const token = tokenCatalog.tokens.find((token) => token.name === name)
    expect(token?.category, name).toBe(category)
    expect(token?.type, name).not.toBe('color')
  }
})
test('glyphs retain geometry, explicit semantics and noninteractive focus behavior', async ({
  page,
}) => {
  await page.goto('/foundations/iconography')
  await waitForCatalogReady(page)
  await expect(
    page.getByLabel('Shared icon vocabulary').locator('li'),
  ).toHaveCount(iconNames.length)
  for (const [size, pixels] of [
    ['small', 14],
    ['default', 16],
    ['large', 20],
  ] as const) {
    const icon = page.locator(`[data-icon-specimen="${size}"]`)
    const style = await icon.evaluate((element) => {
      const style = getComputedStyle(element),
        rect = element.getBoundingClientRect()
      return {
        width: rect.width,
        height: rect.height,
        strokeWidth: parseFloat(style.strokeWidth),
        stroke: style.stroke,
        color: style.color,
      }
    })
    expect(style.width).toBe(pixels)
    expect(style.height).toBe(pixels)
    expect(style.strokeWidth).toBe(1.7)
    expect(style.stroke).toBe(style.color)
    await expect(icon).toHaveAttribute('viewBox', '0 0 24 24')
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    await expect(icon).toHaveAttribute('focusable', 'false')
    await expect(icon).not.toHaveAttribute('tabindex')
  }
  await expect(page.getByRole('img')).toHaveCount(1)
  await expect(
    page.getByRole('img', { name: 'Supplementary information' }),
  ).toHaveAttribute('class', 'pui-icon')
  await expect(
    page
      .getByRole('button', { name: 'Reset preview', exact: true })
      .locator('svg'),
  ).toHaveAttribute('aria-hidden', 'true')
  await page.getByRole('button', { name: 'Increment preview' }).focus()
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('status').filter({ hasText: 'Local count' }),
  ).toHaveText('Local count: 1')
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('button', { name: 'Reset preview', exact: true }),
  ).toBeFocused()
  await page.keyboard.press('Space')
  await expect(
    page.getByRole('status').filter({ hasText: 'Local count' }),
  ).toHaveText('Local count: 0')
})
test('only logical direction icons mirror in RTL, including a nested LTR override', async ({
  page,
}) => {
  await page.goto('/foundations/iconography')
  await waitForCatalogReady(page)
  const preview = page.locator('[data-icon-direction]')
  const directional = preview.locator('[data-directional="true"]').first()
  expect(
    await directional.evaluate(
      (element) => getComputedStyle(element).transform,
    ),
  ).toBe('none')
  await page
    .getByRole('combobox', { name: 'Preview direction', exact: true })
    .click()
  await page.getByRole('option', { name: 'Right to left', exact: true }).click()
  await expect(preview).toHaveAttribute('dir', 'rtl')
  expect(
    await directional.evaluate(
      (element) => getComputedStyle(element).transform,
    ),
  ).toBe('matrix(-1, 0, 0, 1, 0, 0)')
  expect(
    await preview
      .locator('svg:not([data-directional])')
      .evaluate((element) => getComputedStyle(element).transform),
  ).toBe('none')
  await directional.evaluate((element) =>
    element.parentElement!.setAttribute('dir', 'ltr'),
  )
  expect(
    await directional.evaluate(
      (element) => getComputedStyle(element).transform,
    ),
  ).toBe('none')
})
for (const width of [1440, 320])
  for (const dark of [false, true]) {
    test(`iconography fits ${width}px dark=${dark} and retains accessible names`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto('/foundations/iconography')
      await waitForCatalogReady(page)
      if (dark) await page.getByRole('button', { name: 'Toggle theme' }).click()
      expect(
        await page.evaluate(() => document.body.scrollWidth <= innerWidth),
      ).toBe(true)
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
      const reset = page.getByRole('button', {
        name: 'Reset preview',
        exact: true,
      })
      const box = await reset.boundingBox()
      expect(box!.height).toBeGreaterThanOrEqual(width === 320 ? 44 : 36)
      expect(box!.width).toBeGreaterThanOrEqual(width === 320 ? 44 : 36)
      await reset.focus()
      await page.keyboard.press('Tab')
      await page.keyboard.press('Shift+Tab')
      await expect(reset).toBeFocused()
      expect(
        await reset.evaluate(
          (element) => getComputedStyle(element).outlineStyle,
        ),
      ).not.toBe('none')
    })
  }
test('forced colors follows system color and token links keep the correct public name', async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: 'active' })
  await page.goto('/foundations/iconography')
  await waitForCatalogReady(page)
  const icon = page.locator('[data-icon-specimen="default"]')
  expect(
    await icon.evaluate((element) => getComputedStyle(element).stroke),
  ).toBe(await icon.evaluate((element) => getComputedStyle(element).color))
  await expect(
    page.getByRole('button', { name: 'Reset preview', exact: true }),
  ).toBeEnabled()
  await page
    .getByRole('link', { name: '--size-icon-default', exact: true })
    .click()
  await waitForCatalogReady(page)
  await expect(page).toHaveURL(/tokens\?q=--size-icon-default/)
  await page.goBack()
  await waitForCatalogReady(page)
  await expect(page.locator('#page-title')).toHaveText('Iconography')
})
