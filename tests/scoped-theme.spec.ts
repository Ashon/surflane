import { test, expect, type Page } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'

const read = (page: Page, selector: string, names: string[]) =>
  page.evaluate(
    ([selector, names]) => {
      const style = getComputedStyle(document.querySelector(selector)!)
      return names.map((name) => style.getPropertyValue(name).trim())
    },
    [selector, names] as const,
  )
const names = [
  '--surf-canvas',
  '--surf-ink',
  '--surf-surface',
  '--surf-control-hover-background',
]

test('data-theme on any element re-themes its subtree, including alias tokens', async ({
  page,
}) => {
  await page.goto('/')
  await waitForCatalogReady(page)
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'light'
    for (const theme of ['dark', 'light']) {
      const region = document.createElement('div')
      region.dataset.theme = theme
      region.id = `scoped-${theme}`
      region.innerHTML = '<span class="probe"></span>'
      document.body.append(region)
    }
  })
  const pageLight = await read(page, 'html', names)
  const scopedDark = await read(page, '#scoped-dark .probe', names)
  const scopedLight = await read(page, '#scoped-light .probe', names)
  await page.evaluate(() => (document.documentElement.dataset.theme = 'dark'))
  const pageDark = await read(page, 'html', names)
  const scopedLightInDark = await read(page, '#scoped-light .probe', names)
  expect(pageLight).not.toEqual(pageDark)
  expect(scopedDark).toEqual(pageDark)
  expect(scopedLight).toEqual(pageLight)
  expect(scopedLightInDark).toEqual(pageLight)
  // The alias resolves inside the scope instead of inheriting the page's resolved value.
  expect(scopedDark[3]).toBe(scopedDark[2])
  expect(scopedDark[3]).not.toBe(pageLight[3])
  // Native scrollbars and form controls follow the theme, scoped regions included.
  const schemes = await page.evaluate(() =>
    ['html', '#scoped-dark .probe', '#scoped-light .probe'].map(
      (selector) =>
        getComputedStyle(document.querySelector(selector)!).colorScheme,
    ),
  )
  expect(schemes).toEqual(['dark', 'dark', 'light'])
})
