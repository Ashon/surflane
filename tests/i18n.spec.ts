import { test, expect } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'
import { catalog, itemHref } from '../demo/catalog'

test('the language switch sets lang, persists in a cookie and survives a reload', async ({
  page,
  context,
}) => {
  await page.goto('/components')
  await waitForCatalogReady(page)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  // An icon button names the current language and describes the switch.
  // Its glyph shows the destination language in that language's script.
  const glyph = page.locator('.catalog-toprail .catalog-locale-glyph')
  await expect(glyph).toHaveText('가')
  await expect(glyph).toHaveAttribute('lang', 'ko')
  await page
    .locator('.catalog-toprail')
    .getByRole('button', { name: 'Language: English', exact: true })
    .click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko')
  await expect(glyph).toHaveText('A')
  await expect(glyph).toHaveAttribute('lang', 'en')
  // Interface text follows: rail, page header, sidebar and controls.
  await expect(
    page
      .getByRole('navigation', { name: '주요 내비게이션' })
      .getByRole('link', { name: '컴포넌트', exact: true }),
  ).toHaveAttribute('aria-current', 'page')
  await expect(page.locator('#page-title')).toHaveText('컴포넌트')
  await expect(
    page
      .locator('.catalog-sidebar')
      .getByRole('link', { name: '모든 컴포넌트', exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: /^테마 전환: / })).toBeVisible()
  expect(
    (await context.cookies()).find(
      (cookie) => cookie.name === 'surflane-locale',
    )?.value,
  ).toBe('ko')
  await page.reload()
  await waitForCatalogReady(page)
  // The boot script restores the language before paint.
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko')
  await page
    .locator('.catalog-toprail')
    .getByRole('button', { name: '언어: 한국어', exact: true })
    .click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('#page-title')).toHaveText('Components')
})

test('a Korean browser starts in Korean until a language is chosen', async ({
  browser,
}) => {
  const context = await browser.newContext({ locale: 'ko-KR' })
  try {
    const page = await context.newPage()
    await page.goto('http://127.0.0.1:8066/components')
    await waitForCatalogReady(page)
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko')
  } finally {
    await context.close()
  }
})

test('every catalog page renders in Korean without errors', async ({
  browser,
}) => {
  test.setTimeout(240000)
  const context = await browser.newContext()
  await context.addCookies([
    { name: 'surflane-locale', value: 'ko', url: 'http://127.0.0.1:8066' },
  ])
  const page = await context.newPage()
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  const routes = [
    '/',
    '/foundations',
    '/components',
    '/patterns',
    '/coverage',
    '/foundations/lab',
    '/patterns/interaction-lab',
    ...catalog.map(itemHref),
  ]
  for (const route of routes) {
    await page.goto('http://127.0.0.1:8066' + route)
    await waitForCatalogReady(page)
    await expect(page.locator('html'), route).toHaveAttribute('lang', 'ko')
  }
  expect(errors).toEqual([])
  await context.close()
})
