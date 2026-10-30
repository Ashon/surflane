import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Draw a signed value from a center line, such as a sector's return against the market or an allocation's drift from its target: a rise grows toward the inline end and a fall toward the start. Give bars side by side one max so they share a scale. A rise and a fall take the trend colors, as Stat and Sparkline do; trend='neutral' draws both in the brand mark for a gap that is neither good nor bad. To rank several signed values, use BarList with diverging.",
  avoid: [
    "Don't use DivergingBar for a value that can't fall below zero. Use Meter or BarList.",
    "Don't leave the value only in the bar. Write it beside the bar too, signed, such as +4.2%p.",
  ],
  keyboard:
    'DivergingBar is a named image and isn\'t in the Tab order. Its label states the value and what it is against, such as "Semiconductors, +4.2%p against the market". Right to left, a rise grows toward the left.',
  anatomy:
    'span(role=img, aria-label) → center line + fill toward the inline end (rise) or start (fall)',
  tokens: [
    '--surf-trend-up-fg',
    '--surf-trend-down-fg',
    '--surf-brand-mark',
    '--surf-ink-muted',
    '--surf-recessed',
  ],
  code: `import { DivergingBar } from '@surflane/ui'

<DivergingBar
  value={-2.8}
  max={4.2}
  label='Chemicals, -2.8%p against the market'
/>`,
  props: [
    ['value', 'a signed value', 'required'],
    ['label', 'names the image and states the value', 'required'],
    [
      'max',
      'the size a half bar stands for, such as the largest gap in the list',
      "the value's own size",
    ],
    [
      'trend',
      'auto colors a rise and a fall; neutral draws both in the brand mark',
      'auto',
    ],
    [
      'lowerIsBetter',
      'swaps the colors for measures where a fall is good',
      'false',
    ],
  ],
}
