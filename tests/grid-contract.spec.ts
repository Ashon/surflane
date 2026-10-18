import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { test, expect } from '@playwright/test'
import { Grid, GridItem } from '../packages/ui/dist/foundations.js'
import { Card } from '../packages/ui/dist/content.js'
import { waitForCatalogReady } from './catalog-ready'
test('nested equal-card grids own their column count and layout spans clamp to the active track count', async ({
  page,
}) => {
  await page.goto('/foundations/layout')
  await waitForCatalogReady(page)
  const markup = renderToStaticMarkup(
    React.createElement(
      Grid,
      { columns: 2, id: 'grid-parent' },
      React.createElement(
        Grid,
        { columns: 3, id: 'grid-child' },
        'One',
        'Two',
        'Three',
      ),
    ),
  )
  await page.locator('#main-content').evaluate((element, html) => {
    const fixture = document.createElement('div')
    fixture.innerHTML = html
    element.append(fixture)
  }, markup)
  await page.setViewportSize({ width: 1440, height: 1000 })
  expect(
    await page
      .locator('#grid-parent')
      .evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns.split(' ').length,
      ),
  ).toBe(2)
  expect(
    await page
      .locator('#grid-child')
      .evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns.split(' ').length,
      ),
  ).toBe(3)
  const spans = renderToStaticMarkup(
    React.createElement(
      Grid,
      { columns: 'layout', id: 'clamped-grid' },
      React.createElement(
        GridItem,
        { span: 12, id: 'clamped-child' },
        'Full span',
      ),
    ),
  )
  await page.locator('#main-content').evaluate((element, html) => {
    const fixture = document.createElement('div')
    fixture.innerHTML = html
    element.append(fixture)
  }, spans)
  for (const [width, span] of [
    [1440, 12],
    [1024, 6],
    [320, 4],
  ]) {
    await page.setViewportSize({ width, height: 1000 })
    await expect(page.locator('#clamped-child')).toHaveCSS(
      'grid-column-start',
      `span ${span}`,
    )
    expect(
      (await page.locator('#clamped-child').boundingBox())!.width,
    ).toBeCloseTo((await page.locator('#clamped-grid').boundingBox())!.width, 0)
  }
})

test('opt-in grid bleed aligns padded card content while nested and default grids retain their own edges', async ({
  page,
}) => {
  await page.goto('/foundations/layout')
  await waitForCatalogReady(page)
  const markup = renderToStaticMarkup(
    React.createElement(
      'div',
      { id: 'bleed-fixture', style: { padding: 24 } },
      React.createElement(
        'h2',
        { id: 'bleed-title', style: { margin: 0 } },
        'Aligned content',
      ),
      React.createElement(
        Grid,
        { columns: 2, gap: 4, bleed: 4, id: 'bleed-grid' },
        ...[1, 2].map((index) =>
          React.createElement(
            Card.Root,
            { padding: 4, key: index },
            React.createElement(Card.Title, null, `Card ${index}`),
            React.createElement(
              Card.Body,
              null,
              React.createElement(
                Grid,
                { columns: 1, id: `nested-${index}` },
                'Nested grid',
              ),
            ),
          ),
        ),
      ),
      React.createElement(
        Grid,
        { columns: 1, id: 'plain-grid' },
        'Plain layout',
      ),
    ),
  )
  await page.locator('#main-content').evaluate((el, html) => {
    const host = document.createElement('div')
    host.innerHTML = html
    el.append(host)
  }, markup)
  for (const width of [1440, 1024, 320]) {
    await page.setViewportSize({ width, height: 1000 })
    const title = (await page.locator('#bleed-title').boundingBox())!
    const text = (await page
      .locator('#bleed-grid .pui-card-title')
      .first()
      .boundingBox())!
    expect(text.x).toBeCloseTo(title.x, 1)
    const last = (await page
      .locator('#bleed-grid .pui-card-title')
      .last()
      .boundingBox())!
    expect(last.x + last.width).toBeCloseTo(title.x + title.width, 1)
    await expect(page.locator('#bleed-grid')).toHaveCSS('gap', '16px')
    await expect(page.locator('#nested-1')).toHaveCSS('margin-left', '0px')
    expect((await page.locator('#plain-grid').boundingBox())!.x).toBeCloseTo(
      title.x,
      1,
    )
  }
})
