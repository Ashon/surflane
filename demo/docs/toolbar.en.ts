import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Group a screen's related actions and display settings in one toolbar. Surfaces, not borders, separate the container from its controls. Inner corners use the outer radius minus the inner padding. Compose Button, Toggle, and Menu triggers through render so buttons don't nest.",
  avoid:
    "Don't add a Toolbar to every simple group of buttons. Use Inline instead. Let text inputs keep their editing keys. Use Toolbar.Link for navigation instead of disguising it as a command.",
  anatomy:
    'Root(role=toolbar) → Group(Button/Toggle) + Separator + Input + composed popup trigger + Link',
  keyboard:
    "The toolbar is a single Tab stop. Arrow keys along the orientation, Home, and End move focus. Editing keys inside inputs keep their behavior. Disabled Buttons stay focusable, since focusableWhenDisabled defaults to true, but they don't run. Links keep native navigation, and Root.disabled doesn't disable them.",
  tokens: [
    '--surf-recessed',
    '--surf-space-2',
    '--surf-control-height',
    '--surf-radius-md',
    '--surf-interaction-focus',
  ],
  code: `import { Toolbar, Toggle, Menu } from '@surflane/ui'

<Toolbar.Root aria-label='Run tools'>
  <Toolbar.Button onClick={refresh}>Refresh</Toolbar.Button>
  <Toolbar.Button
    render={<Toggle pressed={pinned} onPressedChange={setPinned} />}
  >
    Pin results
  </Toolbar.Button>
  <Toolbar.Input aria-label='Filter services' />
  <Menu.Root>
    <Toolbar.Button render={<Menu.Trigger />}>More actions</Toolbar.Button>
    <Menu.Portal>
      <Menu.Content>
        <Menu.Item onClick={exportLogs}>Export logs</Menu.Item>
      </Menu.Content>
    </Menu.Portal>
  </Menu.Root>
</Toolbar.Root>`,
  props: [
    [
      'Root.orientation / loopFocus',
      'horizontal | vertical / cyclic focus',
      'horizontal / true',
    ],
    [
      'Root.disabled / Group.disabled',
      'disable command controls; links still navigate natively',
      'false',
    ],
    [
      'Button.focusableWhenDisabled',
      'keep disabled commands discoverable',
      'true',
    ],
    [
      'Button.render',
      'compose Toggle or popup trigger without nested buttons',
      'button',
    ],
    [
      'Input / Link',
      'native input or anchor props, plus toolbar focus handling',
      '—',
    ],
    [
      'Separator.orientation',
      'visual/semantic separator direction',
      'opposite of toolbar',
    ],
  ],
}
