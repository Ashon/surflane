import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
const tree = (page: Page) =>
  page.getByRole('tree', { name: 'Resource hierarchy', exact: true })
const item = (page: Page, name: string) =>
  tree(page).getByRole('treeitem', { name, exact: true })
const selection = (page: Page) =>
  page.getByRole('status', { name: 'Tree selection', exact: true })
async function open(page: Page) {
  await page.goto('/components/tree')
  await waitForCatalogReady(page)
  await expect(tree(page)).toBeVisible()
}
async function option(page: Page, label: string, name: string) {
  await page.getByRole('combobox', { name: label, exact: true }).click()
  await page.getByRole('option', { name, exact: true }).click()
}

test('ARIA hierarchy, roving focus and expansion follow visible tree boundaries without changing selection', async ({
  page,
}) => {
  await open(page)
  await expect(tree(page).locator('[tabindex="0"]')).toHaveCount(1)
  const projects = item(page, 'Projects'),
    workspace = item(page, 'Workspace'),
    north = item(page, 'Staging environment')
  await projects.focus()
  await projects.press('ArrowRight')
  await expect(workspace).toBeFocused()
  await workspace.press('ArrowRight')
  await expect(north).toBeFocused()
  await north.press('ArrowRight')
  await expect(north).toHaveAttribute('aria-expanded', 'true')
  await expect(north).toBeFocused()
  await north.press('ArrowRight')
  const alpha = item(page, 'Alpha service')
  await expect(alpha).toBeFocused()
  await expect(alpha).toHaveAttribute('aria-level', '4')
  await expect(alpha).toHaveAttribute('aria-posinset', '1')
  await expect(alpha).toHaveAttribute('aria-setsize', '3')
  await expect(alpha).not.toHaveAttribute('aria-expanded')
  await alpha.press('ArrowRight')
  await expect(alpha).toBeFocused()
  await alpha.press('ArrowDown')
  const beta = item(page, 'Beta service')
  await expect(beta).toBeFocused()
  await expect(selection(page)).toHaveText('No selected resources.')
  await beta.press('Space')
  await expect(beta).toHaveAttribute('aria-selected', 'true')
  await expect(selection(page)).toHaveText('Selected: Beta service')
  await beta.press('ArrowLeft')
  await expect(north).toBeFocused()
  await north.press('ArrowLeft')
  await expect(north).toHaveAttribute('aria-expanded', 'false')
  await expect(beta).toHaveCount(0)
  await expect(selection(page)).toHaveText('Selected: Beta service')
  await north.press('End')
  await expect(item(page, 'Shared resources')).toBeFocused()
  await page.keyboard.press('Home')
  await expect(projects).toBeFocused()
})

test('disclosure does not select, disabled nodes remain discoverable and typeahead cycles', async ({
  page,
}) => {
  await open(page)
  await item(page, 'Projects').focus()
  // Typeahead ignores case, and repeating a letter cycles its matches.
  await page.keyboard.press('Shift+s')
  await expect(item(page, 'Staging environment')).toBeFocused()
  await page.keyboard.press('s')
  await expect(item(page, 'Shared resources')).toBeFocused()
  await item(page, 'Staging environment')
    .getByRole('button', { name: 'Expand Staging environment', exact: true })
    .click()
  await expect(item(page, 'Staging environment')).toBeFocused()
  await expect(selection(page)).toHaveText('No selected resources.')
  await item(page, 'Staging environment').press('ArrowLeft')
  await page.keyboard.press('ArrowDown')
  const reserved = item(page, 'Reserved environment')
  await expect(reserved).toBeFocused()
  await expect(reserved).toHaveAttribute('aria-disabled', 'true')
  await reserved.press('Enter')
  await expect(selection(page)).toHaveText('No selected resources.')
  await reserved.evaluate((element: HTMLElement) => element.click())
  await expect(selection(page)).toHaveText('No selected resources.')
})

test('multiple selection, ranges, visible select-all and removal use controlled IDs', async ({
  page,
}) => {
  await open(page)
  await option(page, 'Selection mode', 'Multiple')
  await item(page, 'Staging environment').press('ArrowRight')
  const alpha = item(page, 'Alpha service'),
    beta = item(page, 'Beta service')
  await alpha.click()
  await beta.press('Space')
  await expect(alpha).toHaveAttribute('aria-selected', 'true')
  await expect(beta).toHaveAttribute('aria-selected', 'true')
  await expect(selection(page)).toContainText('Alpha service, Beta service')
  await alpha.click()
  await alpha.press('Shift+ArrowDown')
  await expect(alpha).toHaveAttribute('aria-selected', 'true')
  await expect(beta).toHaveAttribute('aria-selected', 'true')
  await alpha.focus()
  await alpha.press('Control+a')
  await expect(item(page, 'Reserved environment')).not.toHaveAttribute(
    'aria-selected',
    'true',
  )
  await expect(selection(page)).toContainText('Projects')
  await page
    .getByRole('button', { name: 'Remove selected preview nodes', exact: true })
    .click()
  await expect(selection(page)).toHaveText('No selected resources.')
  await expect(
    page.getByRole('combobox', { name: 'Preview dataset', exact: true }),
  ).toBeFocused()
  await expect(
    page.getByRole('button', {
      name: 'Remove selected preview nodes',
      exact: true,
    }),
  ).toBeDisabled()
  await expect(
    page
      .getByRole('status')
      .filter({ hasText: 'No resources in this preview.' }),
  ).toBeVisible()
})

test('10,100 nodes virtualize to a bounded DOM and keyboard End mounts/focuses the last resource', async ({
  page,
}) => {
  await open(page)
  await option(page, 'Preview dataset', 'Large tree / 10,100 nodes')
  await page
    .getByRole('button', { name: 'Expand all preview groups', exact: true })
    .click()
  await expect(
    page.getByText('10,100 loaded nodes.', { exact: false }),
  ).toBeVisible()
  await expect
    .poll(() => tree(page).getByRole('treeitem').count())
    .toBeLessThan(40)
  await item(page, 'Batch 001').focus()
  await page.keyboard.press('End')
  const last = item(page, 'Resource 100-100')
  await expect(last).toBeFocused()
  await expect(last).toHaveAttribute('aria-level', '2')
  await expect(last).toHaveAttribute('aria-posinset', '100')
  await expect(last).toHaveAttribute('aria-setsize', '100')
  await expect
    .poll(() =>
      page
        .getByRole('region', {
          name: 'Resource hierarchy scroll area',
          exact: true,
        })
        .evaluate((el) => el.scrollTop),
    )
    .toBeGreaterThan(400000)
  await expect
    .poll(() => tree(page).getByRole('treeitem').count())
    .toBeLessThan(40)
  await last.press('Enter')
  await expect(selection(page)).toHaveText('Selected: Resource 100-100')
  const viewport = page.getByRole('region', {
    name: 'Resource hierarchy scroll area',
    exact: true,
  })
  const scroll = await viewport.evaluate((el) => el.scrollTop)
  await viewport.hover()
  await page.mouse.wheel(0, -600)
  await expect
    .poll(() => viewport.evaluate((el) => el.scrollTop))
    .toBeLessThan(scroll)
  await expect(last).toBeFocused()
  await last.press('Home')
  await expect(item(page, 'Batch 001')).toBeFocused()
})

test('external collapse repairs hidden focus without stealing focus from controls; RTL reverses expansion keys', async ({
  page,
}) => {
  await open(page)
  await item(page, 'Staging environment').press('ArrowRight')
  await item(page, 'Alpha service').focus()
  await page
    .getByRole('button', { name: 'Collapse all preview groups', exact: true })
    .evaluate((button: HTMLButtonElement) => button.click())
  await expect(item(page, 'Projects')).toBeFocused()
  await expect(tree(page).locator('[tabindex="0"]')).toHaveCount(1)
  await page
    .getByRole('button', { name: 'Expand all preview groups', exact: true })
    .click()
  await expect(
    page.getByRole('button', {
      name: 'Expand all preview groups',
      exact: true,
    }),
  ).toBeFocused()
  await page
    .getByRole('checkbox', { name: 'Right to left', exact: true })
    .check()
  await page
    .getByRole('button', { name: 'Collapse all preview groups', exact: true })
    .click()
  await item(page, 'Projects').focus()
  await page.keyboard.press('ArrowLeft')
  await expect(item(page, 'Projects')).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('ArrowLeft')
  await expect(item(page, 'Workspace')).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(item(page, 'Projects')).toBeFocused()
})

test('nonvirtual, empty/loading/error and long-label states stay bounded and accessible in both themes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await open(page)
  for (const dark of [false, true]) {
    if (dark)
      await page
        .getByRole('button', { name: 'Toggle theme: Light', exact: true })
        .click()
    await page
      .getByRole('checkbox', { name: 'Long labels', exact: true })
      .check()
    await page
      .getByRole('checkbox', { name: 'Virtualize rows', exact: true })
      .uncheck()
    await expect
      .poll(() =>
        page
          .locator('.catalog-document-scroll')
          .evaluate((el) => el.scrollWidth <= el.clientWidth),
      )
      .toBe(true)
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    for (const mode of ['Empty', 'Loading', 'Error']) {
      await option(page, 'Preview dataset', mode)
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    }
    await page
      .getByRole('button', { name: 'Retry local tree', exact: true })
      .click()
    await expect(tree(page)).toBeVisible()
  }
})

test.describe('touch tree', () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } })
  test('disclosure taps preserve selection and row taps select', async ({
    page,
  }) => {
    await open(page)
    await item(page, 'Staging environment')
      .getByRole('button', { name: 'Expand Staging environment', exact: true })
      .tap()
    await expect(item(page, 'Alpha service')).toBeVisible()
    await expect(selection(page)).toHaveText('No selected resources.')
    await item(page, 'Alpha service').tap()
    await expect(selection(page)).toHaveText('Selected: Alpha service')
  })
})
