import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createHash } from 'node:crypto'
import { publicSourceFiles, root } from './public-source.mjs'

// Hash retired identifiers to avoid carrying their plain text into the export.
const retired = new Set([
  'ed9980025e312ded3dcafd15abdf78ea4c8aa98d4bbe8af6996e3b65b243ac13',
  '3369cb2dd677ced55342d08f1cdab93bb0c7db4333ddfd30ba4a60f171587d06',
  'd70a5c6f0f629a3a22de121781f960591c334dd54c2b2651006fd9e01ac6cedb',
  'f39bf0ce36e210a1cfe8f8de7a5bfc8f7f109536cd2c14c8142fc5930b621ab2',
  '911dc50e20549f24c1044d86a0ebcf692cdc009ece51141def615bceebd599c3',
  'd08f61d4f37798236a390c7843b4f640a6193230ebdb5f41e9a91870811cd652',
  '165bbb6307c373bfb3761c4b3ae7e24300857e5e920c4a696f99e516829cbc29',
  '4c0ea74a3b2d9062c466e2a3fef3ab0a25ca2e6cbac8e5e1443f52ea6034d5d1',
  '4d4c1127d501817231cf61295801eb0b10b298ff022802ad1d504d182eb0aac2',
  'd03d65cc4bffc87f5b18133fc8be15afad270cba69788581a4bd0f1170f545a4',
])
const privateContext =
  /https?:\/\/[^\s"'<>]*(?:slack\.com|notion\.(?:com|so))|(?:10\.\d{1,3}|192\.168)\.\d{1,3}\.\d{1,3}|\/(?:Users|home)\/[^\s"'<>]+|-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/i
const failures = []
for (const file of publicSourceFiles()) {
  const text = readFileSync(resolve(root, file), 'utf8')
  const words = (text.toLowerCase().match(/[a-z][a-z0-9-]*/g) ?? []).flatMap(
    (word) => [word, ...word.split('-')],
  )
  if (
    words.some((word) =>
      retired.has(createHash('sha256').update(word).digest('hex')),
    )
  )
    failures.push(`${file}: retired identifier`)
  if (privateContext.test(text))
    failures.push(`${file}: private URL, address, path or key`)
}
if (failures.length) throw new Error(failures.join('\n'))
console.log(
  `Public-context scan passed (${publicSourceFiles().length} source files)`,
)
