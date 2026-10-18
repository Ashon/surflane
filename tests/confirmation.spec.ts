import { waitForCatalogReady } from './catalog-ready'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('important confirmation focuses cancel, ignores outside press, and confirms only explicitly', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/patterns/interaction-lab')
  await waitForCatalogReady(page)
  const trigger = page.getByRole('button', {
    name: 'Preview discard confirmation',
  })
  await trigger.click()
  const confirm = page.getByRole('alertdialog', {
    name: 'Discard this draft?',
  })
  await expect(
    confirm.getByRole('button', { name: 'Keep draft' }),
  ).toBeFocused()
  await page.mouse.click(2, 2)
  await expect(confirm).toBeVisible()
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([])
  await page.keyboard.press('Escape')
  await expect(confirm).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(
    page
      .locator('section[aria-labelledby=confirmations-title]')
      .getByRole('status'),
  ).toHaveText('No preview action taken.')
  await trigger.click()
  await confirm.getByRole('button', { name: 'Keep draft' }).click()
  await expect(
    page
      .locator('section[aria-labelledby=confirmations-title]')
      .getByRole('status'),
  ).toHaveText('No preview action taken.')
  await trigger.click()
  await confirm.getByRole('button', { name: 'Discard preview draft' }).click()
  await expect(confirm).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(
    page
      .locator('section[aria-labelledby=confirmations-title]')
      .getByRole('status'),
  ).toHaveText('Preview draft discarded.')
})

test('lightweight confirmation uses a popover without treating dismissal as approval', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/patterns/interaction-lab')
  await waitForCatalogReady(page)
  const trigger = page.getByRole('button', {
    name: 'Preview reset confirmation',
  })
  await trigger.click()
  const confirm = page.getByRole('dialog', { name: 'Reset preview filters?' })
  await expect(confirm).toBeVisible()
  await confirm.getByRole('button', { name: 'Keep filters' }).click()
  await expect(confirm).toBeHidden()
  await expect(
    page
      .locator('section[aria-labelledby=confirmations-title]')
      .getByRole('status'),
  ).toHaveText('No preview action taken.')
  await trigger.click()
  await confirm
    .getByRole('button', { name: 'Reset preview filters', exact: true })
    .click()
  await expect(confirm).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(
    page
      .locator('section[aria-labelledby=confirmations-title]')
      .getByRole('status'),
  ).toHaveText('Preview filters reset.')
})
