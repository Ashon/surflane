// Build what the install guide (/install) tells readers to write. Each framework example
// takes the guide's files for a plain setup and for Tailwind CSS with a remembered theme,
// installs the packed tarballs, builds and serves, then checks in Chromium: the theme
// before hydration, the cascade layer order, component styles, fonts and theme switching.
import { execFileSync, spawn } from 'node:child_process'
import {
  cpSync,
  createReadStream,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { resolve, dirname, extname, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import {
  defaults,
  extraImports,
  extras,
  guideFiles,
  installCommand,
} from '../demo/installRecipes.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const examples = {
  vite: { port: 4411, static: 'dist' },
  next: {
    port: 4412,
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
    port: 4413,
    command: () => ['react-router-serve', './build/server/index.js'],
  },
  astro: { port: 4414, static: 'dist' },
}
// What each scaffolder already sets up for Tailwind CSS, which the guide leaves to it.
// The guide writes the Vite config itself.
const tailwindSetup = {
  next: {
    packages: ['tailwindcss', '@tailwindcss/postcss', 'postcss'],
    files: {
      'postcss.config.mjs':
        "export default { plugins: { '@tailwindcss/postcss': {} } }\n",
    },
  },
  'react-router': {
    packages: ['tailwindcss', '@tailwindcss/vite'],
    files: {
      'vite.config.ts': `import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
})
`,
    },
  },
  astro: {
    packages: ['tailwindcss', '@tailwindcss/vite'],
    files: {
      'astro.config.mjs': `import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
})
`,
    },
  },
}
const setups = [
  { name: 'plain', tailwind: false, fonts: true, remember: false },
  { name: 'tailwind-remember', tailwind: true, fonts: true, remember: true },
  {
    name: 'extras',
    tailwind: false,
    fonts: false,
    remember: false,
    extras: extras.map(({ id }) => id),
  },
]

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
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
const run = (command, args, cwd) =>
  execFileSync(command, args, { cwd, stdio: 'inherit' })

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
      `Unknown framework ${name}; use ${Object.keys(examples).join(', ')}`,
    )
const tarballs = tarballDir
  ? readdirSync(tarballDir)
      .filter((file) => /^surflane-(design-tokens|ui)-.+\.tgz$/.test(file))
      .map((file) => resolve(tarballDir, file))
  : [
      ...execFileSync('node', ['scripts/distribute.mjs', '--pack-only'], {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'inherit'],
      }).matchAll(/^@surflane\/[\w-]+: (artifacts\/\S+\.tgz)$/gm),
    ].map((match) => resolve(root, match[1]))
if (tarballs.length !== 2)
  throw new Error(
    `Expected tokens and ui tarballs, found: ${tarballs.join(', ')}`,
  )
const tarball = (name) =>
  tarballs.find((file) => file.includes(`surflane-${name.split('/')[1]}-`))

// Layers in the order the page's stylesheets first mention them.
const layerOrder = () => {
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
        visit(rule.cssRules, parent ? `${parent}.${rule.name}` : rule.name)
      else if (rule instanceof CSSImportRule && rule.styleSheet)
        visit(rule.styleSheet.cssRules, parent)
      else if (rule.cssRules) visit(rule.cssRules, parent)
    }
  }
  for (const sheet of document.styleSheets) visit(sheet.cssRules)
  return order
}

async function check(browser, url, setup) {
  const surflane = [
    'surflane.tokens',
    'surflane.themes',
    'surflane.base',
    'surflane.components',
  ].map((name) => (setup.tailwind ? `components.${name}` : name))
  for (const saved of setup.remember ? [undefined, 'dark'] : [undefined]) {
    const context = await browser.newContext()
    if (saved) await context.addCookies([{ name: 'theme', value: saved, url }])
    // The theme as parsing ends, before deferred scripts hydrate the page.
    await context.addInitScript(() => {
      document.addEventListener('readystatechange', () => {
        if (document.readyState === 'interactive')
          window.parsedTheme = document.documentElement.dataset.theme
      })
    })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => {
      if (message.type() !== 'error') return
      if (/\/favicon\.ico$/.test(message.location().url)) return
      errors.push(message.text())
    })
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.getByRole('heading', { name: 'Hello, Surflane' }).waitFor()
    const expected = saved ?? 'light'
    const layers = await page.evaluate(layerOrder)
    const state = await page.evaluate(async () => {
      await document.fonts.ready
      const probe = document.body.appendChild(document.createElement('i'))
      probe.style.color = 'var(--brand)'
      const brand = getComputedStyle(probe).color
      probe.remove()
      const button = document.querySelector(
        '.pui-button[data-variant="primary"]',
      )
      return {
        parsed: window.parsedTheme,
        theme: document.documentElement.dataset.theme,
        brand,
        background: button && getComputedStyle(button).backgroundColor,
        fonts: [...document.fonts]
          .filter((font) => font.status === 'loaded')
          .map((font) => font.family.replace(/"/g, '')),
      }
    })
    if (state.parsed !== expected || state.theme !== expected)
      throw new Error(
        `Theme ${state.parsed} while parsing, ${state.theme} after load; expected ${expected}`,
      )
    if (state.background !== state.brand)
      throw new Error(
        `Primary button background ${state.background}, expected ${state.brand}`,
      )
    const found = layers.filter((name) => surflane.includes(name))
    if (found.join() !== surflane.join())
      throw new Error(`Surflane layers ${found.join(', ')}`)
    if (setup.tailwind) {
      const at = (name) => layers.indexOf(name)
      if (!(at('base') < at(surflane[0]) && at(surflane[3]) < at('utilities')))
        throw new Error(`Tailwind layers ${layers.join(', ')}`)
    }
    if (setup.extras.includes('highlighting'))
      await page
        .locator('.pui-syntax[data-highlighted="true"]')
        .waitFor({ timeout: 10000 })
        .catch(() => {
          throw new Error('The code block was not highlighted')
        })
    if (setup.fonts && !state.fonts.includes('Manrope Variable'))
      throw new Error(`Fonts loaded: ${state.fonts.join(', ') || 'none'}`)
    if (setup.remember && saved) {
      // Switching saves the other theme, and a reload opens with it.
      await page.getByRole('button', { name: 'Switch theme' }).click()
      await page.waitForFunction(
        () => document.documentElement.dataset.theme === 'light',
      )
      const cookie = (await context.cookies()).find((c) => c.name === 'theme')
      if (cookie?.value !== 'light')
        throw new Error(`Saved theme cookie ${cookie?.value}`)
      await page.reload({ waitUntil: 'networkidle' })
      const reloaded = await page.evaluate(() => window.parsedTheme)
      if (reloaded !== 'light')
        throw new Error(`Reloaded with theme ${reloaded}, expected light`)
    }
    if (errors.length) throw new Error(`Browser errors:\n${errors.join('\n')}`)
    await context.close()
  }
}

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
})
const failures = []
try {
  for (const framework of selected)
    for (const variant of setups) {
      const setup = { ...defaults, ...variant, framework }
      const label = `${framework} (${variant.name})`
      const { port, command, static: output } = examples[framework]
      const work = mkdtempSync(join(tmpdir(), `surflane-guide-${framework}-`))
      let server
      try {
        console.log(`\n=== ${label}: ${work}`)
        cpSync(resolve(root, 'examples', framework), work, {
          recursive: true,
          filter: (path) => !path.split(sep).includes('node_modules'),
        })
        const write = (file, code) => {
          mkdirSync(dirname(join(work, file)), { recursive: true })
          writeFileSync(
            join(work, file),
            code.endsWith('\n') ? code : code + '\n',
          )
        }
        const extra = setup.tailwind ? tailwindSetup[framework] : undefined
        for (const [file, code] of Object.entries(extra?.files ?? {}))
          write(file, code)
        const files = guideFiles(setup)
        for (const file of files) write(file.file, file.code)
        // The guide's imports for extra components must resolve and build: a module
        // the page imports holds them.
        if (setup.extras.length) {
          const page = files.find((file) => file.kind === 'page').file
          const imports = extraImports(setup)
          const names = [...imports.matchAll(/\{([^}]+)\}/g)].flatMap((m) =>
            m[1].split(',').map((name) => name.trim()),
          )
          write(
            join(dirname(page), 'guide-extras.ts'),
            `${imports}\n\nexport const extras = [${names.join(', ')}]`,
          )
          const code = readFileSync(join(work, page), 'utf8')
          writeFileSync(join(work, page), `import './guide-extras'\n${code}`)
        }
        // The guide's install command, with the Surflane packages from the tarballs.
        const packages = [
          ...installCommand(setup).split(' ').slice(2),
          ...(extra?.packages ?? []),
        ].map((name) => (name.startsWith('@surflane/') ? tarball(name) : name))
        run(
          'npm',
          [
            'install',
            '--no-audit',
            '--no-fund',
            '--loglevel=error',
            ...new Set(packages),
          ],
          work,
        )
        run('npm', ['run', 'build'], work)
        server = output
          ? await serveStatic(join(work, output), port)
          : spawn('npx', command(String(port)), {
              cwd: work,
              env: { ...process.env, PORT: String(port), HOST: '127.0.0.1' },
              stdio: ['ignore', 'ignore', 'inherit'],
              detached: true,
            })
        const url = `http://127.0.0.1:${port}/`
        await waitForServer(url, server)
        await check(browser, url, setup)
        console.log(
          `✓ ${label}: theme before hydration, layers, styles${setup.fonts ? ', fonts' : ''}${setup.remember ? ', theme switch' : ''}${setup.extras.length ? ', extra components and highlighting' : ''}`,
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
  console.error(`\n${failures.length} setup(s) failed:\n${failures.join('\n')}`)
  process.exit(1)
}
