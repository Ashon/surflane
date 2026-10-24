import { components } from '../demo/catalog'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
const documentViewport = (page: import('@playwright/test').Page) =>
  page.locator('.catalog-document-scroll')

test('short sheets fill the available viewport and long content remains scrollable after resizing', async ({
  page,
}) => {
  for (const width of [1440, 760, 320]) {
    await page.setViewportSize({ width, height: 2400 })
    // The overview now opens with a hero; the foundations index is the short sheet.
    await page.goto('/foundations')
    await waitForCatalogReady(page)
    const sheet = page.getByRole('main')
    const tall = (await sheet.boundingBox())!
    // The sheet fills the space above the site footer, which ends at the scroller's bottom inset.
    const footer = (await page.locator('.catalog-site-footer').boundingBox())!
    const inset = await documentViewport(page).evaluate((el) =>
      parseFloat(getComputedStyle(el).paddingBottom),
    )
    expect(tall.y + tall.height).toBeCloseTo(footer.y, 0)
    expect(footer.y + footer.height).toBeCloseTo(2400 - inset, 0)
    expect(await documentViewport(page).evaluate((el) => el.scrollHeight)).toBe(
      2400,
    )
    await page.setViewportSize({ width, height: 600 })
    await expect
      .poll(() => documentViewport(page).evaluate((el) => el.scrollHeight))
      .toBeGreaterThan(600)
    const compact = (await sheet.boundingBox())!
    expect(compact.width).toBe(tall.width)
    await documentViewport(page).evaluate((el) => {
      el.scrollTop = el.scrollHeight
    })
    const bottom = (await sheet.boundingBox())!
    expect(bottom.y + bottom.height).toBeLessThanOrEqual(589)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width)
  }
})

test('document and navigation use shared scroll viewports without changing sheet geometry', async ({
  page,
}) => {
  await page.goto('/components/fieldset')
  await waitForCatalogReady(page)
  const doc = documentViewport(page),
    nav = page.getByRole('region', { name: 'Catalog sections', exact: true })
  await expect(doc).toHaveClass(/surf-scroll-viewport/)
  await expect(nav).toHaveClass(/surf-scroll-viewport/)
  await expect(doc).toHaveCSS('scrollbar-width', 'none')
  const initial = (await page.getByRole('main').boundingBox())!
  const sidebar = (await page.getByRole('complementary').boundingBox())!
  await doc.hover({ position: { x: 700, y: 500 } })
  await page.mouse.wheel(0, 500)
  await expect
    .poll(() => doc.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(200)
  const after = (await page.getByRole('main').boundingBox())!
  expect(after.x).toBe(initial.x)
  expect(after.width).toBe(initial.width)
  expect((await page.getByRole('complementary').boundingBox())!.y).toBeCloseTo(
    sidebar.y,
    0,
  )
  const saved = await doc.evaluate((el) => el.scrollTop)
  const navSaved = await nav.evaluate((el) => el.scrollTop)
  await nav.hover()
  await page.mouse.wheel(0, 400)
  await expect
    .poll(() => nav.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(navSaved)
  expect(await doc.evaluate((el) => el.scrollTop)).toBeCloseTo(saved, 0)
  expect(await page.evaluate(() => scrollY)).toBe(0)
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(
    page.viewportSize()!.height,
  )
})

test('keyboard scrolling, skip link and route focus stay usable', async ({
  page,
}) => {
  await page.goto('/components/fieldset')
  await waitForCatalogReady(page)
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  const doc = documentViewport(page)
  await doc.focus()
  await page.keyboard.press('PageDown')
  await expect
    .poll(() => doc.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(100)
  await page
    .getByRole('navigation', { name: 'Catalog navigation' })
    .getByRole('link', { name: 'All components', exact: true })
    .click()
  await expect(page.locator('#page-title')).toBeFocused()
  await expect.poll(() => doc.evaluate((el) => el.scrollTop)).toBe(0)
})

test('short and long routes retain the same sheet width and a back navigation restores a deep link', async ({
  page,
}) => {
  await page.goto('/components/fieldset#api')
  await waitForCatalogReady(page)
  const doc = documentViewport(page)
  await expect
    .poll(() => doc.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(100)
  const width = (await page.getByRole('main').boundingBox())!.width
  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Foundations', exact: true })
    .click()
  await waitForCatalogReady(page)
  expect((await page.getByRole('main').boundingBox())!.width).toBe(width)
  await page.goBack()
  await waitForCatalogReady(page)
  await expect(page).toHaveURL(/fieldset#api$/)
  await expect
    .poll(() => doc.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(100)
})

for (const [width, columns, tracks, gutter] of [
  [1440, 3, 12, 24],
  [1024, 2, 6, 24],
  [760, 1, 4, 16],
  [320, 1, 4, 16],
])
  test(`catalog cards and track spans follow shared breakpoints at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/components')
    await waitForCatalogReady(page)
    const grid = page
      .getByRole('region', { name: 'Forms', exact: true })
      .locator('.catalog-item-list')
    await expect(grid).toHaveClass(/surf-grid/)
    expect(
      await grid.evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns.split(' ').length,
      ),
    ).toBe(columns)
    const boxes = await grid.locator('.catalog-item').evaluateAll((items) =>
      items.slice(0, 4).map((el) => {
        const b = el.getBoundingClientRect()
        return { x: b.x, y: b.y, w: b.width, h: b.height }
      }),
    )
    expect(boxes[columns].y).toBeGreaterThan(boxes[0].y)
    if (columns > 1) expect(boxes[1].y).toBeCloseTo(boxes[0].y, 0)
    expect(
      await documentViewport(page).evaluate(
        (el) => el.scrollWidth <= el.clientWidth,
      ),
    ).toBe(true)
    await page.getByRole('searchbox', { name: 'Search catalog' }).fill('button')
    await expect(page.locator('.catalog-item')).toHaveCount(1)
    await expect(page.getByRole('status')).toHaveText(
      `1 / ${components.length} items`,
    )
    await page.locator('.catalog-item').press('Enter')
    await expect(page.locator('#page-title')).toHaveText('Button')
    await page.goto('/foundations/layout#grid-system')
    await waitForCatalogReady(page)
    const spans = page.getByTestId('span-grid')
    expect(
      await spans.evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns.split(' ').length,
      ),
    ).toBe(tracks)
    await expect(spans).toHaveCSS('gap', `${gutter}px`)
    const a = (await spans
        .locator('[data-grid-region=primary]')
        .boundingBox())!,
      b = (await spans.locator('[data-grid-region=secondary]').boundingBox())!,
      full = (await spans.locator('[data-grid-region=full]').boundingBox())!
    if (width > 760) {
      expect(a.y).toBeCloseTo(b.y, 0)
      expect(a.width / b.width).toBeGreaterThan(1.9)
      expect(b.x).toBeGreaterThan(a.x + a.width)
    } else {
      expect(b.y).toBeGreaterThan(a.y)
      expect(a.width).toBeCloseTo(b.width, 0)
    }
    expect(full.width).toBeCloseTo((await spans.boundingBox())!.width, 0)
    expect(
      await documentViewport(page).evaluate(
        (el) => el.scrollWidth <= el.clientWidth,
      ),
    ).toBe(true)
  })

test('mobile navigation expands within its own scrollport and closes after a route change', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 600 })
  await page.goto('/components')
  await waitForCatalogReady(page)
  const toggle = page.getByRole('button', { name: 'Browse catalog' })
  await toggle.click()
  const nav = page.getByRole('region', {
    name: 'Catalog sections',
    exact: true,
  })
  await expect(nav).toBeVisible()
  expect((await nav.boundingBox())!.height).toBeLessThanOrEqual(360)
  await nav.getByRole('link', { name: 'Toast', exact: true }).click()
  await waitForCatalogReady(page)
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(nav).toBeHidden()
  await expect(page.locator('#page-title')).toBeFocused()
  expect(
    await documentViewport(page).evaluate(
      (el) => el.scrollWidth <= el.clientWidth,
    ),
  ).toBe(true)
})

for (const width of [1440, 320])
  for (const dark of [false, true])
    test(`document and grid pages pass axe at ${width}px dark=${dark}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.context().addCookies([
        {
          name: 'surflane-theme',
          value: dark ? 'dark' : 'light',
          url: 'http://127.0.0.1:8066/',
        },
      ])
      for (const route of ['/components', '/foundations/layout']) {
        await page.goto(route)
        await waitForCatalogReady(page)
        await expect(page.locator('html')).toHaveAttribute(
          'data-theme',
          dark ? 'dark' : 'light',
        )
        expect((await new AxeBuilder({ page }).analyze()).violations).toEqual(
          [],
        )
      }
    })

test('readiness stays beside the title rather than drifting to the card edge', async ({
  page,
}) => {
  await page.goto('/components')
  await waitForCatalogReady(page)
  const first = page.locator('.catalog-item').first()
  const title = (await first.locator('strong').boundingBox())!,
    badge = (await first.locator('.catalog-stage').boundingBox())!
  expect(badge.x - title.x - title.width).toBeCloseTo(8, 0)
  expect(badge.y + badge.height / 2).toBeCloseTo(title.y + title.height / 2, 0)
  await page.setViewportSize({ width: 320, height: 900 })
  expect(
    await documentViewport(page).evaluate(
      (el) => el.scrollWidth <= el.clientWidth,
    ),
  ).toBe(true)
})

test('Back restores the document position of a route without a fragment', async ({
  page,
}) => {
  await page.goto('/components/fieldset')
  await waitForCatalogReady(page)
  const doc = documentViewport(page)
  await doc.evaluate((el) => (el.scrollTop = 700))
  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Foundations', exact: true })
    .click()
  await waitForCatalogReady(page)
  await page.goBack()
  await waitForCatalogReady(page)
  await expect
    .poll(() => doc.evaluate((el) => el.scrollTop))
    .toBeCloseTo(700, 0)
})
