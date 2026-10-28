import { waitForCatalogReady } from './catalog-ready'
import { test, expect, type Page } from '@playwright/test'
test.use({ reducedMotion: 'reduce' })

const open = async (page: Page) => {
  await page.goto('/components/data-state')
  await waitForCatalogReady(page)
  const region = page.getByRole('region', { name: 'Cluster summary' })
  const choose = async (name: 'State' | 'Layout', option: string) => {
    await page.getByRole('combobox', { name, exact: true }).click()
    await page.getByRole('option', { name: option, exact: true }).click()
  }
  return { region, choose }
}

test('an error says so with a retry, and retrying moves focus to the content', async ({
  page,
}) => {
  const { region } = await open(page)
  await expect(region).toHaveAttribute('data-state', 'error')
  await expect(region).toContainText('This could not load.')
  await expect(region.getByText('ap-northeast-2')).toHaveCount(0)
  const retry = region.getByRole('button', { name: 'Retry', exact: true })
  await retry.focus()
  await page.keyboard.press('Enter')
  await expect(region).toHaveAttribute('data-state', 'ready')
  await expect(region.getByText('ap-northeast-2')).toBeVisible()
  // The button went away with the error; focus is on the region, not the page.
  await expect(region).toBeFocused()
})

test('loading holds a placeholder, stale keeps the values under a caution, empty says so', async ({
  page,
}) => {
  const { region, choose } = await open(page)
  await choose('State', 'Loading')
  await expect(region).toHaveAttribute('aria-busy', 'true')
  await expect(region.locator('.surf-skeleton')).toHaveCount(1)
  await expect(region.locator('.surf-feedback-sr').first()).toHaveText(
    'Loading',
  )
  await choose('State', 'Stale')
  await expect(
    region.locator('.surf-message[data-tone="caution"]'),
  ).toContainText('These are the last values')
  await expect(region.getByText('ap-northeast-2')).toBeVisible()
  await expect(region.getByRole('button', { name: 'Retry' })).toBeVisible()
  await choose('State', 'Empty')
  await expect(region).toContainText('Nothing to show yet.')
})

test('refreshing keeps the content, dimmed, busy and announced', async ({
  page,
}) => {
  const { region, choose } = await open(page)
  await choose('State', 'Ready')
  await page.getByRole('checkbox', { name: 'Refreshing', exact: true }).check()
  await expect(region).toHaveAttribute('aria-busy', 'true')
  await expect(region.getByRole('status')).toHaveText('Refreshing')
  expect(
    await region
      .locator('.surf-data-state-content')
      .evaluate((content) => getComputedStyle(content).opacity),
  ).toBe('0.6')
  await expect(region.getByText('ap-northeast-2')).toBeVisible()
})

test('inline fits one line; page centers in the room a page gives', async ({
  page,
}) => {
  const { region, choose } = await open(page)
  await choose('Layout', 'Inline')
  const row = await region.evaluate((element) => {
    const parts = [...element.querySelectorAll('.surf-data-state-notice > *')]
    const tops = parts.map((part) => {
      const box = part.getBoundingClientRect()
      return Math.round(box.top + box.height / 2)
    })
    return Math.max(...tops) - Math.min(...tops)
  })
  expect(row).toBeLessThanOrEqual(2)
  await choose('Layout', 'Page')
  const page_ = await region.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    viewport: window.innerHeight,
    align: getComputedStyle(element).textAlign,
  }))
  expect(page_.height).toBeGreaterThanOrEqual(page_.viewport * 0.4 - 1)
  expect(page_.align).toBe('center')
  // Once the data is there, the content keeps its own layout.
  await choose('State', 'Ready')
  const ready = await region.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    viewport: window.innerHeight,
    align: getComputedStyle(element).textAlign,
    display: getComputedStyle(element).display,
  }))
  expect(ready.align).toBe('start')
  expect(ready.display).toBe('block')
  expect(ready.height).toBeLessThan(ready.viewport * 0.4)
})

test('a DataState at the end of a long page in a ScrollArea keeps the document the window high', async ({
  page,
}) => {
  const React = await import('react')
  const { renderToStaticMarkup } = await import('react-dom/server')
  const { AppShell, DataState, ScrollArea } = await import('@surflane/ui')
  const h = React.createElement
  // The shell's content scrolls inside it; the DataState's live region sits at the
  // end of a page three windows long, where it once hung below the window.
  const markup = renderToStaticMarkup(
    h(
      AppShell.Root,
      { layout: 'workspace', shortcut: false },
      h(AppShell.Sidebar, { 'aria-label': 'Harbor' }),
      h(
        AppShell.Content,
        null,
        h(
          ScrollArea,
          { orientation: 'vertical', label: 'Arrivals' },
          h(
            AppShell.Page,
            null,
            h(
              DataState,
              { refreshing: true },
              h('div', { style: { height: 2700 } }, 'Arrivals'),
            ),
          ),
        ),
      ),
    ),
  )
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/install')
  await waitForCatalogReady(page)
  await page.evaluate((html) => {
    const host = document.createElement('div')
    host.id = 'harbor'
    host.style.cssText = 'position: fixed; inset: 0; z-index: 2000'
    host.innerHTML = html
    document.body.replaceChildren(host)
  }, markup)
  const sizes = await page.evaluate(() => {
    const status = document.querySelector(
      '#harbor .surf-data-state [role="status"]',
    )!
    const viewport = document.querySelector(
      '#harbor .surf-app-shell-content .surf-scroll-viewport',
    )!
    return {
      document: document.scrollingElement!.scrollHeight,
      window: window.innerHeight,
      root: document.querySelector(
        '#harbor .surf-app-shell-content > .surf-scroll-root',
      )!.scrollHeight,
      statusInViewport:
        status.getBoundingClientRect().top -
          viewport.getBoundingClientRect().top <
        viewport.scrollHeight,
    }
  })
  expect(sizes.document).toBe(sizes.window)
  expect(sizes.root).toBe(sizes.window)
  expect(sizes.statusInViewport).toBe(true)
})
