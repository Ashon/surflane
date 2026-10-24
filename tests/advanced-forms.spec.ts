import { waitForCatalogReady } from './catalog-ready'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { advancedFormExampleIds } from '../demo/AdvancedFormExamples'
test.use({ reducedMotion: 'reduce' })
test('Combobox derives the initial label, filters and selects with keyboard, submits the selected value and closes with Escape', async ({
  page,
}) => {
  await page.goto('/components/combobox')
  await waitForCatalogReady(page)
  const input = page.getByRole('combobox', {
    name: 'Target environment',
    exact: true,
  })
  await expect(input).toHaveValue('Staging web')
  await input.fill('API')
  await expect(
    page.getByRole('option', { name: 'Staging API', exact: true }),
  ).toBeVisible()
  await input.press('ArrowDown')
  await input.press('Enter')
  await expect(input).toHaveValue('Staging API')
  await page
    .getByRole('button', { name: 'Submit selection', exact: true })
    .click()
  await expect(page.locator('#preview').getByRole('status')).toContainText(
    '"environment":"Staging API"',
  )
  await input.click()
  await expect(page.getByRole('listbox')).toBeVisible()
  await input.press('Escape')
  await expect(page.getByRole('listbox')).toBeHidden()
  await expect(input).toBeFocused()
})
test('Combobox exposes disabled options and a mounted empty live region, and respects canceled selection changes', async ({
  page,
}) => {
  await page.goto('/components/combobox')
  await waitForCatalogReady(page)
  const input = page.getByRole('combobox', {
    name: 'Target environment',
    exact: true,
  })
  await input.fill('Reserved')
  await expect(
    page.getByRole('option', { name: 'Reserved environment', exact: true }),
  ).toHaveAttribute('aria-disabled', 'true')
  await input.fill('not-an-environment')
  await expect(
    page.getByRole('status').filter({ hasText: 'No matching environments.' }),
  ).toBeVisible()
  expect(
    await page
      .locator('.surf-combobox-empty')
      .evaluate((e) => getComputedStyle(e).display),
  ).not.toBe('none')
  await input.press('Escape')
  await page
    .getByRole('button', { name: 'Cancel selection changes', exact: true })
    .click()
  await input.fill('API')
  await input.press('ArrowDown')
  await input.press('Enter')
  await input.press('Escape')
  expect(
    await page
      .locator('#preview form')
      .evaluate((f) => new FormData(f as HTMLFormElement).get('environment')),
  ).toBe('Staging web')
})
test('Combobox multiple object values submit IDs, remove chips, and reset search and selection unless reset is canceled', async ({
  page,
}) => {
  await page.goto('/components/combobox')
  await waitForCatalogReady(page)
  const roles = page.getByRole('combobox', {
    name: 'Test user roles',
    exact: true,
  })
  await roles.fill('Operator')
  await roles.press('ArrowDown')
  await roles.press('Enter')
  await expect(
    page.getByRole('button', { name: 'Remove Operator', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Submit selection', exact: true })
    .click()
  await expect(page.locator('#preview').getByRole('status')).toContainText(
    '"roles":["reader","operator"]',
  )
  await page.getByRole('button', { name: 'Remove Reader', exact: true }).click()
  expect(
    await page
      .locator('#preview form')
      .evaluate((f) => new FormData(f as HTMLFormElement).getAll('roles')),
  ).toEqual(['operator'])
  await page.getByRole('button', { name: 'Cancel reset', exact: true }).click()
  await page
    .getByRole('button', { name: 'Reset selection', exact: true })
    .click()
  await expect(
    page.getByRole('button', { name: 'Remove Operator', exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Allow reset', exact: true }).click()
  await page
    .getByRole('button', { name: 'Reset selection', exact: true })
    .click()
  await expect(
    page.getByRole('button', { name: 'Remove Reader', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Remove Operator', exact: true }),
  ).toHaveCount(0)
  await expect(
    page.getByRole('combobox', { name: 'Target environment', exact: true }),
  ).toHaveValue('Staging web')
})
test('Combobox supports Korean filtering and ignores Enter during composition', async ({
  page,
}) => {
  await page.goto('/components/combobox')
  await waitForCatalogReady(page)
  const input = page.getByRole('combobox', {
    name: 'Target environment',
    exact: true,
  })
  await input.fill('서울')
  await expect(
    page.getByRole('option', { name: '서울 스테이징 환경', exact: true }),
  ).toBeVisible()
  await input.dispatchEvent('compositionstart')
  await input.dispatchEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 229,
    isComposing: true,
  })
  expect(
    await page
      .locator('#preview form')
      .evaluate((f) => new FormData(f as HTMLFormElement).get('environment')),
  ).toBe('Staging web')
  await input.dispatchEvent('compositionend')
  await input.press('ArrowDown')
  await input.press('Enter')
  await expect(input).toHaveValue('서울 스테이징 환경')
})
test('NumberField supports direct entry, step boundaries, numeric submission and localized display', async ({
  page,
}) => {
  await page.goto('/components/number-field')
  await waitForCatalogReady(page)
  const input = page.getByRole('textbox', {
    name: 'Retry attempts',
    exact: true,
  })
  await expect(input).toHaveValue('2')
  await input.focus()
  await input.press('ArrowUp')
  await expect(input).toHaveValue('3')
  await page
    .getByRole('button', { name: 'Increase attempts', exact: true })
    .click()
  await expect(input).toHaveValue('4')
  await input.fill('8')
  await input.blur()
  await expect(
    page.getByRole('button', { name: 'Increase attempts', exact: true }),
  ).toBeDisabled()
  await input.fill('1')
  await input.blur()
  await expect(
    page.getByRole('button', { name: 'Decrease attempts', exact: true }),
  ).toBeDisabled()
  await expect(
    page.getByRole('textbox', { name: 'Budget preview', exact: true }),
  ).toHaveValue('$1,250.50')
  await page
    .getByRole('button', { name: 'Submit numbers', exact: true })
    .click()
  await expect(page.locator('#preview').getByRole('status')).toContainText(
    '"budget":"1250.5"',
  )
  await expect(page.locator('#preview').getByRole('status')).toContainText(
    '"attempts":"1"',
  )
})
test('NumberField reset honors cancellation and preserves controlled values while clearing uncontrolled edits', async ({
  page,
}) => {
  await page.goto('/components/number-field')
  await waitForCatalogReady(page)
  const input = page.getByRole('textbox', {
    name: 'Retry attempts',
    exact: true,
  })
  await input.fill('6')
  await input.blur()
  await page
    .getByRole('button', { name: 'Increase concurrency', exact: true })
    .click()
  await page.getByRole('button', { name: 'Cancel reset', exact: true }).click()
  await page.getByRole('button', { name: 'Reset numbers', exact: true }).click()
  await expect(input).toHaveValue('6')
  await page.getByRole('button', { name: 'Allow reset', exact: true }).click()
  await page.getByRole('button', { name: 'Reset numbers', exact: true }).click()
  await expect(input).toHaveValue('2')
  await expect(
    page.getByRole('textbox', { name: 'Controlled concurrency', exact: true }),
  ).toHaveValue('4')
  expect(
    await page
      .locator('#preview form')
      .evaluate((f) => new FormData(f as HTMLFormElement).get('controlled')),
  ).toBe('4')
  await page
    .getByRole('button', { name: 'Cancel number changes', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Increase attempts', exact: true })
    .click()
  await expect(input).toHaveValue('2')
})
for (const id of advancedFormExampleIds)
  test(`${id} distinguishes readonly/disabled and passes label, dark/light, narrow and open-popup accessibility`, async ({
    page,
  }) => {
    await page.goto(`/components/${id}`)
    await waitForCatalogReady(page)
    const input =
      id === 'combobox'
        ? page.getByRole('combobox', {
            name: 'Target environment',
            exact: true,
          })
        : page.getByRole('textbox', { name: 'Retry attempts', exact: true })
    expect(await input.getAttribute('aria-describedby')).toBeTruthy()
    await page.getByRole('checkbox', { name: 'Read only', exact: true }).check()
    await expect(input).toHaveAttribute('readonly')
    await page
      .getByRole('checkbox', { name: 'Read only', exact: true })
      .uncheck()
    await page
      .getByRole('checkbox', { name: 'Disable controls', exact: true })
      .check()
    await expect(input).toBeDisabled()
    await page
      .getByRole('checkbox', { name: 'Disable controls', exact: true })
      .uncheck()
    for (const theme of ['light', 'dark']) {
      await page.evaluate(
        (t) => (document.documentElement.dataset.theme = t),
        theme,
      )
      await page.setViewportSize({ width: 320, height: 900 })
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy()
      const result = await new AxeBuilder({ page }).analyze()
      expect(result.violations).toEqual([])
      if (id === 'combobox') {
        await input.click()
        // Base UI isolates outside content while this popup is open; audit its scope.
        expect(
          (
            await new AxeBuilder({ page })
              .include('.surf-combobox-popup')
              .analyze()
          ).violations,
        ).toEqual([])
        await input.press('Tab')
        await expect(page.getByRole('listbox')).toBeHidden()
        expect(
          await page.evaluate(() =>
            Boolean(document.activeElement?.closest('[aria-hidden="true"]')),
          ),
        ).toBeFalsy()
        await expect(
          page.getByRole('heading', {
            level: 1,
            name: 'Combobox',
            exact: true,
          }),
        ).toBeVisible()
      }
    }
  })

test('Controlled Combobox links to an external form and retains the selected value through native reset', async ({
  page,
}) => {
  await page.goto('/components/combobox')
  await waitForCatalogReady(page)
  const input = page.getByRole('combobox', {
    name: 'Controlled environment',
    exact: true,
  })
  await expect(input).toHaveValue('Staging API')
  await input.fill('Production')
  await input.press('ArrowDown')
  await input.press('Enter')
  await expect(input).toHaveValue('Production edge')
  await page
    .getByRole('button', { name: 'Reset selection', exact: true })
    .click()
  await expect(input).toHaveValue('Production edge')
  expect(
    await page
      .locator('#advanced-selection-form')
      .evaluate((f) =>
        new FormData(f as HTMLFormElement).get('controlledEnvironment'),
      ),
  ).toBe('Production edge')
})
for (const id of advancedFormExampleIds)
  test(`${id} connects required errors, blocks invalid submission and focuses the missing value`, async ({
    page,
  }) => {
    await page.goto(`/components/${id}`)
    await waitForCatalogReady(page)
    const input =
      id === 'combobox'
        ? page.getByRole('combobox', {
            name: 'Target environment',
            exact: true,
          })
        : page.getByRole('textbox', { name: 'Retry attempts', exact: true })
    if (id === 'combobox')
      await page
        .getByRole('button', { name: 'Clear selection', exact: true })
        .click()
    else await input.fill('')
    await page
      .getByRole('button', {
        name: id === 'combobox' ? 'Submit selection' : 'Submit numbers',
        exact: true,
      })
      .click()
    await expect(input).toBeFocused()
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    const error = page.locator('.surf-field-error').first()
    await expect(error).toHaveText('Please fill out this field.')
    expect(
      (await input.getAttribute('aria-describedby'))?.split(' '),
    ).toContain(await error.getAttribute('id'))
    await expect(page.locator('#preview').getByRole('status')).toHaveText(
      'No form submitted.',
    )
  })

test('Combobox reserves selection-mark space so selected and unselected option labels remain aligned', async ({
  page,
}) => {
  await page.goto('/components/combobox')
  await waitForCatalogReady(page)
  const input = page.getByRole('combobox', {
    name: 'Target environment',
    exact: true,
  })
  await input.fill('Staging')
  await expect(page.getByRole('option')).toHaveCount(2)
  const positions = await page.getByRole('option').evaluateAll((items) =>
    items.map((item) => {
      const text = [...item.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
      )
      if (!text) throw Error('Expected visible option label')
      const range = document.createRange()
      range.selectNodeContents(text)
      return range.getBoundingClientRect().left
    }),
  )
  expect(Math.abs(positions[0] - positions[1])).toBeLessThan(1)
  await expect(page.locator('.surf-combobox-indicator')).toHaveCount(2)
  expect(
    await page
      .getByRole('option')
      .nth(1)
      .locator('.surf-combobox-indicator')
      .evaluate((e) => getComputedStyle(e).visibility),
  ).toBe('hidden')
})

test("a read-only NumberField's steppers look as inert as they are", async ({
  page,
}) => {
  await page.goto('/components/number-field')
  await waitForCatalogReady(page)
  // Mount a read-only field next to the page's own, with the package's classes.
  const opacity = await page.evaluate(() => {
    const step = document.querySelector<HTMLElement>('.surf-number-step')!
    const copy = step.cloneNode(true) as HTMLElement
    copy.setAttribute('data-readonly', '')
    copy.removeAttribute('data-disabled')
    step.parentElement!.append(copy)
    const read = getComputedStyle(copy).opacity
    copy.remove()
    return {
      readOnly: Number(read),
      normal: Number(getComputedStyle(step).opacity),
    }
  })
  expect(opacity.normal).toBe(1)
  expect(opacity.readOnly).toBeLessThan(1)
})
