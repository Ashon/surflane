import { waitForCatalogReady } from './catalog-ready'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
test.use({ reducedMotion: 'reduce' })
test('select values submit through native forms and reset to defaults', async ({
  page,
}) => {
  await page.goto('/patterns/interaction-lab')
  await waitForCatalogReady(page)
  const region = page.getByRole('combobox', {
    name: 'Environment',
    exact: true,
  })
  await region.click()
  await expect(
    page.getByRole('option', { name: 'Unavailable' }),
  ).toHaveAttribute('aria-disabled', 'true')
  await page.getByRole('option', { name: 'Production', exact: true }).click()
  const legacy = page.getByRole('combobox', { name: 'Compatibility field' })
  await legacy.click()
  await page.getByRole('option', { name: 'Production', exact: true }).click()
  await page.getByRole('button', { name: 'Submit preview' }).click()
  await expect(page.locator('output')).toContainText(
    '"environment":"production"',
  )
  await expect(page.locator('output')).toContainText(
    '"legacyEnvironment":"production"',
  )
  await page.getByRole('button', { name: 'Reset', exact: true }).click()
  await expect(region).toHaveAttribute('data-value', 'staging')
})
test('nested select overlays remain clickable and Escape restores focus', async ({
  page,
}) => {
  await page.goto('/patterns/interaction-lab')
  await waitForCatalogReady(page)
  const trigger = page.getByRole('button', {
    name: 'Open dialog',
    exact: true,
  })
  await trigger.click()
  const dialog = page.getByRole('dialog')
  const select = dialog.getByRole('combobox', { name: 'Dialog environment' })
  await select.click()
  await page.getByRole('option', { name: 'Production', exact: true }).click()
  await expect(select).toHaveAttribute('data-value', 'production')
  await select.click()
  await expect(page.getByRole('listbox')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeVisible()
  await expect(select).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})
test('scrollbars preserve native horizontal and vertical scroll', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await page.goto('/patterns/interaction-lab')
  await waitForCatalogReady(page)
  const region = page.getByRole('region', { name: 'Build revisions' })
  await region.hover()
  await page.mouse.wheel(400, 140)
  await expect
    .poll(() => region.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(0)
  await expect
    .poll(() => region.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(0)
  expect(
    await page.evaluate(() => document.body.scrollWidth <= innerWidth),
  ).toBe(true)
})
test('shared controls and portals pass automated accessibility in both themes', async ({
  page,
}) => {
  for (const width of [1440, 390])
    for (const theme of ['light', 'dark']) {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto('/patterns/interaction-lab')
      await waitForCatalogReady(page)
      if (theme === 'dark')
        await page.getByRole('button', { name: 'Toggle theme' }).click()
      await page
        .getByRole('combobox', { name: 'Environment', exact: true })
        .click()
      const violations = (
        await new AxeBuilder({ page })
          // Base UI's hidden focus sentinels immediately redirect focus (#4668).
          // Exclude only these infrastructure spans; keyboard redirection is tested below.
          .exclude('[data-base-ui-focus-guard]')
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze()
      ).violations
      expect(violations).toEqual([])
      await page.keyboard.press('Escape')
      await page.screenshot({
        path: `.data/catalog-${width}-${theme}.png`,
        fullPage: true,
      })
    }
})

test('Base UI focus sentinels redirect focus instead of retaining it', async ({
  page,
}) => {
  await page.goto('/patterns/interaction-lab')
  await waitForCatalogReady(page)
  await page.getByRole('combobox', { name: 'Environment', exact: true }).click()
  const guard = page.locator('[data-base-ui-focus-guard][tabindex="0"]').first()
  await guard.focus()
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.activeElement?.hasAttribute('data-base-ui-focus-guard') ??
          false,
      ),
    )
    .toBe(false)
})

test('Select groups options under visible headings and submits the chosen value', async ({
  page,
}) => {
  await page.goto('/components/select')
  await waitForCatalogReady(page)
  const example = page.locator('.component-example')
  const region = example.getByRole('combobox', { name: 'Region', exact: true })
  await region.click()
  const asia = page.getByRole('group', { name: 'Asia Pacific', exact: true })
  await expect(asia.getByRole('option')).toHaveText(['Seoul', 'Tokyo'])
  await expect(
    page
      .getByRole('group', { name: 'Europe', exact: true })
      .getByRole('option'),
  ).toHaveText(['Frankfurt'])
  // Headings start where the option text does, past the check column.
  const textStart = (selector: string) =>
    asia
      .locator(selector)
      .first()
      .evaluate((el) => {
        // The first text node, so an icon before it does not count.
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
        let node = walker.nextNode()
        while (node && !node.textContent!.trim()) node = walker.nextNode()
        const range = document.createRange()
        range.selectNodeContents(node!)
        return range.getBoundingClientRect().left
      })
  expect(await textStart('.pui-select-group-label')).toBeCloseTo(
    await textStart('[role="option"]'),
    0,
  )
  await page.getByRole('option', { name: 'Tokyo', exact: true }).click()
  await expect(region).toHaveText(/Tokyo/)
  await example
    .getByRole('button', { name: 'Submit preview', exact: true })
    .click()
  expect(
    await example
      .locator('form')
      .evaluate((form: HTMLFormElement) => new FormData(form).get('region')),
  ).toBe('ap-northeast-1')
})

test('popup Content portals itself once, with or without a Portal around it', async ({
  page,
}) => {
  const portals = (popup: string) =>
    page
      .locator(popup)
      .first()
      .evaluate((el) => {
        let count = 0
        let host: Element | null = null
        for (let n = el.parentElement; n; n = n.parentElement)
          if (n.hasAttribute('data-base-ui-portal')) {
            count += 1
            host = n
          }
        return { count, inBody: host?.parentElement === document.body }
      })
  // The Popover example renders Content alone; the confirmation one keeps Portal.
  await page.goto('/components/popover')
  await waitForCatalogReady(page)
  await page.locator('[data-preview-size] button').first().click()
  expect(await portals('.pui-popover')).toEqual({ count: 1, inBody: true })
  await page.keyboard.press('Escape')
  await page.goto('/components/menu')
  await waitForCatalogReady(page)
  await page
    .locator('[data-preview-size] button[aria-haspopup="menu"]')
    .first()
    .click()
  expect(await portals('.pui-menu')).toEqual({ count: 1, inBody: true })
  // The interaction lab's confirmation keeps <Popover.Portal> around Content.
  await page.goto('/patterns/interaction-lab')
  await waitForCatalogReady(page)
  await page
    .getByRole('button', { name: 'Preview reset confirmation', exact: true })
    .click()
  expect(await portals('.pui-popover')).toEqual({ count: 1, inBody: true })
})
