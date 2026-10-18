import { expect, type Page } from '@playwright/test'
/** Audit real content, not a Suspense loading screen. Also fail on a caught load error. */
export async function waitForCatalogReady(page: Page) {
  await expect(page.locator('[data-catalog-ready="page"]')).toHaveCount(1)
  await expect(page.locator('[data-catalog-loading]')).toHaveCount(0)
  await expect(page.locator('[data-catalog-error]')).toHaveCount(0)
}
