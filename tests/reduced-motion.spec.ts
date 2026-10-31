import { test, expect } from '@playwright/test'
import { components, itemHref, patterns } from '../demo/catalog'
import { waitForCatalogReady } from './catalog-ready'

// Under prefers-reduced-motion every component transition and animation is off
// (the motion foundation's rule), on every page that shows components.
test.use({ reducedMotion: 'reduce' })

const routes = [
  ...components.filter((item) => item.stage !== 'planned').map(itemHref),
  ...patterns.map(itemHref),
]
for (const route of routes)
  test(`${route}: nothing moves under reduced motion`, async ({ page }) => {
    await page.goto(route)
    await waitForCatalogReady(page)
    const moving = await page.evaluate(() => {
      const found = new Set<string>()
      for (const el of document.querySelectorAll('[class*="surf-"]'))
        for (const pseudo of [null, '::before', '::after']) {
          const style = getComputedStyle(el, pseudo)
          const transitions = style.transitionDuration
            .split(',')
            .some((value) => parseFloat(value) > 0)
          const animation =
            style.animationName !== 'none' &&
            parseFloat(style.animationDuration) > 0
          if (transitions || animation)
            found.add(
              `${[...el.classList].filter((name) => name.startsWith('surf-')).join('.')}${pseudo ?? ''}: ${style.transitionProperty} ${style.transitionDuration} ${animation ? style.animationName : ''}`,
            )
        }
      return [...found]
    })
    expect(moving, route).toEqual([])
  })

// Popups only exist once open, so each opens before it is measured.
const popups: [
  string,
  string,
  (page: import('@playwright/test').Page) => Promise<unknown>,
][] = [
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
    '/components/popover',
    '.surf-popover',
    (p) => p.getByRole('button', { name: 'Inspect account' }).click(),
  ],
  [
    '/components/navigation-menu',
    '.surf-navigation-popup',
    (p) => p.getByRole('button', { name: 'Products' }).first().click(),
  ],
  [
    '/components/dialog',
    '.surf-dialog-popup',
    (p) => p.getByRole('button', { name: 'Open deployment plan' }).click(),
  ],
  [
    '/components/tooltip',
    '.surf-tooltip',
    (p) => p.getByRole('button', { name: 'Inspect logs' }).focus(),
  ],
]
for (const [route, selector, open] of popups)
  test(`${route}: the open popup does not move under reduced motion`, async ({
    page,
  }) => {
    await page.goto(route)
    await waitForCatalogReady(page)
    await open(page)
    const popup = page.locator(selector).first()
    await expect(popup).toBeVisible()
    const durations = await popup.evaluate((el) => {
      const style = getComputedStyle(el)
      return [style.transitionDuration, style.animationName]
    })
    expect(
      durations[0].split(',').every((d) => parseFloat(d) === 0),
      `${route} ${durations[0]}`,
    ).toBe(true)
    expect(durations[1]).toBe('none')
  })
