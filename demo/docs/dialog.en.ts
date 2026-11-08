import type { ComponentDoc } from '../componentDocs'
const overlays = [
  '--surf-radius-sheet',
  '--surf-shadow-float',
  '--surf-chrome',
  '--surf-dialog-enter-duration',
]
export const doc: ComponentDoc = {
  usage: [
    "Run a task that needs the user's full attention, such as editing a resource or confirming a plan. Include a Title and a Description; every dialog shows the close (X) button, and Footer holds the task's actions.",
    'To read the details of an item from a list or a card grid, such as a session or a deployment, open a Sheet beside them instead, so the list stays in view. A long history with tabs belongs on a page of its own.',
  ],
  avoid: [
    "Don't repeatedly block the flow for simple notices. Use a Toast instead.",
    "Don't confirm data loss in a Dialog. Use a separate AlertDialog.",
    "Don't add a Close button to the footer of a dialog that has no task: the close (X) button already does it. A footer holds actions, such as Save and Cancel.",
  ],
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
    [
      'Content.closeLabel',
      'names the close (X) button, which every dialog shows',
      'Close dialog',
    ],
    [
      'Content.closeDisabled',
      'disables the close button, such as while a save runs',
      'false',
    ],
    [
      'Content.focusBoundaryLabel',
      'names the focus guards at the edges, which screen readers reach past the last control',
      'Continue dialog navigation',
    ],
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
      '--surf-dialog-width',
      'custom property: a width that keeps the surrounding density',
      'Content.size',
    ],
    ['Root.open / onOpenChange', 'controlled dialog state', '—'],
  ],
}
