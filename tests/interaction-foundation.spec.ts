import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })

test('native activation and persistent selection keep distinct states and readonly values remain copyable', async ({
  page,
}) => {
  await page.goto('/foundations/interaction')
  await waitForCatalogReady(page)
  const toggle = page.getByRole('button', {
    name: 'Include evidence',
    exact: true,
  })
  await toggle.focus()
  await page.keyboard.press('Space')
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('[data-evidence-selection]')).toHaveText(
    'Evidence included.',
  )
  await page.keyboard.press('Enter')
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  await expect(toggle).toHaveAccessibleName('Include evidence')
  await expect(
    page.getByRole('button', { name: 'Unavailable preview', exact: true }),
  ).toBeDisabled()
  const input = page.getByRole('textbox', { name: 'Read-only resource ID' })
  await input.focus()
  await page.keyboard.press('a')
  await expect(input).toHaveValue('demo-e2e-42')
  await expect(input).toHaveAttribute('readonly', '')
  await expect(input).toBeFocused()
})

test('pending retains focus, blocks duplicate starts and announces actual completion without network writes', async ({
  page,
}) => {
  const writes: string[] = []
  page.on('request', (request) => {
    if (request.method() !== 'GET') writes.push(request.method())
  })
  await page.goto('/foundations/interaction')
  await waitForCatalogReady(page)
  await page.clock.install()
  const run = page.getByRole('button', {
    name: 'Run local preview',
    exact: true,
  })
  await run.focus()
  await page.keyboard.press('Enter')
  await expect(run).toHaveAttribute('aria-busy', 'true')
  await expect(run).toBeFocused()
  await expect(run).toBeDisabled()
  await expect(page.locator('[data-local-result]')).toHaveText(
    'Local preview running.',
  )
  await page.keyboard.press('Enter')
  await page.keyboard.press('Space')
  await run.evaluate((el) => (el as HTMLButtonElement).click())
  await expect(page.locator('[data-local-attempts]')).toHaveText('1')
  await page.clock.fastForward(1000)
  await expect(run).toHaveAttribute('aria-busy', 'false')
  await expect(run).toBeFocused()
  await expect(
    page.getByRole('status', { name: 'Local preview result' }),
  ).toHaveText('Local preview completed. No resources were created.')
  expect(writes).toEqual([])
})

test('failure has a persistent recovery path, retry succeeds and cancel cannot later become success', async ({
  page,
}) => {
  await page.goto('/foundations/interaction')
  await waitForCatalogReady(page)
  await page.clock.install()
  const run = page.getByRole('button', {
      name: 'Run local preview',
      exact: true,
    }),
    fail = page.getByRole('checkbox', { name: 'Fail local preview' }),
    cancel = page.getByRole('button', {
      name: 'Cancel local preview',
      exact: true,
    })
  await fail.check()
  await run.click()
  await expect(fail).toBeDisabled()
  await page.clock.fastForward(1000)
  await expect(
    page.getByRole('status', { name: 'Local preview result' }),
  ).toContainText('Local preview failed.')
  await expect(
    page.getByText('Preview needs attention', { exact: true }),
  ).toBeVisible()
  await fail.uncheck()
  await run.click()
  await page.clock.fastForward(1000)
  await expect(
    page.getByRole('status', { name: 'Local preview result' }),
  ).toContainText('completed')
  await expect(
    page.getByText('Preview needs attention', { exact: true }),
  ).toHaveCount(0)
  await run.click()
  await cancel.click()
  await expect(run).toBeFocused()
  await expect(cancel).toBeDisabled()
  await page.clock.fastForward(2000)
  await expect(
    page.getByRole('status', { name: 'Local preview result' }),
  ).toContainText('canceled')
  await expect(page.locator('[data-local-attempts]')).toHaveText('3')
})

test('transitions guide reports the toast roles and links to actual interaction contracts', async ({
  page,
}) => {
  await page.goto('/foundations/motion#transitions')
  await waitForCatalogReady(page)
  await expect(
    page.locator('[data-motion-token="--surf-toast-enter-duration"]'),
  ).toHaveText('320ms')
  await expect(
    page.locator('[data-motion-token="--surf-toast-stack-duration"]'),
  ).toHaveText('360ms')
  await expect(
    page.getByRole('table', {
      name: 'Enter and exit timing by component',
    }),
  ).toContainText('Toast')
  await page
    .getByRole('link', { name: 'Interaction states', exact: true })
    .last()
    .click()
  await waitForCatalogReady(page)
  await expect(page.locator('#page-title')).toHaveText('Interaction states')
  await expect(page.locator('#page-title')).toBeFocused()
})

test('touch users can select, start and cancel without hover-only controls', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 320, height: 700 },
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  await page.goto('/foundations/interaction')
  await waitForCatalogReady(page)
  const toggle = page.getByRole('button', {
    name: 'Include evidence',
    exact: true,
  })
  await toggle.tap()
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await page
    .getByRole('button', { name: 'Run local preview', exact: true })
    .tap()
  await page
    .getByRole('button', { name: 'Cancel local preview', exact: true })
    .tap()
  await expect(
    page.getByRole('status', { name: 'Local preview result' }),
  ).toContainText('canceled')
  expect(
    await page
      .locator('.catalog-document-scroll')
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true)
  await context.close()
})
for (const width of [1440, 320])
  for (const dark of [false, true])
    test(`interaction guide and error recovery pass axe at ${width}px dark=${dark}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto('/foundations/interaction')
      await waitForCatalogReady(page)
      if (dark) await page.getByRole('button', { name: 'Toggle theme' }).click()
      await page.getByRole('checkbox', { name: 'Fail local preview' }).check()
      await page
        .getByRole('button', { name: 'Run local preview', exact: true })
        .click()
      await expect(
        page.getByRole('status', { name: 'Local preview result' }),
      ).toContainText('failed')
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    })
