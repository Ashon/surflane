import { test, expect } from '@playwright/test'
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
