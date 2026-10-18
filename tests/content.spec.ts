import { waitForCatalogReady } from './catalog-ready'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { contentExampleIds } from '../demo/ContentExamples'
test('Card uses one surface with an explicit action and preserves Base UI state class callbacks', async ({
  page,
}) => {
  await page.goto('/components/card')
  await waitForCatalogReady(page)
  const card = page.locator('.pui-card')
  await expect(card).not.toHaveAttribute('tabindex')
  await expect(card).not.toHaveAttribute('role', 'button')
  await expect(card.locator('.pui-card')).toHaveCount(0)
  await expect(
    card.getByRole('heading', { name: 'DEMO main', level: 3 }),
  ).toBeVisible()
  const space = await card.evaluate((e) => {
    const s = getComputedStyle(e)
    return [s.paddingTop, s.paddingRight, s.paddingBottom, s.paddingLeft]
  })
  expect(space).toEqual(['24px', '24px', '24px', '24px'])
  const action = card.getByRole('button', {
    name: 'Inspect environment',
    exact: true,
  })
  await expect(action).toHaveClass(/content-card-action/)
  await action.focus()
  await page.keyboard.press('Enter')
  await expect(action).toBeFocused()
  await expect(page.locator('#preview').getByRole('status')).toContainText(
    'Environment preview opened',
  )
})
test('Code block preserves the exact source, copies Unicode and whitespace, and clears results when the source changes', async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          ;(window as any).copiedSource = text
        },
      },
    }),
  )
  await page.goto('/components/code')
  await waitForCatalogReady(page)
  const block = page.locator('#preview .pui-code-block').first(),
    code = block.locator('pre code')
  const source = await code.textContent()
  expect(source).toContain('한글')
  expect(source).toContain('\n  - access.identity-control')
  expect(source!.endsWith('\n')).toBeTruthy()
  await block.getByRole('button', { name: 'Copy code', exact: true }).click()
  expect(await page.evaluate(() => (window as any).copiedSource)).toBe(source)
  await expect(block.getByRole('status')).toHaveText('Code copied.')
  await page.getByRole('button', { name: 'Change source', exact: true }).click()
  await expect(block.getByRole('status')).toBeEmpty()
  await expect(code).toContainText('revision: 2')
})
test('Code block handles denied clipboard access without executing source text or losing the selectable source', async ({
  page,
}) => {
  await page.goto('/components/code')
  await waitForCatalogReady(page)
  const block = page.locator('#preview .pui-code-block').nth(1)
  await block
    .getByRole('button', { name: 'Try unavailable clipboard', exact: true })
    .click()
  await expect(block.getByRole('status')).toHaveText(
    'Copy unavailable. Select the code and copy it manually.',
  )
  await expect(block.locator('pre code')).toContainText(
    '<script>Example text is never executed.</script>',
  )
  await expect(block.locator('script')).toHaveCount(0)
  await expect(block.getByRole('button')).toBeEnabled()
})
test('Code block ignores stale pending copy results when source changes and can retry copying the new source', async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: (text: string) =>
          new Promise<void>((resolve) => {
            ;(window as any).pendingCopy = { text, resolve }
          }),
      },
    }),
  )
  await page.goto('/components/code')
  await waitForCatalogReady(page)
  const block = page.locator('#preview .pui-code-block').first(),
    button = block.getByRole('button', { name: 'Copy code', exact: true })
  await button.click()
  await expect(button).toBeDisabled()
  await page.getByRole('button', { name: 'Change source', exact: true }).click()
  await expect(button).toBeEnabled()
  await page.evaluate(() => (window as any).pendingCopy.resolve())
  await expect(block.getByRole('status')).toBeEmpty()
  await button.click()
  expect(await page.evaluate(() => (window as any).pendingCopy.text)).toContain(
    'revision: 2',
  )
  await page.evaluate(() => (window as any).pendingCopy.resolve())
  await expect(block.getByRole('status')).toHaveText('Code copied.')
})
test('Long code scrolls inside a named region, wraps on request and keeps original text unchanged', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.goto('/components/code')
  await waitForCatalogReady(page)
  const block = page.locator('#preview .pui-code-block').first(),
    region = block.getByRole('region', { name: 'Runner task', exact: true })
  const source = await block.locator('code').textContent()
  expect(
    await region.evaluate((e) => e.scrollWidth > e.clientWidth),
  ).toBeTruthy()
  await region.focus()
  await page.keyboard.press('ArrowRight')
  await expect
    .poll(() => region.evaluate((e) => e.scrollLeft))
    .toBeGreaterThan(0)
  await page
    .getByRole('button', { name: 'Wrap long lines', exact: true })
    .click()
  await expect
    .poll(() => region.evaluate((e) => e.scrollWidth <= e.clientWidth + 1))
    .toBeTruthy()
  expect(await block.locator('code').textContent()).toBe(source)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy()
})
test('Controlled pagination drives real result pages, clamps boundaries and resets after filtering', async ({
  page,
}) => {
  await page.goto('/components/pagination')
  await waitForCatalogReady(page)
  const nav = page.getByRole('navigation', {
      name: 'Pipeline run pages',
      exact: true,
    }),
    rows = page.getByRole('list', {
      name: 'Paged pipeline runs',
      exact: true,
    })
  await expect(
    nav.getByRole('button', { name: 'Previous page', exact: true }),
  ).toBeDisabled()
  await expect(nav.locator('[aria-current="page"]')).toHaveText('1')
  expect(
    await nav
      .locator('[aria-current="page"]')
      .evaluate((e) => getComputedStyle(e).backgroundColor),
  ).not.toBe('rgba(0, 0, 0, 0)')
  await expect(rows.getByRole('listitem')).toHaveCount(4)
  await nav.getByRole('button', { name: 'Next page', exact: true }).focus()
  await page.keyboard.press('Enter')
  await expect(nav.locator('[aria-current="page"]')).toHaveText('2')
  await expect(rows).toContainText('Pipeline run 05')
  await page
    .getByRole('button', { name: 'Go to last page', exact: true })
    .click()
  await expect(nav.locator('[aria-current="page"]')).toHaveText('10')
  await expect(
    nav.getByRole('button', { name: 'Next page', exact: true }),
  ).toBeDisabled()
  await page
    .getByRole('button', { name: 'Disable pagination', exact: true })
    .click()
  for (const b of await nav.getByRole('button').all())
    await expect(b).toBeDisabled()
  await page
    .getByRole('button', { name: 'Enable pagination', exact: true })
    .click()
  await nav.getByRole('button', { name: 'Page 1', exact: true }).click()
  await page
    .getByRole('textbox', { name: 'Find run', exact: true })
    .fill('run 01')
  await expect(nav).toHaveCount(0)
  await expect(rows.getByRole('listitem')).toHaveCount(1)
  await expect(page.locator('#preview').getByRole('status')).toContainText(
    'Page 1 of 1.',
  )
})
test('Link pagination preserves href and browser navigation rather than intercepting native links', async ({
  page,
}) => {
  await page.goto('/components/pagination')
  await waitForCatalogReady(page)
  const nav = page.getByRole('navigation', {
    name: 'Documentation pages',
    exact: true,
  })
  await expect(
    nav.getByRole('link', { name: 'Page 3', exact: true }),
  ).toHaveAttribute('href', '#pagination-page-3')
  await expect(nav.locator('[aria-current="page"]')).toHaveText('2')
  await nav.getByRole('link', { name: 'Page 3', exact: true }).click()
  await expect(page).toHaveURL(/#pagination-page-3$/)
})
test('Content pages pass both themes, narrow accessibility and enlarged RTL reflow', async ({
  page,
}) => {
  for (const id of contentExampleIds) {
    await page.goto(`/components/${id}`)
    await waitForCatalogReady(page)
    for (const theme of ['light', 'dark']) {
      await page.evaluate(
        (t) => (document.documentElement.dataset.theme = t),
        theme,
      )
      await page.setViewportSize({ width: 320, height: 900 })
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy()
      expect(
        (await new AxeBuilder({ page }).analyze()).violations,
        `${id} ${theme}`,
      ).toEqual([])
    }
    await page.evaluate(() => {
      document.documentElement.dir = 'rtl'
      document.documentElement.style.fontSize = '200%'
    })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy()
  }
})

test('Pagination bounds and a very large page count produce a finite window with valid links during server rendering', async ({
  page,
}) => {
  const React = await import('react')
  const { renderToStaticMarkup } = await import('react-dom/server')
  const { Pagination } = await import('@surflane/ui')
  const render = (current: number, total: number, disabled = false) =>
    renderToStaticMarkup(
      React.createElement(Pagination, {
        page: current,
        pageCount: total,
        getPageHref: (n) => `/results?page=${n}`,
        disabled,
      }),
    )
  expect(render(1, 1)).toBe('')
  expect(render(0, 0)).toBe('')
  expect(render(1, Number.NaN)).toBe('')
  await page.setContent(render(500_000, 1_000_000))
  expect(await page.getByRole('link').count()).toBeLessThanOrEqual(11)
  await expect(page.locator('[aria-current="page"]')).toHaveText('500000')
  await expect(
    page.getByRole('link', { name: 'Page 1', exact: true }),
  ).toHaveAttribute('href', '/results?page=1')
  await expect(
    page.getByRole('link', { name: 'Page 1000000', exact: true }),
  ).toHaveAttribute('href', '/results?page=1000000')
  await page.setContent(render(-3, 3))
  await expect(page.locator('[aria-current="page"]')).toHaveText('1')
  await page.setContent(render(99, 3))
  await expect(page.locator('[aria-current="page"]')).toHaveText('3')
  await page.setContent(render(2, 3, true))
  await expect(page.getByRole('link')).toHaveCount(0)
  await expect(page.locator('[aria-current="page"]')).toHaveAttribute(
    'aria-disabled',
    'true',
  )
})
