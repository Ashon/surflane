import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
test('collapse keeps icons fixed, names accessible and account at the bottom', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/patterns/app-shell')
  await waitForCatalogReady(page)
  const sidebar = page.getByRole('complementary', {
    name: 'Example workspace sidebar',
  })
  const resources = sidebar.getByRole('link', {
    name: 'Resources',
    exact: true,
  })
  const expandedToggle = page.getByRole('button', {
    name: 'Collapse workspace sidebar',
    exact: true,
  })
  const expandedBounds = (await expandedToggle.boundingBox())!
  expect(expandedBounds.width).toBe(32)
  expect(expandedBounds.height).toBe(expandedBounds.width)
  const x = (await resources.locator('svg').boundingBox())!.x
  const account = sidebar.getByRole('button', {
    name: 'Preview user account menu',
  })
  const bottom = (await account.boundingBox())!.y
  await page.getByRole('button', { name: 'Collapse workspace sidebar' }).click()
  await expect(page.locator('.app-shell-preview')).toHaveAttribute(
    'data-sidebar',
    'collapsed',
  )
  const collapsedToggle = page.getByRole('button', {
    name: 'Expand workspace sidebar',
    exact: true,
  })
  const collapsedBounds = (await collapsedToggle.boundingBox())!
  expect(collapsedBounds.width).toBe(40)
  expect(collapsedBounds.height).toBe(collapsedBounds.width)
  expect((await resources.locator('svg').boundingBox())!.x).toBe(x)
  expect((await account.boundingBox())!.y).toBe(bottom)
  await resources.press('Enter')
  await expect(resources).toHaveAttribute('aria-current', 'page')
  await expect(
    page.getByRole('heading', { name: 'Resources', exact: true }),
  ).toBeFocused()
  await account.click()
  await page.getByRole('menuitem', { name: 'View preview profile' }).click()
  await expect(
    page.locator('.app-shell-preview').getByRole('status'),
  ).toContainText('no account service')
  await expect(account).toBeFocused()
})
test('mobile sheet restores focus on Escape and moves focus to the selected page on navigation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.goto('/patterns/app-shell')
  await waitForCatalogReady(page)
  const trigger = page.getByRole('button', {
    name: 'Open workspace navigation',
  })
  await trigger.click()
  const panel = page.getByRole('dialog', {
    name: 'Workspace navigation',
    exact: true,
  })
  await expect(panel).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(panel).toBeHidden()
  await expect(trigger).toBeFocused()
  await trigger.click()
  await panel.getByRole('link', { name: 'Settings', exact: true }).click()
  await expect(panel).toBeHidden()
  await expect(
    page.getByRole('heading', { name: 'Settings', exact: true }),
  ).toBeFocused()
  await trigger.click()
  await page.setViewportSize({ width: 1440, height: 1000 })
  await expect(panel).toBeHidden()
})
test('shell options preserve state, reflow at 320px and pass both theme audits', async ({
  page,
}) => {
  await page.goto('/patterns/app-shell')
  await waitForCatalogReady(page)
  await expect(page.locator('.app-shell-brand')).toHaveText('Surflane')
  for (const dark of [false, true]) {
    if (dark) {
      await page.setViewportSize({ width: 1440, height: 1000 })
      await page
        .getByRole('button', { name: 'Preview user account menu' })
        .click()
      await page.getByRole('menuitem', { name: 'Switch theme' }).click()
      await expect(page.locator('html')).not.toHaveAttribute(
        'data-theme-switching',
      )
    }
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 1000 })
      expect(
        await page
          .locator('.catalog-document-scroll')
          .evaluate((e) => e.scrollWidth <= e.clientWidth),
      ).toBe(true)
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    }
  }
})

test('workspace benchmark keeps brand and account fixed while menu and body scroll independently', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/patterns/app-shell')
  await waitForCatalogReady(page)
  const shell = page.locator('.app-shell-preview')
  await expect(shell).toHaveAttribute('data-layout', 'workspace')
  await expect(
    page.locator('.catalog-example-frame[data-kind="pattern"]'),
  ).toHaveCSS('border-top-width', '1px')
  await page
    .getByRole('checkbox', { name: 'Overflow navigation', exact: true })
    .check()
  await page
    .getByRole('checkbox', { name: 'Long workspace content', exact: true })
    .check()
  const menu = page.getByRole('region', {
    name: 'Workspace destinations',
    exact: true,
  })
  const content = page.getByRole('region', {
    name: 'Workspace content',
    exact: true,
  })
  const account = page.getByRole('button', {
    name: 'Preview user account menu',
  })
  const brand = page.locator('.app-shell-brand')
  await content.scrollIntoViewIfNeeded()
  const accountY = (await account.boundingBox())!.y,
    brandY = (await brand.boundingBox())!.y
  await expect
    .poll(() => menu.evaluate((el) => el.scrollHeight > el.clientHeight))
    .toBe(true)
  await expect
    .poll(() => content.evaluate((el) => el.scrollHeight > el.clientHeight))
    .toBe(true)
  await content.evaluate((el) => (el.scrollTop = 240))
  await expect
    .poll(() => content.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(100)
  expect(await menu.evaluate((el) => el.scrollTop)).toBe(0)
  await menu.evaluate((el) => (el.scrollTop = 200))
  await expect
    .poll(() => menu.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(100)
  expect((await account.boundingBox())!.y).toBe(accountY)
  expect((await brand.boundingBox())!.y).toBe(brandY)
  await page.getByRole('button', { name: 'Collapse workspace sidebar' }).click()
  await expect
    .poll(() =>
      page
        .getByRole('complementary', { name: 'Example workspace sidebar' })
        .evaluate((el) => el.getBoundingClientRect().width),
    )
    .toBe(72)
  expect((await account.boundingBox())!.y).toBe(accountY)
  await page.getByRole('button', { name: 'Expand workspace sidebar' }).click()
  await expect
    .poll(() =>
      page
        .getByRole('complementary', { name: 'Example workspace sidebar' })
        .evaluate((el) => el.getBoundingClientRect().width),
    )
    .toBe(224)
  await content.focus()
  await content.press('Home')
  await content.press('PageDown')
  await expect
    .poll(() => content.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(100)
  // Let the keyboard scroll animation finish; Chromium keeps applying it after a programmatic reset.
  await expect
    .poll(async () => {
      const before = await content.evaluate((el) => el.scrollTop)
      await page.waitForTimeout(50)
      return before === (await content.evaluate((el) => el.scrollTop))
    })
    .toBe(true)
  await menu.getByRole('link', { name: 'Saved view 16', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Saved view 16', exact: true }),
  ).toBeFocused()
  expect(await content.evaluate((el) => el.scrollTop)).toBe(0)
})

test('long content scrolls with the wheel and thumb, then hands the wheel to the document at its edge', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1100 })
  await page.goto('/patterns/app-shell')
  await waitForCatalogReady(page)
  await page
    .getByRole('checkbox', { name: 'Long workspace content', exact: true })
    .check()
  const content = page.getByRole('region', {
    name: 'Workspace content',
    exact: true,
  })
  const root = page.locator('.app-shell-content-scroll')
  const outer = page.locator('.catalog-document-scroll')
  await content.scrollIntoViewIfNeeded()
  const outerTop = await outer.evaluate((el) => el.scrollTop)
  await content.hover()
  await page.mouse.wheel(0, 320)
  await expect
    .poll(() => content.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(100)
  const bar = root.locator('.pui-scrollbar[data-orientation="vertical"]')
  await expect(bar).toHaveCSS('opacity', '1')
  expect(await outer.evaluate((el) => el.scrollTop)).toBe(outerTop)
  const bounds = (await content.boundingBox())!
  await page.mouse.move(bounds.x + bounds.width - 4, bounds.y + 30)
  const thumb = root.locator('.pui-scroll-thumb')
  await expect(thumb).toBeVisible()
  const before = await content.evaluate((el) => el.scrollTop)
  const handle = (await thumb.boundingBox())!
  await page.mouse.move(
    handle.x + handle.width / 2,
    handle.y + handle.height / 2,
  )
  await page.mouse.down()
  await page.mouse.move(
    handle.x + handle.width / 2,
    handle.y + handle.height / 2 + 70,
    { steps: 6 },
  )
  await page.mouse.up()
  await expect
    .poll(() => content.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(before)
  // Embedded in a document, both regions chain to the page at their edges instead of trapping the wheel.
  await expect(content).toHaveCSS('overscroll-behavior-y', 'auto')
  await expect(
    page.getByRole('region', { name: 'Workspace destinations', exact: true }),
  ).toHaveCSS('overscroll-behavior-y', 'auto')
  await content.evaluate((el) => (el.scrollTop = el.scrollHeight))
  await content.hover()
  await page.mouse.wheel(0, 450)
  await expect
    .poll(() => outer.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(outerTop)
})

test('the workspace surface grows through the scroll boundary and closes only at the content end', async ({
  page,
}) => {
  await page.goto('/patterns/app-shell')
  await waitForCatalogReady(page)
  for (const dark of [false, true]) {
    if (dark)
      await page.getByRole('button', { name: 'Toggle theme: Light' }).click()
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 1000 })
      const long = page.getByRole('checkbox', {
        name: 'Long workspace content',
        exact: true,
      })
      const viewport = page.getByRole('region', {
        name: 'Workspace content',
        exact: true,
      })
      const surface = page.locator('.app-shell-preview .pui-app-shell-page')
      await long.uncheck()
      await viewport.evaluate((el) => (el.scrollTop = 0))
      await expect
        .poll(async () =>
          Math.abs(
            (await viewport.boundingBox())!.height -
              (await surface.evaluate(
                (el) => el.getBoundingClientRect().height,
              )) -
              (width > 760 ? 24 : 12),
          ),
        )
        .toBeLessThan(2)
      await long.check()
      await expect
        .poll(
          async () =>
            (await surface.boundingBox())!.height -
            (await viewport.boundingBox())!.height,
        )
        .toBeGreaterThan(200)
      let frame = (await viewport.boundingBox())!,
        sheet = (await surface.boundingBox())!
      expect(sheet.y + sheet.height).toBeGreaterThan(
        frame.y + frame.height + 200,
      )
      await viewport.evaluate((el) => (el.scrollTop = 200))
      frame = (await viewport.boundingBox())!
      sheet = (await surface.boundingBox())!
      expect(sheet.y).toBeLessThan(frame.y)
      expect(sheet.y + sheet.height).toBeGreaterThan(frame.y + frame.height)
      await viewport.evaluate((el) => (el.scrollTop = el.scrollHeight))
      // 12px closes the surface at the content end. Engines round scrollHeight to
      // whole pixels, so the last scroll position can stop up to a pixel short.
      await expect
        .poll(async () => {
          const frame = (await viewport.boundingBox())!,
            sheet = (await surface.boundingBox())!
          return Math.abs(frame.y + frame.height - sheet.y - sheet.height - 12)
        })
        .toBeLessThan(1)
      await expect
        .poll(() =>
          page
            .locator('.catalog-document-scroll')
            .evaluate((el) => el.scrollWidth <= el.clientWidth),
        )
        .toBe(true)
    }
  }
})
