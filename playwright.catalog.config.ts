import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests",
  testMatch: "catalog-loading.spec.ts",
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:8067",
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    },
  },
  webServer: {
    command: "npx vite preview demo --host 127.0.0.1 --port 8067 --strictPort",
    url: "http://127.0.0.1:8067",
    reuseExistingServer: false,
  },
});
