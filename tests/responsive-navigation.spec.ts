import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
const route = '/patterns/responsive-navigation'
test('the breakpoint transfers focus between visible navigation controls and closes the mobile sheet', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(route)
  await waitForCatalogReady(page)
  const sidebar = page.getByRole('complementary', {
    name: 'Example workspace sidebar',
  })
  const resource = sidebar.getByRole('link', {
    name: 'Resources',
    exact: true,
  })
  const trigger = page.getByRole('button', {
    name: 'Open workspace navigation',
  })
  await resource.focus()
  await page.setViewportSize({ width: 760, height: 1000 })
  await expect(trigger).toBeFocused()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', {
    name: 'Workspace navigation',
    exact: true,
  })
  await expect(dialog).toBeVisible()
  for (let index = 0; index < 10; index++) {
    await page.keyboard.press('Tab')
    await expect
      .poll(() => dialog.evaluate((e) => e.contains(document.activeElement)))
      .toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await trigger.click()
  await dialog.getByRole('link', { name: 'Resources', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Resources', exact: true }),
  ).toBeFocused()
  await trigger.click()
  await page.setViewportSize({ width: 761, height: 1000 })
  await expect(dialog).toBeHidden()
  await expect(resource).toBeFocused()
  await expect(trigger).toBeHidden()
  await page.setViewportSize({ width: 320, height: 900 })
  await expect(trigger).toBeFocused()
})
test('one destination model keeps long labels, restricted destinations and current state consistent', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(route)
  await waitForCatalogReady(page)
  const sidebar = page.getByRole('complementary', {
    name: 'Example workspace sidebar',
  })
  await sidebar.getByRole('link', { name: 'Settings', exact: true }).click()
  await page.getByRole('checkbox', { name: 'Read-only navigation' }).check()
  await expect(
    sidebar.getByRole('link', { name: 'Settings', exact: true }),
  ).toHaveCount(0)
  await expect(
    sidebar.getByRole('link', { name: 'Overview', exact: true }),
  ).toHaveAttribute('aria-current', 'page')
  await page.getByRole('checkbox', { name: 'Long navigation labels' }).check()
  const long = 'Resources / services and deployment pipelines by environment'
  await expect(
    sidebar.getByRole('link', { name: long, exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Collapse workspace sidebar' }).click()
  await expect(
    sidebar.getByRole('link', { name: long, exact: true }),
  ).toHaveAccessibleName(long)
  await page.setViewportSize({ width: 320, height: 900 })
  await page.getByRole('button', { name: 'Open workspace navigation' }).click()
  const dialog = page.getByRole('dialog', {
    name: 'Workspace navigation',
    exact: true,
  })
  await expect(
    dialog.getByRole('link', { name: 'Settings', exact: true }),
  ).toHaveCount(0)
  await expect(
    dialog.getByRole('link', { name: long, exact: true }),
  ).toHaveAccessibleName(long)
  await dialog.getByRole('link', { name: long, exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Resources', exact: true }),
  ).toBeFocused()
  await page.setViewportSize({ width: 1440, height: 1000 })
  await expect(
    sidebar.getByRole('link', { name: long, exact: true }),
  ).toHaveAttribute('aria-current', 'page')
})
test.describe('touch navigation', () => {
  test.use({ hasTouch: true })
  test('320px touch navigation and both themes retain clear names, bounded geometry and accessible modal semantics', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 })
    await page.goto(route)
    await waitForCatalogReady(page)
    for (const dark of [false, true]) {
      if (dark) {
        await page.getByRole('button', { name: 'Toggle theme: Light' }).tap()
        await expect(page.locator('html')).not.toHaveAttribute(
          'data-theme-switching',
        )
      }
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
      await page
        .getByRole('button', { name: 'Open workspace navigation' })
        .tap()
      const dialog = page.getByRole('dialog', {
        name: 'Workspace navigation',
        exact: true,
      })
      await expect(dialog).toHaveAttribute('aria-modal', 'true')
      // Base UI's aria-hidden focus sentinels hand focus straight back into the dialog.
      expect(
        (
          await new AxeBuilder({ page })
            .exclude('[data-base-ui-focus-guard]')
            .analyze()
        ).violations,
      ).toEqual([])
      expect((await dialog.boundingBox())!.width).toBeLessThanOrEqual(320)
      await dialog
        .getByRole('button', { name: 'Close workspace navigation' })
        .tap()
      await expect(
        page.getByRole('button', { name: 'Open workspace navigation' }),
      ).toBeFocused()
    }
    expect(
      await page
        .locator('.catalog-document-scroll')
        .evaluate((e) => e.scrollWidth <= e.clientWidth),
    ).toBe(true)
  })
})
