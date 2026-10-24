import { Container, Stack, Surface, Text } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const widths = [
  ['reading', '52rem · documentation body text'],
  ['workspace', '75rem · default for operational tools'],
  ['wide', '96rem · dense tables and comparisons'],
  ['full', 'no maximum width'],
] as const

export const Widths = () => (
  <Stack gap={3}>
    {widths.map(([width, note]) => (
      <Container width={width} key={width}>
        <Surface padding={3}>
          <Text as='span' variant='label'>
            width='{width}'
          </Text>{' '}
          <Text as='span' variant='caption' color='muted'>
            {note}
          </Text>
        </Surface>
      </Container>
    ))}
  </Stack>
)

export const ReadingPage = () => (
  <Container width='reading'>
    <Surface padding={6}>
      <Stack gap={2}>
        <Text variant='label'>Runbook · Rotate registry credentials</Text>
        <Text variant='reading'>
          Rotate the registry token before it expires. Create the new token in
          the registry console, store it as a workspace secret, then redeploy
          every service that pulls private images.
        </Text>
      </Stack>
    </Surface>
  </Container>
)
