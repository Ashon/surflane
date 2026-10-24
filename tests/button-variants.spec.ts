import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
for (const width of [1440, 320]) {
  for (const theme of ['light', 'dark']) {
    test(`button emphasis and size comparison at ${width}px ${theme}`, async ({
      page,
      context,
    }) => {
      await context.addCookies([
        {
          name: 'surflane-theme',
          value: theme,
          domain: '127.0.0.1',
          path: '/',
        },
      ])
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/components/button')
      await waitForCatalogReady(page)
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      const table = page.getByRole('table', {
        name: 'Emphasis level and size comparison',
      })
      await expect(table.getByRole('button')).toHaveCount(18)
      const primary = page.getByRole('button', {
        name: 'Run preview',
        exact: true,
      })
      const disabled = page.getByRole('button', {
        name: 'Unavailable',
        exact: true,
      })
      expect(
        await primary.evaluate((el) => getComputedStyle(el).backgroundColor),
      ).toBe(
        await disabled.evaluate((el) => getComputedStyle(el).backgroundColor),
      )
      for (const variant of [
        'primary',
        'secondary',
        'ghost',
        'destructive',
        'link',
      ]) {
        const button = table
          .locator(`button[data-variant="${variant}"]`)
          .first()
        await expect(button).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)')
      }
      const outline = table.locator('button[data-variant="outline"]').first()
      await expect(outline).not.toHaveCSS(
        'border-top-color',
        'rgba(0, 0, 0, 0)',
      )
      const sizeControls = page.getByRole('group', {
        name: 'Component preview size',
      })
      const selectedSize = sizeControls.getByRole('button', {
        name: 'Preview size: Default',
        exact: true,
      })
      await expect(selectedSize).toHaveAttribute('aria-pressed', 'true')
      expect(
        await selectedSize.evaluate(
          (el) => getComputedStyle(el).backgroundColor,
        ),
      ).not.toBe(
        await primary.evaluate((el) => getComputedStyle(el).backgroundColor),
      )
      await primary.click()
      await expect(
        page.getByText('Primary action previewed.', { exact: true }),
      ).toBeVisible()
      const heights: number[] = []
      for (const size of ['small', 'default', 'large']) {
        const button = table.getByRole('button', {
          name: `Secondary, ${size}`,
          exact: true,
        })
        await button.click()
        await expect(
          page.getByText(`Secondary / ${size} previewed.`, { exact: true }),
        ).toBeVisible()
        heights.push((await button.boundingBox())!.height)
      }
      expect(heights[0]).toBeLessThanOrEqual(heights[1])
      expect(heights[1]).toBeLessThanOrEqual(heights[2])
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
  }
}

test('LinkButton stays a link, takes its size and keeps the router navigation it renders', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await waitForCatalogReady(page)
  // The hero action; the overview section repeats the link as an outline button.
  const link = page
    .getByRole('link', { name: 'Browse components', exact: true })
    .first()
  await expect(link).toHaveClass(/surf-button/)
  await expect(link).toHaveAttribute('data-ui-size', 'large')
  expect((await link.boundingBox())!.height).toBe(44)
  // The catalog router navigates in place: the page keeps its state, no document load.
  await page.evaluate(() => ((window as any).__kept = true))
  await link.click()
  await expect(page).toHaveURL(/\/components$/)
  expect(await page.evaluate(() => (window as any).__kept)).toBe(true)
  const text = page
    .locator('.catalog-page-header')
    .getByRole('link', { name: 'Surflane', exact: true })
  await expect(text).toHaveClass(/surf-link/)
})
