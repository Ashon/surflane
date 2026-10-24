import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Offer quick actions on a target through right-click or long press, as a secondary menu. Always pair it with a visible Menu that offers the same actions. Both paths share state and action handlers.',
  avoid:
    "Don't offer important features through right-click alone. In Base UI 1.9, Trigger is a div that doesn't handle Shift+F10. Keyboard users run the same actions from the visible Menu.Trigger. Wrap only non-interactive content, not inputs or links that need the browser's native context menu.",
  anatomy:
    'Root → Trigger + Portal → Content(Positioner + Popup) → Item / CheckboxItem / SubmenuRoot',
  keyboard:
    'Tab to the visible Menu.Trigger and press Enter or Space to open the menu. Arrow keys, Home, End, and type-ahead move between items. Enter runs an item, and Escape closes the menu. ContextMenu keeps its default pointer positioning and collision avoidance.',
  tokens: [
    '--surf-menu-background',
    '--surf-menu-border',
    '--surf-menu-hover-background',
    '--surf-radius-md',
    '--surf-layer-popup',
  ],
  code: `import { ContextMenu, Menu } from '@surflane/ui'

<ContextMenu.Root>
  <ContextMenu.Trigger>Log preview</ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Content collisionPadding={12}>
      <ContextMenu.Item onClick={openLogs}>Open logs</ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>
{
  /* Always offer the same action through a visible control. */
}
<Menu.Root>
  <Menu.Trigger>Log actions</Menu.Trigger>
  <Menu.Portal>
    <Menu.Content>
      <Menu.Item onClick={openLogs}>Open logs</Menu.Item>
    </Menu.Content>
  </Menu.Portal>
</Menu.Root>`,
  props: [
    [
      'Root.open / defaultOpen / onOpenChange',
      'Base UI menu state and cancel()',
      'uncontrolled',
    ],
    [
      'Root.disabled',
      'disable contextual opening; the visible Menu stays separate',
      'false',
    ],
    ['Trigger', 'div; right-click or 500ms long press', 'non-focusable'],
    [
      'Content.side / align / sideOffset / collisionPadding',
      'placement around the cursor',
      'Base UI defaults',
    ],
    [
      'Content / Popup',
      'forwarded div ref, state className, render composition',
      'requires Portal',
    ],
    [
      'Item / CheckboxItem / RadioItem / SubmenuTrigger',
      'same styled parts and SVG indicators as Menu',
      '—',
    ],
  ],
}
