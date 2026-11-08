import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { test, expect, type Locator, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { Grid } from '../packages/ui/dist/layout.js'
import { Avatar } from '../packages/ui/dist/avatar.js'
import { waitForCatalogReady } from './catalog-ready'

const mount = (page: Page, markup: string) =>
  page.locator('#main-content').evaluate((element, html) => {
    const fixture = document.createElement('div')
    fixture.innerHTML = html
    element.append(fixture)
  }, markup)

// The card's action stretches over its parts, so a pointer on a part lands on the
// action: press where the part is drawn, as a person would.
const pointAt = async (locator: Locator) => {
  await locator.scrollIntoViewIfNeeded()
  const box = (await locator.boundingBox())!
  return [box.x + box.width / 2, box.y + box.height / 2] as const
}

const cells = (n: number) =>
  Array.from({ length: n }, (_, i) => React.createElement('div', { key: i }, i))

test('an auto Grid fits as many columns as its own width holds, each at least its minimum', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/foundations/layout')
  await waitForCatalogReady(page)
  const grids = (['tile', 'card', 'wide', undefined] as const).flatMap((min) =>
    [300, 700, 1000].map((width) =>
      React.createElement(
        'div',
        { key: `${min}-${width}`, style: { width } },
        React.createElement(
          Grid,
          {
            columns: 'auto',
            min,
            'data-auto-grid': `${min ?? 'default'}-${width}`,
          },
          ...cells(8),
        ),
      ),
    ),
  )
  await mount(
    page,
    renderToStaticMarkup(React.createElement('div', null, ...grids)),
  )
  const measured = await page.locator('[data-auto-grid]').evaluateAll((els) =>
    els.map((el) => {
      const style = getComputedStyle(el)
      const tracks = style.gridTemplateColumns.split(' ').map(parseFloat)
      const probe = document.createElement('div')
      probe.style.width = 'var(--surf-grid-column-min)'
      el.append(probe)
      const min = probe.getBoundingClientRect().width
      probe.remove()
      return {
        name: el.getAttribute('data-auto-grid'),
        width: el.getBoundingClientRect().width,
        gap: parseFloat(style.columnGap),
        min,
        tracks,
      }
    }),
  )
  const rem = 16
  const minimum = { tile: 10, card: 20, wide: 30, default: 20 }
  for (const grid of measured) {
    const kind = grid.name!.split('-')[0] as keyof typeof minimum
    expect(grid.min, grid.name!).toBe(minimum[kind] * rem)
    const fit = Math.max(
      1,
      Math.floor((grid.width + grid.gap) / (grid.min + grid.gap)),
    )
    expect(grid.tracks.length, grid.name!).toBe(fit)
    // Every column is at least the minimum, unless the grid is narrower than one.
    for (const track of grid.tracks)
      expect(track, grid.name!).toBeGreaterThanOrEqual(
        Math.min(grid.min, grid.width) - 0.5,
      )
  }
})

test("compact density sets an auto Grid's gap to the density gap, and an explicit gap still wins", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/foundations/layout')
  await waitForCatalogReady(page)
  await mount(
    page,
    renderToStaticMarkup(
      React.createElement(
        'div',
        { 'data-ui-density': 'compact' },
        React.createElement(
          Grid,
          { columns: 'auto', id: 'compact-auto' },
          ...cells(3),
        ),
        React.createElement(
          Grid,
          { columns: 3, id: 'compact-fixed' },
          ...cells(3),
        ),
        React.createElement(
          Grid,
          { columns: 'auto', gap: 2, id: 'compact-explicit' },
          ...cells(3),
        ),
      ),
    ),
  )
  const gap = (id: string) =>
    page.locator(`#${id}`).evaluate((el) => getComputedStyle(el).columnGap)
  expect(await gap('compact-auto')).toBe('12px')
  expect(await gap('compact-fixed')).toBe('12px')
  expect(await gap('compact-explicit')).toBe('8px')
})

test.describe('the collection example', () => {
  test.use({ reducedMotion: 'reduce' })
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto('/foundations/layout#collections')
    await waitForCatalogReady(page)
  })

  test('cards in a row line up their parts, and the varying text takes two lines', async ({
    page,
  }) => {
    const cards = await page.getByTestId('collection-card').evaluateAll((els) =>
      els.map((card) => {
        const box = (selector: string) =>
          card.querySelector(selector)!.getBoundingClientRect()
        const text = card.querySelector('.surf-card-body .surf-text')!
        return {
          top: Math.round(card.getBoundingClientRect().top),
          bottom: Math.round(card.getBoundingClientRect().bottom),
          body: Math.round(box('.surf-card-body').top),
          footer: Math.round(box('.surf-card-footer').top),
          footerBottom: Math.round(box('.surf-card-footer').bottom),
          meter: Math.round(box('.surf-meter').width),
          footerWidth: Math.round(box('.surf-card-footer').width),
          textHeight: text.getBoundingClientRect().height,
          lineHeight: parseFloat(getComputedStyle(text).lineHeight),
          padding: getComputedStyle(card).paddingTop,
        }
      }),
    )
    expect(cards.length).toBeGreaterThanOrEqual(4)
    const rows = new Map<number, typeof cards>()
    for (const card of cards)
      rows.set(card.top, [...(rows.get(card.top) ?? []), card])
    expect([...rows.values()].some((row) => row.length > 1)).toBe(true)
    for (const row of rows.values()) {
      expect(new Set(row.map((card) => card.body)).size).toBe(1)
      expect(new Set(row.map((card) => card.footer)).size).toBe(1)
      expect(new Set(row.map((card) => card.bottom)).size).toBe(1)
    }
    for (const card of cards) {
      // Compact density: 12px inside, the footer at the bottom of the card.
      expect(card.padding).toBe('12px')
      expect(card.bottom - card.footerBottom).toBe(12)
      // The meter takes the footer's whole line.
      expect(card.meter).toBe(card.footerWidth)
      expect(card.textHeight).toBeLessThanOrEqual(card.lineHeight * 2 + 0.5)
    }
  })

  test('the whole card opens its sheet, and focus comes back to the card', async ({
    page,
  }) => {
    const card = page.getByTestId('collection-card').nth(1)
    const action = card.getByRole('button', { name: 'billing-worker' })
    const body = await pointAt(card.locator('.surf-card-body'))
    await page.mouse.move(...body)
    expect(
      await card.evaluate((el) => getComputedStyle(el).backgroundImage),
    ).toContain('gradient')
    await page.mouse.click(...body)
    const sheet = page.getByRole('dialog', { name: 'billing-worker' })
    await expect(sheet).toBeVisible()
    await expect(
      sheet.getByRole('list', { name: 'Recent turns' }),
    ).toBeVisible()
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    await page.keyboard.press('Escape')
    await expect(sheet).toBeHidden()
    await expect(action).toBeFocused()
    // From the keyboard, the action is the card's one stop and the ring draws on the card.
    await page.keyboard.press('Tab')
    const next = page
      .getByTestId('collection-card')
      .nth(2)
      .getByRole('button', { name: 'docs-site' })
    await expect(next).toBeFocused()
    expect(
      await page
        .getByTestId('collection-card')
        .nth(2)
        .evaluate((el) => getComputedStyle(el).outlineStyle),
    ).toBe('solid')
    await page.keyboard.press('Enter')
    await expect(page.getByRole('dialog', { name: 'docs-site' })).toBeVisible()
  })

  test('the example passes axe', async ({ page }) => {
    expect(
      (
        await new AxeBuilder({ page })
          .include('[data-testid="collection-example"]')
          .analyze()
      ).violations,
    ).toEqual([])
  })

  test('the whole text stays in the card, and the sheet shows it unclamped', async ({
    page,
  }) => {
    const message =
      'Running the Playwright suite after the card footer change: 212 of 640 tests done, none failed so far.'
    const card = page.getByTestId('collection-card').first()
    await expect(card.locator('.surf-card-body')).toHaveText(message)
    await card.getByRole('button', { name: 'platform-api' }).click()
    const description = page
      .getByRole('dialog', { name: 'platform-api' })
      .locator('.surf-panel-description')
    await expect(description).toHaveText(message)
    expect(
      await description.evaluate((el) => getComputedStyle(el).webkitLineClamp),
    ).toBe('none')
  })
})

test('a card action leaves the other controls on the card their own actions', async ({
  page,
}) => {
  await page.goto('/components/card')
  await waitForCatalogReady(page)
  const status = page.locator('#preview [role="status"]').first()
  await page.getByRole('button', { name: 'Sync', exact: true }).click()
  await expect(status).toHaveText(
    'Sync started for DEMO staging. No remote action ran.',
  )
  await page.mouse.click(
    ...(await pointAt(
      page.getByText(
        'The whole card opens the environment; Sync keeps its own action.',
      ),
    )),
  )
  await expect(status).toHaveText('DEMO staging opened. No remote action ran.')
})

test('a small Stat takes the subsection role for its value and the caption role around it', async ({
  page,
}) => {
  await page.goto('/components/stat')
  await waitForCatalogReady(page)
  const sizes = await page
    .getByRole('group', { name: 'Session counts' })
    .evaluate((group) => {
      const probe = (role: string) => {
        const el = document.createElement('span')
        el.style.fontSize = `var(--surf-type-${role}-size)`
        group.append(el)
        const size = getComputedStyle(el).fontSize
        el.remove()
        return size
      }
      return {
        value: getComputedStyle(group.querySelector('.surf-stat-value')!)
          .fontSize,
        label: getComputedStyle(group.querySelector('.surf-stat-label')!)
          .fontSize,
        groupLabel: getComputedStyle(
          group.querySelector('.surf-stat-group-label')!,
        ).fontSize,
        subsection: probe('subsection'),
        caption: probe('caption'),
      }
    })
  expect(sizes.value).toBe(sizes.subsection)
  expect(sizes.label).toBe(sizes.caption)
  expect(sizes.groupLabel).toBe(sizes.caption)
})

test.describe('avatar categories and status', () => {
  test('ink on every category tint passes 4.5:1 in both themes', async ({
    page,
  }) => {
    await page.goto('/components/avatar')
    await waitForCatalogReady(page)
    await mount(
      page,
      renderToStaticMarkup(
        React.createElement(
          'div',
          { id: 'category-avatars' },
          ...Array.from({ length: 12 }, (_, i) =>
            React.createElement(
              Avatar.Root,
              { key: i, category: (i + 1) as 1 },
              React.createElement(
                'span',
                { className: 'surf-avatar-fallback' },
                'AB',
              ),
            ),
          ),
        ),
      ),
    )
    for (const theme of ['light', 'dark']) {
      await page.evaluate((value) => {
        document.documentElement.dataset.theme = value
      }, theme)
      const ratios = await page
        .locator('#category-avatars .surf-avatar')
        .evaluateAll((els) => {
          const canvas = document.createElement('canvas')
          canvas.width = canvas.height = 1
          const context = canvas.getContext('2d', { willReadFrequently: true })!
          const rgb = (color: string) => {
            context.clearRect(0, 0, 1, 1)
            context.fillStyle = color
            context.fillRect(0, 0, 1, 1)
            return [...context.getImageData(0, 0, 1, 1).data].slice(0, 3)
          }
          const luminance = (color: string) => {
            const [r, g, b] = rgb(color).map((v) => {
              const c = v / 255
              return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
            })
            return 0.2126 * r + 0.7152 * g + 0.0722 * b
          }
          return els.map((el) => {
            const style = getComputedStyle(el)
            const [a, b] = [
              luminance(style.color),
              luminance(style.backgroundColor),
            ].sort((x, y) => y - x)
            return {
              category: el.getAttribute('data-category'),
              ratio: (a + 0.05) / (b + 0.05),
            }
          })
        })
      expect(ratios).toHaveLength(12)
      for (const { category, ratio } of ratios)
        expect(ratio, `${theme} category ${category}`).toBeGreaterThanOrEqual(
          4.5,
        )
    }
  })

  test('the status marker takes its tone, and live pulses it unless motion is reduced', async ({
    page,
  }) => {
    await page.goto('/components/avatar')
    await waitForCatalogReady(page)
    await mount(
      page,
      renderToStaticMarkup(
        React.createElement(
          'div',
          { id: 'status-avatars' },
          ...(['success', 'danger', 'caution', 'progress'] as const).map(
            (tone) =>
              React.createElement(
                Avatar.Root,
                { key: tone },
                React.createElement(Avatar.Status, {
                  tone,
                  live: tone === 'progress',
                }),
              ),
          ),
        ),
      ),
    )
    const markers = () =>
      page.locator('#status-avatars .surf-avatar-status').evaluateAll((els) =>
        els.map((el) => {
          const probe = document.createElement('span')
          const tone = el.getAttribute('data-tone')!
          probe.style.color = `var(--surf-status-${tone}-fg)`
          el.parentElement!.append(probe)
          const expected = getComputedStyle(probe).color
          probe.remove()
          return {
            tone,
            hidden: el.getAttribute('aria-hidden'),
            background: getComputedStyle(el).backgroundColor,
            expected,
            animation: getComputedStyle(el).animationName,
          }
        }),
      )
    for (const marker of await markers()) {
      expect(marker.hidden).toBe('true')
      expect(marker.background, marker.tone).toBe(marker.expected)
      expect(marker.animation, marker.tone).toBe(
        marker.tone === 'progress' ? 'surf-progress-pulse' : 'none',
      )
    }
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const marker of await markers()) expect(marker.animation).toBe('none')
  })
})
