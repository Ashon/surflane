// Runs the package's screenshot tests in the Playwright Linux image that CI uses, so
// fonts and anti-aliasing match the baselines on any machine. Pass --update-snapshots
// to rewrite them; other arguments go to Playwright. In that image already (CI), it
// runs Playwright directly.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const playwright = [
  'playwright',
  'test',
  '-c',
  'playwright.package.config.ts',
  ...args,
]

// A failed test exits with Playwright's status, without a Node stack trace.
const run = (command, commandArgs, options) => {
  try {
    execFileSync(command, commandArgs, { stdio: 'inherit', ...options })
  } catch (error) {
    process.exit(error.status ?? 1)
  }
}

if (existsSync('/ms-playwright')) {
  run('npx', playwright, { cwd: root })
} else {
  const lock = JSON.parse(
    readFileSync(resolve(root, 'package-lock.json'), 'utf8'),
  )
  const version = lock.packages['node_modules/playwright-core'].version
  // Linux dependencies live in a volume over node_modules, apart from the host's.
  const script = [
    'npm ci --no-audit --no-fund --loglevel=error',
    'npm run build',
    ['npx', ...playwright].map((part) => `'${part}'`).join(' '),
  ].join(' && ')
  run('docker', [
    'run',
    '--rm',
    // CI runners are x86-64; render there too, so anti-aliasing matches bit for bit.
    '--platform',
    'linux/amd64',
    '--ipc=host',
    '--volume',
    `${root}:/work`,
    '--volume',
    'surflane-visual-node-modules:/work/node_modules',
    '--workdir',
    '/work',
    '--env',
    'CI=1',
    `mcr.microsoft.com/playwright:v${version}-noble`,
    'bash',
    '-c',
    script,
  ])
}
