import { test, expect, type Page } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
const code = (page: Page, label: string) =>
  page.locator('.surf-code-block', {
    has: page.locator('.surf-code-label', { hasText: label }),
  })
const choose = (page: Page, name: string) =>
  page.getByRole('button', { name, exact: true }).click()
const file = async (page: Page, name: string) => {
  await page.getByRole('tab', { name, exact: true }).click()
  // The previous panel stays in the DOM while it fades out; pick this file's panel.
  return page.getByRole('tabpanel', { name, exact: true })
}
test('the install guide follows the chosen setup and keeps it in the address', async ({
  page,
}) => {
  await page.goto('/install')
  await waitForCatalogReady(page)
  await expect(code(page, 'Packages')).toContainText(
    'npm install @surflane/ui @surflane/design-tokens @surflane/css @base-ui/react',
  )
  // Without Tailwind CSS, the root module imports the one stylesheet entry.
  await expect(page.getByRole('tab')).toHaveText(['layout.tsx', 'page.tsx'])
  await expect(await file(page, 'layout.tsx')).toContainText(
    "import '@surflane/ui/all.css'",
  )
  await page.getByRole('button', { name: 'Start a new app' }).click()
  await expect(code(page, 'New app')).toContainText(
    'npx create-next-app@latest my-app --yes --no-tailwind',
  )
  await choose(page, 'Vite')
  await choose(page, 'pnpm')
  await page.getByRole('switch', { name: /Tailwind CSS v4/ }).click()
  await expect(page).toHaveURL(
    /\/install\?framework=vite&manager=pnpm&tailwind=1$/,
  )
  await expect(code(page, 'New app')).toContainText(
    'pnpm create vite my-app --template react-ts',
  )
  await expect(code(page, 'Packages')).toContainText(
    'tailwindcss @tailwindcss/vite',
  )
  await expect(page.getByRole('tab')).toHaveText([
    'vite.config.ts',
    'index.css',
    'main.tsx',
    'index.html',
    'App.tsx',
  ])
  await expect(await file(page, 'vite.config.ts')).toContainText(
    'tailwindcss()',
  )
  await expect(await file(page, 'index.css')).toContainText(
    "@import '@surflane/ui/all.css' layer(components);",
  )
  await page.getByRole('switch', { name: /Remember the theme/ }).click()
  await expect(await file(page, 'theme-switch.tsx')).toContainText(
    'transitionTheme',
  )
  await expect(await file(page, 'index.html')).toContainText(
    'document.documentElement.dataset.theme',
  )
  // A copied link opens the same setup.
  await page.reload()
  await waitForCatalogReady(page)
  await expect(
    page.getByRole('button', { name: 'Vite', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(
    page.getByRole('switch', { name: /Remember the theme/ }),
  ).toBeChecked()
  await expect(
    page.getByRole('tab', { name: 'theme-switch.tsx' }),
  ).toBeVisible()
})
test('extra components add their libraries, imports and the highlighting provider', async ({
  page,
}) => {
  await page.goto('/install')
  await waitForCatalogReady(page)
  await expect(code(page, 'Imports')).toHaveCount(0)
  await choose(page, 'Chart')
  await choose(page, 'Code highlighting')
  await expect(page).toHaveURL(/\/install\?extras=chart%2Chighlighting$/)
  await expect(code(page, 'Packages')).toContainText('recharts shiki')
  await expect(code(page, 'Imports')).toHaveText(
    /import \{ Chart \} from '@surflane\/ui\/chart'/,
  )
  await expect(await file(page, 'layout.tsx')).toContainText(
    '<SyntaxHighlighting>{children}</SyntaxHighlighting>',
  )
  await expect(await file(page, 'page.tsx')).toContainText('<CodeBlock')
  await choose(page, 'Chart')
  await expect(code(page, 'Imports')).toHaveCount(0)
  await expect(code(page, 'Packages')).not.toContainText('recharts')
})
test('each framework names its own files and theme setup', async ({ page }) => {
  await page.goto('/install?remember=1')
  await waitForCatalogReady(page)
  for (const [framework, tab, marker] of [
    ['Next.js', 'layout.tsx', 'suppressHydrationWarning'],
    ['React Router', 'root.tsx', 'useRouteLoaderData'],
    ['Astro', 'Layout.astro', 'is:inline'],
  ] as const) {
    await choose(page, framework)
    await expect(await file(page, tab)).toContainText(marker)
  }
  await expect(page.getByRole('tab', { name: 'index.astro' })).toBeVisible()
})
