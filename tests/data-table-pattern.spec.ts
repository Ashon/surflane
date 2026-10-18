import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
async function option(page: Page, label: string, value: string) {
  await page.getByRole('combobox', { name: label, exact: true }).click()
  await page.getByRole('option', { name: value, exact: true }).click()
}
const table = (page: Page) =>
  page.getByRole('table', {
    name: 'Resource inventory / local data table preview',
  })
const summary = (page: Page) =>
  page
    .getByRole('search', { name: 'Filter table resources' })
    .getByRole('status')
test('page selection excludes read-only rows, persists across filters and makes hidden batch scope explicit', async ({
  page,
}) => {
  await page.goto('/patterns/data-table')
  await waitForCatalogReady(page)
  const all = table(page).getByRole('checkbox', {
    name: 'Select manageable rows on this page',
    exact: true,
  })
  await expect(
    table(page).getByRole('checkbox', {
      name: 'Select Documentation',
      exact: true,
    }),
  ).toBeDisabled()
  await table(page)
    .getByRole('checkbox', {
      name: 'Select Environment discovery',
      exact: true,
    })
    .check()
  await expect(all).toHaveAttribute('aria-checked', 'mixed')
  await page
    .getByRole('navigation', { name: 'Resource result pages' })
    .getByRole('button', { name: 'Next page', exact: true })
    .click()
  await all.check()
  await expect(summary(page)).toContainText('3 selected / 1 outside this page')
  await page
    .getByRole('searchbox', { name: 'Search resources' })
    .fill('Layout guide')
  await expect(all).toBeDisabled()
  await expect(summary(page)).toContainText('3 selected / 3 outside this page')
  await page
    .getByRole('button', { name: 'Mark 3 selected reviewed', exact: true })
    .click()
  await expect(
    page.getByRole('status', { name: 'Table action result' }),
  ).toHaveText('3 resources marked reviewed in this preview.')
  await expect(summary(page)).toContainText('0 selected')
  await page.getByRole('button', { name: 'Clear table filters' }).click()
  await expect(
    page.getByRole('searchbox', { name: 'Search resources' }),
  ).toBeFocused()
  await expect(
    table(page)
      .getByRole('row')
      .filter({
        has: page.getByRole('link', {
          name: 'Environment discovery',
          exact: true,
        }),
      }),
  ).toContainText('Reviewed')
})
test('sorting, hiding its column and changing page size reset to coherent first pages', async ({
  page,
}) => {
  await page.goto('/patterns/data-table')
  await waitForCatalogReady(page)
  await page
    .getByRole('navigation', { name: 'Resource result pages' })
    .getByRole('button', { name: 'Next page', exact: true })
    .click()
  await table(page).getByRole('button', { name: 'Sort by Product' }).click()
  await expect(
    table(page).getByRole('columnheader', { name: 'Sort by Product' }),
  ).toHaveAttribute('aria-sort', 'ascending')
  await expect(
    page.getByRole('button', { name: 'Page 1', exact: true }),
  ).toHaveAttribute('aria-current', 'page')
  await table(page).getByRole('button', { name: 'Sort by Product' }).click()
  await expect(
    table(page).getByRole('columnheader', { name: 'Sort by Product' }),
  ).toHaveAttribute('aria-sort', 'descending')
  const columns = page.getByRole('button', { name: 'Columns', exact: true })
  await columns.click()
  await expect(
    page.getByRole('menuitemcheckbox', { name: 'Name (required)' }),
  ).toBeDisabled()
  await page
    .getByRole('menuitemcheckbox', { name: 'Product', exact: true })
    .click()
  await expect(
    table(page).getByRole('columnheader', { name: 'Sort by Product' }),
  ).toHaveCount(0)
  await expect(
    table(page).getByRole('columnheader', { name: 'Sort by Name' }),
  ).toHaveAttribute('aria-sort', 'ascending')
  await page.keyboard.press('Escape')
  await expect(columns).toBeFocused()
  await page
    .getByRole('navigation', { name: 'Resource result pages' })
    .getByRole('button', { name: 'Next page', exact: true })
    .click()
  await option(page, 'Rows per page', '5')
  await expect(
    page.getByRole('button', { name: 'Page 1', exact: true }),
  ).toHaveAttribute('aria-current', 'page')
  await expect(table(page).locator('tbody tr')).toHaveCount(5)
})
test('loading and retry retain filters and selection, scope restriction clears selection, empty states recover focus', async ({
  page,
}) => {
  await page.goto('/patterns/data-table')
  await waitForCatalogReady(page)
  await page
    .getByRole('searchbox', { name: 'Search resources' })
    .fill('Inventory')
  await table(page)
    .getByRole('checkbox', { name: 'Select manageable rows on this page' })
    .check()
  await option(page, 'Preview table state', 'loading')
  await expect(table(page)).toHaveCount(0)
  await expect(
    page.getByRole('searchbox', { name: 'Search resources' }),
  ).toBeDisabled()
  await page.getByRole('button', { name: 'Complete table preview' }).click()
  await expect(summary(page)).toContainText('3 selected')
  await expect(
    page.getByRole('searchbox', { name: 'Search resources' }),
  ).toBeFocused()
  await option(page, 'Preview table state', 'error')
  await page.getByRole('button', { name: 'Retry table preview' }).click()
  await expect(summary(page)).toContainText('3 selected')
  await option(page, 'Preview table state', 'permission')
  await expect(table(page)).toHaveCount(0)
  await page.getByRole('button', { name: 'Restore preview access' }).click()
  await expect(summary(page)).toContainText('0 selected')
  await option(page, 'Preview table state', 'empty')
  await expect(
    page.getByText('No registered resources', { exact: true }).last(),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Restore table preview' }).click()
  await page
    .getByRole('searchbox', { name: 'Search resources' })
    .fill('no-such-resource')
  await expect(
    page.getByRole('button', { name: 'Reset table filters' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Reset table filters' }).click()
  await expect(
    page.getByRole('searchbox', { name: 'Search resources' }),
  ).toBeFocused()
  await expect(summary(page)).toContainText('9 of 9 resources')
})
test('all rows and long names remain readable with bounded horizontal scrolling, both themes and keyboard navigation', async ({
  page,
}) => {
  await page.goto('/patterns/data-table')
  await waitForCatalogReady(page)
  await option(page, 'Rows per page', '10')
  for (const dark of [false, true]) {
    if (dark) {
      await page.getByRole('button', { name: 'Toggle theme: Light' }).click()
      await expect(page.locator('html')).not.toHaveAttribute(
        'data-theme-switching',
      )
    }
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 1000 })
      expect(
        await page
          .locator('.catalog-document-scroll')
          .evaluate((e) => e.scrollWidth <= e.clientWidth),
      ).toBe(true)
      const scroll = page.getByRole('region', {
        name: 'Resource table horizontal scroll',
      })
      if (width === 320) {
        await scroll.focus()
        await page.keyboard.press('ArrowRight')
        await expect
          .poll(() => scroll.evaluate((e) => e.scrollLeft))
          .toBeGreaterThan(0)
      }
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 })
  const link = table(page).getByRole('link', {
    name: 'Workspace',
    exact: true,
  })
  await expect(link).toHaveAttribute('href', '/patterns/app-shell')
  await link.press('Enter')
  await waitForCatalogReady(page)
  await expect(page.locator('#page-title')).toBeFocused()
})
