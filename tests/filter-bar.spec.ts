import { components } from '../demo/catalog'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
test('filters compose conjunctively, announce counts, clear independently and preserve focus', async ({
  page,
}) => {
  await page.goto('/patterns/filter-bar')
  await waitForCatalogReady(page)
  const form = page.getByRole('search', { name: 'Filter preview resources' }),
    query = form.getByRole('searchbox', { name: 'Search resources' }),
    summary = form.getByRole('status')
  await expect(summary).toContainText('4 of 4')
  await expect(
    form.getByRole('button', { name: 'Clear all filters' }),
  ).toBeDisabled()
  await form.getByRole('combobox', { name: 'Filter product' }).click()
  await page.getByRole('option', { name: 'Workspace', exact: true }).click()
  await expect(summary).toContainText('2 of 4')
  await form.getByRole('combobox', { name: 'Filter state' }).click()
  await page.getByRole('option', { name: 'Pending', exact: true }).click()
  await expect(summary).toContainText('1 of 4')
  await query.fill('missing-result')
  await query.press('Enter')
  await expect(summary).toContainText('0 of 4')
  await expect(
    page.getByRole('heading', { name: 'No matching resources' }),
  ).toBeVisible()
  await form.getByRole('button', { name: /^Remove search filter:/ }).click()
  await expect(query).toBeFocused()
  await expect(summary).toContainText('1 of 4')
  await form.getByRole('button', { name: 'Clear all filters' }).click()
  await expect(query).toBeFocused()
  await expect(summary).toContainText('4 of 4')
  await expect(
    form.getByRole('combobox', { name: 'Filter state' }),
  ).toContainText('All states')
  expect(new URL(page.url()).pathname).toBe('/patterns/filter-bar')
})
test('real catalog shares filter controls, reset and native form keyboard behavior', async ({
  page,
}) => {
  await page.goto('/components')
  await waitForCatalogReady(page)
  const form = page.getByRole('search', { name: 'Filter catalog' }),
    input = form.getByRole('searchbox', { name: 'Search catalog' })
  await input.fill('Toast')
  await input.press('Enter')
  await expect(page.locator('.catalog-item')).toHaveCount(1)
  await expect(form.getByRole('status')).toContainText('1 /')
  await form.getByRole('button', { name: 'Clear filters' }).click()
  await expect(input).toBeFocused()
  await expect(input).toHaveValue('')
  await expect(page.locator('.catalog-item')).toHaveCount(components.length)
})
for (const theme of ['light', 'dark'])
  test(`filter bar wraps long values and remains accessible in ${theme}`, async ({
    page,
  }) => {
    await page.goto('/patterns/filter-bar')
    await waitForCatalogReady(page)
    if (theme === 'dark') {
      await page.getByRole('button', { name: 'Toggle theme' }).click()
      await expect(page.locator('html')).not.toHaveAttribute(
        'data-theme-switching',
      )
    }
    const form = page.getByRole('search', { name: 'Filter preview resources' })
    await form
      .getByRole('searchbox')
      .fill('platform-api-abcdefghijklmnopqrstuvwxyz0123456789'.repeat(3))
    for (const width of [1440, 760, 320]) {
      await page.setViewportSize({ width, height: 1000 })
      expect(
        await form.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true)
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    }
  })
