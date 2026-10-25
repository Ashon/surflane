import { test, expect, type Page } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'

// In forced colors the system palette replaces every token, so a selection drawn
// with --surf-selected alone would vanish. A selected, current or pressed control
// fills with Highlight and HighlightText instead, the way the system draws a
// selected item; the rest stay on Canvas.
test.use({ reducedMotion: 'reduce' })

const selections = [
  [
    '/components/toggle',
    '.surf-toggle[data-pressed]',
    '.surf-toggle:not([data-pressed])',
  ],
  [
    '/components/toggle-group',
    '.surf-toggle[data-pressed]',
    '.surf-toggle:not([data-pressed])',
  ],
  [
    '/components/toolbar',
    '.surf-toggle[aria-pressed="true"]',
    '.surf-toolbar-button:not(.surf-toggle)',
  ],
  [
    '/components/tabs',
    '.surf-tabs-tab[data-active]',
    '.surf-tabs-tab:not([data-active], [data-disabled])',
  ],
  [
    '/components/pagination',
    '.surf-pagination-control[aria-current="page"]',
    '.surf-pagination-control[href]:not([aria-current])',
  ],
  [
    '/patterns/app-shell',
    '.surf-app-shell-link[aria-current="page"]',
    '.surf-app-shell-link:not([aria-current])',
  ],
  [
    '/components/bottom-navigation',
    '.surf-bottom-nav-item[aria-current="page"] .surf-bottom-nav-icon',
    '.surf-bottom-nav-item:not([aria-current]) .surf-bottom-nav-icon',
  ],
  [
    '/components/tree',
    '.surf-tree-item[aria-selected="true"]',
    '.surf-tree-item:not([aria-selected="true"])',
  ],
] as const

for (const [route, selected, rest] of selections)
  test(`${route}: the selection fills with Highlight in forced colors`, async ({
    page,
  }) => {
    await page.emulateMedia({ forcedColors: 'active' })
    await page.goto(route)
    await waitForCatalogReady(page)
    // The tree starts with nothing selected.
    if (route === '/components/tree')
      await page.locator('main .surf-tree-item').first().click()
    await page.mouse.move(0, 0)
    const highlight = await probe(page, 'Highlight')
    const on = page.locator(`main ${selected}`).first(),
      off = page.locator(`main ${rest}`).first()
    expect(await inside(page, on), `${route} ${selected}`).toEqual(highlight)
    expect(await inside(page, off), `${route} ${rest}`).not.toEqual(highlight)
    expect(await label(on), `${route} ${selected}`).toEqual(true)
  })

test('CSS-only segments mark the current and checked choice in forced colors', async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: 'active' })
  await page.goto('/foundations/interaction')
  await waitForCatalogReady(page)
  await page.locator('main').evaluate((main) =>
    main.insertAdjacentHTML(
      'afterbegin',
      `<div data-test-segments>
        <nav class="surf-control-group" aria-label="View">
          <a class="surf-segment" href="#a" aria-current="page">Day</a>
          <a class="surf-segment" href="#b">Week</a>
        </nav>
        <div class="surf-control-group" role="radiogroup" aria-label="Range">
          <label><input type="radio" name="range" class="surf-visually-hidden" checked /><span class="surf-segment">1h</span></label>
          <label><input type="radio" name="range" class="surf-visually-hidden" /><span class="surf-segment">24h</span></label>
        </div>
      </div>`,
    ),
  )
  const highlight = await probe(page, 'Highlight')
  const segments = page.locator('[data-test-segments] .surf-segment')
  expect(await inside(page, segments.nth(0))).toEqual(highlight)
  expect(await inside(page, segments.nth(1))).not.toEqual(highlight)
  expect(await inside(page, segments.nth(2))).toEqual(highlight)
  expect(await inside(page, segments.nth(3))).not.toEqual(highlight)
  expect(await label(segments.nth(0))).toBe(true)
  expect(await label(segments.nth(2))).toBe(true)
})

// The label reads in HighlightText over the fill. Left to forced adjustment, the
// system would paint a Canvas backplate behind it, and HighlightText on Canvas
// can vanish, so the fill opts out and every text run inherits HighlightText.
function label(locator: ReturnType<Page['locator']>) {
  return locator.evaluate((el) => {
    const span = document.createElement('span')
    span.style.color = 'HighlightText'
    document.body.append(span)
    const text = getComputedStyle(span).color
    span.remove()
    if (getComputedStyle(el).forcedColorAdjust !== 'none') return false
    const runs = [el, ...el.querySelectorAll('*')].filter((node) =>
      [...node.childNodes].some(
        (child) => child.nodeType === 3 && child.textContent!.trim(),
      ),
    )
    return runs.every((node) => getComputedStyle(node).color === text)
  })
}

// The pixel a Highlight fill renders to over Canvas.
async function probe(page: Page, color: string) {
  await page.evaluate((color) => {
    const box = document.createElement('div')
    box.dataset.testProbe = ''
    box.style.cssText = `position:fixed;inset:0 auto auto 0;z-index:2147483647;width:12px;height:12px;background:${color}`
    document.body.append(box)
  }, color)
  const value = await pixel(page, 6, 6)
  await page.evaluate(() =>
    document.querySelector('[data-test-probe]')?.remove(),
  )
  return value
}
// A point inside the control's fill, clear of its label.
async function inside(page: Page, locator: ReturnType<Page['locator']>) {
  await locator.scrollIntoViewIfNeeded()
  const box = (await locator.boundingBox())!
  return pixel(page, Math.round(box.x + 4), Math.round(box.y + box.height / 2))
}
async function pixel(page: Page, x: number, y: number) {
  const png = await page.screenshot({ clip: { x, y, width: 1, height: 1 } })
  return page.evaluate(async (data) => {
    const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0))
    const image = await createImageBitmap(
      new Blob([bytes], { type: 'image/png' }),
    )
    const context = new OffscreenCanvas(1, 1).getContext('2d')!
    context.drawImage(image, 0, 0)
    return [...context.getImageData(0, 0, 1, 1).data.slice(0, 3)]
  }, png.toString('base64'))
}
