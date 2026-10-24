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

test('Stat shows a value past its threshold by text, icon and color, and groups values of one measure', async ({
  page,
}) => {
  await page.goto('/components/stat')
  await waitForCatalogReady(page)
  const preview = page.locator('[data-preview-size]')
  const tone = (token: string) =>
    page.evaluate((name) => {
      const probe = document.createElement('span')
      probe.style.color = `var(${name})`
      document.body.append(probe)
      const color = getComputedStyle(probe).color
      probe.remove()
      return color
    }, token)
  const disk = preview.locator('dl.surf-stat:has(.surf-stat-status)').first()
  const status = disk.locator('dd.surf-stat-status')
  await expect(status).toHaveText('Below 30 GiB')
  await expect(status.locator('svg')).toHaveAttribute('aria-hidden', 'true')
  const danger = await tone('--surf-status-danger-fg')
  await expect(status).toHaveCSS('color', danger)
  await expect(disk.locator('dd.surf-stat-value')).toHaveCSS('color', danger)
  const scan = preview.locator('dl.surf-stat:has(.surf-stat-status)').nth(1)
  await expect(scan.locator('dd.surf-stat-value')).toHaveCSS(
    'color',
    await tone('--surf-status-caution-fg'),
  )
  // A group names its values once; each Stat names its own node.
  const group = preview.getByRole('group', { name: 'GPU temperature' })
  const nodes = group.locator('dl.surf-stat')
  await expect(nodes).toHaveCount(2)
  await expect(nodes.locator('dt')).toHaveText(['dgx-001', 'dgx-002'])
  const [a, b] = await Promise.all([
    nodes.nth(0).boundingBox(),
    nodes.nth(1).boundingBox(),
  ])
  expect(a!.y).toBe(b!.y)
  expect(b!.x).toBeGreaterThan(a!.x + a!.width)
})
test('Stat names its value and shows direction by sign, arrow and color', async ({
  page,
}) => {
  await page.goto('/components/stat')
  await waitForCatalogReady(page)
  const preview = page.locator('[data-preview-size]')
  const stats = preview.locator('dl.surf-stat:has(.surf-stat-change)')
  await expect(stats).toHaveCount(3)
  const first = stats.first()
  await expect(first.locator('> dt')).toHaveText('Deploy success')
  await expect(first.locator('> dd.surf-stat-value')).toHaveText('99%')
  const change = first.locator('.surf-stat-change')
  await expect(change).toHaveAttribute('data-direction', 'up')
  await expect(change).toHaveAttribute('data-tone', 'up')
  await expect(change).toHaveText(/^\+0\.5%$/)
  await expect(change.locator('svg.surf-icon')).toHaveAttribute(
    'aria-hidden',
    'true',
  )
  // Latency fell, and a fall is good there: the arrow points down, the color is up's.
  const latency = stats.nth(1).locator('.surf-stat-change')
  await expect(latency).toHaveAttribute('data-direction', 'down')
  await expect(latency).toHaveAttribute('data-tone', 'up')
  const colors = await page.evaluate(() => {
    const probe = document.createElement('span')
    document.body.append(probe)
    const read = (token: string) => {
      probe.style.color = `var(${token})`
      return getComputedStyle(probe).color
    }
    const result = {
      up: read('--surf-trend-up-fg'),
      down: read('--surf-trend-down-fg'),
    }
    probe.remove()
    return result
  })
  expect(await change.evaluate((el) => getComputedStyle(el).color)).toBe(
    colors.up,
  )
  expect(await latency.evaluate((el) => getComputedStyle(el).color)).toBe(
    colors.up,
  )
  const cost = stats.nth(2).locator('.surf-stat-change')
  await expect(cost).toHaveAttribute('data-tone', 'down')
  expect(await cost.evaluate((el) => getComputedStyle(el).color)).toBe(
    colors.down,
  )
  await expect(stats.nth(2).locator('.surf-stat-value')).toHaveText('₩4.9M')
})

test('Sparkline is a named image with sizes, a baseline, a marker and gaps', async ({
  page,
}) => {
  await page.goto('/components/sparkline')
  await waitForCatalogReady(page)
  const lines = page.locator('[data-preview-size] svg.surf-sparkline')
  await expect(lines).toHaveCount(4)
  for (const [index, height] of [24, 32, 48].entries()) {
    const line = lines.nth(index)
    await expect(line).toHaveAttribute('role', 'img')
    await expect(line).toHaveAttribute('aria-label', /^Index, 10 sessions/)
    expect(await line.evaluate((el) => el.getBoundingClientRect().height)).toBe(
      height,
    )
    await expect(line.locator('.surf-sparkline-baseline')).toHaveCount(1)
    await expect(line.locator('.surf-sparkline-marker')).toHaveCount(1)
    await expect(line).toHaveAttribute('data-tone', 'up')
  }
  // A missing week starts a second segment instead of drawing through zero.
  const gap = await lines
    .nth(3)
    .locator('.surf-sparkline-line')
    .getAttribute('d')
  expect(gap?.match(/M/g)).toHaveLength(2)
  await expect(lines.nth(3).locator('.surf-sparkline-baseline')).toHaveCount(0)
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
      .locator('figure.surf-chart svg text')
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
      'figure.surf-chart .surf-chart-legend-button svg > path:first-of-type',
    )
    .evaluateAll((paths) => paths.map((p) => p.getAttribute('stroke')))
  expect(strokes).toEqual(
    [1, 2, 3, 4, 5].map((index) => `var(--surf-chart-category-${index})`),
  )
})

test('StatusBadge has an info tone with its own icon', async ({ page }) => {
  await page.goto('/components/badge')
  await waitForCatalogReady(page)
  const badge = page
    .locator('[data-preview-size] .surf-badge[data-tone="info"]')
    .first()
  await expect(badge).toHaveText('Scheduled')
  await expect(badge.locator('svg.surf-icon')).toHaveCount(1)
})

for (const theme of ['light', 'dark'])
  test(`dashboard pieces pass automated accessibility in ${theme}`, async ({
    page,
  }) => {
    for (const path of [
      '/components/stat',
      '/components/sparkline',
      '/components/bar-list',
    ]) {
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
test('BarList ranks values in shared columns and scrolls a bounded list by whole rows', async ({
  page,
}) => {
  await page.goto('/components/bar-list')
  await waitForCatalogReady(page)
  const disk = page.getByRole('list', { name: 'Disk used by directory' })
  const rows = disk.getByRole('listitem')
  await expect(rows).toHaveCount(8)
  // Largest first, each row read as name, detail and value.
  await expect(rows.first()).toHaveText(/^models\s*\/srv\/models\s*412 GiB$/)
  await expect(rows.nth(1)).toContainText('cache')
  await expect(rows.last()).toContainText('6 GiB')
  // Bars start together and are in proportion to the largest.
  const bars = await rows.evaluateAll((items) =>
    items.map((item) => {
      const bar = item.querySelector('.surf-bar-list-bar')!
      const fill = item.querySelector('.surf-bar-list-fill')!
      return [
        bar.getBoundingClientRect().left,
        fill.getBoundingClientRect().width / bar.getBoundingClientRect().width,
        bar.getAttribute('aria-hidden'),
      ]
    }),
  )
  expect(new Set(bars.map(([left]) => left)).size).toBe(1)
  expect(bars[0][1]).toBe(1)
  expect(bars[1][1]).toBeCloseTo(168 / 412, 2)
  expect(bars.every(([, , hidden]) => hidden === 'true')).toBe(true)
  // Five whole rows show; the region scrolls by keyboard.
  const region = page.getByRole('region', { name: 'Disk used by directory' })
  const [viewport, row] = await Promise.all([
    region.boundingBox(),
    rows.first().boundingBox(),
  ])
  expect(viewport!.height).toBeCloseTo(row!.height * 5, 0)
  await region.focus()
  await region.press('End')
  await expect
    .poll(() => region.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(0)
  await expect(
    page.getByRole('list', { name: 'Tokens this week by project' }),
  ).toHaveText(/^Pacenote\s*18\.4M/)
})
