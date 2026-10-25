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

// Shadows vanish in forced colors, so every floating surface keeps a drawn edge
// or, for the tooltip, an inverted fill.
const popups: [string, string, (page: Page) => Promise<unknown>][] = [
  [
    '/components/menu',
    '.surf-menu',
    (p) => p.getByRole('button', { name: 'Open actions' }).click(),
  ],
  [
    '/components/select',
    '.surf-select-popup',
    (p) =>
      p.getByRole('combobox', { name: 'Environment', exact: true }).click(),
  ],
  [
    '/components/combobox',
    '.surf-combobox-popup',
    async (p) => {
      await p.getByRole('combobox', { name: 'Target environment' }).focus()
      await p.keyboard.press('ArrowDown')
    },
  ],
  [
    '/components/popover',
    '.surf-popover',
    (p) => p.getByRole('button', { name: 'Inspect account' }).click(),
  ],
  [
    '/components/dialog',
    '.surf-dialog-popup',
    (p) => p.getByRole('button', { name: 'Open deployment plan' }).click(),
  ],
  [
    '/components/toast',
    '.surf-toast',
    (p) => p.getByRole('button', { name: 'Show success', exact: true }).click(),
  ],
]
for (const [route, selector, open] of popups)
  test(`${route}: the popup keeps an edge in forced colors`, async ({
    page,
  }) => {
    await page.emulateMedia({ forcedColors: 'active' })
    await page.goto(route)
    await waitForCatalogReady(page)
    await open(page)
    const popup = page.locator(selector).first()
    await expect(popup).toBeVisible()
    await expect(popup).toHaveCSS('border-top-style', 'solid')
    expect(
      parseFloat(
        await popup.evaluate((el) => getComputedStyle(el).borderTopWidth),
      ),
    ).toBeGreaterThanOrEqual(1)
  })

test('the tooltip inverts in forced colors', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' })
  await page.goto('/components/tooltip')
  await waitForCatalogReady(page)
  await page.getByRole('button', { name: 'Inspect logs' }).focus()
  const tooltip = page.locator('.surf-tooltip')
  await expect(tooltip).toBeVisible()
  const highlight = await probe(page, 'CanvasText')
  expect(await inside(page, tooltip)).toEqual(highlight)
})

test('a highlighted menu item draws an outline in forced colors', async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: 'active' })
  await page.goto('/components/menu')
  await waitForCatalogReady(page)
  await page.getByRole('button', { name: 'Open actions' }).focus()
  await page.keyboard.press('Enter')
  const item = page.getByRole('menuitem', { name: 'Inspect' })
  await expect(item).toBeFocused()
  await expect(item).toHaveCSS('outline-style', 'solid')
  await expect(
    page.getByRole('menuitem', { name: 'Export preview' }),
  ).toHaveCSS('outline-style', 'none')
})

test('checked choices fill with Highlight and the slider fills its range in forced colors', async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: 'active' })
  await page.goto('/components/checkbox')
  await waitForCatalogReady(page)
  const highlight = await probe(page, 'Highlight')
  const checked = page.locator('main .surf-checkbox[data-checked]').first(),
    unchecked = page
      .locator('main .surf-checkbox:not([data-checked], [data-indeterminate])')
      .first()
  // Above the check mark, inside the box.
  const top = async (box: ReturnType<Page['locator']>) => {
    await box.scrollIntoViewIfNeeded()
    const rect = (await box.boundingBox())!
    return pixel(
      page,
      Math.round(rect.x + rect.width / 2),
      Math.round(rect.y + 3),
    )
  }
  expect(await top(checked)).toEqual(highlight)
  expect(await top(unchecked)).not.toEqual(highlight)
  await page.goto('/components/slider')
  await waitForCatalogReady(page)
  // The range takes Highlight over a CanvasText track.
  const system = (color: string) =>
    page.evaluate((color) => {
      const span = document.createElement('span')
      span.style.backgroundColor = color
      document.body.append(span)
      const value = getComputedStyle(span).backgroundColor
      span.remove()
      return value
    }, color)
  await expect(page.locator('main .surf-slider-indicator').first()).toHaveCSS(
    'background-color',
    await system('Highlight'),
  )
  await expect(page.locator('main .surf-slider-track').first()).toHaveCSS(
    'background-color',
    await system('CanvasText'),
  )
})
