import { waitForCatalogReady } from './catalog-ready'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
test.use({ reducedMotion: 'reduce' })
const visible = (page: import('@playwright/test').Page) =>
  page.locator('.surf-toast:not([data-limited])')
async function duration(page: import('@playwright/test').Page, label: string) {
  await page.getByRole('combobox', { name: 'Notification duration' }).click()
  await page.getByRole('option', { name: label, exact: true }).click()
}
test('Success notifications retain focus, names, descriptions and update in place by ID', async ({
  page,
}) => {
  await page.goto('/components/toast')
  await waitForCatalogReady(page)
  const button = page.getByRole('button', {
    name: 'Show success',
    exact: true,
  })
  await button.click()
  const toast = page.getByRole('dialog', {
    name: 'Export preview ready',
    exact: true,
  })
  await expect(toast).toBeVisible()
  await expect(button).toBeFocused()
  await expect(toast).toHaveAttribute('aria-modal', 'false')
  await expect(
    page.getByRole('region', { name: 'Preview notifications' }),
  ).toHaveAttribute('aria-live', 'polite')
  await expect(toast).toContainText('Prepared sample export 1.')
  await button.click()
  await expect(visible(page)).toHaveCount(1)
  await expect(toast).toContainText('Prepared sample export 2.')
  await toast.getByRole('button', { name: 'Dismiss notification' }).click()
  await expect(visible(page)).toHaveCount(0)
})
test('Explicit short duration expires and persistent duration remains until dismissal', async ({
  page,
}) => {
  await page.goto('/components/toast')
  await waitForCatalogReady(page)
  await duration(page, '1.5 seconds — timing preview')
  await page.getByRole('button', { name: 'Show success', exact: true }).click()
  await expect(visible(page)).toHaveCount(1)
  await expect(visible(page)).toHaveCount(0, { timeout: 4000 })
  await duration(page, 'Until dismissed')
  await page.getByRole('button', { name: 'Show success', exact: true }).click()
  await page.waitForTimeout(1800)
  await expect(visible(page)).toHaveCount(1)
  await page.getByRole('button', { name: 'Dismiss all', exact: true }).click()
  await expect(visible(page)).toHaveCount(0)
})
test('Hover pauses auto-dismiss and leaving resumes the remaining time', async ({
  page,
}) => {
  await page.goto('/components/toast')
  await waitForCatalogReady(page)
  await duration(page, '1.5 seconds — timing preview')
  await page.getByRole('button', { name: 'Show success', exact: true }).click()
  await visible(page).hover()
  await page.waitForTimeout(1900)
  await expect(visible(page)).toHaveCount(1)
  await page.mouse.move(1, 1)
  await expect(visible(page)).toHaveCount(0, { timeout: 4000 })
})
test('F6 focuses the viewport, pauses timers and restores the invoking control with Shift+Tab', async ({
  page,
}) => {
  await page.goto('/components/toast')
  await waitForCatalogReady(page)
  await duration(page, '1.5 seconds — timing preview')
  const button = page.getByRole('button', {
    name: 'Show success',
    exact: true,
  })
  await button.click()
  await page.keyboard.press('F6')
  const region = page.getByRole('region', { name: 'Preview notifications' })
  await expect(region).toBeFocused()
  await page.waitForTimeout(1900)
  await expect(visible(page)).toHaveCount(1)
  await page.keyboard.press('Shift+Tab')
  await expect(button).toBeFocused()
  await expect(visible(page)).toHaveCount(0, { timeout: 4000 })
})
test('Undo changes only local item state; Escape dismisses the focused toast without trapping focus', async ({
  page,
}) => {
  await page.goto('/components/toast')
  await waitForCatalogReady(page)
  await page
    .getByRole('button', { name: 'Archive preview item', exact: true })
    .click()
  await expect(page.locator('#preview')).toContainText('Item status: archived')
  const toast = page.getByRole('dialog', {
    name: 'Preview item archived',
    exact: true,
  })
  await toast.getByRole('button', { name: 'Undo', exact: true }).click()
  await expect(page.locator('#preview')).toContainText('Item status: available')
  await expect(visible(page)).toHaveCount(0)
  await page
    .getByRole('button', { name: 'Archive preview item', exact: true })
    .click()
  await page.getByRole('button', { name: 'Dismiss all', exact: true }).click()
  await page
    .getByRole('button', { name: 'Restore preview item', exact: true })
    .click()
  await expect(page.locator('#preview')).toContainText('Item status: available')
  await page.getByRole('button', { name: 'Show success', exact: true }).click()
  await page.keyboard.press('F6')
  await page.keyboard.press('Tab')
  await expect(visible(page)).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(visible(page)).toHaveCount(0)
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.activeElement?.hasAttribute('data-base-ui-focus-guard') ??
          false,
      ),
    )
    .toBe(false)
})
test('Promise updates one notification and failed operations retain a persistent retry message', async ({
  page,
}) => {
  await page.goto('/components/toast')
  await waitForCatalogReady(page)
  await page
    .getByRole('button', { name: 'Preview async task', exact: true })
    .click()
  await expect(
    page.getByRole('dialog', { name: 'Preparing export preview', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('dialog', { name: 'Export task complete', exact: true }),
  ).toBeVisible()
  await expect(visible(page)).toHaveCount(1)
  await page.getByRole('button', { name: 'Dismiss all', exact: true }).click()
  await expect(visible(page)).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Fail async preview' }).check()
  await page
    .getByRole('button', { name: 'Preview async task', exact: true })
    .click()
  await expect(
    page.getByRole('dialog', { name: 'Export preview failed', exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Dismiss all', exact: true }).click()
  await expect(visible(page)).toHaveCount(0)
  await expect(
    page.getByText(
      'The task failed. This message remains after the toast closes.',
      { exact: true },
    ),
  ).toBeVisible()
  await page.getByRole('checkbox', { name: 'Fail async preview' }).uncheck()
  await page
    .getByRole('button', { name: 'Retry export preview', exact: true })
    .click()
  await expect(
    page.getByRole('dialog', { name: 'Export task complete', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText(
      'The task failed. This message remains after the toast closes.',
      { exact: true },
    ),
  ).toHaveCount(0)
})
test('Visible limit keeps overflow notifications inert and hidden; dismiss all clears them too', async ({
  page,
}) => {
  await page.goto('/components/toast')
  await waitForCatalogReady(page)
  await duration(page, 'Until dismissed')
  await page.getByRole('button', { name: 'Show batch', exact: true }).click()
  await expect(visible(page)).toHaveCount(3)
  const limited = page.locator('.surf-toast[data-limited]')
  await expect(limited).toHaveCount(1)
  await expect(limited).toHaveAttribute('inert', '')
  await expect(limited).toBeHidden()
  await expect(
    page.getByRole('dialog', { name: 'Batch notification 1', exact: true }),
  ).toHaveCount(0)
  await page.getByRole('button', { name: 'Dismiss all', exact: true }).click()
  await expect(page.locator('.surf-toast')).toHaveCount(0)
})
test('High priority announces an alert and becomes an accessible nonmodal dialog on F6', async ({
  page,
}) => {
  await page.goto('/components/toast')
  await waitForCatalogReady(page)
  await page
    .getByRole('button', { name: 'Show urgent notice', exact: true })
    .click()
  await expect(page.getByRole('alert')).toContainText('Attention preview')
  await page.keyboard.press('F6')
  await expect(
    page.getByRole('alertdialog', { name: 'Attention preview', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('alertdialog', { name: 'Attention preview', exact: true }),
  ).toHaveAttribute('aria-modal', 'false')
  await expect(page.getByRole('alert')).toHaveCount(0)
  expect(
    (
      await new AxeBuilder({ page })
        .exclude('[data-base-ui-focus-guard]')
        .analyze()
    ).violations,
  ).toEqual([])
})
for (const theme of ['light', 'dark'])
  test(`Toast controls pass accessibility and fit small/RTL viewports in ${theme}`, async ({
    page,
  }) => {
    await page.goto('/components/toast')
    await waitForCatalogReady(page)
    await page.evaluate(
      (theme) => (document.documentElement.dataset.theme = theme),
      theme,
    )
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    await page
      .getByRole('button', { name: 'Archive preview item', exact: true })
      .click()
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    await page.setViewportSize({ width: 320, height: 480 })
    await page.getByRole('checkbox', { name: 'RTL notifications' }).check()
    const rect = (await visible(page).boundingBox())!
    expect(rect.x).toBeGreaterThanOrEqual(0)
    expect(rect.x + rect.width).toBeLessThanOrEqual(320)
    expect(rect.y + rect.height).toBeLessThanOrEqual(480)
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
  })
test('Touch swipe dismisses notifications in the configured direction', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:8066/components/toast')
  await waitForCatalogReady(page)
  await page
    .getByRole('button', { name: 'Archive preview item', exact: true })
    .tap()
  const rect = (await visible(page).boundingBox())!
  const cdp = await context.newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: rect.x + 80, y: rect.y + 22 }],
  })
  for (let distance = 30; distance <= 180; distance += 30) {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: rect.x + 80 + distance, y: rect.y + 22 }],
    })
  }
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  })
  await expect(visible(page)).toHaveCount(0)
  await context.close()
})
test('Window blur pauses dismissal and focus resumes it', async ({ page }) => {
  await page.goto('/components/toast')
  await waitForCatalogReady(page)
  await duration(page, '1.5 seconds — timing preview')
  await page.getByRole('button', { name: 'Show success', exact: true }).click()
  await page.evaluate(() => window.dispatchEvent(new Event('blur')))
  await page.waitForTimeout(1900)
  await expect(visible(page)).toHaveCount(1)
  await page.evaluate(() => window.dispatchEvent(new Event('focus')))
  await expect(visible(page)).toHaveCount(0, { timeout: 4000 })
})
test('Anchored layout receives events from an outside-React manager and fits its target', async ({
  page,
}) => {
  await page.goto('/components/toast')
  await waitForCatalogReady(page)
  await page
    .getByRole('combobox', { name: 'Notification presentation' })
    .click()
  await page
    .getByRole('option', { name: 'Anchored feedback', exact: true })
    .click()
  const trigger = page.getByRole('button', {
    name: 'Show anchored feedback',
    exact: true,
  })
  await trigger.click()
  const toast = page.getByRole('dialog', {
    name: 'Link feedback preview',
    exact: true,
  })
  await expect(toast).toBeVisible()
  await expect(
    page.getByRole('region', { name: 'Preview notifications', exact: true }),
  ).toHaveCount(0)
  await expect(page.locator('.surf-toast-viewport')).toHaveAttribute(
    'data-layout',
    'anchored',
  )
  await expect(trigger).toBeFocused()
  const anchor = (await trigger.boundingBox())!,
    rect = (await toast.boundingBox())!
  expect(
    Math.abs(rect.x + rect.width / 2 - (anchor.x + anchor.width / 2)),
  ).toBeLessThan(2)
  expect(rect.y + rect.height).toBeLessThanOrEqual(anchor.y)
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  await page.setViewportSize({ width: 320, height: 480 })
  await trigger.scrollIntoViewIfNeeded()
  await expect
    .poll(async () => {
      const r = (await toast.boundingBox())!
      return r.x >= 0 && r.x + r.width <= 320
    })
    .toBe(true)
  await toast.getByRole('button', { name: 'Dismiss notification' }).click()
  await expect(toast).toHaveCount(0)
})
test('Toast focus sentinels redirect rather than retain hidden focus', async ({
  page,
}) => {
  await page.goto('/components/toast')
  await waitForCatalogReady(page)
  await page
    .getByRole('button', { name: 'Archive preview item', exact: true })
    .click()
  await page.keyboard.press('F6')
  const guards = page.locator('[data-base-ui-focus-guard][tabindex="0"]')
  expect(await guards.count()).toBeGreaterThan(0)
  for (let index = 0; index < (await guards.count()); index++) {
    await guards.nth(index).focus()
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.activeElement?.hasAttribute('data-base-ui-focus-guard') ??
            false,
        ),
      )
      .toBe(false)
  }
})

test('the toast() helper picks a tone for each kind of call', async ({
  page,
}) => {
  await page.goto('/components/toast')
  await waitForCatalogReady(page)
  // A high-priority toast is an alert dialog, so find each by its title.
  const tone = (name: string) =>
    page.locator('.surf-toast').filter({ hasText: name })
  await page.getByRole('button', { name: 'Show success', exact: true }).click()
  await expect(tone('Export preview ready')).toHaveAttribute(
    'data-tone',
    'success',
  )
  await page
    .getByRole('button', { name: 'Archive preview item', exact: true })
    .click()
  // info, with the action shorthand as its button.
  const archived = tone('Preview item archived')
  await expect(archived).toHaveAttribute('data-tone', 'info')
  await expect(archived.getByRole('button', { name: 'Undo' })).toBeVisible()
  await page
    .getByRole('button', { name: 'Show urgent notice', exact: true })
    .click()
  await expect(tone('Attention preview')).toHaveAttribute(
    'data-tone',
    'caution',
  )
  await page.getByRole('checkbox', { name: 'Fail async preview' }).check()
  await page
    .getByRole('button', { name: 'Preview async task', exact: true })
    .click()
  await expect(tone('Export preview failed')).toHaveAttribute(
    'data-tone',
    'danger',
  )
  await page.getByRole('button', { name: 'Dismiss all', exact: true }).click()
  await expect(visible(page)).toHaveCount(0)
})
