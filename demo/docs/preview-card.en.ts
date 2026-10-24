import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Preview a summary of a link's destination on hover or keyboard focus. Keep the information users need in the body text and at the destination. The link still navigates to its original href.",
  avoid:
    "Don't put buttons, forms, or exclusive information in the Popup. It isn't a separate navigation path for touch, keyboard, or screen reader users, so don't give it Dialog or Tooltip roles. Use Popover when the content needs interaction.",
  anatomy:
    'Root<Payload> → Trigger(anchor) + Portal → Content(Positioner + Popup); optional Viewport / Arrow',
  keyboard:
    "The link keeps its Tab and Enter navigation. When the Popup opens after its delay, focus doesn't move into it or get trapped. Escape closes it, as does moving focus or the pointer away. Make all preview information available at the destination too.",
  tokens: [
    '--surf-menu-background',
    '--surf-menu-border',
    '--surf-shadow-float',
    '--surf-radius-md',
    '--surf-dialog-enter-duration',
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
}
