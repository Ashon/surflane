import { waitForCatalogReady } from './catalog-ready'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { inputExtensionExampleIds } from '../demo/InputExtensionExamples'
test.use({ reducedMotion: 'reduce' })
test('Autocomplete accepts and submits free text when no suggestion matches', async ({
  page,
}) => {
  await page.goto('/components/autocomplete')
  await waitForCatalogReady(page)
  const input = page.getByRole('combobox', {
    name: 'Pipeline search',
    exact: true,
  })
  await input.fill('custom scenario 한글')
  await expect(
    page.getByRole('status').filter({
      hasText: 'No suggestions. You can still use this search text.',
    }),
  ).toBeVisible()
  await input.press('Tab')
  await page.getByRole('button', { name: 'Submit search', exact: true }).click()
  await expect(page.locator('#preview p[role="status"]')).toContainText(
    '"query":"custom scenario 한글"',
  )
  await expect(input).not.toHaveAttribute('aria-invalid', 'true')
})
test('Autocomplete completes suggested text without submitting and maps object suggestions to text rather than IDs', async ({
  page,
}) => {
  await page.goto('/components/autocomplete')
  await waitForCatalogReady(page)
  const input = page.getByRole('combobox', {
    name: 'Pipeline search',
    exact: true,
  })
  await input.fill('identity')
  await input.press('ArrowDown')
  await input.press('Enter')
  await expect(input).toHaveValue('identity control')
  await expect(page.locator('#preview p[role="status"]')).toHaveText(
    'No form submitted.',
  )
  const tag = page.getByRole('combobox', {
    name: 'Controlled search tag',
    exact: true,
  })
  await tag.fill('Aud')
  await tag.press('ArrowDown')
  await tag.press('Enter')
  await expect(tag).toHaveValue('Audit')
  await page.getByRole('button', { name: 'Submit search', exact: true }).click()
  await expect(page.locator('#preview p[role="status"]')).toContainText(
    '"tag":"Audit"',
  )
})
test('Autocomplete honors canceled writes/reset and retains controlled external form input when resetting an uncontrolled query', async ({
  page,
}) => {
  await page.goto('/components/autocomplete')
  await waitForCatalogReady(page)
  const input = page.getByRole('combobox', {
      name: 'Pipeline search',
      exact: true,
    }),
    tag = page.getByRole('combobox', {
      name: 'Controlled search tag',
      exact: true,
    })
  await input.fill('project')
  await input.press('Tab')
  await tag.fill('custom tag')
  await tag.press('Tab')
  await page.getByRole('button', { name: 'Cancel reset', exact: true }).click()
  await page.getByRole('button', { name: 'Reset search', exact: true }).click()
  await expect(input).toHaveValue('project')
  await page.getByRole('button', { name: 'Allow reset', exact: true }).click()
  await page.getByRole('button', { name: 'Reset search', exact: true }).click()
  await expect(input).toHaveValue('staging')
  await expect(tag).toHaveValue('custom tag')
  await page
    .getByRole('button', { name: 'Cancel query changes', exact: true })
    .click()
  await input.fill('rejected')
  await expect(input).toHaveValue('staging')
})
test('Autocomplete required error links to the input, and readonly and disabled states remain distinct', async ({
  page,
}) => {
  await page.goto('/components/autocomplete')
  await waitForCatalogReady(page)
  const input = page.getByRole('combobox', {
    name: 'Pipeline search',
    exact: true,
  })
  await page.getByRole('checkbox', { name: 'Read only', exact: true }).check()
  await expect(input).toHaveAttribute('readonly')
  await expect(input).toBeEnabled()
  await page.getByRole('checkbox', { name: 'Read only', exact: true }).uncheck()
  await page
    .getByRole('checkbox', { name: 'Disable suggestions', exact: true })
    .check()
  await expect(input).toBeDisabled()
  await page
    .getByRole('checkbox', { name: 'Disable suggestions', exact: true })
    .uncheck()
  await page.getByRole('button', { name: 'Clear input', exact: true }).click()
  await page.getByRole('button', { name: 'Submit search', exact: true }).click()
  await expect(input).toHaveAttribute('aria-invalid', 'true')
  await expect(input).toBeFocused()
  const error = page.locator('.pui-field-error').first()
  await expect(error).toHaveText('Please fill out this field.')
  expect((await input.getAttribute('aria-describedby'))?.split(' ')).toContain(
    await error.getAttribute('id'),
  )
})
test('Autocomplete preserves Korean composition before accepting a suggestion', async ({
  page,
}) => {
  await page.goto('/components/autocomplete')
  await waitForCatalogReady(page)
  const input = page.getByRole('combobox', {
    name: 'Pipeline search',
    exact: true,
  })
  await input.fill('스테이징')
  await expect(
    page.getByRole('option', { name: '스테이징 배포 환경', exact: true }),
  ).toBeVisible()
  await input.dispatchEvent('compositionstart')
  await input.dispatchEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    which: 229,
    keyCode: 229,
    isComposing: true,
  })
  await expect(input).toHaveValue('스테이징')
  await input.dispatchEvent('compositionend')
  await input.press('ArrowDown')
  await input.press('Enter')
  await expect(input).toHaveValue('스테이징 배포 환경')
})
test('Slider supports keyboard increments, boundary keys, committed values, range names and numeric form submission', async ({
  page,
}) => {
  await page.goto('/components/slider')
  await waitForCatalogReady(page)
  const slider = page.getByRole('slider', {
    name: 'Parallel workers',
    exact: true,
  })
  await expect(slider).toHaveAttribute('aria-valuenow', '3')
  await slider.focus()
  await slider.press('ArrowRight')
  await expect(slider).toHaveAttribute('aria-valuenow', '4')
  await slider.press('Home')
  await expect(slider).toHaveAttribute('aria-valuenow', '1')
  await slider.press('PageUp')
  await expect(slider).toHaveAttribute('aria-valuenow', '11')
  await slider.press('End')
  await expect(slider).toHaveAttribute('aria-valuenow', '16')
  await expect(slider).toHaveAttribute('aria-valuetext', '16 workers')
  await page
    .getByRole('button', { name: 'Submit slider values', exact: true })
    .click()
  const status = page.locator('#preview p[role="status"]')
  await expect(status).toContainText('"workers":"16"')
  await expect(status).toContainText('"window":["20","60"]')
  await expect(status).toContainText('16 workers committed.')
  await expect(
    page.getByRole('slider', { name: 'Minimum coverage', exact: true }),
  ).toHaveAttribute('aria-valuetext', '20 percent')
  await expect(
    page.getByRole('slider', { name: 'Maximum coverage', exact: true }),
  ).toHaveAttribute('aria-valuetext', '60 percent')
})
test('Slider range respects minimum distance and primary cancellation blocks keyboard and pointer writes', async ({
  page,
}) => {
  await page.goto('/components/slider')
  await waitForCatalogReady(page)
  const low = page.getByRole('slider', {
      name: 'Minimum coverage',
      exact: true,
    }),
    high = page.getByRole('slider', { name: 'Maximum coverage', exact: true })
  await low.focus()
  for (let i = 0; i < 15; i++) await low.press('ArrowRight')
  expect(
    Number(await high.getAttribute('aria-valuenow')) -
      Number(await low.getAttribute('aria-valuenow')),
  ).toBeGreaterThanOrEqual(10)
  await page
    .getByRole('button', { name: 'Cancel primary changes', exact: true })
    .click()
  const primary = page.getByRole('slider', {
    name: 'Parallel workers',
    exact: true,
  })
  await primary.focus()
  await primary.press('ArrowRight')
  await expect(primary).toHaveAttribute('aria-valuenow', '3')
  const control = page.locator('.pui-slider-control').first()
  const b = await control.boundingBox()
  await control.click({ position: { x: b!.width * 0.8, y: b!.height / 2 } })
  await expect(primary).toHaveAttribute('aria-valuenow', '3')
})
test('Slider reset restores uncontrolled values, honors cancellation and preserves the shared controlled numeric input', async ({
  page,
}) => {
  await page.goto('/components/slider')
  await waitForCatalogReady(page)
  const primary = page.getByRole('slider', {
    name: 'Parallel workers',
    exact: true,
  })
  await primary.focus()
  await primary.press('End')
  const exact = page.getByRole('textbox', {
    name: 'Exact percentage',
    exact: true,
  })
  await exact.fill('40')
  await exact.blur()
  await expect(
    page.getByRole('slider', { name: 'Coverage weight', exact: true }),
  ).toHaveAttribute('aria-valuenow', '40')
  const vertical = page.getByRole('slider', { name: 'Priority', exact: true })
  await vertical.focus()
  await vertical.press('ArrowUp')
  await expect(vertical).toHaveAttribute('aria-orientation', 'vertical')
  await expect(vertical).toHaveAttribute('aria-valuenow', '5')
  await page.getByRole('button', { name: 'Cancel reset', exact: true }).click()
  await page.getByRole('button', { name: 'Reset sliders', exact: true }).click()
  await expect(primary).toHaveAttribute('aria-valuenow', '16')
  await page.getByRole('button', { name: 'Allow reset', exact: true }).click()
  await page.getByRole('button', { name: 'Reset sliders', exact: true }).click()
  await expect(primary).toHaveAttribute('aria-valuenow', '3')
  await expect(vertical).toHaveAttribute('aria-valuenow', '4')
  await expect(exact).toHaveValue('40')
  expect(
    await page
      .locator('#slider-example-form')
      .evaluate((f) => new FormData(f as HTMLFormElement).get('weight')),
  ).toBe('40')
})
test('Slider direction provider synchronizes RTL geometry and arrow keys and disabled controls stay inert', async ({
  page,
}) => {
  await page.goto('/components/slider')
  await waitForCatalogReady(page)
  await page
    .getByRole('checkbox', { name: 'Right to left', exact: true })
    .check()
  const slider = page.getByRole('slider', {
    name: 'Parallel workers',
    exact: true,
  })
  await slider.focus()
  await slider.press('ArrowRight')
  await expect(slider).toHaveAttribute('aria-valuenow', '2')
  const geometry = await page
    .locator('.pui-slider-control')
    .first()
    .evaluate((el) => {
      const track = el.getBoundingClientRect(),
        thumb = el.querySelector('.pui-slider-thumb')!.getBoundingClientRect()
      return {
        offset: thumb.x + thumb.width / 2 - track.x,
        width: track.width,
      }
    })
  expect(geometry.offset / geometry.width).toBeGreaterThan(0.75)
  await page
    .getByRole('checkbox', { name: 'Disable sliders', exact: true })
    .check()
  for (const el of await page.getByRole('slider').all())
    await expect(el).toBeDisabled()
})
test('Slider drag moves the thumb and mobile touch drag reaches a different value', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 900 },
    isMobile: true,
    hasTouch: true,
  })
  try {
    const page = await context.newPage()
    await page.goto('/components/slider')
    await waitForCatalogReady(page)
    const control = page.locator('.pui-slider-control').first()
    await control.scrollIntoViewIfNeeded()
    const thumb = await control.locator('.pui-slider-thumb').boundingBox()
    const client = await context.newCDPSession(page)
    const x = thumb!.x + thumb!.width / 2,
      y = thumb!.y + thumb!.height / 2
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x, y }],
    })
    for (let n = 1; n <= 8; n++)
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: x + n * 10, y }],
      })
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    })
    expect(
      Number(
        await page
          .getByRole('slider', { name: 'Parallel workers', exact: true })
          .getAttribute('aria-valuenow'),
      ),
    ).toBeGreaterThan(3)
  } finally {
    await context.close()
  }
})
for (const id of inputExtensionExampleIds)
  test(`${id} passes closed-page and scoped-popup accessibility, dark/light, reduced motion and enlarged reflow`, async ({
    page,
  }) => {
    await page.goto(`/components/${id}`)
    await waitForCatalogReady(page)
    await page.setViewportSize({ width: 320, height: 1000 })
    for (const theme of ['light', 'dark']) {
      await page.evaluate(
        (t) => (document.documentElement.dataset.theme = t),
        theme,
      )
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy()
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
      if (id === 'autocomplete') {
        const input = page.getByRole('combobox', {
          name: 'Pipeline search',
          exact: true,
        })
        await input.focus()
        await input.press('ArrowDown')
        await expect(page.locator('.pui-combobox-popup')).toBeVisible()
        expect(
          (
            await new AxeBuilder({ page })
              .include('.pui-combobox-popup')
              .analyze()
          ).violations,
        ).toEqual([])
        await input.press('Tab')
        await expect(
          page.getByRole('heading', {
            level: 1,
            name: 'Autocomplete',
            exact: true,
          }),
        ).toBeVisible()
        expect(
          await page.evaluate(() =>
            Boolean(document.activeElement?.closest('[aria-hidden="true"]')),
          ),
        ).toBeFalsy()
      }
    }
    await page.evaluate(
      () => (document.documentElement.style.fontSize = '200%'),
    )
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy()
  })
