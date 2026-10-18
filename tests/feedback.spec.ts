import { waitForCatalogReady } from './catalog-ready'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { feedbackExampleIds } from '../demo/FeedbackExamples'
test('Progress covers determinate, indeterminate, completion and reset without fake timed advancement', async ({
  page,
}) => {
  await page.goto('/components/progress')
  await waitForCatalogReady(page)
  const bar = page.getByRole('progressbar', { name: 'Deployment progress' })
  await expect(bar).toHaveAttribute('aria-valuenow', '30')
  await expect(bar).toHaveAttribute(
    'aria-valuetext',
    '30 of 100 checks completed',
  )
  await page.getByRole('button', { name: 'Wait for worker' }).click()
  await expect(bar).not.toHaveAttribute('aria-valuenow')
  await expect(bar).toHaveAttribute('data-indeterminate')
  await expect(page.locator('.pui-gauge-value')).toHaveText(
    'Waiting for worker',
  )
  await page.getByRole('button', { name: 'Reset progress' }).click()
  for (let i = 0; i < 10; i++)
    await page.getByRole('button', { name: 'Complete 10 checks' }).click()
  await expect(bar).toHaveAttribute('data-complete')
  await expect(bar).toHaveAttribute('aria-valuenow', '100')
  await expect(
    page.getByRole('status').filter({ hasText: 'All checks completed.' }),
  ).toHaveText('All checks completed.')
  await page.getByRole('button', { name: 'Reset progress' }).click()
  await expect(bar).toHaveAttribute('aria-valuenow', '0')
})
test('Meter uses capacity range and units, stays bounded, and fills from logical start in RTL', async ({
  page,
}) => {
  await page.goto('/components/meter')
  await waitForCatalogReady(page)
  const meter = page.getByRole('meter', { name: 'Memory allocation' })
  await expect(meter).toHaveAttribute('aria-valuemax', '64')
  await expect(meter).toHaveAttribute('aria-valuenow', '30')
  await expect(meter).toHaveAttribute('aria-valuetext', '30 GiB of 64 GiB')
  for (let i = 0; i < 6; i++)
    await page.getByRole('button', { name: 'Allocate 8 GiB' }).click()
  await expect(meter).toHaveAttribute('aria-valuenow', '64')
  await page.getByRole('button', { name: 'Release allocation' }).click()
  await expect(meter).toHaveAttribute('aria-valuenow', '0')
  await page.getByRole('button', { name: 'Allocate 8 GiB' }).click()
  await page.evaluate(() => (document.documentElement.dir = 'rtl'))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const geometry = await page.locator('.pui-gauge-track').evaluate((el) => {
    const track = el.getBoundingClientRect(),
      fill = el.firstElementChild!.getBoundingClientRect()
    return {
      ratio: fill.width / track.width,
      end: Math.abs(fill.right - track.right),
    }
  })
  expect(geometry.ratio).toBeCloseTo(0.125, 2)
  expect(geometry.end).toBeLessThan(1)
})
for (const id of ['spinner', 'skeleton'])
  test(`${id} owns one loading announcement and replaces placeholders on completion`, async ({
    page,
  }) => {
    await page.goto(`/components/${id}`)
    await waitForCatalogReady(page)
    const region = page.getByRole('region', { name: 'Environment preview' })
    await expect(region).toHaveAttribute('aria-busy', 'true')
    await expect(region.getByRole('status')).toHaveCount(0)
    await page.getByRole('button', { name: 'Finish preview loading' }).click()
    await expect(region).toHaveAttribute('aria-busy', 'false')
    await expect(region).toContainText('DEMO main')
    await expect(page.locator('.pui-skeleton')).toHaveCount(0)
    await page.getByRole('button', { name: 'Reload preview' }).click()
    await expect(region).toHaveAttribute('aria-busy', 'true')
    if (id === 'skeleton')
      await expect(page.locator('.pui-skeleton').first()).toHaveAttribute(
        'aria-hidden',
        'true',
      )
    else
      await expect(
        page
          .getByRole('status')
          .filter({ hasText: 'Background sync in progress' }),
      ).toBeVisible()
  })
test('Feedback pages pass accessibility, narrow view, dark theme and reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const id of feedbackExampleIds) {
    await page.goto(`/components/${id}`)
    await waitForCatalogReady(page)
    for (const theme of ['light', 'dark']) {
      await page.evaluate(
        (t) => (document.documentElement.dataset.theme = t),
        theme,
      )
      await page.setViewportSize({ width: 320, height: 800 })
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy()
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    }
    for (const selector of [
      '.pui-spinner > svg',
      '.pui-skeleton',
      '.pui-gauge-indicator',
    ]) {
      const el = page.locator(selector).first()
      if (await el.count())
        expect(
          await el.evaluate((e) => getComputedStyle(e).animationName),
        ).toBe('none')
    }
  }
})

test('Unknown progress stops pulsing with reduced motion and remains visible in forced colors', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' })
  await page.goto('/components/progress')
  await waitForCatalogReady(page)
  await page.getByRole('button', { name: 'Wait for worker' }).click()
  const indicator = page.locator('.pui-gauge-indicator')
  expect(
    await indicator.evaluate((e) => getComputedStyle(e).animationName),
  ).toBe('none')
  const colors = await indicator.evaluate((e) => ({
    fill: getComputedStyle(e).backgroundColor,
    track: getComputedStyle(e.parentElement!).backgroundColor,
  }))
  expect(colors.fill).not.toBe(colors.track)
  const bar = page.getByRole('progressbar', { name: 'Deployment progress' })
  await expect(bar).not.toHaveAttribute('aria-valuenow')
  await expect(bar).toHaveAttribute('aria-valuetext', 'Waiting for worker')
  await expect(page.locator('.pui-gauge-value')).toHaveText(
    'Waiting for worker',
  )
})
