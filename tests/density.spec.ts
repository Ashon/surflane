import { test, expect, type Page } from '@playwright/test'
import { components, patterns } from '../demo/catalog'
import { waitForCatalogReady } from './catalog-ready'

// Compact density packs a screen: it may keep a part as it is, never make it
// larger. Every part's padding, gaps, text, minimum height and height are
// measured in both densities. A scrollbar thumb is left out: its length follows
// the content, which compact shortens.
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
            ? el.getBoundingClientRect().height
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
  test(`/components/${item.id}: compact makes nothing larger`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto(`/components/${item.id}`)
    await waitForCatalogReady(page)
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
    const before = await measure(page, root)
    await page
      .locator(root)
      .evaluate((el) => el.setAttribute('data-ui-density', 'compact'))
    const after = await measure(page, root)
    expect(larger(before, after)).toEqual([])
  })
