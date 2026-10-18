import { waitForCatalogReady } from './catalog-ready'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
test.use({ reducedMotion: 'reduce' })
test('Context menu and visible menu share actions and checkbox state', async ({
  page,
}) => {
  await page.goto('/components/context-menu')
  await waitForCatalogReady(page)
  const target = page.locator('.context-evidence-target')
  await target.click({ button: 'right' })
  const menu = page.getByRole('menu', {
    name: 'Log context actions',
    exact: true,
  })
  await expect(menu).toBeVisible()
  await menu.getByRole('menuitemcheckbox', { name: 'Pin logs' }).click()
  await page.keyboard.press('Escape')
  const trigger = page.getByRole('button', {
    name: 'Log actions',
    exact: true,
  })
  await trigger.focus()
  await trigger.press('Enter')
  const visible = page.getByRole('menu', {
    name: 'Log actions',
    exact: true,
  })
  await expect(
    visible.getByRole('menuitemcheckbox', { name: 'Pin logs' }),
  ).toHaveAttribute('aria-checked', 'true')
  await visible
    .getByRole('menuitem', { name: 'Open logs', exact: true })
    .click()
  await expect(page.locator('#preview p[role=status]')).toContainText(
    'Log preview opened.',
  )
  await expect(trigger).toBeFocused()
})
test('Context submenu works by keyboard, supports RTL and disabled contextual opening', async ({
  page,
}) => {
  await page.goto('/components/context-menu')
  await waitForCatalogReady(page)
  await page.getByRole('checkbox', { name: 'RTL preview' }).check()
  await page.getByRole('button', { name: 'Log actions', exact: true }).click()
  const exp = page.getByRole('menuitem', { name: 'Export', exact: true })
  await exp.focus()
  await exp.press('ArrowLeft')
  await expect(
    page.getByRole('menuitem', { name: 'JSON logs', exact: true }),
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#preview p[role=status]')).toContainText(
    'JSON export previewed.',
  )
  await page.getByRole('checkbox', { name: 'Disable context menu' }).check()
  await page.locator('.context-evidence-target').click({ button: 'right' })
  await expect(page.getByRole('menu')).toHaveCount(0)
  await page
    .getByRole('button', { name: 'Log actions', exact: true })
    .press('Enter')
  await expect(page.getByRole('menu')).toBeVisible()
})
test('Context long press opens, movement cancels; cursor positioning stays inside narrow viewport', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  await page.goto('/components/context-menu')
  await waitForCatalogReady(page)
  const target = page.locator('.context-evidence-target')
  await target.scrollIntoViewIfNeeded()
  const rect = (await target.boundingBox())!
  const cdp = await context.newCDPSession(page)
  const point = { x: rect.x + rect.width - 8, y: rect.y + 20 }
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [point],
  })
  await expect(page.getByRole('menu')).toBeVisible()
  const popup = (await page.getByRole('menu').boundingBox())!
  expect(popup.x).toBeGreaterThanOrEqual(0)
  expect(popup.x + popup.width).toBeLessThanOrEqual(390)
  // A touch long press opens the menu; releasing must not accidentally execute
  // an item. Mouse press-slide is a different upstream gesture.
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  })
  await expect(page.getByRole('menu')).toBeVisible()
  await expect(page.locator('#preview p[role=status]')).toContainText(
    'No log action taken.',
  )
  await page.getByRole('menuitem', { name: 'Open logs', exact: true }).tap()
  await expect(page.locator('#preview p[role=status]')).toContainText(
    'Log preview opened.',
  )
  await page.keyboard.press('Escape')
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [point],
  })
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: point.x - 40, y: point.y + 2 }],
  })
  await page.waitForTimeout(650)
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  })
  await expect(page.getByRole('menu')).toHaveCount(0)
  await context.close()
})
test('Preview retains native link navigation, delay, cancellation and focus', async ({
  page,
}) => {
  await page.goto('/components/preview-card')
  await waitForCatalogReady(page)
  const link = page.locator('#preview a.pui-preview-trigger')
  await expect(link).toHaveAttribute('href', '#preview-destination')
  await link.hover()
  await page.waitForTimeout(150)
  await expect(page.locator('.pui-preview-card')).toHaveCount(0)
  await expect(page.locator('.pui-preview-card')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('.pui-preview-card')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Cancel preview opening' }).check()
  await link.focus()
  await page.waitForTimeout(750)
  await expect(page.locator('.pui-preview-card')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Cancel preview opening' }).uncheck()
  await page
    .getByRole('checkbox', { name: 'Cancel preview opening' })
    .press('Tab')
  await expect(page.locator('.pui-preview-card')).toBeVisible()
  await expect(link).toBeFocused()
  await expect(page.locator('.pui-preview-card')).toHaveAttribute(
    'aria-hidden',
    'true',
  )
  await expect(page.locator('.pui-preview-card')).not.toHaveAttribute(
    'role',
    'dialog',
  )
  await link.press('Enter')
  await expect(page).toHaveURL(/#preview-destination$/)
  await expect(page.locator('#preview-destination')).toBeFocused()
})
test('Preview can be hovered without disappearing and dismisses after pointer leaves', async ({
  page,
}) => {
  await page.goto('/components/preview-card')
  await waitForCatalogReady(page)
  await page.locator('#preview a.pui-preview-trigger').hover()
  const popup = page.locator('.pui-preview-card')
  await expect(popup).toBeVisible()
  await popup.hover()
  await page.waitForTimeout(450)
  await expect(popup).toBeVisible()
  await page.mouse.move(1, 1)
  await expect(popup).toHaveCount(0)
})
for (const theme of ['light', 'dark']) {
  test(`Overlay pages pass accessibility and reflow checks in ${theme}`, async ({
    page,
  }) => {
    for (const id of ['context-menu', 'preview-card']) {
      await page.goto(`/components/${id}`)
      await waitForCatalogReady(page)
      await page.evaluate((theme) => {
        document.documentElement.dataset.theme = theme
      }, theme)
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
      if (id === 'context-menu') {
        await page
          .locator('.context-evidence-target')
          .click({ button: 'right' })
        expect(
          (await new AxeBuilder({ page }).include('.pui-menu').analyze())
            .violations,
        ).toEqual([])
        await page.keyboard.press('Escape')
      } else {
        await page.locator('#preview a.pui-preview-trigger').focus()
        await expect(page.locator('.pui-preview-card')).toBeVisible()
        expect((await new AxeBuilder({ page }).analyze()).violations).toEqual(
          [],
        )
        await page.keyboard.press('Escape')
      }
      await page.setViewportSize({ width: 320, height: 800 })
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true)
    }
  })
}
