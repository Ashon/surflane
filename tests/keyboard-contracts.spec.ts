import { test, expect } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'

// Each test follows a component page's keyboard notes, step by step.
test.use({ reducedMotion: 'reduce' })

test('Combobox: Escape closes the popup, then clears the selection; a chip goes with its named remove button', async ({
  page,
}) => {
  await page.goto('/components/combobox')
  await waitForCatalogReady(page)
  const input = page.getByRole('combobox', { name: 'Target environment' })
  await expect(input).toHaveValue('Staging web')
  await input.focus()
  await page.keyboard.press('ArrowDown')
  await expect(input).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Escape')
  await expect(input).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('listbox')).toHaveCount(0)
  await expect(input).toHaveValue('Staging web')
  await page.keyboard.press('Escape')
  await expect(input).toHaveValue('')
  await expect(input).toBeFocused()
  const remove = page.getByRole('button', { name: 'Remove Reader' })
  await remove.focus()
  await page.keyboard.press('Enter')
  await expect(remove).toHaveCount(0)
  // Focus stays in the field rather than falling to the page.
  await expect(
    page.getByRole('combobox', { name: 'Test user roles' }),
  ).toBeFocused()
})

test('Popover: Enter opens it and moves focus inside; Escape closes it and returns focus; an outside click closes it and leaves focus where it landed', async ({
  page,
}) => {
  await page.goto('/components/popover')
  await waitForCatalogReady(page)
  const trigger = page.getByRole('button', { name: 'Inspect account' })
  await trigger.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.locator(':focus')).toHaveCount(1)
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(dialog).toBeVisible()
  // A click on the page's text moves focus to the main region it sits in.
  const text = (await page.locator('#usage p').first().boundingBox())!
  await page.mouse.click(text.x + 4, text.y + 4)
  await expect(dialog).toBeHidden()
  await expect(page.locator('#main-content')).toBeFocused()
})

test('NumberField: arrows step within min and max; read-only keeps the value', async ({
  page,
}) => {
  await page.goto('/components/number-field')
  await waitForCatalogReady(page)
  const field = page.getByRole('textbox', { name: 'Retry attempts' })
  await expect(field).toHaveValue('2')
  await field.focus()
  await page.keyboard.press('ArrowUp')
  await expect(field).toHaveValue('3')
  for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowDown')
  await expect(field).toHaveValue('1')
  for (let i = 0; i < 10; i++) await page.keyboard.press('ArrowUp')
  await expect(field).toHaveValue('8')
  await page.getByRole('checkbox', { name: 'Read only' }).first().check()
  await field.focus()
  await page.keyboard.press('ArrowDown')
  await page.keyboard.type('5')
  await expect(field).toHaveValue('8')
  const decrease = page.getByRole('button', { name: 'Decrease attempts' })
  await decrease.click({ force: true })
  await expect(field).toHaveValue('8')
})

test('Chart: Enter and Space on a legend button flip its series and keep focus; the data table opens by keyboard', async ({
  page,
}) => {
  await page.goto('/components/chart')
  await waitForCatalogReady(page)
  const legend = page.locator('main .surf-chart-legend-button').first()
  await legend.focus()
  await expect(legend).toHaveAttribute('aria-pressed', 'true')
  await page.keyboard.press('Enter')
  await expect(legend).toHaveAttribute('aria-pressed', 'false')
  await expect(legend).toBeFocused()
  await page.keyboard.press('Space')
  await expect(legend).toHaveAttribute('aria-pressed', 'true')
  await expect(legend).toBeFocused()
  const details = page.locator('main details').first()
  const summary = details.locator('summary')
  await summary.focus()
  await page.keyboard.press('Enter')
  await expect(details).toHaveAttribute('open', '')
  await page.keyboard.press('Space')
  await expect(details).not.toHaveAttribute('open', '')
})

test('AppShell: the sidebar shortcut leaves text fields alone, and collapsed links name themselves on keyboard focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/patterns/app-shell')
  await waitForCatalogReady(page)
  const shell = page.locator('.app-shell-preview')
  await expect(shell).toHaveAttribute('data-sidebar', 'expanded')
  // ⌘B in a text field is the field's own (bold, or nothing), never the shell's.
  await page
    .locator('main')
    .evaluate((main) =>
      main.insertAdjacentHTML(
        'afterbegin',
        '<input aria-label="Scratch field" data-test-field />',
      ),
    )
  await page.getByRole('textbox', { name: 'Scratch field' }).focus()
  await page.keyboard.press('ControlOrMeta+b')
  await expect(shell).toHaveAttribute('data-sidebar', 'expanded')
  await page
    .getByRole('button', { name: 'Collapse workspace sidebar', exact: true })
    .click()
  await expect(shell).toHaveAttribute('data-sidebar', 'collapsed')
  const expand = page.getByRole('button', {
    name: 'Expand workspace sidebar',
    exact: true,
  })
  await expect(expand).toHaveAttribute('aria-expanded', 'false')
  const resources = page
    .getByRole('complementary', { name: 'Example workspace sidebar' })
    .getByRole('link', { name: 'Resources', exact: true })
  await resources.focus()
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Tab')
  await expect(resources).toBeFocused()
  await expect(page.locator('.surf-tooltip[data-open]')).toHaveText('Resources')
  await expand.click()
})

test('Tree: * expands every group beside the focused item', async ({
  page,
}) => {
  await page.goto('/components/tree')
  await waitForCatalogReady(page)
  const tree = page.getByRole('tree', { name: 'Resource hierarchy' })
  const item = (name: string) =>
    tree.getByRole('treeitem', { name, exact: true })
  await item('Projects').focus()
  await page.keyboard.press('ArrowRight')
  const first = item('Workspace')
  await expect(first).toBeFocused()
  const level = await first.getAttribute('aria-level')
  const groups = tree.locator(
    `[role="treeitem"][aria-level="${level}"][aria-expanded]`,
  )
  expect(await groups.count()).toBeGreaterThan(1)
  await page.keyboard.press('*')
  for (const group of await groups.all())
    await expect(group).toHaveAttribute('aria-expanded', 'true')
  await expect(first).toBeFocused()
})

test('CodeBlock: Enter and Space on the copy button copy the source', async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          ;(window as any).copies = ((window as any).copies ?? 0) + 1
          ;(window as any).copied = text
        },
      },
    }),
  )
  await page.goto('/components/code')
  await waitForCatalogReady(page)
  const block = page.locator('#preview .surf-code-block').first()
  const copy = block.locator('.surf-code-copy')
  await copy.focus()
  await page.keyboard.press('Enter')
  await expect(copy).toHaveText('Copied')
  expect(await page.evaluate(() => (window as any).copied)).toBe(
    await block.locator('pre code').textContent(),
  )
  await expect(copy).toHaveText('Copy code', { timeout: 4000 })
  await page.keyboard.press('Space')
  await expect(copy).toHaveText('Copied')
  await expect(copy).toBeFocused()
  expect(await page.evaluate(() => (window as any).copies)).toBe(2)
})

test('Dashboard: Retry by keyboard leaves focus on its panel title, not the page', async ({
  page,
}) => {
  await page.goto('/patterns/dashboard')
  await waitForCatalogReady(page)
  await page
    .getByRole('group', { name: 'Panel states' })
    .getByRole('button', { name: 'Error', exact: true })
    .click()
  const panel = page.getByRole('group', {
    name: 'GPU temperature',
    exact: true,
  })
  const retry = panel.getByRole('button', { name: 'Retry' })
  await retry.focus()
  await page.keyboard.press('Enter')
  await expect(retry).toHaveCount(0)
  await expect(
    panel.getByRole('heading', { name: 'GPU temperature', exact: true }),
  ).toBeFocused()
  await expect(
    panel.getByRole('heading', { name: 'GPU temperature', exact: true }),
  ).toHaveCSS('outline-style', 'solid')
})

test('DatePicker: arrows move between segments, Shift+Page keys move by year, and a range is picked by keyboard', async ({
  page,
}) => {
  await page.goto('/components/date-picker')
  await waitForCatalogReady(page)
  const segment = (name: string) =>
    page.getByRole('spinbutton', { name, exact: true })
  await segment('month, Run date').focus()
  await page.keyboard.press('ArrowRight')
  await expect(segment('day, Run date')).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(segment('month, Run date')).toBeFocused()
  // Zoned execution has no bounds, so Shift+Page keys move a whole year.
  const field = page.locator('.surf-date-picker').filter({
    has: page.locator('.surf-field-label', { hasText: /^Zoned execution$/ }),
  })
  const trigger = field.locator('.surf-date-trigger')
  await expect(trigger).toHaveAccessibleName(/calendar/i)
  await trigger.focus()
  await page.keyboard.press('Enter')
  const grid = page.getByRole('dialog').getByRole('grid')
  const [month, year] = (await grid.getAttribute('aria-label'))!.split(' ')
  await page.keyboard.press('Shift+PageDown')
  await expect(grid).toHaveAccessibleName(`${month} ${Number(year) + 1}`)
  await page.keyboard.press('Shift+PageUp')
  await expect(grid).toHaveAccessibleName(`${month} ${year}`)
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  // A range: Enter on the start, arrows to the end, Enter again.
  const range = page
    .locator('.surf-date-picker')
    .filter({
      has: page.locator('.surf-field-label', { hasText: /^Release window$/ }),
    })
    .locator('.surf-date-trigger')
  await range.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Enter')
  for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(range).toBeFocused()
  await expect(page.locator('[data-date-value]')).toContainText('range: ')
})
