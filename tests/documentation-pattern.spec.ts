import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
const route = '/patterns/documentation'
async function korean(page: Page) {
  await page.getByRole('combobox', { name: 'Document language' }).click()
  await page.getByRole('option', { name: 'Korean', exact: true }).click()
}
test('localized documents retain anchor IDs, heading focus and current section without remounting the preview', async ({
  page,
}) => {
  await page.goto(route)
  await waitForCatalogReady(page)
  const article = page.getByRole('article')
  await expect(article).toHaveAttribute('lang', 'en')
  const before = await article.locator('p').count()
  await page.getByRole('checkbox', { name: 'Long document' }).check()
  expect(await article.locator('p').count()).toBeGreaterThan(before)
  const contents = page.getByRole('navigation', {
    name: 'In this guide',
    exact: true,
  })
  const link = contents.getByRole('link', {
    name: 'Preview configuration',
    exact: true,
  })
  await link.click()
  await expect(page).toHaveURL(/#guide-preview-configure$/)
  await expect(page.locator('#guide-preview-configure')).toBeFocused()
  await expect(link).toHaveAttribute('aria-current', 'location')
  await korean(page)
  await expect(article).toHaveAttribute('lang', 'ko')
  await expect(page.locator('#guide-preview-configure')).toHaveText(
    '미리보기 설정',
  )
  await expect(
    page.getByRole('checkbox', { name: 'Long document' }),
  ).toBeChecked()
  await expect(
    page.getByRole('combobox', { name: 'Document language' }),
  ).toBeFocused()
  const toc = page.getByRole('navigation', {
    name: '이 문서의 목차',
    exact: true,
  })
  await toc.getByRole('link', { name: '다음 단계', exact: true }).click()
  await expect(page.locator('#guide-preview-next')).toBeFocused()
  await page
    .locator('.catalog-document-scroll')
    .evaluate((e) => e.scrollTo(0, 0))
  await expect(
    toc.getByRole('link', { name: '시작하기 전에', exact: true }),
  ).toHaveAttribute('aria-current', 'location')
  await expect(page.locator('#guide-preview-next')).toBeFocused()
  await page
    .getByRole('link', { name: '폼 워크플로 살펴보기', exact: true })
    .press('Enter')
  await waitForCatalogReady(page)
  await expect(page.locator('#page-title')).toHaveText('Form workflow')
  await expect(page.locator('#page-title')).toBeFocused()
})
test('direct section links load after lazy content and the document viewport scrolls to the section', async ({
  page,
}) => {
  await page.goto(route + '#guide-preview-configure')
  await waitForCatalogReady(page)
  await page.evaluate(() => document.fonts.ready)
  await expect
    .poll(async () => {
      const r = await page.locator('#guide-preview-configure').boundingBox()
      return !!r && r.y >= 64 && r.y <= 200
    })
    .toBe(true)
  await expect(
    page
      .getByRole('navigation', { name: 'In this guide' })
      .getByRole('link', { name: 'Preview configuration', exact: true }),
  ).toHaveAttribute('aria-current', 'location')
  await page.reload()
  await waitForCatalogReady(page)
  await expect(page.locator('#guide-preview-configure')).toBeInViewport()
})
test('sample code copy uses translated announcements and long code stays in its own scroll area', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 1000 })
  await page.goto(route)
  await waitForCatalogReady(page)
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          ;(window as any).copiedGuide = text
        },
      },
    }),
  )
  await page
    .getByRole('button', { name: 'Copy sample configuration', exact: true })
    .click()
  await expect(
    page.locator('.documentation-article .surf-code-copy'),
  ).toHaveText('Copied')
  expect(await page.evaluate(() => (window as any).copiedGuide)).toContain(
    "mode: 'read-only'",
  )
  const code = page
    .locator('.documentation-article .surf-code-block')
    .getByRole('region', {
      name: 'Sample configuration',
      exact: true,
    })
  await code.focus()
  await page.keyboard.press('ArrowRight')
  await expect.poll(() => code.evaluate((e) => e.scrollLeft)).toBeGreaterThan(0)
  await page.getByRole('checkbox', { name: 'Wrap sample code' }).check()
  await expect(
    page.locator('.documentation-article .surf-code-block'),
  ).toHaveAttribute('data-wrap')
  expect(
    await page
      .locator('.catalog-document-scroll')
      .evaluate((e) => e.scrollWidth <= e.clientWidth),
  ).toBe(true)
})
test('long guides retain reading geometry, accessible headings and responsive contents in both themes', async ({
  page,
}) => {
  await page.goto(route)
  await waitForCatalogReady(page)
  await page.getByRole('checkbox', { name: 'Long document' }).check()
  for (const dark of [false, true]) {
    if (dark) {
      await page.getByRole('button', { name: 'Toggle theme: Light' }).click()
      await expect(page.locator('html')).not.toHaveAttribute(
        'data-theme-switching',
      )
    }
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 1000 })
      await expect
        .poll(() =>
          page
            .locator('.catalog-document-scroll')
            .evaluate((e) => e.scrollWidth <= e.clientWidth),
        )
        .toBe(true)
      const toc = (await page.locator('.documentation-toc').boundingBox())!,
        article = (await page.getByRole('article').boundingBox())!
      if (width === 320) expect(toc.y + toc.height).toBeLessThan(article.y)
      else expect(toc.x).toBeGreaterThan(article.x + article.width)
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    }
  }
  await page.getByRole('button', { name: 'In this guide', exact: true }).click()
  await expect(
    page.getByRole('navigation', { name: 'In this guide', exact: true }),
  ).toBeHidden()
  await page.getByRole('button', { name: 'In this guide', exact: true }).click()
  await expect(
    page.getByRole('navigation', { name: 'In this guide', exact: true }),
  ).toBeVisible()
})
