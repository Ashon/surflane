import { waitForCatalogReady } from './catalog-ready'
import { test, expect, type Locator, type Page } from '@playwright/test'
test.use({ reducedMotion: 'reduce' })

// What a key cap shows: the glyphs, without the names said in their place.
const glyphs = (keys: Locator) =>
  keys.evaluateAll((elements) =>
    elements.map((element) => {
      const copy = element.cloneNode(true) as HTMLElement
      copy
        .querySelectorAll('.surf-feedback-sr')
        .forEach((name) => name.remove())
      return copy.textContent
    }),
  )
const applePlatform = (page: Page) =>
  page.evaluate(() => /Mac|iPhone|iPad/.test(navigator.platform))

test("Kbd writes each shortcut in its platform's form and order, and names its symbols", async ({
  page,
}) => {
  await page.goto('/components/kbd')
  await waitForCatalogReady(page)
  const table = page.locator('.component-example table')
  const column = (index: number) =>
    table.locator(`tbody tr td:nth-child(${index}) > kbd.surf-kbd`)
  // The catalog passes ['shift', 'mod', 'r']: each platform puts the modifiers in
  // its own order.
  expect(await glyphs(column(2))).toEqual(['⌘K', '⌘B', '⇧⌘R', '⌥↓'])
  expect(await glyphs(column(3))).toEqual([
    'Ctrl+K',
    'Ctrl+B',
    'Ctrl+Shift+R',
    'Alt+↓',
  ])
  // A symbol is hidden from screen readers, and its name is said in its place.
  const rerun = column(2).nth(2)
  await expect(rerun.locator('[aria-hidden="true"]')).toHaveText(['⇧', '⌘'])
  await expect(rerun.locator('.surf-feedback-sr')).toHaveText([
    'Shift',
    'Command',
  ])
  await expect(column(3).nth(3).locator('.surf-feedback-sr')).toHaveText(
    'Down arrow',
  )
  // Each key is a kbd inside the chord's kbd, in the body face, not the browser's
  // monospace.
  const faces = await rerun.evaluate((chord) => {
    const inner = chord.querySelector('kbd')!
    return [
      getComputedStyle(chord).fontFamily,
      getComputedStyle(inner).fontFamily,
      getComputedStyle(document.body).fontFamily,
    ]
  })
  expect(faces[0]).toBe(faces[2])
  expect(faces[1]).toBe(faces[0])
})

test("Kbd follows the reader's platform and the text around it, on its recessed plane", async ({
  page,
}) => {
  await page.goto('/components/kbd')
  await waitForCatalogReady(page)
  const apple = await applePlatform(page)
  const sentence = page.locator('.component-example p').first()
  const key = sentence.locator('kbd.surf-kbd')
  expect(await glyphs(key)).toEqual([apple ? '⌘K' : 'Ctrl+K'])
  const style = await key.evaluate((element) => {
    const probe = document.createElement('span')
    probe.style.background = 'var(--surf-recessed)'
    element.parentElement!.append(probe)
    const recessed = getComputedStyle(probe).backgroundColor
    probe.remove()
    const own = getComputedStyle(element)
    return {
      ratio:
        parseFloat(own.fontSize) /
        parseFloat(getComputedStyle(element.parentElement!).fontSize),
      background: own.backgroundColor,
      recessed,
      tabIndex: element.tabIndex,
      whiteSpace: own.whiteSpace,
    }
  })
  expect(style.ratio).toBeCloseTo(0.875, 2)
  expect(style.background).toBe(style.recessed)
  expect(style.tabIndex).toBe(-1)
  expect(style.whiteSpace).toBe('nowrap')
  // In forced colors the plane is gone, so a line keeps the key cap's edge.
  await page.emulateMedia({ forcedColors: 'active' })
  const edge = await key.evaluate((element) => {
    const own = getComputedStyle(element)
    return [own.borderTopStyle, own.borderTopWidth]
  })
  expect(edge).toEqual(['solid', '1px'])
})

test("a tooltip's shortcut is plain text on the tooltip's plane", async ({
  page,
}) => {
  await page.goto('/components/tooltip')
  await waitForCatalogReady(page)
  for (const forcedColors of ['none', 'active'] as const) {
    await page.emulateMedia({ forcedColors })
    const trigger = page.getByRole('button', {
      name: 'Inspect logs',
      exact: true,
    })
    await trigger.focus()
    await page.keyboard.press('Tab')
    const shortcut = page.locator('.surf-tooltip kbd.surf-tooltip-shortcut')
    await expect(shortcut).toBeVisible()
    const style = await shortcut.evaluate((element) => {
      const own = getComputedStyle(element)
      return {
        background: own.backgroundImage + ' ' + own.backgroundColor,
        padding: own.padding,
        border: own.borderTopWidth,
        opacity: own.opacity,
        size:
          own.fontSize === getComputedStyle(element.parentElement!).fontSize,
      }
    })
    expect(style).toEqual({
      background: 'none rgba(0, 0, 0, 0)',
      padding: '0px',
      border: '0px',
      opacity: '0.72',
      size: true,
    })
    await page.keyboard.press('Escape')
  }
})

test('Korean pages name the arrows in Korean, and command search draws its keys with Kbd', async ({
  page,
}) => {
  await page.goto('/ko/components/kbd')
  await waitForCatalogReady(page)
  await expect(
    page
      .locator('.component-example tbody tr')
      .nth(3)
      .locator('.surf-feedback-sr'),
  ).toHaveText(['Option', '아래쪽 화살표', '아래쪽 화살표'])
  await page.goto('/ko/patterns/command-search')
  await waitForCatalogReady(page)
  const trigger = page.getByRole('button', { name: '문서 검색', exact: true })
  // The trigger's key cap is for sight; aria-keyshortcuts names the shortcut.
  await expect(trigger.locator('kbd.surf-kbd')).toHaveAttribute(
    'aria-hidden',
    'true',
  )
  await trigger.click()
  const hint = page
    .getByRole('dialog')
    .locator("p.surf-text[data-variant='caption']")
  expect(await glyphs(hint.locator('kbd.surf-kbd'))).toEqual([
    '↑',
    '↓',
    'Enter',
    'Esc',
  ])
  await expect(hint.locator('.surf-feedback-sr')).toHaveText([
    '위쪽 화살표',
    '아래쪽 화살표',
  ])
})
