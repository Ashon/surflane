import type { ComponentDoc } from './componentDocs'
export const navigationMenuDocs: Record<string, ComponentDoc> = {
  'navigation-menu': {
    usage:
      'Groups links and sub-navigation that lead to products, docs, and sections. Keeps the native nav, ul, li, and a structure, and marks the current destination with Link.active. Trigger opens sub-links, and Link navigates.',
    avoid:
      "Use Menu/Menubar for commands and Tabs for switching panels on the same screen. Don't turn links into buttons or give nav role=menu. Don't make it hover-only; provide click and keyboard paths on small screens too.",
    anatomy:
      'Root(nav) → List(ul) → Item(li) → Trigger + Content; Portal → Positioner → Popup(nav) → Viewport',
    keyboard:
      "Arrow keys move between top-level items. Enter/Space, or ArrowDown in a horizontal layout, opens the sub-links. Once they're open, Tab moves into the sub-links, Tab and arrow keys move through them, Enter navigates, and Escape closes. For RTL, set both DirectionProvider and the DOM dir. For a vertical layout, orientation=vertical changes both the semantics and the layout.",
    tokens: [
      '--menu-background',
      '--menu-border',
      '--menu-hover-background',
      '--selected',
      '--interaction-focus',
      '--radius-lg',
      '--dialog-enter-duration',
    ],
    code: 'import { NavigationMenu } from "@surflane/ui";\n\n<NavigationMenu.Root aria-label="Platform navigation">\n  <NavigationMenu.List>\n    <NavigationMenu.Item value="products">\n      <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>\n      <NavigationMenu.Content>\n        <NavigationMenu.Link href="/workspace" active closeOnClick>Workspace</NavigationMenu.Link>\n        <NavigationMenu.Link href="/docs" closeOnClick>Documentation</NavigationMenu.Link>\n      </NavigationMenu.Content>\n    </NavigationMenu.Item>\n  </NavigationMenu.List>\n  <NavigationMenu.Portal>\n    <NavigationMenu.Positioner align="start" sideOffset={8} collisionPadding={12}>\n      <NavigationMenu.Popup aria-label="Product destinations">\n        <NavigationMenu.Viewport />\n      </NavigationMenu.Popup>\n    </NavigationMenu.Positioner>\n  </NavigationMenu.Portal>\n</NavigationMenu.Root>',
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
        'explicit popup anatomy; anchor collision options; measured size',
        'required for popup composition',
      ],
      [
        'render / ref / className',
        'Base UI composition, actual DOM ref and state callback',
        '—',
      ],
    ],
  },
}
