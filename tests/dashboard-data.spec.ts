import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import {
  formatCurrency,
  formatNumber,
  formatPercent,
} from '../packages/ui/src/format'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })

test('number helpers share locale, sign, precision and missing rules', () => {
  expect(formatNumber(1234.5, { locale: 'en-US' })).toBe('1,234.5')
  expect(formatNumber(0, { locale: 'en-US', signed: true })).toBe('0')
  expect(formatNumber(12, { locale: 'en-US', signed: true })).toBe('+12')
  expect(formatNumber(-12, { locale: 'en-US', signed: true })).toBe('-12')
  expect(formatNumber(1_250_000, { locale: 'en-US', compact: true })).toBe(
    '1.3M',
  )
  expect(formatNumber(12_500, { locale: 'ko-KR', compact: true })).toBe('1.3만')
  expect(formatNumber(null)).toBe('—')
  expect(formatNumber(Number.NaN, { missing: 'n/a' })).toBe('n/a')
  expect(formatCurrency(1200, 'KRW', { locale: 'ko-KR' })).toBe('₩1,200')
  expect(formatCurrency(12.5, 'USD', { locale: 'en-US' })).toBe('$12.50')
  expect(
    formatCurrency(4_920_000, 'KRW', { locale: 'en-US', compact: true }),
  ).toBe('₩4.9M')
  expect(formatPercent(0.0321, { locale: 'en-US' })).toBe('3.2%')
  expect(formatPercent(0.0321, { locale: 'en-US', signed: true })).toBe('+3.2%')
  expect(formatPercent(-0.005, { locale: 'en-US', precision: 2 })).toBe(
    '-0.50%',
  )
})

test('Stat names its value and shows direction by sign, arrow and color', async ({
  page,
}) => {
  await page.goto('/components/stat')
  await waitForCatalogReady(page)
  const preview = page.locator('[data-preview-size]')
  const stats = preview.locator('dl.pui-stat')
  await expect(stats).toHaveCount(3)
  const first = stats.first()
  await expect(first.locator('> dt')).toHaveText('Deploy success')
  await expect(first.locator('> dd.pui-stat-value')).toHaveText('99%')
  const change = first.locator('.pui-stat-change')
  await expect(change).toHaveAttribute('data-direction', 'up')
  await expect(change).toHaveAttribute('data-tone', 'up')
  await expect(change).toHaveText(/^\+0\.5%$/)
  await expect(change.locator('svg.pui-icon')).toHaveAttribute(
    'aria-hidden',
    'true',
  )
  // Latency fell, and a fall is good there: the arrow points down, the color is up's.
  const latency = stats.nth(1).locator('.pui-stat-change')
  await expect(latency).toHaveAttribute('data-direction', 'down')
  await expect(latency).toHaveAttribute('data-tone', 'up')
  const colors = await page.evaluate(() => {
    const probe = document.createElement('span')
    document.body.append(probe)
    const read = (token: string) => {
      probe.style.color = `var(${token})`
      return getComputedStyle(probe).color
    }
    const result = { up: read('--trend-up-fg'), down: read('--trend-down-fg') }
    probe.remove()
    return result
  })
  expect(await change.evaluate((el) => getComputedStyle(el).color)).toBe(
    colors.up,
  )
  expect(await latency.evaluate((el) => getComputedStyle(el).color)).toBe(
    colors.up,
  )
  const cost = stats.nth(2).locator('.pui-stat-change')
  await expect(cost).toHaveAttribute('data-tone', 'down')
  expect(await cost.evaluate((el) => getComputedStyle(el).color)).toBe(
    colors.down,
  )
  await expect(stats.nth(2).locator('.pui-stat-value')).toHaveText('₩4.9M')
})

test('Sparkline is a named image with sizes, a baseline, a marker and gaps', async ({
  page,
}) => {
  await page.goto('/components/sparkline')
  await waitForCatalogReady(page)
  const lines = page.locator('[data-preview-size] svg.pui-sparkline')
  await expect(lines).toHaveCount(4)
  for (const [index, height] of [24, 32, 48].entries()) {
    const line = lines.nth(index)
    await expect(line).toHaveAttribute('role', 'img')
    await expect(line).toHaveAttribute('aria-label', /^Index, 10 sessions/)
    expect(await line.evaluate((el) => el.getBoundingClientRect().height)).toBe(
      height,
    )
    await expect(line.locator('.pui-sparkline-baseline')).toHaveCount(1)
    await expect(line.locator('.pui-sparkline-marker')).toHaveCount(1)
    await expect(line).toHaveAttribute('data-tone', 'up')
  }
  // A missing week starts a second segment instead of drawing through zero.
  const gap = await lines
    .nth(3)
    .locator('.pui-sparkline-line')
    .getAttribute('d')
  expect(gap?.match(/M/g)).toHaveLength(2)
  await expect(lines.nth(3).locator('.pui-sparkline-baseline')).toHaveCount(0)
})

test('Chart can leave zero off its axis and color categories', async ({
  page,
}) => {
  await page.goto('/components/chart')
  await waitForCatalogReady(page)
  const pick = async (name: string, option: string) => {
    await page.getByRole('combobox', { name }).click()
    await page.getByRole('option', { name: option }).click()
  }
  const ticks = () =>
    page
      .locator('figure.pui-chart svg text')
      .allTextContents()
      .then((texts) => texts.filter((text) => /^\d+$/.test(text)))
  await pick('Chart data', 'Latency far from zero')
  // From zero too, the top tick is the round value just above the highest one.
  await expect.poll(ticks).toEqual(['0', '50', '100', '150', '200', '250'])
  await page.getByText('Keep zero on the value axis').click()
  await expect.poll(ticks).toEqual(['140', '160', '180', '200', '220', '240'])
  // Bars start at zero whatever the switch says.
  await pick('Chart type', 'Bar')
  await expect.poll(ticks).toContain('0')
  await pick('Chart type', 'Line')
  // The value axis reads in the chart's own notation: raw bytes as GB, never 2B.
  await page.getByText('Keep zero on the value axis').click()
  await pick('Chart data', 'Memory in bytes')
  await expect.poll(ticks).toEqual(['0', '2', '4', '6'])
  await pick('Chart data', 'Five duration buckets')
  await pick('Palette', 'Categorical')
  const strokes = await page
    .locator(
      'figure.pui-chart .pui-chart-legend-button svg > path:first-of-type',
    )
    .evaluateAll((paths) => paths.map((p) => p.getAttribute('stroke')))
  expect(strokes).toEqual(
    [1, 2, 3, 4, 5].map((index) => `var(--chart-category-${index})`),
  )
})

test('StatusBadge has an info tone with its own icon', async ({ page }) => {
  await page.goto('/components/badge')
  await waitForCatalogReady(page)
  const badge = page
    .locator('[data-preview-size] .pui-badge[data-tone="info"]')
    .first()
  await expect(badge).toHaveText('Scheduled')
  await expect(badge.locator('svg.pui-icon')).toHaveCount(1)
})

for (const theme of ['light', 'dark'])
  test(`dashboard pieces pass automated accessibility in ${theme}`, async ({
    page,
  }) => {
    for (const path of ['/components/stat', '/components/sparkline']) {
      await page.goto(path)
      await waitForCatalogReady(page)
      if (theme === 'dark')
        await page.getByRole('button', { name: 'Toggle theme' }).click()
      const { violations } = await new AxeBuilder({ page })
        .include('[data-preview-size]')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      expect(violations).toEqual([])
    }
  })
