import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
const section = (page: Page, name: string) =>
  page.locator('#guidelines').getByRole('region', { name, exact: true })
async function open(page: Page) {
  await page.goto('/components/table')
  await waitForCatalogReady(page)
  await expect(page.locator('#guidelines .table-guideline')).toHaveCount(9)
}

test('table guidelines are listed on the page and pass light and dark accessibility checks', async ({
  page,
}) => {
  await open(page)
  await expect(
    page
      .getByRole('navigation', { name: 'On this page' })
      .getByRole('link', { name: 'Guidelines', exact: true }),
  ).toHaveAttribute('href', '#guidelines')
  for (const dark of [false, true]) {
    if (dark) await page.getByRole('button', { name: /^Toggle theme/ }).click()
    expect(
      (await new AxeBuilder({ page }).include('#guidelines').analyze())
        .violations,
    ).toEqual([])
  }
})

test('compact density tightens rows and numeric columns align digits at the end', async ({
  page,
}) => {
  await open(page)
  const density = section(page, 'Density')
  const cell = density.getByRole('cell', { name: '7.25', exact: true })
  await expect(cell).toHaveCSS('padding-top', '4px')
  await expect(cell).toHaveCSS('text-align', 'end')
  await expect(cell).toHaveCSS('font-variant-numeric', 'tabular-nums')
  await expect(
    density.getByRole('columnheader', { name: 'CPU (cores)' }),
  ).toHaveCSS('text-align', 'end')
  const compact = (await cell.boundingBox())!.height
  await density.getByRole('button', { name: 'Default', exact: true }).click()
  await expect(cell).toHaveCSS('padding-top', '12px')
  expect((await cell.boundingBox())!.height).toBeGreaterThan(compact)
})

test('sort headers mark only the sorted column and sort numbers descending first', async ({
  page,
}) => {
  await open(page)
  const sorting = section(page, 'Sorting')
  const table = sorting.getByRole('table')
  const headers = table.getByRole('columnheader')
  await expect(headers).toHaveCount(4)
  // Every sortable column shows its icon; only the sorted one has aria-sort.
  await expect(table.locator('.pui-table-sort-icon')).toHaveCount(4)
  await expect(table.locator('th[aria-sort]')).toHaveCount(1)
  const latency = headers.filter({ hasText: 'p95 latency (ms)' })
  await expect(latency).toHaveAttribute('aria-sort', 'descending')
  await expect(table.getByRole('rowheader').first()).toHaveText(
    'report-builder',
  )
  await sorting.getByRole('button', { name: 'Name', exact: true }).click()
  const name = headers.filter({ hasText: 'Name' })
  await expect(name).toHaveAttribute('aria-sort', 'ascending')
  await expect(latency).not.toHaveAttribute('aria-sort')
  await expect(table.getByRole('rowheader').first()).toHaveText('auth-gateway')
  await expect(sorting.getByRole('status')).toHaveText(
    'Sorted by Name, ascending.',
  )
  await sorting.getByRole('button', { name: 'Replicas', exact: true }).click()
  await expect(headers.filter({ hasText: 'Replicas' })).toHaveAttribute(
    'aria-sort',
    'descending',
  )
  await expect(table.getByRole('rowheader').first()).toHaveText('checkout-api')
})

test('truncated identifiers keep their full value and a named copy action', async ({
  page,
}) => {
  await open(page)
  const long = section(page, 'Long values')
  const value = long.locator('.pui-table-truncate').first()
  const full = await value.textContent()
  expect(full).toMatch(
    /^registry\.example\.com\/platform\/checkout-api@sha256:/,
  )
  await expect(value).toHaveAttribute('title', full!)
  expect(await value.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(
    true,
  )
  await expect(
    long.getByRole('button', {
      name: 'Copy image reference for checkout-api',
      exact: true,
    }),
  ).toBeVisible()
})

test('page selection skips read-only rows and reports selections on other pages', async ({
  page,
}) => {
  await open(page)
  const selection = section(page, 'Selection and bulk actions')
  const pageBox = selection.getByRole('checkbox', {
    name: 'Select restartable services on this page',
  })
  await expect(pageBox).toHaveAttribute('aria-checked', 'mixed')
  await expect(
    selection.getByRole('checkbox', { name: 'Select notification-worker' }),
  ).toBeDisabled()
  await pageBox.click()
  await expect(pageBox).toHaveAttribute('aria-checked', 'true')
  await expect(selection.getByText('3 selected', { exact: true })).toBeVisible()
  await selection.getByRole('button', { name: 'Page 2', exact: true }).click()
  await expect(
    selection.getByText('3 selected, 3 on other pages', { exact: true }),
  ).toBeVisible()
  await expect(pageBox).toHaveAttribute('aria-checked', 'false')
  await selection.getByRole('button', { name: 'Restart', exact: true }).click()
  await expect(selection.getByRole('status')).toHaveText(
    'Restart requested for 3 services.',
  )
  await expect(
    selection.getByRole('button', { name: 'Restart', exact: true }),
  ).toBeDisabled()
})

test('row actions keep one visible action and name the menu after its row', async ({
  page,
}) => {
  await open(page)
  const actions = section(page, 'Row actions')
  await expect(
    actions.getByRole('link', { name: 'checkout-api', exact: true }),
  ).toBeVisible()
  await actions
    .getByRole('button', { name: 'Actions for checkout-api', exact: true })
    .click()
  await page.getByRole('menuitem', { name: 'Restart', exact: true }).click()
  await expect(actions.getByRole('status')).toHaveText(
    'checkout-api: restart requested.',
  )
  await actions
    .getByRole('button', {
      name: 'Actions for notification-worker',
      exact: true,
    })
    .click()
  await expect(
    page.getByRole('menuitem', { name: 'Delete…', exact: true }),
  ).toHaveAttribute('aria-disabled', 'true')
  await page.keyboard.press('Escape')
})

test('state messages span every column, skip hover and mark loading as busy', async ({
  page,
}) => {
  await open(page)
  const states = section(page, 'Loading, empty and errors')
  const table = states.getByRole('table')
  await expect(table).toHaveAttribute('aria-busy', 'true')
  await expect(table.locator('tbody .pui-skeleton')).toHaveCount(16)
  await states.getByRole('button', { name: 'No data', exact: true }).click()
  await expect(table).toHaveAttribute('aria-busy', 'false')
  const message = table.locator('td.pui-table-message')
  await expect(message).toHaveAttribute('colspan', '4')
  await expect(message).toContainText('No services yet')
  await message.hover()
  await expect(message).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  await states.getByRole('button', { name: 'Error', exact: true }).click()
  await expect(message).toContainText("Services couldn't load")
  await states.getByRole('button', { name: 'Retry', exact: true }).click()
  await expect(table).toHaveAttribute('aria-busy', 'true')
})

test('a bounded table keeps its header in view while it scrolls', async ({
  page,
}) => {
  await open(page)
  const region = page.getByRole('region', {
    name: 'Service inventory, scrollable',
  })
  await region.evaluate((el) => (el.scrollTop = 160))
  const offset = await region.evaluate(
    (el) =>
      el.querySelector('thead th')!.getBoundingClientRect().top -
      el.getBoundingClientRect().top,
  )
  expect(Math.abs(offset)).toBeLessThan(1)
})

test('the guidelines read in Korean with Korean pagination labels', async ({
  browser,
}) => {
  const context = await browser.newContext()
  await context.addCookies([
    { name: 'surflane-locale', value: 'ko', url: 'http://127.0.0.1:8066' },
  ])
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:8066/components/table')
  await waitForCatalogReady(page)
  const selection = page
    .locator('#guidelines')
    .getByRole('region', { name: '선택과 일괄 작업', exact: true })
  await expect(
    selection.getByRole('button', { name: '다음 페이지', exact: true }),
  ).toBeVisible()
  await expect(
    selection.getByRole('checkbox', { name: 'checkout-api 선택' }),
  ).toBeVisible()
  await context.close()
})
