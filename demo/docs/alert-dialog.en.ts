import type { ComponentDoc } from '../componentDocs'
const overlays = [
  '--surf-radius-sheet',
  '--surf-shadow-float',
  '--surf-chrome',
  '--surf-dialog-enter-duration',
]
export const doc: ComponentDoc = {
  usage:
    "Confirm an action that's hard to undo, such as deleting or discarding. Point Content.initialFocus at the safe cancel button.",
  avoid:
    "Don't label the action with a neutral OK or Yes. Name the specific action instead. Don't treat an outside click as a response. Wait for an explicit choice.",
  keyboard:
    'Focus starts on the safe cancel action and stays inside the dialog. Escape acts as cancel.',
  anatomy:
    'Root → Trigger → Content → Header(Title / Description) + Footer(Cancel / Action)',
  tokens: overlays,
  code: `import { AlertDialog, Button } from '@surflane/ui'

<AlertDialog.Root open={open} onOpenChange={setOpen}>
  <AlertDialog.Trigger render={<Button />}>Discard</AlertDialog.Trigger>
  <AlertDialog.Content initialFocus={cancelRef}>
    <AlertDialog.Header>
      <AlertDialog.Title>Discard draft?</AlertDialog.Title>
      <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Close ref={cancelRef} render={<Button />}>
        Keep draft
      </AlertDialog.Close>
      <Button variant='destructive' onClick={discard}>
        Discard draft
      </Button>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>`,
  props: [
    ['Root.open / onOpenChange', 'controlled state', '—'],
    ['Content.initialFocus', 'safe cancel button ref', '—'],
    ['Content.size', "Dialog's scale", 'small'],
  ],
}
