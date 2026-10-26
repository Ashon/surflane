// Runs the cross-browser gate, Chromium, Firefox and WebKit on the production
// catalog, in the Playwright Linux image that CI uses. Arguments go to Playwright.
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { root, runPlaywright } from './playwright-container.mjs'

if (!existsSync(resolve(root, 'demo/dist/index.html'))) {
  console.error('Build the production catalog first: npm run build:catalog')
  process.exit(1)
}
runPlaywright({
  config: 'playwright.browsers.config.ts',
  args: process.argv.slice(2),
})
