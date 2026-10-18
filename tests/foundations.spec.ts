import { waitForCatalogReady } from './catalog-ready'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import catalog from '../packages/tokens/catalog.json' with { type: 'json' }
import { readFileSync } from 'node:fs'
import postcss from 'postcss'

test('token inventory is generated from every source declaration without missing aliases', () => {
  const declarations = new Map<string, string[]>()
  for (const file of catalog.sources) {
    const ast = postcss.parse(
      readFileSync(
        new URL(`../packages/tokens/${file}`, import.meta.url),
        'utf8',
      ),
    )
    ast.walkDecls(/^--/, (decl) => {
      declarations.set(decl.prop, [
        ...(declarations.get(decl.prop) ?? []),
        decl.value,
      ])
    })
  }
  expect(catalog.tokens.map((t) => t.name).sort()).toEqual(
    [...declarations.keys()].sort(),
  )
  for (const token of catalog.tokens) {
    expect(token.variants.map((v) => v.value)).toEqual(
      declarations.get(token.name),
    )
    for (const alias of token.aliases)
      expect(declarations.has(alias), `${token.name} -> ${alias}`).toBe(true)
  }
  const byName = new Map(catalog.tokens.map((t) => [t.name, t]))
  function visit(name: string, path: string[] = []) {
    expect(path.includes(name), `Cycle: ${[...path, name].join(' -> ')}`).toBe(
      false,
    )
    for (const alias of byName.get(name)!.aliases) visit(alias, [...path, name])
  }
  for (const token of catalog.tokens) visit(token.name)
})

test('layout adapts its grid and maintains typography at 320px and enlarged text', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const [width, columns, guideColumns] of [
    [1440, 3, 12],
    [1024, 2, 6],
    [390, 1, 4],
    [320, 1, 4],
  ]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/foundations/lab')
    await waitForCatalogReady(page)
    const grid = page.getByTestId('layout-grid')
    expect(
      await grid.evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns.split(' ').length,
      ),
    ).toBe(columns)
    expect(
      await page
        .getByTestId('layout-container')
        .evaluate((el) =>
          Number(
            getComputedStyle(el).getPropertyValue('--preview-guide-columns'),
          ),
        ),
    ).toBe(guideColumns)
    expect(
      await page.evaluate(() => document.body.scrollWidth <= innerWidth),
    ).toBe(true)
    await page
      .getByRole('combobox', { name: 'Layout density', exact: true })
      .click()
    await page
      .getByRole('option', { name: 'Compact / 16px', exact: true })
      .click()
    expect(
      await page
        .locator('#layout .pui-page-header .pui-heading')
        .evaluate((el) => getComputedStyle(el).fontSize),
    ).toBe('24px')
    expect(
      await page
        .getByTestId('layout-stack')
        .evaluate((el) => getComputedStyle(el).gap),
    ).toBe('16px')
    await page
      .getByRole('combobox', { name: 'Layout profile', exact: true })
      .click()
    await page
      .getByRole('option', { name: 'Wide / comparison', exact: true })
      .click()
    expect(
      await grid.evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns.split(' ').length,
      ),
    ).toBe(width > 1100 ? 4 : width > 760 ? 2 : 1)
    expect(
      await page
        .getByTestId('layout-container')
        .evaluate((el) => getComputedStyle(el).maxWidth),
    ).toBe('1536px')
    await page
      .getByRole('combobox', { name: 'Layout profile', exact: true })
      .click()
    await page
      .getByRole('option', { name: 'Reading / documentation', exact: true })
      .click()
    await expect(page.getByTestId('reading-preview')).toBeVisible()
    await page.evaluate(
      () => (document.documentElement.style.fontSize = '32px'),
    )
    expect(
      await page
        .getByTestId('reading-preview')
        .evaluate((el) => getComputedStyle(el).fontSize),
    ).toBe('32px')
    expect(
      await page.evaluate(() => document.body.scrollWidth <= innerWidth),
    ).toBe(true)
    // WCAG text-spacing override applies to the new layout/type foundation examples.
    await page.addStyleTag({
      content:
        '#layout p,#layout h3,#typography p,#typography h3 {line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important;} #layout p {margin-bottom:2em!important;}',
    })
    expect(
      await page.evaluate(() => document.body.scrollWidth <= innerWidth),
    ).toBe(true)
  }
})

test('token search, aliases, copy references and live theme values work', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async (text: string) => {
          ;(window as any).copiedToken = text
        },
      },
    })
  })
  await page.goto('/foundations/lab')
  await waitForCatalogReady(page)
  const search = page.getByRole('textbox', { name: 'Search design tokens' })
  await search.fill('--ink')
  const row = page.locator('[data-token="--ink"]')
  await expect(row.getByTestId('resolved-value')).toHaveText(/^oklch\(/)
  const lightInk = await row.getByTestId('resolved-value').innerText()
  await row.getByRole('button', { name: 'Copy --ink', exact: true }).click()
  expect(await page.evaluate(() => (window as any).copiedToken)).toBe(
    'var(--ink)',
  )
  await page.getByRole('button', { name: 'Toggle theme' }).click()
  await expect(row.getByTestId('resolved-value')).not.toHaveText(lightInk)
  await expect(row.getByTestId('resolved-value')).toHaveText(/^oklch\(/)
  await search.fill('--layout-reading')
  const reading = page.locator('[data-token="--layout-reading"]')
  await reading.getByText('Source and references', { exact: true }).click()
  await reading
    .getByRole('button', { name: '--layout-content', exact: true })
    .click()
  await expect(search).toHaveValue('--layout-content')
  await search.fill('not-a-real-token')
  await expect(
    page.getByText(
      'No matching tokens. Try a different search term or category.',
    ),
  ).toBeVisible()
  await search.fill('')
  await page
    .getByRole('combobox', { name: 'Token category', exact: true })
    .click()
  await page.getByRole('option', { name: 'Typography', exact: true }).click()
  expect(await page.locator('[data-token]').count()).toBeGreaterThan(0)
  expect(
    await page
      .locator('[data-token]')
      .evaluateAll((nodes) =>
        nodes.every((el) => el.textContent!.includes('Typography')),
      ),
  ).toBe(true)
})

test('English, Korean and code specimens use actual bundled fonts', async ({
  page,
  context,
}) => {
  await page.goto('/foundations/lab')
  await waitForCatalogReady(page)
  await page.evaluate(() => document.fonts.ready)
  for (const selector of [
    '#specimen-latin',
    '#specimen-hangul',
    '#specimen-code',
  ]) {
    const rendering = await page.locator(selector).evaluate((el) => {
      const css = getComputedStyle(el)
      return {
        kerning: css.fontKerning,
        rendering: css.textRendering,
        synthesis: css.getPropertyValue('font-synthesis-weight'),
        ligatures: css.fontVariantLigatures,
        weight: css.fontWeight,
      }
    })
    expect(rendering.kerning).toBe('normal')
    expect(rendering.rendering).toBe('optimizelegibility')
    expect(rendering.synthesis).toBe('none')
    expect(rendering.weight).toBe('400')
    if (selector === '#specimen-code') expect(rendering.ligatures).toBe('none')
  }
  const client = await context.newCDPSession(page)
  await client.send('DOM.enable')
  await client.send('CSS.enable')
  const { root } = await client.send('DOM.getDocument')
  for (const [selector, pattern] of [
    ['#specimen-latin', 'Manrope'],
    ['#specimen-hangul', 'Pretendard'],
    ['#specimen-code', 'JetBrains Mono'],
  ]) {
    const { nodeId } = await client.send('DOM.querySelector', {
      nodeId: root.nodeId,
      selector,
    })
    const { fonts } = await client.send('CSS.getPlatformFontsForNode', {
      nodeId,
    })
    expect(
      fonts.some(
        (f) =>
          f.isCustomFont && f.glyphCount > 0 && f.familyName.includes(pattern),
      ),
      `${selector}: ${JSON.stringify(fonts)}`,
    ).toBe(true)
  }
})

test('foundations remain accessible in both themes and on narrow screens', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const width of [1440, 320])
    for (const dark of [false, true]) {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto('/foundations/lab')
      await waitForCatalogReady(page)
      if (dark) await page.getByRole('button', { name: 'Toggle theme' }).click()
      expect(
        (
          await new AxeBuilder({ page })
            .include('#layout')
            .include('#typography')
            .include('#tokens')
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
            .analyze()
        ).violations,
      ).toEqual([])
      await page.locator('#layout').screenshot({
        path: `.data/layout-${width}-${dark ? 'dark' : 'light'}.png`,
      })
    }
})
