// What components render on the server: the attributes styles and tests rely on.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  Banner,
  Button,
  DataState,
  DescriptionList,
  FileUpload,
  Icon,
  Kbd,
  KoreanLabels,
  LabelsProvider,
  Pagination,
  ScrollArea,
  SegmentedControl,
  Skeleton,
  Stat,
  Table,
  Timeline,
} from '@surflane/ui'
import { Dashboard } from '@surflane/ui/dashboard'

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

test('Timeline is an ordered list; an event carries its tone, its time and, when current, the step', () => {
  const markup = html(
    h(
      Timeline.Root,
      { 'aria-label': 'Deploy history' },
      h(
        Timeline.Item,
        { tone: 'danger', current: true },
        h(Timeline.Title, null, 'Deploy failed'),
        h(Timeline.Time, { dateTime: '2026-10-26T09:42:00Z' }, '09:42'),
        h(Timeline.Status, null, 'Failed'),
      ),
    ),
  )
  assert.match(
    markup,
    /^<ol aria-label="Deploy history" class="surf-timeline">/,
  )
  assert.match(
    markup,
    /<li aria-current="step" class="surf-timeline-item" data-tone="danger" data-current="true"><span class="surf-timeline-mark" aria-hidden="true"><svg/,
  )
  assert.match(
    markup,
    /<time dateTime="2026-10-26T09:42:00Z" class="surf-timeline-time">09:42<\/time>/,
  )
})

test('ScrollArea writes which edges fade, and Table a sticky first column', () => {
  assert.match(
    html(h(ScrollArea, { label: 'Runs', fade: 'end' }, 'x')),
    /<div [^>]*data-fade="end" class="surf-scroll-root"/,
  )
  assert.doesNotMatch(html(h(ScrollArea, { label: 'Runs' }, 'x')), /data-fade/)
  assert.match(
    html(h(Table.Root, { stickyColumn: true })),
    /<table data-sticky-column="true" class="surf-table"/,
  )
})

test('SegmentedControl renders a named group of pressed-state buttons from a string value', () => {
  const markup = html(
    h(
      SegmentedControl.Root,
      { 'aria-label': 'Period', defaultValue: '1m', width: 'fill' },
      h(SegmentedControl.Item, { value: '1d' }, '1D'),
      h(SegmentedControl.Item, { value: '1m' }, '1M'),
    ),
  )
  assert.match(markup, /role="group"[^>]*aria-label="Period"/)
  assert.match(markup, /class="surf-control-group surf-segmented"/)
  assert.match(markup, /data-width="fill"/)
  assert.match(markup, /aria-pressed="false"[^>]*>1D</)
  assert.match(markup, /aria-pressed="true"[^>]*>1M</)
})

test('KoreanLabels writes components in Korean; a provider and a prop each win over it', () => {
  const pager = (props = {}) =>
    h(Pagination, { page: 2, pageCount: 5, onPageChange: () => {}, ...props })
  const english = html(pager())
  assert.match(english, /aria-label="Pagination"/)
  assert.match(english, />Previous page</)
  const korean = html(h(KoreanLabels, null, pager()))
  assert.match(korean, /aria-label="페이지 탐색"/)
  assert.match(korean, />이전 페이지</)
  assert.match(korean, /5페이지 중 2페이지/)
  // A provider inside changes some labels and keeps the rest.
  const nested = html(
    h(
      KoreanLabels,
      null,
      h(
        LabelsProvider,
        { labels: { pagination: { previous: '앞으로' } } },
        pager(),
      ),
    ),
  )
  assert.match(nested, />앞으로</)
  assert.match(nested, />다음 페이지</)
  // A component's own labels still win.
  assert.match(
    html(h(KoreanLabels, null, pager({ labels: { previous: 'Back' } }))),
    />Back</,
  )
})

test('DataState says where the data stands and keeps one wrapper for the content', () => {
  const content = h('p', null, 'Values')
  assert.match(
    html(h(DataState, { state: 'loading' }, content)),
    /aria-busy="true"[^>]*data-state="loading"/,
  )
  const error = html(
    h(DataState, { state: 'error', onRetry: () => {} }, content),
  )
  assert.match(error, /data-tone="danger"/)
  assert.match(error, />Retry</)
  assert.doesNotMatch(error, />Values</)
  const stale = html(h(DataState, { state: 'stale' }, content))
  assert.match(stale, /data-tone="caution"/)
  assert.match(stale, /class="surf-data-state-content"><p>Values</)
  assert.match(
    html(h(DataState, { refreshing: true }, content)),
    /data-refreshing="true"><p>Values<\/p><\/div><span class="surf-feedback-sr" role="status">Refreshing</,
  )
})

test('a collapsible Dashboard.Panel titles with a toggle and leaves its folded content out', () => {
  const panel = (props) =>
    html(
      h(
        Dashboard.Panel,
        { title: 'Free disk', collapsible: true, summary: '24 GiB', ...props },
        h('p', null, 'Values'),
      ),
    )
  const open = panel({})
  assert.match(open, /data-open="true"/)
  assert.match(
    open,
    /<button type="button" class="surf-dashboard-panel-toggle" aria-expanded="true" aria-controls="[^"]+-body"/,
  )
  assert.match(open, />Values</)
  assert.doesNotMatch(open, /surf-dashboard-panel-summary/)
  const folded = panel({ defaultOpen: false })
  assert.match(folded, /data-open="false"/)
  assert.match(folded, /aria-expanded="false"/)
  assert.doesNotMatch(
    folded,
    /aria-controls|>Values<|surf-dashboard-panel-body/,
  )
  assert.match(folded, /class="surf-dashboard-panel-summary">24 GiB</)
  // A panel that does not fold keeps its plain title.
  assert.doesNotMatch(
    html(h(Dashboard.Panel, { title: 'Free disk' }, 'Values')),
    /data-open|surf-dashboard-panel-toggle/,
  )
})
