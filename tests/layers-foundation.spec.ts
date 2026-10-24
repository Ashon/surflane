import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'

test('a large local z-index stays trapped and moving the same plane through a portal changes hit testing', async ({
  page,
}) => {
  await page.goto('/foundations/layers#contexts')
  await waitForCatalogReady(page)
  const stage = page.locator('.layer-demo-stage'),
    plane = page.locator('[data-layer-plane]')
  await stage.scrollIntoViewIfNeeded()
  const hit = () =>
    plane.evaluate((el) => {
      const r = el.getBoundingClientRect()
      return document.elementFromPoint(r.x + 20, r.y + 50)?.className
    })
  expect(await hit()).toBe('layer-demo-cover')
  await page.getByRole('checkbox', { name: 'Clip local host' }).uncheck()
  await expect(page.locator('.layer-demo-host')).toHaveCSS(
    'overflow',
    'visible',
  )
  expect(await hit()).toBe('layer-demo-cover')
  await page
    .getByRole('button', { name: 'Portal to demonstration stage' })
    .click()
  await expect(plane).toHaveAttribute('data-portalled', 'true')
  expect(await hit()).toBe('layer-demo-plane')
  await page.getByRole('checkbox', { name: 'Clip local host' }).check()
  expect(await hit()).toBe('layer-demo-plane')
  await expect(
    page.getByRole('status', { name: 'Stacking demonstration result' }),
  ).toContainText('appears in front')
})
test('nested selection, tooltip, popover and modal preserve layer roles, selection and Escape focus order', async ({
  page,
}) => {
  await page.goto('/foundations/layers')
  await waitForCatalogReady(page)
  const trigger = page.getByRole('button', {
    name: 'Open layered dialog',
    exact: true,
  })
  await trigger.click()
  const dialog = page.getByRole('dialog', {
    name: 'Layered workspace preview',
    exact: true,
  })
  await expect(dialog).toBeVisible()
  const select = dialog.getByRole('combobox', { name: 'Preview environment' })
  await select.click()
  await expect(page.locator('.surf-select-popup')).toBeVisible()
  await expect(page.locator('.surf-select-popup').locator('..')).toHaveCSS(
    'z-index',
    '1200',
  )
  await page
    .getByRole('option', { name: 'Production preview', exact: true })
    .click()
  await expect(dialog.locator('[data-layer-region]')).toHaveText('production')
  const tipButton = dialog.getByRole('button', {
    name: 'Explain this layer',
    exact: true,
  })
  await select.focus()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await expect(tipButton).toBeFocused()
  await expect(page.locator('.surf-tooltip')).toBeVisible()
  await expect(page.locator('.surf-tooltip-positioner')).toHaveCSS(
    'z-index',
    '1300',
  )
  await page.keyboard.press('Escape')
  await expect(dialog).toBeVisible()
  const popoverButton = dialog.getByRole('button', {
    name: 'Inspect overlay details',
  })
  await popoverButton.click()
  await expect(page.locator('.surf-popover')).toContainText('production')
  await page.keyboard.press('Escape')
  await expect(popoverButton).toBeFocused()
  const childTrigger = dialog.getByRole('button', {
    name: 'Open nested dialog',
    exact: true,
  })
  await childTrigger.click()
  const nested = page.getByRole('dialog', {
    name: 'Nested inspection',
    exact: true,
  })
  await expect(nested).toBeVisible()
  await expect(
    nested.getByRole('button', { name: 'Close dialog', exact: true }),
  ).toBeFocused()
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('Tab')
    await expect
      .poll(() => nested.evaluate((el) => el.contains(document.activeElement)))
      .toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(nested).toHaveCount(0)
  await expect(childTrigger).toBeFocused()
  await expect(dialog.locator('[data-layer-region]')).toHaveText('production')
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
})
test('the layer scale reads its values from the tokens and links to the real catalog', async ({
  page,
}) => {
  await page.goto('/foundations/layers')
  await waitForCatalogReady(page)
  await expect(
    page.locator('[data-layer-token="--surf-layer-popup"]'),
  ).toHaveText('1200')
  await expect(
    page.locator('[data-layer-token="--surf-layer-tooltip"]'),
  ).toHaveText('1300')
  await page
    .getByRole('link', { name: '--surf-layer-tooltip', exact: true })
    .click()
  await waitForCatalogReady(page)
  await expect(page.locator('#page-title')).toHaveText('Design tokens')
  await expect(page.locator('main')).toContainText('--surf-layer-tooltip')
})
for (const width of [1440, 320])
  for (const theme of ['light', 'dark'])
    test(`layers guide and nested overlays pass accessibility at ${width}px ${theme}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/foundations/layers')
      await waitForCatalogReady(page)
      if (theme === 'dark') {
        await page.getByRole('button', { name: 'Toggle theme' }).click()
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
        await expect(page.locator('html')).not.toHaveAttribute(
          'data-theme-switching',
        )
      }
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true)
      await page
        .getByRole('button', { name: 'Open layered dialog', exact: true })
        .click()
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
      const dialog = page.getByRole('dialog', {
        name: 'Layered workspace preview',
        exact: true,
      })
      await dialog
        .getByRole('combobox', { name: 'Preview environment' })
        .click()
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
            .analyze()
        ).violations,
      ).toEqual([])
      await page.keyboard.press('Escape')
      await dialog
        .getByRole('button', { name: 'Inspect overlay details' })
        .click()
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
            .analyze()
        ).violations,
      ).toEqual([])
      await page.keyboard.press('Escape')
      await dialog
        .getByRole('button', { name: 'Open nested dialog', exact: true })
        .click()
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    })
