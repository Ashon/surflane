import { Button, Icon, Inline, Stack } from '@surflane/ui'

// Host setup, as the install guide gives it: document type on body, and the light
// theme so the card's white page reads as the sheet.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Variants = () => (
  <Inline gap={2}>
    <Button variant='primary'>Deploy</Button>
    <Button variant='secondary'>Preview</Button>
    <Button variant='outline'>Export</Button>
    <Button variant='ghost'>Cancel</Button>
    <Button variant='destructive'>Delete project</Button>
    <Button variant='link'>View logs</Button>
  </Inline>
)

export const Sizes = () => (
  <Stack gap={3}>
    <Inline gap={2}>
      <Button size='small'>Small</Button>
      <Button>Default</Button>
      <Button size='large'>Large</Button>
    </Inline>
    <Inline gap={2}>
      <Button size='icon-small' variant='ghost' aria-label='Search'>
        <Icon name='search' />
      </Button>
      <Button size='icon' variant='outline' aria-label='Add environment'>
        <Icon name='plus' />
      </Button>
      <Button size='icon-large' variant='secondary' aria-label='More actions'>
        <Icon name='more' />
      </Button>
    </Inline>
  </Stack>
)

export const WithIcon = () => (
  <Inline gap={2}>
    <Button variant='primary'>
      <Icon name='upload' />
      Upload build
    </Button>
    <Button variant='outline'>
      <Icon name='copy' />
      Copy link
    </Button>
  </Inline>
)

export const Disabled = () => (
  <Inline gap={2}>
    <Button variant='primary' disabled>
      Deploy
    </Button>
    <Button variant='outline' disabled>
      Export
    </Button>
  </Inline>
)
