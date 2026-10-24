import { Icon, Toggle, Toolbar } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Default = () => (
  <Toolbar.Root aria-label='Run tools'>
    <Toolbar.Group>
      <Toolbar.Button>Refresh</Toolbar.Button>
      <Toolbar.Button render={<Toggle defaultPressed />}>
        Pin results
      </Toolbar.Button>
      <Toolbar.Button disabled>Delete runs</Toolbar.Button>
    </Toolbar.Group>
    <Toolbar.Separator />
    <Toolbar.Input aria-label='Filter services' placeholder='Search services' />
    <Toolbar.Link href='#'>Help</Toolbar.Link>
  </Toolbar.Root>
)

export const WithIcons = () => (
  <Toolbar.Root aria-label='Log viewer tools'>
    <Toolbar.Group>
      <Toolbar.Button aria-label='Search logs'>
        <Icon name='search' />
      </Toolbar.Button>
      <Toolbar.Button aria-label='Copy selection'>
        <Icon name='copy' />
      </Toolbar.Button>
      <Toolbar.Button aria-label='Export logs'>
        <Icon name='upload' />
      </Toolbar.Button>
    </Toolbar.Group>
    <Toolbar.Separator />
    <Toolbar.Group>
      <Toolbar.Button render={<Toggle defaultPressed />}>
        <Icon name='clock' />
        Timestamps
      </Toolbar.Button>
      <Toolbar.Button render={<Toggle />}>Wrap lines</Toolbar.Button>
    </Toolbar.Group>
  </Toolbar.Root>
)

export const Vertical = () => (
  <Toolbar.Root aria-label='Canvas tools' orientation='vertical'>
    <Toolbar.Group>
      <Toolbar.Button aria-label='Add node'>
        <Icon name='plus' />
      </Toolbar.Button>
      <Toolbar.Button aria-label='Find node'>
        <Icon name='search' />
      </Toolbar.Button>
    </Toolbar.Group>
    <Toolbar.Separator />
    <Toolbar.Button aria-label='Canvas settings'>
      <Icon name='settings' />
    </Toolbar.Button>
  </Toolbar.Root>
)

export const Disabled = () => (
  <Toolbar.Root aria-label='Release tools, read only' disabled>
    <Toolbar.Button>Promote</Toolbar.Button>
    <Toolbar.Button>Roll back</Toolbar.Button>
    <Toolbar.Separator />
    <Toolbar.Link href='#'>Release notes</Toolbar.Link>
  </Toolbar.Root>
)
