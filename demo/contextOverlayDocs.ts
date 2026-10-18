import type { ComponentDoc } from './componentDocs'
export const contextOverlayDocs: Record<string, ComponentDoc> = {
  'context-menu': {
    usage:
      'A secondary menu for quickly running actions on a target with right-click or long press. Always provide a regular Menu button that exposes the same actions. Both paths share state and action handlers.',
    avoid:
      "Don't offer important features through right-click alone. In Base UI 1.9, Trigger is a div and doesn't handle Shift+F10 itself; keyboard users run the same actions from the visible Menu.Trigger. Don't wrap entire inputs or links that need the browser's native context menu.",
    anatomy:
      'Root → Trigger + Portal → Content(Positioner + Popup) → Item / CheckboxItem / SubmenuRoot',
    keyboard:
      "Tab to the visible regular menu button and press Enter/Space to open it. Inside the menu, use arrow keys, Home/End, and type-ahead to move, Enter to run an item, and Escape to close. ContextMenu's default pointer positioning and collision avoidance are kept.",
    tokens: [
      '--menu-background',
      '--menu-border',
      '--menu-hover-background',
      '--radius-md',
      '--layer-popup',
    ],
    code: 'import { ContextMenu, Menu } from "@surflane/ui";\n\n<ContextMenu.Root>\n  <ContextMenu.Trigger>Log preview</ContextMenu.Trigger>\n  <ContextMenu.Portal>\n    <ContextMenu.Content positionerProps={{ collisionPadding: 12 }}>\n      <ContextMenu.Item onClick={openLogs}>Open logs</ContextMenu.Item>\n    </ContextMenu.Content>\n  </ContextMenu.Portal>\n</ContextMenu.Root>\n{/* Always offer the same action through a visible control. */}\n<Menu.Root>\n  <Menu.Trigger>Log actions</Menu.Trigger>\n  <Menu.Portal><Menu.Content>\n    <Menu.Item onClick={openLogs}>Open logs</Menu.Item>\n  </Menu.Content></Menu.Portal>\n</Menu.Root>',
    props: [
      [
        'Root.open / defaultOpen / onOpenChange',
        'Base UI menu state and cancel()',
        'uncontrolled',
      ],
      [
        'Root.disabled',
        'disable contextual opening; visible actions remain separate',
        'false',
      ],
      ['Trigger', 'div; right click / 500ms long press', 'non-focusable'],
      [
        'Content.positionerProps',
        'cursor-aware ContextMenu.Positioner props',
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
      "Previews a summary of a link's destination on hover or keyboard focus. Keep the information users need in the body text and at the destination; the link still navigates to its original href.",
    avoid:
      "Don't put buttons, forms, or exclusive information inside the preview. Popup content isn't an independent navigation path for touch, keyboard, or screen reader users, so don't add Dialog/Tooltip roles to it. Use Popover when interaction is needed.",
    anatomy:
      'Root<Payload> → Trigger(anchor) + Portal → Content(Positioner + Popup); optional Viewport / Arrow',
    keyboard:
      "Links keep their Tab and Enter navigation. When the visual preview opens after a delay, focus doesn't move into it or get trapped. Escape, focus leaving, and the pointer leaving close it. All preview information must also be available at the destination.",
    tokens: [
      '--menu-background',
      '--menu-border',
      '--shadow-float',
      '--radius-md',
      '--dialog-enter-duration',
    ],
    code: 'import { PreviewCard } from "@surflane/ui";\n\n<PreviewCard.Root>\n  <PreviewCard.Trigger href="/guides/deployment-policy">\n    Deployment policy guide\n  </PreviewCard.Trigger>\n  <PreviewCard.Portal>\n    <PreviewCard.Content positionerProps={{ sideOffset: 8 }}>\n      <strong>Deployment policy guide</strong>\n      <p>Check allowed and blocked environments with temporary tokens.</p>\n    </PreviewCard.Content>\n  </PreviewCard.Portal>\n</PreviewCard.Root>',
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
        'Content.positionerProps',
        'side, align, anchor and collision options',
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
