import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Markdown } from '../packages/ui/dist/markdown.js'
import { InlineMessage, Prose } from '../packages/ui/dist/index.js'
import { catalog, itemHref } from '../demo/catalog'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
test('syntax tokens preserve source, language changes and safe fallback while theme colors update', async ({
  page,
}) => {
  await page.goto('/components/syntax-highlighter')
  await waitForCatalogReady(page)
  const code = page.locator('[data-preview-size] code.surf-syntax')
  await expect(code).toHaveAttribute('data-highlighted', 'true')
  const source =
    '\t// 한글 and English\nconst value = "<script>window.syntaxExecuted = true</script>";\n\n'
  await page
    .getByRole('textbox', { name: 'Source code', exact: true })
    .fill(source)
  await expect(code).toHaveText(source, { useInnerText: false })
  await expect(code).toHaveAttribute('data-highlighted', 'true')
  const color = await code
    .locator('[data-syntax="keyword"]')
    .first()
    .evaluate((el) => getComputedStyle(el).color)
  await page.getByRole('button', { name: /Toggle theme/ }).click()
  await expect
    .poll(() =>
      code
        .locator('[data-syntax="keyword"]')
        .first()
        .evaluate((el) => getComputedStyle(el).color),
    )
    .not.toBe(color)
  expect(
    await page.evaluate(
      () => (window as unknown as Record<string, unknown>).syntaxExecuted,
    ),
  ).toBeUndefined()
  await page
    .getByRole('combobox', { name: 'Source language', exact: true })
    .click()
  await page
    .getByRole('option', { name: 'Unsupported / plain fallback', exact: true })
    .click()
  await expect(code).toHaveAttribute('data-highlighted', 'false')
  await expect(code).toContainText('never executes')
  await page
    .getByRole('combobox', { name: 'Source language', exact: true })
    .click()
  await page.getByRole('option', { name: 'JSON', exact: true }).click()
  await expect(code).toHaveAttribute('data-language', 'json')
  await expect(code).toHaveAttribute('data-highlighted', 'true')
})

test('Markdown composes GFM, scoped headings, independent code copy and safe URLs without executable HTML', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/components/markdown')
  await waitForCatalogReady(page)
  const article = page.getByRole('article', {
    name: 'Markdown preview',
    exact: true,
  })
  await expect(
    article.getByRole('heading', { name: 'Deployment', exact: true }),
  ).toHaveAttribute('id', /md-.+-deployment/)
  await expect(article.getByRole('table')).toHaveCount(1)
  await expect(article.getByRole('checkbox')).toHaveCount(2)
  for (const checkbox of await article.getByRole('checkbox').all())
    await expect(checkbox).toBeDisabled()
  const anchor = await article
    .getByRole('link', { name: 'Results', exact: true })
    .getAttribute('href')
  expect(await page.locator(anchor!).count()).toBe(1)
  await expect(article.locator('code[data-language="tsx"]')).toHaveAttribute(
    'data-highlighted',
    'true',
  )
  await article
    .getByRole('button', { name: 'Copy code', exact: true })
    .first()
    .click()
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain('import { Button }')
  await page
    .getByRole('button', { name: 'Compare two instances', exact: true })
    .click()
  expect(
    await page
      .locator('.surf-markdown [id]')
      .evaluateAll(
        (elements) =>
          new Set(elements.map((el) => el.id)).size === elements.length,
      ),
  ).toBe(true)
  expect(
    await page
      .locator('.surf-markdown [aria-describedby]')
      .evaluateAll((elements) =>
        elements.every((el) =>
          el
            .getAttribute('aria-describedby')!
            .split(/\s+/)
            .every((id) => document.getElementById(id)),
        ),
      ),
  ).toBe(true)
  await page
    .getByRole('textbox', { name: 'Markdown source', exact: true })
    .fill(
      '# Safe\n\n<script>window.markdownExecuted = true</script>\n\n[Unsafe](javascript:alert(1))\n\n<img src=x onerror="window.markdownExecuted = true">\n\n```html\n<script>literal source</script>\n```',
    )
  await expect(
    article.getByRole('heading', { name: 'Safe', exact: true }),
  ).toBeVisible()
  await expect(article.locator('script,iframe,img[onerror]')).toHaveCount(0)
  await expect(
    article.getByRole('link', { name: 'Unsafe', exact: true }),
  ).toHaveCount(0)
  expect(
    await page.evaluate(
      () => (window as unknown as Record<string, unknown>).markdownExecuted,
    ),
  ).toBeUndefined()
  await expect(article.locator('code[data-language="html"]')).toHaveAttribute(
    'data-highlighted',
    'true',
  )
  await expect(article.locator('code[data-language="html"]')).toContainText(
    '<script>literal source</script>',
  )
})

test('Markdown text keeps the reading measure while tables use the full width', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/components/markdown')
  await waitForCatalogReady(page)
  const html = renderToStaticMarkup(
    React.createElement(Markdown, {
      label: 'Measure fixture',
      source: [
        'Deploy every service through the same pipeline, so each release follows one reviewed path from build to production and nothing skips a check on the way.',
        '',
        '- Review the plan and confirm who can deploy before the window opens for the team.',
        '',
        '| Service | Owner | Region | Status | Updated |',
        '| --- | --- | --- | --- | --- |',
        '| platform-api | Platform | ap-northeast-2 | Healthy | 2026-10-22 |',
      ].join('\n'),
    }),
  )
  // Prose with sections and a component inside, as documentation pages compose it.
  const prose = renderToStaticMarkup(
    React.createElement(
      Prose,
      { id: 'prose-fixture' },
      React.createElement(
        'section',
        null,
        React.createElement(
          'p',
          { id: 'prose-text' },
          'Section text. '.repeat(20),
        ),
      ),
      React.createElement(
        InlineMessage.Root,
        null,
        React.createElement(
          InlineMessage.Content,
          null,
          React.createElement(
            InlineMessage.Description,
            { id: 'prose-message' },
            'Message text. '.repeat(20),
          ),
        ),
      ),
    ),
  )
  await page.locator('#main-content').evaluate((el, html) => {
    const fixture = document.createElement('div')
    fixture.style.inlineSize = '900px'
    fixture.innerHTML = html
    el.append(fixture)
  }, html + prose)
  const measure = await page
    .locator('#prose-text')
    .evaluate((el) => parseFloat(getComputedStyle(el).maxInlineSize))
  expect((await page.locator('#prose-text').boundingBox())!.width).toBeCloseTo(
    measure,
    0,
  )
  expect(
    await page
      .locator('#prose-message')
      .evaluate((el) => getComputedStyle(el).maxInlineSize),
  ).toBe('none')
  const layout = await page
    .getByRole('article', { name: 'Measure fixture', exact: true })
    .evaluate((root) => ({
      article: root.getBoundingClientRect().width,
      text: [...root.querySelectorAll(':scope > :is(p, ul)')].map((el) => {
        const style = getComputedStyle(el)
        return {
          width: el.getBoundingClientRect().width,
          measure: parseFloat(style.maxInlineSize),
          type: `${style.fontSize}/${style.lineHeight}`,
        }
      }),
      table: root
        .querySelector('.surf-table')!
        .closest('.surf-scroll-root')!
        .getBoundingClientRect().width,
    }))
  expect(layout.text).toHaveLength(2)
  for (const block of layout.text) {
    expect(block.width).toBeCloseTo(block.measure, 0)
    expect(block.type).toBe('16px/28px')
  }
  expect(layout.article).toBeGreaterThan(layout.text[0].measure)
  expect(layout.table).toBeCloseTo(layout.article, 0)
})

test('every site code block selects a real grammar and keeps the original copyable source', async ({
  page,
}) => {
  test.setTimeout(240000)
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  for (const item of catalog) {
    await page.goto(itemHref(item))
    await waitForCatalogReady(page)
    for (const code of await page
      .locator('code.surf-syntax:not([data-language="text"])')
      .all()) {
      await expect(code, item.id).toHaveAttribute('data-highlighted', 'true')
      expect((await code.textContent())?.length, item.id).toBeGreaterThan(0)
    }
  }
  expect(errors).toEqual([])
})

for (const width of [1440, 320])
  for (const theme of ['light', 'dark'])
    test(`rich content remains accessible, readable and locally scrollable at ${width}px ${theme}`, async ({
      page,
      context,
    }) => {
      await context.addCookies([
        {
          name: 'surflane-theme',
          value: theme,
          url: 'http://127.0.0.1:8066/',
        },
      ])
      await page.setViewportSize({ width, height: 1000 })
      for (const id of ['syntax-highlighter', 'markdown']) {
        await page.goto(`/components/${id}`)
        await waitForCatalogReady(page)
        await expect(
          page.locator('[data-preview-size] code.surf-syntax').first(),
        ).toHaveAttribute('data-highlighted', 'true')
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true)
        expect(
          (
            await new AxeBuilder({ page })
              .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
              .analyze()
          ).violations,
        ).toEqual([])
      }
      await page.emulateMedia({ forcedColors: 'active' })
      expect(
        await page
          .locator('[data-preview-size] .surf-syntax [data-syntax]')
          .first()
          .evaluate((el) => getComputedStyle(el).color),
      ).toBe(
        await page.evaluate(() => {
          const element = document.createElement('span')
          element.style.color = 'CanvasText'
          document.body.append(element)
          const color = getComputedStyle(element).color
          element.remove()
          return color
        }),
      )
    })

test('the Markdown editor is an embedded Textarea: no edge of its own, a ring inside it on focus', async ({
  page,
}) => {
  await page.goto('/components/markdown')
  await waitForCatalogReady(page)
  const editor = page.getByRole('textbox', { name: 'Markdown source' })
  await expect(editor).toHaveAttribute('data-variant', 'embedded')
  await expect(editor).toHaveCSS('border-top-width', '0px')
  await expect(editor).toHaveCSS('resize', 'none')
  await editor.focus()
  const ring = await editor.evaluate((el) => getComputedStyle(el).boxShadow)
  expect(ring).toContain('inset')
  expect(ring).toMatch(/0px 0px 0px 2px/)
})
