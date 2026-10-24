import { waitForCatalogReady } from './catalog-ready'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
test.use({ reducedMotion: 'reduce' })
test('Bottom navigation marks the current destination and reads badges after labels', async ({
  page,
}) => {
  await page.goto('/components/bottom-navigation')
  await waitForCatalogReady(page)
  const nav = page.getByRole('navigation', { name: 'Primary', exact: true })
  await expect(nav.getByRole('link')).toHaveCount(4)
  await expect(nav.locator('ul')).toHaveCount(1)
  const runs = nav.getByRole('link', { name: 'Runs', exact: true })
  await expect(runs).toHaveAttribute('aria-current', 'page')
  await expect(
    nav.getByRole('link', { name: /^Activity ?, 3 unread$/ }),
  ).toBeVisible()
  await expect(
    nav.getByRole('link', { name: /^Account ?, needs attention$/ }),
  ).toBeVisible()
  await expect(nav.locator('.surf-bottom-nav-badge').first()).toHaveText('3')
  await expect(nav.locator('.surf-bottom-nav-badge[data-dot]')).toHaveCount(1)
  // A tone colors a badge by meaning: the count is danger, the dot caution.
  const fills = await nav
    .locator('.surf-bottom-nav-badge')
    .evaluateAll((badges) => {
      const probe = document.createElement('span')
      document.body.append(probe)
      const resolve = (token: string) => {
        probe.style.color = `var(${token})`
        return getComputedStyle(probe).color
      }
      const result = badges.map(
        (badge) => getComputedStyle(badge).backgroundColor,
      )
      const expected = [
        resolve('--surf-status-danger-fg'),
        resolve('--surf-status-caution-fg'),
      ]
      probe.remove()
      return { result, expected }
    })
  expect(fills.result).toEqual(fills.expected)

  const schedule = nav.getByRole('link', { name: 'Schedule', exact: true })
  await schedule.focus()
  await page.keyboard.press('Enter')
  await expect(schedule).toHaveAttribute('aria-current', 'page')
  await expect(runs).not.toHaveAttribute('aria-current', 'page')
  await expect(page.getByRole('status')).toContainText(
    'Current destination: Schedule',
  )
  await expect(schedule).toHaveCSS('outline-style', 'solid')

  // The bar is the token's height, and the current pill uses the selected role.
  const list = await nav.locator('ul').boundingBox()
  expect(list?.height).toBe(56)
  const selected = await page.evaluate(() => {
    const probe = document.createElement('i')
    probe.style.background = 'var(--surf-selected)'
    document.querySelector('.surf-bottom-nav')?.append(probe)
    const color = getComputedStyle(probe).backgroundColor
    probe.remove()
    return color
  })
  await expect(schedule.locator('.surf-bottom-nav-icon')).toHaveCSS(
    'background-color',
    selected,
  )

  await page.getByText('Show badges', { exact: true }).click()
  await expect(
    nav.getByRole('link', { name: 'Activity', exact: true }),
  ).toBeVisible()
  await expect(nav.locator('.surf-bottom-nav-badge')).toHaveCount(0)

  const results = await new AxeBuilder({ page })
    .include('.bottom-nav-preview')
    .analyze()
  expect(results.violations).toEqual([])
})

test('Bottom navigation mirrors its badge in RTL', async ({ page }) => {
  await page.goto('/components/bottom-navigation')
  await waitForCatalogReady(page)
  const activity = page.locator('.surf-bottom-nav-item').nth(2)
  const side = async () =>
    activity.evaluate((link) => {
      const icon = link.querySelector('svg')!.getBoundingClientRect()
      const badge = link
        .querySelector('.surf-bottom-nav-badge')!
        .getBoundingClientRect()
      return badge.left + badge.width / 2 > icon.left + icon.width / 2
        ? 'right'
        : 'left'
    })
  expect(await side()).toBe('right')
  await page.getByText('RTL preview', { exact: true }).click()
  await expect(page.locator('.bottom-nav-preview')).toHaveAttribute(
    'dir',
    'rtl',
  )
  expect(await side()).toBe('left')
})

test('Bottom navigation shows where the sidebar hides and stays fixed under overlays', async ({
  page,
}) => {
  const React = await import('react')
  const { renderToStaticMarkup } = await import('react-dom/server')
  const { BottomNavigation } = await import('@surflane/ui')
  const markup = renderToStaticMarkup(
    React.createElement(
      BottomNavigation.Root,
      { 'aria-label': 'Probe' },
      React.createElement(BottomNavigation.Item, {
        href: '/inbox',
        icon: 'I',
        label: 'Inbox',
        badge: 120,
      }),
      React.createElement(BottomNavigation.Item, {
        href: '/home',
        icon: 'H',
        label: 'Home',
        badge: 0,
      }),
    ),
  )
  expect(markup).toContain('>99+</span>')
  expect(markup).toContain('>, 99+</span>')
  expect(markup.match(/surf-bottom-nav-badge/g)).toHaveLength(1)

  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/components/bottom-navigation')
  await waitForCatalogReady(page)
  await page.evaluate((html) => {
    const host = document.createElement('div')
    host.innerHTML = html
    document.body.append(host)
  }, markup)
  const probe = page.getByRole('navigation', { name: 'Probe', exact: true })
  await expect(probe).toBeHidden()
  await page.setViewportSize({ width: 390, height: 800 })
  await expect(probe).toBeVisible()
  await expect(probe).toHaveCSS('position', 'fixed')
  await expect(probe).toHaveCSS('z-index', '1000')
  const box = await probe.boundingBox()
  expect(box && Math.round(box.y + box.height)).toBe(800)
  expect(box?.width).toBe(390)
})
