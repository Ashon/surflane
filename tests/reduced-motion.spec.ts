import { test, expect } from '@playwright/test'
import { components, patterns } from '../demo/catalog'
import { waitForCatalogReady } from './catalog-ready'

// Under prefers-reduced-motion every component transition and animation is off
// (the motion foundation's rule), on every page that shows components.
test.use({ reducedMotion: 'reduce' })

const routes = [
  ...components
    .filter((item) => item.stage !== 'planned')
    .map((item) => `/components/${item.id}`),
  ...patterns.map((item) => `/patterns/${item.id}`),
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
