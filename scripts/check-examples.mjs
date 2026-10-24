// Install packed tarballs into each framework example, build and serve it, then
// verify server HTML, the cascade layer order after bundling, component styles,
// hydration and a dialog interaction in Chromium.
import { execFileSync, spawn } from 'node:child_process'
import {
  cpSync,
  createReadStream,
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from 'node:fs'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { resolve, dirname, extname, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
// Static outputs are served here: `astro preview` daemonizes under some agents.
const examples = {
  vite: { label: 'Vite', port: 4401, serverHtml: false, static: 'dist' },
  next: {
    label: 'Next.js',
    port: 4402,
    serverHtml: true,
    // Card, Stat and Table render on the server only; their code must not reach the browser.
    serverOnly: {
      chunks: '.next/static',
      classes: ['surf-card', 'surf-stat', 'surf-table'],
    },
    command: (port) => [
      'next',
      'start',
      '--hostname',
      '127.0.0.1',
      '--port',
      port,
    ],
  },
  'react-router': {
    label: 'React Router',
    port: 4403,
    serverHtml: true,
    command: () => ['react-router-serve', './build/server/index.js'],
  },
  astro: { label: 'Astro', port: 4404, serverHtml: true, static: 'dist' },
}
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}
function serveStatic(directory, port) {
  const server = createServer((request, response) => {
    let file = join(
      directory,
      decodeURIComponent(new URL(request.url, 'http://x').pathname),
    )
    if (!file.startsWith(directory)) return response.writeHead(403).end()
    if (existsSync(file) && statSync(file).isDirectory())
      file = join(file, 'index.html')
    if (!existsSync(file)) return response.writeHead(404).end()
    response.writeHead(200, {
      'content-type': types[extname(file)] ?? 'application/octet-stream',
    })
    createReadStream(file).pipe(response)
  })
  return new Promise((ready) =>
    server.listen(port, '127.0.0.1', () => ready(server)),
  )
}
const args = process.argv.slice(2)
const option = (name) => {
  const index = args.indexOf(name)
  return index < 0 ? undefined : args.splice(index, 2)[1]
}
const tarballDir = option('--tarballs')
const keep = args.includes('--keep') && args.splice(args.indexOf('--keep'), 1)
const selected = args.length ? args : Object.keys(examples)
for (const name of selected)
  if (!examples[name])
    throw new Error(
      `Unknown example ${name}; use ${Object.keys(examples).join(', ')}`,
    )

let tarballs
if (tarballDir) {
  tarballs = readdirSync(tarballDir)
    .filter((file) => /^surflane-(design-tokens|css|ui)-.+\.tgz$/.test(file))
    .map((file) => resolve(tarballDir, file))
} else {
  const output = execFileSync(
    'node',
    ['scripts/distribute.mjs', '--pack-only'],
    {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'inherit'],
    },
  )
  tarballs = [
    ...output.matchAll(/^@surflane\/[\w-]+: (artifacts\/\S+\.tgz)$/gm),
  ].map((match) => resolve(root, match[1]))
}
if (tarballs.length !== 3)
  throw new Error(
    `Expected tokens, css and ui tarballs, found: ${tarballs.join(', ')}`,
  )

const run = (command, commandArgs, cwd) =>
  execFileSync(command, commandArgs, { cwd, stdio: 'inherit' })
async function waitForServer(url, server) {
  for (let i = 0; i < 120; i++) {
    if (server.exitCode != null)
      throw new Error(`Server exited with ${server.exitCode}`)
    try {
      const response = await fetch(url)
      if (response.ok) return response.text()
    } catch {}
    await new Promise((done) => setTimeout(done, 500))
  }
  throw new Error(`${url} did not respond`)
}

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
})
const failures = []
try {
  for (const name of selected) {
    const {
      label,
      port,
      serverHtml,
      serverOnly,
      command,
      static: output,
    } = examples[name]
    const work = mkdtempSync(join(tmpdir(), `surflane-${name}-`))
    let server
    try {
      console.log(`\n=== ${label}: ${work}`)
      cpSync(resolve(root, 'examples', name), work, {
        recursive: true,
        filter: (path) => !path.split(sep).includes('node_modules'),
      })
      run(
        'npm',
        ['install', '--no-audit', '--no-fund', '--loglevel=error', ...tarballs],
        work,
      )
      run('npm', ['run', 'build'], work)
      if (serverOnly) {
        const scripts = readdirSync(join(work, serverOnly.chunks), {
          recursive: true,
        }).filter((file) => file.endsWith('.js'))
        for (const file of scripts) {
          const code = readFileSync(join(work, serverOnly.chunks, file), 'utf8')
          for (const name of serverOnly.classes)
            if (new RegExp(`["'\`]${name}[\s"'\`-]`).test(code))
              throw new Error(`Client chunk ${file} carries ${name}`)
        }
      }
      server = output
        ? await serveStatic(join(work, output), port)
        : spawn('npx', command(String(port)), {
            cwd: work,
            env: { ...process.env, PORT: String(port), HOST: '127.0.0.1' },
            stdio: ['ignore', 'ignore', 'inherit'],
            detached: true,
          })
      const url = `http://127.0.0.1:${port}/`
      const html = await waitForServer(url, server)
      if (serverHtml)
        for (const marker of [
          'data-theme="light"',
          'surf-heading',
          'surf-tabs',
          'class="surf-button"',
          'Open dialog',
          ...(serverOnly?.classes ?? []),
        ])
          if (!html.includes(marker))
            throw new Error(`Server HTML lacks ${marker}`)

      const page = await browser.newPage()
      const errors = []
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('console', (message) => {
        if (message.type() !== 'error') return
        if (/\/favicon\.ico$/.test(message.location().url)) return
        errors.push(message.text())
      })
      await page.goto(url, { waitUntil: 'networkidle' })
      const brand = await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue('--surf-brand')
          .trim(),
      )
      if (!brand) throw new Error('Design tokens are not loaded')
      // The bundler must keep the layer order: the first mention of each layer fixes it.
      const layers = await page.evaluate(() => {
        const order = []
        const visit = (rules, parent = '') => {
          for (const rule of rules) {
            const names =
              rule instanceof CSSLayerStatementRule
                ? rule.nameList
                : rule instanceof CSSLayerBlockRule
                  ? [rule.name]
                  : []
            for (const name of names) {
              const full = parent ? `${parent}.${name}` : name
              if (!order.includes(full)) order.push(full)
            }
            if (rule instanceof CSSLayerBlockRule)
              visit(
                rule.cssRules,
                parent ? `${parent}.${rule.name}` : rule.name,
              )
            else if (rule instanceof CSSImportRule && rule.styleSheet)
              visit(rule.styleSheet.cssRules, parent)
            else if (rule.cssRules) visit(rule.cssRules, parent)
          }
        }
        for (const sheet of document.styleSheets) visit(sheet.cssRules)
        return order.filter((name) => name.startsWith('surflane.'))
      })
      const expected = [
        'surflane.tokens',
        'surflane.themes',
        'surflane.base',
        'surflane.components',
        'surflane.sizes',
      ]
      if (layers.join() !== expected.join())
        throw new Error(`Layer order ${layers.join(', ')}`)
      // Component styles apply: a primary button fills with the brand color.
      const button = await page.evaluate(() => {
        const probe = document.body.appendChild(document.createElement('i'))
        probe.style.color = 'var(--surf-brand)'
        const brand = getComputedStyle(probe).color
        probe.remove()
        const style = getComputedStyle(
          document.querySelector('.surf-button[data-variant="primary"]'),
        )
        return { brand, background: style.backgroundColor }
      })
      if (button.background !== button.brand)
        throw new Error(
          `Primary button background ${button.background}, expected ${button.brand}`,
        )
      const trigger = page.getByRole('button', { name: 'Open dialog' })
      const dialog = page.getByRole('dialog', { name: 'Surflane dialog' })
      // A click before hydration does nothing; retry until the client takes over.
      for (
        let attempt = 0;
        attempt < 20 && !(await dialog.isVisible());
        attempt++
      ) {
        await trigger.click()
        await dialog.waitFor({ timeout: 500 }).catch(() => {})
      }
      await dialog.waitFor()
      await page.keyboard.press('Escape')
      await dialog.waitFor({ state: 'hidden' })
      const focused = await page.evaluate(() =>
        document.activeElement?.textContent?.trim(),
      )
      if (focused !== 'Open dialog')
        throw new Error(`Focus returned to "${focused}"`)
      await page.close()
      if (errors.length)
        throw new Error(`Browser errors:\n${errors.join('\n')}`)
      console.log(
        `✓ ${label}: ${serverHtml ? 'server HTML, ' : ''}${serverOnly ? 'server-only parts, ' : ''}layer order, component styles, hydration, dialog and focus return`,
      )
    } catch (error) {
      failures.push(`${label}: ${error.message}`)
      console.error(`✗ ${label}: ${error.message}`)
    } finally {
      if (server?.close) server.close()
      else if (server?.pid && server.exitCode === null)
        process.kill(-server.pid, 'SIGTERM')
      if (!keep) rmSync(work, { recursive: true, force: true })
    }
  }
} finally {
  await browser.close()
}
if (failures.length) {
  console.error(
    `\n${failures.length} example(s) failed:\n${failures.join('\n')}`,
  )
  process.exit(1)
}
