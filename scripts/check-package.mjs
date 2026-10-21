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
