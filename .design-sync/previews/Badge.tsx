import { Badge, Icon, Inline, Stack, Text } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Tones = () => (
  <Inline gap={2}>
    <Badge>3 environments</Badge>
    <Badge tone='info'>Beta</Badge>
    <Badge tone='progress'>2 rolling out</Badge>
    <Badge tone='success'>v2.14.0</Badge>
    <Badge tone='caution'>5 warnings</Badge>
    <Badge tone='danger'>12 errors</Badge>
  </Inline>
)

export const Sizes = () => (
  <Inline gap={2}>
    <Badge size='small'>us-east-1</Badge>
    <Badge>us-east-1</Badge>
    <Badge size='large'>us-east-1</Badge>
  </Inline>
)

export const WithIcon = () => (
  <Inline gap={2}>
    <Badge icon={<Icon name='clock' />}>Scheduled 02:00 UTC</Badge>
    <Badge tone='info' icon={<Icon name='user' />}>
      Owned by platform-core
    </Badge>
    <Badge tone='caution' icon={<Icon name='warning' />}>
      Cert expires in 6 days
    </Badge>
  </Inline>
)

export const InContext = () => (
  <Stack gap={3}>
    <Inline gap={2}>
      <Text as='span' weight='medium'>
        checkout-api
      </Text>
      <Badge size='small'>production</Badge>
      <Badge size='small'>eu-west-2</Badge>
    </Inline>
    <Inline gap={2}>
      <Text as='span' weight='medium'>
        Open incidents
      </Text>
      <Badge tone='danger' size='small'>
        2
      </Badge>
    </Inline>
  </Stack>
)
