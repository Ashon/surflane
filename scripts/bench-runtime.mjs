// Runtime cost of a consumer's dashboard (bench/runtime), measured in host Chromium.
// It builds the bench against the built @surflane/ui (run `npm run build` first),
// serves it, and for each run opens a fresh page, mounts the dashboard and rolls it
// forward TICKS times. It reads Chromium's own main-thread timings (CDP Performance
// metrics) around the mount and the ticks, and prints the median of RUNS runs after
// WARMUP discarded ones. The last line is the metric: main-thread task time in ms,
// mount plus ticks, lower is better.
//
// With --against DIR it measures a second, earlier build too, alternating the two run
// by run so that a machine's drift falls on both alike, and the last line is the
// candidate's median over the earlier build's, below 1 when the candidate is faster.
//
//   node scripts/bench-runtime.mjs [--runs 7] [--ticks 20] [--no-build] [--json]
//     [--out artifacts/bench-runtime] [--against artifacts/bench-runtime-best]
import { execFileSync } from 'node:child_process'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { chromium } from '@playwright/test'

const args = process.argv.slice(2)
const value = (name, fallback) => {
  const at = args.indexOf(`--${name}`)
  return at === -1 ? fallback : args[at + 1]
}
const runs = Number(value('runs', 7))
const ticks = Number(value('ticks', 20))
const warmup = Number(value('warmup', 1))
const out = value('out', 'artifacts/bench-runtime')
const against = value('against', null)

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
if (against && !existsSync(join(against, 'index.html')))
  throw new Error(`${against} has no built bench`)

const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
}
async function serve(root) {
  const server = createServer((request, response) => {
    const path = normalize(
      decodeURIComponent(new URL(request.url, 'http://x').pathname),
    )
    let file = join(root, path)
    if (
      !file.startsWith(root) ||
      !existsSync(file) ||
      statSync(file).isDirectory()
    )
      file = join(root, 'index.html')
    response.writeHead(200, {
      'content-type': types[extname(file)] ?? 'application/octet-stream',
    })
    createReadStream(file).pipe(response)
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  return { server, url: `http://127.0.0.1:${server.address().port}/` }
}
const targets = [await serve(out), ...(against ? [await serve(against)] : [])]

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

async function once(url) {
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

const results = targets.map(() => [])
try {
  for (let i = 0; i < warmup + runs; i++)
    for (const [t, target] of targets.entries()) {
      const result = await once(target.url)
      if (i >= warmup) results[t].push(result)
    }
} finally {
  await browser.close()
  for (const target of targets) target.server.close()
}

const summarize = (list) => {
  const pick = (f) => median(list.map(f))
  return {
    totalTaskMs: pick((r) => r.total),
    spreadMs:
      Math.max(...list.map((r) => r.total)) -
      Math.min(...list.map((r) => r.total)),
    mount: Object.fromEntries(keys.map((k) => [k, pick((r) => r.mount[k])])),
    ticks: Object.fromEntries(keys.map((k) => [k, pick((r) => r.tick[k])])),
    mountWallMs: pick((r) => r.mountWall),
    tickWallMs: pick((r) => r.tickWall),
  }
}
const round = (number) =>
  typeof number === 'number' ? Math.round(number * 1000) / 1000 : number
const print = (label, summary) => {
  const rounded = JSON.parse(
    JSON.stringify(summary, (_, v) =>
      typeof v === 'number' ? Math.round(v * 10) / 10 : v,
    ),
  )
  console.log(
    args.includes('--json')
      ? JSON.stringify({ label, ...rounded })
      : { label, ...rounded },
  )
}
const candidate = summarize(results[0])
print(out, candidate)
if (against) {
  const earlier = summarize(results[1])
  print(against, earlier)
  console.log(round(candidate.totalTaskMs / earlier.totalTaskMs))
} else console.log(Math.round(candidate.totalTaskMs * 10) / 10)
