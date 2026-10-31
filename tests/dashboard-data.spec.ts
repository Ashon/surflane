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
  await page.goto('/charts/sparkline')
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
  await page.goto('/charts/chart')
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
      '/charts/sparkline',
      '/charts/bar-list',
      '/charts/proportion-bar',
      '/charts/diverging-bar',
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
  await page.goto('/charts/bar-list')
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
  ).toHaveText(/^Harbor\s*18\.4M/)
})

const colorOf = (page: import('@playwright/test').Page, token: string) =>
  page.evaluate((name) => {
    const probe = document.createElement('span')
    probe.style.backgroundColor = `var(${name})`
    document.body.append(probe)
    const color = getComputedStyle(probe).backgroundColor
    probe.remove()
    return color
  }, token)

test('ProportionBar splits one bar into its parts, named in a legend that is the text', async ({
  page,
}) => {
  await page.goto('/charts/proportion-bar')
  await waitForCatalogReady(page)
  const sentiment = page.getByRole('group', {
    name: 'News sentiment, 25 articles',
  })
  const entries = sentiment.getByRole('listitem')
  await expect(entries).toHaveText([
    /Positive\s*12 \(48%\)/,
    /Negative\s*5 \(20%\)/,
    /Neutral\s*8 \(32%\)/,
  ])
  const bar = sentiment.locator('.surf-proportion-bar')
  await expect(bar).toHaveAttribute('aria-hidden', 'true')
  // Each part takes its share of the bar, less the steps between them.
  const parts = await bar.evaluate((element) => {
    const box = element.getBoundingClientRect()
    const segments = [...element.children].map((child) =>
      child.getBoundingClientRect(),
    )
    const gaps = segments
      .slice(1)
      .map((segment, index) => segment.left - segments[index].right)
    const filled = box.width - gaps.reduce((sum, gap) => sum + gap, 0)
    return {
      shares: segments.map((segment) => segment.width / filled),
      gaps,
      colors: [...element.children].map(
        (child) => getComputedStyle(child).backgroundColor,
      ),
    }
  })
  expect(parts.shares[0]).toBeCloseTo(0.48, 2)
  expect(parts.shares[1]).toBeCloseTo(0.2, 2)
  expect(parts.shares[2]).toBeCloseTo(0.32, 2)
  expect(parts.gaps.every((gap) => Math.abs(gap - 2) < 0.5)).toBe(true)
  // Direction parts take the trend tones; a flat one the quiet neutral mark.
  expect(parts.colors).toEqual([
    await colorOf(page, '--surf-trend-up-fg'),
    await colorOf(page, '--surf-trend-down-fg'),
    await colorOf(page, '--surf-status-neutral-border'),
  ])
  // Parts of their own take the category hues in order; the legend writes values.
  const teams = page.getByRole('group', { name: 'GPU hours by team' })
  await expect(teams.getByRole('listitem').first()).toHaveText(
    /Research\s*412 h/,
  )
  expect(
    await teams
      .locator('.surf-proportion-segment')
      .evaluateAll((segments) =>
        segments.map((segment) => getComputedStyle(segment).backgroundColor),
      ),
  ).toEqual(
    await Promise.all(
      [1, 2, 3, 4, 5].map((index) =>
        colorOf(page, `--surf-chart-category-${index}`),
      ),
    ),
  )
  await expect(
    page
      .getByRole('group', { name: 'Portfolio by market' })
      .getByRole('listitem'),
  ).toHaveText([/Korea\s*58%/, /United States\s*42%/])
})

test('DivergingBar grows a signed value from a center line on a shared scale', async ({
  page,
}) => {
  await page.goto('/charts/diverging-bar')
  await waitForCatalogReady(page)
  const measure = (name: string) =>
    page.getByRole('img', { name, exact: true }).evaluate((element) => {
      const box = element.getBoundingClientRect()
      const fill = element.querySelector('.surf-diverging-fill')!
      const part = fill.getBoundingClientRect()
      return {
        start: (part.left - box.left) / box.width,
        end: (part.right - box.left) / box.width,
        color: getComputedStyle(fill).backgroundColor,
      }
    })
  // The largest gap fills a half; a fall grows toward the start.
  const top = await measure('Semiconductors, +4.2%p against the market')
  expect(top.start).toBeCloseTo(0.5, 2)
  expect(top.end).toBeCloseTo(1, 2)
  expect(top.color).toBe(await colorOf(page, '--surf-trend-up-fg'))
  const banks = await measure('Banks, +1.1%p against the market')
  expect(banks.end - banks.start).toBeCloseTo((1.1 / 4.2) * 0.5, 2)
  const autos = await measure('Autos, -0.6%p against the market')
  expect(autos.end).toBeCloseTo(0.5, 2)
  expect(autos.start).toBeCloseTo(0.5 - (0.6 / 4.2) * 0.5, 2)
  expect(autos.color).toBe(await colorOf(page, '--surf-trend-down-fg'))
  // A neutral trend draws both ways in the brand mark.
  const bonds = await measure('Bonds, -3.2%p against target')
  expect(bonds.color).toBe(await colorOf(page, '--surf-brand-mark'))
  // Right to left, a rise grows toward the left from the same center.
  await page.evaluate(() => (document.documentElement.dir = 'rtl'))
  const mirrored = await measure('Semiconductors, +4.2%p against the market')
  expect(mirrored.start).toBeCloseTo(0, 2)
  expect(mirrored.end).toBeCloseTo(0.5, 2)
})

test('a diverging BarList ranks signed values from one center line', async ({
  page,
}) => {
  await page.goto('/charts/bar-list')
  await waitForCatalogReady(page)
  const list = page.getByRole('list', {
    name: 'Sector return against the market, 20 days',
  })
  const rows = list.getByRole('listitem')
  await expect(rows).toHaveText([
    /Semiconductors\s*\+4\.2%p/,
    /Banks\s*\+1\.1%p/,
    /Autos\s*-0\.6%p/,
    /Chemicals\s*-2\.8%p/,
    /Retail\s*-3\.5%p/,
  ])
  const tracks = await rows.evaluateAll((items) =>
    items.map((item) => {
      const track = item.querySelector('.surf-diverging')!
      const box = track.getBoundingClientRect()
      const fill = track
        .querySelector('.surf-diverging-fill')!
        .getBoundingClientRect()
      return {
        center: box.left + box.width / 2,
        hidden: track.getAttribute('aria-hidden'),
        grows:
          Math.abs(fill.left - (box.left + box.width / 2)) < 1
            ? 'end'
            : Math.abs(fill.right - (box.left + box.width / 2)) < 1
              ? 'start'
              : 'neither',
        share: fill.width / (box.width / 2),
      }
    }),
  )
  expect(new Set(tracks.map((track) => Math.round(track.center))).size).toBe(1)
  expect(tracks.every((track) => track.hidden === 'true')).toBe(true)
  expect(tracks.map((track) => track.grows)).toEqual([
    'end',
    'end',
    'start',
    'start',
    'start',
  ])
  expect(tracks[0].share).toBeCloseTo(1, 2)
  expect(tracks[4].share).toBeCloseTo(3.5 / 4.2, 2)
})
