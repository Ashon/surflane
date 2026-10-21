import fs from 'node:fs'
import assert from 'node:assert/strict'
import zlib from 'node:zlib'
import path from 'node:path'
const root = path.resolve(import.meta.dirname, '../demo/dist')
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, '.vite/manifest.json'), 'utf8'),
)
const entry = Object.keys(manifest).find((key) => manifest[key].isEntry)
assert(entry, 'Catalog entry missing')
const initial = new Set()
function visit(key) {
  if (initial.has(key)) return
  assert(manifest[key], `Missing import ${key}`)
  initial.add(key)
  for (const dependency of manifest[key].imports ?? []) visit(dependency)
}
visit(entry)
const chunks = [...initial]
  .filter((key) => manifest[key].file.endsWith('.js'))
  .map((key) => {
    const file = manifest[key].file,
      contents = fs.readFileSync(path.join(root, file))
    return {
      key,
      file,
      bytes: contents.length,
      gzip: zlib.gzipSync(contents).length,
    }
  })
const initialJSBytes = chunks.reduce((sum, chunk) => sum + chunk.bytes, 0),
  initialJSGzip = chunks.reduce((sum, chunk) => sum + chunk.gzip, 0)
// Lowered from 384 KiB in 0.3.x, after module splitting and the deferred guide overlay
// brought the initial JS to about 323 KiB.
const budget = 336 * 1024
assert(
  initialJSBytes <= budget,
  `Initial catalog JS ${initialJSBytes} exceeds ${budget} byte budget`,
)
assert(
  [...initial].every((key) => !manifest[key].isDynamicEntry),
  'A lazy route is imported by the initial shell',
)
const sources = fs.readdirSync(path.resolve(root, '..')).filter(
  (name) =>
    /Examples?\.tsx$/.test(name) &&
    name !== 'ComponentExamples.tsx' &&
    name !== 'FormContractExample.tsx', // composition inside the form example group
)
const dynamic = Object.entries(manifest).filter(
  ([, value]) => value.isDynamicEntry,
)
for (const source of sources) {
  assert(
    dynamic.some(([key, value]) => key === source || value.src === source),
    `Example group must have its own dynamic entry: ${source}`,
  )
}
const result = {
  initialJSBytes,
  initialJSGzip,
  budget,
  chunks,
  dynamicEntries: dynamic.map(([key, value]) => ({ key, file: value.file })),
}
console.log(JSON.stringify(result, null, 2))
