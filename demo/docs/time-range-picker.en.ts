import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Let a monitoring screen pick the span it shows back from now, such as the last 24 hours, how often it refreshes, and when to refresh now. Range and interval are milliseconds, so the screen asks for now − range. Put it in the page header or a toolbar; its selects fit their longest option. Translate timeRangeOptions and refreshIntervalOptions, or pass spans of your own.',
  avoid: [
    "Don't use it for a fixed span between two dates. Put a DateRangePicker beside it.",
    "Don't refresh faster than the data changes. A 10 second interval on hourly data only costs requests.",
  ],
  keyboard:
    'The group holds two selects and a button, each in the Tab order with its own name. The interval pauses while the page is hidden and refreshes once when it shows again.',
  anatomy:
    'div(role=group, aria-label) → Select(range) + Select(refresh interval)? + Button(refresh now)?',
  tokens: ['--surf-space-2', '--surf-control-height'],
  code: `import { TimeRangePicker } from '@surflane/ui/time-range-picker'

<TimeRangePicker
  label='Dashboard time'
  range={range}
  onRangeChange={setRange}
  refreshInterval={interval}
  onRefreshIntervalChange={setInterval}
  onRefresh={() => refetch()}
/>`,
  props: [
    ['label', 'names the group', 'required'],
    [
      'range / onRangeChange / ranges',
      'the span back from now in ms / its change / {value, label}[] spans',
      'required / required / timeRangeOptions',
    ],
    [
      'refreshInterval / onRefreshIntervalChange / refreshIntervals',
      'ms between refreshes, 0 off; leave it out for no interval select',
      '— / — / refreshIntervalOptions',
    ],
    [
      'onRefresh',
      'runs from the button and on every interval while the page is shown; leave it out for no button',
      '—',
    ],
    [
      'labels',
      'range, refresh and refreshNow: the names of the selects and the button',
      'English',
    ],
    ['size', 'small | default | large', 'surrounding size'],
  ],
}
