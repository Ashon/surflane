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
                `^${file.split('/').pop().replace('.', '\\.').replace('*', '.+')}$`,
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
// Type goes through the role tokens: size, leading and weight come from --type-* and
// --weight-* (or the component size scheme), never a literal. Relative em sizes for
// inline code and a line-height of 1 for single-glyph chips stay allowed.
const typeSheets = [
  'packages/ui/src/styles.css',
  ...['controls', 'foundations', 'presentation', 'typography'].map(
    (name) => `packages/tokens/${name}.css`,
  ),
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
const literalCeiling = 125
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
const renderedClasses = new Set(componentSource.match(/pui-[a-z0-9-]+/g))
const selectedClasses = new Set(
  readFileSync('packages/ui/src/styles.css', 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .match(/[^{}]+(?=\{)/g)
    .flatMap((selector) => selector.match(/(?<=\.)pui-[a-z0-9-]+/g) ?? []),
)
const deadClasses = [...selectedClasses].filter(
  (name) => !renderedClasses.has(name) && !cssOnlyClasses.has(name),
)
assert.deepEqual(deadClasses, [], `Selected but never rendered: ${deadClasses}`)
console.log(
  `@surflane/ui: all ${selectedClasses.size} selected classes are rendered by a component`,
)
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
