import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import postcss from 'postcss'
import {
  category,
  type,
  descriptions,
  categories,
} from '../packages/tokens/metadata.js'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const files = ['tokens.css', 'foundation-tokens.css', 'motion.css']
const tokens = new Map()
const hash = createHash('sha256')
for (const file of files) {
  const css = readFileSync(resolve(root, 'packages/tokens', file), 'utf8')
  hash.update(file + '\0' + css)
  const ast = postcss.parse(css, { from: file })
  ast.walkDecls(/^--/, (decl) => {
    const name = decl.prop
    let token = tokens.get(name)
    if (!token) {
      token = {
        name,
        category: category(name),
        type: type(name),
        description: descriptions[name] ?? '',
        variants: [],
        aliases: [],
      }
      tokens.set(name, token)
    }
    const ancestors = []
    let parent = decl.parent
    while (parent) {
      // Token blocks also target [data-theme] for scoped themes; the first selector names the context.
      // Contexts keep double-quoted attribute values whatever quotes the CSS source uses.
      if (parent.type === 'rule')
        ancestors.unshift(
          parent.selector.split(',')[0].trim().replace(/'/g, '"'),
        )
      // A cascade layer does not change where a token applies.
      else if (parent.type === 'atrule' && parent.name !== 'layer')
        ancestors.unshift('@' + parent.name + ' ' + parent.params)
      parent = parent.parent
    }
    token.variants.push({
      context: ancestors.join(' / '),
      // Values read the same however the formatter wraps the source.
      value: decl.value
        .replace(/\s+/g, ' ')
        .replace(/\( /g, '(')
        .replace(/ \)/g, ')'),
      file,
      line: decl.source.start.line,
    })
    token.aliases = [
      ...new Set([
        ...token.aliases,
        ...[...decl.value.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]),
      ]),
    ]
  })
}
for (const token of tokens.values())
  for (const alias of token.aliases)
    if (!tokens.has(alias))
      throw new Error(`${token.name} references missing ${alias}`)
// Light comes two ways, chosen with data-theme or from the OS with no data-theme, and
// both must resolve every token alike.
const chosenLight = ':root[data-theme="light"]'
const systemLight =
  '@media (prefers-color-scheme: light) / :root:not([data-theme="dark"]):not([data-theme="light"])'
const lightIn = (token, context) =>
  token.variants.findLast((variant) => variant.context === context)?.value
const lightDrift = [...tokens.values()].filter(
  (token) => lightIn(token, chosenLight) !== lightIn(token, systemLight),
)
if (lightDrift.length)
  throw new Error(
    `Chosen and system light differ: ${lightDrift
      .map(
        (token) =>
          `${token.name} (${lightIn(token, chosenLight)} / ${lightIn(token, systemLight)})`,
      )
      .join(', ')}`,
  )
const catalog = {
  schemaVersion: 1,
  sourceHash: hash.digest('hex'),
  sources: files,
  categories,
  tokens: [...tokens.values()].sort((a, b) => a.name.localeCompare(b.name)),
}
writeFileSync(
  resolve(root, 'packages/tokens/catalog.json'),
  JSON.stringify(catalog, null, 2) + '\n',
)
// Keep non-CSS theme consumers on the same palette and notation.
const chrome = tokens.get('--surf-chrome')
const darkChrome = chrome?.variants.find(
  (variant) => variant.context === ':root',
)?.value
const lightChrome = chrome?.variants.find(
  (variant) => variant.context === ':root[data-theme="light"]',
)?.value
if (!darkChrome || !lightChrome)
  throw new Error('Both theme chrome values are required')
writeFileSync(
  resolve(root, 'packages/tokens/theme.json'),
  JSON.stringify(
    { dark: { chrome: darkChrome }, light: { chrome: lightChrome } },
    null,
    2,
  ) + '\n',
)
// Tailwind CSS v4 bridge: utilities that read these tokens, e.g. bg-canvas, p-page,
// rounded-sheet, text-title. `@theme inline reference` emits no theme variables, so
// Tailwind never redefines a Surflane token, even where both use the same name.
const sorted = catalog.tokens.map((token) => token.name)
const bridge = []
const map = (theme, token) => {
  if (!tokens.has(token)) throw new Error(`Tailwind bridge: missing ${token}`)
  bridge.push(`  ${theme}: var(${token});`)
}
for (const name of sorted)
  if (tokens.get(name).type === 'color')
    map(`--color-${name.slice('--surf-'.length)}`, name)
map('--spacing', '--surf-space-1')
for (const [utility, token] of [
  ['page', '--surf-layout-page-inset'],
  ['gutter', '--surf-layout-gutter'],
  ['section', '--surf-layout-section-gap'],
])
  map(`--spacing-${utility}`, token)
for (const width of [
  'content',
  'reading',
  'workspace',
  'wide',
  'sidebar',
  'splash',
])
  map(`--container-${width}`, `--surf-layout-${width}`)
for (const name of sorted.filter((name) =>
  /^--surf-(radius|shadow|font)-/.test(name),
))
  map(`--${name.slice('--surf-'.length)}`, name)
map('--font-weight-regular', '--surf-weight-regular')
map('--font-weight-medium', '--surf-weight-medium')
for (const name of sorted.filter((name) =>
  /^--surf-type-.+-size$/.test(name),
)) {
  const role = name.slice('--surf-type-'.length, -'-size'.length)
  map(`--text-${role}`, name)
  if (tokens.has(`--surf-type-${role}-leading`))
    map(`--text-${role}--line-height`, `--surf-type-${role}-leading`)
  if (tokens.has(`--surf-type-${role}-tracking`))
    map(`--text-${role}--letter-spacing`, `--surf-type-${role}-tracking`)
}
map('--tracking-default', '--surf-tracking')
map('--tracking-mono', '--surf-tracking-mono')
map('--ease-in', '--surf-ease-in')
map('--ease-out', '--surf-ease-out')
writeFileSync(
  resolve(root, 'packages/tokens/tailwind.css'),
  `/* Generated by scripts/build-tokens.mjs. Do not edit. */
/* Tailwind CSS v4 theme for the Surflane tokens. Import it after 'tailwindcss'
 * and the Surflane stylesheets; see docs/frameworks.md. */

/* dark: follows the nearest Surflane theme attribute, including a light region inside dark.
 * Without one on the root, it follows the system setting, as the tokens do. */
@custom-variant dark {
  &:where([data-theme='dark'], [data-theme='dark'] *):not(:where([data-theme='dark'] [data-theme='light'], [data-theme='dark'] [data-theme='light'] *)) {
    @slot;
  }
  @media not (prefers-color-scheme: light) {
    &:where(:root:not([data-theme='dark'], [data-theme='light']), :root:not([data-theme='dark'], [data-theme='light']) *):not(:where([data-theme='light'], [data-theme='light'] *)) {
      @slot;
    }
  }
}

/* Preflight's document fonts. */
@theme inline {
  --default-font-family: var(--surf-font-body);
  --default-mono-font-family: var(--surf-font-code);
}

@theme inline reference {
${bridge.join('\n')}
}
`,
)
// Theme presets: one file per neutral, accent and radius preset, each loaded after tokens.css.
const { accentPresets, createTheme, neutralPresets, radiusPresets, themeCss } =
  await import('../packages/tokens/theme-builder.js')
const themes = resolve(root, 'packages/tokens/themes')
mkdirSync(themes, { recursive: true })
const presets = [
  ...Object.entries(neutralPresets).map(([name, neutral]) => [
    name,
    `neutral ${name}`,
    { neutral },
  ]),
  ...Object.entries(accentPresets).map(([name, accent]) => [
    `accent-${name}`,
    `accent ${name}`,
    { accent },
  ]),
  ...Object.entries(radiusPresets).map(([name, radius]) => [
    `radius-${name}`,
    `radius ${name}`,
    { radius },
  ]),
]
for (const [file, label, input] of presets)
  writeFileSync(
    resolve(themes, `${file}.css`),
    themeCss(
      createTheme(input),
      `Generated by scripts/build-tokens.mjs. Do not edit. Surflane theme preset: ${label}, in the surflane.themes layer above the tokens.`,
    ),
  )
console.log(
  `Generated ${tokens.size} tokens from ${files.length} CSS sources and ${presets.length} theme presets`,
)
