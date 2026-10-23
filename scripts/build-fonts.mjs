// Writes the catalog's Pretendard into demo/fonts: only the glyphs its pages write, at the
// two weights the brand uses. Pretendard's own dynamic subsets split Hangul by frequency,
// so a Korean page pulled 14 to 18 of them (370–480 KB) and an English page one or more
// for a single 가. Here every Korean page shares one file, and the glyphs the catalog
// shows outside Korean pages get a small file of their own.
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import subsetFont from 'subset-font'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const demo = join(root, 'demo')
const out = join(demo, 'fonts')
const pretendard = join(root, 'node_modules/pretendard/dist/web/variable')
const pretendardVersion = JSON.parse(
  readFileSync(join(root, 'node_modules/pretendard/package.json'), 'utf8'),
).version
// Brand type rules: 400 and 500 only (packages/tokens/tokens.css).
const weight = { min: 400, max: 500 }
const hangul = [
  [0x1100, 0x11ff],
  [0x3130, 0x318f],
  [0xa960, 0xa97f],
  [0xac00, 0xd7a3],
  [0xd7b0, 0xd7ff],
]

function unicodeRanges(css) {
  return [...css.matchAll(/unicode-range:([^;]+);/g)].flatMap(([, list]) =>
    list.split(',').map((part) => {
      const [from, to = from] = part.trim().slice(2).split('-')
      return [parseInt(from, 16), parseInt(to, 16)]
    }),
  )
}
const covers = (ranges, code) =>
  ranges.some(([from, to]) => code >= from && code <= to)
const hex = (code) => code.toString(16).toUpperCase().padStart(4, '0')
function sources(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory())
      return ['dist', 'public', 'fonts'].includes(entry.name)
        ? []
        : sources(path)
    return /\.(tsx?|css|html)$/.test(entry.name) ? [path] : []
  })
}

// What each family draws: Pretendard only what Manrope and JetBrains Mono, which lead
// every stack and share Manrope's ranges, leave to it.
const pretendardRanges = unicodeRanges(
  readFileSync(
    join(pretendard, 'pretendardvariable-dynamic-subset.css'),
    'utf8',
  ),
)
const latinRanges = unicodeRanges(
  readFileSync(
    join(root, 'node_modules/@fontsource-variable/manrope/index.css'),
    'utf8',
  ),
)
const drawn = (text) =>
  [...new Set(Array.from(text, (char) => char.codePointAt(0)))].filter(
    (code) =>
      covers(pretendardRanges, code) &&
      (covers(hangul, code) || !covers(latinRanges, code)),
  )
// Korean the browser writes itself: dates, relative times and numbers the examples
// format with Intl.
const formatted = []
for (let month = 0; month < 12; month++)
  for (const options of [
    { dateStyle: 'full', timeStyle: 'long' },
    { weekday: 'short' },
    { weekday: 'narrow' },
    { hour: 'numeric', dayPeriod: 'long' },
  ])
    formatted.push(
      new Intl.DateTimeFormat('ko', options).format(
        new Date(2026, month, month + 1, month * 2),
      ),
    )
for (const unit of ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'])
  for (let value = -2; value <= 2; value++)
    formatted.push(
      new Intl.RelativeTimeFormat('ko', { numeric: 'auto' }).format(
        value,
        unit,
      ),
    )
for (let power = 0; power < 16; power++)
  formatted.push(
    new Intl.NumberFormat('ko', { notation: 'compact' }).format(10 ** power),
  )
const files = sources(demo)
const all = drawn(
  [...files.map((file) => readFileSync(file, 'utf8')), ...formatted].join(''),
)
// The shell draws these on every page, Korean or not (the 가 of the language switch),
// and the symbols outside Manrope can appear on any page too.
const shell = drawn(readFileSync(join(demo, 'App.tsx'), 'utf8'))
const common = [
  ...new Set([...shell, ...all.filter((code) => !covers(hangul, code))]),
].sort((a, b) => a - b)
const korean = all.filter((code) => covers(hangul, code)).sort((a, b) => a - b)

const faces = [
  // Any Hangul, so text the catalog never wrote still reaches this face; its missing
  // glyphs fall through to the system Hangul fonts later in the stack.
  { file: 'pretendard-hangul.woff2', codes: korean, range: hangul },
  // Defined last, so it answers for its glyphs: a page without Korean text loads
  // only this one.
  {
    file: 'pretendard-common.woff2',
    codes: common,
    range: common.map((code) => [code, code]),
  },
]
const stamp = JSON.stringify({
  pretendardVersion,
  weight,
  faces: faces.map(({ file, codes }) => [file, String.fromCodePoint(...codes)]),
})
const stampFile = join(out, 'stamp.json')
if (
  existsSync(stampFile) &&
  readFileSync(stampFile, 'utf8') === stamp &&
  faces.every(({ file }) => existsSync(join(out, file)))
) {
  console.log('Catalog fonts are current.')
  process.exit(0)
}

mkdirSync(out, { recursive: true })
const font = readFileSync(join(pretendard, 'woff2/PretendardVariable.woff2'))
let css = `/* Generated by scripts/build-fonts.mjs from Pretendard ${pretendardVersion}.
Copyright (c) 2021 Kil Hyung-jin, with Reserved Font Name Pretendard.
Licensed under the SIL Open Font License, Version 1.1 (https://openfontlicense.org). */
`
for (const { file, codes, range } of faces) {
  const subset = await subsetFont(font, String.fromCodePoint(...codes), {
    targetFormat: 'woff2',
    variationAxes: { wght: weight },
    // Copyright, license and license URL travel with the font.
    preserveNameIds: [0, 13, 14],
  })
  writeFileSync(join(out, file), subset)
  css += `
@font-face {
  font-family: 'Pretendard Variable';
  font-style: normal;
  font-display: swap;
  font-weight: ${weight.min} ${weight.max};
  src: url(./${file}) format('woff2-variations');
  unicode-range: ${range
    .map(([from, to]) => 'U+' + hex(from) + (to === from ? '' : '-' + hex(to)))
    .join(', ')};
}
`
  console.log(
    `${file}: ${codes.length} glyphs, ${(subset.length / 1024).toFixed(1)} KB`,
  )
}
writeFileSync(join(out, 'pretendard.css'), css)
writeFileSync(stampFile, stamp)
