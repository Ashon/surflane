import {
  Badge,
  Button,
  Card,
  Inline,
  Separator,
  Stack,
  Text,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Horizontal = () => (
  <Stack gap={4}>
    <Stack gap={1}>
      <Text variant='label'>Environment overview</Text>
      <Text color='secondary'>production · 6 services · eu-west-1</Text>
    </Stack>
    <Separator />
    <Stack gap={1}>
      <Text variant='label'>Deployment details</Text>
      <Text color='secondary'>
        checkout-api 2.14.0 rolled out 12 minutes ago
      </Text>
    </Stack>
  </Stack>
)

export const Inset = () => (
  <Card.Root padding={0}>
    <Stack gap={0}>
      <div style={{ padding: 'var(--surf-space-4)' }}>
        <Inline justify='between' gap={2}>
          <Text as='span'>checkout-api</Text>
          <Badge tone='success'>Healthy</Badge>
        </Inline>
      </div>
      <Separator inset />
      <div style={{ padding: 'var(--surf-space-4)' }}>
        <Inline justify='between' gap={2}>
          <Text as='span'>search-indexer</Text>
          <Badge tone='caution'>Degraded</Badge>
        </Inline>
      </div>
    </Stack>
  </Card.Root>
)

export const Vertical = () => (
  <Inline gap={3}>
    <Button variant='ghost'>Logs</Button>
    <Button variant='ghost'>Metrics</Button>
    <Separator orientation='vertical' />
    <Text as='span' color='secondary'>
      staging
    </Text>
    <Separator orientation='vertical' />
    <Text as='span' color='secondary'>
      production
    </Text>
  </Inline>
)
