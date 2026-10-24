import { test, expect } from '@playwright/test'
import { waitForCatalogReady } from './catalog-ready'
for (const reduced of [false, true])
  test(`pending content has no visual loader and resolves with opacity-only entry; reduced=${reduced}`, async ({
    page,
  }) => {
    await page.emulateMedia({
      reducedMotion: reduced ? 'reduce' : 'no-preference',
    })
    await page.addInitScript(() => {
      ;(window as any).__entries = []
      document.addEventListener('animationstart', (event) => {
        const e = event as AnimationEvent
        if (e.animationName !== 'catalog-content-fade') return
        const target = e.target as HTMLElement
        ;(window as any).__entries.push({
          className: target.className,
          duration: getComputedStyle(target).animationDuration,
          frames: target
            .getAnimations()
            .flatMap((a) => (a.effect as KeyframeEffect).getKeyframes()),
        })
      })
    })
    let release!: () => void
    const held = new Promise<void>((resolve) => (release = resolve))
    await page.route(
      /\/DetailPage(?:-[^/]+\.js|\.tsx)(?:\?|$)/,
      async (route) => {
        await held
        await route.continue()
      },
    )
    await page.goto('/components/button', { waitUntil: 'domcontentloaded' })
    const loading = page.locator('[data-catalog-loading="page"]')
    await expect(loading).toBeVisible()
    await expect(loading).toHaveAccessibleName('Loading content')
    await expect(loading.locator('.surf-skeleton')).toHaveCount(0)
    await expect(loading.locator('.example-announcement')).toHaveText(
      'Loading content',
    )
    release()
    await waitForCatalogReady(page)
    await expect(loading).toHaveCount(0)
    if (reduced)
      expect(await page.evaluate(() => (window as any).__entries)).toEqual([])
    else {
      await expect
        .poll(() => page.evaluate(() => (window as any).__entries.length))
        .toBe(1)
      const entries = await page.evaluate(() => (window as any).__entries)
      expect(entries[0].duration).toBe('0.2s')
      expect(entries[0].className).toContain('catalog-page-body')
      expect(
        entries[0].frames.every(
          (frame: any) =>
            frame.filter === undefined && frame.transform === undefined,
        ),
      ).toBe(true)
    }
    await expect(page.locator('.catalog-content-fade')).toHaveCount(0)
    await expect(page.locator('.catalog-page-body')).toHaveCSS('filter', 'none')
    await expect(page.locator('.catalog-page-body')).toHaveCSS(
      'animation-name',
      'none',
    )
  })
