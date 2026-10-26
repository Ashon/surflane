import { waitForCatalogReady } from './catalog-ready'
import { test, expect, type Page } from '@playwright/test'
test.use({ reducedMotion: 'reduce' })

const open = async (page: Page) => {
  await page.goto('/components/segmented-control')
  await waitForCatalogReady(page)
  return {
    period: page.getByRole('group', { name: 'Period', exact: true }),
    side: page.getByRole('group', { name: 'Trade side', exact: true }),
    mood: page.getByRole('group', { name: 'Sentiment', exact: true }),
    line: page.locator('#preview p').filter({ hasText: 'Period ' }),
  }
}

test('one segment is always chosen; the keyboard moves focus and chooses', async ({
  page,
}) => {
  const { period, line } = await open(page)
  const month = period.getByRole('button', { name: '1M', exact: true })
  await expect(month).toHaveAttribute('aria-pressed', 'true')
  await expect(line).toHaveText('Period 1m, side buy, sentiment all.')
  // Pressing the chosen segment again keeps it.
  await month.click()
  await expect(month).toHaveAttribute('aria-pressed', 'true')
  await expect(line).toContainText('Period 1m,')
  // Arrows move focus without choosing; Enter chooses.
  await month.focus()
  await page.keyboard.press('ArrowRight')
  const year = period.getByRole('button', { name: '1Y', exact: true })
  await expect(year).toBeFocused()
  await expect(year).toHaveAttribute('aria-pressed', 'false')
  await page.keyboard.press('Enter')
  await expect(year).toHaveAttribute('aria-pressed', 'true')
  await expect(month).toHaveAttribute('aria-pressed', 'false')
  await expect(line).toContainText('Period 1y,')
  // One Tab stop for the whole group.
  await page.keyboard.press('Tab')
  expect(
    await period.evaluate((group) => group.contains(document.activeElement)),
  ).toBe(false)
})

test('with required={false}, pressing the chosen segment clears the choice', async ({
  page,
}) => {
  const { mood, line } = await open(page)
  const positive = mood.getByRole('button', { name: 'Positive 12' })
  await positive.click()
  await expect(positive).toHaveAttribute('aria-pressed', 'true')
  await expect(line).toContainText('sentiment positive.')
  await positive.click()
  await expect(mood.locator('[aria-pressed="true"]')).toHaveCount(0)
  await expect(line).toContainText('sentiment all.')
})

test('fill shares the width; the chosen segment takes the selected fill, Highlight in forced colors', async ({
  page,
}) => {
  const { side } = await open(page)
  const widths = await side.evaluate((track) => ({
    track: Math.round(track.getBoundingClientRect().width),
    parent: Math.round(track.parentElement!.getBoundingClientRect().width),
    segments: [...track.children].map((segment) =>
      Math.round(segment.getBoundingClientRect().width),
    ),
  }))
  expect(widths.track).toBe(widths.parent)
  // A content-width track hugs its segments, even in a column that stretches.
  const hug = await page
    .getByRole('group', { name: 'Period', exact: true })
    .evaluate((track) => {
      const style = getComputedStyle(track)
      const inner = [...track.children].reduce(
        (sum, segment) => sum + segment.getBoundingClientRect().width,
        0,
      )
      const gaps = (track.children.length - 1) * parseFloat(style.columnGap)
      const frame =
        parseFloat(style.paddingInlineStart) +
        parseFloat(style.paddingInlineEnd) +
        parseFloat(style.borderInlineStartWidth) +
        parseFloat(style.borderInlineEndWidth)
      return Math.round(
        track.getBoundingClientRect().width - inner - gaps - frame,
      )
    })
  expect(hug).toBe(0)
  expect(widths.segments[0]).toBe(widths.segments[1])
  const fill = (forced: boolean) =>
    side
      .getByRole('button', { name: 'Buy', exact: true })
      .evaluate((segment, forced) => {
        const probe = document.createElement('span')
        probe.style.backgroundColor = forced
          ? 'Highlight'
          : 'var(--surf-selected)'
        document.body.append(probe)
        const expected = getComputedStyle(probe).backgroundColor
        probe.remove()
        return getComputedStyle(segment).backgroundColor === expected
      }, forced)
  expect(await fill(false)).toBe(true)
  await page.emulateMedia({ forcedColors: 'active' })
  expect(await fill(true)).toBe(true)
})
