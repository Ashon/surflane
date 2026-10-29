import { test, expect, type Locator, type Page } from '@playwright/test'
import { waitForCatalogReady as catalogReady } from './catalog-ready'

// The guide overlay loads after the first screen. Wait for it, so a test's first
// pointer move is not spent before the overlay listens.
async function waitForCatalogReady(page: Page) {
  await catalogReady(page)
  await expect(page.locator('.pointer-blueprint')).toHaveCount(1)
}

// Guides inside a scroll area paint on that area's own layer. Pixel reads from the
// window canvas return what the page shows: every layer, clipped by the areas
// around it, under the window canvas.
function composeLayers() {
  const read = CanvasRenderingContext2D.prototype.getImageData
  CanvasRenderingContext2D.prototype.getImageData = function (
    this: CanvasRenderingContext2D,
    ...args: Parameters<typeof read>
  ) {
    const base = this.canvas
    if (
      !(base instanceof HTMLCanvasElement) ||
      !base.classList.contains('pointer-blueprint')
    )
      return read.apply(this, args)
    const composite = document.createElement('canvas')
    composite.width = base.width
    composite.height = base.height
    const context = composite.getContext('2d')!
    const dpr = devicePixelRatio,
      origin = base.getBoundingClientRect()
    for (const layer of document.querySelectorAll<HTMLCanvasElement>(
      'canvas.pointer-blueprint-layer',
    )) {
      const rect = layer.getBoundingClientRect()
      if (!rect.width || !rect.height) continue
      const clip = {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
      }
      let shown = true
      for (let el = layer.parentElement; el; el = el.parentElement) {
        const style = getComputedStyle(el)
        if (style.display === 'none' || style.visibility === 'hidden')
          shown = false
        const box = el.getBoundingClientRect()
        if (style.overflowX !== 'visible') {
          clip.left = Math.max(clip.left, box.left)
          clip.right = Math.min(clip.right, box.right)
        }
        if (style.overflowY !== 'visible') {
          clip.top = Math.max(clip.top, box.top)
          clip.bottom = Math.min(clip.bottom, box.bottom)
        }
      }
      if (!shown || clip.right <= clip.left || clip.bottom <= clip.top) continue
      context.save()
      context.beginPath()
      context.rect(
        Math.round((clip.left - origin.left) * dpr),
        Math.round((clip.top - origin.top) * dpr),
        Math.round((clip.right - clip.left) * dpr),
        Math.round((clip.bottom - clip.top) * dpr),
      )
      context.clip()
      context.drawImage(
        layer,
        Math.round((rect.left - origin.left) * dpr),
        Math.round((rect.top - origin.top) * dpr),
      )
      context.restore()
    }
    context.drawImage(base, 0, 0)
    return read.apply(context, args)
  }
}
test.beforeEach(async ({ context }) => {
  await context.addInitScript(composeLayers)
})

async function pixels(canvas: Locator, point?: { x: number; y: number }) {
  return canvas.evaluate((node, point) => {
    const c = node as HTMLCanvasElement
    const ctx = c.getContext('2d')!
    const data = ctx.getImageData(0, 0, c.width, c.height).data
    const dpr = devicePixelRatio
    let count = 0,
      distant = 0,
      maximum = 0
    for (let i = 3; i < data.length; i += 4) {
      if (!data[i]) continue
      count++
      maximum = Math.max(maximum, data[i])
      const index = (i - 3) / 4
      if (
        point &&
        Math.hypot(
          (index % c.width) / dpr - point.x,
          Math.floor(index / c.width) / dpr - point.y,
        ) > 222
      )
        distant++
    }
    return { count, distant, maximum, width: c.width, height: c.height }
  }, point)
}

for (const dpr of [1, 2, 3]) {
  test(`pointer guides track DOM edges in one device pixel at DPR ${dpr}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: dpr,
      reducedMotion: 'reduce',
    })
    await context.addInitScript(composeLayers)
    try {
      const page = await context.newPage()
      await page.goto('http://127.0.0.1:8066/components/button')
      await waitForCatalogReady(page)
      const button = page.getByRole('button', {
        name: 'Run preview',
        exact: true,
      })
      await button.scrollIntoViewIfNeeded()
      const before = await button.boundingBox()
      const point = {
        x: before!.x + before!.width / 2,
        y: before!.y + before!.height / 2,
      }
      const canvas = page.locator('.pointer-blueprint')
      await page.mouse.move(point.x, point.y)
      await expect
        .poll(async () => (await pixels(canvas)).count)
        .toBeGreaterThan(100)
      expect(await button.boundingBox()).toEqual(before)
      const image = await pixels(canvas, point)
      expect(image.distant).toBe(0)
      expect(image.maximum).toBeLessThanOrEqual(77)
      expect(image.width).toBe(1440 * dpr)
      expect(image.height).toBe(1000 * dpr)
      const edge = await canvas.evaluate((node, rect) => {
        const c = node as HTMLCanvasElement,
          ctx = c.getContext('2d')!,
          dpr = devicePixelRatio
        // Sample a horizontal edge away from intersecting vertical guides.
        const x = Math.floor((rect!.x + 27) * dpr),
          y = Math.floor(rect!.y * dpr)
        return [-1, 0, 1].map(
          (offset) => ctx.getImageData(x, y + offset, 1, 1).data[3],
        )
      }, before)
      expect(edge[0]).toBe(0)
      expect(edge[1]).toBeGreaterThan(0)
      expect(edge[2]).toBe(0)
      await button.click()
      await expect(
        page.getByText('Primary action previewed.', { exact: true }),
      ).toBeVisible()
      await page.keyboard.press('Tab')
      await expect.poll(async () => (await pixels(canvas)).count).toBe(0)
      await page.mouse.move(point.x + 2, point.y)
      await expect
        .poll(async () => (await pixels(canvas)).count)
        .toBeGreaterThan(0)
      await page.dispatchEvent('body', 'pointerout', {
        pointerType: 'mouse',
        relatedTarget: null,
      })
      await expect.poll(async () => (await pixels(canvas)).count).toBe(0)
    } finally {
      await context.close()
    }
  })
}

test('guides update for local scroll, DOM resize, route changes, and viewport resize', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/components/button')
  await waitForCatalogReady(page)
  const canvas = page.locator('.pointer-blueprint')
  const button = page.getByRole('button', { name: 'Run preview', exact: true })
  await button.scrollIntoViewIfNeeded()
  const box = (await button.boundingBox())!
  const point = { x: box.x + 25, y: box.y + 15 }
  await page.mouse.move(point.x, point.y)
  await expect.poll(async () => (await pixels(canvas)).count).toBeGreaterThan(0)
  const edgeAlpha = async () =>
    canvas.evaluate(
      (node, p) => {
        const c = node as HTMLCanvasElement
        return c
          .getContext('2d')!
          .getImageData(Math.floor(p.x), Math.floor(p.y), 1, 1).data[3]
      },
      { x: box.x + 27, y: box.y + box.height },
    )
  await expect.poll(edgeAlpha).toBeGreaterThan(0)
  await page.locator('.catalog-document-scroll').evaluate((el) => {
    el.scrollTop += 57
  })
  await expect.poll(edgeAlpha).toBe(0)
  // Resize a live DOM control without moving the mouse; observer updates the guide.
  await page.locator('.catalog-document-scroll').evaluate((el) => {
    el.scrollTop -= 57
  })
  await expect.poll(edgeAlpha).toBeGreaterThan(0)
  await button.evaluate((el) => {
    el.style.height = '64px'
  })
  await expect.poll(edgeAlpha).toBe(0)
  await page.setViewportSize({ width: 1100, height: 850 })
  await expect.poll(async () => (await pixels(canvas)).width).toBe(1100)
  await page
    .getByRole('link', { name: 'Foundations', exact: true })
    .first()
    .click()
  await waitForCatalogReady(page)
  await expect(
    page.getByRole('heading', { name: 'Foundations', exact: true }),
  ).toBeVisible()
  expect(await canvas.count()).toBe(1)
  expect(
    await canvas.evaluate((el) => getComputedStyle(el).pointerEvents),
  ).toBe('none')
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})

test('touch and forced colors suppress decorative guides', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce',
  })
  await context.addInitScript(composeLayers)
  try {
    const page = await context.newPage()
    await page.goto('http://127.0.0.1:8066/')
    await waitForCatalogReady(page)
    const canvas = page.locator('.pointer-blueprint')
    await page.touchscreen.tap(200, 300)
    expect((await pixels(canvas)).count).toBe(0)
    await page.mouse.move(200, 300)
    await expect
      .poll(async () => (await pixels(canvas)).count)
      .toBeGreaterThan(0)
    await page.emulateMedia({ forcedColors: 'active' })
    await expect(canvas).toBeHidden()
    await expect.poll(async () => (await pixels(canvas)).count).toBe(0)
    await expect(canvas).toHaveAttribute('aria-hidden', 'true')
  } finally {
    await context.close()
  }
})

test('individual line ends fade smoothly and the layer fades away on pointer exit', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await waitForCatalogReady(page)
  // Pause the catalog's ambient probes so only the pointer layer paints.
  await page
    .locator('.catalog-app')
    .evaluate((el) => el.setAttribute('data-blueprint-ambient', 'paused'))
  const brand = page.getByRole('link', {
    name: 'Surflane home',
    exact: true,
  })
  const box = (await brand.boundingBox())!
  const canvas = page.locator('.pointer-blueprint')
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await expect
    .poll(async () => (await pixels(canvas)).maximum)
    .toBeGreaterThan(60)
  const samples = await canvas.evaluate((node, box) => {
    const c = node as HTMLCanvasElement,
      ctx = c.getContext('2d')!
    return [2, 12, 32, 64].map(
      (offset) =>
        ctx.getImageData(
          Math.floor(Math.max(0, box.x - 96) + offset),
          Math.floor(box.y),
          1,
          1,
        ).data[3],
    )
  }, box)
  expect(samples[0]).toBeLessThan(samples[1])
  expect(samples[1]).toBeLessThan(samples[2])
  expect(samples[2]).toBeLessThan(samples[3])
  const upward = await canvas.evaluate((node, box) => {
    const c = node as HTMLCanvasElement
    return c.getContext('2d')!.getImageData(Math.floor(box.x), 6, 1, 1).data[3]
  }, box)
  // A screen-clipped upper tail still carries its original gradient: it must
  // remain visible above the brand, rather than beginning a new 96px fade at y=0.
  expect(upward).toBeGreaterThan(20)
  const corner = await canvas.evaluate((node, box) => {
    const ctx = (node as HTMLCanvasElement).getContext('2d')!
    const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
    return [-8, 8, -50].map((offset) => {
      const x = Math.floor(box.x + offset),
        y = Math.floor(box.y)
      const distance = Math.hypot(x + 0.5 - center.x, y + 0.5 - center.y)
      const mask =
        distance <= 77
          ? 0.3 - (distance / 77) * 0.14
          : 0.16 * (1 - (distance - 77) / 143)
      return ctx.getImageData(x, y, 1, 1).data[3] / (255 * mask)
    })
  }, box)
  // Spatial spotlight fades everything equally. After accounting for it, the
  // corner and the first 12px extension must stay opaque; only the tail fades.
  expect(corner[0]).toBeGreaterThan(0.94)
  expect(corner[1]).toBeGreaterThan(0.94)
  expect(corner[2]).toBeGreaterThan(0.2)
  expect(corner[2]).toBeLessThan(0.8)
  await page.dispatchEvent('body', 'pointerout', {
    pointerType: 'mouse',
    relatedTarget: null,
  })
  await expect.poll(async () => (await pixels(canvas)).count).toBe(0)
  // The decorative layer never enters keyboard navigation or the accessibility tree.
  await expect(canvas).toHaveAttribute('aria-hidden', 'true')
  expect(await canvas.getAttribute('tabindex')).toBeNull()
})

test('localized definition rows and values receive guides without moving or changing content', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/foundations/content')
  await waitForCatalogReady(page)
  const row = page.locator('.content-value-list > div').nth(3)
  await row.scrollIntoViewIfNeeded()
  const canvas = page.locator('.pointer-blueprint')
  for (const selector of ['dt', 'dd']) {
    const cell = row.locator(selector)
    const before = (await cell.boundingBox())!
    const text = await cell.textContent()
    await page.mouse.move(before.x + 35, before.y + before.height / 2)
    await expect
      .poll(() =>
        canvas.evaluate((node, box) => {
          const ctx = (node as HTMLCanvasElement).getContext('2d')!
          return ctx.getImageData(
            Math.floor(box.x + 27),
            Math.floor(box.y),
            1,
            1,
          ).data[3]
        }, before),
      )
      .toBeGreaterThan(20)
    expect(await cell.boundingBox()).toEqual(before)
    expect(await cell.textContent()).toBe(text)
  }
  await page
    .getByRole('combobox', { name: 'Formatting locale', exact: true })
    .click()
  await page
    .getByRole('option', { name: 'English / United States', exact: true })
    .click()
  await expect(page.locator('.content-value-list dt').first()).toHaveText(
    'Recorded runs',
  )
  const updated = row.locator('dd')
  const box = (await updated.boundingBox())!
  await page.mouse.move(box.x + 35, box.y + box.height / 2)
  await expect
    .poll(() =>
      canvas.evaluate(
        (node, box) =>
          (node as HTMLCanvasElement)
            .getContext('2d')!
            .getImageData(Math.floor(box.x + 27), Math.floor(box.y), 1, 1)
            .data[3],
        box,
      ),
    )
    .toBeGreaterThan(20)
})

for (const width of [1440, 600]) {
  test(`table cell guides follow actual cells and horizontal scrolling at ${width}px`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/components/table')
    await waitForCatalogReady(page)
    const table = page.locator('[data-preview-size] table')
    const canvas = page.locator('.pointer-blueprint')
    const checkCell = async (cell: Locator) => {
      await cell.scrollIntoViewIfNeeded()
      const box = (await cell.boundingBox())!
      await page.mouse.move(box.x + 35, box.y + box.height / 2)
      await expect
        .poll(() =>
          canvas.evaluate(
            (node, box) =>
              (node as HTMLCanvasElement)
                .getContext('2d')!
                .getImageData(Math.floor(box.x + 27), Math.floor(box.y), 1, 1)
                .data[3],
            box,
          ),
        )
        .toBeGreaterThan(20)
      expect(await cell.boundingBox()).toEqual(box)
    }
    await checkCell(
      table.getByRole('columnheader', { name: 'Cluster', exact: true }),
    )
    await checkCell(table.locator('tbody tr').nth(1).locator('td').nth(1))
    if (width === 600) {
      const viewport = page.getByRole('region', {
        name: 'Environment comparison',
        exact: true,
      })
      const overflow = await viewport.evaluate(
        (el) => el.scrollWidth - el.clientWidth,
      )
      expect(overflow).toBeGreaterThan(0)
      await viewport.evaluate((el) => {
        el.scrollLeft = el.scrollWidth
      })
      await expect
        .poll(() => viewport.evaluate((el) => el.scrollLeft))
        .toBeGreaterThan(0)
      await checkCell(table.locator('tbody tr').nth(1).locator('td').nth(2))
    }
    const checkbox = table.getByRole('checkbox', {
      name: 'Select Documentation',
      exact: true,
    })
    await checkbox.check()
    await expect(checkbox).toBeChecked()
  })
}

test('scroll events paint the current geometry synchronously before the next frame', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/components/button')
  await waitForCatalogReady(page)
  const button = page.getByRole('button', { name: 'Run preview', exact: true })
  await button.scrollIntoViewIfNeeded()
  const box = (await button.boundingBox())!
  await page.mouse.move(box.x + 35, box.y + box.height / 2)
  await expect
    .poll(async () => (await pixels(page.locator('.pointer-blueprint'))).count)
    .toBeGreaterThan(0)
  const events = await page.evaluate(() => {
    const viewport = document.querySelector<HTMLElement>(
      '.catalog-document-scroll',
    )!
    const target = document.querySelector<HTMLElement>(
      '[data-preview-size] button[data-variant="primary"]',
    )!
    const ctx = document
      .querySelector<HTMLCanvasElement>('.pointer-blueprint')!
      .getContext('2d')!
    const results: number[] = []
    const sample = () => {
      const bounds = target.getBoundingClientRect()
      results.push(
        ctx.getImageData(Math.floor(bounds.x + 27), Math.floor(bounds.y), 1, 1)
          .data[3],
      )
    }
    // This observer runs later in the SAME scroll dispatch, with no RAF/poll in
    // between: stale pixels from the old position cannot satisfy the assertion.
    document.addEventListener('scroll', sample, true)
    for (let step = 0; step < 5; step++) {
      viewport.scrollTop += 13
      viewport.dispatchEvent(new Event('scroll'))
    }
    document.removeEventListener('scroll', sample, true)
    return results
  })
  expect(events).toHaveLength(5)
  for (const alpha of events) expect(alpha).toBeGreaterThan(20)
})

test('table horizontal scroll repaints cell edges in the same event dispatch', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 600, height: 1000 })
  await page.goto('/components/table')
  await waitForCatalogReady(page)
  const cell = page
    .locator('[data-preview-size] tbody tr')
    .nth(1)
    .locator('td')
    .nth(1)
  await cell.scrollIntoViewIfNeeded()
  const box = (await cell.boundingBox())!
  await page.mouse.move(box.x + 35, box.y + box.height / 2)
  await expect
    .poll(async () => (await pixels(page.locator('.pointer-blueprint'))).count)
    .toBeGreaterThan(0)
  const samples = await cell.evaluate((target) => {
    const viewport = target.closest<HTMLElement>('.surf-scroll-viewport')!
    const ctx = document
      .querySelector<HTMLCanvasElement>('.pointer-blueprint')!
      .getContext('2d')!
    const samples: number[] = []
    const listener = () => {
      const bounds = target.getBoundingClientRect()
      samples.push(
        ctx.getImageData(Math.floor(bounds.x), Math.floor(bounds.y + 20), 1, 1)
          .data[3],
      )
    }
    document.addEventListener('scroll', listener, true)
    for (let step = 0; step < 4; step++) {
      viewport.scrollLeft += 11
      viewport.dispatchEvent(new Event('scroll'))
    }
    document.removeEventListener('scroll', listener, true)
    return samples
  })
  expect(samples).toHaveLength(4)
  for (const alpha of samples) expect(alpha).toBeGreaterThan(20)
})

test('Command modal input and result options paint above the portal and keep keyboard behavior', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/patterns/command-search')
  await waitForCatalogReady(page)
  await page
    .getByRole('button', { name: 'Search documentation', exact: true })
    .click()
  const dialog = page.getByRole('dialog', {
    name: 'Command search',
    exact: true,
  })
  await expect(dialog).toBeVisible()
  const canvas = page.locator('.pointer-blueprint')
  expect(
    await canvas.evaluate((el) => el.parentElement === document.body),
  ).toBe(true)
  const input = dialog.getByRole('combobox', {
    name: 'Search pages and actions',
    exact: true,
  })
  await expect(input).toBeFocused()
  for (const target of [input, dialog.getByRole('option').first()]) {
    const box = (await target.boundingBox())!
    await page.mouse.move(box.x + 35, box.y + box.height / 2)
    // The first option's top and side edges lie on its scroll area's edge, which
    // clips the area's guide layer as it clips the content. Its bottom edge is inside.
    await expect
      .poll(() =>
        canvas.evaluate(
          (node, box) =>
            (node as HTMLCanvasElement)
              .getContext('2d')!
              .getImageData(
                Math.floor(box.x + 27),
                Math.floor(box.y + box.height),
                1,
                1,
              ).data[3],
          box,
        ),
      )
      .toBeGreaterThan(20)
    expect(await target.boundingBox()).toEqual(box)
  }
  await input.fill('Button')
  await expect(dialog.getByRole('option', { name: /Button/ })).toBeVisible()
  await page.keyboard.press('ArrowDown')
  await expect.poll(async () => (await pixels(canvas)).count).toBe(0)
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(
    page.getByRole('button', { name: 'Search documentation', exact: true }),
  ).toBeFocused()
  expect(await canvas.count()).toBe(1)
})

// Maximum guide alpha painted inside an element's box.
async function alphaInside(
  page: import('@playwright/test').Page,
  selector: string,
) {
  const box = (await page.locator(selector).boundingBox())!
  return page.locator('.pointer-blueprint').evaluate((node, box) => {
    const c = node as HTMLCanvasElement
    const dpr = devicePixelRatio
    const data = c
      .getContext('2d')!
      .getImageData(
        Math.floor(box.x * dpr),
        Math.floor(box.y * dpr),
        Math.ceil(box.width * dpr),
        Math.ceil(box.height * dpr),
      ).data
    let maximum = 0
    for (let i = 3; i < data.length; i += 4)
      maximum = Math.max(maximum, data[i])
    return maximum
  }, box)
}

test('the decorative landing console still shows construction guides, unless an outer layer is inert', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  // Reduced motion keeps the ambient probes off, so only the pointer paints.
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await waitForCatalogReady(page)
  const console = page.locator('.landing-console')
  await expect(console).toHaveAttribute('inert', '')
  const box = (await page
    .locator('.landing-console-sheet thead')
    .boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await expect
    .poll(() => alphaInside(page, '.landing-console-sheet'))
    .toBeGreaterThan(60)
  // The brand row is a plain container that opts in with data-blueprint-guide; the
  // account row is a link.
  for (const row of [
    '.landing-console .surf-app-shell-brand',
    '.landing-console .surf-app-shell-footer .surf-app-shell-link',
  ]) {
    const area = (await page.locator(row).boundingBox())!
    await page.mouse.move(area.x + area.width / 2, area.y + area.height / 2)
    await expect.poll(() => alphaInside(page, row)).toBeGreaterThan(60)
  }
  // Content behind a modal is inert at a higher level; the opt-in must not override it.
  await page
    .locator('.landing-hero')
    .evaluate((hero) => hero.setAttribute('inert', ''))
  await page.mouse.move(box.x + box.width / 2 + 1, box.y + box.height / 2)
  await expect.poll(() => alphaInside(page, '.landing-console-sheet')).toBe(0)
})

test('ambient probes drift over the whole catalog, circle the brand mark, ignore the pointer and pause', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/components/button')
  await waitForCatalogReady(page)
  const canvas = page.locator('.pointer-blueprint'),
    app = page.locator('.catalog-app')
  // After idle, at the pointer layer's strength at most (0.3 alpha).
  await expect
    .poll(async () => (await pixels(canvas)).count, { timeout: 5000 })
    .toBeGreaterThan(100)
  expect((await pixels(canvas)).maximum).toBeLessThanOrEqual(80)
  // One probe stays around the brand mark in the top-left corner.
  await expect
    .poll(() => alphaInside(page, '[data-blueprint-ambient-anchor]'), {
      timeout: 5000,
    })
    .toBeGreaterThan(4)
  // The probes drift on their own: a moving pointer adds its guides, it never stops them.
  const title = (await page.locator('#page-title').boundingBox())!
  const point = { x: title.x + 20, y: title.y + 10 }
  for (const offset of [0, 40, 80]) {
    await page.mouse.move(point.x + offset, point.y)
    await page.waitForTimeout(250)
  }
  await expect
    .poll(
      async () =>
        (await pixels(canvas, { x: point.x + 80, y: point.y })).distant,
    )
    .toBeGreaterThan(0)
  // A paused area stops every ambient frame, and resumes when running again.
  await page.dispatchEvent('body', 'pointerout', {
    pointerType: 'mouse',
    relatedTarget: null,
  })
  await app.evaluate((el) =>
    el.setAttribute('data-blueprint-ambient', 'paused'),
  )
  await expect.poll(async () => (await pixels(canvas)).count).toBe(0)
  await page.waitForTimeout(1000)
  expect((await pixels(canvas)).count).toBe(0)
  await app.evaluate((el) =>
    el.setAttribute('data-blueprint-ambient', 'running'),
  )
  await expect
    .poll(async () => (await pixels(canvas)).count, { timeout: 5000 })
    .toBeGreaterThan(0)
})

test('reduced motion keeps the ambient probes off', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
  })
  await context.addInitScript(composeLayers)
  try {
    const page = await context.newPage()
    await page.goto('http://127.0.0.1:8066/')
    await waitForCatalogReady(page)
    await page.waitForTimeout(2500)
    expect((await pixels(page.locator('.pointer-blueprint'))).count).toBe(0)
  } finally {
    await context.close()
  }
})

test('touch screens show the ambient probes at the pointer layer strength', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: true,
  })
  await context.addInitScript(composeLayers)
  try {
    const page = await context.newPage()
    await page.goto('http://127.0.0.1:8066/')
    await waitForCatalogReady(page)
    await expect
      .poll(
        async () => (await pixels(page.locator('.pointer-blueprint'))).maximum,
        {
          timeout: 5000,
        },
      )
      .toBeGreaterThan(24)
  } finally {
    await context.close()
  }
})

test('guides in a scroll area paint on a layer inside its content that takes no space', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/components/table')
  await waitForCatalogReady(page)
  const area = page.locator('.catalog-document-scroll')
  const extent = () =>
    area.evaluate((el) => [
      el.scrollWidth,
      el.scrollHeight,
      el.clientWidth,
      el.querySelector('.catalog-shell')!.getBoundingClientRect().top +
        el.scrollTop,
    ])
  const before = await extent()
  const cell = page.locator('[data-preview-size] tbody td').first()
  await cell.scrollIntoViewIfNeeded()
  const box = (await cell.boundingBox())!
  await page.mouse.move(box.x + 20, box.y + box.height / 2)
  await expect
    .poll(async () => (await pixels(page.locator('.pointer-blueprint'))).count)
    .toBeGreaterThan(0)
  const layers = await page.evaluate(() =>
    [...document.querySelectorAll('.pointer-blueprint-scroll')].map((host) => {
      const area = host.parentElement!,
        canvas = host.querySelector('canvas')!
      const rect = canvas.getBoundingClientRect(),
        box = area.getBoundingClientRect()
      return {
        first: area.firstElementChild === host,
        hidden: host.getAttribute('aria-hidden'),
        height: host.getBoundingClientRect().height,
        // The canvas covers the area's visible part and never extends it.
        inside:
          rect.left >= box.left - 0.5 &&
          rect.top >= box.top - 0.5 &&
          rect.right <= box.left + area.clientLeft + area.clientWidth + 0.5 &&
          rect.bottom <= box.top + area.clientTop + area.clientHeight + 0.5,
      }
    }),
  )
  expect(layers.length).toBeGreaterThan(1)
  for (const layer of layers)
    expect(layer).toEqual({
      first: true,
      hidden: 'true',
      height: 0,
      inside: true,
    })
  // The cell's guides belong to the table's own layer.
  const own = await cell.evaluate((el, box) => {
    const canvas = el
      .closest('.surf-scroll-viewport')!
      .querySelector<HTMLCanvasElement>(
        ':scope > .pointer-blueprint-scroll canvas',
      )!
    const rect = canvas.getBoundingClientRect(),
      dpr = devicePixelRatio
    return canvas
      .getContext('2d')!
      .getImageData(
        Math.floor((box.x + 10 - rect.left) * dpr),
        Math.floor((box.y - rect.top) * dpr),
        1,
        1,
      ).data[3]
  }, box)
  expect(own).toBeGreaterThan(0)
  expect(await extent()).toEqual(before)
})

test('a guide continues past the edge of its scroll area instead of stopping there', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/components/table')
  await waitForCatalogReady(page)
  const region = page.getByRole('region', {
    name: 'Environment comparison',
    exact: true,
  })
  const row = page.locator('[data-preview-size] tbody tr').nth(1)
  await row.scrollIntoViewIfNeeded()
  const area = (await region.boundingBox())!,
    box = (await row.boundingBox())!
  await page.mouse.move(box.x + 20, box.y + box.height / 2)
  const alpha = (x: number, y: number) =>
    page
      .locator('.pointer-blueprint')
      .evaluate(
        (node, point) =>
          (node as HTMLCanvasElement)
            .getContext('2d')!
            .getImageData(Math.floor(point.x), Math.floor(point.y), 1, 1)
            .data[3],
        { x, y },
      )
  // The row's top edge, just inside the table's scroll area and just outside it:
  // the table's layer draws one, the document's layer continues the other.
  await expect.poll(() => alpha(area.x + 6, box.y)).toBeGreaterThan(20)
  await expect.poll(() => alpha(area.x - 6, box.y)).toBeGreaterThan(20)
  expect(await row.boundingBox()).toEqual(box)
})

test('a scroll area layer sits on whole device pixels by its offsets, not a transform', async ({
  browser,
}) => {
  // The browser snaps a box before it applies a transform, so a translate from a host
  // between device pixels resampled the canvas and smeared each line over two rows.
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  })
  try {
    const page = await context.newPage()
    await page.goto('http://127.0.0.1:8066/components/table')
    await waitForCatalogReady(page)
    // Put the scroll areas between device pixels.
    await page
      .locator('.catalog-shell')
      .evaluate((shell) => (shell.style.marginTop = '0.33px'))
    const cell = page.locator('[data-preview-size] tbody td').first()
    await cell.scrollIntoViewIfNeeded()
    const box = (await cell.boundingBox())!
    await page.mouse.move(box.x + 20, box.y + box.height / 2)
    await expect(
      page.locator('.pointer-blueprint-layer').first(),
    ).toBeAttached()
    const layers = await page.evaluate(() =>
      [
        ...document.querySelectorAll<HTMLElement>('.pointer-blueprint-layer'),
      ].map((canvas) => {
        const rect = canvas.getBoundingClientRect()
        return {
          transform: canvas.style.transform,
          left: rect.left * devicePixelRatio,
          top: rect.top * devicePixelRatio,
        }
      }),
    )
    expect(layers.length).toBeGreaterThan(0)
    for (const layer of layers) {
      expect(layer.transform).toBe('')
      expect(Math.abs(layer.left - Math.round(layer.left))).toBeLessThan(0.02)
      expect(Math.abs(layer.top - Math.round(layer.top))).toBeLessThan(0.02)
    }
  } finally {
    await context.close()
  }
})

test("a sticky sidebar's lines outside it stay put while the page scrolls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/components')
  await waitForCatalogReady(page)
  const navigation = page.locator('.catalog-navigation-viewport')
  const right = await navigation.evaluate((viewport) => {
    const box = viewport.getBoundingClientRect()
    return box.left + viewport.clientLeft + viewport.clientWidth
  })
  const link = page.locator('#catalog-navigation-links a').nth(5)
  // Rows the window canvas draws in one column just outside the sidebar.
  const rows = () =>
    page.locator('.pointer-blueprint').evaluate((node, x) => {
      const canvas = node as HTMLCanvasElement
      const dpr = devicePixelRatio
      const data = canvas
        .getContext('2d')!
        .getImageData(Math.round(x * dpr), 0, 1, canvas.height).data
      const found: number[] = []
      for (let y = 0; y < canvas.height; y++)
        if (data[y * 4 + 3]) found.push((y + 0.5) / dpr)
      return found
    }, right + 30)
  for (const scroll of [0, 400]) {
    await page
      .locator('.catalog-document-scroll')
      .evaluate((viewport, top) => (viewport.scrollTop = top), scroll)
    const box = (await link.boundingBox())!
    await page.mouse.move(right - 25, box.y + box.height / 2)
    // The sidebar holds still, so the window canvas, not the document's layer that
    // scrolls with the page, draws the part of its lines past the sidebar.
    await expect
      .poll(async () => (await rows()).some((y) => Math.abs(y - box.y) < 1))
      .toBe(true)
  }
})

test('ambient probes draw the page body fainter than the chrome', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/components/button')
  await waitForCatalogReady(page)
  // The body's guides paint on the document's layer and the layers of the scroll
  // areas inside it; the pointer stays away.
  const body = () =>
    page.evaluate(() => {
      let count = 0,
        maximum = 0
      for (const canvas of document.querySelectorAll<HTMLCanvasElement>(
        'main .pointer-blueprint-layer, .catalog-document-scroll > .pointer-blueprint-scroll > .pointer-blueprint-layer',
      )) {
        const data = canvas
          .getContext('2d')!
          .getImageData(0, 0, canvas.width, canvas.height).data
        for (let i = 3; i < data.length; i += 4)
          if (data[i]) {
            count++
            maximum = Math.max(maximum, data[i])
          }
      }
      return { count, maximum }
    })
  await expect
    .poll(async () => (await body()).count, { timeout: 8000 })
    .toBeGreaterThan(100)
  // Half of the pointer layer's 0.3 alpha, with room for rounding. Lines that cross
  // within one spotlight don't add up.
  for (let sample = 0; sample < 5; sample++) {
    expect((await body()).maximum).toBeLessThanOrEqual(42)
    await page.waitForTimeout(200)
  }
})
