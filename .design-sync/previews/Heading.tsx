import { Heading, Stack, Text } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const sizes = [
  ['display', '32–40 / 38–48px'],
  ['title', '28–32 / 35–40px'],
  ['page', '24 / 32px'],
  ['section', '20 / 28px'],
  ['subsection', '16 / 24px'],
] as const

export const Sizes = () => (
  <Stack gap={4}>
    {sizes.map(([size, metrics]) => (
      <Stack gap={1} key={size}>
        <Text as='span' variant='caption' color='muted'>
          size='{size}' · {metrics}
        </Text>
        <Heading level={3} size={size}>
          Platform services
        </Heading>
      </Stack>
    ))}
  </Stack>
)

export const Hierarchy = () => (
  <Stack gap={6}>
    <Stack gap={1}>
      <Heading level={1} size='page'>
        checkout-api
      </Heading>
      <Text color='secondary'>
        Production · eu-west-1 · last deployed 12 minutes ago
      </Text>
    </Stack>
    <Stack gap={3}>
      <Heading level={2} size='section'>
        Recent deployments
      </Heading>
      <Text>Three releases shipped this week; one was rolled back.</Text>
      <Stack gap={1}>
        <Heading level={3} size='subsection'>
          v2.14.0 rollout
        </Heading>
        <Text color='secondary'>
          Canary at 10%, then 50%, then all traffic.
        </Text>
      </Stack>
    </Stack>
  </Stack>
)
