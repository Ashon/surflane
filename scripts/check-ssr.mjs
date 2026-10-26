import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, symlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { format } from 'node:util'
import { build } from 'esbuild'

// Plain Node: browser globals stay absent so render-time DOM access throws.
for (const name of ['window', 'document', 'matchMedia', 'ResizeObserver'])
  assert.equal(typeof globalThis[name], 'undefined', `${name} is defined`)

// Classes proving each fixture section rendered its components.
// Base UI portals mount after hydration, so overlays (even defaultOpen) emit
// only their triggers; Tree items build after mount, so only its frame renders.
const markers = {
  foundations: [
    'surf-size-scope',
    'surf-container',
    'surf-page-header',
    'surf-breadcrumbs',
    'surf-stack',
    'surf-heading',
    'surf-text',
    'surf-inline',
    'surf-badge',
    'surf-kbd',
    'surf-grid',
    'surf-grid-item',
    'surf-surface',
    'surf-prose',
    'surf-separator',
    'surf-link',
    'ssr-slot',
    'surf-icon',
  ],
  controls: [
    'surf-button',
    'surf-input',
    'surf-select-trigger',
    'surf-form',
    'surf-fieldset',
    'surf-field',
    'surf-textarea',
    'surf-checkbox',
    'surf-choice-label',
    'surf-choice-description',
    'surf-radio',
    'surf-switch',
    'surf-number-field',
    'surf-combobox-input',
    'surf-slider',
    'surf-otp-field',
    'surf-date-picker',
    'surf-date-range-picker',
    'surf-time-field',
    'surf-file-upload',
  ],
  commands: [
    'surf-toggle',
    'surf-toggle-group',
    'surf-toolbar',
    'surf-menubar',
    'surf-menu-trigger',
    'surf-context-trigger',
    'surf-navigation-menu',
  ],
  overlays: ['ssr-open-popover', 'ssr-open-dialog', 'surf-preview-trigger'],
  disclosure: [
    'surf-tabs',
    'surf-tabs-panel',
    'surf-accordion',
    'surf-accordion-panel',
    'surf-collapsible-panel',
    'surf-avatar-fallback',
    'surf-scroll-root',
  ],
  feedback: [
    'surf-progress',
    'surf-meter',
    'surf-spinner',
    'surf-skeleton',
    'surf-message',
    'surf-empty',
    'surf-toast-viewport',
    'surf-toast-title',
  ],
  data: [
    'surf-table',
    'surf-description-list',
    'surf-copy-button',
    'surf-list',
    'surf-card',
    'surf-pagination',
    'surf-filter-bar',
    'surf-tree-scroll',
    'surf-chart',
    'surf-chart-table',
  ],
  content: ['surf-code-block', 'surf-syntax', 'surf-markdown'],
  highlighted: ['ssr-highlighted'],
  shell: [
    'surf-app-shell',
    'surf-app-shell-sidebar',
    'surf-app-shell-brand',
    'surf-app-shell-nav',
    'surf-app-shell-link',
    'surf-bottom-nav',
  ],
}

const root = resolve(import.meta.dirname, '..')
const dir = mkdtempSync(join(tmpdir(), 'surflane-ssr-'))
try {
  // Bare imports stay external; the linked node_modules resolves them to the built dist.
  symlinkSync(join(root, 'node_modules'), join(dir, 'node_modules'), 'junction')
  const outfile = join(dir, 'fixture.mjs')
  await build({
    entryPoints: [join(root, 'tests/ssr/fixture.tsx')],
    outfile,
    bundle: true,
    platform: 'node',
    format: 'esm',
    jsx: 'automatic',
    packages: 'external',
    logLevel: 'warning',
  })
  const errors = []
  const consoleError = console.error
  console.error = (...args) => errors.push(format(...args))
  let html = ''
  try {
    const [{ SsrFixture }, { createElement }, { prerenderToNodeStream }] =
      await Promise.all([
        import(pathToFileURL(outfile).href),
        import('react'),
        import('react-dom/static'),
      ])
    // prerender waits for Suspense boundaries, unlike a streamed shell.
    const { prelude } = await prerenderToNodeStream(createElement(SsrFixture), {
      signal: AbortSignal.timeout(30_000),
      onError(error, info) {
        errors.push(`${error?.stack ?? error}${info?.componentStack ?? ''}`)
      },
    })
    for await (const chunk of prelude) html += chunk
  } catch (error) {
    errors.push(error?.stack ?? String(error))
  } finally {
    console.error = consoleError
  }
  assert(!errors.length, `SSR render failed:\n\n${errors.join('\n\n')}`)
  const classes = new Set(
    [...html.matchAll(/class="([^"]*)"/g)].flatMap(([, value]) =>
      value.split(/\s+/),
    ),
  )
  const missing = Object.entries(markers).flatMap(([section, names]) => [
    ...(html.includes(`data-ssr="${section}"`) ? [] : [`${section}: section`]),
    ...names
      .filter((name) => !classes.has(name))
      .map((name) => `${section}: ${name}`),
  ])
  assert.deepEqual(missing, [], 'SSR markup is missing markers')
  assert.match(
    html,
    /class="surf-syntax ssr-highlighted"[^>]*data-highlighted="true"[^>]*><span data-syntax=/,
    'SyntaxHighlighting suspense renders highlighted code on the server',
  )
  // Node has a navigator that names the host's platform; the server still writes
  // the Ctrl form, so hydration matches whatever the reader's platform is.
  assert.match(
    html,
    /<kbd class="surf-kbd"><kbd>Ctrl<\/kbd>\+<kbd>K<\/kbd><\/kbd>/,
    'Kbd writes the Ctrl form on the server',
  )
  const pui = [...classes].filter((name) => name.startsWith('surf-'))
  console.log(
    `SSR: ${Buffer.byteLength(html)} bytes HTML, ${pui.length} distinct surf- classes`,
  )
} finally {
  rmSync(dir, { recursive: true, force: true })
}
