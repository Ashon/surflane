import { test, expect } from '@playwright/test'

// A portal keeps React context, so an overlay with a size of its own gives that size to
// what it holds: a large Popover or Sheet opened from a small scope draws large
// controls, while the controls around it stay small.
test('an overlay with its own size gives it to the controls it holds', async ({
  page,
}) => {
  await page.goto('/?section=scopes&theme=light')
  await expect(page.locator("[data-ssr='scopes']")).toBeVisible()
  const height = (selector: string) =>
    page
      .locator(selector)
      .evaluate((element) => element.getBoundingClientRect().height)
  await expect(page.locator('.ssr-scope-popover')).toBeVisible()
  await expect(page.locator('.ssr-scope-sheet')).toBeVisible()
  expect(await height('.ssr-scope-outside')).toBe(32)
  expect(await height('.ssr-scope-popover')).toBe(44)
  expect(await height('.ssr-scope-sheet')).toBe(44)
  await expect(page.locator('.ssr-scope-popover')).toHaveAttribute(
    'data-ui-size',
    'large',
  )
})
