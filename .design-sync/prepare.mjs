// Prepares the inputs design-sync reads that the repo's own build doesn't write:
// 1. Per-component docs: the catalog's Markdown copy of each component, pattern and
//    foundation page (written by `npm run build:llms`), with the catalog group as
//    frontmatter `category`, so the synced project groups cards as the catalog does.
//    Foundation pages document the layout and type primitives; their category is the
//    page's own name. The public Markdown stays unchanged; the copies go to the
//    gitignored cache.
// 2. One stylesheet: @surflane/ui/all.css with its @imports inlined. design-sync
//    ships cfg.cssEntry verbatim, and it must sit inside the package, so it goes to
//    packages/ui/.design-sync-css/ (gitignored, outside the published `files`).
import { mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { components, patterns, foundations } = await import(
  join(root, 'demo/catalog.ts')
)
const docs = join(root, '.design-sync/.cache/docs')
rmSync(docs, { recursive: true, force: true })
mkdirSync(docs, { recursive: true })
let written = 0
for (const [items, dir] of [
  [components, 'components'],
  [patterns, 'patterns'],
  [foundations, 'foundations'],
]) {
  for (const item of items) {
    const source = join(root, 'demo/public', dir, `${item.id}.md`)
    if (!existsSync(source)) continue
    const category = dir === 'foundations' ? item.name : item.group
    writeFileSync(
      join(docs, `${item.id}.md`),
      `---\ncategory: ${category}\n---\n\n${readFileSync(source, 'utf8')}`,
    )
    written++
  }
}
console.log(`design-sync docs: ${written} pages into .design-sync/.cache/docs`)

const esbuild = createRequire(join(root, 'package.json'))('esbuild')
const result = await esbuild.build({
  stdin: {
    contents: "@import '@surflane/ui/all.css';",
    resolveDir: root,
    loader: 'css',
  },
  bundle: true,
  write: false,
  logLevel: 'error',
})
const css = join(root, 'packages/ui/.design-sync-css')
mkdirSync(css, { recursive: true })
writeFileSync(join(css, 'surflane.css'), result.outputFiles[0].text)
console.log(
  `design-sync css: ${(result.outputFiles[0].contents.length / 1024).toFixed(0)} KiB into packages/ui/.design-sync-css/surflane.css`,
)
