// What components render on the server: the attributes styles and tests rely on.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  Banner,
  Button,
  DescriptionList,
  FileUpload,
  Icon,
  Kbd,
  Skeleton,
  Stat,
  Table,
} from '@surflane/ui'

const html = (element) => renderToStaticMarkup(element)

test('a Button without a variant is primary', () => {
  assert.match(html(h(Button, null, 'Save')), /data-variant="primary"/)
})

test('a Button writes its full size name, and the removed spellings have no rules', () => {
  const markup = html(h(Button, { size: 'small' }, 'Save'))
  assert.match(markup, /data-size="small"/)
  const css = readFileSync(
    new URL('../../packages/ui/src/button.css', import.meta.url),
    'utf8',
  )
  assert.doesNotMatch(css, /data-variant='default'|data-size='xs'/)
})

test('Table writes its variant, selection and numeric alignment', () => {
  const markup = html(
    h(
      Table.Root,
      { variant: 'striped' },
      h(
        Table.Body,
        null,
        h(
          Table.Row,
          { selected: true },
          h(Table.Cell, { numeric: true }, '42'),
        ),
      ),
    ),
  )
  assert.match(markup, /<table data-variant="striped"/)
  assert.match(markup, /<tr data-selected="true"/)
  assert.match(markup, /data-align="end" data-numeric="true"/)
})

test('Skeleton is decorative and keeps its shape', () => {
  const markup = html(h(Skeleton, { shape: 'circle' }))
  assert.match(markup, /aria-hidden="true"/)
  assert.match(markup, /data-shape="circle"/)
})

test('a part gets a size scope only when it is given a size', () => {
  const label = h(Stat.Label, null, 'p95 latency')
  assert.match(
    html(h(Stat.Root, { size: 'small' }, label)),
    /data-ui-size="small"/,
  )
  assert.doesNotMatch(html(h(Stat.Root, null, label)), /data-ui-size/)
})

test('Icon follows the component size scale', () => {
  assert.match(
    html(h(Icon, { name: 'check', size: 'large' })),
    /data-size="large"/,
  )
  assert.doesNotMatch(html(h(Icon, { name: 'check' })), /data-size/)
})

test('FileUpload names one file or several by its multiple prop', () => {
  const single = html(h(FileUpload, { label: 'Manifest' }))
  assert.match(single, />Choose file</)
  assert.match(single, /or drop a file here/)
  const several = html(h(FileUpload, { label: 'Manifests', multiple: true }))
  assert.match(several, />Choose files</)
  assert.match(several, /or drop files here/)
  const custom = html(
    h(FileUpload, { label: 'Manifest', labels: { choose: 'Pick a manifest' } }),
  )
  assert.match(custom, />Pick a manifest</)
})

test('FileUpload carries the field class once', () => {
  const [classes] = /class="([^"]*surf-file-upload[^"]*)"/
    .exec(html(h(FileUpload, { label: 'Manifest' })))
    .slice(1)
  const names = classes.split(' ')
  assert.deepEqual(names, [...new Set(names)])
})

test("Kbd writes a chord in each platform's order and names its symbols", () => {
  const keys = ['shift', 'mod', 'r']
  assert.equal(
    html(h(Kbd, { keys, platform: 'other' })),
    '<kbd class="surf-kbd"><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd></kbd>',
  )
  assert.equal(
    html(h(Kbd, { keys, platform: 'apple' })),
    '<kbd class="surf-kbd"><kbd><span aria-hidden="true">⇧</span><span class="surf-feedback-sr">Shift </span></kbd>' +
      '<kbd><span aria-hidden="true">⌘</span><span class="surf-feedback-sr">Command </span></kbd><kbd>R</kbd></kbd>',
  )
  // Ctrl is the command modifier off Apple platforms, so it is written once.
  assert.match(
    html(h(Kbd, { keys: ['ctrl', 'mod', 'alt', 'z'], platform: 'other' })),
    /<kbd>Ctrl<\/kbd>\+<kbd>Alt<\/kbd>\+<kbd>Z<\/kbd><\/kbd>$/,
  )
  // Apple's order is Control, Option, Shift, Command.
  assert.match(
    html(
      h(Kbd, { keys: ['mod', 'shift', 'alt', 'ctrl', 'k'], platform: 'apple' }),
    ),
    /⌃.*⌥.*⇧.*⌘.*<kbd>K<\/kbd><\/kbd>$/,
  )
  // Named keys, spoken names that change, and keys written as they are.
  const arrows = html(
    h(Kbd, { keys: 'down', labels: { down: '아래쪽 화살표' } }),
  )
  assert.match(
    arrows,
    /aria-hidden="true">↓<\/span><span class="surf-feedback-sr">아래쪽 화살표 </,
  )
  assert.match(html(h(Kbd, { keys: 'escape' })), /<kbd>Esc<\/kbd>/)
  assert.match(html(h(Kbd, { keys: 'F5' })), /<kbd>F5<\/kbd>/)
  assert.match(html(h(Kbd, { keys: '⌘⇧R' })), /<kbd>⌘⇧R<\/kbd>/)
})

test('DescriptionList renders a native dl, names an empty value and ties its copy action to the term', () => {
  const { Root, Item, Term, Value } = DescriptionList
  const markup = html(
    h(
      Root,
      { columns: 2, labels: { empty: 'Not set yet' } },
      h(Item, null, h(Term, null, 'Region'), h(Value, null, 'ap-northeast-2')),
      h(
        Item,
        null,
        h(Term, null, 'Cluster ID'),
        h(Value, { truncate: true, copy: true }, 'cls-7f3a9c2e41b84d0f9a1e'),
      ),
      h(Item, null, h(Term, null, 'Description'), h(Value, null)),
    ),
  )
  assert.match(
    markup,
    /^<dl class="surf-description-list" data-layout="inline" data-columns="2">/,
  )
  assert.match(
    markup,
    /<div class="surf-description-list-item"><dt id="[^"]+" class="surf-description-list-term">Region<\/dt><dd class="surf-description-list-value">ap-northeast-2<\/dd><\/div>/,
  )
  // The copy action is described by its term, and the cut value keeps its whole text.
  const term = markup.match(/<dt id="([^"]+)"[^>]*>Cluster ID/)[1]
  assert.match(markup, new RegExp(`aria-describedby="${term}"`))
  assert.match(
    markup,
    /data-truncate="true" data-copy="true"><span class="surf-description-list-text" title="cls-7f3a9c2e41b84d0f9a1e">cls-7f3a9c2e41b84d0f9a1e<\/span>/,
  )
  assert.match(
    markup,
    /<dd class="surf-description-list-value" data-empty="true">Not set yet<\/dd>/,
  )
})

test('Banner is a polite live region whose dismiss button has a name', () => {
  const markup = html(
    h(
      Banner.Root,
      { tone: 'danger', onDismiss: () => {}, dismissLabel: 'Dismiss outage' },
      h(Banner.Icon),
      h(Banner.Content, null, h(Banner.Title, null, 'Build service outage')),
    ),
  )
  assert.match(
    markup,
    /^<div role="status" data-tone="danger" class="surf-banner">/,
  )
  assert.match(markup, /<span aria-hidden="true" class="surf-banner-icon"><svg/)
  assert.match(markup, /<strong class="surf-banner-title">Build service outage/)
  assert.match(markup, /aria-label="Dismiss outage"/)
  assert.doesNotMatch(
    html(h(Banner.Root, null, 'Notice')),
    /surf-banner-dismiss/,
  )
})
