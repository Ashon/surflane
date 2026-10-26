import { waitForCatalogReady } from './catalog-ready'
import { test, expect, type Page } from '@playwright/test'
test.use({ reducedMotion: 'reduce' })

const open = async (page: Page) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await page.goto('/components/table')
  await waitForCatalogReady(page)
  await page
    .getByRole('checkbox', { name: 'Keep the first column in place' })
    .check()
  const root = page.locator('#preview .surf-scroll-root').first()
  return { root, viewport: root.locator('> .surf-scroll-viewport') }
}
const firstCells = (page: Page) =>
  page
    .locator('#preview .surf-table')
    .first()
    .evaluate((table) =>
      [...table.querySelectorAll('tr')].map((row) => {
        const [first, second] = [...row.children]
        return {
          first: Math.round(first.getBoundingClientRect().left),
          second: Math.round(second.getBoundingClientRect().left),
          line: getComputedStyle(first, '::after').opacity,
        }
      }),
    )

test('a sticky first column stays while the rest scrolls under it, and its edge stops fading', async ({
  page,
}) => {
  const { root, viewport } = await open(page)
  const before = await firstCells(page)
  expect(before.every((cell) => cell.line === '0')).toBe(true)
  await viewport.evaluate((element) => element.scrollBy(160, 0))
  await expect(root).toHaveAttribute('data-overflow-x-start')
  const after = await firstCells(page)
  // The first column holds its place; the second has moved under it.
  after.forEach((cell, index) => {
    expect(cell.first).toBe(before[index].first)
    expect(cell.second).toBeLessThan(before[index].second)
  })
  // Rows now pass under the column, so its edge shows a line, and the start edge
  // no longer fades: only the end that still hides content does.
  expect(after.every((cell) => cell.line === '1')).toBe(true)
  const mask = await viewport.evaluate(
    (element) => getComputedStyle(element).maskImage,
  )
  expect(mask).toContain('to left')
  expect(mask).not.toContain('to right')
})

test('the sticky column keeps a selection fill and covers what scrolls under it', async ({
  page,
}) => {
  const { viewport } = await open(page)
  const row = page
    .locator('#preview .surf-table-body > .surf-table-row')
    .first()
  await row.getByRole('checkbox').check()
  await viewport.evaluate((element) => element.scrollBy(160, 0))
  const fills = await row.evaluate((element) => {
    const probe = document.createElement('span')
    probe.style.backgroundColor = 'var(--surf-selected)'
    element.closest('.surf-table')!.parentElement!.append(probe)
    const selected = getComputedStyle(probe).backgroundColor
    probe.remove()
    const first = element.firstElementChild!
    return {
      selected: getComputedStyle(first).backgroundColor === selected,
      sticky: getComputedStyle(first).position,
    }
  })
  expect(fills).toEqual({ selected: true, sticky: 'sticky' })
  // An unselected row's first cell is opaque, so text never shows through it.
  const plain = await page
    .locator('#preview .surf-table-body > .surf-table-row')
    .nth(1)
    .evaluate(
      (element) => getComputedStyle(element.firstElementChild!).backgroundColor,
    )
  expect(plain).not.toBe('rgba(0, 0, 0, 0)')
})

test('fade turns an edge off for any scroller', async ({ page }) => {
  const { root, viewport } = await open(page)
  await page
    .getByRole('checkbox', { name: 'Keep the first column in place' })
    .uncheck()
  await viewport.evaluate((element) => element.scrollBy(160, 0))
  const mask = () =>
    viewport.evaluate((element) => getComputedStyle(element).maskImage)
  await expect(root).toHaveAttribute('data-overflow-x-start')
  await expect(root).toHaveAttribute('data-overflow-x-end')
  // Both edges hide content and both fade: one gradient, clear at either end.
  expect((await mask()).match(/rgba\(0, 0, 0, 0\)/g)).toHaveLength(2)
  await root.evaluate((element) => element.setAttribute('data-fade', 'start'))
  expect(await mask()).toMatch(
    /^linear-gradient\(to right, rgba\(0, 0, 0, 0\), rgb\(0, 0, 0\) 24px\)$/,
  )
  await root.evaluate((element) => element.setAttribute('data-fade', 'end'))
  expect(await mask()).toMatch(
    /^linear-gradient\(to left, rgba\(0, 0, 0, 0\), rgb\(0, 0, 0\) 24px\)$/,
  )
  await root.evaluate((element) => element.setAttribute('data-fade', 'none'))
  expect(await mask()).toBe('none')
})
