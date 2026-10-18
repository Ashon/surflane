import { test, expect } from '@playwright/test'
import { contrastRatio } from '../demo/contrast'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
for (const dark of [false, true])
  test(`choice boundaries stay softer and discernible in dark=${dark}`, async ({
    page,
  }) => {
    await page.goto('/components/form')
    await waitForCatalogReady(page)
    if (dark) await page.getByRole('button', { name: 'Toggle theme' }).click()
    for (const selector of ['.pui-checkbox', '.pui-radio', '.pui-switch']) {
      const all = page.locator('.form-contract-example').locator(selector)
      expect(await all.count()).toBeGreaterThan(0)
      for (const element of await all.all()) {
        const colors = await element.evaluate((el) => {
          const ctx = document.createElement('canvas').getContext('2d')!
          const rgb = (color: string) => {
            ctx.clearRect(0, 0, 1, 1)
            ctx.fillStyle = color
            ctx.fillRect(0, 0, 1, 1)
            return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3)
          }
          const style = getComputedStyle(el),
            root = getComputedStyle(document.documentElement)
          return {
            border: rgb(style.borderColor),
            canvas: rgb(root.getPropertyValue('--canvas')),
            ink: rgb(root.getPropertyValue('--ink-muted')),
            foreground: rgb(style.color),
            background: rgb(style.backgroundColor),
            checked:
              el.hasAttribute('data-checked') ||
              el.hasAttribute('data-indeterminate'),
          }
        })
        expect(
          contrastRatio(colors.border, colors.canvas),
        ).toBeGreaterThanOrEqual(3)
        if (!colors.checked)
          expect(contrastRatio(colors.border, colors.canvas)).toBeLessThan(
            contrastRatio(colors.ink, colors.canvas),
          )
        else
          expect(
            contrastRatio(colors.foreground, colors.background),
          ).toBeGreaterThanOrEqual(3)
      }
    }
    const checkbox = page.getByRole('checkbox', {
      name: 'Controlled cleanup',
      exact: true,
    })
    await checkbox.focus()
    expect(
      await checkbox.evaluate((el) =>
        parseFloat(getComputedStyle(el).outlineWidth),
      ),
    ).toBeGreaterThanOrEqual(2)
    await page.keyboard.press('Space')
    await expect(checkbox).not.toBeChecked()
    await page.emulateMedia({ forcedColors: 'active' })
    await page.keyboard.press('Space')
    await expect(checkbox).toBeChecked()
    await expect(checkbox).toHaveCSS('forced-color-adjust', 'none')
  })
