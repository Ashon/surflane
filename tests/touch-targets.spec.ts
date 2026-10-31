import {
  test,
  expect,
  devices,
  type Locator,
  type Page,
} from '@playwright/test'
import { components, patterns } from '../demo/catalog'
import { waitForCatalogReady } from './catalog-ready'

// On touch and narrow screens every control takes a --surf-control-target-size
// (44px) press, measured as what a finger actually hits: the control, a label
// around it, or a hit area it draws. Controls that keep a smaller visual size,
// such as a table row's checkbox, reach the size around them.
test.use({ ...devices['Pixel 7'], reducedMotion: 'reduce' })

type Host = [
  string,
  (page: Page) => Locator,
  ((page: Page) => Promise<unknown>)?,
]
const hosts: Host[] = [
  ['/components/button', (p) => p.getByRole('button', { name: 'Run preview' })],
  [
    '/components/table',
    (p) => p.getByRole('checkbox', { name: 'Select DEMO main' }).first(),
  ],
  [
    '/components/list',
    (p) => p.getByRole('checkbox', { name: 'Select DEMO main' }).first(),
  ],
  ['/components/tree', (p) => p.locator('main .surf-tree-toggle').first()],
  ['/charts/chart', (p) => p.locator('main .surf-chart-legend-button').first()],
  [
    '/components/toolbar',
    (p) =>
      p
        .getByRole('toolbar', { name: 'Run tools' })
        .getByRole('button', { name: 'Refresh' }),
  ],
  [
    '/components/select',
    (p) => p.getByRole('combobox', { name: 'Environment', exact: true }),
  ],
  [
    '/components/pagination',
    (p) =>
      p
        .getByRole('navigation', { name: 'Pipeline run pages' })
        .getByRole('button', { name: 'Next page' }),
  ],
  [
    '/components/menu',
    (p) => p.getByRole('menuitem', { name: 'Inspect' }),
    (p) => p.getByRole('button', { name: 'Open actions' }).click(),
  ],
  [
    '/components/dialog',
    (p) => p.getByRole('button', { name: 'Close deployment plan' }),
    (p) => p.getByRole('button', { name: 'Open deployment plan' }).click(),
  ],
  [
    '/components/combobox',
    (p) => p.getByRole('button', { name: 'Remove Reader' }),
  ],
]

for (const [route, find, open] of hosts)
  test(`${route}: the target reaches 44px on touch`, async ({ page }) => {
    await page.goto(route)
    await waitForCatalogReady(page)
    await open?.(page)
    const target = find(page)
    await target.scrollIntoViewIfNeeded()
    const [width, height] = await hit(target)
    // A 44px target holds 43 points across its center.
    expect(height, `${route} height`).toBeGreaterThanOrEqual(43)
    expect(width, `${route} width`).toBeGreaterThanOrEqual(43)
  })

// How far a press reaches across the target's center and still lands on it: on
// the element, inside it, or on the label that holds it.
function hit(target: Locator) {
  return target.evaluate((el) => {
    const box = el.getBoundingClientRect()
    const x = box.left + box.width / 2,
      y = box.top + box.height / 2
    const lands = (dx: number, dy: number) => {
      const node = document.elementFromPoint(x + dx, y + dy)
      return (
        !!node &&
        (el.contains(node) || (node.tagName === 'LABEL' && node.contains(el)))
      )
    }
    const extent = (step: (d: number) => [number, number]) => {
      let d = 0
      while (d < 40 && lands(...step(d + 1)) && lands(...step(-(d + 1)))) d++
      return 2 * d + 1
    }
    return [extent((d) => [d, 0]), extent((d) => [0, d])]
  })
}

// Every control on every page, measured the same way. A part inside a field
// group is pressed through its group, a choice inside a label through the
// label, and a compact scope keeps its controls at their size, floored at
// --surf-control-target-size-min (24px). Text links inside running text are
// exempt, as WCAG's inline exception allows; a control with text needs the
// height, an icon-only one both sides.
const pages = [
  ...components
    .filter((item) => item.stage !== 'planned')
    .map((item) => `/components/${item.id}`),
  ...patterns.map((item) => `/patterns/${item.id}`),
]
for (const route of pages)
  test(`${route}: every control takes a full press on touch`, async ({
    page,
  }) => {
    await page.goto(route)
    await waitForCatalogReady(page)
    const small = await page.evaluate(() => {
      const found: string[] = []
      const controls = document.querySelectorAll<HTMLElement>(
        'main :is(button, a[href], [role="button"], [role="tab"], [role="checkbox"], [role="radio"], [role="switch"], [role="treeitem"], input:not([type="hidden"]), select, textarea)',
      )
      for (const control of controls) {
        if (control.getClientRects().length === 0) continue
        const style = getComputedStyle(control)
        // Hidden form proxies and controls that can't act are not targets.
        if (
          style.visibility === 'hidden' ||
          style.clipPath !== 'none' ||
          style.clip !== 'auto' ||
          control.closest('[aria-hidden="true"]')
        )
          continue
        if (control.matches(':disabled, [aria-disabled="true"]')) continue
        if (
          control.matches('a') &&
          control.closest(
            'p, li, td, th, dd, figcaption, h1, h2, h3, h4, .surf-prose, .surf-markdown',
          )
        )
          continue
        const target =
          control.closest<HTMLElement>(
            '.surf-combobox-group, .surf-number-group, .surf-date-group, .surf-input-group',
          ) ??
          control.closest<HTMLElement>('label') ??
          control
        target.scrollIntoView({ block: 'center', inline: 'center' })
        const box = target.getBoundingClientRect()
        const x = box.left + box.width / 2,
          y = box.top + box.height / 2
        const lands = (dx: number, dy: number) => {
          const node = document.elementFromPoint(x + dx, y + dy)
          return !!node && target.contains(node)
        }
        const extent = (step: (d: number) => [number, number]) => {
          let d = 0
          while (d < 30 && lands(...step(d + 1)) && lands(...step(-(d + 1))))
            d++
          return 2 * d + 1
        }
        // A 44px target holds 43 points across its center, a 24px one 23.
        const need = control.closest(
          '[data-ui-density="compact"], [data-density="compact"]',
        )
          ? 23
          : 43
        const height = extent((d) => [0, d]),
          width = extent((d) => [d, 0])
        const iconOnly = !(control.textContent ?? '').trim()
        if (height < need || (iconOnly && width < need))
          found.push(
            `${width}x${height} ${control.tagName.toLowerCase()} ${control.getAttribute('aria-label') ?? control.textContent?.trim().slice(0, 30)}`,
          )
      }
      return [...new Set(found)]
    })
    expect(small, route).toEqual([])
  })
