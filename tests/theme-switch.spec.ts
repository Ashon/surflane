import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })

test('ThemeSwitch steps light, dark and system on its target, remembers it and follows the device', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/components/theme-switch')
  await waitForCatalogReady(page)
  const preview = page.locator('#preview').first()
  const frame = preview.locator('.surf-surface').first()
  const root = () => page.evaluate(() => document.documentElement.dataset.theme)
  const pageTheme = await root()
  // One button names the theme now and the one a press sets.
  const button = frame.getByRole('button', { name: /^Theme:/ })
  await expect(button).toHaveAccessibleName('Theme: System. Switch to Light')
  await button.click()
  await expect(button).toHaveAccessibleName('Theme: Light. Switch to Dark')
  await expect(frame).toHaveAttribute('data-theme', 'light')
  await expect(frame).toHaveAttribute('data-theme-mode', 'light')
  await button.click()
  await expect(frame).toHaveAttribute('data-theme', 'dark')
  // The target takes the theme; the page keeps its own.
  expect(await root()).toBe(pageTheme)
  // A reload keeps the choice under its persist key.
  await page.reload()
  await waitForCatalogReady(page)
  await expect(
    frame.getByRole('button', { name: 'Theme: Dark. Switch to System' }),
  ).toBeVisible()
  await expect(frame).toHaveAttribute('data-theme', 'dark')
  // System resolves by the device and follows it as it changes.
  await frame.getByRole('button', { name: /^Theme:/ }).click()
  await expect(frame).toHaveAttribute('data-theme-mode', 'system')
  await expect(frame).toHaveAttribute('data-theme', 'light')
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(frame).toHaveAttribute('data-theme', 'dark')
  await page.emulateMedia({ colorScheme: 'light' })
  await expect(frame).toHaveAttribute('data-theme', 'light')
})

test('ThemeSwitch group presses the chosen theme and keeps only icons where the names do not fit', async ({
  page,
}) => {
  await page.goto('/components/theme-switch')
  await waitForCatalogReady(page)
  const frame = page.locator('#preview .surf-surface').nth(1)
  const group = frame.getByRole('group', { name: 'Theme' })
  await expect(group.getByRole('button')).toHaveText([
    'Light',
    'Dark',
    'System',
  ])
  await group.getByRole('button', { name: 'Dark' }).click()
  await expect(group.getByRole('button', { name: 'Dark' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(frame).toHaveAttribute('data-theme', 'dark')
  const names = frame.locator('.surf-theme-switch-name')
  expect((await names.first().boundingBox())!.width).toBeGreaterThan(20)
  // Narrow, the names leave the screen and stay as the buttons' names.
  await frame
    .locator('.surf-theme-switch')
    .evaluate((element) => ((element as HTMLElement).style.width = '200px'))
  await expect
    .poll(async () => (await names.first().boundingBox())!.width)
    .toBeLessThanOrEqual(1)
  await expect(group.getByRole('button', { name: 'Dark' })).toBeVisible()
})

test('ThemeSwitch in an AppShell sidebar is a row that names the theme, and an icon on the rail', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/patterns/app-shell')
  await waitForCatalogReady(page)
  const sidebar = page.getByRole('complementary', {
    name: 'Example workspace sidebar',
  })
  const row = sidebar.getByRole('button', { name: /^Theme: System/ })
  await expect(row).toHaveText('Theme: System')
  await expect(row).toHaveClass(/surf-app-shell-link/)
  await row.click()
  await expect(page.locator('.app-shell-preview-clip')).toHaveAttribute(
    'data-theme',
    'light',
  )
  await sidebar
    .getByRole('button', { name: 'Collapse workspace sidebar' })
    .click()
  const rail = sidebar.getByRole('button', { name: /^Theme: Light/ })
  await rail.hover()
  await expect(page.locator('.surf-tooltip')).toHaveText('Theme: Light')
})

for (const theme of ['light', 'dark'])
  test(`ThemeSwitch passes automated accessibility in ${theme}`, async ({
    page,
  }) => {
    await page.goto('/components/theme-switch')
    await waitForCatalogReady(page)
    if (theme === 'dark')
      await page.getByRole('button', { name: 'Toggle theme' }).click()
    const { violations } = await new AxeBuilder({ page })
      .include('[data-preview-size]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    expect(violations).toEqual([])
  })
