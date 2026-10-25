import { test, expect, type Locator } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'

// Focuses the last tabbable element before the widget, so the next Tab enters it
// the way a reader arrives.
async function focusBefore(widget: Locator) {
  await widget.evaluate((root) => {
    const tabbable = [
      ...document.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea, [tabindex]',
      ),
    ].filter(
      (el) =>
        el.tabIndex >= 0 &&
        !el.matches(':disabled') &&
        el.getClientRects().length > 0 &&
        root.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING,
    )
    tabbable.at(-1)!.focus()
  })
}

// Composite widgets take one Tab stop and move inside with the arrows, skipping
// what is disabled.
test.use({ reducedMotion: 'reduce' })

test('RadioGroup: Tab lands on the checked radio; arrows check the next, skip a disabled one and wrap', async ({
  page,
}) => {
  await page.goto('/components/radio-group')
  await waitForCatalogReady(page)
  const radio = (name: string) => page.getByRole('radio', { name, exact: true })
  await focusBefore(page.getByRole('radiogroup', { name: 'Log source' }))
  await page.keyboard.press('Tab')
  await expect(radio('Actual DEMO')).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(radio('Simulation')).toBeFocused()
  await expect(radio('Simulation')).toBeChecked()
  await page.keyboard.press('ArrowDown')
  await expect(radio('Actual DEMO')).toBeFocused()
  await expect(radio('Actual DEMO')).toBeChecked()
  await expect(radio('Unavailable source')).not.toBeChecked()
})

test('ToggleGroup: Tab enters at the pressed item, Home and End reach the ends, a disabled item is skipped, and disabling the group disables every item', async ({
  page,
}) => {
  await page.goto('/components/toggle-group')
  await waitForCatalogReady(page)
  const group = page.getByRole('group', { name: 'Log source', exact: true })
  const item = (name: string) =>
    group.getByRole('button', { name, exact: true })
  await focusBefore(group)
  await page.keyboard.press('Tab')
  await expect(item('Live')).toBeFocused()
  await page.keyboard.press('End')
  await expect(item('Simulation')).toBeFocused()
  await page.keyboard.press('Home')
  await expect(item('Live')).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')
  await expect(item('Live')).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Space')
  await expect(item('Simulation')).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('checkbox', { name: 'Disable commands' }).check()
  for (const name of ['Live', 'Simulation', 'Unavailable'])
    await expect(item(name)).toBeDisabled()
})

test('Toolbar: arrows follow the reading direction, and Home and End reach the ends', async ({
  page,
}) => {
  await page.goto('/components/toolbar')
  await waitForCatalogReady(page)
  const toolbar = page.getByRole('toolbar', { name: 'Run tools' })
  // A disabled item stays in the arrow order, so it can be found.
  const items = toolbar.locator('button, input, a')
  const count = await items.count()
  await items.first().focus()
  await page.keyboard.press('End')
  await expect(items.nth(count - 1)).toBeFocused()
  await page.keyboard.press('Home')
  await expect(items.first()).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(items.nth(1)).toBeFocused()
  await page.getByRole('checkbox', { name: 'Right to left' }).check()
  await items.first().focus()
  // Right to left, the next item sits to the left.
  await page.keyboard.press('ArrowLeft')
  await expect(items.nth(1)).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(items.first()).toBeFocused()
})

test('Tabs: right to left the list mirrors, the arrows follow it and the indicator stays under the selected tab', async ({
  page,
}) => {
  await page.goto('/components/tabs')
  await waitForCatalogReady(page)
  await page.getByRole('checkbox', { name: 'Right to left' }).check()
  const tab = (name: string) => page.getByRole('tab', { name, exact: true })
  const [overview, logs] = await Promise.all([
    tab('Overview').boundingBox(),
    tab('Logs').boundingBox(),
  ])
  expect(logs!.x).toBeLessThan(overview!.x)
  await tab('Overview').focus()
  await page.keyboard.press('ArrowLeft')
  await expect(tab('Logs')).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(tab('Logs')).toHaveAttribute('aria-selected', 'true')
  const indicator = page.locator('main .surf-tabs-indicator')
  await expect
    .poll(async () => {
      const [a, b] = await Promise.all([
        indicator.boundingBox(),
        tab('Logs').boundingBox(),
      ])
      return (
        Math.round(a!.x - b!.x) === 0 && Math.round(a!.width - b!.width) === 0
      )
    })
    .toBe(true)
  await page.keyboard.press('ArrowRight')
  await expect(tab('Overview')).toBeFocused()
})
