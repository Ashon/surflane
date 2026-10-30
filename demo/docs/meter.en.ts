import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Show a measurement within a known range, such as memory or storage usage. Show the value with its unit. low, high and optimum split the range as the native meter element does: the fill keeps its color in the best range and turns caution one range away and danger two. Target marks a goal across the track, and Tick marks the scale under it; both are named in the meter's description. Meter.Arc draws the meter as a half circle with a needle, in place of Track, such as an indicator on a card: low, high and optimum split it into zones with a small gap at each threshold, in the status marks, and a zone too narrow to draw is a dot.",
  avoid:
    "Use Progress, not Meter, for task completion or loading of unknown length. Don't make users judge risk from color alone. Describe the risk in text too.",
  keyboard:
    "Meter is a read-only measurement and isn't in the Tab order. Describe what it measures and its unit in Label and aria-valuetext. In RTL, the fill still grows from the logical start.",
  anatomy:
    'Root → Label + Value + Track(Indicator + Target? + Tick*) | Arc (svg, aria-hidden: a zone per range + needle)',
  tokens: [
    '--surf-ink-body',
    '--surf-status-caution-fg',
    '--surf-status-danger-fg',
    '--surf-status-success-border',
    '--surf-status-caution-border',
    '--surf-status-danger-border',
    '--surf-ink',
    '--surf-ink-muted',
    '--surf-recessed',
    '--surf-space-2',
    '--surf-duration-base',
  ],
  code: `import { Meter } from '@surflane/ui'

<Meter.Root value={30} min={0} max={64} aria-valuetext='30 GiB of 64 GiB'>
  <Meter.Label>Memory allocation</Meter.Label>
  <Meter.Value>{(_, value) => \`\${value} / 64 GiB\`}</Meter.Value>
  <Meter.Track>
    <Meter.Indicator />
  </Meter.Track>
</Meter.Root>

// Lower is better: past 40 GiB the fill turns caution, past 56 danger.
<Meter.Root value={46} max={64} low={40} high={56} optimum={0}>…</Meter.Root>

<Meter.Root value={34} aria-valuetext='34%'>
  <Meter.Label>Bonds in the portfolio</Meter.Label>
  <Meter.Track>
    <Meter.Indicator />
    <Meter.Target value={40} label='Target 40%' />
    <Meter.Tick value={50} />
  </Meter.Track>
</Meter.Root>

// A half circle in its ranges: lower is calmer.
<Meter.Root value={17.2} min={10} max={40} low={20} high={30} optimum={10} aria-valuetext='17.2, calm'>
  <Meter.Label>VIX volatility index</Meter.Label>
  <Meter.Value>{(_, value) => value.toFixed(1)}</Meter.Value>
  <Meter.Arc />
</Meter.Root>`,
  props: [
    ['Root.value', 'number', 'required'],
    ['Root.min / max', 'number', '0 / 100'],
    [
      'Root.low / high / optimum',
      'the low range ends at low and the high range starts at high; the range optimum falls in is the best, so the fill turns caution one range away and danger two',
      '—',
    ],
    [
      'Target.value / label',
      'a goal crossing the track at value, named in the description, such as "Target 40%"',
      'required',
    ],
    [
      'Arc',
      'the meter as a half circle with a needle, in place of Track; with ranges, a zone per range in the status marks (optimum success, caution, danger); mirrored right to left',
      '—',
    ],
    [
      'Tick.value / label',
      'a point on the scale under the track; a label names a milestone in the description',
      'required / —',
    ],
    ['Root.aria-valuetext / getAriaValueText', 'human-readable units', '—'],
    [
      'Value.children',
      '(formattedValue, value) => ReactNode',
      'formatted value',
    ],
  ],
}
