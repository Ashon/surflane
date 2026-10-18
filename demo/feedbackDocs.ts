import type { ComponentDoc } from './componentDocs'
export const feedbackDocs: Record<string, ComponentDoc> = {
  progress: {
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
  },
  meter: {
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
  },
  spinner: {
    usage:
      'Indicate short processing of unknown length. On its own, describe the task with label. Inside a region that already announces the status, set decorative.',
    avoid:
      "Don't show a spinner indefinitely. Report failures, delays, and cancellation separately. Announce loading from one live region, not several.",
    keyboard:
      'By default, Spinner has role=status and visually hidden text. The decorative prop removes it from the accessibility tree. With reduced motion, rotation stops, but the static indicator and label remain.',
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
      'Preview the structure of loading content with a decorative placeholder. Give the parent region aria-busy and a readable loading message. Replace the skeleton with real content when loading finishes.',
    avoid:
      "Don't treat it as real data or input. For structure you can't predict, show one generic block instead of many fake cards.",
    keyboard:
      'Skeleton is always aria-hidden=true and never takes focus. The parent announces the loading state once. With reduced motion, the pulse stops.',
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
