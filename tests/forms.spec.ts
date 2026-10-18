import { waitForCatalogReady } from './catalog-ready'
import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { formExampleIds } from '../demo/FormExamples'
test.use({ reducedMotion: 'reduce' })
const status = (page: Page) =>
  page.locator('.component-example').getByRole('status')
test('Field associates labels and errors, focuses invalid input and submits valid values', async ({
  page,
}) => {
  await page.goto('/components/field')
  await waitForCatalogReady(page)
  const input = page.getByRole('textbox', {
    name: 'Project name',
    exact: true,
  })
  await page
    .getByRole('button', { name: 'Submit preview', exact: true })
    .click()
  await expect(input).toBeFocused()
  await expect(input).toHaveAttribute('aria-invalid', 'true')
  const describedBy = await input.getAttribute('aria-describedby')
  expect(describedBy).toBeTruthy()
  const error = page.locator('.component-example .pui-field-error').first()
  await expect(error).toBeVisible()
  expect(describedBy!.split(' ')).toContain(await error.getAttribute('id'))
  expect(
    await page.locator('#' + describedBy!.split(' ')[0]).innerText(),
  ).not.toBe('')
  await input.fill('한글 이름')
  await page
    .getByRole('button', { name: 'Submit preview', exact: true })
    .click()
  await expect(input).toHaveAttribute('aria-invalid', 'true')
  await input.fill('demo-e2e-01')
  await page
    .getByRole('button', { name: 'Submit preview', exact: true })
    .click()
  await expect(status(page)).toContainText('"project":"demo-e2e-01"')
  await expect(input).not.toHaveAttribute('aria-invalid', 'true')
})
test('Form exposes simulated server error and clears it on edit; reset restores native values', async ({
  page,
}) => {
  await page.goto('/components/form')
  await waitForCatalogReady(page)
  const input = page.getByRole('textbox', {
      name: 'Project name',
      exact: true,
    }),
    description = page.getByRole('textbox', {
      name: 'Description',
      exact: true,
    })
  await input.fill('demo-e2e-01')
  await description.fill('한글 메모\nEnglish details')
  await page
    .getByRole('button', { name: 'Preview server error', exact: true })
    .click()
  await expect(
    page.getByText('This name is already in use. Enter a different name.', {
      exact: true,
    }),
  ).toBeVisible()
  await expect(input).toHaveAttribute('aria-invalid', 'true')
  await input.fill('demo-e2e-02')
  await expect(input).not.toHaveAttribute('aria-invalid', 'true')
  await page
    .getByRole('button', { name: 'Submit preview', exact: true })
    .click()
  await expect(status(page)).toContainText('"project":"demo-e2e-02"')
  await expect(status(page)).toContainText('한글 메모')
  await page.getByRole('button', { name: 'Reset preview', exact: true }).click()
  await expect(input).toHaveValue('')
  await expect(description).toHaveValue('')
})
test('Fieldset disabled state cascades to nested input and Select', async ({
  page,
}) => {
  await page.goto('/components/fieldset')
  await waitForCatalogReady(page)
  const input = page.getByRole('textbox', {
      name: 'Project name',
      exact: true,
    }),
    select = page.getByRole('combobox', { name: 'Environment', exact: true })
  await page.getByRole('button', { name: 'Disable group', exact: true }).click()
  await expect(input).toBeDisabled()
  await expect(select).toBeDisabled()
  await page.getByRole('button', { name: 'Enable group', exact: true }).click()
  await expect(input).toBeEnabled()
  await expect(select).toBeEnabled()
  await select.click()
  await page.getByRole('option', { name: 'Production', exact: true }).click()
  await expect(select).toHaveAttribute('data-value', 'production')
})
test('Textarea composes with Field, preserves multiline Korean and submits/reset values', async ({
  page,
}) => {
  await page.goto('/components/textarea')
  await waitForCatalogReady(page)
  const input = page.getByRole('textbox', { name: 'Description', exact: true })
  await expect(input).toHaveJSProperty('tagName', 'TEXTAREA')
  await expect(
    page.getByRole('textbox', { name: 'Disabled notes', exact: true }),
  ).toBeDisabled()
  await input.fill('한글 검증\nEnglish evidence')
  await page
    .getByRole('button', { name: 'Submit preview', exact: true })
    .click()
  await expect(status(page)).toContainText('한글 검증\\nEnglish evidence')
  await page.getByRole('button', { name: 'Reset preview', exact: true }).click()
  await expect(input).toHaveValue('')
})
test('Checkbox renders mixed, readonly, disabled and state callback classes; supports Space and reset', async ({
  page,
}) => {
  await page.goto('/components/checkbox')
  await waitForCatalogReady(page)
  const choice = page.getByRole('checkbox', {
    name: 'Clean up temporary accounts',
    exact: true,
  })
  await expect(choice).toBeChecked()
  await expect(choice).toHaveClass(/pui-checkbox/)
  await expect(choice).toHaveClass(/preview-checked/)
  await expect(
    page.getByRole('checkbox', { name: 'Partial selection', exact: true }),
  ).toHaveAttribute('aria-checked', 'mixed')
  const readonly = page.getByRole('checkbox', {
    name: 'Read-only selection',
    exact: true,
  })
  await readonly.click()
  await expect(readonly).toBeChecked()
  await expect(
    page.getByRole('checkbox', { name: 'Unavailable option', exact: true }),
  ).toBeDisabled()
  await choice.focus()
  await page.keyboard.press('Space')
  await expect(choice).not.toBeChecked()
  await expect(choice).not.toHaveClass(/preview-checked/)
  await page.getByRole('button', { name: 'Reset preview', exact: true }).click()
  await expect(choice).toBeChecked()
  await page
    .getByRole('button', { name: 'Submit preview', exact: true })
    .click()
  await expect(status(page)).toContainText('"cleanup":"enabled"')
})
test('CheckboxGroup synchronizes parent mixed state and repeated form values', async ({
  page,
}) => {
  await page.goto('/components/checkbox-group')
  await waitForCatalogReady(page)
  const parent = page.getByRole('checkbox', {
      name: 'All environments',
      exact: true,
    }),
    north = page.getByRole('checkbox', { name: 'Staging', exact: true }),
    south = page.getByRole('checkbox', { name: 'Production', exact: true })
  await expect(parent).toHaveAttribute('aria-checked', 'mixed')
  await parent.click()
  await expect(parent).toBeChecked()
  await expect(north).toBeChecked()
  await expect(south).toBeChecked()
  await page
    .getByRole('button', { name: 'Submit preview', exact: true })
    .click()
  await expect(status(page)).toContainText(
    '"environments":["staging","production"]',
  )
  await south.click()
  await expect(parent).toHaveAttribute('aria-checked', 'mixed')
  await parent.click()
  await parent.focus()
  await page.keyboard.press('Space')
  await expect(north).not.toBeChecked()
  await expect(south).not.toBeChecked()
  await page.getByRole('button', { name: 'Reset preview', exact: true }).click()
  await expect(north).toBeChecked()
  await expect(south).not.toBeChecked()
})
test('RadioGroup uses one tab stop, arrow selection and native form reset', async ({
  page,
}) => {
  await page.goto('/components/radio-group')
  await waitForCatalogReady(page)
  const live = page.getByRole('radio', { name: 'Actual DEMO', exact: true }),
    simulation = page.getByRole('radio', { name: 'Simulation', exact: true })
  await expect(live).toBeChecked()
  await live.focus()
  await page.keyboard.press('ArrowDown')
  await expect(simulation).toBeFocused()
  await expect(simulation).toBeChecked()
  await page
    .getByRole('button', { name: 'Submit preview', exact: true })
    .click()
  await expect(status(page)).toContainText('"source":"simulation"')
  await page.getByRole('button', { name: 'Reset preview', exact: true }).click()
  await expect(live).toBeChecked()
})
test('Switch submits explicit on/off values and preserves readonly state', async ({
  page,
}) => {
  await page.goto('/components/switch')
  await waitForCatalogReady(page)
  const choice = page.getByRole('switch', {
    name: 'Refresh run status',
    exact: true,
  })
  await expect(choice).toBeChecked()
  await choice.focus()
  await page.keyboard.press('Space')
  await expect(choice).not.toBeChecked()
  await page
    .getByRole('button', { name: 'Submit preview', exact: true })
    .click()
  await expect(status(page)).toContainText('"refresh":"disabled"')
  const readonly = page.getByRole('switch', {
    name: 'Read-only setting',
    exact: true,
  })
  await readonly.click()
  await expect(readonly).toBeChecked()
  await expect(
    page.getByRole('switch', { name: 'Unavailable setting', exact: true }),
  ).toBeDisabled()
  await page.getByRole('button', { name: 'Reset preview', exact: true }).click()
  await expect(choice).toBeChecked()
})
test('form primitives have no overflow or automated a11y violations across themes and narrow screens', async ({
  page,
}) => {
  test.setTimeout(90000)
  for (const width of [1440, 320])
    for (const dark of [false, true])
      for (const id of formExampleIds) {
        await page.setViewportSize({ width, height: 1000 })
        await page.goto('/components/' + id)
        await waitForCatalogReady(page)
        if (dark)
          await page.getByRole('button', { name: 'Toggle theme' }).click()
        expect(
          await page.evaluate(() => document.body.scrollWidth <= innerWidth),
          `${id} ${width} dark=${dark}`,
        ).toBe(true)
        const results = await new AxeBuilder({ page })
          .include('#main-content')
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze()
        expect(results.violations, `${id} ${width} dark=${dark}`).toEqual([])
      }
})

test('controlled selection values, callbacks, external ownership and root refs retain their contract', async ({
  page,
}) => {
  await page.goto('/components/form')
  await waitForCatalogReady(page)
  const region = page.locator('.form-contract-example')
  const cleanup = region.getByRole('checkbox', {
      name: 'Controlled cleanup',
      exact: true,
    }),
    refresh = region.getByRole('switch', {
      name: 'Controlled refresh',
      exact: true,
    }),
    simulation = region.getByRole('radio', { name: 'Simulation', exact: true }),
    south = region.getByRole('checkbox', {
      name: 'Controlled Production',
      exact: true,
    })
  await expect(region.getByRole('radiogroup')).toHaveAttribute(
    'data-contract-ref',
    'connected',
  )
  await cleanup.click()
  await refresh.click()
  await simulation.click()
  await south.click()
  await region
    .getByRole('button', { name: 'Native reset', exact: true })
    .click()
  await expect(cleanup).not.toBeChecked()
  await expect(refresh).not.toBeChecked()
  await expect(simulation).toBeChecked()
  await expect(south).toBeChecked()
  await region
    .getByRole('button', { name: 'Submit contract', exact: true })
    .click()
  await expect(region.getByRole('status')).toHaveText(
    '{"cleanup":null,"refresh":"disabled","source":"simulation","environments":["staging","production"]}',
  )
  const north = region.getByRole('checkbox', {
    name: 'Controlled Staging',
    exact: true,
  })
  await north.click()
  await expect(north).not.toBeChecked()
  await region
    .getByRole('button', { name: 'Native reset', exact: true })
    .click()
  await expect(north).not.toBeChecked()
  await expect(south).toBeChecked()
  await region
    .getByRole('button', { name: 'Reject changes', exact: true })
    .click()
  await cleanup.click()
  await expect(cleanup).not.toBeChecked()
  await refresh.click()
  await expect(refresh).not.toBeChecked()
  await region.getByRole('radio', { name: 'Live', exact: true }).click()
  await expect(simulation).toBeChecked()
  await south.click()
  await expect(south).toBeChecked()
  await region
    .getByRole('button', { name: 'Restore initial model', exact: true })
    .click()
  await expect(cleanup).toBeChecked()
  await expect(refresh).toBeChecked()
  await expect(
    region.getByRole('radio', { name: 'Live', exact: true }),
  ).toBeChecked()
  await expect(south).not.toBeChecked()
})
test('canceled native reset leaves uncontrolled values untouched', async ({
  page,
}) => {
  for (const [id, role, name] of [
    ['checkbox', 'checkbox', 'Clean up temporary accounts'],
    ['switch', 'switch', 'Refresh run status'],
  ] as const) {
    await page.goto('/components/' + id)
    await waitForCatalogReady(page)
    const control = page.getByRole(role, { name, exact: true })
    await control.click()
    await expect(control).not.toBeChecked()
    await page.locator('.component-example form').evaluate((form) =>
      form.addEventListener('reset', (event) => event.preventDefault(), {
        once: true,
      }),
    )
    await page
      .getByRole('button', { name: 'Reset preview', exact: true })
      .click()
    await expect(control).not.toBeChecked()
    await page
      .getByRole('button', { name: 'Reset preview', exact: true })
      .click()
    await expect(control).toBeChecked()
  }
})

test('Select and compatibility adapter honor canceled reset before resetting their value', async ({
  page,
}) => {
  for (const id of ['select', 'native-select']) {
    await page.goto('/components/' + id)
    await waitForCatalogReady(page)
    const control = page.getByRole('combobox', {
      name: 'Environment',
      exact: true,
    })
    await control.click()
    await page.getByRole('option', { name: 'Production', exact: true }).click()
    await page.locator('.component-example form').evaluate((form) =>
      form.addEventListener('reset', (event) => event.preventDefault(), {
        once: true,
      }),
    )
    await page.getByRole('button', { name: 'Reset', exact: true }).click()
    await expect(control).toHaveAttribute('data-value', 'production')
    await page.getByRole('button', { name: 'Reset', exact: true }).click()
    await expect(control).toHaveAttribute('data-value', 'staging')
  }
})

test('choice controls reflow with enlarged text, respect RTL and forced colors, and keep touch labels large', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 1000 })
  await page.goto('/components/switch')
  await waitForCatalogReady(page)
  expect(
    await page
      .locator('.component-example .pui-choice-label')
      .first()
      .evaluate((el) => el.getBoundingClientRect().height),
  ).toBeGreaterThanOrEqual(44)
  await page.evaluate(() => {
    document.documentElement.dir = 'rtl'
    document.documentElement.style.fontSize = '32px'
  })
  expect(
    await page.evaluate(() => document.body.scrollWidth <= innerWidth),
  ).toBe(true)
  const root = page.locator('.component-example .pui-switch').first(),
    thumb = root.locator('.pui-switch-thumb')
  const r = await root.boundingBox(),
    t = await thumb.boundingBox()
  expect(t!.x + t!.width / 2).toBeLessThan(r!.x + r!.width / 2)
  // WebKit does not expose forced-color-adjust. Keep its RTL, enlarged text,
  // touch target and reduced-motion assertions active; grade this mode only
  // on engines that implement the property.
  if (await page.evaluate(() => CSS.supports('forced-color-adjust', 'none'))) {
    await page.emulateMedia({ forcedColors: 'active' })
    expect(
      await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
    ).toBe(true)
    expect(
      await root.evaluate((el) => getComputedStyle(el).forcedColorAdjust),
    ).toBe('none')
  } else {
    test.info().annotations.push({
      type: 'unsupported',
      description: 'forced-color-adjust is unavailable in this engine',
    })
  }
  await page.emulateMedia({ forcedColors: 'none', reducedMotion: 'reduce' })
  expect(
    await thumb.evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe('0s')
})
