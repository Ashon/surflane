import { waitForCatalogReady } from './catalog-ready'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { catalog, components, patterns, itemHref } from '../demo/catalog'
import { componentDocs } from '../demo/componentDocs'
import tokens from '../packages/tokens/catalog.json' with { type: 'json' }
test.use({ reducedMotion: 'reduce' })
test('inventory covers every installed Base UI component and links only real tokens', () => {
  const pkg = JSON.parse(
    readFileSync(
      new URL('../node_modules/@base-ui/react/package.json', import.meta.url),
      'utf8',
    ),
  )
  const utilities = new Set([
    'package.json',
    'csp-provider',
    'direction-provider',
    'merge-props',
    'types',
    'unstable-use-media-query',
    'use-render',
    'radio',
  ])
  const required = Object.keys(pkg.exports)
    .map((k) => k.replace(/^\.\//, ''))
    .filter(
      (k) =>
        k !== '.' && !k.includes('/') && !k.includes('*') && !utilities.has(k),
    )
  expect(required.length).toBe(37)
  for (const id of required)
    expect(
      components.some((c) => c.id === id),
      id,
    ).toBe(true)
  const hrefs = catalog.map(itemHref)
  expect(new Set(hrefs).size).toBe(hrefs.length)
  const defined = new Set(tokens.tokens.map((t) => t.name))
  for (const item of [...components, ...patterns].filter(
    (i) => i.stage === 'available',
  )) {
    const doc = componentDocs[item.id]
    expect(doc, item.id).toBeDefined()
    for (const field of [
      'usage',
      'avoid',
      'keyboard',
      'anatomy',
      'code',
    ] as const)
      expect(
        [doc[field]].flat().join(' ').trim().length,
        `${item.id}: ${field}`,
      ).toBeGreaterThan(0)
    expect(doc.props.length, `${item.id}: props`).toBeGreaterThan(0)
    expect(doc.tokens.length, `${item.id}: tokens`).toBeGreaterThan(0)
    expect(doc.code).toContain('@surflane/ui')
    for (const token of doc.tokens)
      expect(defined.has(token), `${item.id}: ${token}`).toBe(true)
  }
})
test('pages are separated, legacy links work, history and focus follow navigation', async ({
  page,
}) => {
  await page.goto('/#layout')
  await waitForCatalogReady(page)
  await expect(page.locator('#page-title')).toHaveText('Layout')
  await expect(page.locator('#typography')).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Open dialog', exact: true }),
  ).toHaveCount(0)
  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Components', exact: true })
    .click()
  await expect(page).toHaveURL(/\/components$/)
  await expect(page.locator('#page-title')).toBeFocused()
  await page.getByRole('searchbox', { name: 'Search catalog' }).fill('Button')
  await page.locator('.catalog-item').filter({ hasText: 'Button' }).click()
  await expect(page).toHaveURL(/\/components\/button$/)
  await expect(
    page.getByRole('button', { name: 'Run preview', exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Run preview', exact: true }).click()
  await expect(
    page.locator('.component-example').getByRole('status'),
  ).toHaveText('Primary action previewed.')
  await page.reload()
  await waitForCatalogReady(page)
  await expect(page.locator('#page-title')).toHaveText('Button')
  await page.goBack()
  await waitForCatalogReady(page)
  await expect(page.locator('#page-title')).toHaveText('Components')
  await page.goForward()
  await waitForCatalogReady(page)
  await expect(page.locator('#page-title')).toHaveText('Button')
  await page.goto('/components/no-such-component')
  await waitForCatalogReady(page)
  await expect(page.locator('#page-title')).toHaveText('Page not found')
})
test('library filtering, partial and planned pages communicate actual readiness', async ({
  page,
}) => {
  await page.goto('/components')
  await waitForCatalogReady(page)
  await page.getByRole('combobox', { name: 'Component readiness' }).click()
  await page
    .getByRole('option', { name: 'Primitive only', exact: true })
    .click()
  await expect(page.locator('.catalog-item')).toHaveCount(
    components.filter((i) => i.stage === 'primitive').length,
  )
  const raw = components.filter((i) => i.stage === 'primitive')
  if (raw.length) {
    await page.locator('.catalog-item').filter({ hasText: raw[0].name }).click()
    await expect(
      page.getByRole('heading', { name: 'Primitive export; styling pending' }),
    ).toBeVisible()
    await expect(page.locator('#preview')).toHaveCount(0)
  } else
    await expect(
      page.getByText(
        'No matching items. Try a different search term or filter.',
        {
          exact: true,
        },
      ),
    ).toBeVisible()
  const planned = components.find((item) => item.stage === 'planned')
  if (planned) {
    await page.goto(`/components/${planned.id}`)
    await waitForCatalogReady(page)
    await expect(
      page.getByRole('heading', { name: 'Implementation plan' }),
    ).toBeVisible()
    await expect(page.locator('#preview')).toHaveCount(0)
  } else {
    expect(components.every((item) => item.stage === 'available')).toBe(true)
  }
  await page.goto('/coverage')
  await waitForCatalogReady(page)
  await expect(page.locator('table tbody tr')).toHaveCount(catalog.length)
  await page.getByRole('combobox', { name: 'Coverage layer' }).click()
  await page.getByRole('option', { name: 'component', exact: true }).click()
  await expect(page.locator('table tbody tr')).toHaveCount(components.length)
})
test('component reference, token deep link and copy example use the documented values', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async (text: string) => {
          ;(window as any).copied = text
        },
      },
    })
  })
  await page.goto('/components/select')
  await waitForCatalogReady(page)
  await page.getByRole('button', { name: 'Copy example' }).click()
  expect(await page.evaluate(() => (window as any).copied)).toBe(
    componentDocs.select.code,
  )
  await page
    .getByRole('link', { name: '--surf-control-height', exact: true })
    .click()
  await expect(
    page.getByRole('textbox', { name: 'Search design tokens' }),
  ).toHaveValue('--surf-control-height')
  await expect(
    page.locator('[data-token="--surf-control-height"]'),
  ).toBeVisible()
})
test('mobile navigation expands, closes on navigation and preserves theme', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.goto('/components')
  await waitForCatalogReady(page)
  const toggle = page.getByRole('button', { name: 'Browse catalog' })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await page
    .getByRole('navigation', { name: 'Catalog navigation' })
    .getByRole('link', { name: 'Dialog', exact: true })
    .click()
  await expect(page.locator('#page-title')).toHaveText('Dialog')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('#page-title')).toBeFocused()
  await page.getByRole('button', { name: 'Toggle theme' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await toggle.click()
  await page
    .getByRole('navigation', { name: 'Catalog navigation' })
    .getByRole('link', { name: 'Select', exact: true })
    .click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect(
    await page.evaluate(() => document.body.scrollWidth <= innerWidth),
  ).toBe(true)
})
test('all catalog routes render independently without console errors', async ({
  page,
}) => {
  test.setTimeout(120000)
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  for (const item of catalog) {
    await page.goto(itemHref(item))
    await waitForCatalogReady(page)
    await expect(page.locator('#page-title')).toHaveText(item.name)
    if (item.stage === 'available' && item.kind !== 'foundation') {
      for (const section of [
        'preview',
        'usage',
        'keyboard',
        'code',
        'api',
        'tokens',
      ])
        await expect(
          page.locator(`section#${section}`),
          `${item.id}: ${section}`,
        ).toHaveCount(1)
      await expect(page.locator('#preview')).toBeVisible()
    }
  }
  expect(errors).toEqual([])
})
const accessibleRoutes = [
  ...new Set([
    '/',
    '/install',
    '/foundations',
    '/components',
    '/patterns',
    '/coverage',
    ...catalog.map(itemHref),
    '/patterns/interaction-lab',
    '/foundations/lab',
  ]),
]
for (const width of [1440, 320])
  for (const theme of ['light', 'dark'] as const) {
    test(`all catalog, index and lab pages remain accessible at ${width}px in ${theme}`, async ({
      page,
    }) => {
      test.setTimeout(240000)
      await page.setViewportSize({ width, height: 1000 })
      await page.context().addCookies([
        {
          name: 'surflane-theme',
          value: theme,
          url: 'http://127.0.0.1:8066/',
        },
      ])
      for (const [index, route] of accessibleRoutes.entries()) {
        await page.goto(route)
        await waitForCatalogReady(page)
        await expect(page.locator('html'), route).toHaveAttribute(
          'data-theme',
          theme,
        )
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${route}: ${width} ${theme}`,
        ).toBe(true)
        // A page may hold a popup open, such as the hierarchy preview's filter;
        // Base UI's hidden focus guards redirect Tab into it by design.
        const violations = (
          await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
            .exclude('[data-base-ui-focus-guard]')
            .analyze()
        ).violations
        expect(violations, `${route}: ${width} ${theme}`).toEqual([])
        if ((index + 1) % 25 === 0 || index === accessibleRoutes.length - 1)
          console.log(
            `Catalog accessibility ${width}px ${theme}: ${index + 1}/${accessibleRoutes.length}`,
          )
      }
    })
  }

test('individual component examples retain selection, overlay and focus behavior', async ({
  page,
}) => {
  for (const id of ['select', 'native-select']) {
    await page.goto('/components/' + id)
    await waitForCatalogReady(page)
    const region = page.getByRole('combobox', {
      name: 'Environment',
      exact: true,
    })
    await region.click()
    await page.getByRole('option', { name: 'Production', exact: true }).click()
    await page
      .getByRole('button', { name: 'Submit preview', exact: true })
      .click()
    await expect(
      page.locator('.component-example').getByRole('status'),
    ).toHaveText('Submitted environment: production')
  }
  for (const [id, trigger, name] of [
    ['dialog', 'Open deployment plan', 'Deployment plan'],
    ['alert-dialog', 'Preview discard confirmation', 'Discard this draft?'],
    ['sheet', 'Open right sheet', 'Right sheet'],
    ['drawer', 'Open bottom drawer', 'Prepare deployment'],
  ]) {
    await page.goto('/components/' + id)
    await waitForCatalogReady(page)
    const button = page.getByRole('button', { name: trigger, exact: true })
    await button.click()
    await expect(
      page.getByRole(id === 'alert-dialog' ? 'alertdialog' : 'dialog', {
        name,
        exact: true,
      }),
    ).toBeVisible()
    if (id === 'alert-dialog')
      await expect(
        page.getByRole('button', { name: 'Keep draft', exact: true }),
      ).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(button).toBeFocused()
  }
  await page.goto('/components/menu')
  await waitForCatalogReady(page)
  const menu = page.getByRole('button', { name: 'Open actions', exact: true })
  await menu.click()
  await page.getByRole('menuitem', { name: 'Inspect', exact: true }).click()
  await expect(
    page.locator('.component-example').getByRole('status'),
  ).toHaveText('Inspect selected.')
  await page.goto('/components/tooltip')
  await waitForCatalogReady(page)
  const tooltip = page.getByRole('button', {
    name: 'Inspect logs',
    exact: true,
  })
  await tooltip.focus()
  // Exercise real keyboard entry. Base UI 1.9 tooltips are visual-only popups.
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Tab')
  await expect(tooltip).toBeFocused()
  await expect(page.locator('.surf-tooltip')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('.surf-tooltip')).toBeHidden()
  // A shortcut follows the label as a kbd element, in the tooltip's own face, written
  // for this platform: ⇧⌘R on Apple platforms, Ctrl+Shift+R elsewhere.
  await page.keyboard.press('Tab')
  const tip = page.locator('.surf-tooltip')
  const apple = await page.evaluate(() =>
    /Mac|iPhone|iPad/.test(navigator.platform),
  )
  const shortcut = tip.locator('kbd.surf-tooltip-shortcut')
  await expect(tip).toContainText('Run the pipeline again')
  await expect(shortcut).toHaveText(
    apple ? '⇧Shift ⌘Command R' : 'Ctrl+Shift+R',
  )
  expect(
    await shortcut.evaluate(
      (el) =>
        getComputedStyle(el).fontFamily ===
        getComputedStyle(el.parentElement!).fontFamily,
    ),
  ).toBe(true)
  await page.goto('/components/popover')
  await waitForCatalogReady(page)
  const popover = page.getByRole('button', {
    name: 'Inspect account',
    exact: true,
  })
  await popover.click()
  await expect(page.getByRole('textbox', { name: 'Nickname' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(popover).toBeFocused()
})

test('catalog consumes shared badges and breadcrumbs and reveals the active sidebar item', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 720 })
  await page.goto('/components/breadcrumbs')
  await waitForCatalogReady(page)
  const header = page
    .locator('.catalog-page-header')
    .getByRole('navigation', { name: 'Breadcrumb', exact: true })
  await expect(header.getByRole('listitem')).toHaveCount(3)
  await expect(header.locator('[aria-current="page"]')).toHaveText(
    'Breadcrumbs',
  )
  await expect(
    header.getByRole('link', { name: 'Components', exact: true }),
  ).toHaveAttribute('href', '/components')
  await expect(page.locator('.component-meta .catalog-stage')).toHaveClass(
    /surf-badge/,
  )
  const active = page
      .getByRole('navigation', { name: 'Catalog navigation' })
      .getByRole('link', { name: 'Breadcrumbs', exact: true }),
    nav = page.locator('.catalog-navigation')
  await expect
    .poll(async () => {
      const a = await active.boundingBox(),
        n = await nav.boundingBox()
      return (
        !!a && !!n && a.y >= n.y - 0.5 && a.y + a.height <= n.y + n.height + 0.5
      )
    })
    .toBe(true)
  await header.getByRole('link', { name: 'Components', exact: true }).click()
  await expect(page).toHaveURL(/\/components$/)
  await expect(page.locator('#page-title')).toBeFocused()
})

test('catalog dialogs open with a Header, so their parts take the dialog insets', () => {
  // Dialog.Content has no padding of its own: Header, Body and Footer carry it.
  const demo = fileURLToPath(new URL('../demo', import.meta.url))
  const misses: string[] = []
  for (const file of readdirSync(demo).filter((name) =>
    name.endsWith('.tsx'),
  )) {
    const source = readFileSync(join(demo, file), 'utf8')
    for (const match of source.matchAll(
      /<(Alert)?Dialog\.Content\b[^>]*>\s*<([\w.]+)/g,
    ))
      if (!match[2].endsWith('.Header'))
        misses.push(`${file}: ${match[0].split('\n')[0]} → <${match[2]}>`)
  }
  expect(misses).toEqual([])
})
