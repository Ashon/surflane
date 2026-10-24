import {
  Badge,
  Button,
  Icon,
  Inline,
  Input,
  Select,
  SizeProvider,
  Stack,
  Text,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const environments = [
  { value: 'production', label: 'Production' },
  { value: 'staging', label: 'Staging' },
  { value: 'preview', label: 'Preview' },
]

const filterForm = (size: 'small' | 'default' | 'large') => (
  <SizeProvider size={size}>
    <Stack gap={2}>
      <Text as='span' variant='caption' color='muted'>
        size='{size}'
      </Text>
      <Input
        aria-label='Search services'
        placeholder='Search services'
        leadingIcon={<Icon name='search' />}
      />
      <Select
        aria-label='Environment'
        options={environments}
        defaultValue='staging'
      />
      <Inline gap={2}>
        <Button variant='primary'>Deploy</Button>
        <Button variant='outline' size='icon' aria-label='More actions'>
          <Icon name='more' />
        </Button>
        <Badge tone='success'>Healthy</Badge>
      </Inline>
    </Stack>
  </SizeProvider>
)

export const Small = () => filterForm('small')
export const Default = () => filterForm('default')
export const Large = () => filterForm('large')
