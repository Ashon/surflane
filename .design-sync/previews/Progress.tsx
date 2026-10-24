import { Progress, Stack } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const bar = (label: string, value: number | null, text: string) => (
  <Progress.Root value={value} aria-valuetext={text}>
    <Progress.Label>{label}</Progress.Label>
    <Progress.Value>
      {(formatted: string, current: number | null) =>
        current === null ? 'Waiting for a worker' : formatted
      }
    </Progress.Value>
    <Progress.Track>
      <Progress.Indicator />
    </Progress.Track>
  </Progress.Root>
)

export const Determinate = () =>
  bar('Deployment progress', 30, '30 of 100 checks completed')

export const Values = () => (
  <Stack gap={5}>
    {bar('Queued', 0, 'Not started')}
    {bar('Building image', 25, '25% built')}
    {bar('Running tests', 60, '60% of tests run')}
    {bar('Rolling out to production', 90, '9 of 10 pods updated')}
    {bar('Complete', 100, 'Rollout complete')}
  </Stack>
)

export const Indeterminate = () =>
  bar('Provisioning build runner', null, 'Waiting for a worker')

export const CustomValue = () => (
  <Progress.Root value={7} max={12} aria-valuetext='7 of 12 services migrated'>
    <Progress.Label>Migrating services to the new cluster</Progress.Label>
    <Progress.Value>
      {(_: string, value: number | null) => `${value} of 12 services`}
    </Progress.Value>
    <Progress.Track>
      <Progress.Indicator />
    </Progress.Track>
  </Progress.Root>
)
