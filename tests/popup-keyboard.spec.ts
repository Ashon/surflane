import { test, expect, type Locator, type Page } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'

test.use({ reducedMotion: 'reduce' })

test('Menu: arrows, Home, End and typeahead move; Enter and Space run; a disabled item does nothing; Escape returns focus', async ({
  page,
}) => {
  await page.goto('/components/menu')
  await waitForCatalogReady(page)
  const trigger = page.getByRole('button', { name: 'Open actions' })
  await trigger.focus()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await page.keyboard.press('Enter')
  const menu = page.getByRole('menu')
  await expect(menu).toBeVisible()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  const item = (name: string) => menu.getByRole('menuitem', { name })
  await expect(item('Inspect')).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(item('Export preview')).toBeFocused()
  await page.keyboard.press('End')
  await expect(item('Delete unavailable')).toBeFocused()
  await expect(item('Delete unavailable')).toHaveAttribute(
    'aria-disabled',
    'true',
  )
  // A disabled item stays findable but runs nothing and keeps the menu open.
  await page.keyboard.press('Enter')
  await expect(menu).toBeVisible()
  await page.keyboard.press('Home')
  await expect(item('Inspect')).toBeFocused()
  await page.keyboard.type('e')
  await expect(item('Export preview')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(trigger).toBeFocused()
  // Space opens it and runs the item, and focus comes back to the trigger.
  await page.keyboard.press('Space')
  await expect(item('Inspect')).toBeFocused()
  await page.keyboard.press('Space')
  await expect(menu).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(page.getByText('Inspect selected.')).toBeVisible()
})

test('Select: arrows and Space open it, typeahead highlights, a disabled option is findable but not chosen, Escape keeps the value', async ({
  page,
}) => {
  await page.goto('/components/select')
  await waitForCatalogReady(page)
  const trigger = page.getByRole('combobox', {
    name: 'Environment',
    exact: true,
  })
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(trigger).toHaveText(/Staging/)
  await trigger.focus()
  await page.keyboard.press('ArrowDown')
  const list = page.getByRole('listbox')
  await expect(list).toBeVisible()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  const option = (name: string) =>
    list.getByRole('option', { name, exact: true })
  await expect(option('Staging')).toBeFocused()
  await page.keyboard.type('p')
  await expect(option('Production')).toBeFocused()
  // A disabled option stays findable, as disabled menu items and tree items do,
  // and Enter on it chooses nothing.
  await page.keyboard.press('ArrowDown')
  await expect(option('Unavailable')).toBeFocused()
  await expect(option('Unavailable')).toHaveAttribute('aria-disabled', 'true')
  await page.keyboard.press('Enter')
  await expect(list).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(list).toBeHidden()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveText(/Staging/)
  await page.keyboard.press('Space')
  await expect(option('Staging')).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(option('Production')).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(list).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveText(/Production/)
})

// Every popup trigger says whether its popup is open, and closing by Escape
// gives focus back to it.
const triggers: [string, (page: Page) => Locator][] = [
  [
    '/components/combobox',
    (p) => p.getByRole('combobox', { name: 'Target environment' }).first(),
  ],
  [
    '/components/autocomplete',
    (p) => p.getByRole('combobox', { name: 'Pipeline search' }).first(),
  ],
  [
    '/components/popover',
    (p) => p.getByRole('button', { name: 'Inspect account' }),
  ],
  [
    '/components/menubar',
    (p) => p.getByRole('menuitem', { name: 'Run', exact: true }),
  ],
  [
    '/patterns/dashboard',
    (p) => p.getByRole('button', { name: 'About GPU temperature' }),
  ],
  [
    '/components/navigation-menu',
    (p) => p.getByRole('button', { name: 'Products' }).first(),
  ],
]
for (const [route, find] of triggers)
  test(`${route}: the trigger reports its popup and gets focus back on Escape`, async ({
    page,
  }) => {
    await page.goto(route)
    await waitForCatalogReady(page)
    const trigger = find(page)
    await trigger.scrollIntoViewIfNeeded()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await trigger.focus()
    await page.keyboard.press(
      (await trigger.getAttribute('role')) === 'combobox'
        ? 'ArrowDown'
        : 'Enter',
    )
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Escape')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toBeFocused()
  })
