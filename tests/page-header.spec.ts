import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
test('page header keeps semantic rank, optional slots and native action focus', async ({
  page,
}) => {
  await page.goto('/patterns/page-header')
  await waitForCatalogReady(page)
  const preview = page.locator('.page-header-preview')
  await expect(preview).toHaveCSS('border-top-width', '1px')
  await expect(preview.getByRole('combobox')).toHaveCount(0)
  await expect(preview.getByRole('checkbox')).toHaveCount(0)
  await expect(page.locator('.catalog-example-frame')).toHaveCount(1)
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(preview.getByRole('heading', { level: 3 })).toHaveText(
    'Deployment workspace',
  )
  await expect(preview.locator('[aria-current="page"]')).toHaveText(
    'Page header',
  )
  for (const profile of ['inventory', 'docs', 'workspace']) {
    await page.getByRole('combobox', { name: 'Heading role' }).click()
    await page
      .getByRole('option', {
        name:
          profile === 'inventory'
            ? 'Page'
            : profile === 'docs'
              ? 'Reading'
              : 'Application',
        exact: true,
      })
      .click()
    // Documents and applications open with the display role; inventories with page.
    await expect(preview.locator('h3')).toHaveAttribute(
      'data-size',
      profile === 'inventory' ? 'page' : 'display',
    )
  }
  const action = preview.getByRole('button', { name: 'Run preview' })
  await action.focus()
  await page.keyboard.press('Enter')
  await expect(action).toBeFocused()
  await expect(
    page.getByRole('status').filter({ hasText: 'Local action preview:' }),
  ).toContainText('Local action preview: 1')
  await page.getByRole('checkbox', { name: 'Supporting content' }).uncheck()
  await expect(preview.getByRole('navigation')).toHaveCount(0)
  await expect(preview.getByRole('group')).toHaveCount(0)
  await expect(preview.locator('.surf-page-header-description')).toHaveCount(0)
  await expect(preview.getByRole('heading')).toBeVisible()
})
for (const theme of ['light', 'dark'])
  test(`long page headers wrap without clipping and stay accessible in ${theme}`, async ({
    page,
  }) => {
    await page.goto('/patterns/page-header')
    await waitForCatalogReady(page)
    if (theme === 'dark') {
      await page.getByRole('button', { name: 'Toggle theme' }).click()
      await expect(page.locator('html')).not.toHaveAttribute(
        'data-theme-switching',
      )
    }
    await page.getByRole('checkbox', { name: 'Long title' }).check()
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 1000 })
      const preview = page.locator('.page-header-preview')
      expect(
        await preview.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true)
      expect(
        await preview
          .locator('h3')
          .evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true)
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    }
  })
