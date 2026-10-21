import { expect, type Page } from '@playwright/test'
/** Audit real content, not a Suspense loading screen. Also fail on a caught load error. */
// A cold route can take longer than the default 5s while parallel workers share the
// dev server. Loading speed has its own tests (catalog-loading.spec.ts).
export async function waitForCatalogReady(page: Page) {
  await expect(page.locator('[data-catalog-ready="page"]')).toHaveCount(1, {
    timeout: 15000,
  })
  await expect(page.locator('[data-catalog-loading]')).toHaveCount(0)
  await expect(page.locator('[data-catalog-error]')).toHaveCount(0)
}
