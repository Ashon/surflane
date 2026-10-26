import { waitForCatalogReady } from './catalog-ready'
import { test, expect } from '@playwright/test'

// A container of app content breaks a word only when it cannot fit. Its columns
// never size below a word, so a figure or a ticker stays whole in a grid or a flex
// row; overflow-wrap: anywhere would let them shrink to one character.
for (const [path, selector] of [
  ['/patterns/app-shell', '.surf-app-shell-content'],
  ['/components/tabs', '.surf-tabs-panel'],
  ['/components/card', '.surf-card-body'],
  ['/patterns/resource-list', '.surf-list-content'],
] as const)
  test(`${selector} keeps a figure whole at its narrowest`, async ({
    page,
  }) => {
    await page.goto(path)
    await waitForCatalogReady(page)
    const widths = await page
      .locator(selector)
      .first()
      .evaluate((container) => {
        const probe = document.createElement('span')
        probe.textContent = '1,234,567.89'
        probe.style.display = 'inline-block'
        container.append(probe)
        probe.style.inlineSize = 'min-content'
        const narrowest = probe.getBoundingClientRect().width
        probe.style.inlineSize = 'max-content'
        const whole = probe.getBoundingClientRect().width
        const wrap = getComputedStyle(probe).overflowWrap
        probe.remove()
        return {
          narrowest: Math.round(narrowest),
          whole: Math.round(whole),
          wrap,
        }
      })
    expect(widths.wrap).toBe('break-word')
    expect(widths.narrowest).toBe(widths.whole)
  })
