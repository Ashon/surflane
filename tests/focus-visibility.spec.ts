import { test, expect, type Locator, type Page } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'

// Buttons and choices draw the shared 2px ring for keyboard focus only; a select
// trigger draws the field halo, also for keyboard focus only. Text fields halo on
// any focus, so they are not here. Wherever it is drawn, nothing clips it.
test.use({ reducedMotion: 'reduce' })

type Target = {
  find: (page: Page) => Locator
  // Where the ring is drawn, when it is not on the focused element itself.
  ring?: (page: Page) => Locator
}
const targets: [string, Target][] = [
  [
    '/components/button',
    { find: (p) => p.getByRole('button', { name: 'Run preview' }) },
  ],
  [
    '/components/checkbox',
    {
      find: (p) =>
        p.getByRole('checkbox', { name: 'Clean up temporary accounts' }),
    },
  ],
  ['/components/switch', { find: (p) => p.locator('main [role="switch"]') }],
  [
    '/components/radio-group',
    { find: (p) => p.locator('main [role="radio"][aria-checked="true"]') },
  ],
  ['/components/toggle', { find: (p) => p.locator('main .surf-toggle') }],
  [
    '/components/tabs',
    { find: (p) => p.locator('main [role="tab"][aria-selected="true"]') },
  ],
  [
    '/components/select',
    {
      find: (p) =>
        p.getByRole('combobox', { name: 'Environment', exact: true }),
    },
  ],
  [
    '/components/slider',
    {
      find: (p) => p.getByRole('slider', { name: 'Parallel workers' }),
      ring: (p) => p.locator('main .surf-slider-thumb:has(input)'),
    },
  ],
  [
    '/components/tree',
    { find: (p) => p.locator('main [role="treeitem"][tabindex="0"]') },
  ],
  [
    '/components/accordion',
    { find: (p) => p.locator('main .surf-disclosure-trigger') },
  ],
  [
    '/components/pagination',
    { find: (p) => p.locator('main .surf-pagination-control[href]') },
  ],
  [
    '/components/chart',
    { find: (p) => p.locator('main .surf-chart-legend-button') },
  ],
  ['/', { find: (p) => p.getByRole('link', { name: 'Browse components' }) }],
]

for (const [route, { find, ring }] of targets)
  test(`${route}: keyboard focus draws the ring, a pointer press does not`, async ({
    page,
  }) => {
    await page.goto(route)
    await waitForCatalogReady(page)
    const target = find(page).first()
    const drawn = (ring?.(page) ?? find(page)).first()
    await target.scrollIntoViewIfNeeded()
    await byKeyboard(page, target)
    expect(await reach(drawn), `${route}: keyboard`).toBeGreaterThanOrEqual(2)
    expect(await unclipped(drawn), `${route}: ring inside every clip`).toBe(
      true,
    )
    // Arrive by pointer: press without releasing over the target, so nothing runs.
    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur())
    const box = (await drawn.boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    const pointer = await reach(drawn)
    await page.mouse.move(0, 0)
    await page.mouse.up()
    expect(pointer, `${route}: pointer`).toBe(0)
  })

// Focus arrives by Tab: step out and back in, so a roving widget returns to its
// own tab stop.
async function byKeyboard(page: Page, target: Locator) {
  await target.focus()
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Tab')
  await expect(target).toBeFocused()
}

// How far the focus indicator reaches past the element: a solid outline's width,
// or a halo's spread. 0 when neither shows.
function reach(locator: Locator) {
  return locator.evaluate((el) => {
    const style = getComputedStyle(el)
    let value =
      style.outlineStyle === 'solid' ? parseFloat(style.outlineWidth) : 0
    for (const shadow of style.boxShadow.split(/,(?![^(]*\))/))
      if (shadow !== 'none' && !shadow.includes('inset')) {
        const [, , blur = 0, spread = 0] = (
          shadow.match(/-?[\d.]+px/g) ?? []
        ).map(parseFloat)
        value = Math.max(value, blur + spread)
      }
    return value
  })
}

// The ring or halo, offset included, stays inside every ancestor that clips.
function unclipped(target: Locator) {
  return target.evaluate((el) => {
    const style = getComputedStyle(el)
    let reach =
      style.outlineStyle === 'none'
        ? 0
        : parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset)
    for (const shadow of style.boxShadow.split(/,(?![^(]*\))/))
      if (shadow !== 'none' && !shadow.includes('inset')) {
        const [, , blur = 0, spread = 0] = (
          shadow.match(/-?[\d.]+px/g) ?? []
        ).map(parseFloat)
        reach = Math.max(reach, blur + spread)
      }
    const rect = el.getBoundingClientRect()
    const ring = {
      left: rect.left - reach,
      right: rect.right + reach,
      top: rect.top - reach,
      bottom: rect.bottom + reach,
    }
    for (let node = el.parentElement; node; node = node.parentElement) {
      const s = getComputedStyle(node)
      if ([s.overflowX, s.overflowY].every((v) => v === 'visible')) continue
      const box = node.getBoundingClientRect()
      const inner = {
        left: box.left + node.clientLeft,
        top: box.top + node.clientTop,
        right: box.left + node.clientLeft + node.clientWidth,
        bottom: box.top + node.clientTop + node.clientHeight,
      }
      if (
        ring.left < inner.left - 0.5 ||
        ring.top < inner.top - 0.5 ||
        ring.right > inner.right + 0.5 ||
        ring.bottom > inner.bottom + 0.5
      )
        return false
    }
    return true
  })
}

// Focus rings inside scrolling or clipping containers move inside instead.
const clipped: [string, number, (page: Page) => Locator][] = [
  [
    '/components/otp-field',
    1440,
    (p) =>
      p
        .getByRole('group', { name: 'Verification code' })
        .locator('input')
        .first(),
  ],
  [
    '/components/table',
    320,
    (p) => p.locator('main .surf-table button').first(),
  ],
  [
    '/patterns/app-shell',
    1440,
    (p) => p.locator('main .surf-app-shell-link').first(),
  ],
  [
    '/components/scroll-area',
    1440,
    (p) => p.locator('main [role="region"][tabindex="0"]').first(),
  ],
]
for (const [route, width, find] of clipped)
  test(`${route} at ${width}px: a keyboard ring is never clipped`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(route)
    await waitForCatalogReady(page)
    const target = find(page)
    await target.scrollIntoViewIfNeeded()
    await byKeyboard(page, target)
    // A scroller's root draws the ring, outside the area it clips.
    const drawn = (await target.evaluate((el) =>
      el.matches('.surf-scroll-viewport'),
    ))
      ? target.locator('..')
      : target
    expect(await reach(drawn)).toBeGreaterThanOrEqual(2)
    expect(await unclipped(drawn)).toBe(true)
  })
