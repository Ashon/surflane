import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })

const quality = 'Quality against news sentiment'

test('ScatterChart steps through points by keyboard and names each point, its group and quadrant', async ({
  page,
}) => {
  await page.goto('/components/scatter-chart')
  await waitForCatalogReady(page)
  const chart = page.getByRole('figure', { name: quality })
  const plot = chart.getByRole('application', { name: quality })
  const readout = chart.getByRole('status', { name: `${quality} values` })
  await expect(readout).toHaveText(
    'Hover, touch or use chart arrow keys to inspect a point.',
  )
  // Left to right: the first point is the lowest quality, the last the highest.
  await plot.focus()
  await page.keyboard.press('ArrowRight')
  await expect(readout).toContainText('Cobalt Chemical')
  await expect(readout).toContainText('Quality score: 2.8')
  await expect(readout).toContainText('Group: Aligned')
  await expect(readout).toContainText('Quadrant: Weak and disliked')
  await page.keyboard.press('End')
  await expect(readout).toContainText('Northwind Chips')
  await page.keyboard.press('ArrowLeft')
  await expect(readout).toContainText('Vertex Software')
  await expect(readout).toContainText('Quadrant: Strong and liked')
  // The point is ringed and its values float beside it, out of the tree.
  await expect(chart.locator('.surf-scatter-active')).toHaveCount(1)
  const floating = chart.locator('.surf-chart-tooltip')
  await expect(floating).toHaveAttribute('aria-hidden', 'true')
  await expect(floating).toContainText('Vertex Software')
  await page.keyboard.press('Home')
  await expect(readout).toContainText('Cobalt Chemical')
  await page.keyboard.press('Escape')
  await expect(readout).toHaveText(
    'Hover, touch or use chart arrow keys to inspect a point.',
  )
  await expect(chart.locator('.surf-scatter-active')).toHaveCount(0)
  // Groups are told apart by marker as well as hue; the quadrants are named.
  const legend = chart.getByRole('list', { name: `${quality} legend` })
  await expect(legend.getByRole('listitem')).toHaveText([
    'Aligned',
    'Diverged',
    'Quality midpoint 5',
    'Sentiment midpoint 5',
  ])
  await expect(chart.locator('.surf-scatter-quadrant')).toHaveText([
    'Weak but liked',
    'Strong and liked',
    'Weak and disliked',
    'Strong but disliked',
  ])
  const markers = await chart
    .locator('.surf-scatter-point')
    .evaluateAll((points) =>
      points.map((point) => point.lastElementChild!.tagName),
    )
  expect(new Set(markers)).toEqual(new Set(['circle', 'rect']))
})

test('ScatterChart follows the pointer and its table lists every point', async ({
  page,
}) => {
  await page.goto('/components/scatter-chart')
  await waitForCatalogReady(page)
  const chart = page.getByRole('figure', { name: quality })
  const readout = chart.getByRole('status', { name: `${quality} values` })
  await chart.locator('.surf-scatter-point').first().hover()
  await expect(readout).not.toContainText('Hover, touch')
  await page.mouse.move(0, 0)
  await expect(readout).toContainText('Hover, touch')
  await chart.getByText('View data table').click()
  const table = chart.getByRole('table')
  await expect(table.getByRole('row')).toHaveCount(11)
  await expect(table.getByRole('row').nth(1)).toHaveText(
    /Northwind Chips\s*8\.2\s*7\.1\s*Aligned\s*Strong and liked/,
  )
  // Units follow the axis names; the latency target is a caution line.
  const serving = page.getByRole('figure', {
    name: 'Latency against throughput by model',
  })
  await expect(serving.locator('.surf-chart-x-label')).toHaveText(
    'Throughput (tokens/s)',
  )
  await expect(serving.getByRole('listitem')).toHaveText([
    'Latency target 800 ms',
  ])
})

for (const theme of ['light', 'dark'])
  test(`ScatterChart passes automated accessibility in ${theme}`, async ({
    page,
  }) => {
    await page.goto('/components/scatter-chart')
    await waitForCatalogReady(page)
    if (theme === 'dark')
      await page.getByRole('button', { name: 'Toggle theme' }).click()
    const { violations } = await new AxeBuilder({ page })
      .include('[data-preview-size]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    expect(violations).toEqual([])
  })
