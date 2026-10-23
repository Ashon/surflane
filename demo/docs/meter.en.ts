import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Show a measurement within a known range, such as memory or storage usage. Show the value with its unit.',
  avoid:
    "Use Progress, not Meter, for task completion or loading of unknown length. Don't make users judge risk from color alone. Describe the risk in text too.",
  keyboard:
    "Meter is a read-only measurement and isn't in the Tab order. Describe what it measures and its unit in Label and aria-valuetext. In RTL, the fill still grows from the logical start.",
  anatomy: 'Root → Label + Value + Track(Indicator)',
  tokens: ['--ink-body', '--surface', '--space-2', '--duration-base'],
  code: `import { Meter } from '@surflane/ui'

<Meter.Root value={30} min={0} max={64} aria-valuetext='30 GiB of 64 GiB'>
  <Meter.Label>Memory allocation</Meter.Label>
  <Meter.Value>{(_, value) => \`\${value} / 64 GiB\`}</Meter.Value>
  <Meter.Track>
    <Meter.Indicator />
  </Meter.Track>
</Meter.Root>`,
  props: [
    ['Root.value', 'number', 'required'],
    ['Root.min / max', 'number', '0 / 100'],
    ['Root.aria-valuetext / getAriaValueText', 'human-readable units', '—'],
    [
      'Value.children',
      '(formattedValue, value) => ReactNode',
      'formatted value',
    ],
  ],
}
