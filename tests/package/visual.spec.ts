import { test, expect } from '@playwright/test'

// Each section of the SSR fixture, which covers every public component, in both themes.
// Fonts render differently on each OS, so the baselines are Linux only.
const sections = [
  'foundations',
  'controls',
  'commands',
  'overlays',
  'disclosure',
  'feedback',
  'data',
  'content',
  'highlighted',
  'shell',
  'monitoring',
]

test.skip(
  process.platform !== 'linux',
  'Baselines are rendered in the Playwright Linux image: npm run test:visual',
)

for (const theme of ['light', 'dark'])
  for (const section of sections)
    test(`${section} in the ${theme} theme matches its baseline`, async ({
      page,
    }) => {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text())
      })
      await page.goto(`/?section=${section}&theme=${theme}`)
      await expect(page.locator(`[data-ssr='${section}']`)).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      if (section === 'data') {
        await expect(page.locator('.recharts-surface')).toHaveCount(2)
        await expect(page.getByRole('treeitem').first()).toBeVisible()
      }
      if (section === 'highlighted')
        await expect(
          page.locator('[data-syntax="keyword"]').first(),
        ).toBeVisible()
      await expect(page).toHaveScreenshot(`${section}-${theme}.png`, {
        fullPage: true,
      })
      expect(errors).toEqual([])
    })
