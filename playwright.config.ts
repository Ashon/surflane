import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests",
  testMatch: "*.spec.ts",
  // Prerendered pages exist only in the production build (playwright.browsers.config.ts).
  testIgnore: "prerender.spec.ts",
  // Tests share nothing but the static catalog, so they run in parallel, test by
  // test, on half the CPU cores (Playwright's default).
  fullyParallel: true,
  use: {
    baseURL: "http://127.0.0.1:8066",
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    },
  },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:8066",
    reuseExistingServer: true,
  },
});
