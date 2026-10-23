import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Show progress for a task that will finish. Set value=null when the total is unknown. Drive it from the real task state. Announce the completed result separately.',
  avoid:
    "Don't advance progress just because time has passed. Update it from the real task. Use Meter to show usage.",
  keyboard:
    "Progress is a status display and isn't in the Tab order. Label provides the accessible name. The min, max, and value props, with aria-valuetext, convey the units. Don't announce every frequent value change through a live region. Announce the completed result instead.",
  anatomy: 'Root → Label + Value + Track(Indicator)',
  tokens: ['--brand', '--surface', '--space-2', '--duration-base'],
  code: `import { Progress } from '@surflane/ui'

<Progress.Root value={30} aria-valuetext='30 of 100 checks completed'>
  <Progress.Label>Deployment progress</Progress.Label>
  <Progress.Value>
    {(formatted, value) => (value === null ? 'Waiting' : formatted)}
  </Progress.Value>
  <Progress.Track>
    <Progress.Indicator />
  </Progress.Track>
</Progress.Root>`,
  props: [
    ['Root.value', 'number | null (indeterminate)', 'required'],
    ['Root.min / max', 'number', '0 / 100'],
    ['Root.locale / format', 'Intl locale / number format', 'runtime locale'],
    ['Root.aria-valuetext / getAriaValueText', 'human-readable units', '—'],
    [
      'Value.children',
      '(formattedValue, value) => ReactNode',
      'formatted percentage',
    ],
  ],
}
