import { execFileSync } from 'node:child_process'
import { copyFileSync } from 'node:fs'
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
  ['vite', 'build', 'demo', '--base', base, '--outDir', out, '--emptyOutDir'],
  { cwd: root, stdio: 'inherit' },
)
// Pages has no SPA fallback: it answers unknown paths with 404.html, which boots the catalog router.
copyFileSync(join(out, 'index.html'), join(out, '404.html'))
console.log(`Catalog for GitHub Pages: artifacts/pages (base ${base})`)
