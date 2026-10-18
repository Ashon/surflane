import { waitForCatalogReady } from './catalog-ready'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
test.use({ reducedMotion: 'reduce' })
const inputs = (page: import('@playwright/test').Page, index = 0) =>
  page.locator('.pui-otp-field').nth(index).locator('input.pui-otp-input')
async function paste(input: import('@playwright/test').Locator, text: string) {
  await input.focus()
  await input.evaluate((el, text) => {
    const data = new DataTransfer()
    data.setData('text/plain', text)
    el.dispatchEvent(
      new ClipboardEvent('paste', {
        clipboardData: data,
        bubbles: true,
        cancelable: true,
      }),
    )
  }, text)
}
async function value(
  page: import('@playwright/test').Page,
  name = 'verificationCode',
) {
  return page
    .locator('#otp-preview-form')
    .evaluate(
      (form, name) => new FormData(form as HTMLFormElement).get(name),
      name,
    )
}
test('OTP exposes slot names, automatic advance and one submitted value per code', async ({
  page,
}) => {
  await page.goto('/components/otp-field')
  await waitForCatalogReady(page)
  const slots = inputs(page)
  await expect(slots).toHaveCount(6)
  await expect(
    page.getByRole('textbox', { name: 'Verification code', exact: true }),
  ).toHaveCount(1)
  await expect(slots.nth(1)).toHaveAttribute(
    'aria-label',
    'Verification character 2 of 6',
  )
  await expect(slots.first()).toHaveAttribute('autocomplete', 'one-time-code')
  await expect(slots.nth(1)).toHaveAttribute('autocomplete', 'off')
  await expect(slots.first()).toHaveAttribute('inputmode', 'numeric')
  await slots.first().pressSequentially('123456')
  await expect(slots.last()).toBeFocused()
  await expect.poll(() => value(page)).toBe('123456')
  await expect(page.locator('#preview p[role=status]')).toContainText(
    'Completion events: 1',
  )
  expect(
    await page
      .locator('#otp-preview-form')
      .evaluate((form) =>
        new FormData(form as HTMLFormElement).getAll('verificationCode'),
      ),
  ).toEqual(['123456'])
  await page
    .getByRole('button', { name: 'Verify preview', exact: true })
    .click()
  await expect(page.locator('#preview p[role=status]')).toContainText(
    'Verification submitted. Recovery code included: yes',
  )
})
test('OTP accepts paste and autofill, filters rejected characters and clamps length', async ({
  page,
}) => {
  await page.goto('/components/otp-field')
  await waitForCatalogReady(page)
  const slots = inputs(page)
  await paste(slots.first(), '1 2x3-456789')
  await expect.poll(() => value(page)).toBe('123456')
  await expect(page.locator('#preview p[role=status]')).toContainText(
    'Rejected input events: 1',
  )
  await page.getByRole('button', { name: 'Reset codes', exact: true }).click()
  await expect.poll(() => value(page)).toBe('')
  await slots.first().fill('654321')
  await expect.poll(() => value(page)).toBe('654321')
  await expect(slots.last()).toBeFocused()
  await paste(inputs(page, 1).first(), 'ab7 9xz')
  await expect.poll(() => value(page, 'recoveryCode')).toBe('AB79XZ')
})
test('OTP editing handles boundaries, deletion and RTL slot navigation', async ({
  page,
}) => {
  await page.goto('/components/otp-field')
  await waitForCatalogReady(page)
  const slots = inputs(page)
  await paste(slots.first(), '123456')
  await slots.last().press('Home')
  await expect(slots.first()).toBeFocused()
  await slots.first().press('End')
  await expect(slots.last()).toBeFocused()
  await slots.last().press('Backspace')
  await expect.poll(() => value(page)).toBe('12345')
  await page.keyboard.press('ArrowLeft')
  await expect(slots.nth(3)).toBeFocused()
  await page.keyboard.press('Delete')
  await expect.poll(() => value(page)).toBe('1235')
  await page.getByRole('checkbox', { name: 'RTL preview' }).check()
  await slots.first().focus()
  await slots.first().press('ArrowLeft')
  await expect(slots.nth(1)).toBeFocused()
  await slots.nth(1).press('ArrowRight')
  await expect(slots.first()).toBeFocused()
})
test('Native reset clears uncontrolled code, preserves controlled recovery and honors cancellation', async ({
  page,
}) => {
  await page.goto('/components/otp-field')
  await waitForCatalogReady(page)
  await paste(inputs(page).first(), '123456')
  await paste(inputs(page, 1).first(), 'bc4 8yz')
  await expect.poll(() => value(page, 'recoveryCode')).toBe('BC48YZ')
  await page.getByRole('checkbox', { name: 'Cancel reset' }).check()
  await page.getByRole('button', { name: 'Reset codes', exact: true }).click()
  await expect.poll(() => value(page)).toBe('123456')
  await page.getByRole('checkbox', { name: 'Cancel reset' }).uncheck()
  await page.getByRole('button', { name: 'Reset codes', exact: true }).click()
  await expect.poll(() => value(page)).toBe('')
  await expect.poll(() => value(page, 'recoveryCode')).toBe('BC48YZ')
  await expect(inputs(page, 1).first()).toHaveValue('B')
  await page.getByRole('checkbox', { name: 'Cancel code changes' }).check()
  await paste(inputs(page).first(), '654321')
  await expect.poll(() => value(page)).toBe('')
  await paste(inputs(page, 1).first(), '123456')
  await expect.poll(() => value(page, 'recoveryCode')).toBe('BC48YZ')
})
test('Disabled, read-only and masked codes preserve distinct interaction and submission semantics', async ({
  page,
}) => {
  await page.goto('/components/otp-field')
  await waitForCatalogReady(page)
  await paste(inputs(page).first(), '123456')
  await page.getByRole('checkbox', { name: 'Mask characters' }).check()
  await expect(inputs(page).first()).toHaveAttribute('type', 'password')
  await expect.poll(() => value(page)).toBe('123456')
  await page.getByRole('checkbox', { name: 'Read only', exact: true }).check()
  await expect(inputs(page).first()).toHaveAttribute('readonly', '')
  await paste(inputs(page).first(), '654321')
  await expect.poll(() => value(page)).toBe('123456')
  await page.getByRole('checkbox', { name: 'Disable codes' }).check()
  await expect(inputs(page).first()).toBeDisabled()
  await expect.poll(() => value(page)).toBeNull()
  await expect.poll(() => value(page, 'recoveryCode')).toBeNull()
})
test('Required and server errors label the group and invalid slots; reissue clears the code', async ({
  page,
}) => {
  await page.goto('/components/otp-field')
  await waitForCatalogReady(page)
  await page
    .getByRole('button', { name: 'Verify preview', exact: true })
    .click()
  await expect(inputs(page).first()).toBeFocused()
  await expect(inputs(page).first()).toHaveAttribute('aria-invalid', 'true')
  await paste(inputs(page).first(), '000000')
  await page
    .getByRole('button', { name: 'Verify preview', exact: true })
    .click()
  const error = page.locator('#preview .pui-field-error').first()
  await expect(error).toContainText('This example code was rejected')
  const errorId = await error.getAttribute('id')
  await expect(page.locator('.pui-otp-field').first()).toHaveAttribute(
    'aria-describedby',
    new RegExp(errorId!),
  )
  await page.getByRole('button', { name: 'Expire code', exact: true }).click()
  await expect(error).toContainText('Code expired')
  await page
    .getByRole('button', { name: 'Request new code', exact: true })
    .click()
  await expect.poll(() => value(page)).toBe('')
  await expect(page.locator('#preview p[role=status]')).toContainText(
    'New local code requested',
  )
})
test('Completion only submits with explicit autoSubmit enabled', async ({
  page,
}) => {
  await page.goto('/components/otp-field')
  await waitForCatalogReady(page)
  await paste(inputs(page).first(), '123456')
  await expect(page.locator('#preview p[role=status]')).toContainText(
    'No verification submitted',
  )
  await page.getByRole('button', { name: 'Reset codes', exact: true }).click()
  await page.getByRole('checkbox', { name: 'Submit when complete' }).check()
  await paste(inputs(page).first(), '654321')
  await expect(page.locator('#preview p[role=status]')).toContainText(
    'Verification submitted',
  )
})
for (const theme of ['light', 'dark'])
  test(`OTP labels and states remain accessible and reflow in ${theme}`, async ({
    page,
  }) => {
    await page.goto('/components/otp-field')
    await waitForCatalogReady(page)
    await page.evaluate(
      (theme) => (document.documentElement.dataset.theme = theme),
      theme,
    )
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    await page.getByRole('button', { name: 'Expire code', exact: true }).click()
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    await page.setViewportSize({ width: 320, height: 800 })
    await inputs(page).first().scrollIntoViewIfNeeded()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    const rect = await page.locator('.pui-otp-field').first().boundingBox()
    expect(rect!.width).toBeLessThanOrEqual(260)
    await expect(inputs(page).first()).toHaveCSS('height', '44px')
  })
test('OTP buffers composition until commit and does not execute editing keys owned by IME', async ({
  page,
}) => {
  await page.goto('/components/otp-field')
  await waitForCatalogReady(page)
  const slot = inputs(page).first()
  await slot.focus()
  await slot.evaluate((el) => {
    el.dispatchEvent(
      new CompositionEvent('compositionstart', { bubbles: true }),
    )
  })
  await slot.evaluate((el) => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )!.set!.call(el, '1')
    el.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        data: '1',
        inputType: 'insertCompositionText',
        isComposing: true,
      }),
    )
    el.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'Backspace',
        isComposing: true,
      }),
    )
  })
  await expect.poll(() => value(page)).toBe('')
  await slot.evaluate((el) =>
    el.dispatchEvent(
      new CompositionEvent('compositionend', { bubbles: true, data: '1' }),
    ),
  )
  await expect.poll(() => value(page)).toBe('1')
  await expect(inputs(page).nth(1)).toBeFocused()
})
