import { test, expect, type Page } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
for (const theme of ['light', 'dark']) {
  for (const route of ['form', 'textarea']) {
    test(`${route} hover yields to focus and errors in ${theme}`, async ({
      page,
    }) => {
      await page.goto(`/components/${route}`)
      await waitForCatalogReady(page)
      await page.evaluate(
        (theme) => (document.documentElement.dataset.theme = theme),
        theme,
      )
      const input = page.getByRole('textbox', {
        name: route === 'form' ? 'Project name' : 'Description',
        exact: true,
      })
      const paint = () =>
        input.evaluate((el) => {
          const s = getComputedStyle(el)
          return {
            background: s.backgroundColor,
            border: s.borderTopColor,
            ring: s.boxShadow,
          }
        })
      await page.mouse.move(0, 0)
      const idle = await paint()
      await input.hover()
      const hover = await paint()
      expect(hover.border).not.toBe(idle.border)
      await input.click()
      const focusHover = await paint()
      expect(focusHover.ring).not.toBe('none')
      expect(focusHover.border).not.toBe(hover.border)
      await page.mouse.move(0, 0)
      expect(await paint()).toEqual(focusHover)
      await input.evaluate((el) => el.setAttribute('aria-invalid', 'true'))
      const invalid = await paint()
      await input.hover()
      expect((await paint()).border).toBe(invalid.border)
      expect((await paint()).ring).not.toBe('none')
      const disabled = page.getByRole('textbox', {
        name: 'Disabled notes',
        exact: true,
      })
      if (await disabled.count()) {
        const before = await disabled.evaluate(
          (el) => getComputedStyle(el).borderTopColor,
        )
        await disabled.hover({ force: true })
        expect(
          await disabled.evaluate((el) => getComputedStyle(el).borderTopColor),
        ).toBe(before)
      }
    })
  }
  test(`selected form controls respond to label hover without changing values in ${theme}`, async ({
    page,
  }) => {
    await page.goto('/components/form')
    await waitForCatalogReady(page)
    await page.evaluate(
      (theme) => (document.documentElement.dataset.theme = theme),
      theme,
    )
    for (const name of ['Controlled cleanup', 'Controlled refresh', 'Live']) {
      const control = page.getByRole(
        name === 'Controlled refresh'
          ? 'switch'
          : name === 'Live'
            ? 'radio'
            : 'checkbox',
        { name, exact: true },
      )
      await page.mouse.move(0, 0)
      const before = await control.evaluate(
        (el) => getComputedStyle(el).backgroundColor,
      )
      await control.locator('..').hover()
      expect(
        await control.evaluate((el) => getComputedStyle(el).backgroundColor),
      ).not.toBe(before)
      await expect(control).toBeChecked()
    }
  })
}

// Reads one rendered pixel, so the check covers filters, layers and whatever
// the control rests on rather than a single computed property.
async function pixel(page: Page, x: number, y: number) {
  const png = await page.screenshot({ clip: { x, y, width: 1, height: 1 } })
  return page.evaluate(async (data) => {
    const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0))
    const image = await createImageBitmap(
      new Blob([bytes], { type: 'image/png' }),
    )
    const context = new OffscreenCanvas(1, 1).getContext('2d')!
    context.drawImage(image, 0, 0)
    return [...context.getImageData(0, 0, 1, 1).data.slice(0, 3)]
  }, png.toString('base64'))
}
const contrast = (a: number[], b: number[]) => {
  const luminance = (rgb: number[]) => {
    const [r, g, b] = rgb.map((value) => {
      const c = value / 255
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (high + 0.05) / (low + 0.05)
}
for (const theme of ['light', 'dark']) {
  test(`buttons, toolbar and menubar items step visibly on hover in ${theme}`, async ({
    page,
  }) => {
    for (const [route, selector] of [
      ['toolbar', '.pui-toolbar-button:not([aria-pressed="true"])'],
      ['menubar', '.pui-menubar > .pui-menu-trigger'],
      ['button', '.pui-button[data-variant="primary"]'],
      ['button', '.pui-button[data-variant="secondary"]'],
      ['button', '.pui-button[data-variant="outline"]'],
      ['button', '.pui-button[data-variant="ghost"]'],
      ['button', '.pui-button[data-variant="destructive"]'],
    ]) {
      await page.goto(`/components/${route}`)
      await waitForCatalogReady(page)
      await page.evaluate(
        (theme) => (document.documentElement.dataset.theme = theme),
        theme,
      )
      const control = page
        .locator(`main ${selector}:not(:disabled, [data-disabled])`)
        .first()
      await control.scrollIntoViewIfNeeded()
      const box = (await control.boundingBox())!
      // A point inside the fill, clear of the label.
      const x = Math.round(box.x + 5),
        y = Math.round(box.y + box.height / 2)
      await page.mouse.move(0, 0)
      const rest = await pixel(page, x, y)
      await control.hover()
      const hover = await pixel(page, x, y)
      expect(
        contrast(rest, hover),
        `${theme}: ${route} ${selector}`,
      ).toBeGreaterThanOrEqual(1.1)
    }
  })
}
