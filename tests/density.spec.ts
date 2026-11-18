import { test, expect, type Page } from '@playwright/test'
import { components, itemHref, patterns } from '../demo/catalog'
import { waitForCatalogReady } from './catalog-ready'

// Compact density packs a screen: it may keep a part as it is, never make it
// larger. Every part's padding, gaps, text, minimum height and height are
// measured in both densities. A scrollbar thumb is left out: its length follows
// the content, which compact shortens. So is the height of a part that fills the
// room a column leaves, such as a sidebar's menu, and of what fills it: it takes
// what the rows around it give up.
test.use({ reducedMotion: 'reduce' })

const metrics = [
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'row-gap',
  'column-gap',
  'font-size',
  'line-height',
  'min-height',
  'height',
] as const

function measure(page: Page, root: string) {
  return page.evaluate(
    ({ root, metrics }) => {
      const frame = document.querySelector(root)!
      const fills = (el: HTMLElement) => {
        for (
          let node: HTMLElement | null = el;
          node && node !== frame;
          node = node.parentElement
        ) {
          const parent = node.parentElement
          if (
            parent &&
            parseFloat(getComputedStyle(node).flexGrow) > 0 &&
            getComputedStyle(parent).display.endsWith('flex') &&
            getComputedStyle(parent).flexDirection.startsWith('column')
          )
            return (
              Math.abs(
                node.getBoundingClientRect().height -
                  el.getBoundingClientRect().height,
              ) < 0.5
            )
        }
        return false
      }
      const seen = new Map<string, number>()
      const found: Record<string, number[]> = {}
      for (const el of frame.querySelectorAll<HTMLElement>(
        '[class*="surf-"]:not(.surf-scroll-thumb)',
      )) {
        const name = [...el.classList]
          .filter((c) => c.startsWith('surf-'))
          .join('.')
        const index = seen.get(name) ?? 0
        seen.set(name, index + 1)
        const style = getComputedStyle(el)
        found[`${name}#${index}`] = metrics.map((metric) =>
          metric === 'height'
            ? fills(el)
              ? 0
              : el.getBoundingClientRect().height
            : style.getPropertyValue(metric).endsWith('px')
              ? parseFloat(style.getPropertyValue(metric))
              : 0,
        )
      }
      return found
    },
    { root, metrics },
  )
}
function larger(
  before: Record<string, number[]>,
  after: Record<string, number[]>,
) {
  return Object.entries(after).flatMap(([part, values]) =>
    values.flatMap((value, i) =>
      before[part] && value > before[part][i] + 0.5
        ? [`${part} ${metrics[i]} ${before[part][i]} → ${value}`]
        : [],
    ),
  )
}

// Components switch density through the preview, as a reader does: SizeProvider
// density, which tables, charts and layout parts follow.
for (const item of components.filter((item) => item.stage !== 'planned'))
  test(`${itemHref(item)}: compact makes nothing larger`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto(itemHref(item))
    await waitForCatalogReady(page)
    // A web font that swaps in after the first paint changes line heights, so
    // measure only once every font is in.
    await page.evaluate(() => document.fonts.ready)
    const before = await measure(page, '[data-preview-size]')
    const compact = page.getByRole('button', {
      name: 'Preview density: Compact',
    })
    await compact.click()
    await expect(compact).toHaveAttribute('aria-pressed', 'true')
    const after = await measure(page, '[data-preview-size]')
    expect(larger(before, after)).toEqual([])
  })

// Patterns have no density switch, so their preview takes the compact attribute
// that the stylesheets read.
for (const item of patterns)
  test(`/patterns/${item.id}: compact styles make nothing larger`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto(`/patterns/${item.id}`)
    await waitForCatalogReady(page)
    const root = '#preview'
    test.skip(!(await page.locator(root).count()), 'no live preview')
    // A web font that swaps in after the first paint changes line heights, so
    // measure only once every font is in.
    await page.evaluate(() => document.fonts.ready)
    const before = await measure(page, root)
    await page
      .locator(root)
      .evaluate((el) => el.setAttribute('data-ui-density', 'compact'))
    const after = await measure(page, root)
    expect(larger(before, after)).toEqual([])
  })

// One region, one density: a default scope inside a compact region restores every
// default, whatever the order of the rules that set them. The catalog's default
// preview is a SizeProvider with density='default', so a copy of it inside a
// compact region measures as the preview does.
for (const item of components.filter((item) => item.stage !== 'planned'))
  test(`${itemHref(item)}: default inside compact restores the defaults`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto(itemHref(item))
    await waitForCatalogReady(page)
    await page.evaluate(() => document.fonts.ready)
    const before = await measure(page, '[data-preview-size]')
    await page.evaluate(() => {
      const frame = document.querySelector<HTMLElement>('[data-preview-size]')!
      const region = document.createElement('div')
      region.setAttribute('data-ui-density', 'compact')
      region.style.display = 'contents'
      const copy = frame.cloneNode(true) as HTMLElement
      copy.removeAttribute('data-preview-size')
      copy.setAttribute('data-density-copy', '')
      region.append(copy)
      frame.style.display = 'none'
      frame.after(region)
    })
    const after = await measure(page, '[data-density-copy]')
    const differ = Object.entries(after).flatMap(([part, values]) =>
      values.flatMap((value, i) =>
        before[part] && Math.abs(value - before[part][i]) > 0.5
          ? [`${part} ${metrics[i]} ${before[part][i]} → ${value}`]
          : [],
      ),
    )
    expect(differ).toEqual([])
  })

// A popup renders in a portal, outside the region, so it carries the density
// itself: opened from a compact preview, its rows take the compact row and its
// surface the compact padding.
test('a popup opened in a compact region is compact', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  const compact = async (path: string) => {
    await page.goto(path)
    await waitForCatalogReady(page)
    const toggle = page.getByRole('button', {
      name: 'Preview density: Compact',
    })
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  }
  await compact('/components/menu')
  await page.locator('[data-preview-size] .surf-menu-trigger').first().click()
  const menu = page.getByRole('menu').first()
  await expect(menu).toBeVisible()
  await expect(
    page.locator('.surf-positioner[data-ui-density="compact"]').first(),
  ).toBeAttached()
  const item = menu.getByRole('menuitem').first()
  expect((await item.boundingBox())!.height).toBe(32)

  await compact('/components/dialog')
  await page.locator('[data-preview-size] button').last().click()
  const dialog = page.getByRole('dialog').first()
  await expect(dialog).toBeVisible()
  await expect(dialog).toHaveAttribute('data-ui-density', 'compact')
  const body = dialog.locator('.surf-dialog-body').first()
  if (await body.count())
    expect(await body.evaluate((el) => getComputedStyle(el).paddingLeft)).toBe(
      '12px',
    )
})
