import { test, expect, type Page } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })

// A token's color as the browser computes it beside `selector`, in its theme.
const background = (page: Page, token: string, selector: string) =>
  page.evaluate(
    ([name, near]) => {
      const probe = document.createElement('i')
      probe.style.backgroundColor = `var(${name})`
      document.querySelector(near)!.parentElement!.append(probe)
      const color = getComputedStyle(probe).backgroundColor
      probe.remove()
      return color
    },
    [token, selector],
  )
const style = (page: Page, selector: string, property: string) =>
  page
    .locator(selector)
    .first()
    .evaluate(
      (element, name) =>
        getComputedStyle(element).getPropertyValue(name as string),
      property,
    )

test('a read-only field shows its value on the surface plane, without a border', async ({
  page,
}) => {
  await page.goto('/foundations/interaction')
  await waitForCatalogReady(page)
  const input = page.getByRole('textbox', { name: 'Read-only resource ID' })
  const field = '.surf-input[readonly]'
  expect(await style(page, field, 'border-top-color')).toBe('rgba(0, 0, 0, 0)')
  expect(await style(page, field, 'background-color')).toBe(
    await background(page, '--surf-surface', field),
  )
  expect(await style(page, field, 'opacity')).toBe('1')
  // Focus still draws the field's edge and halo, so the value stays reachable.
  await input.focus()
  expect(await style(page, field, 'border-top-color')).not.toBe(
    'rgba(0, 0, 0, 0)',
  )
})

test('read-only number and date fields sit on the same plane', async ({
  page,
}) => {
  await page.goto('/components/number-field')
  await waitForCatalogReady(page)
  await page
    .locator('.surf-number-group')
    .first()
    .evaluate((group) => group.setAttribute('data-readonly', ''))
  expect(await style(page, '.surf-number-group', 'border-top-color')).toBe(
    'rgba(0, 0, 0, 0)',
  )
  expect(await style(page, '.surf-number-group', 'background-color')).toBe(
    await background(page, '--surf-surface', '.surf-number-group'),
  )
  await page.goto('/components/date-picker')
  await waitForCatalogReady(page)
  await page
    .locator('.surf-date-picker')
    .first()
    .evaluate((root) => root.setAttribute('data-readonly', ''))
  const group = '.surf-date-picker[data-readonly] .surf-date-group'
  expect(await style(page, group, 'border-top-color')).toBe('rgba(0, 0, 0, 0)')
  expect(await style(page, group, 'background-color')).toBe(
    await background(page, '--surf-surface', group),
  )
})

test('a disabled date field fades the field and keeps its label readable', async ({
  page,
}) => {
  await page.goto('/components/date-picker')
  await waitForCatalogReady(page)
  await page
    .locator('.surf-date-picker')
    .first()
    .evaluate((root) => root.setAttribute('data-disabled', ''))
  const root = '.surf-date-picker[data-disabled]'
  expect(await style(page, root, 'opacity')).toBe('1')
  expect(await style(page, `${root} .surf-field-label`, 'opacity')).toBe('1')
  expect(
    Number(await style(page, `${root} .surf-date-group`, 'opacity')),
  ).toBeLessThan(1)
})

for (const theme of ['light', 'dark'])
  test(`a slider fills with the brand mark on the surface track in ${theme}`, async ({
    page,
  }) => {
    await page.goto('/components/slider')
    await waitForCatalogReady(page)
    await page.evaluate((name) => {
      document.documentElement.dataset.theme = name
    }, theme)
    const indicator = '.surf-slider-indicator',
      track = '.surf-slider-track'
    expect(await style(page, indicator, 'background-color')).toBe(
      await background(page, '--surf-brand-mark', indicator),
    )
    expect(await style(page, track, 'background-color')).toBe(
      await background(page, '--surf-surface', track),
    )
  })

test('the OTP separator is a short muted dash', async ({ page }) => {
  await page.goto('/components/otp-field')
  await waitForCatalogReady(page)
  const separator = '.surf-otp-separator'
  expect(await style(page, separator, 'background-color')).toBe(
    await background(page, '--surf-ink-muted', separator),
  )
  const box = (await page.locator(separator).first().boundingBox())!
  expect(box.height).toBe(2)
  expect(box.width).toBeGreaterThanOrEqual(8)
})
