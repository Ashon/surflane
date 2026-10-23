import type { ComponentDoc } from '../componentDocs'
const overlays = [
  '--radius-sheet',
  '--shadow-float',
  '--chrome',
  '--dialog-enter-duration',
]
export const doc: ComponentDoc = {
  usage:
    "Run a task that needs the user's full attention. Include a Title, a Description, and an explicit way to close.",
  avoid:
    "Don't repeatedly block the flow for simple notices. Use a Toast instead. Don't confirm data loss in a Dialog. Use a separate AlertDialog.",
  keyboard:
    'Tab keeps focus inside the dialog. Escape or the close button closes it. A nested Select closes first, then the parent Dialog.',
  anatomy:
    'Root → Trigger → Content → Header(Title / Description / X) + Body + Footer',
  tokens: overlays,
  code: `import { Dialog, Button } from '@surflane/ui'

<Dialog.Root>
  <Dialog.Trigger render={<Button />}>Open plan</Dialog.Trigger>
  <Dialog.Content closeLabel='Close plan'>
    <Dialog.Header>
      <Dialog.Title>Deployment plan</Dialog.Title>
      <Dialog.Description>Preview only.</Dialog.Description>
    </Dialog.Header>
    <Dialog.Body>Plan details</Dialog.Body>
    <Dialog.Footer>
      <Dialog.Close render={<Button />}>Done</Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>`,
  props: [
    ['Content.closeLabel', 'accessible X label; false hides X', 'Close dialog'],
    [
      'Content.initialFocus',
      'ref / focus callback (Base UI)',
      'Base UI default',
    ],
    [
      'Content.size',
      'small | default | large: 420 / 640 / 840px wide, and density',
      'default width, surrounding density',
    ],
    [
      '--dialog-width',
      'custom property: a width that keeps the surrounding density',
      'the size width',
    ],
    ['Root.open / onOpenChange', 'controlled dialog state', '—'],
  ],
}
