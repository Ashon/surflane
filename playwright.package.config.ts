import { defineConfig } from '@playwright/test'
/** The package on its own: tests/package renders the built @surflane/ui with only its
 * own CSS. Screenshot baselines are rendered in the Playwright Linux image, the same one
 * CI runs; run them anywhere with `npm run test:visual`. */
export default defineConfig({
  testDir: 'tests/package',
  testMatch: '*.spec.ts',
  fullyParallel: true,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report/package' }],
  ],
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  // One image, one renderer: any changed pixel is a change. threshold still absorbs
  // color noise below a visible difference.
  expect: { toHaveScreenshot: { maxDiffPixels: 0 } },
  use: {
    baseURL: 'http://127.0.0.1:8068',
    viewport: { width: 1280, height: 900 },
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
      // Chromium draws text with subpixel color in some layers and in gray in others,
      // depending on compositing it decides at run time. Gray everywhere is repeatable.
      args: ['--disable-lcd-text'],
    },
  },
  webServer: {
    // A production build, as an app ships it. The dev server optimizes dependencies on
    // first request and reloads the page, so a first run could differ from the next.
    command: [
      'npx vite build tests/package --outDir ../../artifacts/package-harness --emptyOutDir --logLevel error',
      'npx vite preview tests/package --outDir ../../artifacts/package-harness --host 127.0.0.1 --port 8068 --strictPort',
    ].join(' && '),
    url: 'http://127.0.0.1:8068',
    reuseExistingServer: !process.env.CI,
  },
})
