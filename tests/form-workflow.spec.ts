import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
const name = (p: Page) =>
  p.getByRole('textbox', { name: 'Environment name', exact: true })
const url = (p: Page) =>
  p.getByRole('textbox', { name: 'Service URL', exact: true })
const form = (p: Page) =>
  p.getByRole('form', {
    name: 'Environment registration preview',
    exact: true,
  })
async function choose(p: Page, label: string) {
  await p.getByRole('combobox', { name: 'Preview response' }).click()
  await p.getByRole('option', { name: label, exact: true }).click()
}
async function valid(p: Page) {
  await name(p).fill('preview-environment')
  await url(p).fill('https://api.example.test')
}
async function begin(p: Page) {
  await p.getByRole('button', { name: 'Register preview', exact: true }).click()
  await expect(form(p)).toHaveAttribute('aria-busy', 'true')
}
const complete = (p: Page) =>
  p
    .getByRole('button', { name: 'Complete preview request', exact: true })
    .click()
test('validation focuses errors, pending blocks duplicates, success uses snapshot and reset clears validation', async ({
  page,
}) => {
  await page.goto('/patterns/form-workflow')
  await waitForCatalogReady(page)
  await page
    .getByRole('button', { name: 'Register preview', exact: true })
    .click()
  await expect(name(page)).toBeFocused()
  await expect(name(page)).toHaveAttribute('aria-invalid', 'true')
  await name(page).fill('invalid NAME')
  await url(page).fill('https://api.example.test')
  await page
    .getByRole('button', { name: 'Register preview', exact: true })
    .click()
  await expect(name(page)).toHaveAttribute('aria-invalid', 'true')
  await valid(page)
  await begin(page)
  await expect(name(page)).toBeDisabled()
  await expect(
    page.getByRole('button', { name: 'Cancel request' }),
  ).toBeFocused()
  await form(page).evaluate((el) => {
    ;(el as HTMLFormElement).requestSubmit()
    ;(el as HTMLFormElement).requestSubmit()
  })
  await expect(
    page.getByText('Preview requests started: 1.', { exact: false }),
  ).toBeVisible()
  await complete(page)
  await expect(
    page.getByText('Registration preview complete', { exact: true }),
  ).toBeFocused()
  await expect(page.locator('.form-workflow-example')).toContainText(
    'preview-environment / https://api.example.test / cluster-a',
  )
  await page.getByRole('button', { name: 'Start another preview' }).click()
  await expect(name(page)).toBeFocused()
  await expect(name(page)).toHaveValue('')
  await expect(url(page)).toHaveValue('')
  await expect(name(page)).not.toHaveAttribute('aria-invalid', 'true')
})
test('server field errors, request retry and permission recovery preserve values and focus', async ({
  page,
}) => {
  await page.goto('/patterns/form-workflow')
  await waitForCatalogReady(page)
  await valid(page)
  await choose(page, 'Field conflict')
  await begin(page)
  await complete(page)
  await expect(name(page)).toBeFocused()
  await expect(name(page)).toHaveAttribute('aria-invalid', 'true')
  await expect(url(page)).toHaveValue('https://api.example.test')
  await expect(
    page.locator('.pui-field-error').filter({ hasText: 'already registered' }),
  ).toBeVisible()
  await name(page).fill('new-environment')
  await expect(name(page)).not.toHaveAttribute('aria-invalid', 'true')
  await choose(page, 'Request failure')
  await begin(page)
  await complete(page)
  await expect(
    page.getByRole('button', { name: 'Retry registration' }),
  ).toBeFocused()
  await expect(name(page)).toHaveValue('new-environment')
  await choose(page, 'Permission denied')
  await page.getByRole('button', { name: 'Retry registration' }).click()
  await complete(page)
  await expect(name(page)).toBeDisabled()
  await expect(
    page.getByRole('button', { name: 'Restore preview access' }),
  ).toBeFocused()
  await page.getByRole('button', { name: 'Restore preview access' }).click()
  await expect(name(page)).toBeFocused()
  await expect(name(page)).toHaveValue('new-environment')
  await choose(page, 'Success')
  await begin(page)
  await complete(page)
  await expect(
    page.getByText('Registration preview complete', { exact: true }),
  ).toBeFocused()
})
test('cancel ignores a queued old success and permits a fresh submission; navigation aborts pending work', async ({
  page,
}) => {
  await page.goto('/patterns/form-workflow')
  await waitForCatalogReady(page)
  await valid(page)
  await begin(page)
  await page.locator('.form-workflow-example').evaluate((el) => {
    const buttons = [...el.querySelectorAll('button')]
    ;(
      buttons.find(
        (b) => b.textContent === 'Complete preview request',
      ) as HTMLButtonElement
    ).click()
    ;(
      buttons.find(
        (b) => b.textContent === 'Cancel request',
      ) as HTMLButtonElement
    ).click()
  })
  await expect(name(page)).toBeFocused()
  await expect(name(page)).toHaveValue('preview-environment')
  await expect(
    page.getByText('Registration preview complete', { exact: true }),
  ).toHaveCount(0)
  await expect(page.locator('.workflow-notice')).toContainText(
    'Request canceled',
  )
  await begin(page)
  await expect(
    page.getByText('Preview requests started: 2.', { exact: false }),
  ).toBeVisible()
  await page
    .getByRole('navigation', { name: 'Primary navigation', exact: true })
    .getByRole('link', { name: 'Overview', exact: true })
    .click()
  await waitForCatalogReady(page)
  await expect(page.locator('#page-title')).toHaveText(
    'The interface layer for platform teams.',
  )
  await expect(page.locator('.form-workflow-example')).toHaveCount(0)
})
for (const theme of ['light', 'dark'])
  test(`form workflow states remain accessible and bounded in ${theme}`, async ({
    page,
  }) => {
    await page.goto('/patterns/form-workflow')
    await waitForCatalogReady(page)
    if (theme === 'dark') {
      await page.getByRole('button', { name: 'Toggle theme' }).click()
      await expect(page.locator('html')).not.toHaveAttribute(
        'data-theme-switching',
      )
    }
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 1000 })
      expect(
        await form(page).evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true)
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    }
    await valid(page)
    for (const outcome of [
      'Field conflict',
      'Request failure',
      'Permission denied',
      'Success',
    ]) {
      await choose(page, outcome)
      const button = page.getByRole('button', {
        name: /^(Register preview|Retry registration)$/,
      })
      await button.click()
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
      await complete(page)
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
      if (outcome === 'Field conflict')
        await name(page).fill('alternate-environment')
      if (outcome === 'Permission denied')
        await page
          .getByRole('button', { name: 'Restore preview access' })
          .click()
    }
  })
