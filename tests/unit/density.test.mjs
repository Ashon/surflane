// Density contracts: the compact roles, their order, and how components read them.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { rawValue } from './token-colors.mjs'

const packages = new URL('../../packages/', import.meta.url)
const catalog = JSON.parse(
  readFileSync(new URL('tokens/catalog.json', packages), 'utf8'),
)
const byName = new Map(catalog.tokens.map((token) => [token.name, token]))
const compactScope = '[data-ui-density="compact"]'
const defaultScope = '[data-ui-density="default"]'

// The arguments of a function call, split on its top-level commas.
function args(value) {
  const inner = value.slice(value.indexOf('(') + 1, -1)
  const parts = []
  let depth = 0
  let start = 0
  for (let i = 0; i < inner.length; i++) {
    if (inner[i] === '(') depth++
    else if (inner[i] === ')') depth--
    else if (inner[i] === ',' && depth === 0) {
      parts.push(inner.slice(start, i).trim())
      start = i + 1
    }
  }
  parts.push(inner.slice(start).trim())
  return parts
}
// A length token in px, through its aliases and max().
function px(value) {
  const expression = value.trim()
  if (/^-?\d+(\.\d+)?px$/.test(expression)) return parseFloat(expression)
  if (expression.startsWith('var(')) return px(rawValue(args(expression)[0]))
  if (expression.startsWith('max('))
    return Math.max(...args(expression).map(px))
  throw new Error(`Cannot read ${expression} as px`)
}
function variant(name, context) {
  const found = byName
    .get(name)
    ?.variants.find((variant) => variant.context === context)
  assert.ok(found, `${name} has no ${context} value`)
  return found.value
}
const role = (name) => px(variant(`--surf-ui-density-${name}`, compactScope))

test('compact roles grow from the inside out, on the 4px grid', () => {
  const [item, inset, padding, gap, section, rowPadding] = [
    'item',
    'inset',
    'padding',
    'gap',
    'section',
    'row-padding',
  ].map(role)
  assert.ok(item < inset, `item ${item} < inset ${inset}`)
  assert.ok(inset < padding, `inset ${inset} < padding ${padding}`)
  assert.ok(padding <= gap, `padding ${padding} <= gap ${gap}`)
  assert.ok(gap < section, `gap ${gap} < section ${section}`)
  assert.ok(rowPadding <= item, `row padding ${rowPadding} <= item ${item}`)
  for (const [name, value] of Object.entries({
    item,
    inset,
    padding,
    gap,
    section,
    rowPadding,
  }))
    assert.equal(value % 4, 0, `${name} ${value}px is off the 4px grid`)
})

test('a compact row keeps the 24px target and never outgrows the default row', () => {
  const row = role('row')
  const floor = px(rawValue('--surf-control-target-size-min'))
  assert.equal(floor, 24)
  assert.ok(row >= floor, `row ${row}px >= target ${floor}px`)
  assert.ok(row <= px(rawValue('--surf-size-row-default')))
  assert.equal(row % 4, 0)
  assert.equal(
    px(variant('--surf-control-target-size', compactScope)),
    floor,
    'compact controls keep the 24px target, not the 44px one',
  )
})

test('compact layout is tighter than the phone layout it may meet', () => {
  for (const name of ['page-inset', 'gutter', 'section-gap']) {
    const token = `--surf-layout-${name}`
    const desktop = px(variant(token, ':root'))
    const phone = px(variant(token, '@media (max-width: 760px) / :root'))
    const compact = px(variant(token, compactScope))
    assert.ok(compact <= phone && phone <= desktop, `${token}`)
  }
})

test('the default scope resets every role the compact scope sets', () => {
  const roles = (context) =>
    catalog.tokens
      .filter(({ name }) => name.startsWith('--surf-ui-density-'))
      .filter(({ variants }) => variants.some((v) => v.context === context))
      .map(({ name }) => name)
  assert.deepEqual(roles(defaultScope), roles(compactScope))
  for (const name of roles(defaultScope))
    assert.equal(variant(name, defaultScope), 'initial', name)
})

// Every package stylesheet, by its path under packages/.
function sheets() {
  return ['ui/src/', 'css/', 'css/foundations/', 'css/presentation/'].flatMap(
    (folder) =>
      readdirSync(new URL(folder, packages))
        .filter((file) => file.endsWith('.css'))
        .map((file) => {
          const path = `${folder}${file}`
          const text = readFileSync(new URL(path, packages), 'utf8')
          return { path, text: text.replace(/\/\*[\s\S]*?\*\//g, '') }
        }),
  )
}

test('components follow density through the roles, not compact selectors', () => {
  // A compact Chart keeps its own form (it hides its caption and help), and a
  // table's bleed is set on the scroller around the table, from the outside.
  const allowed = [
    ({ path }) => path === 'ui/src/chart.css',
    ({ line }) => line.includes(":has(.surf-table[data-density='compact'])"),
  ]
  const found = sheets().flatMap(({ path, text }) =>
    text
      .split('\n')
      .filter((line) => /density=['"]compact['"]/.test(line))
      .filter((line) => !allowed.some((allow) => allow({ path, line })))
      .map((line) => `${path}: ${line.trim()}`),
  )
  assert.deepEqual(found, [])
})

test('a density role is read with the default it stands in for', () => {
  const known = new Set(
    catalog.tokens
      .map(({ name }) => name)
      .filter((name) => name.startsWith('--surf-ui-density-')),
  )
  const problems = []
  let reads = 0
  for (const { path, text } of sheets())
    for (const declaration of text.split(/[;{}]/)) {
      const colon = declaration.indexOf(':')
      if (colon < 0) continue
      const property = declaration.slice(0, colon).trim()
      for (const match of declaration.matchAll(
        /var\(\s*(--surf-ui-density-[\w-]+)\s*([,)])/g,
      )) {
        reads++
        if (!known.has(match[1])) problems.push(`${path}: unknown ${match[1]}`)
        // Outside compact a role is unset: a property reads it with its default,
        // and only a part's own custom property may hold it bare, as the compact
        // form that is invalid, and so falls back, outside compact.
        if (match[2] === ')' && !property.startsWith('--'))
          problems.push(`${path}: ${property} reads ${match[1]} bare`)
      }
    }
  assert.deepEqual(problems, [])
  assert.ok(reads > 100, `only ${reads} density reads found`)
})
