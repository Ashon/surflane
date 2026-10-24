import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Rank named values of one unit, such as disk by directory, tokens by project or calls by tool. Each row reads name, bar and value on one line, with an optional detail such as a path under the name. Bars are in proportion to the largest value, or to max when the values share a limit. Set maxRows to keep a long ranking inside a dashboard card.',
  avoid: [
    "Don't mix units in one list. Rank one measure, and put a second one in its own list or a Table.",
    "Don't use BarList for change over time. Use Chart or Sparkline.",
    "Don't use BarList for one measurement against its limit. Use Meter.",
  ],
  keyboard:
    'BarList is an ordered list of text: each row reads its name, its detail and its value. The bars are decoration. A list bounded by maxRows scrolls in a named region that takes focus, so arrow keys scroll it.',
  anatomy:
    'div → ol(aria-label) → li: name + detail, bar (aria-hidden), value; with maxRows, ScrollArea(region) around the ol',
  tokens: [
    '--surf-brand-mark',
    '--surf-surface',
    '--surf-ink',
    '--surf-ink-muted',
    '--surf-type-body-size',
    '--surf-type-caption-size',
  ],
  code: `import { BarList } from '@surflane/ui'

<BarList
  label='Disk used by directory'
  items={[
    { id: 'models', label: 'models', detail: '/srv/models', value: 412, text: '412 GiB' },
    { id: 'cache', label: 'cache', detail: '/var/cache/hf', value: 168, text: '168 GiB' },
  ]}
  maxRows={6}
/>`,
  props: [
    ['label', 'names the list', 'required'],
    [
      'items',
      'readonly {id, label, detail?, value, text?}[]; text writes the value, such as "412 GiB"',
      'required',
    ],
    ['max', 'the value a full bar stands for', 'the largest value'],
    ['sorted', 'orders rows from the largest value down', 'true'],
    [
      'maxRows',
      'rows shown before the list scrolls in a named region',
      'every row',
    ],
    [
      'formatValue / locale',
      'writes a value that has no text / Intl number locale',
      'Intl.NumberFormat',
    ],
  ],
}
