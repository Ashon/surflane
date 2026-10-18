import { test, expect } from '@playwright/test'
import { patterns, itemHref } from '../demo/catalog'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })

test('every available pattern has a visible token border at desktop and mobile widths', async ({
  page,
}) => {
  test.setTimeout(90000)
  for (const theme of ['Light', 'Dark']) {
    await page.goto('/')
    await waitForCatalogReady(page)
    if (theme === 'Dark')
      await page
        .getByRole('button', { name: 'Toggle theme: Light', exact: true })
        .click()
    for (const width of [1440, 320])
      for (const item of patterns.filter(
        (item) => item.stage === 'available',
      )) {
        await page.setViewportSize({ width, height: 1000 })
        await test.step(`${item.id} ${theme} ${width}`, async () => {
          await page.goto(itemHref(item))
          await waitForCatalogReady(page)
          const frame = page.locator(
            '.catalog-example-frame[data-kind="pattern"]',
          )
          await expect(frame, item.id).toHaveCSS('border-top-width', '1px')
          await expect(frame, item.id).toHaveCSS('border-top-style', 'solid')
          const colors = await frame.evaluate((el) => ({
            actual: getComputedStyle(el).borderTopColor,
            line: getComputedStyle(el).getPropertyValue('--line').trim(),
          }))
          expect(colors.actual, item.id).not.toBe('rgba(0, 0, 0, 0)')
          await expect
            .poll(
              () =>
                page
                  .locator('.catalog-document-scroll')
                  .evaluate((el) => el.scrollWidth <= el.clientWidth),
              { message: `${item.id} ${theme} ${width}` },
            )
            .toBe(true)
        })
      }
  }
})

test('nested shell surfaces reduce radius by their inset with preview controls outside', async ({
  page,
}) => {
  await page.goto('/patterns/app-shell')
  await waitForCatalogReady(page)
  const shell = page.locator('.app-shell-preview'),
    sheet = page.locator('.app-shell-workspace-sheet'),
    frame = page.locator('.catalog-example-frame[data-kind="pattern"]')
  await expect(frame.getByRole('combobox')).toHaveCount(0)
  await expect(frame.getByRole('checkbox')).toHaveCount(0)
  await expect(
    page.getByRole('checkbox', { name: 'Overflow navigation', exact: true }),
  ).toBeVisible()
  for (const width of [1440, 320]) {
    await page.setViewportSize({ width, height: 1000 })
    // Inside out: a scale radius on the sheet, plus each inset on the way out.
    await expect(sheet).toHaveCSS('border-top-left-radius', '10px')
    await expect(shell).toHaveCSS('border-top-left-radius', '22px')
    await expect(frame).toHaveCSS('border-top-left-radius', '26px')
    await expect(sheet).toHaveCSS('margin-right', '12px')
  }
  await shell.evaluate((el) =>
    el.style.setProperty('--app-shell-radius', '24px'),
  )
  await expect(sheet).toHaveCSS('border-top-left-radius', '12px')
  await shell.evaluate((el) =>
    el.style.setProperty('--app-shell-radius', '4px'),
  )
  await expect(sheet).toHaveCSS('border-top-left-radius', '0px')
})
