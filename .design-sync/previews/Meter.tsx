import { Meter, Stack } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const MemoryAllocation = () => (
  <Meter.Root value={30} min={0} max={64} aria-valuetext='30 GiB of 64 GiB'>
    <Meter.Label>Memory allocation</Meter.Label>
    <Meter.Value>
      {(_: string, value: number) => `${value} / 64 GiB`}
    </Meter.Value>
    <Meter.Track>
      <Meter.Indicator />
    </Meter.Track>
  </Meter.Root>
)

const quotas = [
  { label: 'Artifact storage', value: 12, max: 500, unit: 'GiB' },
  { label: 'Build minutes this month', value: 1840, max: 3000, unit: 'min' },
  { label: 'Container registry', value: 186, max: 200, unit: 'GiB' },
  { label: 'Log retention', value: 30, max: 30, unit: 'days' },
]

export const Levels = () => (
  <Stack gap={5}>
    {quotas.map((q) => (
      <Meter.Root
        key={q.label}
        value={q.value}
        min={0}
        max={q.max}
        aria-valuetext={`${q.value} of ${q.max} ${q.unit}`}
      >
        <Meter.Label>{q.label}</Meter.Label>
        <Meter.Value>
          {(_: string, value: number) =>
            `${value.toLocaleString('en-US')} / ${q.max.toLocaleString('en-US')} ${q.unit}`
          }
        </Meter.Value>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    ))}
  </Stack>
)

export const Percentage = () => (
  <Meter.Root value={72} aria-valuetext='72% of CPU in use'>
    <Meter.Label>CPU across 6 nodes</Meter.Label>
    <Meter.Value />
    <Meter.Track>
      <Meter.Indicator />
    </Meter.Track>
  </Meter.Root>
)
