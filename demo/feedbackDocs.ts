import type { ComponentDoc } from './componentDocs'
export const feedbackDocs: Record<string, ComponentDoc> = {
  progress: {
    usage:
      'Shows the progress of a task that can finish. When the total amount is unknown, use value=null. Connect it to the real task state and announce the completed result separately.',
    avoid:
      "Don't advance progress artificially just because time has passed. Show usage with Meter.",
    keyboard:
      "It's a status display, so it isn't in the Tab order. Label provides the accessible name, and min/max/value with aria-valuetext convey the units. Don't announce every frequent value change through a live region.",
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
  },
  meter: {
    usage:
      'Shows a measurement within a known range, such as memory or storage usage. Show the value together with its unit.',
    avoid:
      "Don't use it for task completion or loading of unknown length. Don't make users judge risk from color alone.",
    keyboard:
      "It's a read-only measurement, so it isn't in the Tab order. Describe the target and unit in Label and aria-valuetext. In RTL, the fill still grows from the logical start.",
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
  },
  spinner: {
    usage:
      'Indicates short processing of unknown length. When used on its own, describe the task with label; inside a region that already announces the status, use decorative.',
    avoid:
      "Don't show a spinner indefinitely. Communicate failures, delays, and cancellation separately. Don't announce the same loading through multiple live regions.",
    keyboard:
      'Provides role=status and visually hidden text by default. decorative removes it from the accessibility tree. With reduced motion, rotation stops while the static indicator and label remain.',
    anatomy: 'span(status) → decorative SVG + visually hidden label',
    tokens: ['--ink-body'],
    code: `import { Spinner } from '@surflane/ui'

<Spinner label='Syncing environments' />
<button disabled>
  <Spinner decorative size='sm' /> Saving
</button>`,
    props: [
      ['label', 'string', 'Loading'],
      ['decorative', 'boolean', 'false'],
      ['size', 'small | default | large (sm / md / lg aliases)', 'md'],
    ],
  },
  skeleton: {
    usage:
      'A decorative placeholder that previews the structure that appears after loading. Give the parent region aria-busy and a readable loading message, and replace the skeleton with real content when loading finishes.',
    avoid:
      "Don't treat it as real data or input. Don't add excessive fake cards for structure you can't predict.",
    keyboard:
      'Always aria-hidden=true and never a focus target. The parent announces the state once, and the pulse stops with reduced motion.',
    anatomy: 'decorative span; parent loading region owns announcements',
    tokens: ['--surface', '--radius-sm', '--radius-md'],
    code: `import { Skeleton } from '@surflane/ui'

<section aria-label='Environment' aria-busy={loading}>
  {loading ? <Skeleton shape='block' /> : <EnvironmentDetails />}
</section>
<p role='status'>{loading ? 'Loading environment…' : 'Environment loaded.'}</p>`,
    props: [
      ['shape', 'text | block | circle', 'text'],
      ['style / className', 'native span layout overrides', '—'],
      ['aria-hidden', 'always true', 'true'],
    ],
  },
}
