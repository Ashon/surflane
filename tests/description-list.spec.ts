import { waitForCatalogReady } from './catalog-ready'
import { test, expect, type Page } from '@playwright/test'
test.use({ reducedMotion: 'reduce' })

const open = async (
  page: Page,
  width = 1440,
  path = '/components/description-list',
) => {
  await page.setViewportSize({ width, height: 1000 })
  await page.goto(path)
  await waitForCatalogReady(page)
  return page.locator('#preview .surf-description-list')
}
const boxes = (page: Page) =>
  page.locator('#preview .surf-description-list-item').evaluateAll((items) =>
    items.map((item) => {
      const box = (element: Element) => element.getBoundingClientRect()
      const term = box(item.querySelector('dt')!)
      const value = box(item.querySelector('dd')!)
      return {
        height: box(item).height,
        left: box(item).left,
        term: {
          top: term.top,
          bottom: term.bottom,
          left: term.left,
          right: term.right,
        },
        value: {
          top: value.top,
          bottom: value.bottom,
          left: value.left,
          right: value.right,
        },
      }
    }),
  )

test('a description list is a native dl whose rows are as tall as a menu row, copy actions included', async ({
  page,
}) => {
  const list = await open(page)
  await expect(list).toHaveJSProperty('tagName', 'DL')
  await expect(list.locator(':scope > div > dt + dd')).toHaveCount(6)
  // Terms in muted ink, values in ink, and the empty value named in muted ink.
  const inks = await list.evaluate((dl) => {
    const color = (token: string) => {
      const probe = document.createElement('span')
      probe.style.color = `var(${token})`
      dl.append(probe)
      const value = getComputedStyle(probe).color
      probe.remove()
      return value
    }
    const style = (selector: string) =>
      getComputedStyle(dl.querySelector(selector)!).color
    return {
      term: style('dt') === color('--surf-ink-muted'),
      value: style('dd:not([data-empty])') === color('--surf-ink'),
      empty: style('dd[data-empty]') === color('--surf-ink-muted'),
    }
  })
  expect(inks).toEqual({ term: true, value: true, empty: true })
  await expect(list.locator('dd[data-empty]')).toHaveText('Not set')
  // Every one-line row is 36px, the default menu row, with or without a copy action.
  const rows = await boxes(page)
  expect(rows.map((row) => Math.round(row.height))).toEqual([
    36, 36, 36, 36, 36, 36,
  ])
  // Inline: each value sits beside its term, on one line with it.
  for (const row of rows) {
    expect(row.value.left).toBeGreaterThan(row.term.right)
    expect(Math.abs(row.value.top - row.term.top)).toBeLessThan(8)
  }
  // Two columns where both fit.
  expect(new Set(rows.map((row) => Math.round(row.left))).size).toBe(2)
})

test('a cut value keeps the whole value, and the copy action copies it and names its term', async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== 'chromium',
    'clipboard permissions are Chromium-only',
  )
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
  const list = await open(page)
  const image = list.locator('dd[data-truncate]')
  const text = image.locator('.surf-description-list-text')
  const full = (await text.textContent())!.trim()
  expect(full).toMatch(
    /^registry\.example\.com\/platform\/api@sha256:[0-9a-f]{64}$/,
  )
  await expect(text).toHaveAttribute('title', full)
  const cut = await text.evaluate((span) => ({
    overflow: span.scrollWidth > span.clientWidth,
    ellipsis: getComputedStyle(span).textOverflow,
  }))
  expect(cut).toEqual({ overflow: true, ellipsis: 'ellipsis' })
  const copy = image.getByRole('button')
  await expect(copy).toHaveAccessibleName('Copy')
  await expect(copy).toHaveAccessibleDescription('Image')
  // The icon-only action shows its label as a tooltip; the result is its name, said
  // in place, and the check icon in the success colour.
  await copy.hover()
  await expect(page.locator('.surf-tooltip')).toHaveText('Copy')
  await copy.click()
  await expect(copy).toHaveAccessibleName('Copied')
  await expect(copy).toHaveAttribute('data-copy-state', 'copied')
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(full)
  const cluster = list
    .getByRole('button', { name: 'Copy', exact: true })
    .first()
  await expect(cluster).toHaveAccessibleDescription('Cluster ID')
})

test('a narrow list moves values under their terms, stacked layout always does, and compact rows are small', async ({
  page,
}) => {
  let list = await open(page, 320)
  // One column, each value under its term, nothing wider than the page.
  let rows = await boxes(page)
  expect(new Set(rows.map((row) => Math.round(row.left))).size).toBe(1)
  for (const row of rows)
    expect(row.value.top).toBeGreaterThanOrEqual(row.term.bottom - 1)
  // A pair is set apart from the next by its own padding, 8px on each side.
  for (let index = 1; index < rows.length; index++)
    expect(
      rows[index].term.top - rows[index - 1].value.bottom,
    ).toBeGreaterThanOrEqual(15)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
  list = await open(page)
  await page.getByRole('combobox', { name: 'Layout', exact: true }).click()
  await page.getByRole('option', { name: 'Stacked', exact: true }).click()
  await expect(list).toHaveAttribute('data-layout', 'stacked')
  rows = await boxes(page)
  for (const row of rows) {
    expect(row.value.top).toBeGreaterThanOrEqual(row.term.bottom - 1)
    expect(Math.round(row.value.left)).toBe(Math.round(row.term.left))
  }
  await page.getByRole('combobox', { name: 'Layout', exact: true }).click()
  await page.getByRole('option', { name: 'Inline', exact: true }).click()
  // Compact density: the small row, 32px, copy actions included.
  await page
    .getByRole('button', { name: 'Preview density: Compact', exact: true })
    .click()
  await expect
    .poll(async () => (await boxes(page)).map((row) => Math.round(row.height)))
    .toEqual([32, 32, 32, 32, 32, 32])
})

test('right to left, the term column is on the right; Korean names the empty value', async ({
  page,
}) => {
  const list = await open(page, 1440, '/ko/components/description-list')
  await expect(list.locator('dd[data-empty]')).toHaveText('설정 안 됨')
  await list.evaluate((dl) => dl.setAttribute('dir', 'rtl'))
  const rows = await boxes(page)
  for (const row of rows) expect(row.term.left).toBeGreaterThan(row.value.right)
})
