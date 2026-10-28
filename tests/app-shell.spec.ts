import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
test('collapse keeps icons fixed, names accessible and account at the bottom', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/patterns/app-shell')
  await waitForCatalogReady(page)
  const sidebar = page.getByRole('complementary', {
    name: 'Example workspace sidebar',
  })
  const resources = sidebar.getByRole('link', {
    name: 'Resources',
    exact: true,
  })
  const expandedToggle = page.getByRole('button', {
    name: 'Collapse workspace sidebar',
    exact: true,
  })
  const expandedBounds = (await expandedToggle.boundingBox())!
  expect(expandedBounds.width).toBe(40)
  expect(expandedBounds.height).toBe(expandedBounds.width)
  // It ends the brand row, centered on it, as far from the edge as the links' rows.
  const brand = (await sidebar.locator('.surf-app-shell-brand').boundingBox())!
  expect(expandedBounds.y + expandedBounds.height / 2).toBe(
    brand.y + brand.height / 2,
  )
  const row = (await sidebar
    .getByRole('link', { name: 'Overview', exact: true })
    .boundingBox())!
  expect(expandedBounds.x + expandedBounds.width).toBe(row.x + row.width)
  const x = (await resources.locator('svg').boundingBox())!.x
  const account = sidebar.getByRole('button', {
    name: 'Preview user account menu',
  })
  const bottom = (await account.boundingBox())!.y
  await page.getByRole('button', { name: 'Collapse workspace sidebar' }).click()
  await expect(page.locator('.app-shell-preview')).toHaveAttribute(
    'data-sidebar',
    'collapsed',
  )
  const collapsedToggle = page.getByRole('button', {
    name: 'Expand workspace sidebar',
    exact: true,
  })
  const collapsedBounds = (await collapsedToggle.boundingBox())!
  expect(collapsedBounds.width).toBe(40)
  expect(collapsedBounds.height).toBe(collapsedBounds.width)
  expect((await resources.locator('svg').boundingBox())!.x).toBe(x)
  expect((await account.boundingBox())!.y).toBe(bottom)
  await resources.press('Enter')
  await expect(resources).toHaveAttribute('aria-current', 'page')
  await expect(
    page.getByRole('heading', { name: 'Resources', exact: true }),
  ).toBeFocused()
  await account.click()
  await page.getByRole('menuitem', { name: 'View preview profile' }).click()
  await expect(
    page.locator('.app-shell-preview').getByRole('status'),
  ).toContainText('no account service')
  await expect(account).toBeFocused()
})
test('mobile sheet restores focus on Escape and moves focus to the selected page on navigation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.goto('/patterns/app-shell')
  await waitForCatalogReady(page)
  const trigger = page.getByRole('button', {
    name: 'Open workspace navigation',
  })
  // AppShell.MenuTrigger shows where the sidebar hides, at the header's end.
  const header = page.locator('.app-shell-preview .surf-app-shell-header')
  const menu = header.locator('.surf-app-shell-menu-trigger')
  await expect(trigger).toHaveClass(/surf-app-shell-menu-trigger/)
  const [triggerEnd, headerEnd] = await Promise.all([
    menu.evaluate((el) => el.getBoundingClientRect().right),
    header.evaluate(
      (el) =>
        el.getBoundingClientRect().right -
        parseFloat(getComputedStyle(el).paddingRight),
    ),
  ])
  expect(triggerEnd).toBe(headerEnd)
  await trigger.click()
  const panel = page.getByRole('dialog', {
    name: 'Workspace navigation',
    exact: true,
  })
  await expect(panel).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(panel).toBeHidden()
  await expect(trigger).toBeFocused()
  await trigger.click()
  await panel.getByRole('link', { name: 'Settings', exact: true }).click()
  await expect(panel).toBeHidden()
  await expect(
    page.getByRole('heading', { name: 'Settings', exact: true }),
  ).toBeFocused()
  await trigger.click()
  await page.setViewportSize({ width: 1440, height: 1000 })
  await expect(panel).toBeHidden()
  // Its own rule hides it beside the sidebar, whatever the header does.
  expect(await menu.evaluate((el) => getComputedStyle(el).display)).toBe('none')
})
test('shell options preserve state, reflow at 320px and pass both theme audits', async ({
  page,
}) => {
  await page.goto('/patterns/app-shell')
  await waitForCatalogReady(page)
  await expect(
    page.locator(
      '.app-shell-preview .surf-app-shell-sidebar .surf-app-shell-brand',
    ),
  ).toHaveText('Surflane')
  for (const dark of [false, true]) {
    if (dark) {
      await page.setViewportSize({ width: 1440, height: 1000 })
      await page
        .getByRole('button', { name: 'Preview user account menu' })
        .click()
      await page.getByRole('menuitem', { name: 'Switch theme' }).click()
      await expect(page.locator('html')).not.toHaveAttribute(
        'data-theme-switching',
      )
    }
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 1000 })
      expect(
        await page
          .locator('.catalog-document-scroll')
          .evaluate((e) => e.scrollWidth <= e.clientWidth),
      ).toBe(true)
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    }
  }
})

test('workspace benchmark keeps brand and account fixed while menu and body scroll independently', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/patterns/app-shell')
  await waitForCatalogReady(page)
  const shell = page.locator('.app-shell-preview')
  await expect(shell).toHaveAttribute('data-layout', 'workspace')
  await expect(
    page.locator('.catalog-example-frame[data-kind="pattern"]'),
  ).toHaveCSS('border-top-width', '1px')
  await page
    .getByRole('checkbox', { name: 'Overflow navigation', exact: true })
    .check()
  await page
    .getByRole('checkbox', { name: 'Long workspace content', exact: true })
    .check()
  const menu = page.getByRole('region', {
    name: 'Workspace destinations',
    exact: true,
  })
  const content = page.getByRole('region', {
    name: 'Workspace content',
    exact: true,
  })
  const account = page.getByRole('button', {
    name: 'Preview user account menu',
  })
  const brand = page.locator(
    '.app-shell-preview .surf-app-shell-sidebar .surf-app-shell-brand',
  )
  await content.scrollIntoViewIfNeeded()
  const accountY = (await account.boundingBox())!.y,
    brandY = (await brand.boundingBox())!.y
  await expect
    .poll(() => menu.evaluate((el) => el.scrollHeight > el.clientHeight))
    .toBe(true)
  await expect
    .poll(() => content.evaluate((el) => el.scrollHeight > el.clientHeight))
    .toBe(true)
  await content.evaluate((el) => (el.scrollTop = 240))
  await expect
    .poll(() => content.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(100)
  expect(await menu.evaluate((el) => el.scrollTop)).toBe(0)
  await menu.evaluate((el) => (el.scrollTop = 200))
  await expect
    .poll(() => menu.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(100)
  expect((await account.boundingBox())!.y).toBe(accountY)
  expect((await brand.boundingBox())!.y).toBe(brandY)
  await page.getByRole('button', { name: 'Collapse workspace sidebar' }).click()
  await expect
    .poll(() =>
      page
        .getByRole('complementary', { name: 'Example workspace sidebar' })
        .evaluate((el) => el.getBoundingClientRect().width),
    )
    .toBe(72)
  expect((await account.boundingBox())!.y).toBe(accountY)
  await page.getByRole('button', { name: 'Expand workspace sidebar' }).click()
  await expect
    .poll(() =>
      page
        .getByRole('complementary', { name: 'Example workspace sidebar' })
        .evaluate((el) => el.getBoundingClientRect().width),
    )
    .toBe(224)
  await content.focus()
  await content.press('Home')
  await content.press('PageDown')
  await expect
    .poll(() => content.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(100)
  // Let the keyboard scroll animation finish; Chromium keeps applying it after a programmatic reset.
  await expect
    .poll(async () => {
      const before = await content.evaluate((el) => el.scrollTop)
      await page.waitForTimeout(50)
      return before === (await content.evaluate((el) => el.scrollTop))
    })
    .toBe(true)
  await menu.getByRole('link', { name: 'Saved view 16', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Saved view 16', exact: true }),
  ).toBeFocused()
  expect(await content.evaluate((el) => el.scrollTop)).toBe(0)
})

test('long content scrolls with the wheel and thumb, then hands the wheel to the document at its edge', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1100 })
  await page.goto('/patterns/app-shell')
  await waitForCatalogReady(page)
  await page
    .getByRole('checkbox', { name: 'Long workspace content', exact: true })
    .check()
  const content = page.getByRole('region', {
    name: 'Workspace content',
    exact: true,
  })
  const root = page.locator('.app-shell-content-scroll')
  const outer = page.locator('.catalog-document-scroll')
  await content.scrollIntoViewIfNeeded()
  const outerTop = await outer.evaluate((el) => el.scrollTop)
  await content.hover()
  await page.mouse.wheel(0, 320)
  await expect
    .poll(() => content.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(100)
  const bar = root.locator('.surf-scrollbar[data-orientation="vertical"]')
  await expect(bar).toHaveCSS('opacity', '1')
  expect(await outer.evaluate((el) => el.scrollTop)).toBe(outerTop)
  const bounds = (await content.boundingBox())!
  await page.mouse.move(bounds.x + bounds.width - 4, bounds.y + 30)
  const thumb = root.locator('.surf-scroll-thumb')
  await expect(thumb).toBeVisible()
  const before = await content.evaluate((el) => el.scrollTop)
  const handle = (await thumb.boundingBox())!
  await page.mouse.move(
    handle.x + handle.width / 2,
    handle.y + handle.height / 2,
  )
  await page.mouse.down()
  await page.mouse.move(
    handle.x + handle.width / 2,
    handle.y + handle.height / 2 + 70,
    { steps: 6 },
  )
  await page.mouse.up()
  await expect
    .poll(() => content.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(before)
  // Embedded in a document, both regions chain to the page at their edges instead of trapping the wheel.
  await expect(content).toHaveCSS('overscroll-behavior-y', 'auto')
  await expect(
    page.getByRole('region', { name: 'Workspace destinations', exact: true }),
  ).toHaveCSS('overscroll-behavior-y', 'auto')
  await content.evaluate((el) => (el.scrollTop = el.scrollHeight))
  await content.hover()
  await page.mouse.wheel(0, 450)
  await expect
    .poll(() => outer.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(outerTop)
})

test('the workspace surface grows through the scroll boundary and closes only at the content end', async ({
  page,
}) => {
  await page.goto('/patterns/app-shell')
  await waitForCatalogReady(page)
  for (const dark of [false, true]) {
    if (dark)
      await page.getByRole('button', { name: 'Toggle theme: Light' }).click()
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 1000 })
      const long = page.getByRole('checkbox', {
        name: 'Long workspace content',
        exact: true,
      })
      const viewport = page.getByRole('region', {
        name: 'Workspace content',
        exact: true,
      })
      const surface = page.locator('.app-shell-preview .surf-app-shell-page')
      // A desktop page insets 12px on each side; on a phone it meets the edges.
      const inset = width > 760 ? 12 : 0
      await long.uncheck()
      await viewport.evaluate((el) => (el.scrollTop = 0))
      await expect
        .poll(async () =>
          Math.abs(
            (await viewport.boundingBox())!.height -
              (await surface.evaluate(
                (el) => el.getBoundingClientRect().height,
              )) -
              inset * 2,
          ),
        )
        .toBeLessThan(2)
      await long.check()
      await expect
        .poll(
          async () =>
            (await surface.boundingBox())!.height -
            (await viewport.boundingBox())!.height,
        )
        .toBeGreaterThan(200)
      let frame = (await viewport.boundingBox())!,
        sheet = (await surface.boundingBox())!
      expect(sheet.y + sheet.height).toBeGreaterThan(
        frame.y + frame.height + 200,
      )
      await viewport.evaluate((el) => (el.scrollTop = 200))
      frame = (await viewport.boundingBox())!
      sheet = (await surface.boundingBox())!
      expect(sheet.y).toBeLessThan(frame.y)
      expect(sheet.y + sheet.height).toBeGreaterThan(frame.y + frame.height)
      await viewport.evaluate((el) => (el.scrollTop = el.scrollHeight))
      // The inset closes the surface at the content end. Engines round scrollHeight
      // to whole pixels, so the last scroll position can stop up to a pixel short.
      await expect
        .poll(async () => {
          const frame = (await viewport.boundingBox())!,
            sheet = (await surface.boundingBox())!
          return Math.abs(
            frame.y + frame.height - sheet.y - sheet.height - inset,
          )
        })
        .toBeLessThan(1)
      await expect
        .poll(() =>
          page
            .locator('.catalog-document-scroll')
            .evaluate((el) => el.scrollWidth <= el.clientWidth),
        )
        .toBe(true)
    }
  }
})

test('the shell keeps and remembers its sidebar state, with a shortcut and rail tooltips', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/patterns/app-shell')
  await waitForCatalogReady(page)
  const shell = page.locator('.app-shell-preview')
  const sidebar = page.getByRole('complementary', {
    name: 'Example workspace sidebar',
  })
  const toggle = page.getByRole('button', {
    name: 'Collapse workspace sidebar',
    exact: true,
  })
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(toggle).toHaveAttribute(
    'aria-controls',
    (await sidebar.getAttribute('id'))!,
  )
  // The toggle's tooltip names the shortcut.
  await toggle.hover()
  await expect(page.locator('.surf-tooltip')).toContainText(
    /⌘Command B|Ctrl\+B/,
  )
  // The shortcut toggles from anywhere but a text field.
  await page.locator('body').click({ position: { x: 5, y: 5 } })
  await page.keyboard.press('ControlOrMeta+b')
  await expect(shell).toHaveAttribute('data-sidebar', 'collapsed')
  // On the rail, a link's name appears as a tooltip.
  await sidebar.getByRole('link', { name: 'Resources', exact: true }).hover()
  await expect(page.locator('.surf-tooltip')).toHaveText('Resources')
  // The state survives a reload.
  await page.reload()
  await waitForCatalogReady(page)
  await expect(shell).toHaveAttribute('data-sidebar', 'collapsed')
  await page
    .getByRole('button', { name: 'Expand workspace sidebar', exact: true })
    .click()
  await expect(shell).toHaveAttribute('data-sidebar', 'expanded')
  await sidebar.getByRole('link', { name: 'Resources', exact: true }).hover()
  await expect(page.locator('.surf-tooltip')).toHaveCount(0)
})

test('a shell that fills the window keeps a square edge, rounds only its page and goes flush on a phone', async ({
  page,
}) => {
  const React = await import('react')
  const { renderToStaticMarkup } = await import('react-dom/server')
  const { AppShell } = await import('@surflane/ui')
  const h = React.createElement
  const markup = renderToStaticMarkup(
    h(
      AppShell.Root,
      { layout: 'workspace', shortcut: false },
      h(AppShell.Header, null, 'Harbor'),
      h(AppShell.Sidebar, { 'aria-label': 'Harbor' }, 'Berths'),
      h(AppShell.Content, null, h(AppShell.Page, null, 'Arrivals')),
    ),
  )
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/install')
  await waitForCatalogReady(page)
  // The install guide gives the document what a window-filling shell needs.
  const body = page.locator('#install-app-shell')
  await expect(body).toContainText('margin: 0;')
  await expect(body).toContainText('background: var(--surf-chrome);')
  await page.evaluate((html) => {
    const host = document.createElement('div')
    host.style.cssText =
      'position: fixed; inset: 0; z-index: 2000; display: grid'
    host.innerHTML = html
    document.body.append(host)
  }, markup)
  const shell = page.locator('body > div > .surf-app-shell')
  const sheet = shell.locator('.surf-app-shell-page')
  await expect(shell).toHaveCSS('border-top-left-radius', '0px')
  expect(await shell.boundingBox()).toEqual({
    x: 0,
    y: 0,
    width: 1440,
    height: 900,
  })
  await expect(sheet).toHaveCSS('border-top-left-radius', '8px')
  await expect(sheet).toHaveCSS('margin-top', '12px')
  // The page radius is set through its own property.
  await shell.evaluate((el) =>
    el.style.setProperty('--surf-app-shell-page-radius', '12px'),
  )
  await expect(sheet).toHaveCSS('border-top-left-radius', '12px')
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(sheet).toHaveCSS('border-top-left-radius', '0px')
  await expect(sheet).toHaveCSS('margin-top', '0px')
  const box = (await sheet.boundingBox())!
  expect(box.x).toBe(0)
  expect(box.x + box.width).toBe(390)
})

test('a workspace shell takes the window height, scrolls its menu and page inside and ends the brand row with the toggle', async ({
  page,
}) => {
  const React = await import('react')
  const { renderToStaticMarkup } = await import('react-dom/server')
  const { AppShell, ScrollArea } = await import('@surflane/ui')
  const h = React.createElement
  // Only package parts and the install guide's document styles: no catalog rules.
  const shell = (defaultCollapsed: boolean) =>
    renderToStaticMarkup(
      h(
        AppShell.Root,
        { layout: 'workspace', shortcut: false, defaultCollapsed },
        h(
          AppShell.Sidebar,
          { 'aria-label': 'Harbor' },
          h(AppShell.Brand, { name: 'Harbor operations control center' }),
          h(AppShell.SidebarToggle),
          h(
            ScrollArea,
            { orientation: 'vertical', label: 'Berths' },
            h(
              'nav',
              null,
              Array.from({ length: 40 }, (_, index) =>
                h(AppShell.Link, {
                  key: index,
                  href: '#',
                  label: `Berth ${index + 1}`,
                  icon: null,
                }),
              ),
            ),
          ),
          h(AppShell.Footer, null, 'Account'),
        ),
        h(
          AppShell.Content,
          null,
          h(
            ScrollArea,
            { orientation: 'vertical', label: 'Arrivals' },
            h(AppShell.Page, null, h('div', { style: { height: 3000 } })),
          ),
        ),
      ),
    )
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/install')
  await waitForCatalogReady(page)
  const mount = (html: string) =>
    page.evaluate((html) => {
      document.querySelector('#harbor')?.remove()
      const host = document.createElement('div')
      host.id = 'harbor'
      host.style.cssText = 'position: fixed; inset: 0; z-index: 2000'
      host.innerHTML = html
      document.body.append(host)
    }, html)
  await mount(shell(false))
  const root = page.locator('#harbor > .surf-app-shell')
  expect((await root.boundingBox())!.height).toBe(900)
  const scrolls = (selector: string) =>
    root
      .locator(`${selector} > .surf-scroll-root > .surf-scroll-viewport`)
      .evaluate((el) => ({
        height: el.clientHeight,
        scrolls: el.scrollHeight > el.clientHeight,
      }))
  expect(await scrolls('.surf-app-shell-content')).toEqual({
    height: 900,
    scrolls: true,
  })
  expect((await scrolls('.surf-app-shell-sidebar')).scrolls).toBe(true)
  const footer = (await root.locator('.surf-app-shell-footer').boundingBox())!
  expect(footer.y + footer.height).toBeLessThanOrEqual(900)
  // Expanded, the toggle ends the brand row, 16px from the sidebar's inner edge and
  // centered on the row, and a long name takes two lines of the row before the toggle.
  const toggle = root.locator('.surf-app-shell-toggle')
  const sidebar = (await root.locator('.surf-app-shell-sidebar').boundingBox())!
  const brand = (await root.locator('.surf-app-shell-brand').boundingBox())!
  let box = (await toggle.boundingBox())!
  expect(box.width).toBe(40)
  expect(box.x + box.width).toBe(sidebar.x + sidebar.width - 16)
  expect(box.y + box.height / 2).toBe(brand.y + brand.height / 2)
  const name = root.locator('.surf-app-shell-brand-name')
  const nameBox = (await name.boundingBox())!
  expect(nameBox.x + nameBox.width).toBeLessThanOrEqual(box.x - 8)
  expect(nameBox.height).toBe(48)
  expect(nameBox.y).toBeGreaterThanOrEqual(brand.y)
  expect(nameBox.y + nameBox.height).toBeLessThanOrEqual(brand.y + brand.height)
  // Collapsed, it centers in the rail where the brand was.
  await mount(shell(true))
  box = (await toggle.boundingBox())!
  expect(box.width).toBe(40)
  expect(box.x + box.width / 2).toBe(36)
})

test('Brand, Nav and a Link rendered as a button line up on the icon column, and only the sidebar collapses', async ({
  page,
}) => {
  const React = await import('react')
  const { renderToStaticMarkup } = await import('react-dom/server')
  const { AppShell, Icon, ScrollArea } = await import('@surflane/ui')
  const h = React.createElement
  const mark = h(
    'svg',
    { viewBox: '0 0 24 24' },
    h('rect', { width: 24, height: 24, rx: 6 }),
  )
  const shell = (defaultCollapsed: boolean) =>
    renderToStaticMarkup(
      h(
        AppShell.Root,
        { layout: 'workspace', shortcut: false, defaultCollapsed },
        h(AppShell.Header, null, h(AppShell.Brand, { mark, name: 'Harbor' })),
        h(
          AppShell.Sidebar,
          { 'aria-label': 'Harbor' },
          h(AppShell.Brand, {
            mark,
            name: 'Harbor',
            description: 'Port of Busan',
          }),
          h(AppShell.SidebarToggle),
          h(
            ScrollArea,
            { orientation: 'vertical', label: 'Destinations' },
            h(
              AppShell.Nav,
              { label: 'Berths' },
              ['North', 'South'].map((label) =>
                h(AppShell.Link, {
                  key: label,
                  href: '#',
                  label,
                  icon: h(Icon, { name: 'monitor', decorative: true }),
                }),
              ),
            ),
          ),
          h(
            AppShell.Footer,
            null,
            // A menu trigger in an app; any element takes the row through render.
            h(AppShell.Link, {
              render: h('button', { type: 'button' }),
              label: 'Account',
              icon: h(Icon, { name: 'info', decorative: true }),
            }),
          ),
        ),
        h(AppShell.Content, null, h(AppShell.Page, null, 'Arrivals')),
      ),
    )
  await page.goto('/install')
  await waitForCatalogReady(page)
  const mount = (html: string) =>
    page.evaluate((html) => {
      document.querySelector('#harbor')?.remove()
      const host = document.createElement('div')
      host.id = 'harbor'
      host.style.cssText = 'position: fixed; inset: 0; z-index: 2000'
      host.innerHTML = html
      document.body.append(host)
    }, html)
  await page.setViewportSize({ width: 1440, height: 900 })
  await mount(shell(false))
  const root = page.locator('#harbor > .surf-app-shell')
  const sidebar = root.locator('.surf-app-shell-sidebar')
  await expect(
    sidebar.getByRole('navigation', { name: 'Berths', exact: true }),
  ).toHaveCount(1)
  const account = sidebar.locator('.surf-app-shell-footer button')
  await expect(account).toHaveClass('surf-app-shell-link')
  await expect(account).toHaveAccessibleName('Account')
  const center = async (selector: string) => {
    const box = (await sidebar.locator(selector).first().boundingBox())!
    return box.x + box.width / 2
  }
  const left = async (selector: string) =>
    (await sidebar.locator(selector).first().boundingBox())!.x
  // The mark, the links' icons and the account's icon share one column.
  const column = await center('.surf-app-shell-nav .surf-app-shell-icon')
  expect(await center('.surf-app-shell-brand-mark')).toBe(column)
  expect(await center('.surf-app-shell-footer .surf-app-shell-icon')).toBe(
    column,
  )
  // The brand's name and the account's start on the links' label line.
  const line = await left(
    '.surf-app-shell-nav .surf-app-shell-link .surf-app-shell-label',
  )
  expect(await left('.surf-app-shell-brand-name')).toBe(line)
  expect(await left('.surf-app-shell-footer .surf-app-shell-label')).toBe(line)
  await expect(sidebar.locator('.surf-app-shell-brand-name')).toHaveAttribute(
    'title',
    'Harbor',
  )
  await expect(sidebar.locator('.surf-app-shell-brand')).toHaveCSS(
    'height',
    '80px',
  )
  // Collapsed, the toggle takes the brand's place; the group label keeps its row.
  await mount(shell(true))
  await expect(sidebar.locator('.surf-app-shell-brand')).toHaveCSS(
    'visibility',
    'hidden',
  )
  expect(await center('.surf-app-shell-nav .surf-app-shell-icon')).toBe(column)
  // On a phone the header's brand stays whole, whatever the sidebar's state.
  await page.setViewportSize({ width: 390, height: 844 })
  const name = root.locator('.surf-app-shell-header .surf-app-shell-brand-name')
  await expect(name).toBeVisible()
  await expect(name).toHaveCSS('opacity', '1')
  // A Link outside the shell, such as in a mobile Sheet, keeps the row's icon column.
  await mount(
    renderToStaticMarkup(
      h(AppShell.Link, {
        href: '#',
        label: 'Loose',
        icon: h(Icon, { name: 'monitor', decorative: true }),
      }),
    ),
  )
  await expect(page.locator('#harbor > .surf-app-shell-link')).toHaveCSS(
    'grid-template-columns',
    /^40px /,
  )
})
test('right to left, the sidebar moves to the right and its toggle ends the brand row on the left', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/patterns/app-shell')
  await waitForCatalogReady(page)
  const shell = page.locator('.app-shell-preview')
  await shell.evaluate((el) => el.setAttribute('dir', 'rtl'))
  const sidebar = (await shell
    .locator('.surf-app-shell-sidebar')
    .boundingBox())!
  const content = (await shell
    .locator('.surf-app-shell-content, .surf-app-shell-page')
    .first()
    .boundingBox())!
  expect(sidebar.x).toBeGreaterThan(content.x)
  const edge = (await shell
    .getByRole('button', { name: 'Collapse workspace sidebar', exact: true })
    .boundingBox())!
  // The brand row ends at the sidebar's inner edge, which now faces left.
  expect(edge.x).toBe(sidebar.x + 16)
})
for (const [width, inset] of [
  [1440, 12],
  [375, 0],
] as const)
  test(`compact density keeps a workspace page ${inset}px from the shell's edges at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/patterns/app-shell')
    await waitForCatalogReady(page)
    const shell = page
      .locator(".surf-app-shell[data-layout='workspace']")
      .first()
    await shell.evaluate((el) => el.setAttribute('data-ui-density', 'compact'))
    const content = shell.locator('> .surf-app-shell-content')
    const sheet = content.locator('.surf-app-shell-page').first()
    // The content never pads; the page keeps the shell's inset, none on a phone.
    await expect(content).toHaveCSS('padding-top', '0px')
    await expect(sheet).toHaveCSS('margin-top', `${inset}px`)
    // The page's own padding takes the compact 12px.
    await expect(sheet).toHaveCSS('padding-top', '12px')
  })

test('below collapseBelow the sidebar starts on its rail, and only the wide state is remembered', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/patterns/app-shell')
  await waitForCatalogReady(page)
  await page.evaluate(() => localStorage.removeItem('surflane-preview-sidebar'))
  await page.reload()
  await waitForCatalogReady(page)
  const shell = page.locator(".surf-app-shell[data-layout='workspace']")
  const toggle = shell.locator('.surf-app-shell-toggle')
  const stored = () =>
    page.evaluate(() => localStorage.getItem('surflane-preview-sidebar'))
  await expect(shell).toHaveAttribute('data-sidebar', 'expanded')
  // The catalog's shell sets collapseBelow={1280}.
  await page.setViewportSize({ width: 1100, height: 900 })
  await expect(shell).toHaveAttribute('data-sidebar', 'collapsed')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  // The toggle still opens it, without touching the remembered state.
  await toggle.click()
  await expect(shell).toHaveAttribute('data-sidebar', 'expanded')
  expect(await stored()).toBeNull()
  // Wide again, the shell returns to its own state.
  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(shell).toHaveAttribute('data-sidebar', 'expanded')
  await toggle.click()
  await expect(shell).toHaveAttribute('data-sidebar', 'collapsed')
  expect(await stored()).toBe('collapsed')
  await page.setViewportSize({ width: 1100, height: 900 })
  await expect(shell).toHaveAttribute('data-sidebar', 'collapsed')
  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(shell).toHaveAttribute('data-sidebar', 'collapsed')
})

test("a page's tab bar sits at its top on the brand row's line and starts where its content does", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/patterns/app-shell')
  await waitForCatalogReady(page)
  await page.getByRole('checkbox', { name: 'Page bar', exact: true }).check()
  const shell = page.locator('.app-shell-preview')
  const pages = shell.getByRole('navigation', { name: 'Overview pages' })
  const measure = () =>
    shell.evaluate((element) => {
      const box = (selector: string) => {
        const rect = element.querySelector(selector)!.getBoundingClientRect()
        return { x: rect.x, y: rect.y, w: rect.width, h: rect.height }
      }
      const sheet = element.querySelector('.surf-app-shell-page')!
      const label = document.createRange()
      label.selectNodeContents(element.querySelector('.surf-app-shell-bar a')!)
      return {
        brand: box('.surf-app-shell-sidebar > .surf-app-shell-brand'),
        bar: box('.surf-app-shell-bar'),
        tab: box('.surf-app-shell-bar a'),
        label: label.getBoundingClientRect().x,
        title: box('.surf-app-shell-page h3'),
        page: box('.surf-app-shell-page'),
        padding: parseFloat(getComputedStyle(sheet).paddingInlineStart),
        line: getComputedStyle(element.querySelector('.surf-app-shell-bar')!)
          .borderBlockEndStyle,
      }
    })
  // By default a tab bleeds its padding and edge: its label is on the page's text,
  // and it stands 12px under the page's top and 11px from its start, as the page
  // stands from the shell. In compact density there is no room to bleed: the tab
  // starts at the text.
  for (const density of ['default', 'compact']) {
    if (density === 'compact')
      await shell.evaluate((element) =>
        element.setAttribute('data-ui-density', 'compact'),
      )
    const at = await measure()
    expect(at.line).toBe('none')
    expect(at.bar.y).toBe(at.page.y)
    expect(at.tab.h).toBe(32)
    expect(at.tab.y + at.tab.h / 2).toBe(at.brand.y + at.brand.h / 2)
    expect(at.tab.y - at.page.y).toBe(12)
    if (density === 'default') {
      expect(at.label).toBe(at.title.x)
      expect(at.tab.x - at.page.x).toBe(11)
    } else expect(at.tab.x).toBe(at.title.x)
    // The page's content keeps its padding under the bar.
    expect(at.title.y).toBeGreaterThanOrEqual(at.bar.y + at.bar.h + at.padding)
  }
  await shell.evaluate((element) => element.removeAttribute('data-ui-density'))
  await pages.getByRole('link', { name: 'Members', exact: true }).click()
  await expect(
    pages.getByRole('link', { name: 'Members', exact: true }),
  ).toHaveAttribute('aria-current', 'page')
  // On a phone it sits under the mobile header.
  await page.setViewportSize({ width: 390, height: 844 })
  const header = (await shell.locator('.surf-app-shell-header').boundingBox())!
  const bar = (await shell.locator('.surf-app-shell-bar').boundingBox())!
  expect(bar.y).toBeGreaterThanOrEqual(header.y + header.height)
  // There it has no room to bleed: its tabs start at the page's text.
  expect(
    (await shell.locator('.surf-app-shell-bar a').first().boundingBox())!.x,
  ).toBe((await shell.locator('.surf-app-shell-page h3').boundingBox())!.x)
  await expect(pages).toBeVisible()
  expect(
    (await new AxeBuilder({ page }).include('.app-shell-preview').analyze())
      .violations,
  ).toEqual([])
})

test('compact density makes the sidebar rows and toggle 32px, and touch never makes them smaller', async ({
  browser,
}) => {
  const React = await import('react')
  const { renderToStaticMarkup } = await import('react-dom/server')
  const { AppShell, Icon } = await import('@surflane/ui')
  const h = React.createElement
  const markup = renderToStaticMarkup(
    h(
      'div',
      { 'data-ui-density': 'compact', style: { height: '100%' } },
      h(
        AppShell.Root,
        { layout: 'workspace', shortcut: false },
        h(
          AppShell.Sidebar,
          { 'aria-label': 'Harbor' },
          h(AppShell.Brand, { name: 'Harbor' }),
          h(AppShell.SidebarToggle),
          h(
            AppShell.Nav,
            { 'aria-label': 'Berths' },
            h(AppShell.Link, {
              href: '#',
              label: 'Berths',
              icon: h(Icon, { name: 'menu', decorative: true }),
            }),
            h(AppShell.Link, {
              render: h('button', { type: 'button' }),
              label: 'Harbor master',
              icon: h(Icon, { name: 'info', decorative: true }),
            }),
          ),
        ),
        h(AppShell.Content, null, h(AppShell.Page, null, 'Arrivals')),
      ),
    ),
  )
  const rows = async (touch: boolean) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      hasTouch: touch,
      isMobile: touch,
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    await page.goto('/install')
    await waitForCatalogReady(page)
    await page.evaluate((html) => {
      const host = document.createElement('div')
      host.id = 'harbor'
      host.style.cssText = 'position: fixed; inset: 0; z-index: 2000'
      host.innerHTML = html
      document.body.append(host)
    }, markup)
    const sizes = await page.evaluate(() =>
      [
        '#harbor .surf-app-shell-nav > a',
        '#harbor .surf-app-shell-nav > button',
        '#harbor .surf-app-shell-toggle',
      ].map((selector) =>
        Math.round(
          document.querySelector(selector)!.getBoundingClientRect().height,
        ),
      ),
    )
    await context.close()
    return sizes
  }
  // Link rows, a row rendered as a button and the toggle are 32px, on touch too:
  // compact keeps a control at its size, never under the row.
  expect(await rows(false)).toEqual([32, 32, 32])
  expect(await rows(true)).toEqual([32, 32, 32])
})
