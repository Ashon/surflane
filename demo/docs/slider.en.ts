import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Adjust an approximate value or range within bounds. Show the value with its unit. Pair it with a NumberField for precise adjustment.',
  avoid: [
    "Don't make dragging the only path where exact values matter. Add a NumberField instead.",
    "Don't give both thumbs of a range the same name. Set a distinct aria-label on each Thumb.",
    "Don't convey the current value with color alone. Show it in Value with its unit.",
  ],
  anatomy:
    'Root → Label + Value + Control(Track/Indicator + one or more Thumbs)',
  keyboard: [
    "Tab moves to each Thumb's range input.",
    'Arrow keys move by step, and Page Up and Page Down move by largeStep. Home and End jump to the bounds.',
    'The default thumbAlignment=edge keeps thumbs inside the control.',
    'Form reset restores only uncontrolled values. It keeps controlled values and respects canceled resets.',
    'Give each range thumb its own name and unit.',
  ],
  tokens: [
    '--brand',
    '--ink-muted',
    '--ink-body',
    '--canvas',
    '--interaction-focus',
    '--radius-full',
  ],
  code: `import { Slider } from '@surflane/ui'

<Slider.Root name='workers' defaultValue={3} min={1} max={16}>
  <Slider.Label>Parallel workers</Slider.Label>
  <Slider.Value>{(_, values) => \`\${values[0]} workers\`}</Slider.Value>
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
    </Slider.Track>
    <Slider.Thumb getAriaValueText={(_, value) => \`\${value} workers\`} />
  </Slider.Control>
</Slider.Root>`,
  props: [
    [
      'Root.value / defaultValue',
      'number or readonly number[] with preserved generics',
      'min when omitted',
    ],
    [
      'Root.min / max / step / largeStep',
      'numeric bounds and keyboard increments',
      '0 / 100 / 1 / 10',
    ],
    [
      'Root.orientation / thumbAlignment',
      'horizontal | vertical / center | edge | edge-client-only',
      'horizontal / edge',
    ],
    [
      'Root.minStepsBetweenValues / thumbCollisionBehavior',
      'minimum range separation / push | swap | none',
      '0 / push',
    ],
    [
      'Root.onValueChange / onValueCommitted',
      'cancellable change / completed interaction callbacks',
      '—',
    ],
    [
      'Root.name / form / disabled',
      'native form ownership and disabled state',
      '—',
    ],
    [
      'Thumb.index / aria-label / getAriaValueText',
      'range thumb order, accessible name, and units',
      'caller supplied for ranges',
    ],
  ],
}
