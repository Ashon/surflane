import { Button, Inline, Spinner, Stack, Text } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Sizes = () => (
  <Inline gap={6}>
    {(['small', 'default', 'large'] as const).map((size) => (
      <Stack gap={2} key={size}>
        <Spinner size={size} label={`Loading (${size})`} />
        <Text as='span' variant='caption' color='muted'>
          {size}
        </Text>
      </Stack>
    ))}
  </Inline>
)

export const WithLabel = () => (
  <Inline gap={2}>
    <Spinner decorative />
    <Text as='span' role='status'>
      Syncing environments from the cluster…
    </Text>
  </Inline>
)

export const InButton = () => (
  <Inline gap={2}>
    <Button variant='primary' disabled>
      <Spinner decorative size='small' />
      Deploying
    </Button>
    <Button variant='outline' disabled>
      <Spinner decorative size='small' />
      Saving
    </Button>
  </Inline>
)
