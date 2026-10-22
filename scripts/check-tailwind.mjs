// Compiles @surflane/design-tokens/tailwind.css with Tailwind CSS v4 the way
// docs/frameworks.md recommends, then checks every mapped utility, that Tailwind
// never redefines a Surflane token, and in Chromium the layer contract: utilities
// override Surflane, Surflane overrides Preflight, a theme preset overrides the
// tokens, unlayered application CSS overrides everything, and dark: follows
// data-theme.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import tailwind from '@tailwindcss/postcss'
import { chromium } from 'playwright'
import {
  accentPresets,
  createTheme,
} from '@surflane/design-tokens/theme-builder'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const bridge = readFileSync(
  resolve(root, 'packages/tokens/tailwind.css'),
  'utf8',
)
const catalog = JSON.parse(
  readFileSync(resolve(root, 'packages/tokens/catalog.json'), 'utf8'),
)
const mappings = [
  ...bridge
    .slice(bridge.indexOf('@theme inline reference'))
    .matchAll(/^ {2}(--[\w-]+): var\((--[\w-]+)\);$/gm),
].map(([, theme, token]) => ({ theme, token }))

// The utility each theme variable produces, and the declaration it must contain.
const expectations = []
for (const { theme, token } of mappings) {
  const [, namespace, name] = theme.match(/^--([a-z]+(?:-weight)?)-?(.*)$/)
  const value = `var(${token})`
  const expect = (utility, declaration) =>
    expectations.push({ utility, declaration })
  if (namespace === 'color') expect(`bg-${name}`, `background-color: ${value}`)
  else if (namespace === 'spacing' && name)
    expect(`p-${name}`, `padding: ${value}`)
  else if (namespace === 'spacing')
    expect('p-10', `padding: calc(${value} * 10)`)
  else if (namespace === 'container')
    expect(`max-w-${name}`, `max-width: ${value}`)
  else if (namespace === 'radius')
    expect(`rounded-${name}`, `border-radius: ${value}`)
  else if (namespace === 'shadow') expect(`shadow-${name}`, value)
  else if (namespace === 'font-weight')
    expect(`font-${name}`, `font-weight: ${value}`)
  else if (namespace === 'font') expect(`font-${name}`, `font-family: ${value}`)
  else if (namespace === 'text' && !name.endsWith('--line-height'))
    expect(`text-${name}`, `font-size: ${value}`)
  else if (namespace === 'text')
    expect(`text-${name.slice(0, -'--line-height'.length)}`, value)
  else if (namespace === 'tracking')
    expect(`tracking-${name}`, `letter-spacing: ${value}`)
  else if (namespace === 'ease')
    expect(`ease-${name}`, `transition-timing-function: ${value}`)
  else throw new Error(`No expectation for ${theme}`)
}
const browserUtilities = [
  'pui-button',
  'px-8',
  'rounded-sheet',
  'text-ink-muted',
  'text-title',
  'font-display',
  'dark:bg-surface',
]
const source = [
  ...new Set([...expectations.map((e) => e.utility), ...browserUtilities]),
]

const compile = (imports) =>
  postcss([tailwind({ base: root, optimize: false })]).process(
    `@import 'tailwindcss';\n${imports}\n@source inline("${source.join(' ')}");\n`,
    { from: resolve(root, 'check-tailwind.css') },
  )

// 1. Only Tailwind and the bridge: Tailwind must not declare any Surflane token.
const alone = (await compile("@import '@surflane/design-tokens/tailwind.css';"))
  .css
for (const { name } of catalog.tokens)
  assert(
    !new RegExp(`(^|[\\s;{])${name}\\s*:`).test(alone),
    `Tailwind declares the Surflane token ${name}`,
  )
assert(
  !/--([\w-]+)\s*:\s*var\(--\1\)/.test(alone),
  'Tailwind emits a self-referencing theme variable',
)
const rule = (css, utility) => {
  const selector = `.${utility.replace(/[:]/g, '\\:')}`
  const start = css.indexOf(`${selector} {`)
  return start < 0 ? '' : css.slice(start, css.indexOf('}', start))
}
for (const { utility, declaration } of expectations)
  assert(
    rule(alone, utility).includes(declaration),
    `${utility} should contain "${declaration}"`,
  )

// 2. The documented setup: every Surflane stylesheet, a theme preset and the shadcn
// bridge in Tailwind's components layer, utilities last. The preset loads before the
// tokens here on purpose: its layer, not its position, makes it win.
const { css } =
  await compile(`@import '@surflane/design-tokens/themes/accent-violet.css' layer(components);
@import '@surflane/ui/all.css' layer(components);
@import '@surflane/design-tokens/shadcn.css' layer(components);
@import '@surflane/design-tokens/tailwind.css';`)
const violet = createTheme({ accent: accentPresets.violet }).light['--brand']

const browser = await chromium.launch()
try {
  const page = await browser.newPage()
  await page.setContent(`<!doctype html>
<html data-theme="light"><head><style>${css}</style>
<style>.app-padding { padding-inline: 2px }</style></head>
<body class="pui-typography">
  <button id="button" class="pui-button px-8 rounded-sheet" data-variant="primary">Run</button>
  <button id="plain" class="pui-button" data-variant="primary">Plain</button>
  <button id="app" class="pui-button app-padding">App</button>
  <i id="violet" style="color: ${violet}"></i>
  <i id="primary" style="color: var(--primary)"></i>
  <p id="text" class="text-ink-muted text-title font-display">Title</p>
  <div data-theme="dark"><span id="dark" class="dark:bg-surface">Dark</span>
    <div data-theme="light"><span id="island" class="dark:bg-surface">Light island</span></div>
  </div>
  <span id="light" class="dark:bg-surface">Light</span>
  <i id="tokens" style="color: var(--ink-muted); border-radius: var(--radius-sheet); font-size: var(--type-title-size)"></i>
  <div data-theme="dark"><i id="surface" style="background: var(--surface)"></i></div>
</body></html>`)
  const style = (id, property) =>
    page.$eval(
      `#${id}`,
      (el, property) => getComputedStyle(el)[property],
      property,
    )
  // A utility in the utilities layer overrides the component layer.
  assert.equal(
    await style('button', 'paddingLeft'),
    '32px',
    'px-8 overrides .pui-button',
  )
  // Surflane in the components layer overrides Preflight's button reset in base.
  assert.notEqual(
    await style('plain', 'paddingLeft'),
    '0px',
    '.pui-button overrides Preflight',
  )
  // A theme preset overrides the tokens, whichever loads first.
  const brand = await style('violet', 'color')
  assert.equal(
    await style('plain', 'backgroundColor'),
    brand,
    'the accent preset sets --brand',
  )
  assert.equal(await style('primary', 'color'), brand, 'shadcn --primary')
  // Unlayered application CSS overrides every layer.
  assert.equal(
    await style('app', 'paddingLeft'),
    '2px',
    'unlayered CSS overrides .pui-button',
  )
  assert.equal(
    await style('button', 'borderTopLeftRadius'),
    await style('tokens', 'borderTopLeftRadius'),
    'rounded-sheet uses --radius-sheet',
  )
  assert.equal(
    await style('text', 'color'),
    await style('tokens', 'color'),
    'text-ink-muted',
  )
  assert.equal(
    await style('text', 'fontSize'),
    await style('tokens', 'fontSize'),
    'text-title',
  )
  const surface = await style('surface', 'backgroundColor')
  assert.equal(
    await style('dark', 'backgroundColor'),
    surface,
    'dark: inside data-theme="dark"',
  )
  for (const id of ['island', 'light'])
    assert.equal(
      await style(id, 'backgroundColor'),
      'rgba(0, 0, 0, 0)',
      `dark: must not apply to #${id}`,
    )
} finally {
  await browser.close()
}
console.log(
  `Tailwind bridge: ${mappings.length} theme variables, ${expectations.length} utilities and the browser contract verified`,
)
