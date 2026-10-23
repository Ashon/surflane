import { execFileSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
// A project site is served from /<repository>/; a custom domain serves from /.
const { values } = parseArgs({
  options: { base: { type: 'string', default: '/' } },
})
const base = values.base.replace(/\/*$/, '/')
if (!base.startsWith('/'))
  throw new Error('Usage: node scripts/build-pages.mjs [--base /path/]')
const out = join(root, 'artifacts/pages')
execFileSync(
  'npx',
  [
    'vite',
    'build',
    'demo',
    '--base',
    base,
    '--outDir',
    out,
    '--emptyOutDir',
    '--manifest',
  ],
  { cwd: root, stdio: 'inherit' },
)
// Every page as static HTML, and 404.html for the paths Pages has no file for.
execFileSync(
  'node',
  ['scripts/prerender.mjs', '--base', base, '--outDir', out],
  { cwd: root, stdio: 'inherit' },
)
// The manifest only told the prerender which files each page needs.
rmSync(join(out, '.vite'), { recursive: true, force: true })
console.log(`Catalog for GitHub Pages: artifacts/pages (base ${base})`)
