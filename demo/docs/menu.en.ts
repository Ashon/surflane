import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'List the actions available from the current location. Selecting an item runs its action.',
  avoid: "Don't use Menu to choose a form value. Use Select instead.",
  keyboard:
    'Arrow keys, Home, End, and typing move between items. Enter or Space activates an item. Escape closes the menu.',
  anatomy:
    'Root → Trigger + Content(Portal + Positioner + Popup) → Item / Group / Separator',
  tokens: ['--menu-border', '--shadow-float', '--selected'],
  code: `import { Menu, Button } from '@surflane/ui'

<Menu.Root>
  <Menu.Trigger render={<Button />}>Actions</Menu.Trigger>
  <Menu.Content>
    <Menu.Item className='pui-select-item' onClick={inspect}>
      Inspect
    </Menu.Item>
  </Menu.Content>
</Menu.Root>`,
  props: [
    ['Content.align / sideOffset', 'Base UI positioner props', 'end / 6'],
    ['Item.disabled / onClick', 'availability and action', '—'],
  ],
}
