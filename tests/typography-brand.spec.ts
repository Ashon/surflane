import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForCatalogReady } from './catalog-ready'
test.use({ reducedMotion: 'reduce' })

test('brand roles use the published faces, weights and tracking rather than browser bold defaults', async ({
  page,
}) => {
  await page.goto('/foundations/typography')
  await waitForCatalogReady(page)
  await page.evaluate(() => document.fonts.ready)
  const cases = [
    ['#page-title', 'Manrope', '500', 0],
    ['#brand-subhead', 'Manrope', '500', 0],
    ['#brand-body', 'Manrope', '400', 0],
    ['#brand-body strong', 'Manrope', '500', 0],
    ['#brand-caption', 'Manrope', '400', 0],
    ['#brand-label', 'Manrope', '400', 0],
    ['#brand-button', 'Manrope', '500', 0],
    ['#brand-mono', 'JetBrains Mono', '400', 0],
  ] as const
  for (const [selector, face, weight, tracking] of cases) {
    const style = await page.locator(selector).evaluate((el) => {
      const s = getComputedStyle(el)
      return {
        family: s.fontFamily,
        weight: s.fontWeight,
        tracking: parseFloat(s.letterSpacing) || 0,
        size: parseFloat(s.fontSize),
        synthesis: s.getPropertyValue('font-synthesis-weight'),
      }
    })
    expect(style.family).toContain(face)
    expect(style.weight).toBe(weight)
    expect(style.tracking / style.size).toBeCloseTo(tracking, 3)
    expect(style.synthesis).toBe('none')
  }
  await expect(
    page.getByRole('link', { name: 'Google Fonts', exact: true }),
  ).toHaveAttribute('href', /fonts\.google\.com/)
})

test('actual loaded fonts match display, subhead, body, code, Korean and Japanese specimens', async ({
  page,
  context,
}) => {
  await page.goto('/foundations/typography')
  await waitForCatalogReady(page)
  await page.evaluate(() => document.fonts.ready)
  const client = await context.newCDPSession(page)
  await client.send('DOM.enable')
  await client.send('CSS.enable')
  const { root } = await client.send('DOM.getDocument')
  for (const [selector, face] of [
    ['#page-title', 'Manrope'],
    ['#brand-subhead', 'Manrope'],
    ['#brand-body', 'Manrope'],
    ['#brand-mono', 'JetBrains Mono'],
    ['#specimen-hangul', 'Pretendard'],
    ['#brand-japanese', 'Noto Sans JP'],
  ]) {
    const { nodeId } = await client.send('DOM.querySelector', {
      nodeId: root.nodeId,
      selector,
    })
    const { fonts } = await client.send('CSS.getPlatformFontsForNode', {
      nodeId,
    })
    expect(
      fonts.some(
        (font) =>
          font.isCustomFont &&
          font.glyphCount > 0 &&
          font.familyName.includes(face),
      ),
      `${selector}: ${JSON.stringify(fonts)}`,
    ).toBe(true)
  }
})

test('catalog text and portal controls stay within the 500 maximum and code stays at zero tracking', async ({
  page,
}) => {
  for (const route of [
    '/components',
    '/components/form',
    '/components/card',
    '/foundations/content',
  ]) {
    await page.goto(route)
    await waitForCatalogReady(page)
    const offenders = await page.locator('body').evaluate((body) =>
      [...body.querySelectorAll<HTMLElement>('*')]
        .filter(
          (el) =>
            el.childNodes.length &&
            [...el.childNodes].some(
              (node) =>
                node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
            ) &&
            Number(getComputedStyle(el).fontWeight) > 500,
        )
        .map((el) => ({
          tag: el.tagName,
          classes: el.className,
          text: el.textContent?.slice(0, 40),
          weight: getComputedStyle(el).fontWeight,
        })),
    )
    expect(offenders, route).toEqual([])
  }
  await page.getByRole('combobox', { name: 'Formatting locale' }).click()
  for (const option of await page.getByRole('option').all()) {
    const css = await option.evaluate((el) => {
      const s = getComputedStyle(el)
      return {
        tracking: parseFloat(s.letterSpacing),
        size: parseFloat(s.fontSize),
        weight: Number(s.fontWeight),
      }
    })
    expect(css.tracking / css.size).toBeCloseTo(0, 3)
    expect(css.weight).toBeLessThanOrEqual(500)
  }
})
for (const width of [1440, 320])
  for (const dark of [false, true])
    test(`brand type guide reflows and passes axe at ${width}px dark=${dark}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto('/foundations/typography')
      await waitForCatalogReady(page)
      if (dark) await page.getByRole('button', { name: 'Toggle theme' }).click()
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
      expect(
        await page
          .locator('.catalog-document-scroll')
          .evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true)
    })
