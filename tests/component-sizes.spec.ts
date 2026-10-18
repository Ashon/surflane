import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  SizeProvider,
  Button,
  Input,
  Textarea,
  Card,
  Badge,
  Spinner,
  Avatar,
} from '../packages/ui/dist/index.js'
import { components } from '../demo/catalog'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })
const values = ['small', 'default', 'large'] as const
const labels = { small: 'Small', default: 'Default', large: 'Large' }
async function choose(page: Page, size: (typeof values)[number]) {
  await page
    .getByRole('button', { name: `Preview size: ${labels[size]}`, exact: true })
    .click()
  await expect(page.locator('[data-preview-size]')).toHaveAttribute(
    'data-preview-size',
    size,
  )
}
async function open(page: Page, id: string) {
  await page.goto(`/components/${id}`)
  await waitForCatalogReady(page)
}

test('all component pages expose the three schemes without route or console errors', async ({
  page,
}) => {
  test.setTimeout(180000)
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  for (const item of components) {
    await open(page, item.id)
    await expect(
      page.getByRole('group', { name: 'Component preview size', exact: true }),
    ).toBeVisible()
    for (const size of ['small', 'large', 'default'] as const) {
      await choose(page, size)
      expect(
        await page
          .locator('[data-preview-size] > [data-ui-size]')
          .getAttribute('data-ui-size'),
        item.id,
      ).toBe(size)
    }
  }
  expect(errors).toEqual([])
})

test('input dimensions change while data, native numeric size and nested explicit overrides remain intact', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await open(page, 'input')
  const field = page.getByRole('textbox', { name: 'Name', exact: true })
  await field.fill('Preserved draft')
  const railHeight = (await page
    .getByRole('button', { name: /Toggle theme/ })
    .boundingBox())!.height
  for (const [i, size] of values.entries()) {
    await choose(page, size)
    await expect(field).toHaveValue('Preserved draft')
    expect((await field.boundingBox())!.height).toBe([32, 36, 44][i])
    expect(
      (await page.getByRole('button', { name: /Toggle theme/ }).boundingBox())!
        .height,
    ).toBe(railHeight)
  }
  const html = renderToStaticMarkup(
    React.createElement(SizeProvider, {
      size: 'large',
      children: [
        React.createElement(Button, { id: 'inherited', key: 'a' }, 'Inherited'),
        React.createElement(
          Button,
          { id: 'explicit', key: 'b', size: 'small' },
          'Explicit',
        ),
        React.createElement(SizeProvider, {
          key: 'c',
          size: 'default',
          children: React.createElement(Input, {
            id: 'nested',
            size: 24,
            'aria-label': 'Native width hint',
          }),
        }),
        React.createElement(Textarea, {
          key: 'd',
          id: 'explicit-area',
          size: 'small',
          'aria-label': 'Small notes',
        }),
        React.createElement(
          Card.Root,
          { key: 'e', id: 'padded', padding: 2 },
          'Explicit padding',
        ),
        React.createElement(
          Badge,
          { key: 'f', id: 'badge', size: 'small' },
          'Available',
        ),
        React.createElement(Spinner, {
          key: 'g',
          id: 'spinner',
          size: 'large',
          label: 'Large spinner',
        }),
        React.createElement(
          Avatar.Root,
          { key: 'h', id: 'avatar', size: 'small' },
          'JL',
        ),
      ],
    }),
  )
  await page.locator('#main-content').evaluate((el, html) => {
    const fixture = document.createElement('div')
    fixture.innerHTML = html
    el.append(fixture)
  }, html)
  expect((await page.locator('#inherited').boundingBox())!.height).toBe(44)
  expect((await page.locator('#explicit').boundingBox())!.height).toBe(32)
  expect((await page.locator('#nested').boundingBox())!.height).toBe(36)
  await expect(page.locator('#nested')).toHaveAttribute('size', '24')
  expect((await page.locator('#explicit-area').boundingBox())!.height).toBe(80)
  expect(
    await page
      .locator('#padded')
      .evaluate((el) => getComputedStyle(el).padding),
  ).toBe('8px')
  expect((await page.locator('#badge').boundingBox())!.height).toBe(22)
  expect((await page.locator('#spinner').boundingBox())!.height).toBe(28)
  expect((await page.locator('#avatar').boundingBox())!.height).toBe(24)
})

test('select, popover and dialog portal contents retain size and keyboard behavior', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await open(page, 'select')
  for (const [i, size] of values.entries()) {
    await choose(page, size)
    const trigger = page.getByRole('combobox', {
      name: 'Environment',
      exact: true,
    })
    await trigger.click()
    const popup = page.locator('.pui-select-popup')
    await expect(popup).toHaveAttribute('data-ui-size', size)
    expect(
      (await page
        .getByRole('option', { name: 'Staging', exact: true })
        .boundingBox())!.height,
    ).toBe([32, 36, 44][i])
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
  }
  await open(page, 'popover')
  await choose(page, 'large')
  await page
    .getByRole('button', { name: 'Inspect account', exact: true })
    .click()
  await expect(page.locator('.pui-popover')).toHaveAttribute(
    'data-ui-size',
    'large',
  )
  expect(
    await page
      .locator('.pui-popover')
      .evaluate((el) => getComputedStyle(el).padding),
  ).toBe('24px')
  expect(
    (await page.getByRole('textbox', { name: 'Nickname' }).boundingBox())!
      .height,
  ).toBe(44)
  await page.keyboard.press('Escape')
  await open(page, 'dialog')
  await choose(page, 'small')
  await page
    .getByRole('button', { name: 'Open deployment plan', exact: true })
    .click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toHaveAttribute('data-ui-size', 'small')
  expect((await dialog.getByRole('combobox').boundingBox())!.height).toBe(32)
  await page.keyboard.press('Escape')
  await expect(
    page.getByRole('button', { name: 'Open deployment plan', exact: true }),
  ).toBeFocused()
})

test('tree virtual rows recompute with size and preserve expansion and selection', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await open(page, 'tree')
  const tree = page.getByRole('tree', {
    name: 'Resource hierarchy',
    exact: true,
  })
  const first = tree.getByRole('treeitem', { name: 'Projects', exact: true })
  await first.focus()
  await first.press('Space')
  for (const [i, size] of values.entries()) {
    await choose(page, size)
    await expect(first).toHaveAttribute('aria-selected', 'true')
    await expect(first).toHaveAttribute('aria-expanded', 'true')
    expect((await first.boundingBox())!.height).toBe([36, 44, 52][i])
    const second = tree.getByRole('treeitem').nth(1)
    expect(
      (await second.boundingBox())!.y - (await first.boundingBox())!.y,
    ).toBe([36, 44, 52][i])
  }
})

for (const width of [1440, 320])
  for (const theme of ['light', 'dark']) {
    test(`size comparison and input states fit ${width}px ${theme}, including forced colors`, async ({
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
      await page.goto('/foundations/layout#component-sizes')
      await waitForCatalogReady(page)
      for (const [i, size] of values.entries()) {
        const sample = page.locator(`[data-size-specimen="${size}"]`)
        expect(
          (await sample
            .getByRole('textbox', { name: 'Project name', exact: true })
            .boundingBox())!.height,
        ).toBe(width === 320 ? 44 : [32, 36, 44][i])
        const icon = sample.getByRole('button', {
          name: `${labels[size]} add item`,
          exact: true,
        })
        const rect = (await icon.boundingBox())!
        expect(rect.width).toBe(rect.height)
        const radio = sample.getByRole('button', {
          name: 'Open size menu',
          exact: true,
        })
        await radio.click()
        const menu = page.getByRole('menu')
        await expect(menu).toHaveAttribute('data-ui-size', size)
        expect(
          (await menu.getByRole('menuitem').first().boundingBox())!.height,
        ).toBe(width === 320 ? 44 : [32, 36, 44][i])
        await page.keyboard.press('Escape')
      }
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
      await page.emulateMedia({ forcedColors: 'active' })
      const badge = page.locator('[data-size-specimen="small"] .pui-badge')
      expect((await badge.boundingBox())!.height).toBe(22)
      await page.screenshot({
        path: `.data/component-sizes-${width}-${theme}.png`,
        fullPage: true,
      })
    })
  }

test('existing default gauge, upload and list insets keep their role-specific baseline', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  for (const [id, selector, property, expected] of [
    ['progress', '.pui-gauge-track', 'height', [6, 8, 10]],
    ['file-upload', '.pui-file-dropzone', 'paddingTop', [12, 20, 28]],
    ['list', '.pui-list-item', 'paddingTop', [8, 12, 16]],
  ] as const) {
    await open(page, id)
    for (const [index, size] of values.entries()) {
      await choose(page, size)
      const actual = await page
        .locator(`[data-preview-size] ${selector}`)
        .first()
        .evaluate(
          (el, property) => parseFloat(getComputedStyle(el)[property]),
          property,
        )
      expect(actual, `${id}: ${size}`).toBe(expected[index])
    }
  }
})
