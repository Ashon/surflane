import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
const route = '/components/date-picker'
const picker = (page: Page, label: string) =>
  page.locator('.pui-date-picker').filter({
    has: page.locator('.pui-field-label', {
      hasText: new RegExp(`^${label}$`),
    }),
  })
const dialog = (page: Page) => page.getByRole('dialog')
async function open(page: Page, label = 'Run date') {
  await picker(page, label).locator('.pui-date-trigger').click()
  await expect(dialog(page)).toBeVisible()
}
async function option(page: Page, label: string, value: string) {
  await page.getByRole('combobox', { name: label, exact: true }).click()
  await page.getByRole('option', { name: value, exact: true }).click()
}
async function start(page: Page) {
  await page.goto(route)
  await waitForCatalogReady(page)
}

test('segmented date input, calendar keyboard movement and Escape preserve value and return focus', async ({
  page,
}) => {
  await start(page)
  const day = page.getByRole('spinbutton', {
    name: 'day, Run date',
    exact: true,
  })
  await day.focus()
  await day.press('ArrowUp')
  await expect(page.locator('[data-date-value]')).toContainText('2026-10-21')
  const trigger = picker(page, 'Run date').locator('.pui-date-trigger')
  await trigger.focus()
  await trigger.press('Enter')
  await expect(
    dialog(page).getByRole('button', { name: /Wednesday, October 21/ }),
  ).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Enter')
  await expect(dialog(page)).toHaveCount(0)
  await expect(page.locator('[data-date-value]')).toContainText('2026-10-22')
  await expect(trigger).toBeFocused()
  await trigger.press('Enter')
  await page.keyboard.press('PageDown')
  await expect(dialog(page).getByRole('grid')).toHaveAccessibleName(
    'November 2026',
  )
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await expect(page.locator('[data-date-value]')).toContainText('2026-10-22')
})

test('min/max months and unavailable dates restrict calendar selection', async ({
  page,
}) => {
  await start(page)
  await page
    .getByRole('checkbox', { name: 'Unavailable weekends', exact: true })
    .check()
  await open(page)
  await expect(
    dialog(page).getByRole('button', { name: 'Previous', exact: true }),
  ).toBeDisabled()
  const sunday = dialog(page).getByRole('button', {
    name: /Sunday, October 25/,
  })
  await expect(sunday).toHaveAttribute('aria-disabled', 'true')
  await expect(page.locator('[data-date-value]')).toContainText('2026-10-20')
  await dialog(page).locator('.pui-calendar-nav[slot="next"]').click()
  await dialog(page).locator('.pui-calendar-nav[slot="next"]').click()
  await expect(dialog(page).getByRole('grid')).toHaveAccessibleName(
    'December 2026',
  )
  await expect(
    dialog(page).locator('.pui-calendar-nav[slot="next"]'),
  ).toBeDisabled()
  await page.keyboard.press('Escape')
})

test('range selection commits separate ISO endpoints and native reset restores controlled and uncontrolled fields', async ({
  page,
}) => {
  await start(page)
  await open(page, 'Release window')
  await dialog(page)
    .getByRole('button', { name: /Monday, October 26/ })
    .click()
  await dialog(page)
    .getByRole('button', { name: /Thursday, October 29/ })
    .click()
  await expect(dialog(page)).toHaveCount(0)
  await expect(page.locator('[data-date-value]')).toContainText(
    'range: 2026-10-26 / 2026-10-29',
  )
  const minute = page.getByRole('spinbutton', {
    name: 'minute, Start time',
    exact: true,
  })
  await minute.focus()
  await minute.press('ArrowUp')
  await page
    .getByRole('button', { name: 'Submit local dates', exact: true })
    .click()
  const result = page.getByRole('status', {
    name: 'Date form result',
    exact: true,
  })
  await expect(result).toContainText('"rangeStart":"2026-10-26"')
  await expect(result).toContainText('"rangeEnd":"2026-10-29"')
  await expect(result).toContainText('"startTime":"09:31:00"')
  await page
    .getByRole('button', { name: 'Reset local dates', exact: true })
    .click()
  await expect(page.locator('[data-date-value]')).toContainText(
    'range: 2026-10-20 / 2026-10-23',
  )
  await expect(minute).toHaveAttribute('aria-valuenow', '30')
})

test('required input validation names its error and blocks submission; disabled/readonly retain values', async ({
  page,
}) => {
  await start(page)
  await page
    .getByRole('button', { name: 'Clear run date', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Submit local dates', exact: true })
    .click()
  await expect(
    page.getByRole('status', { name: 'Date form result', exact: true }),
  ).toHaveText('No local form submitted.')
  const root = picker(page, 'Run date')
  await expect(root).toHaveAttribute('data-invalid')
  const focused = root.locator('[role="spinbutton"]:focus')
  await expect(focused).toHaveCount(1)
  await expect(root.locator('.pui-field-error')).toContainText(
    'Choose an available date',
  )
  await expect(focused).toHaveAttribute(
    'aria-describedby',
    new RegExp((await root.locator('.pui-field-error').getAttribute('id'))!),
  )
  await page
    .getByRole('button', { name: 'Reset local dates', exact: true })
    .click()
  await page.getByRole('checkbox', { name: 'Read only', exact: true }).check()
  const day = page.getByRole('spinbutton', {
    name: 'day, Run date',
    exact: true,
  })
  await day.focus()
  await day.press('ArrowUp')
  await expect(day).toHaveAttribute('aria-readonly', 'true')
  await expect(page.locator('[data-date-value]')).toContainText('2026-10-20')
  await page.getByRole('checkbox', { name: 'Read only', exact: true }).uncheck()
  await page
    .getByRole('checkbox', { name: 'Disable date controls', exact: true })
    .check()
  await expect(root.locator('.pui-date-trigger')).toBeDisabled()
  await expect(day).toHaveAttribute('aria-disabled', 'true')
})

test('display zone changes preserve the exact instant while dates remain date-only', async ({
  page,
}) => {
  await start(page)
  const value = page.locator('[data-zoned-value]')
  await expect(value).toContainText('2026-10-20T00:00:00.000Z')
  await page
    .getByRole('button', { name: 'Change display zone', exact: true })
    .click()
  await expect(value).toContainText('[America/New_York]')
  await expect(value).toContainText('2026-10-20T00:00:00.000Z')
  await expect(picker(page, 'Run date').getByRole('spinbutton')).toHaveCount(3)
  await expect(
    page.getByRole('textbox', {
      name: 'time zone, Zoned execution',
      exact: true,
    }),
  ).toBeVisible()
})

test('DST overlaps and gaps reject silently choosing an instant; explicit policies produce distinct UTC instants', async ({
  page,
}) => {
  await start(page)
  const resolve = page.getByRole('button', {
    name: 'Resolve local time',
    exact: true,
  })
  const result = page.getByRole('status', {
    name: 'Resolved local time',
    exact: true,
  })
  await resolve.click()
  await expect(page.getByRole('alert')).toContainText('skipped or occurs twice')
  await expect(result).toHaveText('No instant resolved.')
  await option(page, 'DST disambiguation', 'Explicit earlier instant')
  await resolve.click()
  await expect(result).toContainText('2026-11-01T05:30:00.000Z')
  await option(page, 'DST disambiguation', 'Explicit later instant')
  await resolve.click()
  await expect(result).toContainText('2026-11-01T06:30:00.000Z')
  await page.getByRole('button', { name: 'DST gap', exact: true }).click()
  await option(page, 'DST disambiguation', 'Reject gaps and overlaps')
  await resolve.click()
  await expect(page.getByRole('alert')).toBeVisible()
  await page
    .getByRole('button', { name: 'Normal local time', exact: true })
    .click()
  await resolve.click()
  await expect(result).toContainText('2026-10-20T13:00:00.000Z')
  await expect(page.getByRole('alert')).toHaveCount(0)
})

for (const theme of ['light', 'dark']) {
  test(`localized popup is contained and accessible at 320px in ${theme}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 })
    await start(page)
    await page.evaluate(
      (theme) => (document.documentElement.dataset.theme = theme),
      theme,
    )
    await option(page, 'Locale', 'Korean / South Korea')
    expect(
      await page.locator('#preview').getByRole('spinbutton').count(),
    ).toBeGreaterThan(10)
    await open(page)
    await expect(dialog(page).getByRole('grid')).toHaveAccessibleName(
      '2026년 10월',
    )
    const bounds = await dialog(page).boundingBox()
    expect(bounds!.x).toBeGreaterThanOrEqual(0)
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320)
    expect(
      await dialog(page).evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true)
    expect(
      await page.evaluate(() => document.body.scrollWidth <= innerWidth),
    ).toBe(true)
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    await page.keyboard.press('Escape')
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  })
}

test('typed dates and times outside their bounds surface errors and prevent native form submission', async ({
  page,
}) => {
  await start(page)
  const month = page.getByRole('spinbutton', {
    name: 'month, Run date',
    exact: true,
  })
  await month.focus()
  await month.press('9')
  await month.press('Tab')
  await page
    .getByRole('button', { name: 'Submit local dates', exact: true })
    .click()
  await expect(picker(page, 'Run date')).toHaveAttribute('data-invalid')
  await expect(
    picker(page, 'Run date').locator('.pui-field-error'),
  ).toBeVisible()
  await expect(
    page.getByRole('status', { name: 'Date form result', exact: true }),
  ).toHaveText('No local form submitted.')
  await page
    .getByRole('button', { name: 'Reset local dates', exact: true })
    .click()
  const hour = page.getByRole('spinbutton', {
    name: 'hour, Start time',
    exact: true,
  })
  await hour.focus()
  await hour.press('8')
  await hour.press('Tab')
  await page
    .getByRole('button', { name: 'Submit local dates', exact: true })
    .click()
  await expect(page.locator('.pui-time-field')).toHaveAttribute('data-invalid')
  await expect(page.locator('.pui-time-field .pui-field-error')).toContainText(
    '09:00 through 18:00',
  )
})

test('ranges cannot bridge unavailable weekends', async ({ page }) => {
  await start(page)
  await page
    .getByRole('checkbox', { name: 'Unavailable weekends', exact: true })
    .check()
  await open(page, 'Release window')
  await dialog(page)
    .getByRole('button', { name: /Friday, October 23, 2026 selected$/ })
    .click()
  await expect(
    dialog(page).getByRole('button', { name: /Monday, October 26/ }),
  ).toHaveAttribute('aria-disabled', 'true')
  await expect(page.locator('[data-date-value]')).toContainText(
    'range: 2026-10-20 / 2026-10-23',
  )
  await page.keyboard.press('Escape')
})

test('RTL calendar keeps localized direction, focus and real touch selection', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:8066' + route)
  await waitForCatalogReady(page)
  await option(page, 'Locale', 'العربية / Gregorian')
  await picker(page, 'Run date').locator('.pui-date-trigger').tap()
  await expect(dialog(page)).toBeVisible()
  expect(
    await dialog(page)
      .locator('.pui-calendar')
      .evaluate((el) => getComputedStyle(el).direction),
  ).toBe('rtl')
  await dialog(page)
    .locator('.pui-calendar-day:not([data-outside-month])')
    .filter({ hasText: /^٢٢$/ })
    .tap()
  await expect(dialog(page)).toHaveCount(0)
  await expect(page.locator('[data-date-value]')).toContainText('2026-10-22')
  expect(
    await page.evaluate(() => document.body.scrollWidth <= innerWidth),
  ).toBe(true)
  await context.close()
})
