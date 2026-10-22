import { test, expect } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
test('global rail stays separate from the document and shares its content columns', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  for (const route of ['/', '/coverage', '/components/button']) {
    await page.goto(route)
    await waitForCatalogReady(page)
    const rail = (await page.locator('.catalog-toprail').boundingBox())!
    const sheet = (await page.getByRole('main').boundingBox())!
    const sidebar = (await page.locator('.catalog-sidebar').boundingBox())!
    const brand = (await page.locator('.catalog-brand').boundingBox())!
    if (route === '/') {
      // The landing hero sits between the rail and the document sheet.
      const hero = (await page.locator('.landing-hero').boundingBox())!
      expect(hero.y).toBeGreaterThanOrEqual(rail.y + rail.height)
      expect(sheet.y).toBeGreaterThanOrEqual(hero.y + hero.height)
    } else {
      // One 12px frame gap: window to the rail's items, those items to the sheet.
      const tab = (await page
        .locator('.catalog-primary a[aria-current]')
        .boundingBox())!
      expect(sheet.y).toBe(rail.y + rail.height)
      expect(tab.y).toBe(12)
      expect(sheet.y - tab.y - tab.height).toBe(12)
    }
    expect(brand.x).toBe(sidebar.x)
    expect(sheet.x - sidebar.x - sidebar.width).toBe(12)
  }
})
test('the mobile rail keeps one 18px step around the mark and the tabs', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/foundations')
  await waitForCatalogReady(page)
  const mark = (await page
      .locator('.catalog-toprail .catalog-brand-mark')
      .boundingBox())!,
    tabs = (await page.locator('.catalog-primary').boundingBox())!,
    sheet = (await page.getByRole('main').boundingBox())!
  expect(mark.y).toBe(18)
  expect(tabs.y - mark.y - mark.height).toBe(18)
  expect(sheet.y - tabs.y - tabs.height).toBe(18)
})
test('manual copy reads in the reading role at the reading measure and wraps naturally across page families', async ({
  page,
}) => {
  for (const width of [1440, 1024, 320]) {
    await page.setViewportSize({ width, height: 1000 })
    for (const route of [
      '/',
      '/install',
      '/coverage',
      '/components/button',
      '/foundations/accessibility',
      '/foundations/motion',
      '/patterns/filter-bar',
    ]) {
      await page.goto(route)
      await waitForCatalogReady(page)
      const measurements = await page
        .locator('.catalog-page-body > section > p:not([class])')
        .evaluateAll((nodes) =>
          nodes.map((p) => {
            const style = getComputedStyle(p)
            return {
              width: p.getBoundingClientRect().width,
              // The reading measure, or the column when it is narrower.
              expected: Math.min(
                p.parentElement!.clientWidth,
                parseFloat(style.maxInlineSize),
              ),
              type: `${style.fontSize}/${style.lineHeight}`,
              clipped:
                p.scrollWidth > p.clientWidth + 1 ||
                p.scrollHeight > p.clientHeight + 1,
            }
          }),
        )
      expect(measurements.length).toBeGreaterThan(0)
      for (const item of measurements) {
        expect(item.width).toBeCloseTo(item.expected, 0)
        expect(item.type).toBe('16px/28px')
        expect(item.clipped).toBe(false)
      }
      expect(
        await page
          .locator('.catalog-document-scroll')
          .evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true)
    }
  }
})
test('document tables hang 16px past both page text lines, so row hover is symmetric', async ({
  page,
}) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    for (const [route, section] of [
      ['/components/button', '#api'],
      ['/coverage', 'main section'],
    ]) {
      await page.goto(route)
      await waitForCatalogReady(page)
      // Detail sections render when they scroll into view.
      await page.locator(section).first().scrollIntoViewIfNeeded()
      const table = page
        .locator(`${section} .pui-table:not(.catalog-example-frame *)`)
        .first()
      const edges = await table.evaluate((table) => {
        const root = table.closest('.pui-scroll-root')!.getBoundingClientRect()
        const text = table
          .closest('section')!
          .querySelector(':scope > h2')!
          .getBoundingClientRect()
        return [text.left - root.left, root.right - text.right]
      })
      expect(edges, `${route} at ${width}px`).toEqual([16, 16])
    }
  }
})
