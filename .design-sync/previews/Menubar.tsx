import { Menu, Menubar } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const frame = { padding: 24, minBlockSize: 320 }

const RunMenu = ({ open = false }: { open?: boolean }) => (
  <Menu.Root defaultOpen={open}>
    <Menu.Trigger>Run</Menu.Trigger>
    <Menu.Portal>
      <Menu.Content align='start'>
        <Menu.Item>New preview</Menu.Item>
        <Menu.Item>Redeploy checkout-api</Menu.Item>
        <Menu.Item>Export logs</Menu.Item>
        <Menu.Separator />
        <Menu.SubmenuRoot>
          <Menu.SubmenuTrigger>More tools</Menu.SubmenuTrigger>
          <Menu.Portal>
            <Menu.Content align='start'>
              <Menu.Item>Validate package</Menu.Item>
              <Menu.Item>Warm cache</Menu.Item>
            </Menu.Content>
          </Menu.Portal>
        </Menu.SubmenuRoot>
        <Menu.Item disabled>Delete runs</Menu.Item>
      </Menu.Content>
    </Menu.Portal>
  </Menu.Root>
)

const ViewMenu = ({ open = false }: { open?: boolean }) => (
  <Menu.Root defaultOpen={open}>
    <Menu.Trigger>View</Menu.Trigger>
    <Menu.Portal>
      <Menu.Content align='start'>
        <Menu.CheckboxItem defaultChecked>
          <Menu.CheckboxItemIndicator />
          Show passed checks
        </Menu.CheckboxItem>
        <Menu.CheckboxItem>
          <Menu.CheckboxItemIndicator />
          Show skipped steps
        </Menu.CheckboxItem>
        <Menu.Separator />
        <Menu.RadioGroup defaultValue='compact'>
          <Menu.GroupLabel>Detail level</Menu.GroupLabel>
          <Menu.RadioItem value='compact'>
            <Menu.RadioItemIndicator />
            Compact
          </Menu.RadioItem>
          <Menu.RadioItem value='comfortable'>
            <Menu.RadioItemIndicator />
            Comfortable
          </Menu.RadioItem>
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Portal>
  </Menu.Root>
)

const HelpMenu = () => (
  <Menu.Root>
    <Menu.Trigger>Help</Menu.Trigger>
    <Menu.Portal>
      <Menu.Content align='start'>
        <Menu.LinkItem href='#'>Command reference</Menu.LinkItem>
        <Menu.LinkItem href='#'>Keyboard shortcuts</Menu.LinkItem>
      </Menu.Content>
    </Menu.Portal>
  </Menu.Root>
)

export const RunMenuOpen = () => (
  <div style={frame}>
    <Menubar aria-label='Deployment commands' modal={false}>
      <RunMenu open />
      <ViewMenu />
      <HelpMenu />
    </Menubar>
  </div>
)

export const ViewMenuOpen = () => (
  <div style={frame}>
    <Menubar aria-label='Deployment commands' modal={false}>
      <RunMenu />
      <ViewMenu open />
      <HelpMenu />
    </Menubar>
  </div>
)

export const Closed = () => (
  <div style={frame}>
    <Menubar aria-label='Deployment commands' modal={false}>
      <RunMenu />
      <ViewMenu />
      <HelpMenu />
    </Menubar>
  </div>
)
