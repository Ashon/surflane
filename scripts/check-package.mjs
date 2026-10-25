import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { gzipSync } from 'node:zlib'
import { build } from 'esbuild'

for (const name of ['ui', 'tokens']) {
  const root = resolve('packages', name)
  const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
  for (const [entry, target] of Object.entries(pkg.exports)) {
    for (const file of typeof target === 'string'
      ? [target]
      : Object.values(target))
      assert(
        file.includes('*')
          ? // A subpath pattern needs at least one matching file.
            readdirSync(resolve(root, dirname(file))).some((name) =>
              new RegExp(
                `^${file
                  .split('/')
                  .pop()
                  .split('*')
                  .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
                  .join('.+')}$`,
              ).test(name),
            )
          : existsSync(resolve(root, file)),
        `${pkg.name}${entry}: missing ${file}`,
      )
  }
  for (const file of ['LICENSE-MIT', 'LICENSE-APACHE'])
    assert.equal(
      readFileSync(resolve(root, file), 'utf8'),
      readFileSync(file, 'utf8'),
      `${pkg.name}: ${file} differs from the repository license`,
    )
  assert.equal(pkg.license, 'MIT OR Apache-2.0', `${pkg.name}: license`)
}
// Server Components cannot dot into client exports: each namespace part needs a flat name.
// Type goes through the role tokens: size, leading and weight come from --surf-type-* and
// --surf-weight-* (or the component size scheme), never a literal. Relative em sizes for
// inline code and a line-height of 1 for single-glyph chips stay allowed.
const cssIn = (dir) =>
  readdirSync(dir)
    .filter((name) => name.endsWith('.css'))
    .map((name) => `${dir}/${name}`)
const uiSheets = cssIn('packages/ui/src')
const typeSheets = [
  ...uiSheets,
  ...cssIn('packages/css/presentation'),
  ...cssIn('packages/css/foundations'),
  'packages/css/controls.css',
  'packages/css/typography.css',
]
const literalType = typeSheets.flatMap((file) =>
  readFileSync(file, 'utf8')
    .split('\n')
    .map((line, index) => [line.trim(), `${file}:${index + 1}`])
    .filter(([line]) =>
      /^(font-size:\s*[\d.]+px|line-height:\s*[\d.]+px|font-weight:\s*\d|font:\s*\d|font:.*\b\d+px\b)/.test(
        line,
      ),
    )
    .map(([line, at]) => `${at} ${line}`),
)
assert.deepEqual(
  literalType,
  [],
  `Literal type values:\n${literalType.join('\n')}`,
)
console.log(
  `@surflane: ${typeSheets.length} package stylesheets set type through role tokens`,
)
// Other lengths and durations move to tokens over time. The count may only fall: lower
// it when values move to tokens, never raise it. 0, 1px hairlines and @media
// conditions stay literal.
const literalCeiling = 108
const literalLengths = typeSheets
  .map((file) => readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''))
  .flatMap((css) => css.split('\n'))
  .map((line) => line.trim())
  .filter((line) => !/^(@|--)/.test(line) && /:.*;$/.test(line))
  .flatMap(
    (line) =>
      line
        .slice(line.indexOf(':') + 1)
        .match(/(?<![\w.#-])-?\d*\.?\d+(?:px|ms|s)\b/g) ?? [],
  )
  .filter((value) => !['0px', '1px', '-1px', '0s', '0ms'].includes(value))
assert(
  literalLengths.length <= literalCeiling,
  `${literalLengths.length} literal lengths in package CSS, above the ceiling of ${literalCeiling}; use a token`,
)
console.log(
  `@surflane: ${literalLengths.length} literal lengths remain (ceiling ${literalCeiling})`,
)
// Every class a component stylesheet selects is one a component renders, so a renamed
// part cannot leave rules behind.
const cssOnlyClasses = new Set()
const componentSource = readdirSync('packages/ui/src')
  .filter((name) => /\.tsx?$/.test(name))
  .map((name) => readFileSync(`packages/ui/src/${name}`, 'utf8'))
  .join('\n')
const renderedClasses = new Set(componentSource.match(/surf-[a-z0-9-]+/g))
const selectorsOf = (css) =>
  new Set(
    (css.replace(/\/\*[\s\S]*?\*\//g, '').match(/[^{}]+(?=\{)/g) ?? []).flatMap(
      (selector) => selector.match(/(?<=\.)surf-[a-z0-9-]+/g) ?? [],
    ),
  )
const selectedClasses = selectorsOf(
  uiSheets.map((file) => readFileSync(file, 'utf8')).join('\n'),
)
const deadClasses = [...selectedClasses].filter(
  (name) => !renderedClasses.has(name) && !cssOnlyClasses.has(name),
)
assert.deepEqual(deadClasses, [], `Selected but never rendered: ${deadClasses}`)
console.log(
  `@surflane/ui: all ${selectedClasses.size} selected classes are rendered by a component`,
)
// And the reverse: every class a component renders has a rule in the package, so a
// misspelled or missing class fails here instead of changing what the reader sees.
// Hooks name a part for apps and tests to select; the classes beside them style it.
const hookClasses = new Set([
  'surf-combobox-section',
  'surf-date-range-picker',
  'surf-meter',
  'surf-navigation-item',
  'surf-page-header-breadcrumb',
  'surf-preview-trigger',
  'surf-select-group',
  'surf-table-message',
  'surf-table-sort-header',
])
const styledClasses = selectorsOf(
  typeSheets.map((file) => readFileSync(file, 'utf8')).join('\n'),
)
// Custom property names such as --surf-status-progress are not classes.
const unstyledClasses = [
  ...new Set(componentSource.match(/(?<![\w-])surf-[a-z0-9-]+/g)),
].filter((name) => !styledClasses.has(name) && !hookClasses.has(name))
assert.deepEqual(
  unstyledClasses,
  [],
  `Rendered but never styled: ${unstyledClasses}`,
)
const staleHooks = [...hookClasses].filter(
  (name) => styledClasses.has(name) || !renderedClasses.has(name),
)
assert.deepEqual(
  staleHooks,
  [],
  `Hook classes to drop from the list: ${staleHooks}`,
)
console.log(
  `@surflane/ui: every rendered class has a rule, apart from ${hookClasses.size} hooks`,
)
// Components render only surf- classes, so an app's own .form-control or .scroll-area
// never styles them.
const unprefixed = [
  ...new Set(
    (componentSource.match(/'[a-z][a-z0-9 -]*'/g) ?? [])
      .map((literal) => literal.slice(1, -1).split(' '))
      .filter((names) => names.some((name) => name.startsWith('surf-')))
      .flat()
      .filter((name) => !name.startsWith('surf-')),
  ),
]
assert.deepEqual(unprefixed, [], `Unprefixed classes: ${unprefixed}`)
const ui = JSON.parse(readFileSync('packages/ui/package.json', 'utf8'))
let flatNames = 0
for (const [entry, target] of Object.entries(ui.exports)) {
  if (typeof target === 'string') continue
  const mod = await import(
    pathToFileURL(resolve('packages/ui', target.import)).href
  )
  for (const [name, value] of Object.entries(mod)) {
    if (!value || typeof value !== 'object' || '$$typeof' in value) continue
    if (Array.isArray(value)) continue
    for (const key of Object.keys(value).filter((k) => /^[A-Z]/.test(k))) {
      assert.equal(
        mod[name + key],
        value[key],
        `@surflane/ui${entry.slice(1)}: ${name}.${key} needs flat export ${name}${key}`,
      )
      flatNames++
    }
  }
}
console.log(`@surflane/ui: ${flatNames} namespace parts have flat exports`)
// Each catalog page that documents a module is its entry point: /components/checkbox
// is @surflane/ui/checkbox. Internal modules have no entry point.
const internalModules = [
  'index',
  'parts',
  'size',
  'class-names',
  'element-part',
  'choice',
  'panel',
  'status',
  'form-state',
  'dialog-focus',
  'syntax-context',
  'syntax-engine',
  'tone-transition',
  'table-selection',
]
const utilityEntries = [
  'choice-label',
  'format',
  'icon',
  'sizing',
  'slot',
  'syntax-highlighting',
]
const sourceFiles = readdirSync('packages/ui/src').filter((name) =>
  /\.tsx?$/.test(name),
)
const publicModules = sourceFiles
  .map((name) => name.replace(/\.tsx?$/, ''))
  .filter((name) => !internalModules.includes(name))
const entries = Object.keys(ui.exports)
  .filter((entry) => entry !== '.' && !/\.(css|json)$/.test(entry))
  .map((entry) => entry.slice(2))
assert.deepEqual(
  entries.toSorted(),
  publicModules.toSorted(),
  'Each public module needs an entry point, and each entry point a module',
)
const { components, patterns, foundations } = await import('../demo/catalog.ts')
const pages = new Set(
  [...components, ...patterns, ...foundations].map(({ id }) => id),
)
const unnamed = entries.filter(
  (entry) => !pages.has(entry) && !utilityEntries.includes(entry),
)
assert.deepEqual(unnamed, [], `Entry points without a catalog page: ${unnamed}`)
const unexported = components
  .filter(({ id, stage }) => stage !== 'planned' && !entries.includes(id))
  .map(({ id }) => id)
assert.deepEqual(
  unexported,
  [],
  `Catalog components without an entry point: ${unexported}`,
)
console.log(
  `@surflane/ui: ${entries.length} entry points, one per catalog page or utility`,
)
// Glyphs come from Icon. Inline SVG stays only for marks that are not glyphs: the
// checkbox tick, the menu radio dot, the spinner, chart legend swatches and sparklines.
const svgModules = sourceFiles.filter((name) =>
  /<svg\b/.test(readFileSync(`packages/ui/src/${name}`, 'utf8')),
)
assert.deepEqual(
  svgModules.toSorted(),
  [
    'chart.tsx',
    'checkbox.tsx',
    'icon.tsx',
    'menu.tsx',
    'sparkline.tsx',
    'spinner.tsx',
  ],
  `Inline SVG outside Icon: ${svgModules}`,
)
// Every stylesheet in both packages declares the same layer order first.
const layerOrder = readFileSync('packages/tokens/tokens.css', 'utf8').match(
  /@layer [^;{]+;/,
)[0]
const packageSheets = [
  ...uiSheets,
  ...[
    'packages/tokens',
    'packages/css',
    'packages/css/presentation',
    'packages/css/foundations',
    'packages/tokens/themes',
  ].flatMap(cssIn),
].filter((file) => !/(tailwind)\.css$/.test(file))
const unordered = packageSheets.filter(
  (file) =>
    readFileSync(file, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .trim()
      .split(/\s+/)
      .join(' ')
      .indexOf(layerOrder.split(/\s+/).join(' ')) !== 0,
)
assert.deepEqual(
  unordered,
  [],
  `Stylesheets without the layer order first: ${unordered}`,
)
// Each public module with styles has a stylesheet entry of its own name, which bundles the
// rules for every class the module renders, directly or through the modules it imports.
const cssEntries = Object.keys(ui.exports)
  .filter(
    (entry) =>
      entry.endsWith('.css') && !['./styles.css', './all.css'].includes(entry),
  )
  .map((entry) => entry.slice(2, -4))
const styled = publicModules.filter((name) =>
  existsSync(`packages/ui/src/${name}.css`),
)
assert.deepEqual(
  cssEntries.toSorted(),
  styled.toSorted(),
  'Each public module with a stylesheet needs a .css entry, and each .css entry a module',
)
const aggregate = readFileSync('packages/ui/src/styles.css', 'utf8')
const unlisted = cssEntries.filter(
  (name) => !aggregate.includes(`'./${name}.css'`),
)
assert.deepEqual(unlisted, [], `styles.css misses ${unlisted}`)
const importsOf = (file) =>
  [...readFileSync(file, 'utf8').matchAll(/@import '\.\/([a-z-]+)\.css'/g)].map(
    (m) => m[1],
  )
const imported = new Set(uiSheets.flatMap(importsOf))
const orphans = uiSheets
  .map((file) => file.slice('packages/ui/src/'.length, -4))
  .filter(
    (name) =>
      !['styles', 'all'].includes(name) &&
      !cssEntries.includes(name) &&
      !imported.has(name),
  )
assert.deepEqual(orphans, [], `Stylesheets nothing imports: ${orphans}`)
const bundleCss = async (entry) =>
  (
    await build({
      stdin: {
        contents: `@import '${entry}';`,
        resolveDir: process.cwd(),
        loader: 'css',
      },
      bundle: true,
      write: false,
      logLevel: 'silent',
    })
  ).outputFiles[0].text
const styledEverywhere = selectorsOf(await bundleCss('@surflane/ui/styles.css'))
const jsImports = (name) => {
  const file = existsSync(`packages/ui/src/${name}.tsx`)
    ? `packages/ui/src/${name}.tsx`
    : `packages/ui/src/${name}.ts`
  return [
    ...readFileSync(file, 'utf8').matchAll(/from '\.\/([a-z-]+)\.js'/g),
  ].map((m) => m[1])
}
const renders = (name, seen = new Set()) => {
  if (seen.has(name)) return new Set()
  seen.add(name)
  const file = existsSync(`packages/ui/src/${name}.tsx`)
    ? `packages/ui/src/${name}.tsx`
    : `packages/ui/src/${name}.ts`
  const out = new Set(
    readFileSync(file, 'utf8').match(/(?<![a-z0-9-])surf-[a-z0-9-]+/g),
  )
  for (const dep of jsImports(name))
    for (const c of renders(dep, seen)) out.add(c)
  return out
}
for (const name of cssEntries) {
  const own = selectorsOf(await bundleCss(`@surflane/ui/${name}.css`))
  const missing = [...renders(name)].filter(
    (c) => styledEverywhere.has(c) && !own.has(c),
  )
  assert.deepEqual(
    missing,
    [],
    `@surflane/ui/${name}.css misses rules for ${missing}`,
  )
}
console.log(
  `@surflane/ui: ${cssEntries.length} stylesheet entries each style everything their module renders`,
)
// Published stylesheets never nest imports. Tailwind CSS and plain @import keep every
// duplicate, so a nested graph would repeat shared rules many times over.
const dist = 'packages/ui/dist/css'
const nested = cssIn(`${dist}/rules`).filter((file) =>
  readFileSync(file, 'utf8').includes('@import'),
)
assert.deepEqual(nested, [], `Published rule files import others: ${nested}`)
const flatOrder = [
  ...readFileSync(`${dist}/styles.css`, 'utf8').matchAll(/@import '([^']+)'/g),
].map((match) => match[1])
for (const file of cssIn(dist).filter((file) => !file.endsWith('/all.css'))) {
  const listed = [
    ...readFileSync(file, 'utf8').matchAll(/@import '([^']+)'/g),
  ].map((match) => match[1])
  const unknown = listed.filter(
    (unit) =>
      !flatOrder.includes(unit) &&
      unit !== '@surflane/design-tokens/tokens.css',
  )
  assert.deepEqual(
    unknown,
    [],
    `${file} imports outside the rule files: ${unknown}`,
  )
  const positions = listed
    .filter((unit) => flatOrder.includes(unit))
    .map((unit) => flatOrder.indexOf(unit))
  assert.deepEqual(
    positions,
    positions.toSorted((a, b) => a - b),
    `${file} lists its rule files out of cascade order`,
  )
}
console.log(
  `@surflane/ui: published stylesheets list ${flatOrder.length} rule files once each, in cascade order`,
)
// Optional peers stay off the root entry, including its dynamic imports: an app that
// installs none of them must still bundle every root export.
const optionalPeers = Object.entries(ui.peerDependenciesMeta ?? {})
  .filter(([, meta]) => meta.optional)
  .map(([name]) => name)
const reachesPeers = async (entry) => {
  const reached = new Set()
  await build({
    stdin: { contents: `export * from '${entry}';`, resolveDir: process.cwd() },
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    logLevel: 'silent',
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    loader: { '.css': 'empty' },
    plugins: [
      {
        name: 'optional-peers',
        setup(build) {
          build.onResolve({ filter: /^[@a-z]/ }, ({ path, importer }) => {
            const peer = optionalPeers.find(
              (name) => path === name || path.startsWith(`${name}/`),
            )
            if (!peer) return
            reached.add(`${peer} (from ${importer.split('packages/ui/')[1]})`)
            return { path, external: true }
          })
        },
      },
    ],
  })
  return [...reached]
}
const rootPeers = await reachesPeers('@surflane/ui')
assert.equal(
  rootPeers.length,
  0,
  `@surflane/ui reaches optional peers: ${rootPeers.join(', ')}`,
)
assert(
  (await reachesPeers('@surflane/ui/chart')).length > 0,
  'Peer check is blind',
)
console.log(
  `@surflane/ui: the root entry reaches none of ${optionalPeers.length} optional peers`,
)
const sizes = []
for (const entry of ['@surflane/ui', '@surflane/ui/button']) {
  const result = await build({
    stdin: {
      contents: `export { Button } from '${entry}';`,
      resolveDir: process.cwd(),
    },
    bundle: true,
    write: false,
    minify: true,
    format: 'esm',
    platform: 'browser',
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    metafile: true,
  })
  const output = result.outputFiles[0].contents
  const included = Object.values(result.metafile.outputs).flatMap((out) =>
    Object.entries(out.inputs)
      .filter(([, value]) => value.bytesInOutput > 0)
      .map(([path]) => path),
  )
  assert(
    !included.some((path) =>
      /(?:select|popover|chart|markdown|shiki|recharts)[/.-]/i.test(path),
    ),
    `Button retains unrelated modules: ${included.join(', ')}`,
  )
  assert(output.length < 16 * 1024, `${entry}: Button exceeds 16 KiB JS budget`)
  assert(
    gzipSync(output).length < 6 * 1024,
    `${entry}: Button exceeds 6 KiB gzip budget`,
  )
  sizes.push(output.length)
  console.log(
    `${entry}: ${output.length} bytes JS, ${gzipSync(output).length} bytes gzip (React/CSS excluded)`,
  )
}
assert(
  Math.abs(sizes[0] - sizes[1]) < 256,
  'Root import regressed versus the component entry point',
)
