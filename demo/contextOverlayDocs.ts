import type { ComponentDoc } from './componentDocs'
export const contextOverlayDocs: Record<string, ComponentDoc> = {
  'context-menu': {
    usage:
      'Offer quick actions on a target through right-click or long press, as a secondary menu. Always pair it with a visible Menu that offers the same actions. Both paths share state and action handlers.',
    avoid:
      "Don't offer important features through right-click alone. In Base UI 1.9, Trigger is a div that doesn't handle Shift+F10. Keyboard users run the same actions from the visible Menu.Trigger. Wrap only non-interactive content, not inputs or links that need the browser's native context menu.",
    anatomy:
      'Root → Trigger + Portal → Content(Positioner + Popup) → Item / CheckboxItem / SubmenuRoot',
    keyboard:
      'Tab to the visible Menu.Trigger and press Enter or Space to open the menu. Arrow keys, Home, End, and type-ahead move between items. Enter runs an item, and Escape closes the menu. ContextMenu keeps its default pointer positioning and collision avoidance.',
    tokens: [
      '--menu-background',
      '--menu-border',
      '--menu-hover-background',
      '--radius-md',
      '--layer-popup',
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
  },
  'preview-card': {
    usage:
      "Preview a summary of a link's destination on hover or keyboard focus. Keep the information users need in the body text and at the destination. The link still navigates to its original href.",
    avoid:
      "Don't put buttons, forms, or exclusive information in the Popup. It isn't a separate navigation path for touch, keyboard, or screen reader users, so don't give it Dialog or Tooltip roles. Use Popover when the content needs interaction.",
    anatomy:
      'Root<Payload> → Trigger(anchor) + Portal → Content(Positioner + Popup); optional Viewport / Arrow',
    keyboard:
      "The link keeps its Tab and Enter navigation. When the Popup opens after its delay, focus doesn't move into it or get trapped. Escape closes it, as does moving focus or the pointer away. Make all preview information available at the destination too.",
    tokens: [
      '--menu-background',
      '--menu-border',
      '--shadow-float',
      '--radius-md',
      '--dialog-enter-duration',
    ],
    code: `import { PreviewCard } from '@surflane/ui'

<PreviewCard.Root>
  <PreviewCard.Trigger href='/guides/deployment-policy'>
    Deployment policy guide
  </PreviewCard.Trigger>
  <PreviewCard.Portal>
    <PreviewCard.Content sideOffset={8}>
      <strong>Deployment policy guide</strong>
      <p>Check allowed and blocked environments with temporary tokens.</p>
    </PreviewCard.Content>
  </PreviewCard.Portal>
</PreviewCard.Root>`,
    props: [
      [
        'Root.open / defaultOpen / onOpenChange',
        'controlled / uncontrolled open state; cancel()',
        'false',
      ],
      ['Trigger.href / target / rel', 'native anchor navigation', '—'],
      [
        'Trigger.delay / closeDelay',
        'open / close delay in milliseconds',
        '600 / 300',
      ],
      [
        'createHandle<Payload> / Trigger.payload',
        'typed detached or multiple triggers',
        '—',
      ],
      [
        'Content.side / align / sideOffset / collisionPadding',
        'placement around the trigger',
        'sideOffset=8; collisionPadding=12',
      ],
      [
        'Content / Popup',
        'forwarded div ref and state-dependent className',
        'requires Portal',
      ],
    ],
  },
}
