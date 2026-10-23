import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Group links and sub-navigation to products, docs, and sections. It keeps the native nav, ul, li, and a structure. Trigger opens sub-links, and Link navigates. Set Link.active to mark the current destination.',
  avoid:
    "Use Menu or Menubar for commands, and Tabs for switching panels on one screen. Keep links native, and don't give nav role=menu. Don't make it hover-only. Provide click and keyboard paths, on small screens too.",
  anatomy:
    'Root(nav) → List(ul) → Item(li) → Trigger + Content; Portal → Positioner → Popup(nav) → Viewport',
  keyboard: [
    "Once a Trigger's sub-links are open, Tab moves into them. Tab and arrow keys move through the sub-links.",
    "Arrow keys move between top-level items. In a horizontal layout, ArrowDown also opens a Trigger's sub-links.",
    "Enter or Space opens a Trigger's sub-links. Enter on a sub-link navigates.",
    'Escape closes the sub-links.',
    'For RTL, set both DirectionProvider and the DOM dir.',
    'For a vertical layout, set orientation=vertical. It changes both semantics and layout.',
  ],
  tokens: [
    '--menu-background',
    '--menu-border',
    '--menu-hover-background',
    '--selected',
    '--interaction-focus',
    '--radius-lg',
    '--dialog-enter-duration',
  ],
  code: `import { NavigationMenu } from '@surflane/ui'

<NavigationMenu.Root aria-label='Platform navigation'>
  <NavigationMenu.List>
    <NavigationMenu.Item value='products'>
      <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link href='/workspace' active closeOnClick>
          Workspace
        </NavigationMenu.Link>
        <NavigationMenu.Link href='/docs' closeOnClick>
          Documentation
        </NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
  <NavigationMenu.Portal>
    <NavigationMenu.Positioner
      align='start'
      sideOffset={8}
      collisionPadding={12}
    >
      <NavigationMenu.Popup aria-label='Product destinations'>
        <NavigationMenu.Viewport />
      </NavigationMenu.Popup>
    </NavigationMenu.Positioner>
  </NavigationMenu.Portal>
</NavigationMenu.Root>`,
  props: [
    [
      'Root.value / defaultValue / onValueChange',
      'generic item value | null; event.cancel()',
      'null',
    ],
    [
      'Root.orientation',
      'horizontal | vertical; layout and keyboard direction',
      'horizontal',
    ],
    [
      'Root.delay / closeDelay',
      'hover open / close delay in milliseconds',
      '50 / 50',
    ],
    [
      'Trigger.disabled / indicator',
      'disable opening; custom indicator or false',
      'false / SVG chevron',
    ],
    [
      'Link.href / active / closeOnClick',
      'native navigation; aria-current=page; close on selection',
      '— / false / false',
    ],
    ['Content.keepMounted', 'preserve hidden content and SSR links', 'false'],
    [
      'Positioner / Popup / Viewport',
      'explicit Popup anatomy; anchor and collision options; measured size',
      'required for popup composition',
    ],
    [
      'render / ref / className',
      'Base UI composition, DOM element ref, and state callback',
      '—',
    ],
  ],
}
