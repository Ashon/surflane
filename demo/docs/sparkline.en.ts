import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Show the shape of a series inside a card or a table cell, next to the figure it explains. It has no axes, legend or tooltip: label states what the line shows and how it moved. Set baseline to a reference value, such as the previous close. Set fill where the shape carries the message, such as a trend card: the wash takes the same color as the line, so it adds weight without a second color.',
  avoid: [
    "Don't use Sparkline when people need to read values. Use Chart, which has axes, a readout and a table.",
    "Don't leave out label. The line is an image, and the label is all a screen reader hears.",
    "Don't fill a line that sits under a colored figure it would compete with. fill adds weight to a shape; it is not a status cue.",
  ],
  keyboard:
    'Sparkline is an image with an accessible name. It takes no focus and has no interaction.',
  anatomy:
    'svg(role=img, aria-label) → gradient + fade under the line + baseline + line + end marker',
  tokens: [
    '--surf-trend-up-fg',
    '--surf-trend-down-fg',
    '--surf-ink-body',
    '--surf-icon-stroke-width',
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
      'fill',
      'washes the area under the line in its own color, thinning to nothing at the bottom; --surf-sparkline-fill-opacity sets the strength',
      'false',
    ],
    [
      'trend',
      'auto | up | down | flat | neutral',
      'auto: last value against the baseline or first value',
    ],
    ['lowerIsBetter', 'swaps the up and down colors', 'false'],
  ],
}
