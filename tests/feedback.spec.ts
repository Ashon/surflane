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
  await expect(page.locator('.surf-gauge-value')).toHaveText(
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
  const geometry = await meter.locator('.surf-gauge-track').evaluate((el) => {
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
    await expect(page.locator('.surf-skeleton')).toHaveCount(0)
    await page.getByRole('button', { name: 'Reload preview' }).click()
    await expect(region).toHaveAttribute('aria-busy', 'true')
    if (id === 'skeleton')
      await expect(page.locator('.surf-skeleton').first()).toHaveAttribute(
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
      '.surf-spinner > svg',
      '.surf-skeleton',
      '.surf-gauge-indicator',
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
  const indicator = page.locator('.surf-gauge-indicator')
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
  await expect(page.locator('.surf-gauge-value')).toHaveText(
    'Waiting for worker',
  )
})
test('Skeleton shows on a light canvas through its own tokens', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/components/skeleton')
  await waitForCatalogReady(page)
  const shades = await page
    .locator('.surf-skeleton')
    .first()
    .evaluate((skeleton) => {
      const probe = (token: string) => {
        const element = document.createElement('i')
        element.style.backgroundColor = `var(${token})`
        skeleton.parentElement!.append(element)
        const color = getComputedStyle(element).backgroundColor
        element.remove()
        return color
      }
      return {
        own: getComputedStyle(skeleton).backgroundColor,
        base: probe('--surf-skeleton-base'),
        surface: probe('--surf-surface'),
      }
    })
  // --surf-surface is about 1.07:1 on a light canvas; the skeleton tokens stay visible.
  expect(shades.own).toBe(shades.base)
  expect(shades.own).not.toBe(shades.surface)
})

test('Skeleton lines sit beside a circle, the last one short', async ({
  page,
}) => {
  await page.goto('/components/skeleton')
  await waitForCatalogReady(page)
  const lines = page.locator('.surf-skeleton-lines').first()
  const circle = page.locator('.surf-skeleton[data-shape="circle"]').first()
  const [area, mark] = await Promise.all([
    lines.boundingBox(),
    circle.boundingBox(),
  ])
  expect(area!.x).toBeGreaterThan(mark!.x + mark!.width)
  expect(area!.y).toBeLessThan(mark!.y + mark!.height)
  const widths = await lines
    .locator('.surf-skeleton')
    .evaluateAll((items) =>
      items.map((item) => item.getBoundingClientRect().width),
    )
  expect(widths).toHaveLength(2)
  expect(widths[1] / widths[0]).toBeCloseTo(0.6, 2)
})
test('Meter turns its fill by range and marks a target and ticks named for assistive technology', async ({
  page,
}) => {
  await page.goto('/components/meter')
  await waitForCatalogReady(page)
  const memory = page.getByRole('meter', { name: 'Memory allocation' })
  const fill = memory.locator('.surf-gauge-indicator')
  const colorOf = (token: string) =>
    page.evaluate((name) => {
      const probe = document.createElement('span')
      probe.style.color = `var(${name})`
      document.body.append(probe)
      const color = getComputedStyle(probe).color
      probe.remove()
      return color
    }, token)
  // Lower is better: 30 of 64 GiB is in the best range and keeps the plain fill.
  await expect(memory).toHaveAttribute('data-tone', 'optimum')
  await expect(fill).toHaveCSS(
    'background-color',
    await colorOf('--surf-ink-body'),
  )
  const allocate = page.getByRole('button', { name: 'Allocate 8 GiB' })
  await allocate.click()
  await allocate.click()
  await expect(memory).toHaveAttribute('aria-valuenow', '46')
  await expect(memory).toHaveAttribute('data-tone', 'caution')
  await expect(fill).toHaveCSS(
    'background-color',
    await colorOf('--surf-status-caution-fg'),
  )
  await allocate.click()
  await allocate.click()
  await expect(memory).toHaveAttribute('aria-valuenow', '62')
  await expect(memory).toHaveAttribute('data-tone', 'danger')
  await expect(fill).toHaveCSS(
    'background-color',
    await colorOf('--surf-status-danger-fg'),
  )
  // A target crosses the track at 40% and is named in the description.
  const bonds = page.getByRole('meter', { name: 'Bonds in the portfolio' })
  await expect(bonds).toHaveAccessibleDescription('Target 40%')
  const marks = await bonds.locator('.surf-gauge-track').evaluate((track) => {
    const box = track.getBoundingClientRect()
    const at = (element: Element) => {
      const mark = element.getBoundingClientRect()
      return (mark.left + mark.width / 2 - box.left) / box.width
    }
    const target = track.querySelector('.surf-meter-target')!
    const targetBox = target.getBoundingClientRect()
    return {
      target: at(target),
      reaches: targetBox.top < box.top && targetBox.bottom > box.bottom,
      ticks: [...track.querySelectorAll('.surf-meter-tick')].map((tick) => ({
        at: at(tick),
        below: tick.getBoundingClientRect().top >= box.bottom,
      })),
    }
  })
  expect(marks.target).toBeCloseTo(0.4, 2)
  expect(marks.reaches).toBe(true)
  expect(marks.ticks.map((tick) => Number(tick.at.toFixed(2)))).toEqual([
    0.25, 0.5, 0.75,
  ])
  expect(marks.ticks.every((tick) => tick.below)).toBe(true)
  // Right to left, the marks measure from the logical start too.
  await page.evaluate(() => (document.documentElement.dir = 'rtl'))
  const mirrored = await bonds
    .locator('.surf-gauge-track')
    .evaluate((track) => {
      const box = track.getBoundingClientRect()
      const mark = track
        .querySelector('.surf-meter-target')!
        .getBoundingClientRect()
      return (box.right - (mark.left + mark.width / 2)) / box.width
    })
  expect(mirrored).toBeCloseTo(0.4, 2)
  await page.evaluate(() => (document.documentElement.dir = 'ltr'))
  expect(
    (await new AxeBuilder({ page }).include('.surf-meter').analyze())
      .violations,
  ).toEqual([])
})
test('Meter.Arc draws the meter as a half circle in its ranges, with a needle at its value', async ({
  page,
}) => {
  await page.goto('/components/meter')
  await waitForCatalogReady(page)
  const strokeOf = (token: string) =>
    page.evaluate((name) => {
      const probe = document.createElement('span')
      probe.style.color = `var(${name})`
      document.body.append(probe)
      const color = getComputedStyle(probe).color
      probe.remove()
      return color
    }, token)
  const read = (name: string) =>
    page
      .getByRole('meter', { name, exact: true })
      .locator('svg.surf-meter-arc')
      .evaluate((svg) => {
        const needle = svg.querySelector('line')!
        const [x1, y1, x2, y2] = ['x1', 'y1', 'x2', 'y2'].map((key) =>
          Number(needle.getAttribute(key)),
        )
        return {
          hidden: svg.getAttribute('aria-hidden'),
          zones: [...svg.querySelectorAll('path')].map((zone) => ({
            tone: zone.getAttribute('data-tone'),
            length: (zone as SVGPathElement).getTotalLength(),
            stroke: getComputedStyle(zone).stroke,
          })),
          // The needle's angle from the left end, as a share of the half circle.
          at: 1 - Math.atan2(y1 - y2, x2 - x1) / Math.PI,
        }
      })
  const fear = await read('Market fear, 24-hour average')
  expect(fear.hidden).toBe('true')
  // Higher is calmer: danger, then caution, then the best range.
  expect(fear.zones.map((zone) => zone.tone)).toEqual([
    'danger',
    'caution',
    'optimum',
  ])
  // 4.4 to 5.1 is too narrow for a band: a dot keeps the thresholds in place.
  expect(fear.zones[1].length).toBeLessThan(1)
  expect(fear.zones[0].length).toBeGreaterThan(20)
  expect(fear.zones.map((zone) => zone.stroke)).toEqual([
    await strokeOf('--surf-status-danger-border'),
    await strokeOf('--surf-status-caution-border'),
    await strokeOf('--surf-status-success-border'),
  ])
  expect(fear.at).toBeCloseTo(0.48, 2)
  await expect(
    page.getByRole('meter', { name: 'Market fear, 24-hour average' }),
  ).toHaveAttribute('aria-valuetext', '4.8, conditional defense')
  // Lower is calmer: the best range comes first.
  const vix = await read('VIX volatility index')
  expect(vix.zones.map((zone) => zone.tone)).toEqual([
    'optimum',
    'caution',
    'danger',
  ])
  expect(vix.at).toBeCloseTo((17.2 - 10) / 30, 2)
  // Right to left, the half circle mirrors so the minimum sits at the right.
  await page.evaluate(() => (document.documentElement.dir = 'rtl'))
  await expect(
    page
      .getByRole('meter', { name: 'VIX volatility index' })
      .locator('svg.surf-meter-arc'),
  ).toHaveCSS('scale', '-1 1')
})
