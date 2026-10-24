import { waitForCatalogReady } from './catalog-ready'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { navigationExampleIds } from '../demo/NavigationExamples'
test.use({ reducedMotion: 'reduce' })
test('Tabs manual activation preserves panel state and ARIA relationships without activating disabled tabs', async ({
  page,
}) => {
  await page.goto('/components/tabs')
  await waitForCatalogReady(page)
  const overview = page.getByRole('tab', { name: 'Overview', exact: true }),
    evidence = page.getByRole('tab', { name: 'Logs', exact: true }),
    history = page.getByRole('tab', { name: 'History', exact: true })
  await page
    .getByRole('textbox', { name: 'Preview note', exact: true })
    .fill('한글 draft')
  await overview.focus()
  await page.keyboard.press('ArrowRight')
  await expect(evidence).toBeFocused()
  await expect(overview).toHaveAttribute('aria-selected', 'true')
  await expect(
    page.getByRole('tabpanel', { name: 'Overview', exact: true }),
  ).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(evidence).toHaveAttribute('aria-selected', 'true')
  const panel = page.getByRole('tabpanel', { name: 'Logs', exact: true })
  await expect(panel).toBeVisible()
  expect(await panel.getAttribute('aria-labelledby')).toBe(
    await evidence.getAttribute('id'),
  )
  expect(await evidence.getAttribute('aria-controls')).toBe(
    await panel.getAttribute('id'),
  )
  await page.keyboard.press('ArrowRight')
  await expect(
    page.getByRole('tab', { name: 'Unavailable', exact: true }),
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(evidence).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('ArrowRight')
  await expect(history).toBeFocused()
  await page.keyboard.press('Home')
  await expect(overview).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('textbox', { name: 'Preview note', exact: true }),
  ).toHaveValue('한글 draft')
  await expect(
    page.getByRole('tab', { name: 'Unavailable', exact: true }),
  ).toBeDisabled()
})
test('Tabs support automatic activation, vertical navigation and canceled controlled changes', async ({
  page,
}) => {
  await page.goto('/components/tabs')
  await waitForCatalogReady(page)
  await page
    .getByRole('checkbox', { name: 'Activate on focus', exact: true })
    .click()
  const overview = page.getByRole('tab', { name: 'Overview', exact: true }),
    evidence = page.getByRole('tab', { name: 'Logs', exact: true })
  await overview.focus()
  await page.keyboard.press('ArrowRight')
  await expect(evidence).toHaveAttribute('aria-selected', 'true')
  await page
    .getByRole('combobox', { name: 'Tab orientation', exact: true })
    .click()
  await page.getByRole('option', { name: 'Vertical', exact: true }).click()
  await evidence.focus()
  await page.keyboard.press('ArrowUp')
  await expect(overview).toHaveAttribute('aria-selected', 'true')
  await page
    .getByRole('checkbox', { name: 'Prevent tab changes', exact: true })
    .click()
  await evidence.click()
  await expect(overview).toHaveAttribute('aria-selected', 'true')
  await expect(
    page.getByRole('tabpanel', { name: 'Overview', exact: true }),
  ).toBeVisible()
})
test('Accordion uses ordinary Tab order, preserves mounted input and respects single/multiple modes', async ({
  page,
}) => {
  await page.goto('/components/accordion')
  await waitForCatalogReady(page)
  const identity = page.getByRole('button', {
      name: 'Identity controls',
      exact: true,
    }),
    regions = page.getByRole('button', {
      name: 'Environment access',
      exact: true,
    }),
    note = page.getByRole('textbox', { name: 'Case note', exact: true })
  await note.fill('retained draft')
  await identity.focus()
  await page.keyboard.press('Tab')
  await expect(note).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(regions).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(regions).toHaveAttribute('aria-expanded', 'true')
  await expect(identity).toHaveAttribute('aria-expanded', 'false')
  await identity.click()
  await expect(note).toHaveValue('retained draft')
  await page
    .getByRole('checkbox', { name: 'Allow multiple sections', exact: true })
    .click()
  await regions.click()
  await expect(identity).toHaveAttribute('aria-expanded', 'true')
  await expect(regions).toHaveAttribute('aria-expanded', 'true')
  await expect(
    page.getByRole('button', { name: 'Unavailable policy', exact: true }),
  ).toBeDisabled()
  await page
    .getByRole('checkbox', { name: 'Allow multiple sections', exact: true })
    .click()
  expect(
    await page.locator('.surf-accordion-trigger[aria-expanded="true"]').count(),
  ).toBeLessThanOrEqual(1)
})
test('Collapsible links trigger/panel, retains draft and handles disabled state without pretending to be a modal', async ({
  page,
}) => {
  await page.goto('/components/collapsible')
  await waitForCatalogReady(page)
  const trigger = page.getByRole('button', {
    name: 'Technical details',
    exact: true,
  })
  await trigger.focus()
  await page.keyboard.press('Space')
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  const note = page.getByRole('textbox', {
    name: 'Build note',
    exact: true,
  })
  await note.fill('retained evidence')
  await page.keyboard.press('Escape')
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await trigger.click()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await trigger.click()
  await expect(note).toHaveValue('retained evidence')
  await page
    .getByRole('checkbox', { name: 'Disable disclosure', exact: true })
    .click()
  await expect(trigger).toBeDisabled()
})
test('Disclosure entry measures content and exit is immediate; reduced motion removes transitions', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/components/collapsible')
  await waitForCatalogReady(page)
  const trigger = page.getByRole('button', {
    name: 'Technical details',
    exact: true,
  })
  await trigger.click()
  const panel = page.locator('.surf-collapsible-panel')
  await expect(panel).not.toHaveAttribute('data-starting-style', '')
  await panel.evaluate((el) =>
    Promise.all(el.getAnimations().map((a) => a.finished.catch(() => {}))),
  )
  const box = await panel.boundingBox(),
    body = await panel.locator('.surf-disclosure-body').boundingBox()
  expect(box!.height).toBeGreaterThanOrEqual(body!.height - 1)
  expect(
    await panel.evaluate((el) =>
      parseFloat(getComputedStyle(el).transitionDuration),
    ),
  ).toBeGreaterThan(0)
  await trigger.click()
  await expect(
    page.getByRole('textbox', { name: 'Build note', exact: true }),
  ).toBeHidden()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await trigger.click()
  expect(
    await panel.evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe('0s')
})
test('Avatar retains accessible names through image load, failure, recovery and icon fallback', async ({
  page,
}) => {
  await page.goto('/components/avatar')
  await waitForCatalogReady(page)
  const preview = page.getByRole('img', {
    name: 'Preview profile',
    exact: true,
  })
  await expect(preview.locator('img')).toBeVisible()
  await expect(
    page.locator('.component-example').getByRole('status'),
  ).toHaveText('Image status: loaded')
  await page
    .getByRole('button', { name: 'Preview broken image', exact: true })
    .click()
  await expect(preview.locator('.surf-avatar-fallback')).toHaveText('CG')
  await expect(
    page.locator('.component-example').getByRole('status'),
  ).toHaveText('Image status: error')
  await page
    .getByRole('button', { name: 'Restore preview image', exact: true })
    .click()
  await expect(preview.locator('img')).toBeVisible()
  await expect(
    page
      .getByRole('img', { name: 'Unknown preview user', exact: true })
      .locator('svg'),
  ).toBeVisible()
  expect(await preview.evaluate((el) => el.getBoundingClientRect().width)).toBe(
    48,
  )
})
test('Badges use quiet surfaces and text/icons; live updates are opt-in at sentence level', async ({
  page,
}) => {
  await page.goto('/components/badge')
  await waitForCatalogReady(page)
  const preview = page.locator('.component-example'),
    sentence = preview.getByRole('status')
  await expect(preview.locator('.surf-badge')).toHaveCount(8)
  await expect(
    preview.getByRole('button', { name: 'Passed', exact: true }),
  ).toHaveCount(0)
  expect(
    await preview
      .locator('.surf-badge')
      .first()
      .evaluate((el) => {
        const c = getComputedStyle(el)
        return [
          c.borderTopWidth,
          c.borderRightWidth,
          c.borderBottomWidth,
          c.borderLeftWidth,
        ]
      }),
  ).toEqual(['0px', '0px', '0px', '0px'])
  await page
    .getByRole('combobox', { name: 'Status preview', exact: true })
    .click()
  await page.getByRole('option', { name: 'Error', exact: true }).click()
  await expect(sentence).toContainText('Error')
  await expect(sentence.locator('.surf-badge')).toHaveAttribute(
    'data-tone',
    'danger',
  )
  await expect(sentence.locator('svg')).toHaveAttribute('aria-hidden', 'true')
})
test('Separator exposes orientation and its inset changes only the line extent', async ({
  page,
}) => {
  await page.goto('/components/separator')
  await waitForCatalogReady(page)
  const horizontal = page.locator(
      '.component-example .surf-separator[data-orientation="horizontal"]',
    ),
    vertical = page.locator(
      '.component-example .surf-separator[data-orientation="vertical"]',
    )
  await expect(
    page.locator('.component-example').getByRole('separator'),
  ).toHaveCount(2)
  await expect(vertical).toHaveAttribute('aria-orientation', 'vertical')
  const full = await horizontal.boundingBox()
  await page
    .getByRole('checkbox', { name: 'Use inset separator', exact: true })
    .click()
  const inset = await horizontal.boundingBox()
  expect(inset!.width).toBeCloseTo(full!.width - 32, 1)
  expect(inset!.x).toBeCloseTo(full!.x + 16, 1)
})
test('Link and Breadcrumbs retain native navigation and ordered current-location semantics', async ({
  page,
}) => {
  await page.goto('/components/link')
  await waitForCatalogReady(page)
  const link = page.getByRole('link', {
    name: 'Inspect preview destination',
    exact: true,
  })
  expect(await link.evaluate((el) => el.tagName)).toBe('A')
  await link.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#link-preview-target$/)
  await expect(page.locator('#link-preview-target')).toBeVisible()
  await expect(
    page.getByRole('link', {
      name: 'Base UI documentation (opens in a new tab)',
      exact: true,
    }),
  ).toHaveAttribute('target', '_blank')
  await page.goto('/components/breadcrumbs')
  await waitForCatalogReady(page)
  const breadcrumb = page.getByRole('navigation', {
    name: 'Project breadcrumb',
    exact: true,
  })
  await expect(breadcrumb.getByRole('list')).toHaveCount(1)
  await expect(breadcrumb.getByRole('listitem')).toHaveCount(3)
  await expect(breadcrumb.locator('[aria-current="page"]')).toHaveText(
    'demo-e2e-01',
  )
  await expect(breadcrumb.getByRole('link')).toHaveCount(2)
  expect(
    await breadcrumb
      .locator('.surf-breadcrumb-separator')
      .evaluateAll((nodes) =>
        nodes.every((el) => el.getAttribute('aria-hidden') === 'true'),
      ),
  ).toBe(true)
})
test('navigation/data primitives stay accessible and fit both themes at desktop and mobile widths', async ({
  page,
}) => {
  test.setTimeout(90000)
  for (const width of [1440, 320])
    for (const dark of [false, true])
      for (const id of navigationExampleIds) {
        await page.setViewportSize({ width, height: 1000 })
        await page.goto('/components/' + id)
        await waitForCatalogReady(page)
        if (dark)
          await page.getByRole('button', { name: 'Toggle theme' }).click()
        expect(
          await page.evaluate(() => document.body.scrollWidth <= innerWidth),
          `${id} ${width} dark=${dark}`,
        ).toBe(true)
        expect(
          (
            await new AxeBuilder({ page })
              .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
              .analyze()
          ).violations,
          `${id} ${width} dark=${dark}`,
        ).toEqual([])
      }
})
test('navigation examples reflow with enlarged text and retain RTL structure', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 1000 })
  for (const id of navigationExampleIds) {
    await page.goto('/components/' + id)
    await waitForCatalogReady(page)
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '32px'
      document.documentElement.dir = 'rtl'
    })
    expect(
      await page.evaluate(() => document.body.scrollWidth <= innerWidth),
      id,
    ).toBe(true)
  }
  await page.goto('/components/breadcrumbs')
  await waitForCatalogReady(page)
  await page.evaluate(() => (document.documentElement.dir = 'rtl'))
  // The separator chevron mirrors itself in right-to-left text.
  expect(
    await page
      .locator('.component-example .surf-breadcrumb-separator svg')
      .first()
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe('matrix(-1, 0, 0, 1, 0, 0)')
})
