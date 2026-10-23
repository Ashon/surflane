import { test, expect, type Page } from '@playwright/test'
import { pageRoutes } from '../demo/catalog'
import { localePath } from '../demo/router'
// The production build writes every page as HTML (scripts/prerender.mjs), so these run
// against it in playwright.browsers.config.ts, not against the dev server.
const pages = pageRoutes.flatMap((route) =>
  (['en', 'ko'] as const).map((locale) => ({
    locale,
    path: localePath(locale, route),
  })),
)
async function live(page: Page) {
  await expect(page.locator('[data-catalog-ready="page"]')).toHaveCount(1, {
    timeout: 15000,
  })
}

test('every page is HTML in its language before a script runs', async ({
  request,
}) => {
  for (const { locale, path } of pages) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
    const html = await response.text()
    expect(html, path).toContain(`<html lang="${locale}"`)
    expect(html, path).toContain('class="catalog-page-body"')
    // No loading fallback waits for a script, and React swaps nothing in later.
    expect(html, path).not.toContain('data-catalog-loading')
    expect(html, path).not.toContain('$RC(')
  }
})

test('a page reads complete with scripts blocked: content, colored code and the current link in view', async ({
  page,
}) => {
  await page.route('**/*.js', (route) => route.abort())
  await page.goto('/components/code')
  await expect(page.locator('#page-title')).toHaveText('Code block')
  await expect(
    page.locator('.sheet .pui-syntax[data-highlighted="true"]').first(),
  ).toBeVisible()
  const sidebar = page.locator('.catalog-navigation-viewport')
  const current = sidebar.locator('a[aria-current="page"]')
  const [view, link] = await Promise.all([
    sidebar.boundingBox(),
    current.boundingBox(),
  ])
  expect(link!.y).toBeGreaterThanOrEqual(view!.y)
  expect(link!.y + link!.height).toBeLessThanOrEqual(view!.y + view!.height)
})

test('pages hydrate without a mismatch', async ({ page, browserName }) => {
  test.setTimeout(600000)
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error')
      errors.push(`${page.url()}: ${message.text()}`)
  })
  page.on('pageerror', (error) =>
    errors.push(`${page.url()}: ${error.message}`),
  )
  // Chromium checks every page; the other engines a page of each kind.
  const checked =
    browserName === 'chromium'
      ? pages
      : pages.filter(({ path }) =>
          [
            '/',
            '/ko/components/file-upload',
            '/foundations/color',
            '/ko/patterns/data-table',
            '/install',
          ].includes(path),
        )
  for (const { path } of checked) {
    await page.goto(path)
    await live(page)
  }
  expect(errors).toEqual([])
})

test('an unknown path renders from 404.html', async ({ page }) => {
  await page.goto('/ko/nowhere')
  await live(page)
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko')
  await expect(
    page.getByRole('link', { name: '컴포넌트 둘러보기', exact: true }),
  ).toBeVisible()
})

test('on a slow link the static page never falls back while it hydrates', async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== 'chromium',
    'throttles through the Chrome DevTools Protocol',
  )
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: 1.6e6 / 8,
    uploadThroughput: 750e3 / 8,
  })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  // A section still waiting for its chunk or its code's colors when something above it
  // changes loses its HTML to the fallback; the app loads both before it hydrates.
  await page.addInitScript(() => {
    const lost: string[] = ((window as unknown as { lost: string[] }).lost = [])
    new MutationObserver((records) => {
      // The static page itself arrives while the document parses.
      if (document.readyState === 'loading') return
      for (const record of records)
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue
          if (
            node.closest('[data-catalog-loading]') ||
            node.querySelector('[data-catalog-loading]')
          )
            lost.push('loading fallback')
          for (const code of [
            node,
            ...node.querySelectorAll('code.pui-syntax'),
          ])
            if (
              code.matches(
                'code.pui-syntax[data-highlighted="false"]:not([data-language="text"])',
              )
            )
              lost.push(`plain ${(code as HTMLElement).dataset.language} code`)
        }
    }).observe(document, { subtree: true, childList: true })
  })
  for (const path of ['/components/code', '/ko/patterns/async-job']) {
    await page.goto(path)
    await live(page)
    await page.waitForLoadState('networkidle')
    expect(
      await page.evaluate(() => (window as unknown as { lost: string[] }).lost),
      path,
    ).toEqual([])
  }
})
