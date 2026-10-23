import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Show the shape of a series inside a card or a table cell, next to the figure it explains. It has no axes, legend or tooltip: label states what the line shows and how it moved. Set baseline to a reference value, such as the previous close.',
  avoid: [
    "Don't use Sparkline when people need to read values. Use Chart, which has axes, a readout and a table.",
    "Don't leave out label. The line is an image, and the label is all a screen reader hears.",
  ],
  keyboard:
    'Sparkline is an image with an accessible name. It takes no focus and has no interaction.',
  anatomy: 'svg(role=img, aria-label) → baseline + line + end marker',
  tokens: [
    '--trend-up-fg',
    '--trend-down-fg',
    '--ink-body',
    '--icon-stroke-width',
  ],
  code: `import { Sparkline } from '@surflane/ui'

<Sparkline
  data={closes}
  baseline={previousClose}
  label='KOSPI, last 30 days, up 2.3%'
/>`,
  props: [
    ['data', '(number | null)[]; a missing value leaves a gap', 'required'],
    ['label', 'accessible name of the line', 'required'],
    ['size', 'small | default | large: 24, 32 or 48px tall', 'default'],
    ['baseline', "number | 'first' | 'none'", "'none'"],
    ['marker', 'dot on the last value', 'true'],
    [
      'trend',
      'auto | up | down | flat | neutral',
      'auto: last value against the baseline or first value',
    ],
    ['lowerIsBetter', 'swaps the up and down colors', 'false'],
  ],
}
