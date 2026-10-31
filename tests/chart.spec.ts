import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'

test.use({ reducedMotion: 'reduce' })
async function open(page: Page) {
  await page.goto('/charts/chart')
  await waitForCatalogReady(page)
  await expect(
    page.getByRole('application', { name: 'Pipeline activity' }),
  ).toBeVisible()
}
async function choose(page: Page, name: string, value: string) {
  await page.getByRole('combobox', { name, exact: true }).click()
  await page.getByRole('option', { name: value, exact: true }).click()
}
test('keyboard values retain missing data, escape clears the readout and the complete table keeps hidden series', async ({
  page,
}) => {
  await open(page)
  const chart = page.getByRole('application', {
    name: 'Pipeline activity',
  })
  const readout = page.getByRole('status', {
    name: 'Pipeline activity values',
  })
  await expect(chart).toHaveAttribute('aria-describedby', /summary.*keys/)
  await chart.focus()
  await chart.press('ArrowRight')
  await expect(readout).toContainText('October 2, 2026')
  await chart.press('ArrowRight')
  await expect(readout).toContainText('Inventory: Not available')
  await expect(readout).toContainText('Workspace: 14 runs')
  await chart.press('Escape')
  await expect(readout).not.toContainText('October 3')
  await expect(chart).toBeFocused()
  await chart.press('ArrowLeft')
  await expect(readout).toContainText('October 2, 2026')
  const paths = await page
    .locator('.recharts-line-curve')
    .evaluateAll((elements) => elements.map((el) => el.getAttribute('d') ?? ''))
  expect(paths[1].match(/M/g)).toHaveLength(2)
  await page
    .getByRole('button', { name: 'Inventory series', exact: true })
    .click()
  await expect(
    page.getByRole('button', { name: 'Inventory series', exact: true }),
  ).toHaveAttribute('aria-pressed', 'false')
  await page.getByText('View data table', { exact: true }).click()
  const table = page.getByRole('table').first()
  await expect(
    table.getByRole('columnheader', { name: 'Inventory (runs)' }),
  ).toBeVisible()
  const row = table.getByRole('row', { name: /October 3, 2026/ })
  await expect(
    row.getByRole('cell', { name: 'Not available', exact: true }),
  ).toBeVisible()
  // The unit is named once, in the header; cells hold numbers at the end.
  await expect(
    row.getByRole('cell', { name: '14', exact: true }),
  ).toHaveAttribute('data-numeric', 'true')
  await expect(
    table.getByRole('columnheader', { name: 'Inventory (runs)' }),
  ).toHaveAttribute('data-numeric', 'true')
})

test('legend supports all-hidden recovery and calling-owner rejection without moving focus', async ({
  page,
}) => {
  await open(page)
  const workspace = page.getByRole('button', {
    name: 'Workspace series',
    exact: true,
  })
  await workspace.click()
  await expect(workspace).toHaveAttribute('aria-pressed', 'false')
  await page.getByRole('checkbox', { name: 'Lock series selection' }).check()
  await workspace.click()
  await expect(workspace).toBeFocused()
  await expect(workspace).toHaveAttribute('aria-pressed', 'false')
  await expect(
    page.getByRole('status', { name: 'Chart selection result' }),
  ).toContainText('rejected')
  await page.getByRole('checkbox', { name: 'Lock series selection' }).uncheck()
  for (const name of ['Inventory series', 'Documentation series'])
    await page.getByRole('button', { name, exact: true }).click()
  await expect(
    page.getByText('No series selected.', { exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('application')).toHaveCount(0)
  await page.getByRole('button', { name: 'Show all series' }).click()
  await expect(workspace).toHaveAttribute('aria-pressed', 'true')
  await expect(workspace).toBeFocused()
  await expect(page.getByRole('application')).toBeVisible()
})

test('bar and area modes preserve zero, negatives, non-color patterns and data changes', async ({
  page,
}) => {
  await open(page)
  await choose(page, 'Chart data', 'Negative and zero values')
  await choose(page, 'Chart type', 'Bar')
  await expect(page.locator('.recharts-bar')).toHaveCount(3)
  const geometry = await page.locator('.surf-chart-plot').evaluate((plot) => {
    const zero = plot.querySelector(
      '.recharts-reference-line-line',
    ) as SVGLineElement
    const y = Number(zero.getAttribute('y1'))
    const boxes = Array.from(
      plot.querySelectorAll<SVGGraphicsElement>('.recharts-bar-rectangle path'),
    ).map((el) => el.getBBox())
    return {
      positive: boxes.some(
        (b) => b.y < y - 1 && Math.abs(b.y + b.height - y) < 1,
      ),
      negative: boxes.some((b) => b.height > 1 && Math.abs(b.y - y) < 1),
    }
  })
  expect(geometry).toEqual({ positive: true, negative: true })
  await expect(page.locator('.surf-chart-plot pattern path')).toHaveCount(1)
  await expect(page.locator('.surf-chart-plot pattern circle')).toHaveCount(1)
  await page.getByText('View data table', { exact: true }).click()
  await expect(
    page
      .getByRole('table')
      .first()
      .getByRole('cell', { name: '0', exact: true }),
  ).toHaveCount(3)
  await choose(page, 'Chart type', 'Area')
  await expect(page.locator('.recharts-area-area')).toHaveCount(3)
  const app = page.getByRole('application')
  await app.focus()
  await app.press('ArrowRight')
  await expect(page.locator('.surf-chart-inspector')).toContainText('resources')
  await choose(page, 'Chart data', 'Trend with a missing value')
  await app.focus()
  await app.press('ArrowRight')
  await expect(page.locator('.surf-chart-inspector')).toContainText('runs')
  await expect(page.locator('.surf-chart-inspector')).not.toContainText(
    'resources',
  )
})

test('all-missing and empty data never fabricate measurements and table scrolling contains dense data', async ({
  page,
}) => {
  await open(page)
  await choose(page, 'Chart data', 'All values unavailable')
  await expect(page.getByRole('application')).toHaveCount(0)
  await expect(
    page.getByText('No numeric measurements to display.', { exact: true }),
  ).toBeVisible()
  await page.getByText('View data table', { exact: true }).click()
  await expect(
    page
      .getByRole('table')
      .first()
      .getByRole('cell', { name: 'Not available', exact: true }),
  ).toHaveCount(6)
  await choose(page, 'Chart data', 'No rows')
  await expect(page.getByRole('table').first()).toContainText('No rows.')
  await choose(page, 'Chart data', '120 long resource labels')
  await expect(page.locator('.recharts-line-dots circle')).toHaveCount(0)
  const viewport = page.getByRole('region', {
    name: 'Pipeline activity data table',
    exact: true,
  })
  await expect(viewport.getByRole('rowheader')).toHaveCount(120)
  const sizes = await viewport.evaluate((el) => {
    el.scrollTop = 600
    return { height: el.clientHeight, scroll: el.scrollTop }
  })
  expect(sizes.height).toBeLessThanOrEqual(320)
  expect(sizes.scroll).toBeGreaterThan(0)
  await expect(viewport.getByRole('rowheader').last()).toHaveText(
    /resource-with-a-long-identifier-120/,
  )
})

test('pointer readout, responsive themes, high contrast and reduced motion keep the chart usable', async ({
  page,
}) => {
  for (const width of [1440, 320])
    for (const theme of ['light', 'dark']) {
      await page.context().addCookies([
        {
          name: 'surflane-theme',
          value: theme,
          url: 'http://127.0.0.1:8066',
        },
      ])
      await page.setViewportSize({ width, height: 1000 })
      await open(page)
      const app = page.getByRole('application')
      await app.scrollIntoViewIfNeeded()
      const box = await app.boundingBox()
      expect(box!.width).toBeGreaterThan(100)
      await app.hover({ position: { x: box!.width / 2, y: box!.height / 2 } })
      await expect(page.locator('[data-chart-readout]')).toBeVisible()
      await choose(page, 'Chart data', '120 long resource labels')
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true)
      await page.getByText('View data table', { exact: true }).click()
      const violations = (
        await new AxeBuilder({ page }).include('#preview').analyze()
      ).violations
      expect(violations).toEqual([])
      await page
        .locator('.surf-chart')
        .screenshot({ path: `.data/chart-${width}-${theme}.png` })
    }
  await page.emulateMedia({ forcedColors: 'active' })
  await choose(page, 'Chart type', 'Bar')
  expect(
    await page
      .locator('.surf-chart')
      .evaluate((el) =>
        getComputedStyle(el).getPropertyValue('--surf-chart-series-1').trim(),
      ),
  ).toBe('CanvasText')
  await expect(page.locator('.surf-chart-plot pattern path')).toHaveCount(1)
  await page.getByRole('application').focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('[data-chart-readout]')).toBeVisible()
})

test('touch exposes the same complete values without relying on hover', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  await open(page)
  const app = page.getByRole('application')
  await app.scrollIntoViewIfNeeded()
  const box = await app.boundingBox()
  await page.touchscreen.tap(
    box!.x + box!.width * 0.6,
    box!.y + box!.height / 2,
  )
  await expect(page.locator('[data-chart-readout]')).toBeVisible()
  await expect(page.locator('.surf-chart-inspector')).toContainText(
    'Workspace:',
  )
  // A tap focuses the plot, or the Recharts layer the finger lands nearest, but draws
  // no ring; the browser's SVG styles would.
  const tapped = page.locator('.surf-chart-plot :focus')
  await expect(tapped).toHaveCount(1)
  await expect(tapped).toHaveCSS('outline-style', 'none')
  // A tap on a point focuses the Recharts layer it sits in, which draws no ring either.
  const point = await page
    .locator('.surf-chart-plot .recharts-line-dots circle')
    .nth(3)
    .boundingBox()
  await page.touchscreen.tap(
    point!.x + point!.width / 2,
    point!.y + point!.height / 2,
  )
  const focused = page.locator('.surf-chart-plot g[tabindex="-1"]:focus')
  await expect(focused).toHaveCount(1)
  await expect(focused).toHaveCSS('outline-style', 'none')
  await context.close()
})

test('the plot rings for keyboard focus only', async ({ page }) => {
  await open(page)
  const surface = page.locator('.surf-chart-plot .recharts-surface')
  await surface.click({ position: { x: 120, y: 80 } })
  await expect(surface).toBeFocused()
  await expect(surface).toHaveCSS('outline-style', 'none')
  await page.locator('.surf-chart-legend-button').last().focus()
  await page.keyboard.press('Tab')
  await expect(surface).toBeFocused()
  await expect(surface).toHaveCSS('outline-style', 'solid')
})

test('the key sits on the plot and the active values float beside the point', async ({
  page,
}) => {
  await open(page)
  // The value axis name and the legend share the row right above the plot.
  const frame = page.locator('.surf-chart-frame')
  await expect(frame.locator('> *')).toHaveCount(3)
  await expect(frame.locator('> :nth-child(1)')).toHaveClass('surf-chart-key')
  await expect(frame.locator('> :nth-child(2)')).toHaveClass('surf-chart-plot')
  const key = await frame.locator('.surf-chart-key').boundingBox()
  const plot = await frame.locator('.surf-chart-plot').boundingBox()
  expect(plot!.y - (key!.y + key!.height)).toBeLessThanOrEqual(1)

  const chart = page.getByRole('application', { name: 'Pipeline activity' })
  const tip = page.locator('.surf-chart-tooltip')
  await chart.focus()
  await chart.press('ArrowRight')
  await chart.press('ArrowRight')
  await expect(tip).toHaveAttribute('aria-hidden', 'true')
  await expect(tip).toContainText('October 3, 2026')
  await expect(tip.locator('li')).toHaveText([
    /Workspace\s*14 runs/,
    /Inventory\s*Not available/,
    /Documentation\s*6 runs/,
  ])
  // Each row carries its series' mark, as the legend draws it.
  await expect(tip.locator('li svg.surf-chart-mark')).toHaveCount(3)
  for (const index of [1, 4]) {
    for (let step = 0; step < index; step++) await chart.press('ArrowRight')
    const box = await tip.boundingBox()
    expect(box!.x).toBeGreaterThanOrEqual(plot!.x - 0.5)
    expect(box!.x + box!.width).toBeLessThanOrEqual(plot!.x + plot!.width + 0.5)
  }
  await chart.press('Escape')
  await expect(tip).toHaveCount(0)
  // A hidden series leaves the box too.
  await chart.press('ArrowLeft')
  await page.getByRole('button', { name: 'Inventory series' }).click()
  await chart.focus()
  await chart.press('ArrowLeft')
  await expect(tip.locator('li')).toHaveCount(2)
})
test('a time axis ticks on round times and breaks lines where sampling stopped', async ({
  page,
}) => {
  await open(page)
  await choose(page, 'Chart data', 'GPU temperature over a day')
  const plot = page.locator('.surf-chart-plot')
  const ticks = plot.locator('.recharts-xAxis-tick-labels text')
  await expect(ticks.first()).toHaveText('Oct 17')
  await expect(ticks.nth(1)).toHaveText('6:00 AM')
  // The exporter stopped from 03:00 to 04:00, so each line has two segments.
  const paths = await plot
    .locator('.recharts-line-curve')
    .evaluateAll((elements) => elements.map((el) => el.getAttribute('d') ?? ''))
  expect(paths.map((d) => d.match(/M/g)?.length)).toEqual([2, 2])
  // Thresholds draw over the plot and the legend names them with their values.
  await expect(plot.locator('.recharts-reference-line')).toHaveCount(3)
  const legend = page.getByRole('list', { name: 'Pipeline activity series' })
  await expect(legend.locator('.surf-chart-legend-reference')).toHaveText([
    'Warning 70 °C',
    'Limit 85 °C',
  ])
  // Keys step through measurements by their own labels.
  const chart = page.getByRole('application', { name: 'Pipeline activity' })
  await chart.focus()
  await chart.press('ArrowRight')
  await expect(page.locator('.surf-chart-readout')).toContainText(
    'October 17, 2026, 00:10',
  )
})
test('x references mark events and periods where they happened, and inspecting a row names them', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 1000 })
  await open(page)
  const plot = page.locator('.surf-chart-plot')
  const legend = page.getByRole('list', { name: 'Pipeline activity series' })
  const chart = page.getByRole('application', { name: 'Pipeline activity' })
  const readout = page.locator('.surf-chart-readout')
  // On a category axis an event names the datum it falls on.
  await choose(page, 'Chart data', 'Latency far from zero')
  await expect(legend.locator('.surf-chart-legend-reference')).toHaveText([
    'Cache on October 4, 2026',
  ])
  await expect(plot.locator('.recharts-reference-line')).toHaveCount(2)
  await chart.focus()
  for (let step = 0; step < 3; step++) await chart.press('ArrowRight')
  await expect(readout).toContainText('October 4, 2026')
  await expect(readout).toContainText('Cache on')
  // On a time axis it sits at its time, and a period spans its two.
  await choose(page, 'Chart data', 'Disk used, hourly steps')
  await expect(legend.locator('.surf-chart-legend-reference')).toHaveText([
    'Model sync 5:00 AM',
    'Cleanup window 11:00 AM–1:00 PM',
  ])
  // The zero line and the event; the period is a band under the series.
  await expect(plot.locator('.recharts-reference-line')).toHaveCount(2)
  await expect(plot.locator('.recharts-reference-area')).toHaveCount(1)
  // Both sit at their times: 05:00 is five sixths of the way from midnight to 06:00.
  const geometry = await plot.evaluate((element) => {
    const ticks = [
      ...element.querySelectorAll('.recharts-xAxis-tick-labels text'),
    ].map((text) => Number(text.getAttribute('x')))
    const line = element.querySelectorAll<SVGLineElement>(
      '.recharts-reference-line-line',
    )[1]
    const band = (
      element.querySelector(
        '.recharts-reference-area path',
      ) as SVGGraphicsElement
    ).getBBox()
    // An SVGRect does not serialize, so its numbers come back on their own.
    return {
      ticks,
      line: Number(line.getAttribute('x1')),
      band: { x: band.x, width: band.width },
    }
  })
  const [midnight, six, noon] = geometry.ticks
  const hour = (six - midnight) / 6
  expect(Math.abs(geometry.line - (midnight + 5 * hour))).toBeLessThan(1)
  expect(Math.abs(geometry.band.x - (six + 5 * hour))).toBeLessThan(1)
  expect(
    Math.abs(geometry.band.x + geometry.band.width - (noon + hour)),
  ).toBeLessThan(1)
  // Inspecting 05:00 names the event; 12:00 is inside the period. The inspected
  // row carries over from the latency data, the fourth.
  await chart.focus()
  for (let step = 0; step < 2; step++) await chart.press('ArrowRight')
  await expect(readout).toContainText('October 17, 2026, 05:00')
  await expect(readout).toContainText('Model sync')
  await expect(page.locator('.surf-chart-tooltip')).toContainText('Model sync')
  await chart.press('ArrowRight')
  await expect(readout).not.toContainText('Model sync')
  for (let step = 0; step < 6; step++) await chart.press('ArrowRight')
  await expect(readout).toContainText('October 17, 2026, 12:00')
  await expect(readout).toContainText('Cleanup window')
  expect(
    (await new AxeBuilder({ page }).include('.surf-chart').analyze())
      .violations,
  ).toEqual([])
})
test('a gap shades which series leads, and a comparison series draws quieter and under', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 1000 })
  await open(page)
  await choose(page, 'Chart data', 'A basket against its benchmark')
  const plot = page.locator('.surf-chart-plot')
  const legend = page.getByRole('list', { name: 'Pipeline activity series' })
  await expect(legend.locator('.surf-chart-legend-reference')).toHaveText([
    'Base 100 pt',
    'Ahead of the benchmark',
    'Behind the benchmark',
  ])
  // Each side in its trend color; the basket leads, falls behind and leads again.
  const pieces = await plot
    .locator('.surf-chart-gap path')
    .evaluateAll((paths) =>
      paths.map((path) => [
        path.getAttribute('data-side'),
        path.getAttribute('fill'),
      ]),
    )
  expect(pieces.map(([side]) => side)).toEqual(['above', 'below', 'above'])
  for (const [side, fill] of pieces)
    expect(fill).toBe(
      side === 'above'
        ? 'var(--surf-trend-up-fg)'
        : 'var(--surf-trend-down-fg)',
    )
  // Where the lines cross, one side ends where the next begins.
  const ends = await plot.locator('.surf-chart-gap path').evaluateAll((paths) =>
    paths.map((path) => {
      const xs = (path.getAttribute('d') ?? '')
        .replace(/[MLZ]/g, ' ')
        .trim()
        .split(/\s+/)
        .map((pair) => Number(pair.split(',')[0]))
      return [Math.min(...xs), Math.max(...xs)]
    }),
  )
  expect(Math.abs(ends[0][1] - ends[1][0])).toBeLessThan(0.01)
  expect(Math.abs(ends[1][1] - ends[2][0])).toBeLessThan(0.01)
  // The benchmark is thinner, in muted ink, drawn first; the gap is under both.
  const order = await plot.evaluate((element) => {
    const lines = [...element.querySelectorAll('.recharts-line-curve')]
    const gap = element.querySelector('.surf-chart-gap')!
    return {
      lines: lines.map((line) => [
        line.getAttribute('stroke-width'),
        line.getAttribute('stroke'),
      ]),
      gapFirst: Boolean(
        gap.compareDocumentPosition(lines[0]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    }
  })
  expect(order.lines[0]).toEqual(['1.5', 'var(--surf-ink-muted)'])
  expect(order.lines[1][0]).toBe('2')
  expect(order.gapFirst).toBe(true)
  // Inspecting a row says which side it is on and by how much.
  const chart = page.getByRole('application', { name: 'Pipeline activity' })
  const readout = page.locator('.surf-chart-readout')
  await chart.focus()
  await expect(readout).toContainText('October 1, 2026')
  await expect(readout).not.toContainText('benchmark:')
  await chart.press('ArrowRight')
  await expect(readout).toContainText('Ahead of the benchmark: 1.9 pt')
  for (let step = 0; step < 8; step++) await chart.press('ArrowRight')
  await expect(readout).toContainText('October 10, 2026')
  await expect(readout).toContainText('Behind the benchmark: 6 pt')
  await expect(page.locator('.surf-chart-tooltip-gap')).toContainText(
    'Behind the benchmark',
  )
  // Hiding either series takes the gap and its legend away.
  await page.getByRole('button', { name: 'Benchmark series' }).click()
  await expect(plot.locator('.surf-chart-gap')).toHaveCount(0)
  await expect(legend.locator('.surf-chart-legend-reference')).toHaveText([
    'Base 100 pt',
  ])
  expect(
    (await new AxeBuilder({ page }).include('.surf-chart').analyze())
      .violations,
  ).toEqual([])
})
test('stacked bars read their total, a log axis spans decades and a step line holds its value', async ({
  page,
}) => {
  await open(page)
  await choose(page, 'Chart data', 'Tokens by kind, stacked')
  const chart = page.getByRole('application', { name: 'Pipeline activity' })
  await chart.focus()
  await chart.press('ArrowRight')
  await expect(page.locator('.surf-chart-readout')).toContainText(
    'Total: 9.4 M tokens',
  )
  await choose(page, 'Chart data', 'Prefill and decode, log scale')
  await expect(
    page.locator('.surf-chart-plot .recharts-yAxis-tick-labels text'),
  ).toHaveText(['10', '100', '1K', '10K'])
  await choose(page, 'Chart data', 'Disk used, hourly steps')
  const points = await page
    .locator('.surf-chart-plot .recharts-area-curve')
    .first()
    .evaluate((el) =>
      (el.getAttribute('d') ?? '')
        .replace(/[MLZ]/g, ' ')
        .trim()
        .split(/\s+/)
        .map((pair) => pair.split(',').map(Number)),
    )
  // Every segment is level or upright: the value holds until the next measurement.
  for (let index = 1; index < points.length; index++) {
    const [[x1, y1], [x2, y2]] = [points[index - 1], points[index]]
    expect(Math.abs(x1 - x2) < 0.01 || Math.abs(y1 - y2) < 0.01).toBe(true)
  }
})
test('a legend limit folds the remaining series into a popover that still toggles them', async ({
  page,
}) => {
  await open(page)
  await choose(page, 'Chart data', 'Twelve projects')
  const legend = page.getByRole('list', { name: 'Pipeline activity series' })
  await expect(legend.getByRole('button', { pressed: true })).toHaveCount(4)
  await legend.getByRole('button', { name: '8 more series' }).click()
  const project = page.getByRole('button', { name: 'Project L series' })
  await expect(project).toHaveAttribute('aria-pressed', 'true')
  await project.click()
  await expect(project).toHaveAttribute('aria-pressed', 'false')
  await expect(page.locator('.surf-chart-plot .recharts-line')).toHaveCount(11)
})
test("legendLimit='auto' keeps the legend on one line at any width", async ({
  page,
}) => {
  await open(page)
  await choose(page, 'Chart data', 'Twelve projects')
  await choose(page, 'Legend limit', 'One line')
  const legend = page.getByRole('list', { name: 'Pipeline activity series' })
  const lines = () =>
    legend.evaluate(
      (list) =>
        new Set(
          Array.from(list.children)
            .filter(
              (item) => !item.classList.contains('surf-chart-legend-reference'),
            )
            .map((item) => (item as HTMLElement).offsetTop),
        ).size,
    )
  const shown = () => legend.locator('[data-entry]').count()
  await expect(
    legend.getByRole('button', { name: /more series$/ }),
  ).toBeVisible()
  expect(await lines()).toBe(1)
  const wide = await shown()
  await page.setViewportSize({ width: 600, height: 900 })
  await expect.poll(lines).toBe(1)
  expect(await shown()).toBeLessThan(wide)
})
test('time ticks keep even steps at any width', async ({ page }) => {
  await page.goto('/patterns/dashboard')
  await waitForCatalogReady(page)
  const chart = page.locator('.surf-chart').first()
  const steps = () =>
    chart.locator('.recharts-xAxis-tick-labels text').evaluateAll((labels) => {
      const xs = labels.map(
        (label) =>
          label.getBoundingClientRect().x +
          label.getBoundingClientRect().width / 2,
      )
      return xs.slice(1).map((x, index) => Math.round(x - xs[index]))
    })
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    await expect
      .poll(async () => {
        const gaps = await steps()
        return gaps.length > 0 && Math.max(...gaps) - Math.min(...gaps) <= 2
      })
      .toBe(true)
  }
})
test('compact keeps the plot and legend and leaves the caption and readout to assistive technology', async ({
  page,
}) => {
  await open(page)
  const figure = page.locator('figure.surf-chart')
  // The table renders when it is first opened.
  await expect(figure.getByRole('table')).toHaveCount(0)
  await choose(page, 'Density', 'Compact')
  await expect(figure).toHaveAttribute('data-density', 'compact')
  await expect(
    page.getByRole('figure', { name: 'Pipeline activity' }),
  ).toBeVisible()
  for (const part of [
    '.surf-chart-caption',
    '.surf-chart-help',
    '.surf-chart-inspector',
  ])
    expect((await figure.locator(part).boundingBox())!.height, part).toBe(1)
  const button = figure.locator('.surf-chart-legend-button').first()
  expect((await button.boundingBox())!.height).toBe(24)
  await figure.getByText('View data table', { exact: true }).click()
  await expect(figure.getByRole('table')).toHaveCount(1)
})
test('right to left, the legend moves to the inline end of the key', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/charts/chart')
  await waitForCatalogReady(page)
  const chart = page.locator('main .surf-chart').first()
  const edges = () =>
    chart.evaluate((el) => {
      const key = el.querySelector('.surf-chart-key')!.getBoundingClientRect()
      const legend = el
        .querySelector('.surf-chart-legend')!
        .getBoundingClientRect()
      return {
        right: Math.round(key.right - legend.right),
        left: Math.round(legend.left - key.left),
      }
    })
  expect((await edges()).right).toBe(0)
  await chart.evaluate((el) => el.setAttribute('dir', 'rtl'))
  expect((await edges()).left).toBe(0)
})

test('a legend limit folds references with the series, and a plan is dashed in its series color', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await open(page)
  await choose(page, 'Chart data', 'GPU temperature over a day')
  const legend = page.getByRole('list', { name: 'Pipeline activity series' })
  await expect(legend.locator('.surf-chart-legend-reference')).toHaveCount(2)
  await choose(page, 'Legend limit', 'One line')
  await expect(legend.locator('.surf-chart-legend-reference')).toHaveCount(0)
  await expect(
    legend.getByRole('button', { name: /more in the legend$/ }),
  ).toBeVisible()
  await page.setViewportSize({ width: 1280, height: 900 })
  await choose(page, 'Chart data', 'Allocation against its targets')
  const lines = await page
    .locator('.surf-chart-plot .recharts-line-curve')
    .evaluateAll((paths) =>
      paths.map((path) => [
        path.getAttribute('stroke'),
        path.getAttribute('stroke-dasharray'),
      ]),
    )
  // Plans draw first, under their series: growth target, income target, growth, income.
  const [growthPlan, incomePlan, growth, income] = lines
  expect(growthPlan).toEqual([growth[0], '5 4'])
  expect(incomePlan).toEqual([income[0], '5 4'])
  expect(growth[1]).toBeNull()
  expect(income[1]).toBeNull()
})

test('a minimal chart keeps the marks, labels the high and low, and stays inspectable', async ({
  page,
}) => {
  await open(page)
  await page.getByRole('checkbox', { name: 'Minimal, for a card' }).click()
  await page.getByRole('checkbox', { name: 'Label the high and low' }).click()
  const chart = page.locator('figure.surf-chart')
  await expect(chart).toHaveAttribute('data-minimal', 'true')
  // No axes, grid, legend or markers on screen; the axis names stay for assistive
  // technology.
  await expect(chart.locator('.recharts-xAxis, .recharts-yAxis')).toHaveCount(0)
  await expect(chart.locator('.recharts-cartesian-grid')).toHaveCount(0)
  await expect(chart.locator('.surf-chart-legend')).toHaveCount(0)
  await expect(chart.locator('.recharts-line-dots *')).toHaveCount(0)
  expect(
    (await chart.locator('.surf-chart-key').boundingBox())!.width,
  ).toBeLessThanOrEqual(1)
  // The first series' highest value is labeled above its point, the lowest below.
  const labels = await chart
    .locator('.surf-chart-extreme-text')
    .evaluateAll((texts) =>
      texts.map((text) => ({
        text: text.textContent,
      })),
    )
  expect(labels.map((label) => label.text)).toEqual([
    expect.stringMatching(/^High [\d,.]+ · .+$/),
    expect.stringMatching(/^Low [\d,.]+ · .+$/),
  ])
  const dots = await chart
    .locator('.surf-chart-extreme-dot circle')
    .evaluateAll((marks) =>
      marks.map((mark) => {
        const box = mark.getBoundingClientRect()
        return box.top + box.height / 2
      }),
    )
  const boxes = await chart
    .locator('.surf-chart-extreme-box')
    .evaluateAll((rects) =>
      rects.map((rect) => {
        const box = rect.getBoundingClientRect()
        return { top: box.top, bottom: box.bottom }
      }),
    )
  expect(boxes[0].bottom).toBeLessThan(dots[0])
  expect(boxes[1].top).toBeGreaterThan(dots[1])
  // The readout still names each row by keyboard.
  await page.getByRole('application', { name: 'Pipeline activity' }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(
    page.getByRole('status', { name: 'Pipeline activity values' }),
  ).not.toContainText('Hover, touch')
})

test('breakAfter keeps closes on trading days one line, and a minimal chart shows its table disclosure on focus', async ({
  page,
}) => {
  await open(page)
  await choose(page, 'Chart data', 'Daily closes on trading days')
  // Weekends have no rows; four days of breakAfter carries the line over them.
  const curve = page.locator('figure.surf-chart .recharts-line-curve').first()
  await expect(curve).toBeVisible()
  expect(((await curve.getAttribute('d')) ?? '').match(/M/g)?.length).toBe(1)
  // Minimal keeps the disclosure off the card until keyboard focus reaches it.
  await page.getByRole('checkbox', { name: 'Minimal, for a card' }).click()
  const disclosure = page.locator('figure.surf-chart .surf-chart-table')
  expect((await disclosure.boundingBox())!.width).toBeLessThanOrEqual(1)
  await page.getByRole('application', { name: 'Pipeline activity' }).focus()
  await page.keyboard.press('Tab')
  await expect(disclosure.locator('summary')).toBeFocused()
  expect((await disclosure.boundingBox())!.width).toBeGreaterThan(40)
})

test('the data table disclosure is a full target on a phone, compact or not', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await open(page)
  const summary = page.locator('figure.surf-chart .surf-chart-table summary')
  expect((await summary.boundingBox())!.height).toBeGreaterThanOrEqual(44)
  await choose(page, 'Density', 'Compact')
  expect((await summary.boundingBox())!.height).toBeGreaterThanOrEqual(44)
})
