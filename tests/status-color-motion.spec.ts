import { test, expect } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'
for (const theme of ['light', 'dark']) {
  test(`status colors use OKLCH progress, retain the message and cancel for theme changes in ${theme}`, async ({
    page,
  }) => {
    await page.goto('/patterns/error-recovery')
    await waitForCatalogReady(page)
    await page.evaluate(
      (theme) => (document.documentElement.dataset.theme = theme),
      theme,
    )
    const state = await page.evaluate(async () => {
      const message = document.querySelector<HTMLElement>(
        '.recovery-example .pui-message',
      )!
      const before = getComputedStyle(message).backgroundColor
      const retry = [
        ...document.querySelectorAll<HTMLButtonElement>('button'),
      ].find((b) => b.textContent?.trim() === 'Retry preview')!
      retry.click()
      await new Promise(requestAnimationFrame)
      const animation = message.getAnimations()[0]
      if (!animation) throw new Error('No status color animation')
      animation.pause()
      animation.currentTime = 60
      const style = getComputedStyle(message)
      return {
        same:
          message === document.querySelector('.recovery-example .pui-message'),
        tone: message.dataset.tone,
        before,
        middle: style.backgroundColor,
        progress: parseFloat(style.getPropertyValue('--pui-status-progress')),
        duration: animation.effect!.getTiming().duration,
      }
    })
    expect(state.same).toBe(true)
    expect(state.tone).toBe('progress')
    expect(state.duration).toBe(120)
    expect(state.progress).toBeGreaterThan(0)
    expect(state.progress).toBeLessThan(1)
    expect(state.middle).toMatch(/^oklch\(/)
    expect(state.middle).not.toBe(state.before)
    await page.evaluate(
      (theme) =>
        (document.documentElement.dataset.theme =
          theme === 'light' ? 'dark' : 'light'),
      theme,
    )
    await expect(
      page.locator('.recovery-example .pui-message'),
    ).not.toHaveAttribute('data-status-transition')
    await expect(
      page.getByRole('button', { name: 'Cancel retry', exact: true }),
    ).toBeFocused()
  })
}
test('reduced motion changes tone immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/patterns/error-recovery')
  await waitForCatalogReady(page)
  await page.getByRole('button', { name: 'Retry preview', exact: true }).click()
  const message = page.locator('.recovery-example .pui-message')
  await expect(message).toHaveAttribute('data-tone', 'progress')
  await expect(message).not.toHaveAttribute('data-status-transition')
  expect(await message.evaluate((el) => el.getAnimations().length)).toBe(0)
})
