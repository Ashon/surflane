// Flattens @surflane/ui stylesheets for publishing.
//
// In src, each stylesheet imports the stylesheets it needs, so a bundler that keeps the
// first of duplicate imports (Vite, webpack) loads every file once, dependencies first.
// Tailwind CSS and plain @import keep every duplicate, and nested imports multiply them.
// The published files never nest: dist/css/rules/ holds each stylesheet's rules alone,
// and every entry lists the rule files it needs, once each, in the order styles.css
// loads them.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = resolve(root, 'packages/ui/src')
const out = resolve(root, 'packages/ui/dist/css')
const importPattern = /^@import '([^']+)';\n/gm

const read = (name) => readFileSync(resolve(src, `${name}.css`), 'utf8')
const importsOf = (name) =>
  [...read(name).matchAll(importPattern)].map((match) =>
    match[1].startsWith('./') ? match[1].slice(2, -4) : match[1],
  )
const isLocal = (unit) => !unit.startsWith('@')
const layerOrder = read('styles').match(/@layer [^;{]+;/)[0]

// The global order: depth-first from styles.css, each unit at its first import.
const order = []
const visit = (unit) => {
  if (order.includes(unit)) return
  if (isLocal(unit)) for (const dep of importsOf(unit)) visit(dep)
  if (unit !== 'styles') order.push(unit)
}
visit('styles')

const closure = (name) => {
  const seen = new Set()
  const walk = (unit) => {
    if (seen.has(unit)) return
    seen.add(unit)
    if (isLocal(unit)) for (const dep of importsOf(unit)) walk(dep)
  }
  walk(name)
  return order.filter((unit) => seen.has(unit))
}
const line = (unit) =>
  `@import '${isLocal(unit) ? `./rules/${unit}.css` : unit}';\n`
const pkg = JSON.parse(
  readFileSync(resolve(root, 'packages/ui/package.json'), 'utf8'),
)
const entries = Object.keys(pkg.exports)
  .filter((entry) => entry.endsWith('.css'))
  .map((entry) => entry.slice(2, -4))
  .filter((name) => !['styles', 'all'].includes(name))

rmSync(out, { recursive: true, force: true })
mkdirSync(resolve(out, 'rules'), { recursive: true })
for (const unit of order.filter(isLocal)) {
  const text = read(unit).replace(importPattern, '')
  writeFileSync(resolve(out, 'rules', `${unit}.css`), text)
}
const header = (comment) => `/* ${comment} */\n${layerOrder}\n`
for (const name of entries)
  writeFileSync(
    resolve(out, `${name}.css`),
    header(read(name).match(/^\/\* (.*?) \*\//)[1]) +
      line('@surflane/design-tokens/tokens.css') +
      closure(name)
        .filter((unit) => unit !== '@surflane/design-tokens/tokens.css')
        .map(line)
        .join(''),
  )
writeFileSync(
  resolve(out, 'styles.css'),
  header('Every component stylesheet, once each, in cascade order.') +
    order.map(line).join(''),
)
writeFileSync(
  resolve(out, 'all.css'),
  readFileSync(resolve(src, 'all.css'), 'utf8'),
)
console.log(
  `@surflane/ui: ${order.filter(isLocal).length} rule files, ${entries.length} entries flattened into dist/css`,
)
