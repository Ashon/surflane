// What components render on the server: the attributes styles and tests rely on.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Button, FileUpload, Icon, Skeleton, Stat, Table } from '@surflane/ui'

const html = (element) => renderToStaticMarkup(element)

test('a Button without a variant is primary', () => {
  assert.match(html(h(Button, null, 'Save')), /data-variant="primary"/)
})

test("the deprecated variant='default' and short sizes still render", () => {
  const markup = html(h(Button, { variant: 'default', size: 'sm' }, 'Save'))
  assert.match(markup, /data-variant="default"/)
  assert.match(markup, /data-size="small"/)
  // button.css styles default exactly as primary.
  const css = readFileSync(
    new URL('../../packages/ui/src/button.css', import.meta.url),
    'utf8',
  )
  assert.match(css, /\[data-variant='default'\], \[data-variant='primary'\]/)
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
