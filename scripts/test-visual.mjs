// Runs the package's screenshot tests in the Playwright Linux image that CI uses, so
// fonts and anti-aliasing match the baselines on any machine. Pass --update-snapshots
// to rewrite them; other arguments go to Playwright.
import { runPlaywright } from './playwright-container.mjs'

runPlaywright({
  config: 'playwright.package.config.ts',
  args: process.argv.slice(2),
  setup: ['npm run build'],
  // CI runners are x86-64; render there too, so anti-aliasing matches bit for bit.
  platform: 'linux/amd64',
})
