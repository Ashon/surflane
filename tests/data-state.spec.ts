import { waitForCatalogReady } from './catalog-ready'
import { test, expect, type Page } from '@playwright/test'
test.use({ reducedMotion: 'reduce' })

const open = async (page: Page) => {
  await page.goto('/components/data-state')
  await waitForCatalogReady(page)
  const region = page.getByRole('region', { name: 'Cluster summary' })
  const choose = async (name: 'State' | 'Layout', option: string) => {
    await page.getByRole('combobox', { name, exact: true }).click()
    await page.getByRole('option', { name: option, exact: true }).click()
  }
  return { region, choose }
}

test('an error says so with a retry, and retrying moves focus to the content', async ({
  page,
}) => {
  const { region } = await open(page)
  await expect(region).toHaveAttribute('data-state', 'error')
  await expect(region).toContainText('This could not load.')
  await expect(region.getByText('ap-northeast-2')).toHaveCount(0)
  const retry = region.getByRole('button', { name: 'Retry', exact: true })
  await retry.focus()
  await page.keyboard.press('Enter')
  await expect(region).toHaveAttribute('data-state', 'ready')
  await expect(region.getByText('ap-northeast-2')).toBeVisible()
  // The button went away with the error; focus is on the region, not the page.
  await expect(region).toBeFocused()
})

test('loading holds a placeholder, stale keeps the values under a caution, empty says so', async ({
  page,
}) => {
  const { region, choose } = await open(page)
  await choose('State', 'Loading')
  await expect(region).toHaveAttribute('aria-busy', 'true')
  await expect(region.locator('.surf-skeleton')).toHaveCount(1)
  await expect(region.locator('.surf-feedback-sr').first()).toHaveText(
    'Loading',
  )
  await choose('State', 'Stale')
  await expect(
    region.locator('.surf-message[data-tone="caution"]'),
  ).toContainText('These are the last values')
  await expect(region.getByText('ap-northeast-2')).toBeVisible()
  await expect(region.getByRole('button', { name: 'Retry' })).toBeVisible()
  await choose('State', 'Empty')
  await expect(region).toContainText('Nothing to show yet.')
})

test('refreshing keeps the content, dimmed, busy and announced', async ({
  page,
}) => {
  const { region, choose } = await open(page)
  await choose('State', 'Ready')
  await page.getByRole('checkbox', { name: 'Refreshing', exact: true }).check()
  await expect(region).toHaveAttribute('aria-busy', 'true')
  await expect(region.getByRole('status')).toHaveText('Refreshing')
  expect(
    await region
      .locator('.surf-data-state-content')
      .evaluate((content) => getComputedStyle(content).opacity),
  ).toBe('0.6')
  await expect(region.getByText('ap-northeast-2')).toBeVisible()
})

test('inline fits one line; page centers in the room a page gives', async ({
  page,
}) => {
  const { region, choose } = await open(page)
  await choose('Layout', 'Inline')
  const row = await region.evaluate((element) => {
    const parts = [...element.querySelectorAll('.surf-data-state-notice > *')]
    const tops = parts.map((part) => {
      const box = part.getBoundingClientRect()
      return Math.round(box.top + box.height / 2)
    })
    return Math.max(...tops) - Math.min(...tops)
  })
  expect(row).toBeLessThanOrEqual(2)
  await choose('Layout', 'Page')
  const page_ = await region.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    viewport: window.innerHeight,
    align: getComputedStyle(element).textAlign,
  }))
  expect(page_.height).toBeGreaterThanOrEqual(page_.viewport * 0.4 - 1)
  expect(page_.align).toBe('center')
})
