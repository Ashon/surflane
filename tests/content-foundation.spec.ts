import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
async function choose(page: Page, name: string, option: string) {
  await page.getByRole('combobox', { name, exact: true }).click()
  await page.getByRole('option', { name: option, exact: true }).click()
}
const value = (page: Page, index: number) =>
  page.locator(`dd[data-content-value="${index}"]`)

test('locale changes complete sentences, currency and precision while zero stays distinct from missing', async ({
  page,
}) => {
  await page.goto('/foundations/content')
  await waitForCatalogReady(page)
  await expect(page.locator('#page-title')).toHaveText(
    'Content and localization',
  )
  await expect(
    page.getByRole('group', { name: 'Localized format preview' }),
  ).toHaveAttribute('lang', 'en-US')
  await expect(value(page, 0)).toHaveText('1 recorded run')
  await expect(value(page, 6)).toHaveText('0')
  await expect(value(page, 7)).toHaveText('Not available yet')
  await page.getByRole('combobox', { name: 'Formatting locale' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('listbox')).toBeVisible()
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('group', { name: 'Localized format preview' }),
  ).toHaveAttribute('lang', 'ko-KR')
  await expect(value(page, 0)).toHaveText('기록된 실행 1개')
  await expect(value(page, 7)).toHaveText('아직 제공되지 않음')
  await choose(page, 'Formatting locale', 'English / United States')
  await expect(value(page, 0)).toHaveText('1 recorded run')
  await choose(page, 'Recorded run count', '0')
  await expect(value(page, 0)).toHaveText('0 recorded runs')
  await choose(page, 'Recorded run count', '12')
  await expect(value(page, 0)).toHaveText('12 recorded runs')
  await expect(value(page, 1)).toHaveText('$1,234.50')
  await expect(value(page, 2)).toHaveText('87.5%')
  await expect(value(page, 5)).toHaveText('5 minutes ago')
  await expect(value(page, 7)).toHaveText('Not available yet')
})

test('explicit time zone handles spring skipped time and autumn repeated time without changing the source instant', async ({
  page,
}) => {
  await page.goto('/foundations/content')
  await waitForCatalogReady(page)
  await choose(page, 'Formatting locale', 'English / United States')
  await choose(page, 'Display time zone', 'America/New_York')
  const time = page.locator('time[data-content-value=instant]')
  await expect(time).toContainText('01:30')
  await expect(time).toContainText('GMT-5')
  await expect(time).toHaveAttribute('datetime', '2026-03-08T06:30:00.000Z')
  await choose(page, 'Source instant (UTC)', 'After spring DST change')
  await expect(time).toContainText('03:30')
  await expect(time).toContainText('GMT-4')
  await choose(page, 'Source instant (UTC)', 'First autumn 01:30')
  await expect(time).toContainText('01:30')
  await expect(time).toContainText('GMT-4')
  await choose(page, 'Source instant (UTC)', 'Second autumn 01:30')
  await expect(time).toContainText('01:30')
  await expect(time).toContainText('GMT-5')
  await expect(time).toHaveAttribute('datetime', '2026-11-01T06:30:00.000Z')
  await choose(page, 'Display time zone', 'UTC')
  await expect(time).toContainText('06:30')
  await expect(page.locator('[data-source-instant]')).toHaveText(
    '2026-11-01T06:30:00Z',
  )
})

test('explicit locale and time zone are independent of browser settings', async ({
  browser,
}) => {
  const results: string[] = []
  for (const timezoneId of ['UTC', 'Pacific/Honolulu']) {
    const context = await browser.newContext({ locale: 'de-DE', timezoneId })
    const page = await context.newPage()
    await page.goto('/foundations/content')
    await waitForCatalogReady(page)
    results.push((await value(page, 3).textContent())!)
    await expect(value(page, 4)).toHaveText('Asia/Seoul')
    await context.close()
  }
  expect(results[0]).toBe(results[1])
  expect(results[0]).toContain('15:30')
})

test('mixed direction names are isolated, preserve identifiers and render user input as text', async ({
  page,
}) => {
  await page.goto('/foundations/content')
  await waitForCatalogReady(page)
  await page.getByRole('checkbox', { name: 'RTL preview' }).check()
  const preview = page.getByRole('group', { name: 'Mixed direction preview' })
  await expect(preview).toHaveAttribute('dir', 'rtl')
  await expect(preview).toHaveAttribute('lang', 'en')
  const input = page.getByRole('textbox', { name: 'Resource name preview' })
  await input.fill('مشروع طويل / demo-e2e-42')
  await expect(preview.locator('[data-resource-name]')).toHaveCSS(
    'direction',
    'rtl',
  )
  await expect(preview.locator('.content-identifier')).toHaveAttribute(
    'dir',
    'ltr',
  )
  await input.fill('<img src=x onerror=alert(1)>')
  await expect(preview.locator('[data-resource-name]')).toHaveText(
    '<img src=x onerror=alert(1)>',
  )
  await expect(preview.locator('img')).toHaveCount(0)
  await input.fill('긴이름'.repeat(80))
  await page.setViewportSize({ width: 320, height: 900 })
  expect(
    await page
      .locator('.catalog-document-scroll')
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true)
})
for (const width of [1440, 320])
  for (const dark of [false, true])
    test(`localized guide passes axe at ${width}px dark=${dark}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto('/foundations/content')
      await waitForCatalogReady(page)
      if (dark) await page.getByRole('button', { name: 'Toggle theme' }).click()
      await choose(page, 'Formatting locale', 'English / United States')
      await page.getByRole('checkbox', { name: 'RTL preview' }).check()
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    })
