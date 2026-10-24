import {
  Badge,
  Button,
  Heading,
  Inline,
  Stack,
  Surface,
  Text,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const stages = ['Build', 'Test', 'Deploy']

export const Gaps = () => (
  <Inline gap={8} style={{ alignItems: 'flex-start' }}>
    {([1, 3, 6] as const).map((gap) => (
      <Stack gap={2} key={gap}>
        <Text as='span' variant='caption' color='muted'>
          gap={gap} · {gap * 4}px
        </Text>
        <Stack gap={gap}>
          {stages.map((s) => (
            <Surface padding={3} key={s} style={{ width: 128 }}>
              <Text as='span' variant='label'>
                {s}
              </Text>
            </Surface>
          ))}
        </Stack>
      </Stack>
    ))}
  </Inline>
)

export const SectionContent = () => (
  <Stack gap={4}>
    <Stack gap={1}>
      <Heading level={3} size='section'>
        checkout-api
      </Heading>
      <Text color='secondary'>
        Handles cart checkout and payment capture for the storefront.
      </Text>
    </Stack>
    <Inline gap={2}>
      <Badge tone='success'>Healthy</Badge>
      <Badge>production</Badge>
      <Badge>eu-west-1</Badge>
    </Inline>
    <Inline gap={2}>
      <Button variant='primary'>Deploy</Button>
      <Button variant='outline'>View logs</Button>
    </Inline>
  </Stack>
)

export const DefaultGap = () => (
  <Stack>
    <Surface padding={4}>
      <Text variant='label'>Environment</Text>
      <Text color='secondary'>production · 6 services</Text>
    </Surface>
    <Surface padding={4}>
      <Text variant='label'>Region</Text>
      <Text color='secondary'>eu-west-1 · 3 availability zones</Text>
    </Surface>
  </Stack>
)
