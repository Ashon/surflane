// Writes every catalog page, in English and Korean, as static HTML into a built
// catalog. The app hydrates the page it finds instead of rendering it again.
import { build } from 'vite'
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { values } = parseArgs({
  options: {
    base: { type: 'string', default: '/' },
    outDir: { type: 'string', default: 'demo/dist' },
  },
})
const base = values.base.replace(/\/*$/, '/')
const out = resolve(root, values.outDir)
const serverDir = join(root, 'artifacts/catalog-server')
await build({
  root: join(root, 'demo'),
  base,
  logLevel: 'warn',
  build: {
    ssr: 'server.tsx',
    outDir: serverDir,
    emptyOutDir: true,
    rollupOptions: {
      // Components mark themselves "use client"; the server bundle has no boundary.
      onwarn(warning, warn) {
        if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') warn(warning)
      },
    },
  },
})
const { routes, locales, localePath, renderPage, revealScript } = await import(
  pathToFileURL(join(serverDir, 'server.js')).href
)
// Pages has no SPA fallback: it answers unknown paths with 404.html, which renders
// the catalog from scratch. It keeps the empty template for a second run, too.
const fallback = join(out, '404.html')
if (!existsSync(fallback))
  writeFileSync(fallback, readFileSync(join(out, 'index.html')))
const template = readFileSync(fallback, 'utf8')
const manifest = JSON.parse(
  readFileSync(join(out, '.vite/manifest.json'), 'utf8'),
)
// The entry's script and styles are in the template already.
const shell = new Set()
;(function visit(key) {
  if (shell.has(key)) return
  shell.add(key)
  for (const next of manifest[key].imports ?? []) visit(next)
})('index.html')
const byChunk = new Map()
for (const [key, chunk] of Object.entries(manifest)) {
  const name = chunk.file.match(/([^/]+)-[\w-]{8}\.js$/)?.[1]
  if (name) byChunk.set(name, [...(byChunk.get(name) ?? []), key])
}
// A page links the styles of the lazy chunks it renders, so its HTML is styled at
// first paint, and no other page waits for them. Their scripts are not preloaded:
// on a slow link that takes bandwidth from the render-blocking styles.
function styles(chunks) {
  const found = new Set(),
    seen = new Set()
  const visit = (key) => {
    if (seen.has(key) || shell.has(key)) return
    seen.add(key)
    for (const css of manifest[key].css ?? []) found.add(css)
    for (const next of manifest[key].imports ?? []) visit(next)
  }
  for (const name of chunks) {
    if (!byChunk.has(name)) throw new Error(`No client chunk named ${name}`)
    byChunk.get(name).forEach(visit)
  }
  return [...found].map(
    (file) => `<link rel="stylesheet" crossorigin href="${base}${file}">`,
  )
}
const origin = new URL(
  template.match(/<meta property="og:url" content="([^"]+)"/)[1],
).origin
const escape = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
// The value is inserted as is: no $ patterns, since page text may contain them.
const replace = (html, pattern, value) => {
  const match = html.match(pattern)
  if (!match) throw new Error(`Template lacks ${pattern}`)
  return (
    html.slice(0, match.index) +
    (match[1] ?? '') +
    value +
    html.slice(match.index + match[0].length)
  )
}
const paths = routes.flatMap((route) =>
  locales.map((locale) => localePath(locale, route)),
)
let pages = 0,
  bytes = 0
for (const route of routes)
  for (const locale of locales) {
    const path = localePath(locale, route)
    const { html, head, chunks } = await renderPage(route, locale)
    const title =
      head.title === 'Surflane' ? 'Surflane' : `${head.title} | Surflane`
    const url = (target) => origin + localePath(target, route)
    let page = template
    page = replace(page, /(<html lang=")en"/, `${locale}"`)
    page = replace(page, /(<title>)[^<]*<\/title>/, `${escape(title)}</title>`)
    for (const name of ['name="description"', 'property="og:description"'])
      page = replace(
        page,
        new RegExp(`(<meta\\s+${name}\\s+content=")[^"]*"`),
        `${escape(head.description)}"`,
      )
    page = replace(
      page,
      /(<meta property="og:title" content=")[^"]*"/,
      `${escape(title)}"`,
    )
    page = replace(
      page,
      /(<meta property="og:url" content=")[^"]*"/,
      `${url(locale)}"`,
    )
    page = replace(
      page,
      /<\/head>/,
      [
        ...styles(chunks),
        `<link rel="canonical" href="${url(locale)}">`,
        ...locales.map(
          (other) =>
            `<link rel="alternate" hreflang="${other}" href="${url(other)}">`,
        ),
        `<link rel="alternate" hreflang="x-default" href="${url('en')}">`,
      ]
        .filter(Boolean)
        .map((line) => `  ${line}\n`)
        .join('') + '  </head>',
    )
    // The sidebar and top rail scroll to the current page before the first paint.
    page = replace(
      page,
      /<div id="root">()<\/div>/,
      `<div id="root" data-page="${path}" data-chunks="${chunks.join(' ')}">${html}</div>\n    <script>${revealScript}</script>`,
    )
    // Pages serves /components from components.html, and a folder of the same name
    // gets an index too, in case the folder answers first.
    const file = path === '/' ? 'index.html' : `${path.slice(1)}.html`
    const targets = [join(out, file)]
    if (
      path !== '/' &&
      (existsSync(join(out, path.slice(1))) ||
        paths.some((other) => other.startsWith(path + '/')))
    )
      targets.push(join(out, path.slice(1), 'index.html'))
    for (const target of targets) {
      mkdirSync(dirname(target), { recursive: true })
      writeFileSync(target, page)
    }
    pages++
    bytes += page.length
  }
console.log(
  `Prerendered ${pages} pages (${routes.length} routes × ${locales.length} languages), ${(bytes / 1024 / 1024).toFixed(1)} MB of HTML`,
)
