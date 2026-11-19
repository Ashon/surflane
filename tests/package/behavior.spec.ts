import { test, expect, type Page } from '@playwright/test'

// What the package does when used: focus moves, the clipboard fallback, and the footer
// and layout props. The fixture is tests/package/behavior.tsx.
const open = async (page: Page) => {
  await page.goto('/?section=behavior&theme=light')
  await expect(page.locator("[data-ssr='behavior']")).toBeVisible()
}
const outline = (page: Page, selector: string) =>
  page
    .locator(selector)
    .evaluate((element) => getComputedStyle(element).outlineStyle)

test('the skip link shows while focused and moves focus without changing the address', async ({
  page,
}) => {
  await open(page)
  const skip = page.getByRole('link', { name: 'Skip to content' })
  // Out of sight, still in the reading order, until the keyboard reaches it.
  expect(
    await skip.evaluate((element) => getComputedStyle(element).clipPath),
  ).toBe('inset(50%)')
  await page.keyboard.press('Tab')
  await expect(skip).toBeFocused()
  expect(
    await skip.evaluate((element) => getComputedStyle(element).clipPath),
  ).toBe('none')
  const box = (await skip.boundingBox())!
  expect(box.x).toBe(12)
  expect(box.y).toBe(12)
  const url = page.url()
  await page.keyboard.press('Enter')
  await expect(page.locator('#behavior-main')).toBeFocused()
  expect(page.url()).toBe(url)
  // The content is a whole region, not a control: no ring.
  expect(await outline(page, '#behavior-main')).toBe('none')
})

test('a title focused by script shows the ring only after a keyboard action', async ({
  page,
}) => {
  await open(page)
  const change = page.locator('.behavior-change-page')
  await change.click()
  await expect(page.locator('#behavior-title')).toBeFocused()
  expect(await outline(page, '#behavior-title')).toBe('none')
  await change.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('#behavior-title')).toBeFocused()
  expect(await outline(page, '#behavior-title')).toBe('solid')
})

test('Copy falls back to a selected field where the page has no Clipboard API', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'clipboard', {
      get: () => undefined,
    })
    const copies: string[] = []
    ;(window as unknown as { copies: string[] }).copies = copies
    document.execCommand = (command: string) => {
      const field = document.activeElement as HTMLTextAreaElement
      const selected = field.value.slice(
        field.selectionStart,
        field.selectionEnd,
      )
      copies.push(`${command}:${selected}`)
      return (window as unknown as { refuse?: boolean }).refuse !== true
    }
  })
  await open(page)
  const copy = page.locator('.surf-copy-button')
  await copy.click()
  await expect(copy).toHaveAttribute('data-copy-state', 'copied')
  expect(
    await page.evaluate(
      () => (window as unknown as { copies: string[] }).copies,
    ),
  ).toEqual(['copy:https://example.test/post/1'])
  // The field is gone and focus is back on the button.
  await expect(page.locator('textarea')).toHaveCount(0)
  await expect(copy).toBeFocused()
  // Only when both ways fail does the button say so.
  await page.evaluate(() => {
    ;(window as unknown as { refuse: boolean }).refuse = true
  })
  await expect(copy).not.toHaveAttribute('data-copy-state')
  await copy.click()
  await expect(copy).toHaveAttribute('data-copy-state', 'failed')
})

test("one cell keeps to a line, and a Stack's section gap is the layout's", async ({
  page,
}) => {
  await open(page)
  expect(
    await page
      .locator('.behavior-date')
      .evaluate((element) => getComputedStyle(element).whiteSpace),
  ).toBe('nowrap')
  expect(
    await page
      .locator('.behavior-date + .surf-table-cell')
      .evaluate((element) => getComputedStyle(element).whiteSpace),
  ).toBe('normal')
  const [gap, section] = await page
    .locator('.behavior-sections')
    .evaluate((element) => [
      getComputedStyle(element).rowGap,
      getComputedStyle(element).getPropertyValue('--surf-layout-section-gap'),
    ])
  expect(gap).toBe('48px')
  expect(section.trim()).toBe('48px')
})

test('a sheet footer keeps its start action apart, and a labeled body scrolls by keyboard', async ({
  page,
}) => {
  await open(page)
  await page.getByRole('button', { name: 'Edit channel' }).click()
  const sheet = page.getByRole('dialog', { name: 'Channel' })
  await expect(sheet).toBeVisible()
  const footer = (await sheet.locator('.surf-panel-footer').boundingBox())!
  const remove = (await sheet
    .getByRole('button', { name: 'Delete' })
    .boundingBox())!
  const save = (await sheet
    .getByRole('button', { name: 'Save' })
    .boundingBox())!
  const inset = await sheet
    .locator('.surf-panel-footer')
    .evaluate((element) => parseFloat(getComputedStyle(element).paddingLeft))
  expect(Math.round(remove.x)).toBe(Math.round(footer.x + inset))
  expect(Math.round(save.x + save.width)).toBe(
    Math.round(footer.x + footer.width - inset),
  )
  expect(save.y).toBe(remove.y)
  const body = sheet.getByRole('region', { name: 'Channel details' })
  for (let step = 0; step < 6; step++) {
    if (await body.evaluate((element) => element === document.activeElement))
      break
    await page.keyboard.press('Tab')
  }
  await expect(body).toBeFocused()
  expect(
    await body.evaluate((element) => [
      getComputedStyle(element).outlineStyle,
      getComputedStyle(element).outlineOffset,
    ]),
  ).toEqual(['solid', '-2px'])
  await page.keyboard.press('PageDown')
  await expect
    .poll(() => body.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0)
})
