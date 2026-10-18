import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
const cards = (page: Page) => page.locator('.pui-toast:not([data-limited])')
async function batch(page: Page) {
  await page.goto('/components/toast')
  await waitForCatalogReady(page)
  await page.getByRole('combobox', { name: 'Notification duration' }).click()
  await page
    .getByRole('option', { name: 'Until dismissed', exact: true })
    .click()
  await page.getByRole('button', { name: 'Show batch', exact: true }).click()
  await expect(cards(page)).toHaveCount(3)
}
async function separated(page: Page) {
  await expect
    .poll(() =>
      cards(page).evaluateAll((elements) => {
        const boxes = elements
          .map((element) => element.getBoundingClientRect())
          .sort((a, b) => a.top - b.top)
        return boxes.every(
          (box, index) => index === 0 || box.top >= boxes[index - 1].bottom + 4,
        )
      }),
    )
    .toBe(true)
}
test('compact stack peeks without overlapping its readable controls, and hover expands complete cards', async ({
  page,
}) => {
  await batch(page)
  const viewport = page.getByRole('region', { name: 'Preview notifications' })
  await expect(viewport).not.toHaveAttribute('data-expanded')
  const behind = viewport.locator(
    '.pui-toast:not([data-limited]) .pui-toast-content[data-behind]',
  )
  await expect(behind).toHaveCount(2)
  for (const element of await behind.all())
    await expect(element).toHaveCSS('opacity', '0')
  await cards(page).first().hover()
  await expect(viewport).toHaveAttribute('data-expanded', '')
  await separated(page)
  for (const element of await behind.all())
    await expect(element).toHaveCSS('opacity', '1')
})
test('F6 expands the deck and keeps keyboard dismissal available', async ({
  page,
}) => {
  await batch(page)
  await page.keyboard.press('F6')
  const viewport = page.getByRole('region', { name: 'Preview notifications' })
  await expect(viewport).toBeFocused()
  await expect(viewport).toHaveAttribute('data-expanded', '')
  await separated(page)
  await page.keyboard.press('Tab')
  await expect(cards(page).first()).toBeFocused()
  const dismissedId = await cards(page).first().getAttribute('id')
  await page.keyboard.press('Escape')
  // The previously limited fourth notification takes the freed visible slot.
  await expect(page.locator('.pui-toast')).toHaveCount(3)
  await expect(cards(page)).toHaveCount(3)
  await expect(page.locator(`[id="${dismissedId}"]`)).toHaveCount(0)
})
test('expanded list is available without hover and retains all card content', async ({
  page,
}) => {
  await batch(page)
  await page
    .getByRole('combobox', { name: 'Notification presentation' })
    .click()
  await page.getByRole('option', { name: 'Expanded list', exact: true }).click()
  await page.getByRole('button', { name: 'Show batch', exact: true }).click()
  await expect(page.locator('.pui-toast-viewport')).toHaveAttribute(
    'data-layout',
    'list',
  )
  await separated(page)
  for (const content of await page.locator('.pui-toast-content').all())
    await expect(content).toHaveCSS('opacity', '1')
})
for (const theme of ['light', 'dark'])
  test(`compact and pointer-expanded notifications pass axe in ${theme}`, async ({
    page,
  }) => {
    await batch(page)
    if (theme === 'dark')
      await page.getByRole('button', { name: 'Toggle theme' }).click()
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    await cards(page).first().hover()
    await separated(page)
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  })
test('touch activation expands the stack in a narrow viewport with full-size close targets', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 320, height: 480 },
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  await batch(page)
  await cards(page).first().tap()
  await expect(
    page.getByRole('region', { name: 'Preview notifications' }),
  ).toHaveAttribute('data-expanded', '')
  await separated(page)
  const close = cards(page)
    .first()
    .getByRole('button', { name: 'Dismiss notification' })
  const box = (await close.boundingBox())!
  expect(box.width).toBeGreaterThanOrEqual(44)
  expect(box.height).toBeGreaterThanOrEqual(44)
  const toast = (await cards(page).first().boundingBox())!
  expect(toast.x).toBeGreaterThanOrEqual(0)
  expect(toast.x + toast.width).toBeLessThanOrEqual(320)
  expect(toast.y + toast.height).toBeLessThanOrEqual(480)
  await context.close()
})

test('settings share a control baseline and actions keep consistent sizes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/components/toast')
  await waitForCatalogReady(page)
  const settings = page.locator('.toast-demo-settings')
  const select = (await settings.getByRole('combobox').boundingBox())!
  for (const choice of await settings.locator('.pui-choice-label').all()) {
    const box = (await choice.boundingBox())!
    expect(box.y + box.height / 2).toBeCloseTo(select.y + select.height / 2, 0)
  }
  const heights = await page
    .locator('.toast-demo-actions button')
    .evaluateAll((items) =>
      items.map((item) => item.getBoundingClientRect().height),
    )
  expect(new Set(heights).size).toBe(1)
  for (const width of [960, 769, 320]) {
    await page.setViewportSize({ width, height: 900 })
    expect(
      await page.evaluate(() => document.body.scrollWidth <= innerWidth),
    ).toBe(true)
  }
})
test('expanded notification scrollport reserves shadow space without visible scrollbars', async ({
  page,
}) => {
  await batch(page)
  await cards(page).first().hover()
  await separated(page)
  const viewport = page.locator('.pui-toast-viewport')
  await expect(viewport).toHaveCSS('scrollbar-width', 'none')
  const geometry = await viewport.evaluate((element) => {
    const parent = element.getBoundingClientRect()
    return [...element.querySelectorAll('.pui-toast:not([data-limited])')].map(
      (item) => {
        const box = item.getBoundingClientRect()
        return {
          left: box.left - parent.left,
          right: parent.right - box.right,
          bottom: parent.bottom - box.bottom,
        }
      },
    )
  })
  for (const box of geometry) {
    expect(box.left).toBeGreaterThanOrEqual(24)
    expect(box.right).toBeGreaterThanOrEqual(24)
    expect(box.bottom).toBeGreaterThanOrEqual(24)
  }
})

test('mixed-height stack keeps its bottom anchor throughout pointer leave and focus-out collapse', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/components/toast')
  await waitForCatalogReady(page)
  await page.evaluate(() => document.fonts.ready)
  await page.getByRole('combobox', { name: 'Notification duration' }).click()
  await page
    .getByRole('option', { name: 'Until dismissed', exact: true })
    .click()
  await page.getByRole('button', { name: 'Show success', exact: true }).click()
  await page
    .getByRole('button', { name: 'Archive preview item', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Preview async task', exact: true })
    .click()
  await expect(
    page.getByText('Export task complete', { exact: true }),
  ).toBeVisible()
  const viewport = page.getByRole('region', { name: 'Preview notifications' })
  const heights = await cards(page).evaluateAll((elements) =>
    elements.map((el) =>
      parseFloat(getComputedStyle(el).getPropertyValue('--toast-height')),
    ),
  )
  expect(Math.max(...heights) - Math.min(...heights)).toBeGreaterThan(20)
  for (const interaction of ['pointer', 'keyboard']) {
    if (interaction === 'pointer') await cards(page).first().hover()
    else await page.keyboard.press('F6')
    await expect(viewport).toHaveAttribute('data-expanded', '')
    await page.waitForTimeout(450)
    const sampling = page.evaluate(
      () =>
        new Promise<number[]>((resolve) => {
          const until = performance.now() + 650
          const values: number[] = []
          const frame = () => {
            values.push(
              document
                .querySelector('.pui-toast:not([data-limited])')!
                .getBoundingClientRect().bottom,
            )
            if (performance.now() < until) requestAnimationFrame(frame)
            else resolve(values)
          }
          frame()
        }),
    )
    if (interaction === 'pointer') await page.mouse.move(1, 1)
    else
      await page
        .getByRole('button', { name: 'Show success', exact: true })
        .focus()
    const positions = await sampling
    await expect(viewport).not.toHaveAttribute('data-expanded')
    expect(
      Math.max(...positions) - Math.min(...positions),
      interaction,
    ).toBeLessThan(1)
  }
})
