import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve, dirname, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
if (process.argv.slice(2).some((arg) => arg !== '--pack-only'))
  throw new Error('Usage: node scripts/distribute.mjs [--pack-only]')
const source = [
  'scripts/build-tokens.mjs',
  ...['tokens', 'css'].flatMap((name) =>
    readdirSync(resolve(root, 'packages', name), { recursive: true })
      .filter((f) => /\.(css|svg|js|ts)$/.test(f))
      .sort()
      .map((f) => `packages/${name}/${f}`),
  ),
  ...readdirSync(resolve(root, 'packages/ui/src'))
    .sort()
    .map((f) => 'packages/ui/src/' + f),
]
const hash = createHash('sha256')
for (const path of source)
  hash.update(path + '\0' + readFileSync(resolve(root, path), 'utf8') + '\0')
const manifests = {}
const names = ['tokens', 'css', 'ui']
for (const name of names) {
  manifests[name] = JSON.parse(
    readFileSync(resolve(root, 'packages', name, 'package.json'), 'utf8'),
  )
  const { version, ...rest } = manifests[name]
  hash.update(name + '\0' + JSON.stringify(rest) + '\0')
}
hash.update(readFileSync(resolve(root, 'packages/ui/tsconfig.json')))
// Local tarballs are content-addressed prereleases of the release version.
// The repository manifests keep the release version; only staged copies change.
const version = `${manifests.tokens.version}-dev.${hash.digest('hex').slice(0, 12)}`
execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' })
const artifacts = resolve(root, 'artifacts')
mkdirSync(artifacts, { recursive: true })
const stage = mkdtempSync(join(tmpdir(), 'surflane-pack-'))
try {
  for (const name of names) {
    const target = join(stage, name)
    cpSync(resolve(root, 'packages', name), target, {
      recursive: true,
      filter: (path) => !path.split(sep).includes('node_modules'),
    })
    const pkg = { ...manifests[name], version }
    // Build outputs are already staged; lifecycle scripts have no inputs here.
    delete pkg.scripts
    for (const peerName of ['@surflane/design-tokens', '@surflane/css'])
      if (pkg.peerDependencies?.[peerName])
        pkg.peerDependencies = { ...pkg.peerDependencies, [peerName]: version }
    writeFileSync(
      join(target, 'package.json'),
      JSON.stringify(pkg, null, 2) + '\n',
    )
    const output = JSON.parse(
      execFileSync('npm', ['pack', '--json', '--pack-destination', artifacts], {
        cwd: target,
        encoding: 'utf8',
      }),
    )
    console.log(`${pkg.name}: artifacts/${output[0].filename}`)
  }
} finally {
  rmSync(stage, { recursive: true, force: true })
}
