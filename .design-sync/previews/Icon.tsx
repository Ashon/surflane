import { Icon, Inline, Stack, Text, iconNames } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const IconSet = () => (
  <Inline gap={4}>
    {iconNames.map((name) => (
      <Inline gap={2} key={name} style={{ width: 172 }}>
        <Icon name={name} size='large' />
        <Text as='span' variant='mono'>
          {name}
        </Text>
      </Inline>
    ))}
  </Inline>
)

export const Sizes = () => (
  <Inline gap={8}>
    {(
      [
        ['small', '14px'],
        ['default', '16px'],
        ['large', '20px'],
      ] as const
    ).map(([size, px]) => (
      <Stack gap={2} key={size}>
        <Inline gap={2}>
          <Icon name='search' size={size} />
          <Icon name='settings' size={size} />
          <Icon name='upload' size={size} />
        </Inline>
        <Text as='span' variant='caption' color='muted'>
          {size} · {px}
        </Text>
      </Stack>
    ))}
  </Inline>
)

export const InlineWithText = () => (
  <Stack gap={3}>
    <Inline gap={2}>
      <Icon name='info' decorative={false} label='Note' />
      <Text as='span'>Builds older than 90 days are pruned nightly.</Text>
    </Inline>
    <Inline gap={2}>
      <Icon name='clock' />
      <Text as='span' color='secondary'>
        Last deployed 12 minutes ago
      </Text>
    </Inline>
    <Inline gap={2}>
      <Icon name='external-link' />
      <Text as='span' color='secondary'>
        Opens the runbook in a new tab
      </Text>
    </Inline>
  </Stack>
)
