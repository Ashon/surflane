// Token contracts: the namespace, theme selectors and the contrast each role promises.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { differenceEuclidean } from 'culori'
import { contrast, resolve } from './token-colors.mjs'

// How far two colors sit apart, and every pair of a list's places.
const separate = differenceEuclidean('oklab')
function* combinations(length) {
  for (let a = 0; a < length; a++)
    for (let b = a + 1; b < length; b++) yield [a, b]
}

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
      // A BottomNavigation badge's count, in canvas color on the tone's fill.
      ['--surf-canvas', `--surf-status-${tone}-fg`, 4.5],
      // A Stat's status text, and its value past a threshold, on a card.
      [`--surf-status-${tone}-fg`, '--surf-surface', 4.5],
    ],
  ),
  // Every categorical chart color reads as a mark on the sheet and on a card.
  ...Array.from({ length: 24 }, (_, index) => [
    [`--surf-chart-category-${index + 1}`, '--surf-canvas', 3],
    [`--surf-chart-category-${index + 1}`, '--surf-surface', 3],
  ]).flat(),
]
for (const theme of ['dark', 'light'])
  for (const [foreground, background, minimum] of pairs)
    test(`${foreground} on ${background} reaches ${minimum}:1 in ${theme}`, () => {
      const ratio = contrast(foreground, background, theme)
      assert.ok(ratio >= minimum, `${ratio.toFixed(2)}:1`)
    })

// Contrast says a mark is visible; it does not say two marks differ. The categorical
// ramp must also keep its colors apart, or a twenty-four series chart reads as a
// repeat. 0.05 in OKLab is what a set that large can be: the twenty hues designers
// reach for, Tableau's, sit at 0.054 at its closest pair. The twelve reach 0.092
// dark and 0.087 light; the second dozen hold the floor.
test('the categorical ramp keeps every pair of its colors apart', () => {
  for (const theme of ['dark', 'light']) {
    const colors = Array.from({ length: 24 }, (_, index) =>
      resolve(`--surf-chart-category-${index + 1}`, theme),
    )
    for (const [a, b] of combinations(colors.length)) {
      const away = separate(colors[a], colors[b])
      assert.ok(
        away >= 0.05,
        `category-${a + 1} and category-${b + 1} in ${theme}: ${away.toFixed(3)}`,
      )
    }
  }
})
test('brand as a mark reads at 3:1 on the light canvas', () => {
  assert.ok(contrast('--surf-brand-mark', '--surf-canvas', 'light') >= 3)
})

test('a brand mark reads 3:1 on either recessed track, and beside a selected fill', () => {
  // A track is --surf-recessed: the surface on the sheet, the canvas in a card. A
  // range end sits beside in-range days on --surf-selected.
  for (const theme of ['dark', 'light']) {
    assert.ok(contrast('--surf-brand-mark', '--surf-surface', theme) >= 3)
    assert.ok(contrast('--surf-brand-mark', '--surf-canvas', theme) >= 3)
    assert.ok(contrast('--surf-brand-mark', '--surf-selected', theme) >= 3)
  }
})

test("a selected row's edge reads 3:1 against its fill and the sheet", () => {
  for (const theme of ['dark', 'light']) {
    assert.ok(contrast('--surf-selected-edge', '--surf-selected', theme) >= 3)
    assert.ok(contrast('--surf-selected-edge', '--surf-canvas', theme) >= 3)
  }
})

test('a focus ring drawn inside a filled day reads 3:1 on that fill', () => {
  // Calendar days ring inside themselves: the shared color on a selected day,
  // the color written on brand on a range end.
  for (const theme of ['dark', 'light']) {
    assert.ok(
      contrast('--surf-interaction-focus', '--surf-selected', theme) >= 3,
    )
    assert.ok(contrast('--surf-on-brand', '--surf-brand-mark', theme) >= 3)
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
