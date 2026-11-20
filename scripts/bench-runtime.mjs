// Runtime cost of a consumer's dashboard (bench/runtime), measured in host Chromium.
// It builds the bench against the built @surflane/ui (run `npm run build` first),
// serves it, and for each run opens a fresh page, mounts the dashboard and rolls it
// forward TICKS times. It reads Chromium's own main-thread timings (CDP Performance
// metrics) around the mount and the ticks, and prints the median of RUNS runs after
// WARMUP discarded ones. The last line is the metric: main-thread task time in ms,
// mount plus ticks, lower is better.
//
//   node scripts/bench-runtime.mjs [--runs 7] [--ticks 20] [--no-build] [--json]
import { execFileSync } from 'node:child_process'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { chromium } from '@playwright/test'

const args = process.argv.slice(2)
const option = (name, fallback) => {
  const at = args.indexOf(`--${name}`)
  return at === -1 ? fallback : Number(args[at + 1])
}
const runs = option('runs', 7)
const ticks = option('ticks', 20)
const warmup = option('warmup', 1)
const out = 'artifacts/bench-runtime'

if (!args.includes('--no-build')) {
  if (!existsSync('packages/ui/dist/index.js'))
    throw new Error('packages/ui/dist is missing: run npm run build first')
  execFileSync(
    'npx',
    [
      'vite',
      'build',
      'bench/runtime',
      '--outDir',
      '../../' + out,
      '--emptyOutDir',
      '--logLevel',
      'error',
    ],
    { stdio: 'inherit' },
  )
}

const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
}
const server = createServer((request, response) => {
  const path = normalize(
    decodeURIComponent(new URL(request.url, 'http://x').pathname),
  )
  let file = join(out, path)
  if (
    !file.startsWith(out) ||
    !existsSync(file) ||
    statSync(file).isDirectory()
  )
    file = join(out, 'index.html')
  response.writeHead(200, {
    'content-type': types[extname(file)] ?? 'application/octet-stream',
  })
  createReadStream(file).pipe(response)
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const url = `http://127.0.0.1:${server.address().port}/`

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
})
const keys = [
  'TaskDuration',
  'ScriptDuration',
  'RecalcStyleDuration',
  'LayoutDuration',
]
const read = async (cdp) => {
  const { metrics } = await cdp.send('Performance.getMetrics')
  return Object.fromEntries(
    metrics
      .filter((m) => keys.includes(m.name))
      .map((m) => [m.name, m.value * 1000]),
  )
}
const minus = (a, b) => Object.fromEntries(keys.map((k) => [k, a[k] - b[k]]))
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = sorted.length >> 1
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

async function once() {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(String(error)))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  await page.goto(url)
  await page.waitForFunction(() => 'bench' in window)
  await page.evaluate(() => document.fonts.ready)
  const cdp = await context.newCDPSession(page)
  await cdp.send('Performance.enable', { timeDomain: 'threadTicks' })
  const before = await read(cdp)
  const mountWall = await page.evaluate(() => window.bench.mount())
  const mounted = await read(cdp)
  const tickWalls = []
  for (let i = 0; i < ticks; i++)
    tickWalls.push(await page.evaluate(() => window.bench.tick()))
  const after = await read(cdp)
  const panels = await page.locator('.surf-dashboard-panel').count()
  await context.close()
  if (errors.length) throw new Error(`page errors:\n${errors.join('\n')}`)
  if (panels < 18) throw new Error(`expected 18 panels, found ${panels}`)
  const mount = minus(mounted, before)
  const tick = minus(after, mounted)
  return {
    total: mount.TaskDuration + tick.TaskDuration,
    mount,
    tick,
    mountWall,
    tickWall: median(tickWalls),
  }
}

const results = []
try {
  for (let i = 0; i < warmup + runs; i++) {
    const result = await once()
    if (i >= warmup) results.push(result)
  }
} finally {
  await browser.close()
  server.close()
}

const pick = (f) => median(results.map(f))
const summary = {
  runs,
  ticks,
  totalTaskMs: pick((r) => r.total),
  spreadMs:
    Math.max(...results.map((r) => r.total)) -
    Math.min(...results.map((r) => r.total)),
  mount: Object.fromEntries(keys.map((k) => [k, pick((r) => r.mount[k])])),
  ticks20: Object.fromEntries(keys.map((k) => [k, pick((r) => r.tick[k])])),
  mountWallMs: pick((r) => r.mountWall),
  tickWallMs: pick((r) => r.tickWall),
}
const round = (value) =>
  typeof value === 'number' ? Math.round(value * 10) / 10 : value
const rounded = JSON.parse(JSON.stringify(summary, (_, value) => round(value)))
if (args.includes('--json')) console.log(JSON.stringify(rounded))
else console.log(rounded)
console.log(round(summary.totalTaskMs))
