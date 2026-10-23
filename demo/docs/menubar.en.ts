import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Group application commands into menus such as Run, View, and Help. Each menu reuses the shared Menu parts: Item, CheckboxItem, RadioItem, submenus, and LinkItem.',
  avoid:
    "Use NavigationMenu or a native nav for a site's primary navigation or plain link lists. Don't nest other buttons inside a Menu.Trigger. Add those commands as Menu.Item instead.",
  anatomy:
    'Menubar(role=menubar) → Menu.Root(Trigger + Portal/Content(Item/CheckboxItem/RadioItem/Submenu))',
  keyboard: [
    'Arrow keys move between menu triggers.',
    'Enter or Space, or the arrow key toward the menu, opens a menu.',
    'Base UI handles moving between open menus, closing with Escape, returning focus to the trigger, and submenu arrow keys.',
    'Keep orientation consistent with DirectionProvider and the DOM dir.',
    'Base UI 1.9 stores the initial direction in the menu model. If the direction changes at runtime, give the Menubar an orientation-based key so it remounts.',
    'Control menu selection values from the parent.',
  ],
  tokens: [
    '--menu-background',
    '--menu-hover-background',
    '--menu-border',
    '--radius-md',
    '--layer-popup',
  ],
  code: `import { Menubar, Menu } from '@surflane/ui'

<Menubar aria-label='Deployment commands' modal={false}>
  <Menu.Root>
    <Menu.Trigger>Run</Menu.Trigger>
    <Menu.Portal>
      <Menu.Content align='start'>
        <Menu.Item onClick={preparePreview}>New preview</Menu.Item>
        <Menu.Item disabled>Delete runs</Menu.Item>
      </Menu.Content>
    </Menu.Portal>
  </Menu.Root>
</Menubar>`,
  props: [
    [
      'orientation / loopFocus',
      'horizontal | vertical / cyclic focus',
      'horizontal / true',
    ],
    [
      'modal',
      'limit outside interaction while a menu is open',
      'true (preview uses false)',
    ],
    ['disabled', 'disable all menu triggers', 'false'],
    [
      'Menu.Content',
      'styled Positioner and Popup; wrap it in Menu.Portal',
      'align=end, sideOffset=6',
    ],
    [
      'Menu.Item / CheckboxItem / RadioItem / LinkItem',
      'shared styled Base UI menu commands',
      '—',
    ],
    [
      'Menu.SubmenuTrigger.indicator',
      'custom ReactNode; false hides default SVG arrow',
      'SVG chevron',
    ],
  ],
}
