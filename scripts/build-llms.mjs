// Writes llms.txt (llmstxt.org), llms-full.txt and a Markdown copy of every catalog page
// into demo/public, so the catalog serves them next to the pages they describe. The
// catalog is a single-page app: a crawler or an AI tool fetching a page gets an empty
// shell, so the docs are generated here from the same data the pages render.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'demo/public')
const site = 'https://surflane.page'
const generated = [
  'llms.txt',
  'llms-full.txt',
  'tokens.md',
  'design-tokens.json',
  'docs',
  'components',
  'patterns',
  'foundations',
]

const vite = await createServer({
  root: join(root, 'demo'),
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true },
})
const { catalog, components, patterns, foundations, itemHref, stageLabels } =
  await vite.ssrLoadModule('/catalog.ts')
const { componentDocs } = await vite.ssrLoadModule('/componentDocs.ts')
await vite.close()
const tokens = JSON.parse(
  readFileSync(join(root, 'packages/tokens/catalog.json'), 'utf8'),
)
const pkg = JSON.parse(
  readFileSync(join(root, 'packages/ui/package.json'), 'utf8'),
)
const frameworks = readFileSync(join(root, 'docs/frameworks.md'), 'utf8')

const cell = (value) =>
  String(value).replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\n/g, ' ')
const text = (value) =>
  Array.isArray(value) ? value.map((item) => `- ${item}`).join('\n') : value
const page = (item) => `${site}${itemHref(item)}`
const markdownUrl = (item) => `${page(item)}.md`
const available = (items) => items.filter((item) => item.stage === 'available')

// The README and the coverage doc state the catalog's size. Write it from the registry,
// so the numbers cannot drift; CI fails when the committed text is stale.
const counts = `${available(foundations).length} foundations, ${available(components).length} components and ${available(patterns).length} patterns`
for (const file of ['README.md', 'docs/catalog-coverage.md']) {
  const path = join(root, file)
  const source = readFileSync(path, 'utf8')
  const marker = /<!-- catalog-counts -->[^<]*<!-- \/catalog-counts -->/
  if (!marker.test(source))
    throw new Error(`${file} lacks the <!-- catalog-counts --> marker`)
  const next = source.replace(
    marker,
    `<!-- catalog-counts -->${counts}<!-- /catalog-counts -->`,
  )
  if (next !== source) writeFileSync(path, next)
}

// Token tables by category; the first variant is the default (dark) context.
const tokenTable = (categories) => {
  const rows = tokens.tokens.filter((token) =>
    categories.includes(token.category),
  )
  if (!rows.length) return ''
  const light = (token) =>
    token.variants.find((variant) => variant.context.includes('light'))
      ?.value ?? ''
  return [
    '| Token | Default (dark) | Light | Description |',
    '| --- | --- | --- | --- |',
    ...rows.map(
      (token) =>
        `| \`${token.name}\` | ${cell(token.variants[0].value)} | ${cell(light(token))} | ${cell(token.description)} |`,
    ),
  ].join('\n')
}
const foundationTokens = {
  layout: ['Layout', 'Spacing'],
  typography: ['Typography'],
  color: ['Color', 'Status'],
  interaction: ['Controls'],
  motion: ['Motion'],
  layers: ['Layers'],
  iconography: ['Shape'],
}

function itemMarkdown(item) {
  const head = [
    `# ${item.name}`,
    '',
    `> ${item.summary}`,
    '',
    `${item.kind[0].toUpperCase()}${item.kind.slice(1)} · ${stageLabels[item.stage]} · ${page(item)}`,
  ]
  const doc = componentDocs[item.id]
  if (item.kind === 'foundation') {
    const table = tokenTable(foundationTokens[item.id] ?? [])
    return [
      ...head,
      '',
      'The page shows these rules with live examples.',
      ...(table ? ['', '## Tokens', '', table] : []),
    ].join('\n')
  }
  if (!doc) return head.join('\n')
  return [
    ...head,
    '',
    '## Usage',
    '',
    text(doc.usage),
    '',
    text(doc.avoid),
    '',
    '## Anatomy',
    '',
    '```text',
    doc.anatomy,
    '```',
    '',
    '## Keyboard and accessibility',
    '',
    text(doc.keyboard),
    '',
    '## API',
    '',
    '| Prop | Contract | Default |',
    '| --- | --- | --- |',
    ...doc.props.map((row) => `| ${row.map(cell).join(' | ')} |`),
    '',
    '## Tokens',
    '',
    doc.tokens.map((token) => `- \`${token}\``).join('\n'),
    '',
    '## Example',
    '',
    '```tsx',
    doc.code,
    '```',
  ].join('\n')
}

const intro = [
  '# Surflane',
  '',
  `> A design system for platform development: OKLCH design tokens (@surflane/design-tokens) and accessible React 19 components built on Base UI (@surflane/ui), with tested application patterns. Version ${pkg.version}.`,
  '',
  'Install the packages and Base UI: `npm install @surflane/ui @surflane/design-tokens @surflane/css @base-ui/react`. They are ESM-only and need React 19.',
  '',
  '- Import the CSS once: `@surflane/ui/all.css` brings every stylesheet in its cascade layer. With Tailwind CSS v4, import it with `layer(components)`.',
  '- Set `data-theme="light"` or `"dark"` on `<html>` before paint. Any element can carry `data-theme` to re-theme its subtree.',
  '- In React Server Components, use flat part names such as `DialogRoot` instead of `Dialog.Root`.',
  '- Chart, DatePicker, Markdown and Tree import from `@surflane/ui/chart`, `/date-picker`, `/markdown` and `/tree`, and need their optional peers: `recharts`, `react-aria-components`, `react-markdown` with `remark-gfm`, and `@headless-tree/core` with `@headless-tree/react` and `@tanstack/react-virtual`. Code highlights only inside `<SyntaxHighlighting>` from `@surflane/ui/syntax-highlighting`, which needs `shiki`.',
  '- `SizeProvider size="small"` resizes a whole composition, including portals.',
  '- Style with tokens through `var(--token-name)`, never raw values. With Tailwind CSS v4, import `@surflane/design-tokens/tailwind.css`.',
  '- To theme, import a preset with the stylesheets, such as `@surflane/design-tokens/themes/stone.css` or `themes/accent-violet.css`, or generate CSS with `createTheme` and `themeCss` from `@surflane/design-tokens/theme-builder`. For shadcn/ui, import `@surflane/design-tokens/shadcn.css`.',
  '- Give each control a name that describes its purpose, connect errors to their controls, and signal state with more than color.',
]

const links = (items) =>
  available(items).map(
    (item) => `- [${item.name}](${markdownUrl(item)}): ${item.summary}`,
  )
const index = [
  ...intro,
  '',
  '## Docs',
  '',
  `- [Framework setup](${site}/docs/frameworks.md): install, CSS imports, theme, Tailwind CSS v4, Server Components, Next.js, React Router, Astro, and Vite`,
  `- [Design tokens](${site}/tokens.md): every token with its dark and light values`,
  `- [Full documentation](${site}/llms-full.txt): every page below in one file`,
  '',
  '## Foundations',
  '',
  ...links(foundations.filter((item) => item.id !== 'tokens')),
  '',
  '## Components',
  '',
  ...links(components),
  '',
  '## Patterns',
  '',
  ...links(patterns),
  '',
  '## Optional',
  '',
  `- [Token catalog (JSON)](${site}/design-tokens.json): token names, values per theme, aliases, and source lines`,
  '- [Changelog](https://github.com/Ashon/surflane/blob/main/CHANGELOG.md): release notes',
  '- [Source](https://github.com/Ashon/surflane): repository, examples, and tests',
  '',
].join('\n')

const tokensPage = [
  '# Design tokens',
  '',
  `> ${tokens.tokens.length} CSS custom properties. Reference them with \`var(--token-name)\`; never copy raw values into product code.`,
  '',
  ...tokens.categories.flatMap((category) => [
    `## ${category}`,
    '',
    tokenTable([category]),
    '',
  ]),
].join('\n')

for (const path of generated)
  rmSync(join(out, path), { recursive: true, force: true })
const write = (path, content) => {
  mkdirSync(dirname(join(out, path)), { recursive: true })
  writeFileSync(
    join(out, path),
    content.endsWith('\n') ? content : content + '\n',
  )
}
const pages = available(catalog).filter((item) => item.id !== 'tokens')
for (const item of pages)
  write(`${itemHref(item).slice(1)}.md`, itemMarkdown(item))
write('tokens.md', tokensPage)
write('docs/frameworks.md', frameworks)
write('design-tokens.json', JSON.stringify(tokens, null, 2))
write('llms.txt', index)
write(
  'llms-full.txt',
  [
    ...intro,
    '',
    frameworks.replace(/^# .*\n/, '# Framework setup\n'),
    ...pages.map(itemMarkdown),
    tokensPage,
  ].join('\n\n'),
)
console.log(
  `llms.txt: ${pages.length} pages, ${tokens.tokens.length} tokens (demo/public)`,
)
