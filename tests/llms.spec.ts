import { test, expect } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'
import { catalog, itemHref } from '../demo/catalog'
import { componentDocs } from '../demo/componentDocs'

test('llms.txt indexes every available page as Markdown and the footer links to it', async ({
  page,
  request,
}) => {
  const index = await (await request.get('/llms.txt')).text()
  expect(index.startsWith('# Surflane\n\n> ')).toBe(true)
  for (const item of catalog.filter(
    (item) => item.stage === 'available' && item.id !== 'tokens',
  )) {
    const href = `${itemHref(item)}.md`
    expect(index, item.id).toContain(`(https://surflane.page${href})`)
    // The dev server answers unknown paths with the app shell, so check the content.
    const markdown = await (await request.get(href)).text()
    expect(markdown.startsWith(`# ${item.name}\n`), href).toBe(true)
    const doc = componentDocs[item.id]
    if (doc) {
      expect(markdown, href).toContain('## Keyboard and accessibility')
      expect(markdown, href).toContain(doc.code.split('\n')[0])
    }
  }
  for (const [path, start] of [
    ['/llms-full.txt', '# Surflane'],
    ['/tokens.md', '# Design tokens'],
    ['/docs/frameworks.md', '#'],
    ['/design-tokens.json', '{'],
  ])
    expect(
      (await (await request.get(path)).text()).startsWith(start),
      path,
    ).toBe(true)
  await page.goto('/')
  await waitForCatalogReady(page)
  await expect(
    page
      .locator('.catalog-site-footer')
      .getByRole('link', { name: 'llms.txt', exact: true }),
  ).toHaveAttribute('href', '/llms.txt')
})
