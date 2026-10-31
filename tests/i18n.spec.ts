import { test, expect } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'
import { components, pageRoutes } from '../demo/catalog'
import { localePath } from '../demo/router'

test('the language switch moves to the Korean URL, keeps the choice in a cookie and survives a reload', async ({
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
  // Each language has its own URL, so a page can be prerendered in both.
  await expect(page).toHaveURL(/\/ko\/components$/)
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
  // Links stay in the language.
  await page
    .locator('.catalog-sidebar')
    .getByRole('link', { name: 'Button', exact: true })
    .click()
  await expect(page).toHaveURL(/\/ko\/components\/button$/)
  await page.reload()
  await waitForCatalogReady(page)
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko')
  // An English URL is every page's default address: the chosen language wins there.
  await page.goto('/components')
  await waitForCatalogReady(page)
  await expect(page).toHaveURL(/\/ko\/components$/)
  await page
    .locator('.catalog-toprail')
    .getByRole('button', { name: '언어: 한국어', exact: true })
    .click()
  await expect(page).toHaveURL(/\/components$/)
  await expect(page).not.toHaveURL(/\/ko\//)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('#page-title')).toHaveText('Components')
  // A Korean URL stays Korean whatever was chosen; only the default address moves.
  await page.goto('/ko/components')
  await waitForCatalogReady(page)
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko')
})

test('a Korean browser starts in Korean until a language is chosen', async ({
  browser,
}) => {
  const context = await browser.newContext({ locale: 'ko-KR' })
  try {
    const page = await context.newPage()
    await page.goto('http://127.0.0.1:8066/components')
    await waitForCatalogReady(page)
    await expect(page).toHaveURL(/\/ko\/components$/)
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
  const page = await context.newPage()
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  for (const route of pageRoutes) {
    await page.goto('http://127.0.0.1:8066' + localePath('ko', route))
    await waitForCatalogReady(page)
    await expect(page.locator('html'), route).toHaveAttribute('lang', 'ko')
  }
  expect(errors).toEqual([])
  await context.close()
})
// The package's English defaults must not reach a Korean page: every example passes
// its own labels. API tables name parts in English, so header cells are left out.
const packageEnglish = new Set([
  'Breadcrumb',
  'Clear input',
  'Clear selection',
  'Close dialog',
  'Close panel',
  'Copy code',
  'Copy example',
  'Dismiss notification',
  'Example code',
  'Loading',
  'Loading content',
  'Loading preview',
  'Refresh now',
  'Search documentation',
  'Show options',
  'Show suggestions',
  'Time range',
  'View data table',
  'Choose file',
  'Choose files',
  // Every default LabelsProvider carries, which the Korean pages read from it.
  'Collapse sidebar',
  'Expand sidebar',
  'Open navigation',
  'Dismiss',
  'Notifications',
  'Copy',
  'Copied',
  'Copy unavailable',
  'Markdown content',
  'Highlighted source',
  'Pagination',
  'Previous page',
  'Next page',
  'More pages',
  'Refresh interval',
  'Retry',
  'Not set',
  'No items.',
  'Continue dialog navigation',
  'Continue panel navigation',
  'Up arrow',
  'Down arrow',
  'Upload',
  'Remove',
])
test('Korean pages write component labels in Korean', async ({ page }) => {
  test.setTimeout(120_000)
  for (const route of [
    '/ko/components/code',
    '/ko/components/autocomplete',
    '/ko/components/combobox',
    '/ko/charts/chart',
    '/ko/components/file-upload',
    '/ko/components/toast',
    '/ko/foundations/color',
    '/ko/foundations/layers',
    '/ko/patterns/dashboard',
    '/ko/patterns/command-search',
    '/ko/components/pagination',
    '/ko/components/markdown',
    '/ko/components/description-list',
    '/ko/components/banner',
    '/ko/components/kbd',
    '/ko/components/time-range-picker',
    '/ko/components/tree',
    '/ko/patterns/app-shell',
    '/ko/patterns/data-table',
  ]) {
    await page.goto(route)
    await waitForCatalogReady(page)
    const english = await page.evaluate(
      (names) =>
        Array.from(
          document.querySelectorAll(
            '[aria-label], button, label, [role="status"], option',
          ),
        )
          .flatMap((element) => [
            element.getAttribute('aria-label'),
            element.matches('button, label, [role="status"], option')
              ? element.textContent?.trim()
              : null,
          ])
          .filter((text): text is string => !!text && names.includes(text)),
      [...packageEnglish],
    )
    expect(english, route).toEqual([])
  }
})

// An API table's description cells read in Korean on a Korean page: a description
// may hold code and value lists, but no run of English words.
test('Korean API tables describe every prop in Korean', async ({ page }) => {
  test.setTimeout(240_000)
  const untranslated: string[] = []
  for (const item of components.filter((item) => item.stage !== 'planned')) {
    await page.goto(`/ko/components/${item.id}`)
    await waitForCatalogReady(page)
    const cells = await page
      .locator('#api tbody tr td:nth-child(2)')
      .allInnerTexts()
    for (const cell of cells) {
      const prose = cell.replace(/`[^`]*`|[\w.-]*[A-Z][\w.-]*|--[\w-]+/g, '')
      if (
        /\b[a-z]{3,}\s+[a-z]{3,}\s+[a-z]{3,}\b/.test(prose) &&
        !/[가-힣]/.test(cell)
      )
        untranslated.push(`${item.id}: ${cell}`)
    }
  }
  expect(untranslated).toEqual([])
})
