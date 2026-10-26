import { waitForCatalogReady } from './catalog-ready'
import { test, expect, type Page } from '@playwright/test'
test.use({ reducedMotion: 'reduce' })

const open = async (page: Page, width = 1440) => {
  await page.setViewportSize({ width, height: 900 })
  await page.goto('/components/banner')
  await waitForCatalogReady(page)
  return page.locator('#preview .surf-banner')
}

test("a banner names its state in words on its tone's plane, as a polite live region", async ({
  page,
}) => {
  const banner = await open(page)
  await expect(banner).toHaveAttribute('role', 'status')
  await expect(banner.locator('.surf-banner-title')).toHaveText(
    'Scheduled maintenance',
  )
  await expect(banner.locator('.surf-banner-icon')).toHaveAttribute(
    'aria-hidden',
    'true',
  )
  const fills = async () =>
    banner.evaluate((element) => {
      const probe = document.createElement('span')
      element.append(probe)
      const resolve = (token: string) => {
        probe.style.backgroundColor = `var(${token})`
        return getComputedStyle(probe).backgroundColor
      }
      const tone = element.getAttribute('data-tone')
      const result = {
        tone,
        plane:
          getComputedStyle(element).backgroundColor ===
          resolve(`--surf-status-${tone}-bg`),
        radius: getComputedStyle(element).borderRadius,
      }
      probe.remove()
      return result
    })
  expect(await fills()).toEqual({ tone: 'caution', plane: true, radius: '0px' })
  await page.getByRole('combobox', { name: 'State', exact: true }).click()
  await page.getByRole('option', { name: 'Build service outage' }).click()
  await expect(banner).toHaveAttribute('data-tone', 'danger')
  await expect
    .poll(fills)
    .toEqual({ tone: 'danger', plane: true, radius: '0px' })
  // One row on a wide screen: icon, text, action and dismiss share a line.
  const middles = await banner.evaluate((element) =>
    [
      '.surf-banner-icon',
      '.surf-banner-title',
      '.surf-banner-actions',
      '.surf-banner-dismiss',
    ].map((selector) => {
      const box = element.querySelector(selector)!.getBoundingClientRect()
      return Math.round(box.top + box.height / 2)
    }),
  )
  expect(Math.max(...middles) - Math.min(...middles)).toBeLessThanOrEqual(2)
})

test('dismissing moves focus to the next control, and the actions go under the text on a phone', async ({
  page,
}) => {
  let banner = await open(page)
  const dismiss = banner.getByRole('button', { name: 'Dismiss', exact: true })
  await dismiss.focus()
  await page.keyboard.press('Enter')
  await expect(banner).toHaveCount(0)
  const again = page.getByRole('button', {
    name: 'Show the notice again',
    exact: true,
  })
  await expect(again).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(banner).toHaveCount(1)
  banner = await open(page, 375)
  const layout = await banner.evaluate((element) => {
    const box = (selector: string) =>
      element.querySelector(selector)!.getBoundingClientRect()
    return {
      below:
        box('.surf-banner-actions').top >= box('.surf-banner-content').bottom,
      inside:
        document.documentElement.scrollWidth <= window.innerWidth &&
        element.getBoundingClientRect().right <= window.innerWidth,
    }
  })
  expect(layout).toEqual({ below: true, inside: true })
})

test('right to left the dismiss button is on the left; forced colours keep an edge; compact is 4px above and below', async ({
  page,
}) => {
  const banner = await open(page)
  await banner.evaluate((element) => element.setAttribute('dir', 'rtl'))
  const sides = await banner.evaluate((element) => {
    const box = (selector: string) =>
      element.querySelector(selector)!.getBoundingClientRect()
    return box('.surf-banner-dismiss').right < box('.surf-banner-icon').left
  })
  expect(sides).toBe(true)
  await banner.evaluate((element) => element.removeAttribute('dir'))
  await page.emulateMedia({ forcedColors: 'active' })
  expect(
    await banner.evaluate((element) => {
      const style = getComputedStyle(element)
      return [style.borderBottomStyle, style.borderBottomWidth]
    }),
  ).toEqual(['solid', '1px'])
  await page.emulateMedia({ forcedColors: 'none' })
  await page
    .getByRole('button', { name: 'Preview density: Compact', exact: true })
    .click()
  await expect
    .poll(() =>
      banner.evaluate((element) => getComputedStyle(element).paddingTop),
    )
    .toBe('4px')
})

test('first in an AppShell, a banner spans the shell above the sidebar and content, and above the header on a phone', async ({
  page,
}) => {
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/patterns/app-shell')
    await waitForCatalogReady(page)
    await page
      .getByRole('checkbox', { name: 'System notice', exact: true })
      .check()
    const shell = page.locator('.surf-app-shell').first()
    const banner = shell.locator('> .surf-banner')
    await expect(banner).toBeVisible()
    const box = await shell.evaluate((element) => {
      const rect = (selector: string) =>
        element.querySelector<HTMLElement>(selector)!.getBoundingClientRect()
      const shellBox = element.getBoundingClientRect()
      const banner = rect(':scope > .surf-banner')
      const content = rect(':scope > .surf-app-shell-content')
      const visible = [...element.children].filter(
        (child) =>
          !child.classList.contains('surf-banner') &&
          getComputedStyle(child).display !== 'none',
      )
      return {
        edgeToEdge:
          Math.round(banner.left) === Math.round(shellBox.left) &&
          Math.round(banner.width) === Math.round(shellBox.width),
        top: Math.round(banner.top) === Math.round(shellBox.top),
        above: visible.every(
          (child) => child.getBoundingClientRect().top >= banner.bottom - 0.5,
        ),
        contentFills: content.bottom <= shellBox.bottom + 0.5,
      }
    })
    expect(box).toEqual({
      edgeToEdge: true,
      top: true,
      above: true,
      contentFills: true,
    })
  }
})
