import {
  Inline,
  PreviewCard,
  Stack,
  StatusBadge,
  Surface,
  Text,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

// The link keeps its href; the preview repeats a summary of the destination.
export const Default = () => (
  <Surface surface='canvas' padding={6}>
    <PreviewCard.Root defaultOpen>
      <Text>
        Read the{' '}
        <PreviewCard.Trigger href='#deployment-policy'>
          deployment policy guide
        </PreviewCard.Trigger>{' '}
        before you add production checks.
      </Text>
      <PreviewCard.Portal>
        <PreviewCard.Content>
          <Stack gap={1}>
            <Text weight='medium'>Deployment policy guide</Text>
            <Text variant='caption' color='secondary'>
              Which environments a pipeline may deploy to, how temporary tokens
              expire, and who approves production.
            </Text>
          </Stack>
        </PreviewCard.Content>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  </Surface>
)

const facts = [
  ['Owner', 'Payments'],
  ['Region', 'us-east-1'],
  ['Last deploy', 'Build 418 · 2 h ago'],
] as const

export const Service = () => (
  <Surface surface='canvas' padding={6}>
    <PreviewCard.Root defaultOpen>
      <Text>
        The 502s started after{' '}
        <PreviewCard.Trigger href='#checkout-api'>
          checkout-api
        </PreviewCard.Trigger>{' '}
        shipped build 418.
      </Text>
      <PreviewCard.Portal>
        <PreviewCard.Content>
          <Stack gap={3}>
            <Inline gap={2} justify='between'>
              <Text weight='medium'>checkout-api</Text>
              <StatusBadge tone='caution'>Degraded</StatusBadge>
            </Inline>
            <Stack gap={1}>
              {facts.map(([label, value]) => (
                <Inline key={label} gap={2} justify='between'>
                  <Text variant='caption' color='secondary'>
                    {label}
                  </Text>
                  <Text variant='caption'>{value}</Text>
                </Inline>
              ))}
            </Stack>
          </Stack>
        </PreviewCard.Content>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  </Surface>
)
