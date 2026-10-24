import { Inline, Stack, Surface, Text } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const variants = [
  [
    'reading',
    '16 / 28px',
    'Rotate the registry token before the nightly build runs.',
  ],
  [
    'body',
    '14 / 22px',
    'Rotate the registry token before the nightly build runs.',
  ],
  ['label', '14 / 20px', 'Registry token'],
  ['table', '13 / 20px', 'checkout-api · 184 ms p95'],
  ['caption', '12 / 18px', 'Expires in 3 days'],
  ['mono', '13 / 20px', 'service_id = "checkout-api-v2"'],
  ['metric', '24 / 28px', '128 / 256'],
] as const

export const Variants = () => (
  <Stack gap={3}>
    {variants.map(([variant, metrics, sample]) => (
      <Stack gap={0} key={variant}>
        <Text as='span' variant='caption' color='muted'>
          variant='{variant}' · {metrics}
        </Text>
        <Text variant={variant}>{sample}</Text>
      </Stack>
    ))}
  </Stack>
)

export const Colors = () => (
  <Stack gap={2}>
    <Text color='primary'>primary · Deployment complete for checkout-api</Text>
    <Text color='secondary'>
      secondary · Rolled out to 6 of 6 pods in eu-west-1
    </Text>
    <Text color='muted'>muted · Started by ci-bot 12 minutes ago</Text>
  </Stack>
)

export const Weights = () => (
  <Stack gap={2}>
    <Text weight='regular'>regular · Build minutes this month</Text>
    <Text weight='medium'>medium · Build minutes this month</Text>
  </Stack>
)

export const StatTiles = () => (
  <Inline gap={4}>
    {[
      ['Service checks', '87', 'passing in the last hour'],
      ['Error rate', '0.12%', 'down from 0.31% yesterday'],
    ].map(([label, value, note]) => (
      <Surface padding={4} key={label} style={{ minWidth: 200 }}>
        <Stack gap={2}>
          <Text variant='label'>{label}</Text>
          <Text variant='metric'>{value}</Text>
          <Text variant='caption' color='muted'>
            {note}
          </Text>
        </Stack>
      </Surface>
    ))}
  </Inline>
)
