import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'

test.use({ reducedMotion: 'reduce' })
test('dashboard panels are named groups that show loading, refreshing, error and empty states', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1100 })
  await page.goto('/patterns/dashboard')
  await waitForCatalogReady(page)
  const gpu = page.getByRole('group', { name: 'GPU temperature' })
  await expect(gpu).not.toHaveAttribute('aria-busy')
  await expect(
    gpu.getByRole('application', { name: 'GPU temperature' }),
  ).toBeVisible()
  // Titles line up across a row and come from the small size scheme; a collapsible
  // one's text lines up inside its taller toggle.
  const tops = await page
    .locator('.surf-dashboard-panel')
    .evaluateAll((panels) =>
      panels.map(
        (panel) =>
          (
            panel.querySelector('.surf-dashboard-panel-title-text') ??
            panel.querySelector('.surf-card-title')!
          ).getBoundingClientRect().top - panel.getBoundingClientRect().top,
      ),
    )
  expect(new Set(tops).size).toBe(1)
  // A compact dashboard titles its panels with the label role.
  await expect(gpu.locator('.surf-card-title')).toHaveCSS('font-size', '14px')
  // The description opens from the info button.
  await gpu.getByRole('button', { name: 'About GPU temperature' }).click()
  await expect(page.locator('.surf-popover')).toContainText(
    'The hottest GPU on each node',
  )
  await page.keyboard.press('Escape')
  await expect(
    gpu.getByRole('button', { name: 'About GPU temperature' }),
  ).toBeFocused()
  await expect(page.getByRole('group', { name: 'Failed jobs' })).toContainText(
    'No failed jobs in this range.',
  )
  await page.getByRole('button', { name: 'Refreshing', exact: true }).click()
  await expect(gpu).toHaveAttribute('aria-busy', 'true')
  const spinner = gpu.locator('.surf-dashboard-panel-header [role="status"]')
  await expect(spinner).toHaveText('Refreshing')
  // The values stay while new ones come.
  await expect(
    gpu.getByRole('application', { name: 'GPU temperature' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Loading', exact: true }).click()
  await expect(gpu.locator('.surf-skeleton')).toBeVisible()
  await expect(gpu).toHaveAttribute('aria-busy', 'true')
  await page.getByRole('button', { name: 'Error', exact: true }).click()
  await expect(gpu).toContainText('The metrics service did not answer.')
  await gpu.getByRole('button', { name: 'Retry' }).click()
  await expect(
    gpu.getByRole('application', { name: 'GPU temperature' }),
  ).toBeVisible()
  expect(
    (await new AxeBuilder({ page }).include('[data-preview-size]').analyze())
      .violations,
  ).toEqual([])
})
test('a dashboard names its region, caps its columns, titles in full and keeps stale values', async ({
  page,
}) => {
  await page.setViewportSize({ width: 2560, height: 1200 })
  await page.goto('/patterns/dashboard')
  await waitForCatalogReady(page)
  const region = page.getByRole('region', { name: 'Cluster overview' })
  await expect(region).toBeVisible()
  // columns={3}: at 2000px, where six 20rem panels would fit, it still lays out three.
  expect(
    await region.evaluate((el) => {
      el.style.inlineSize = '2000px'
      const count = getComputedStyle(el).gridTemplateColumns.split(' ').length
      el.style.inlineSize = ''
      return count
    }),
  ).toBe(3)
  const disk = page.getByRole('group', { name: 'Free disk', exact: true })
  // A cut title shows in full on hover.
  await expect(disk.locator('.surf-card-title')).toHaveAttribute(
    'title',
    'Free disk',
  )
  // The group keeps a name of its own; the title already shows the measure.
  await expect(
    disk.getByRole('group', { name: 'Free disk by node', exact: true }),
  ).toBeVisible()
  await expect(disk.locator('.surf-stat-group-label')).toHaveCount(0)
  // A failed refresh keeps the last values under a caution with retry.
  await page
    .getByRole('button', { name: 'Refresh failed', exact: true })
    .click()
  await expect(disk).toContainText('These are the last values')
  await expect(disk).toContainText('24 GiB')
  await expect(disk.getByRole('button', { name: 'Retry' })).toBeVisible()
})
test('a collapsible panel folds to its title and summary, and remembers it', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1100 })
  await page.goto('/patterns/dashboard')
  await waitForCatalogReady(page)
  const disk = page.getByRole('group', { name: 'Free disk', exact: true })
  const toggle = disk.getByRole('button', { name: 'Free disk', exact: true })
  const body = disk.locator('.surf-dashboard-panel-body')
  const summary = disk.locator('.surf-dashboard-panel-summary')
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(toggle).toHaveAttribute(
    'aria-controls',
    (await body.getAttribute('id'))!,
  )
  await expect(summary).toHaveCount(0)
  const openHeight = await disk.evaluate((el) => el.offsetHeight)
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle).not.toHaveAttribute('aria-controls')
  // Folded, the content is not there at all, and the summary says what matters.
  await expect(body).toHaveCount(0)
  await expect(summary).toHaveText('dgx-001 24 GiB, below the limit')
  // It keeps its own height instead of stretching to the row.
  const folded = await disk.evaluate((el) => ({
    height: el.offsetHeight,
    align: getComputedStyle(el).alignSelf,
  }))
  expect(folded.height).toBeLessThan(openHeight)
  expect(folded.align).toBe('start')
  // The title stays whole while the summary takes what is left of the row.
  const title = disk.locator('.surf-dashboard-panel-title-text')
  expect(await title.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
    true,
  )
  // A reload remembers it.
  await page.reload()
  await waitForCatalogReady(page)
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(body).toHaveCount(0)
  // Enter and Space unfold and fold from the keyboard.
  await toggle.focus()
  await page.keyboard.press('Enter')
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(disk.getByText('24 GiB', { exact: true })).toBeVisible()
  await expect(toggle).toBeFocused()
  const chevron = disk.locator('.surf-dashboard-panel-chevron')
  await expect(chevron).toHaveCSS('rotate', '90deg')
  await page.keyboard.press('Space')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(chevron).toHaveCSS('rotate', 'none')
  // Right to left, the folded chevron points the reading way and opens downward.
  await page.evaluate(() => (document.documentElement.dir = 'rtl'))
  await page.keyboard.press('Space')
  await expect(chevron).toHaveCSS('rotate', '-90deg')
  await page.evaluate(() => (document.documentElement.dir = 'ltr'))
  expect(
    (await new AxeBuilder({ page }).include('[data-preview-size]').analyze())
      .violations,
  ).toEqual([])
})
test('a compact density tightens the dashboard and keeps controls at their size on a phone', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1100 })
  await page.goto('/patterns/dashboard')
  await waitForCatalogReady(page)
  const panel = page.getByRole('group', { name: 'Free disk', exact: true })
  await expect(page.locator('.surf-dashboard')).toHaveCSS('row-gap', '12px')
  await expect(panel).toHaveCSS('padding-top', '12px')
  await expect(panel).toHaveCSS('row-gap', '8px')
  // Titles take the label role, 14/20px.
  await expect(panel.locator('.surf-card-title')).toHaveCSS('font-size', '14px')
  // Charts follow the density without a prop of their own.
  await expect(page.locator('.surf-chart').first()).toHaveAttribute(
    'data-density',
    'compact',
  )
  // On a phone the small controls stay 32px instead of growing to 44px.
  await page.setViewportSize({ width: 390, height: 900 })
  const refresh = page.getByRole('button', { name: 'Refresh now' })
  expect((await refresh.boundingBox())!.height).toBe(32)
})
test('dashboard panels share columns, span where they fit and stack on a phone', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1100 })
  await page.goto('/patterns/dashboard')
  await waitForCatalogReady(page)
  const box = (name: string) =>
    page.getByRole('group', { name, exact: true }).boundingBox()
  const [gpu, disk, tokens] = await Promise.all([
    box('GPU temperature'),
    box('Free disk'),
    box('Tokens by project'),
  ])
  expect(disk!.y).toBe(tokens!.y)
  expect(gpu!.width).toBeCloseTo(tokens!.x + tokens!.width - disk!.x, 0)
  await page.setViewportSize({ width: 390, height: 900 })
  const [narrowGpu, narrowDisk] = await Promise.all([
    box('GPU temperature'),
    box('Free disk'),
  ])
  expect(narrowGpu!.x).toBe(narrowDisk!.x)
  expect(narrowGpu!.width).toBe(narrowDisk!.width)
  expect(
    await page
      .locator('.catalog-document-scroll')
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true)
})
test("a compact chart's view-table line is as compact as its table", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1100 })
  await page.goto('/patterns/dashboard')
  await waitForCatalogReady(page)
  const summary = page
    .locator(".surf-chart[data-density='compact'] .surf-chart-table summary")
    .first()
  await expect(summary).toHaveCSS('font-size', '12px')
  // 18px caption leading and 4px above and below: over the 24px floor.
  expect(Math.round((await summary.boundingBox())!.height)).toBe(26)
})
