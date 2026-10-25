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
  // Titles line up across a row and come from the small size scheme.
  const tops = await page
    .locator('.surf-dashboard-panel')
    .evaluateAll((panels) =>
      panels.map(
        (panel) =>
          panel.querySelector('.surf-card-title')!.getBoundingClientRect().top -
          panel.getBoundingClientRect().top,
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
