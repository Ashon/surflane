import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { components, patterns } from '../demo/catalog'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
test('global areas and contextual destinations remain separate and registry complete', async ({
  page,
}) => {
  await page.goto('/components/toast')
  await waitForCatalogReady(page)
  const primary = page.getByRole('navigation', { name: 'Primary navigation' })
  const local = page.getByRole('navigation', {
    name: 'Catalog navigation',
    exact: true,
  })
  await expect(primary.getByRole('link')).toHaveCount(6)
  await expect(
    primary.getByRole('link', { name: 'Components', exact: true }),
  ).toHaveAttribute('aria-current', 'location')
  await expect(local.getByRole('link')).toHaveCount(components.length + 1)
  await expect(
    local.getByRole('link', { name: 'Toast', exact: true }),
  ).toHaveAttribute('aria-current', 'page')
  await expect(
    local.getByRole('link', { name: 'Overview', exact: true }),
  ).toHaveCount(0)
  await primary.getByRole('link', { name: 'Patterns', exact: true }).click()
  await waitForCatalogReady(page)
  await expect(page.locator('#page-title')).toBeFocused()
  await expect(local.getByRole('link')).toHaveCount(patterns.length + 2)
  await primary.getByRole('link', { name: 'Overview', exact: true }).click()
  await waitForCatalogReady(page)
  await local
    .getByRole('link', { name: 'Design direction', exact: true })
    .click()
  await expect(page).toHaveURL(/#overview-direction$/)
  await expect
    .poll(() =>
      page.locator('.catalog-document-scroll').evaluate((e) => e.scrollTop),
    )
    .toBeGreaterThan(0)
})
test('narrow rail reveals active sections and contextual navigation closes after choosing a page', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.goto('/coverage')
  await waitForCatalogReady(page)
  const primary = page.getByRole('navigation', { name: 'Primary navigation' })
  const link = primary.getByRole('link', { name: 'Coverage', exact: true })
  const bounds = (await link.boundingBox())!
  expect(bounds.x).toBeGreaterThanOrEqual(0)
  const railBounds = (await page
    .locator('.catalog-primary-viewport')
    .boundingBox())!
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(
    railBounds.x + railBounds.width + 1,
  )
  await primary.getByRole('link', { name: 'Components', exact: true }).click()
  await waitForCatalogReady(page)
  const toggle = page.getByRole('button', { name: 'Browse catalog' })
  await toggle.click()
  await page
    .getByRole('navigation', { name: 'Catalog navigation', exact: true })
    .getByRole('link', { name: 'Button', exact: true })
    .click()
  await waitForCatalogReady(page)
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(
    await page
      .locator('.catalog-document-scroll')
      .evaluate((e) => e.scrollWidth <= e.clientWidth),
  ).toBe(true)
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})
test.describe('touch rail', () => {
  test.use({ hasTouch: true, isMobile: true })
  test('a tap on the lower edge of an overflowing rail tab opens it instead of hitting the scrollbar', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/components')
    await waitForCatalogReady(page)
    await expect(page.locator('.catalog-primary-scroll')).toHaveAttribute(
      'data-overflow-x-end',
    )
    const link = page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Foundations', exact: true })
    const bounds = (await link.boundingBox())!
    // The horizontal scrollbar overlays the tabs' lower edge.
    await page.touchscreen.tap(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height - 4,
    )
    await waitForCatalogReady(page)
    await expect(page).toHaveURL(/\/foundations$/)
  })
})

test('one rail button rotates themes and persists the choice across reloads', async ({
  page,
}) => {
  await page.goto('/')
  await waitForCatalogReady(page)
  const button = page
    .locator('.catalog-toprail')
    .getByRole('button', { name: /Toggle theme/ })
  await expect(page.getByRole('button', { name: /Toggle theme/ })).toHaveCount(
    1,
  )
  await expect(button).toHaveAttribute('data-size', 'icon')
  await expect(button).toHaveText('')
  for (const [mode, label] of [
    ['dark', 'Dark'],
    ['system', 'System'],
    ['light', 'Light'],
  ]) {
    await button.click()
    await expect(button).toHaveAccessibleName(`Toggle theme: ${label}`)
    await expect
      .poll(
        async () =>
          (await page.context().cookies()).find(
            (c) => c.name === 'surflane-theme',
          )?.value,
      )
      .toBe(mode)
    await expect(page.locator('html')).not.toHaveAttribute(
      'data-theme-switching',
    )
  }
  await button.click()
  await page.reload()
  await waitForCatalogReady(page)
  await expect(button).toHaveAccessibleName('Toggle theme: Dark')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('the rail fade stays inside its bounds at the top and returns after scrolling', async ({
  page,
}) => {
  await page.goto('/components')
  await waitForCatalogReady(page)
  const rail = page.locator('.catalog-toprail')
  const doc = page.locator('.catalog-document-scroll')
  const fadeBottom = () =>
    rail.evaluate((e) => getComputedStyle(e, '::before').bottom)
  await expect(rail).not.toHaveAttribute('data-scrolled')
  expect(await fadeBottom()).toBe('0px')
  await doc.evaluate((e) => e.scrollTo(0, 300))
  await expect(rail).toHaveAttribute('data-scrolled')
  expect(await fadeBottom()).toBe('-24px')
  await doc.evaluate((e) => e.scrollTo(0, 0))
  await expect(rail).not.toHaveAttribute('data-scrolled')
  expect(await fadeBottom()).toBe('0px')
  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Coverage', exact: true })
    .click()
  await waitForCatalogReady(page)
  await expect(rail).not.toHaveAttribute('data-scrolled')
})

test('circular theme button shares the surface and timing of an idle rail link', async ({
  page,
}) => {
  await page.goto('/')
  await waitForCatalogReady(page)
  const button = page.locator('.catalog-theme-toggle')
  const link = page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Components', exact: true })
  const style = (el: typeof button) =>
    el.evaluate((e) => {
      const s = getComputedStyle(e)
      return {
        background: s.backgroundColor,
        duration: s.transitionDuration,
        filter: s.filter,
      }
    })
  await link.hover()
  const hovered = await style(link)
  await button.hover()
  expect(await style(button)).toEqual(hovered)
  await button.focus()
  await expect(button).toHaveCSS('outline-style', 'solid')
})

test('document content passes behind the translucent rail while its controls stay opaque', async ({
  page,
}) => {
  await page.goto('/components')
  await waitForCatalogReady(page)
  const rail = page.locator('.catalog-toprail'),
    doc = page.locator('.catalog-document-scroll')
  expect((await doc.boundingBox())!.y).toBe(0)
  await expect(rail).toHaveCSS('opacity', '1')
  const surface = await rail.evaluate((e) => {
    const s = getComputedStyle(e, '::before')
    return { filter: s.backdropFilter, background: s.backgroundColor }
  })
  expect(surface.filter).toBe('blur(14px)')
  expect(surface.background).toMatch(/0\.8/)
  await doc.evaluate((e) => e.scrollTo(0, 200))
  expect((await page.getByRole('main').boundingBox())!.y).toBeLessThan(0)
  await expect(rail).toHaveAttribute('data-scrolled')
  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Foundations', exact: true })
    .click()
  await waitForCatalogReady(page)
  await expect(page.locator('#page-title')).toBeFocused()
  await expect(rail).not.toHaveAttribute('data-scrolled')
})

test('current sidebar item stays clear of full-width edge fades on entry and resize', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 800 })
  await page.goto('/components/code')
  await waitForCatalogReady(page)
  const active = page
    .getByRole('navigation', { name: 'Catalog navigation', exact: true })
    .getByRole('link', { name: 'Code block', exact: true })
  const viewport = page.locator('.catalog-navigation-viewport')
  const gap = async () => {
    const a = (await active.boundingBox())!,
      v = (await viewport.boundingBox())!
    return Math.min(a.y - v.y, v.y + v.height - a.y - a.height)
  }
  await expect.poll(gap).toBeGreaterThanOrEqual(15)
  const scroll = page.locator('.catalog-navigation-scroll')
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Skip to content', exact: true }),
  ).toBeFocused()
  await page.setViewportSize({ width: 1440, height: 520 })
  await expect.poll(gap).toBeGreaterThanOrEqual(15)
  // The list's edges fade through its viewport's mask, across its full width.
  await expect(scroll).toHaveAttribute('data-overflow-y-end')
  expect(
    await viewport.evaluate((el) => getComputedStyle(el).maskImage),
  ).toContain('linear-gradient')
  await page.setViewportSize({ width: 1440, height: 1000 })
  await expect.poll(gap).toBeGreaterThanOrEqual(15)
  await viewport.focus()
  const bar = scroll.locator(
    ':scope > .surf-scrollbar[data-orientation="vertical"]',
  )
  await expect(bar).toHaveCSS('opacity', '1')
  // The bar sits beside the masked viewport, so the fade never dims it.
  expect(
    await bar.evaluate((el) => el.closest('.catalog-navigation-viewport')),
  ).toBeNull()
  await expect(bar).toHaveCSS('mask-image', 'none')
})

test('mobile catalog opens as a centered bottom sheet, traps focus and preserves document position', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/components')
  await waitForCatalogReady(page)
  const toggle = page.getByRole('button', { name: 'Browse catalog' })
  const theme = page.getByRole('button', { name: /Toggle theme/ })
  const buttonBounds = (await toggle.boundingBox())!
  const themeBounds = (await theme.boundingBox())!
  expect(buttonBounds.width).toBe(44)
  expect(buttonBounds.height).toBe(44)
  expect(buttonBounds.y).toBe(themeBounds.y)
  await page
    .locator('.catalog-document-scroll')
    .evaluate((el) => el.scrollTo(0, 240))
  const before = await page.locator('main.sheet').boundingBox()
  await toggle.click()
  const nav = page.getByRole('navigation', {
    name: 'Catalog navigation',
    exact: true,
  })
  await expect(nav).toBeVisible()
  const sheet = page.getByRole('dialog', {
    name: 'Components navigation',
    exact: true,
  })
  await expect(sheet).not.toHaveAttribute('data-starting-style', '')
  const panel = (await sheet.boundingBox())!
  expect(panel.x + panel.width / 2).toBeCloseTo(195, 0)
  expect(panel.y + panel.height).toBeCloseTo(844, 0)
  expect(await page.locator('main.sheet').boundingBox()).toEqual(before)
  await page.keyboard.press('Tab')
  expect(
    await page
      .locator('.catalog-mobile-navigation')
      .evaluate((el) => el.contains(document.activeElement)),
  ).toBe(true)
  await page.keyboard.press('Escape')
  await expect(toggle).toBeFocused()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await expect(sheet).toBeVisible()
  const close = sheet.getByRole('button', { name: 'Close menu', exact: true })
  // The close action fills the footer's content box.
  const footer = await close.evaluate((el) => {
    const box = el.parentElement!
    const style = getComputedStyle(box)
    return (
      box.clientWidth -
      parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight)
    )
  })
  expect((await close.boundingBox())!.width).toBeCloseTo(footer, 0)
  await close.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle).toBeFocused()
  await toggle.click()
  await expect(sheet).toBeVisible()
  await page.mouse.click(4, 4)
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await nav.getByRole('link', { name: 'Textarea', exact: true }).click()
  await waitForCatalogReady(page)
  await expect(page.locator('#page-title')).toHaveText('Textarea')
  await expect(page.locator('#page-title')).toBeFocused()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await page.setViewportSize({ width: 1200, height: 900 })
  await expect(toggle).toBeHidden()
  await expect(nav).toBeVisible()
})

for (const theme of ['light', 'dark']) {
  test(`mobile menu keeps current rows clear of its edges on reopen in ${theme}`, async ({
    page,
    context,
  }) => {
    await context.addCookies([
      { name: 'surflane-theme', value: theme, url: 'http://127.0.0.1:8066' },
    ])
    await page.setViewportSize({ width: 473, height: 844 })
    await page.goto('/components')
    await waitForCatalogReady(page)
    const toggle = page.getByRole('button', { name: 'Browse catalog' })
    const viewport = page.locator('.catalog-navigation-viewport')
    const root = page.locator('.catalog-navigation-scroll')
    const active = page
      .getByRole('navigation', { name: 'Catalog navigation', exact: true })
      .getByRole('link', { name: 'All components', exact: true })
    await toggle.click()
    await expect(
      page.getByRole('dialog', { name: 'Components navigation', exact: true }),
    ).toBeVisible()
    await viewport.evaluate((el) => el.scrollTo(0, 20))
    await expect(root).toHaveAttribute('data-overflow-y-start')
    for (const edge of ['::before', '::after']) {
      expect(
        await root.evaluate(
          (el, edge) => getComputedStyle(el, edge).display,
          edge,
        ),
      ).toBe('none')
    }
    await page.keyboard.press('Escape')
    await toggle.click()
    await expect
      .poll(async () => {
        const item = (await active.boundingBox())!,
          bounds = (await viewport.boundingBox())!
        return Math.min(
          item.y - bounds.y,
          bounds.y + bounds.height - item.y - item.height,
        )
      })
      .toBeGreaterThanOrEqual(15)
    await expect(viewport).toHaveJSProperty('scrollTop', 0)
    await page.keyboard.press('Escape')
    await expect(toggle).toBeFocused()
  })
}

test('bottom navigation supports same-page anchors and restores the destination focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await waitForCatalogReady(page)
  await page.getByRole('button', { name: 'Browse catalog' }).click()
  const sheet = page.getByRole('dialog', {
    name: 'Overview navigation',
    exact: true,
  })
  await sheet
    .getByRole('link', { name: 'Design direction', exact: true })
    .click()
  await expect(sheet).toBeHidden()
  await expect(page.locator('#overview-direction')).toBeFocused()
  await expect(page).toHaveURL(/#overview-direction$/)
})
