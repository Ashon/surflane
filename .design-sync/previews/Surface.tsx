import { Badge, Button, Inline, Stack, Surface, Text } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Subtle = () => (
  <Surface>
    <Stack gap={3}>
      <Inline justify='between' gap={2}>
        <Text variant='label'>Storage quota</Text>
        <Badge tone='caution'>86% used</Badge>
      </Inline>
      <Text color='secondary'>
        430 GiB of 500 GiB used by build artifacts and container images.
      </Text>
      <Inline gap={2}>
        <Button variant='outline'>Prune old builds</Button>
      </Inline>
    </Stack>
  </Surface>
)

export const CanvasOnSubtle = () => (
  <Surface padding={4}>
    <Stack gap={3}>
      <Text variant='label'>Environments</Text>
      {[
        ['production', 'Healthy', 'success'],
        ['staging', 'Deploying', 'progress'],
      ].map(([name, status, tone]) => (
        <Surface surface='canvas' padding={4} key={name}>
          <Inline justify='between' gap={2}>
            <Text as='span'>{name}</Text>
            <Badge tone={tone as 'success' | 'progress'}>{status}</Badge>
          </Inline>
        </Surface>
      ))}
    </Stack>
  </Surface>
)

export const Padding = () => (
  <Inline gap={4}>
    {([2, 4, 6] as const).map((padding) => (
      <Surface padding={padding} key={padding}>
        <Text as='span' variant='label'>
          padding={padding}
        </Text>
        <Text variant='caption' color='muted'>
          {padding * 4}px
        </Text>
      </Surface>
    ))}
  </Inline>
)
