import { defineConfig } from "@playwright/test";
/** Small production-build gate; the full Chromium suite remains a separate job. */
export default defineConfig({
  testDir: "tests",
  testMatch: [
    "primitives.spec.ts",
    "confirmation.spec.ts",
    "forms.spec.ts",
    "app-shell.spec.ts",
    "button-variants.spec.ts",
    "prerender.spec.ts",
  ],
  fullyParallel: true,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://127.0.0.1:8067", trace: "retain-on-failure" },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        launchOptions: {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
        },
      },
    },
    { name: "firefox", use: { browserName: "firefox" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  webServer: {
    command: "npx vite preview demo --host 127.0.0.1 --port 8067 --strictPort",
    url: "http://127.0.0.1:8067",
    reuseExistingServer: false,
  },
});
