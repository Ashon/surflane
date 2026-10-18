import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
for (const width of [1440, 1024, 320])
  test(`blueprint guides and H-beam dimensions never move the actual UI at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/foundations/layout')
    await waitForCatalogReady(page)
    const container = page.getByTestId('layout-container')
    const boxes = () =>
      page
        .locator(
          '[data-testid="layout-stack"], [data-testid="layout-grid"], .foundation-stat',
        )
        .evaluateAll((elements) =>
          elements.map((el) => {
            const r = el.getBoundingClientRect()
            return {
              x:
                r.x +
                scrollX +
                (el.closest('.catalog-document-scroll')?.scrollLeft ?? 0),
              y:
                r.y +
                scrollY +
                (el.closest('.catalog-document-scroll')?.scrollTop ?? 0),
              width: r.width,
              height: r.height,
            }
          }),
        )
    const before = await boxes()
    expect(
      await container.evaluate(
        (el) => getComputedStyle(el.querySelector('canvas')!).position,
      ),
    ).toBe('absolute')
    expect(
      await container.evaluate(
        (el) => getComputedStyle(el.querySelector('canvas')!).pointerEvents,
      ),
    ).toBe('none')
    await page.getByRole('button', { name: 'Grid guides', exact: true }).click()
    expect(await boxes()).toEqual(before)
    await page.getByRole('button', { name: 'Grid guides', exact: true }).click()
    expect(await boxes()).toEqual(before)
    const formBoxes = () =>
      page
        .locator(
          '[data-testid="spacing-form"], [data-testid="spacing-form"] input, [data-spacing-actions] > button',
        )
        .evaluateAll((elements) =>
          elements.map((el) => {
            const r = el.getBoundingClientRect()
            return {
              x:
                r.x +
                scrollX +
                (el.closest('.catalog-document-scroll')?.scrollLeft ?? 0),
              y:
                r.y +
                scrollY +
                (el.closest('.catalog-document-scroll')?.scrollTop ?? 0),
              width: r.width,
              height: r.height,
            }
          }),
        )
    await expect(page.locator('[data-measure="title"]')).toHaveAttribute(
      'data-length',
      '4',
    )
    await expect(page.locator('[data-measure="label"]')).toHaveAttribute(
      'data-length',
      '8',
    )
    await expect(page.locator('[data-measure="actions"]')).toHaveAttribute(
      'data-length',
      '16',
    )
    await expect(page.locator('[data-measure="buttons"]')).toHaveAttribute(
      'data-length',
      '8',
    )
    const beforeSpacing = await formBoxes()
    await page
      .getByRole('button', { name: 'Spacing dimensions', exact: true })
      .click()
    expect(await formBoxes()).toEqual(beforeSpacing)
    await page
      .getByRole('button', { name: 'Spacing dimensions', exact: true })
      .click()
    expect(await formBoxes()).toEqual(beforeSpacing)
    await page
      .getByRole('textbox', { name: 'Display name', exact: true })
      .fill('Keyboard and pointer remain usable')
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze()
      ).violations,
    ).toEqual([])
  })

for (const dpr of [1, 2, 3])
  test(`grid lines occupy single physical pixels at DPR ${dpr}`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      baseURL,
      deviceScaleFactor: dpr,
      viewport: { width: 1439, height: 1000 },
      reducedMotion: 'reduce',
    })
    try {
      const page = await context.newPage()
      await page.goto('/foundations/layout')
      await waitForCatalogReady(page)
      const canvas = page.locator('[data-testid="layout-container"] canvas')
      await expect
        .poll(() =>
          canvas.evaluate((element) => {
            const canvas = element as HTMLCanvasElement
            return canvas.width > 300
          }),
        )
        .toBe(true)
      const geometry = await canvas.evaluate((element) => {
        const canvas = element as HTMLCanvasElement,
          rect = canvas.getBoundingClientRect()
        const image = canvas
          .getContext('2d')!
          .getImageData(0, Math.floor(canvas.height / 2), canvas.width, 1).data
        const alphas = Array.from(
          { length: canvas.width },
          (_, i) => image[i * 4 + 3],
        )
        return {
          width: rect.width,
          height: rect.height,
          pixels: canvas.width,
          pixelHeight: canvas.height,
          x: rect.x,
          y: rect.y,
          alphas,
          opacity: Number(getComputedStyle(canvas).opacity),
        }
      })
      expect(geometry.pixels).toBe(Math.round(geometry.width * dpr))
      expect(geometry.pixelHeight).toBe(Math.round(geometry.height * dpr))
      expect(geometry.x * dpr).toBeCloseTo(Math.round(geometry.x * dpr), 4)
      expect(geometry.y * dpr).toBeCloseTo(Math.round(geometry.y * dpr), 4)
      expect(new Set(geometry.alphas)).toEqual(new Set([0, 255]))
      expect(geometry.alphas.filter((alpha) => alpha === 255)).toHaveLength(24)
      expect(geometry.opacity).toBeLessThan(0.25)
    } finally {
      await context.close()
    }
  })
