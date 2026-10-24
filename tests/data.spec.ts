import { waitForCatalogReady } from './catalog-ready'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { dataExampleIds } from '../demo/DataExamples'
test('Table preserves headers and caption, sorts with keyboard, and selects through named checkboxes', async ({
  page,
}) => {
  await page.goto('/components/table')
  await waitForCatalogReady(page)
  const table = page.getByRole('table', {
    name: 'Registered environments — local preview',
  })
  await expect(table.getByRole('row')).toHaveCount(4)
  const name = table
    .getByRole('columnheader')
    .filter({ has: page.getByRole('button', { name: 'Name', exact: true }) })
  await expect(name).toHaveAttribute('scope', 'col')
  await expect(name).toHaveAttribute('aria-sort', 'ascending')
  await expect(table.getByRole('rowheader').first()).toHaveText('DEMO main')
  const sort = table.getByRole('button', { name: 'Name', exact: true })
  await sort.focus()
  await page.keyboard.press('Enter')
  await expect(name).toHaveAttribute('aria-sort', 'descending')
  await expect(table.getByRole('rowheader').first()).toHaveText(
    'Inventory main',
  )
  const check = table.getByRole('checkbox', {
    name: 'Select DEMO main',
    exact: true,
  })
  await check.focus()
  await page.keyboard.press('Space')
  await expect(check).toBeChecked()
  const row = table.getByRole('row').filter({
    has: page.getByRole('checkbox', {
      name: 'Select DEMO main',
      exact: true,
    }),
  })
  await expect(row).toHaveAttribute('data-selected')
  await expect(row).not.toHaveAttribute('aria-selected')
  await expect(row).not.toHaveAttribute('tabindex')
  await expect(page.locator('#preview').getByRole('status')).toHaveText(
    '1 selected.',
  )
  await table
    .getByRole('button', { name: 'Inspect DEMO main', exact: true })
    .click()
  await expect(page.locator('#preview').getByRole('status')).toContainText(
    'DEMO main: 3 services discovered.',
  )
})
test('Table hover is inset, continuous and borderless; narrow view scrolls inside the named region', async ({
  page,
}) => {
  await page.goto('/components/table')
  await waitForCatalogReady(page)
  const row = page.locator('.surf-table-body .surf-table-row').first()
  await row.hover()
  const cells = await row.locator(':scope > *').evaluateAll((els) =>
    els.map((el) => {
      const s = getComputedStyle(el)
      return {
        left: s.paddingLeft,
        right: s.paddingRight,
        border: s.borderBottomWidth,
        bg: s.backgroundColor,
      }
    }),
  )
  expect(
    cells.every(
      (c) => c.left === '16px' && c.right === '16px' && c.border === '0px',
    ),
  ).toBeTruthy()
  expect(new Set(cells.map((c) => c.bg)).size).toBe(1)
  expect(cells[0].bg).not.toBe('rgba(0, 0, 0, 0)')
  await page.setViewportSize({ width: 320, height: 900 })
  const region = page.getByRole('region', { name: 'Environment comparison' })
  await region.focus()
  await page.keyboard.press('ArrowRight')
  await expect
    .poll(() => region.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(0)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy()
})
for (const id of ['table', 'list'])
  test(`${id} retains selection while filtered and shows actionable empty results`, async ({
    page,
  }) => {
    await page.goto(`/components/${id}`)
    await waitForCatalogReady(page)
    await page
      .getByRole('checkbox', { name: 'Select DEMO main', exact: true })
      .click()
    await page
      .getByRole('textbox', { name: 'Filter environments', exact: true })
      .fill('no-such-environment')
    await expect(
      page.getByRole('heading', {
        name: 'No matching environments',
        exact: true,
      }),
    ).toBeVisible()
    await page
      .getByRole('button', { name: 'Clear search', exact: true })
      .click()
    await expect(
      page.getByRole('checkbox', { name: 'Select DEMO main', exact: true }),
    ).toBeChecked()
    if (id === 'list') {
      await expect(
        page
          .getByRole('list', { name: 'Registered environments' })
          .getByRole('listitem'),
      ).toHaveCount(3)
      const item = page.locator('.surf-list-item').first()
      await item.hover()
      expect(
        await item.evaluate((el) => getComputedStyle(el).paddingInlineStart),
      ).toBe('16px')
      await expect(item).not.toHaveAttribute('role', 'option')
    }
  })
test('Inline message is static by default and retry state changes are announced once without moving focus', async ({
  page,
}) => {
  await page.goto('/components/inline-message')
  await waitForCatalogReady(page)
  const message = page.locator('.surf-message').first(),
    preview = page.locator('#preview')
  await expect(message).not.toHaveAttribute('role')
  await expect(preview.getByRole('alert')).toHaveCount(0)
  await page.getByRole('button', { name: 'Retry preview', exact: true }).click()
  await expect(message).toHaveAttribute('data-tone', 'progress')
  await expect(
    page.getByRole('button', { name: 'Complete retry', exact: true }),
  ).toBeFocused()
  await expect(preview.getByRole('status')).toHaveText('Retry in progress.')
  await expect(message.getByRole('status')).toHaveCount(0)
  await page.getByRole('button', { name: 'Fail retry', exact: true }).click()
  await expect(message).toHaveAttribute('data-tone', 'danger')
  await page.getByRole('button', { name: 'Retry preview', exact: true }).click()
  await page
    .getByRole('button', { name: 'Complete retry', exact: true })
    .click()
  await expect(message).toHaveAttribute('data-tone', 'success')
  await expect(preview.getByRole('status')).toHaveText('Discovery succeeded.')
})
test('Empty state distinguishes first use, no results and missing permissions with appropriate next actions', async ({
  page,
}) => {
  await page.goto('/components/empty-state')
  await waitForCatalogReady(page)
  await page
    .getByRole('button', { name: 'Register preview environment', exact: true })
    .click()
  await expect(
    page.getByRole('list', { name: 'Registered preview environments' }),
  ).toContainText('New environment preview')
  await page
    .getByRole('button', { name: 'No search results', exact: true })
    .click()
  await expect(
    page.getByRole('heading', {
      name: 'No matching environments',
      exact: true,
    }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click()
  await expect(
    page.getByRole('heading', {
      name: 'No environments registered',
      exact: true,
    }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Permission required', exact: true })
    .click()
  await expect(
    page.getByRole('heading', {
      name: 'Environment access required',
      exact: true,
    }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', {
      name: 'Register preview environment',
      exact: true,
    }),
  ).toHaveCount(0)
  await page
    .getByRole('button', { name: 'Preview access request', exact: true })
    .click()
  await expect(page.locator('#preview').getByRole('status')).toHaveText(
    'Access request previewed. No message was sent.',
  )
})
test('Data/message pages pass light/dark accessibility, narrow reflow and enlarged RTL text', async ({
  page,
}) => {
  for (const id of dataExampleIds) {
    await page.goto(`/components/${id}`)
    await waitForCatalogReady(page)
    for (const theme of ['light', 'dark']) {
      await page.evaluate(
        (t) => (document.documentElement.dataset.theme = t),
        theme,
      )
      await page.setViewportSize({ width: 320, height: 900 })
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy()
      expect(
        (await new AxeBuilder({ page }).analyze()).violations,
        `${id} ${theme}`,
      ).toEqual([])
    }
    await page.evaluate(() => {
      document.documentElement.dir = 'rtl'
      document.documentElement.style.fontSize = '200%'
    })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy()
  }
})
