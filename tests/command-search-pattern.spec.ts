import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { catalog } from '../demo/catalog'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
const route = '/patterns/command-search'
const dialog = (page: Page) =>
  page.getByRole('dialog', { name: 'Command search', exact: true })
const search = (page: Page) =>
  page.getByRole('combobox', { name: 'Search pages and actions', exact: true })
async function open(page: Page) {
  await page.goto(route)
  await waitForCatalogReady(page)
  await page
    .getByRole('button', { name: 'Search documentation', exact: true })
    .click()
  await expect(search(page)).toBeFocused()
}

test('keyboard search matches metadata, navigates once and gives destination title focus', async ({
  page,
}) => {
  await open(page)
  await search(page).fill('button actions')
  await expect(dialog(page).getByRole('option')).toHaveCount(1)
  await expect(
    dialog(page).getByRole('status', { name: 'Search results count' }),
  ).toHaveText('1 result')
  await search(page).press('Enter')
  await expect(page).toHaveURL(/\/components\/button$/)
  await waitForCatalogReady(page)
  await expect(page.locator('#page-title')).toHaveText('Button')
  await expect(page.locator('#page-title')).toBeFocused()
  await page.goBack()
  await waitForCatalogReady(page)
  await expect(page).toHaveURL(new RegExp(route + '$'))
  await expect(dialog(page)).toHaveCount(0)
})

test('empty results, description matching and current destination availability retain clear behavior', async ({
  page,
}) => {
  await open(page)
  await search(page).fill('zz-no-such-page-zz')
  await expect(dialog(page)).toContainText(
    'No results. Try a shorter name or another category.',
  )
  await expect(dialog(page).getByRole('option')).toHaveCount(0)
  await search(page).press('Enter')
  await expect(dialog(page)).toBeVisible()
  await search(page).fill('nested resources')
  // Search includes descriptions, not only display names.
  await expect(dialog(page).getByRole('option')).not.toHaveCount(0)
  const planned = catalog.find((item) => item.stage !== 'available')
  if (planned) {
    await search(page).fill(planned.name)
    const destination = dialog(page)
      .getByRole('option')
      .filter({ has: page.getByText(planned.name, { exact: true }) })
      .first()
    await expect(destination).toHaveAttribute('aria-disabled', 'true')
    await destination.evaluate((el: HTMLElement) => el.click())
    await search(page).press('Enter')
    await expect(page).toHaveURL(new RegExp(route + '$'))
    await expect(dialog(page)).toBeVisible()
  } else {
    // Every page is now Available, including Chart; an old Planned assertion
    // would contradict the authoritative catalog and conceal real navigation.
    await search(page).fill('chart')
    await expect(
      dialog(page).getByRole('option', { name: /^Chart / }),
    ).not.toHaveAttribute('aria-disabled', 'true')
    await search(page).press('Enter')
    await expect(page).toHaveURL(/\/charts\/chart$/)
    await waitForCatalogReady(page)
    await expect(page.locator('#page-title')).toBeFocused()
    await open(page)
  }
  await search(page).press('Escape')
  await expect(dialog(page)).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Search documentation', exact: true }),
  ).toBeFocused()
  await page
    .getByRole('button', { name: 'Search documentation', exact: true })
    .click()
  await expect(search(page)).toHaveValue('')
})

test('local action executes once, preserves route and restores trigger focus', async ({
  page,
}) => {
  await open(page)
  await search(page).fill('switch theme')
  const action = dialog(page).getByRole('option', {
    name: /^Switch theme .*Action$/,
    exact: true,
  })
  await action.evaluate((el: HTMLElement) => {
    el.click()
    el.click()
  })
  await expect(dialog(page)).toHaveCount(0)
  await expect(page).toHaveURL(new RegExp(route + '$'))
  await expect(
    page.getByRole('button', { name: 'Toggle theme: Dark', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('status', { name: 'Command result', exact: true }),
  ).toContainText('Appearance updated')
  await expect(
    page.getByRole('button', { name: 'Search documentation', exact: true }),
  ).toBeFocused()
  await page
    .getByRole('button', { name: 'Search documentation', exact: true })
    .click()
  await expect(search(page)).toHaveValue('')
})

test('shortcut respects editing, composition and route lifecycle', async ({
  page,
}) => {
  await page.goto(route)
  await waitForCatalogReady(page)
  await page.evaluate(() => {
    const el = document.createElement('input')
    el.setAttribute('aria-label', 'Editing probe')
    document.querySelector('.command-search-example')!.append(el)
    el.focus()
  })
  await page.keyboard.press('Control+k')
  await expect(dialog(page)).toHaveCount(0)
  await page
    .getByRole('button', { name: 'Search documentation', exact: true })
    .focus()
  await page.evaluate(() =>
    document.activeElement!.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        isComposing: true,
        bubbles: true,
        cancelable: true,
      }),
    ),
  )
  await expect(dialog(page)).toHaveCount(0)
  await page.keyboard.press('Control+k')
  await expect(search(page)).toBeFocused()
  await search(page).press('Escape')
  await page.keyboard.press('Meta+k')
  await expect(search(page)).toBeFocused()
  await search(page).fill('button actions')
  await search(page).press('Enter')
  await expect(page).toHaveURL(/\/components\/button$/)
  await waitForCatalogReady(page)
  await page.keyboard.press('Control+k')
  await expect(dialog(page)).toHaveCount(0)
})

test('modal keyboard containment, result scrolling and 320px theme semantics', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await open(page)
  for (const dark of [false, true]) {
    if (dark) {
      await search(page).press('Escape')
      await page
        .getByRole('button', { name: 'Toggle theme: Light', exact: true })
        .click()
      await page
        .getByRole('button', { name: 'Search documentation', exact: true })
        .click()
    }
    await expect(dialog(page)).toHaveAttribute('aria-modal', 'true')
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab')
      await expect
        .poll(() =>
          dialog(page).evaluate((el) => el.contains(document.activeElement)),
        )
        .toBe(true)
    }
    await search(page).focus()
    for (let i = 0; i < 35; i++) await search(page).press('ArrowDown')
    const results = page.getByRole('region', {
      name: 'Command results',
      exact: true,
    })
    await expect
      .poll(() => results.evaluate((el) => el.scrollTop))
      .toBeGreaterThan(0)
    const activeId = await search(page).getAttribute('aria-activedescendant')
    expect(activeId).toBeTruthy()
    await expect(page.locator(`[id="${activeId}"]`)).toHaveRole('option')
    await expect
      .poll(() =>
        dialog(page).evaluate((el) => el.scrollWidth <= el.clientWidth),
      )
      .toBe(true)
    expect(
      (
        await new AxeBuilder({ page })
          .exclude('[data-base-ui-focus-guard]')
          .analyze()
      ).violations,
    ).toEqual([])
  }
})

test('a result sets its title over its description, its category at the row end', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await open(page)
  await search(page).fill('table')
  const option = dialog(page).getByRole('option').first()
  const [row, title, description, badge] = await Promise.all([
    option.boundingBox(),
    option.locator('.surf-combobox-item-title').boundingBox(),
    option.locator('.surf-combobox-item-description').boundingBox(),
    option.locator('.surf-badge').boundingBox(),
  ])
  expect(description!.y).toBeGreaterThanOrEqual(title!.y + title!.height)
  expect(badge!.x).toBeGreaterThan(description!.x + description!.width)
  expect(row!.x + row!.width - (badge!.x + badge!.width)).toBeLessThan(24)
  await expect(option.locator('.surf-combobox-item-title')).toHaveCSS(
    'font-weight',
    '500',
  )
})
