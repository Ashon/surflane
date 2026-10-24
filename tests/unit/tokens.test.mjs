// Token contracts: the namespace, theme selectors and the contrast each role promises.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { contrast, resolve } from './token-colors.mjs'

const tokensDir = new URL('../../packages/tokens/', import.meta.url)
const read = (file) => readFileSync(new URL(file, tokensDir), 'utf8')
// Tailwind's and shadcn's own names stay theirs: those bridges map onto --surf-*.
const ownFiles = [
  'tokens.css',
  'foundation-tokens.css',
  'typography-rendering.css',
  'motion.css',
  ...readdirSync(new URL('themes/', tokensDir)).map((file) => `themes/${file}`),
]

test('every custom property the token files declare is --surf-*', () => {
  for (const file of ownFiles) {
    const foreign = [...read(file).matchAll(/(?<![\w-])(--[\w-]+)\s*:/g)]
      .map((match) => match[1])
      .filter((name) => !name.startsWith('--surf-'))
    assert.deepEqual([...new Set(foreign)], [], file)
  }
})

test('data-theme selectors name only dark or light', () => {
  for (const file of [...ownFiles, 'shadcn.css']) {
    const loose = read(file).match(
      /\[data-theme(?=[\]=])(?!=['"](?:dark|light)['"]\])[^\]]*\]/g,
    )
    assert.equal(loose, null, `${file}: ${loose}`)
  }
})

// [foreground, background, minimum ratio]: the targets the color foundation states.
const pairs = [
  ['--surf-ink', '--surf-canvas', 4.5],
  ['--surf-ink-body', '--surf-canvas', 4.5],
  ['--surf-ink-muted', '--surf-canvas', 4.5],
  ['--surf-control-border', '--surf-canvas', 3],
  ...['success', 'caution', 'danger', 'info', 'progress', 'neutral'].flatMap(
    (tone) => [
      [`--surf-status-${tone}-fg`, `--surf-status-${tone}-bg`, 4.5],
      [`--surf-status-${tone}-border`, '--surf-canvas', 3],
    ],
  ),
]
for (const theme of ['dark', 'light'])
  for (const [foreground, background, minimum] of pairs)
    test(`${foreground} on ${background} reaches ${minimum}:1 in ${theme}`, () => {
      const ratio = contrast(foreground, background, theme)
      assert.ok(ratio >= minimum, `${ratio.toFixed(2)}:1`)
    })

test('brand as a mark reads at 3:1 on the light canvas', () => {
  assert.ok(contrast('--surf-brand-mark', '--surf-canvas', 'light') >= 3)
})

test('a slider fill reads 3:1 on its track and on the sheet in both themes', () => {
  // The pair Progress uses: the brand mark on the surface plane.
  for (const theme of ['dark', 'light']) {
    assert.ok(contrast('--surf-brand-mark', '--surf-slider-track', theme) >= 3)
    assert.ok(contrast('--surf-brand-mark', '--surf-canvas', theme) >= 3)
  }
})

test('a skeleton stays visible on the canvas in both themes', () => {
  // --surf-surface was 1.07:1 on white; the skeleton tokens keep a visible shape.
  for (const theme of ['dark', 'light'])
    assert.ok(contrast('--surf-skeleton-base', '--surf-canvas', theme) >= 1.2)
})

test('selected text stays visible on a selected row', () => {
  for (const theme of ['dark', 'light'])
    assert.ok(
      contrast('--surf-selection-background', '--surf-selected', theme) > 1.2,
    )
})

test('success is green, apart from the brand cyan', () => {
  const success = resolve('--surf-success', 'dark'),
    brand = resolve('--surf-brand', 'dark')
  assert.ok(success.h > 120 && success.h < 170, `hue ${success.h}`)
  assert.ok(Math.abs(success.h - brand.h) > 40)
})
