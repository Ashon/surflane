import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage: [
    'Choose one value from two to five short options, such as a period, a side of a trade or a sort. The value is a string, not an array. Name the group with aria-label.',
    'One segment is always chosen, and pressing it again keeps it. With required={false} pressing the chosen segment clears the choice, as a filter does, and the value is null.',
    "width='fill' stretches the track to its container and shares the width among the segments, as in a sheet. The segments are the same as the CSS-only .surf-control-group, so pages without React match.",
  ],
  avoid: [
    'Use Tabs to switch between panels of content, RadioGroup for a choice a form submits, and ToggleGroup for several independent options.',
    "Don't put more than five segments or long labels in it; use a Select.",
  ],
  keyboard: [
    'The group is one Tab stop. Arrow keys, Home and End move focus; Enter or Space chooses the focused segment.',
    'Each segment is a button that says whether it is pressed.',
  ],
  anatomy: 'Root(role=group, named) → Item(value) buttons',
  tokens: [
    '--surf-selected',
    '--surf-control-border',
    '--surf-control-height',
    '--surf-radius-pill',
    '--surf-interaction-focus',
  ],
  code: `import { SegmentedControl } from '@surflane/ui'

<SegmentedControl.Root aria-label='Period' value={period} onValueChange={setPeriod}>
  <SegmentedControl.Item value='1d'>1D</SegmentedControl.Item>
  <SegmentedControl.Item value='1w'>1W</SegmentedControl.Item>
  <SegmentedControl.Item value='1m'>1M</SegmentedControl.Item>
</SegmentedControl.Root>

<SegmentedControl.Root
  aria-label='Sentiment'
  required={false}
  value={filter}
  onValueChange={setFilter}
>
  <SegmentedControl.Item value='positive'>Positive</SegmentedControl.Item>
  <SegmentedControl.Item value='negative'>Negative</SegmentedControl.Item>
</SegmentedControl.Root>`,
  props: [
    [
      'Root.value / defaultValue',
      'the chosen value, a string; null when nothing is chosen',
      '—',
    ],
    ['Root.onValueChange', '(value) => void; never null while required', '—'],
    [
      'Root.required',
      'false lets pressing the chosen segment clear it',
      'true',
    ],
    ['Root.width', 'content | fill', 'content'],
    [
      'Root.size / disabled',
      'small | default | large / disable all segments',
      'surrounding / false',
    ],
    ['Item.value', 'the string the segment chooses', 'required'],
  ],
}
