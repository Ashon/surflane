// Runs Playwright in the Linux image CI uses, within a CPU and memory budget. Locally
// the browsers then never reach the host's window server: native WebKit on macOS
// leaked window-server surfaces until the window server aborted and logged the user
// out. In that image already (CI), it runs Playwright directly.
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// A failed test exits with Playwright's status, without a Node stack trace.
const run = (command, commandArgs, options) => {
  try {
    execFileSync(command, commandArgs, { stdio: 'inherit', ...options })
  } catch (error) {
    process.exit(error.status ?? 1)
  }
}
const quote = (part) => `'${String(part).replaceAll("'", `'\\''`)}'`
const quiet = (command, commandArgs) => {
  try {
    execFileSync(command, commandArgs, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}
/** The Playwright image for one platform, kept under a local tag of its own: one
 * registry tag holds one platform at a time, so pulling the other would replace it. */
function image(version, platform) {
  const local = `surflane-playwright:v${version}-${platform.split('/')[1]}`
  if (!quiet('docker', ['image', 'inspect', local])) {
    const remote = `mcr.microsoft.com/playwright:v${version}-noble`
    run('docker', ['pull', '--quiet', '--platform', platform, remote])
    run('docker', ['tag', remote, local])
  }
  return local
}

/** Runs `playwright test -c config ...args`. setup runs in the container first, after
 * its dependencies are in place. platform is the machine's own unless a suite needs
 * CI's: emulating another one takes several times the CPU and memory.
 * SURFLANE_CONTAINER_CPUS (4) and SURFLANE_CONTAINER_MEMORY (8g) set the budget. */
export function runPlaywright({
  config,
  args = [],
  setup = [],
  platform = process.arch === 'arm64' ? 'linux/arm64' : 'linux/amd64',
}) {
  const playwright = ['playwright', 'test', '-c', config, ...args]
  if (existsSync('/ms-playwright')) return run('npx', playwright, { cwd: root })
  const lockfile = readFileSync(resolve(root, 'package-lock.json'), 'utf8')
  const version =
    JSON.parse(lockfile).packages['node_modules/playwright-core'].version
  const cpus = Number(process.env.SURFLANE_CONTAINER_CPUS ?? 4)
  const memory = process.env.SURFLANE_CONTAINER_MEMORY ?? '8g'
  // Playwright counts the machine's cores, not the container's share: one worker
  // per CPU it may use, unless the caller chose.
  const chosen = args.some(
    (arg) => arg.startsWith('--workers') || /^-j\d*$/.test(arg),
  )
  const workers = chosen ? [] : [`--workers=${cpus}`]
  // Linux dependencies live in a volume over node_modules, apart from the host's and
  // one per platform, installed again only when the lockfile changes.
  const lock = createHash('sha256').update(lockfile).digest('hex')
  const install = `[ "$(cat node_modules/.surflane-lock 2>/dev/null)" = ${lock} ] || { npm ci --no-audit --no-fund --loglevel=error && echo ${lock} > node_modules/.surflane-lock; }`
  const script = [
    install,
    ...setup,
    ['npx', ...playwright, ...workers].map(quote).join(' '),
  ].join(' && ')
  run('docker', [
    'run',
    '--rm',
    // Reaps the browsers' child processes when a run is stopped.
    '--init',
    '--platform',
    platform,
    `--cpus=${cpus}`,
    `--memory=${memory}`,
    `--memory-swap=${memory}`,
    '--pids-limit=4096',
    // Chromium keeps its shared memory in /dev/shm: sized here, within the budget,
    // instead of sharing the host's.
    '--shm-size=1g',
    '--volume',
    `${root}:/work`,
    '--volume',
    `surflane-playwright-node-modules-${platform.split('/')[1]}:/work/node_modules`,
    '--workdir',
    '/work',
    '--env',
    'CI=1',
    image(version, platform),
    'bash',
    '-c',
    script,
  ])
}
