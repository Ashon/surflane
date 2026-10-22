import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
test('required and format errors are connected, focus the input and preserve the entered value', async ({
  page,
}) => {
  const mutations: string[] = []
  page.on('request', (request) => {
    if (request.method() !== 'GET') mutations.push(request.url())
  })
  await page.goto('/foundations/accessibility')
  await waitForCatalogReady(page)
  const input = page.getByRole('textbox', {
    name: 'Preview name (required)',
    exact: true,
  })
  const submit = page.getByRole('button', {
    name: 'Validate preview',
    exact: true,
  })
  await expect(input).toHaveAttribute('required', '')
  await expect(input).toHaveAccessibleDescription(/Use lowercase letters/)
  await expect(
    page.getByRole('button', { name: 'Simulate name conflict' }),
  ).toBeDisabled()
  await submit.click()
  await expect(input).toBeFocused()
  await expect(input).toHaveAttribute('aria-invalid', 'true')
  await expect(input).toHaveAccessibleDescription(/Enter a name/)
  await input.fill('잘못된 이름 / invalid')
  await submit.click()
  await expect(input).toBeFocused()
  await expect(input).toHaveValue('잘못된 이름 / invalid')
  await expect(input).toHaveAccessibleDescription(
    /Use only lowercase letters, numbers, and hyphens/,
  )
  await expect(page.locator('[data-validation-result]')).toBeEmpty()
  await input.fill('demo-e2e-01')
  await submit.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('[data-validation-result]')).toContainText(
    'Validated: demo-e2e-01',
  )
  await expect(submit).toBeFocused()
  await expect(input).not.toHaveAttribute('aria-invalid', 'true')
  expect(mutations).toEqual([])
})
test('explicit conflict focuses the described error without losing the name, edit recovers and reset clears state', async ({
  page,
}) => {
  await page.goto('/foundations/accessibility')
  await waitForCatalogReady(page)
  const input = page.getByRole('textbox', {
    name: 'Preview name (required)',
    exact: true,
  })
  await input.fill('demo-e2e-01')
  await page.getByRole('button', { name: 'Simulate name conflict' }).click()
  await expect(input).toBeFocused()
  await expect(input).toHaveValue('demo-e2e-01')
  await expect(input).toHaveAccessibleDescription(/name is already in use/)
  await input.fill('demo-e2e-02')
  await expect(input).not.toHaveAttribute('aria-invalid', 'true')
  await page
    .getByRole('button', { name: 'Validate preview', exact: true })
    .click()
  await expect(page.locator('[data-validation-result]')).toContainText(
    'demo-e2e-02',
  )
  await input.fill('next-name')
  await expect(page.locator('[data-validation-result]')).toBeEmpty()
  await page.getByRole('button', { name: 'Reset preview', exact: true }).click()
  await expect(input).toHaveValue('')
  await expect(input).not.toHaveAttribute('aria-invalid', 'true')
  await expect(page.locator('[data-validation-result]')).toHaveAttribute(
    'role',
    'status',
  )
  await expect(page.locator('[data-validation-result]')).toHaveAttribute(
    'aria-atomic',
    'true',
  )
  await expect(page.locator('[data-validation-result]')).toContainText(
    'Preview reset',
  )
})
test('dialog traps Tab and reverse Tab and restores its keyboard trigger on Escape', async ({
  page,
}) => {
  await page.goto('/foundations/accessibility')
  await waitForCatalogReady(page)
  const trigger = page.getByRole('button', {
    name: 'Open focus preview',
    exact: true,
  })
  await trigger.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Keyboard focus preview' })
  await expect(dialog).toBeVisible()
  for (const key of [
    'Tab',
    'Tab',
    'Tab',
    'Tab',
    'Shift+Tab',
    'Shift+Tab',
    'Shift+Tab',
    'Shift+Tab',
  ]) {
    await page.keyboard.press(key)
    await expect
      .poll(() =>
        dialog.evaluate((element) => element.contains(document.activeElement)),
      )
      .toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
})
test('skip link and route changes expose the correct main target and focused heading', async ({
  page,
}) => {
  await page.goto('/foundations/accessibility')
  await waitForCatalogReady(page)
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Skip to content', exact: true }),
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  await page
    .getByRole('navigation', { name: 'Catalog navigation' })
    .getByRole('link', { name: 'Color', exact: true })
    .click()
  await waitForCatalogReady(page)
  await expect(page.locator('#page-title')).toBeFocused()
  await expect(page).toHaveTitle('Color | Surflane')
  await page.goBack()
  await waitForCatalogReady(page)
  await expect(page.locator('#page-title')).toHaveText('Accessibility')
  // Back to the skip-link fragment restores the browser's native main target.
  await expect(page).toHaveURL(/accessibility#main-content$/)
  await expect(page.getByRole('main')).toBeFocused()
})
for (const width of [1440, 320])
  for (const dark of [false, true]) {
    test(`accessible guide, invalid field and modal pass axe at ${width}px dark=${dark}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto('/foundations/accessibility')
      await waitForCatalogReady(page)
      if (dark) await page.getByRole('button', { name: 'Toggle theme' }).click()
      expect(
        await page.evaluate(() => document.body.scrollWidth <= innerWidth),
      ).toBe(true)
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
      await page
        .getByRole('button', { name: 'Validate preview', exact: true })
        .click()
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
      await page
        .getByRole('button', { name: 'Open focus preview', exact: true })
        .click()
      await expect(page.locator('.pui-dialog-popup')).not.toHaveAttribute(
        'data-starting-style',
      )
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    })
  }
test('text-spacing overrides reflow and forced colors retain keyboard-visible controls', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.emulateMedia({ forcedColors: 'active' })
  await page.goto('/foundations/accessibility')
  await waitForCatalogReady(page)
  await page.addStyleTag({
    content:
      '* {line-height:1.5 !important;letter-spacing:.12em !important;word-spacing:.16em !important} p {margin-bottom:2em !important}',
  })
  expect(
    await page.evaluate(() => document.body.scrollWidth <= innerWidth),
  ).toBe(true)
  const input = page.getByRole('textbox', {
    name: 'Preview name (required)',
    exact: true,
  })
  await input.focus()
  await page.keyboard.type('long-environment-name-1234567890')
  await page.keyboard.press('Tab')
  const submit = page.getByRole('button', {
    name: 'Validate preview',
    exact: true,
  })
  await expect(submit).toBeFocused()
  expect(
    await submit.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).not.toBe('none')
  await page.keyboard.press('Enter')
  await expect(page.locator('[data-validation-result]')).toContainText(
    'long-environment-name-1234567890',
  )
})

test('revealing deep sidebar destinations preserves the first Tab and page scroll on direct entry', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 720 })
  for (const route of [
    '/components/breadcrumbs',
    '/components/file-upload',
    '/foundations/accessibility',
  ]) {
    await page.goto(route)
    await waitForCatalogReady(page)
    expect(await page.evaluate(() => scrollY)).toBe(0)
    await page.keyboard.press('Tab')
    await expect(
      page.getByRole('link', { name: 'Skip to content', exact: true }),
    ).toBeFocused()
  }
})
