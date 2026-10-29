import { test, expect } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'

for (const width of [1440, 320]) {
  test(`Markdown workbench preserves edits between views at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/components/markdown')
    await waitForCatalogReady(page)
    const editor = page.getByRole('textbox', {
      name: 'Markdown source',
      exact: true,
    })
    const article = page.getByRole('article', {
      name: 'Markdown preview',
      exact: true,
    })
    const sourceBox = await editor.boundingBox()
    const previewBox = await page
      .locator('.markdown-preview-pane')
      .boundingBox()
    expect(sourceBox).toBeTruthy()
    expect(previewBox).toBeTruthy()
    if (width === 1440)
      expect(previewBox!.x).toBeGreaterThan(sourceBox!.x + sourceBox!.width - 1)
    else
      expect(previewBox!.y).toBeGreaterThan(
        sourceBox!.y + sourceBox!.height - 1,
      )
    await editor.fill('# Local draft\n\nEdited **live** result.')
    await expect(
      article.getByRole('heading', { name: 'Local draft' }),
    ).toBeVisible()
    const views = page.getByRole('group', { name: 'Markdown view' })
    await views.getByRole('button', { name: 'Preview', exact: true }).click()
    await expect(editor).toBeHidden()
    await expect(article).toBeVisible()
    await views.getByRole('button', { name: 'Source', exact: true }).click()
    await expect(article).toBeHidden()
    await expect(editor).toHaveValue('# Local draft\n\nEdited **live** result.')
    await views.getByRole('button', { name: 'Side by side' }).click()
    await expect(article).toBeVisible()
    await expect(
      views.getByRole('button', { name: 'Side by side' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('.markdown-preview-scroll')).toHaveCSS(
      'overflow-y',
      'auto',
    )
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    await page.getByRole('button', { name: 'Restore Markdown example' }).click()
    await expect(editor).toContainText('Deployment')
  })
}

test('a mono Textarea sets its source in the code role, and a mono Input keeps the control size', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/components/markdown')
  await waitForCatalogReady(page)
  const editor = page.getByRole('textbox', {
    name: 'Markdown source',
    exact: true,
  })
  const role = await page.evaluate(() => {
    const probe = document.createElement('code')
    probe.style.fontSize = 'var(--surf-type-code-size)'
    probe.style.fontFamily = 'var(--surf-font-code)'
    document.body.append(probe)
    const style = getComputedStyle(probe)
    const role = { size: style.fontSize, face: style.fontFamily }
    probe.remove()
    return role
  })
  await expect(editor).toHaveCSS('font-size', role.size)
  expect(await editor.evaluate((el) => getComputedStyle(el).fontFamily)).toBe(
    role.face,
  )
  // A one-line mono field keeps the control's size beside the fields around it.
  const sizes = await page.evaluate(() => {
    const host = document.querySelector('#main-content')!
    host.insertAdjacentHTML(
      'beforeend',
      '<span class="surf-control"><input id="zz-mono" class="surf-input" data-mono="true"></span><span class="surf-control"><input id="zz-plain" class="surf-input"></span>',
    )
    const size = (id: string) =>
      getComputedStyle(document.getElementById(id)!).fontSize
    return [size('zz-mono'), size('zz-plain')]
  })
  expect(sizes[0]).toBe(sizes[1])
})
