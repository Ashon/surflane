import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'

test.use({ reducedMotion: 'reduce' })
test('the time range picker names its parts, changes the span and refreshes on its interval', async ({
  page,
}) => {
  await page.clock.install()
  await page.goto('/components/time-range-picker')
  await waitForCatalogReady(page)
  const group = page.getByRole('group', { name: 'Dashboard time' })
  const range = group.getByRole('combobox', { name: 'Time range' })
  const interval = group.getByRole('combobox', { name: 'Refresh interval' })
  const now = group.getByRole('button', { name: 'Refresh now' })
  const status = page.getByRole('status', { name: 'Time range result' })
  await expect(range).toHaveText('Last 24 hours', { useInnerText: true })
  // The parts share one line.
  const [a, b, c] = await Promise.all([
    range.boundingBox(),
    interval.boundingBox(),
    now.boundingBox(),
  ])
  expect(
    new Set([a!.y + a!.height / 2, b!.y + b!.height / 2, c!.y + c!.height / 2])
      .size,
  ).toBe(1)
  await range.click()
  await page.getByRole('option', { name: 'Last 7 days', exact: true }).click()
  await expect(status).toContainText('Showing last 7 days')
  await now.click()
  await expect(status).toContainText('Refreshed 1 times')
  await interval.click()
  await page
    .getByRole('option', { name: 'Every 10 seconds', exact: true })
    .click()
  await page.clock.runFor(30_000)
  await expect(status).toContainText('Refreshed 4 times')
  // Off stops the interval.
  await interval.click()
  await page.getByRole('option', { name: 'Off', exact: true }).click()
  await page.clock.runFor(30_000)
  await expect(status).toContainText('Refreshed 4 times')
  expect(
    (await new AxeBuilder({ page }).include('[data-preview-size]').analyze())
      .violations,
  ).toEqual([])
})
test('the time range picker reads in Korean', async ({ page }) => {
  await page.goto('/ko/components/time-range-picker')
  await waitForCatalogReady(page)
  const group = page.getByRole('group', { name: '대시보드 시간' })
  await expect(group.getByRole('combobox', { name: '시간 범위' })).toHaveText(
    '최근 24시간',
    { useInnerText: true },
  )
  await expect(
    group.getByRole('button', { name: '지금 새로 고침' }),
  ).toBeVisible()
})
