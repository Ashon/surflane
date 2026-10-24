import { Button, Inline, Spinner, Stack, Text } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

// Inline centers its items, so stacks of uneven height would stagger the
// captions: align the stacks' ends and center each spinner over its caption.
export const Sizes = () => (
  <Inline gap={6} style={{ alignItems: 'flex-end' }}>
    {(['small', 'default', 'large'] as const).map((size) => (
      <Stack gap={2} key={size} style={{ alignItems: 'center' }}>
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
