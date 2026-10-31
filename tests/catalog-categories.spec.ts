import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { charts, componentPages, itemHref } from '../demo/catalog'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
const categories = [...new Set(componentPages.map((item) => item.group))]

test('component index groups every destination exactly once under its registry category', async ({
  page,
}) => {
  await page.goto('/components')
  await waitForCatalogReady(page)
  const sections = page.locator('[data-catalog-category]')
  await expect(sections).toHaveCount(categories.length)
  expect(
    await sections.evaluateAll((elements) =>
      elements.map((el) => el.getAttribute('data-catalog-category')),
    ),
  ).toEqual(categories)
  for (const category of categories) {
    const section = page.getByRole('region', { name: category, exact: true })
    await expect(
      section.getByRole('heading', { name: category, level: 2, exact: true }),
    ).toBeVisible()
    const expected = componentPages
      .filter((item) => item.group === category)
      .map(itemHref)
    expect(
      await section
        .locator('.catalog-item')
        .evaluateAll((elements) =>
          elements.map((el) => el.getAttribute('href')),
        ),
    ).toEqual(expected)
    await expect(section.locator('.catalog-category-header > span')).toHaveText(
      `${expected.length} ${expected.length === 1 ? 'component' : 'components'}`,
    )
  }
  await expect(page.locator('.catalog-item')).toHaveCount(componentPages.length)
})

test('the charts index holds every chart page and the component index holds none', async ({
  page,
}) => {
  await page.goto('/charts')
  await waitForCatalogReady(page)
  const items = page.locator('.catalog-item')
  await expect(items).toHaveCount(charts.length)
  expect(
    await items.evaluateAll((elements) =>
      elements.map((el) => el.getAttribute('href')),
    ),
  ).toEqual(charts.map(itemHref))
  await page.goto('/components')
  await waitForCatalogReady(page)
  for (const item of charts)
    await expect(
      page.locator(`.catalog-item[href="${itemHref(item)}"]`),
    ).toHaveCount(0)
  // A chart page walks the six charts, not the component list they left.
  await page.goto('/charts/chart')
  await waitForCatalogReady(page)
  const paging = page.getByRole('navigation', { name: 'Related pages' })
  await expect(
    paging.getByRole('link', { name: 'Next: Scatter chart' }),
  ).toHaveAttribute('href', '/charts/scatter-chart')
  await expect(paging.getByRole('link', { name: /^Previous:/ })).toHaveCount(0)
})

test('search and category/readiness filters retain grouping, omit empty sections and reset with focus', async ({
  page,
}) => {
  await page.goto('/components')
  await waitForCatalogReady(page)
  const search = page.getByRole('searchbox', { name: 'Search catalog' })
  await page.getByRole('combobox', { name: 'Component category' }).click()
  await page.getByRole('option', { name: 'Forms', exact: true }).click()
  await search.fill('date')
  await expect(page.locator('[data-catalog-category]')).toHaveCount(1)
  await expect(
    page
      .getByRole('region', { name: 'Forms', exact: true })
      .locator('.catalog-item'),
  ).toHaveCount(1)
  await expect(
    page.getByRole('search', { name: 'Filter catalog' }).getByRole('status'),
  ).toContainText(`1 / ${componentPages.length}`)
  await page.getByRole('combobox', { name: 'Component readiness' }).click()
  await page
    .getByRole('option', { name: 'Primitive only', exact: true })
    .click()
  await expect(page.locator('[data-catalog-category]')).toHaveCount(0)
  await expect(
    page.getByText(
      'No matching items. Try a different search term or filter.',
      {
        exact: true,
      },
    ),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click()
  await expect(search).toBeFocused()
  await expect(page.locator('[data-catalog-category]')).toHaveCount(
    categories.length,
  )
})

test('category sections wrap without overflow and preserve accessible hierarchy in both themes and widths', async ({
  page,
}) => {
  for (const width of [1440, 320])
    for (const theme of ['light', 'dark']) {
      await page.context().addCookies([
        {
          name: 'surflane-theme',
          value: theme,
          url: 'http://127.0.0.1:8066/',
        },
      ])
      await page.setViewportSize({ width, height: 1000 })
      await page.goto('/components')
      await waitForCatalogReady(page)
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true)
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
      await page.screenshot({
        path: `.data/catalog-categories-${width}-${theme}.png`,
      })
    }
})
