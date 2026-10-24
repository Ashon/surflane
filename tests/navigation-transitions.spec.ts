import { test, expect } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'

test('accordion replacement collapses and fades the old panel while clipping and disabling its content', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/components/accordion')
  await waitForCatalogReady(page)
  const identity = page.getByRole('button', {
      name: 'Identity controls',
      exact: true,
    }),
    regions = page.getByRole('button', {
      name: 'Environment access',
      exact: true,
    })
  const old = page.locator('.surf-accordion-panel').nth(0),
    next = page.locator('.surf-accordion-panel').nth(1)
  await page
    .getByRole('textbox', { name: 'Case note', exact: true })
    .fill('Retained through replacement')
  const height = (await old.boundingBox())!.height
  await regions.evaluate((element) => (element as HTMLButtonElement).click())
  await expect(old).toHaveAttribute('data-ending-style', '')
  await expect(old).toHaveAttribute('inert', '')
  await expect(old).toHaveAttribute('aria-hidden', 'true')
  const middle = await old.evaluate(async (element) => {
    const animations = element.getAnimations()
    await Promise.all(animations.map((animation) => animation.ready))
    for (const animation of animations) {
      animation.pause()
      animation.currentTime = 80
    }
    return {
      height: element.getBoundingClientRect().height,
      opacity: Number(getComputedStyle(element).opacity),
      duration: getComputedStyle(element).transitionDuration,
      overflow: getComputedStyle(element).overflow,
      animations: animations.length,
    }
  })
  expect(middle.animations).toBeGreaterThan(0)
  expect(middle.height).toBeGreaterThan(0)
  expect(middle.height).toBeLessThan(height)
  expect(middle.opacity).toBeGreaterThan(0)
  expect(middle.opacity).toBeLessThan(1)
  expect(middle.duration).toBe('0.16s, 0.16s')
  expect(middle.overflow).toBe('clip')
  await old.evaluate((element) =>
    element.getAnimations().forEach((animation) => animation.finish()),
  )
  await expect(old).toBeHidden()
  await expect(next).toBeVisible()
  await identity.click()
  await expect(old).toBeVisible()
  await expect(
    page.getByRole('textbox', { name: 'Case note', exact: true }),
  ).toHaveValue('Retained through replacement')
})

test('rapid accordion reversal and reduced motion preserve the final panel state and focus', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/components/accordion')
  await waitForCatalogReady(page)
  const identity = page.getByRole('button', {
      name: 'Identity controls',
      exact: true,
    }),
    regions = page.getByRole('button', {
      name: 'Environment access',
      exact: true,
    })
  await regions.click()
  await identity.click()
  await expect(identity).toHaveAttribute('aria-expanded', 'true')
  await expect(regions).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('.surf-accordion-panel').nth(1)).toBeHidden()
  await expect(page.locator('.surf-accordion-panel').nth(0)).toBeVisible()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await regions.focus()
  await page.keyboard.press('Enter')
  await expect(regions).toBeFocused()
  await expect(page.locator('.surf-accordion-panel').nth(0)).toBeHidden()
  await expect(page.locator('.surf-accordion-panel').nth(1)).toHaveCSS(
    'transition-duration',
    '0s',
  )
})

test('tabs select with a borderless surface and keep keyboard focus and forced-color selection', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/components/tabs')
  await waitForCatalogReady(page)
  const overview = page.getByRole('tab', { name: 'Overview', exact: true }),
    evidence = page.getByRole('tab', { name: 'Logs', exact: true }),
    indicator = page.locator('.surf-tabs-indicator')
  await expect(overview).toHaveCSS('border-top-width', '0px')
  await expect(indicator).toHaveCSS('border-top-width', '0px')
  await overview.focus()
  await page.keyboard.press('ArrowRight')
  await expect(evidence).toBeFocused()
  expect(
    await evidence.evaluate((element) =>
      parseFloat(getComputedStyle(element).outlineWidth),
    ),
  ).toBeGreaterThanOrEqual(2)
  await page.keyboard.press('Enter')
  await expect(evidence).toHaveAttribute('aria-selected', 'true')
  await page.emulateMedia({ forcedColors: 'active' })
  await expect(indicator).toHaveCSS('forced-color-adjust', 'none')
  await expect(evidence).toHaveCSS('forced-color-adjust', 'none')
})
