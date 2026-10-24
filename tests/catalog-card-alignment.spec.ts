import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
import { catalog } from '../demo/catalog'
test.use({ reducedMotion: 'reduce' })

test('overview and all indexes align card text with page content across grid breakpoints and interaction states', async ({
  page,
}) => {
  for (const width of [1440, 1024, 320])
    for (const route of ['/', '/foundations', '/components', '/patterns']) {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto(route)
      await waitForCatalogReady(page)
      // On the overview the page title lives in the hero; cards align with the document's first section.
      const title = (await page
        .locator(route === '/' ? '#overview-foundations h2' : '#page-title')
        .boundingBox())!
      const card = page
        .locator(route === '/' ? '.catalog-feature-links a' : '.catalog-item')
        .first()
      const text = card.locator('strong').first()
      const description = card.locator(route === '/' ? 'span' : 'p').first()
      const geometry = (await card.boundingBox())!
      for (const state of ['idle', 'hover', 'focus', 'forced-colors']) {
        if (state === 'hover') await card.hover()
        if (state === 'focus') await card.focus()
        if (state === 'forced-colors')
          await page.emulateMedia({ forcedColors: 'active' })
        expect(
          (await text.boundingBox())!.x,
          `${width} ${route} ${state} title`,
        ).toBeCloseTo(title.x, 1)
        expect(
          (await description.boundingBox())!.x,
          `${width} ${route} ${state} description`,
        ).toBeCloseTo(title.x, 1)
        expect((await card.boundingBox())!.x).toBeCloseTo(geometry.x, 1)
        if (route === '/components')
          expect(
            (await page
              .locator('.catalog-category-header h2')
              .first()
              .boundingBox())!.x,
          ).toBeCloseTo(title.x, 1)
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true)
      }
      await page.emulateMedia({ forcedColors: 'none' })
      // The focus ring must stay inside the window even when the card face bleeds.
      const last = page
        .locator(route === '/' ? '.catalog-feature-links a' : '.catalog-item')
        .last()
      await last.focus()
      const edges = await last.evaluate((el) => {
        const b = el.getBoundingClientRect(),
          s = getComputedStyle(el),
          inset = parseFloat(s.outlineWidth) + parseFloat(s.outlineOffset)
        return { left: b.left - inset, right: b.right + inset }
      })
      expect(edges.left).toBeGreaterThanOrEqual(0)
      expect(edges.right).toBeLessThanOrEqual(width)
    }
})

test('coverage wave copy, filters, table caption and first-column content share the page origin', async ({
  page,
}) => {
  for (const width of [1440, 1024, 320])
    for (const theme of ['light', 'dark']) {
      await page.context().addCookies([
        {
          name: 'surflane-theme',
          value: theme,
          url: 'http://127.0.0.1:8066/',
        },
      ])
      await page.setViewportSize({ width, height: 1000 })
      await page.goto('/coverage')
      await waitForCatalogReady(page)
      const start = (await page.locator('#page-title').boundingBox())!.x
      for (const selector of [
        '.delivery-waves strong',
        '.delivery-waves p',
        '#coverage-inventory h2',
        '#coverage-inventory .catalog-filters > label:first-child',
        '.surf-table-body tr:first-child th a',
      ]) {
        for (const el of await page.locator(selector).all())
          expect(
            (await el.boundingBox())!.x,
            `${width} ${theme} ${selector}`,
          ).toBeCloseTo(start, 1)
      }
      for (const selector of [
        '.surf-table-caption',
        '.surf-table-head th:first-child',
      ]) {
        const textStart = await page.locator(selector).evaluate((el) => {
          const range = document.createRange()
          range.selectNodeContents(el)
          return range.getBoundingClientRect().x
        })
        expect(textStart, `${width} ${theme} ${selector}`).toBeCloseTo(start, 1)
      }
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
      await expect(page.locator('.delivery-waves li')).toHaveCount(4)
      await expect(page.getByRole('table').getByRole('rowheader')).toHaveCount(
        catalog.length,
      )
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true)
      if (width === 320) {
        const viewport = page.getByRole('region', {
          name: 'Coverage inventory table',
          exact: true,
        })
        const scroll = await viewport.evaluate((el) => {
          el.scrollLeft = 100
          return el.scrollLeft
        })
        expect(scroll).toBeGreaterThan(0)
      }
      if (width === 1440) {
        await page
          .locator('.catalog-document-scroll')
          .evaluate((el) =>
            el.scrollBy(
              0,
              document.querySelector('#coverage-waves')!.getBoundingClientRect()
                .top - 80,
            ),
          )
        await page.screenshot({ path: `.data/coverage-aligned-${theme}.png` })
      }
    }
})
