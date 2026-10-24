import { test, expect } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'
import { foundations } from '../demo/catalog'
test.use({ reducedMotion: 'reduce' })
test('Foundations fills the viewport while keeping its two-column index near the page header', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1600 })
  await page.goto('/foundations')
  await waitForCatalogReady(page)
  const sheet = await page.getByRole('main').boundingBox()
  expect(sheet!.y).toBe(64)
  expect(sheet!.width).toBe(1100)
  // The sheet fills the viewport down to the site footer, which ends at the 12px inset.
  const footer = (await page.locator('.catalog-site-footer').boundingBox())!
  expect(sheet!.y + sheet!.height).toBe(footer.y)
  expect(footer.y + footer.height).toBe(1600 - 12)
  const items = page.locator(
    '.catalog-item-list[data-layout="grid"] .catalog-item',
  )
  await expect(items).toHaveCount(foundations.length)
  const first = (await items.nth(0).boundingBox())!,
    second = (await items.nth(1).boundingBox())!,
    third = (await items.nth(2).boundingBox())!
  expect(first.y).toBeLessThan(300)
  expect(second.y).toBeCloseTo(first.y, 0)
  expect(second.x).toBeGreaterThan(first.x + first.width)
  expect(third.y).toBeGreaterThan(first.y)
})
test('forms stay bounded and section descriptions stop at the reading measure', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1000 })
  const widths: number[] = []
  for (const route of [
    '/foundations',
    '/foundations/accessibility',
    '/components/button',
  ]) {
    await page.goto(route)
    await waitForCatalogReady(page)
    widths.push((await page.getByRole('main').boundingBox())!.width)
  }
  expect(widths).toEqual([1100, 1100, 1100])
  await page.goto('/foundations/accessibility')
  await waitForCatalogReady(page)
  const form = page.getByRole('form', {
    name: 'Accessible validation preview',
  })
  expect((await form.boundingBox())!.width).toBe(640)
  const gap = await form.evaluate((element) => {
    const field = element.querySelector('.surf-field')!.getBoundingClientRect()
    const actions = element
      .querySelector('.surf-inline')!
      .getBoundingClientRect()
    return actions.top - field.bottom
  })
  expect(gap).toBeCloseTo(24, 0)
  const paragraph = page.locator('#responsibilities > p').first()
  const width = (await paragraph.boundingBox())!.width
  const section = (await page.locator('#responsibilities').boundingBox())!.width
  const measure = await paragraph.evaluate((p) =>
    parseFloat(getComputedStyle(p).maxInlineSize),
  )
  expect(width).toBeCloseTo(Math.min(section, measure), 0)
  expect(width).toBeLessThan(section)
})
test('mobile index and forms keep a single bounded column with natural height', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.goto('/foundations')
  await waitForCatalogReady(page)
  const items = page.locator(
    '.catalog-item-list[data-layout="grid"] .catalog-item',
  )
  const first = (await items.nth(0).boundingBox())!,
    second = (await items.nth(1).boundingBox())!
  expect(second.x).toBeCloseTo(first.x, 0)
  expect(second.y).toBeGreaterThan(first.y + first.height)
  expect(
    await page.evaluate(() => document.body.scrollWidth <= innerWidth),
  ).toBe(true)
  await page.goto('/foundations/accessibility')
  await waitForCatalogReady(page)
  expect(
    (await page
      .getByRole('form', { name: 'Accessible validation preview' })
      .boundingBox())!.width,
  ).toBeLessThanOrEqual(284)
  expect(
    await page.evaluate(() => document.body.scrollWidth <= innerWidth),
  ).toBe(true)
})
