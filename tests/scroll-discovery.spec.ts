import { test, expect } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
test('document scrollbar reveals on scrolling and edge proximity, supports drag, and never changes layout', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 800 })
  await page.goto('/components/scroll-area')
  await waitForCatalogReady(page)
  const root = page.locator('.catalog-document-root'),
    bar = root.locator(':scope > .surf-scrollbar[data-orientation="vertical"]'),
    viewport = page.locator('.catalog-document-scroll')
  await page.mouse.move(600, 100)
  await expect(bar).toHaveCSS('opacity', '0')
  const width = (await page.getByRole('main').boundingBox())!.width
  await page.mouse.wheel(0, 200)
  await expect(bar).toHaveCSS('opacity', '1')
  await expect(bar).toHaveCSS('opacity', '0', { timeout: 3000 })
  await page.mouse.move(1420, 300)
  await expect(bar).toHaveCSS('opacity', '1')
  await page.mouse.move(1300, 300)
  await expect(bar).toHaveCSS('opacity', '0')
  await viewport.evaluate((el) => {
    el.scrollTop = 0
  })
  await page.mouse.move(1435, 50)
  const thumb = bar.locator('.surf-scroll-thumb'),
    box = (await thumb.boundingBox())!
  expect(box.width).toBeGreaterThanOrEqual(6)
  expect(box.height).toBeGreaterThan(20)
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await expect(root).toHaveAttribute('data-scroll-dragging', 'vertical')
  await page.mouse.move(1400, 500, { steps: 5 })
  await expect(bar).toHaveCSS('opacity', '1')
  await expect
    .poll(() => viewport.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(100)
  await page.mouse.up()
  await expect(root).not.toHaveAttribute('data-scroll-dragging')
  expect((await page.getByRole('main').boundingBox())!.width).toBe(width)
  await viewport.focus()
  await page.keyboard.press('PageDown')
  await expect(bar).toHaveCSS('opacity', '1')
})

for (const theme of ['light', 'dark'])
  test(`nested scroll handles have visible geometry, reveal on both edges and drag in ${theme}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 1000 })
    await page.goto('/components/scroll-area')
    await waitForCatalogReady(page)
    if (theme === 'dark') {
      await page.getByRole('button', { name: 'Toggle theme' }).click()
      await expect(page.locator('html')).not.toHaveAttribute(
        'data-theme-switching',
      )
    }
    const viewport = page.getByRole('region', {
      name: 'Build revisions',
      exact: true,
    })
    const root = viewport.locator('..')
    await viewport.scrollIntoViewIfNeeded()
    const before = (await viewport.boundingBox())!
    for (const orientation of ['vertical', 'horizontal'] as const) {
      const bar = root.locator(
        `:scope > .surf-scrollbar[data-orientation="${orientation}"]`,
      )
      const thumb = bar.locator('.surf-scroll-thumb')
      const dimensions = (await thumb.boundingBox())!
      expect(dimensions.width).toBeGreaterThanOrEqual(6)
      expect(dimensions.height).toBeGreaterThanOrEqual(6)
      const box = (await root.boundingBox())!
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      await expect(bar).toHaveCSS('opacity', '0')
      await page.mouse.move(
        orientation === 'vertical'
          ? box.x + box.width - 18
          : box.x + box.width / 2,
        orientation === 'horizontal'
          ? box.y + box.height - 18
          : box.y + box.height / 2,
      )
      await expect(bar).toHaveCSS('opacity', '1')
      const handle = (await thumb.boundingBox())!
      const x = handle.x + handle.width / 2,
        y = handle.y + handle.height / 2
      expect(
        await page.evaluate(
          ({ x, y }) =>
            document
              .elementFromPoint(x, y)
              ?.classList.contains('surf-scroll-thumb'),
          { x, y },
        ),
      ).toBe(true)
      const initial = await viewport.evaluate(
        (el, axis) => (axis === 'vertical' ? el.scrollTop : el.scrollLeft),
        orientation,
      )
      await page.mouse.move(x, y)
      await page.mouse.down()
      await expect(root).toHaveAttribute('data-scroll-dragging', orientation)
      await page.mouse.move(
        x + (orientation === 'horizontal' ? 65 : 0),
        y + (orientation === 'vertical' ? 45 : 0),
        { steps: 5 },
      )
      await expect(bar).toHaveCSS('opacity', '1')
      await expect
        .poll(() =>
          viewport.evaluate(
            (el, axis) => (axis === 'vertical' ? el.scrollTop : el.scrollLeft),
            orientation,
          ),
        )
        .toBeGreaterThan(initial)
      await page.mouse.up()
      await expect(root).not.toHaveAttribute('data-scroll-dragging')
    }
    await viewport.hover()
    const position = await viewport.evaluate((el) => el.scrollTop)
    await page.mouse.wheel(0, 35)
    await expect
      .poll(() => viewport.evaluate((el) => el.scrollTop))
      .toBeGreaterThan(position)
    await expect(
      root.locator(':scope > .surf-scrollbar[data-orientation="vertical"]'),
    ).toHaveCSS('opacity', '1')
    const after = (await viewport.boundingBox())!
    expect(after.width).toBe(before.width)
    expect(after.height).toBe(before.height)
  })

test.describe('touch scrollbar', () => {
  test.use({ hasTouch: true, isMobile: true })
  test('on touch the thumb is a thin position indicator', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/components/scroll-area')
    await waitForCatalogReady(page)
    const bar = page.locator(
      '.catalog-document-root > .surf-scrollbar[data-orientation="vertical"]',
    )
    await page
      .locator('.catalog-document-scroll')
      .evaluate((el) => el.scrollBy(0, 400))
    const box = (await bar.locator('.surf-scroll-thumb').boundingBox())!
    expect(box.width).toBe(3)
    expect(box.height).toBeGreaterThan(20)
  })
})
