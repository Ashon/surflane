import type { ComponentDoc } from '../componentDocs'
const overlays = [
  '--surf-radius-sheet',
  '--surf-shadow-float',
  '--surf-chrome',
  '--surf-dialog-enter-duration',
]
export const doc: ComponentDoc = {
  usage:
    'Show a task panel that closes with a swipe on mobile. Also provide keyboard support and a close button.',
  avoid:
    "Don't treat the close gesture as done or save. Put those on an explicit button in the Footer. Don't build UI that works only by dragging. Offer a keyboard and button path too.",
  keyboard:
    'Focus stays inside the panel. Escape or the close button closes it. After a swipe dismisses it, focus returns to the Trigger.',
  anatomy: 'Root → Trigger → Content(handle / popup) → Header / Body / Footer',
  tokens: overlays,
  code: `import { Drawer, Button } from '@surflane/ui'

<Drawer.Root>
  <Drawer.Trigger render={<Button />}>Prepare run</Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Prepare deployment</Drawer.Title>
      <Drawer.Description>Preview only.</Drawer.Description>
    </Drawer.Header>
    <Drawer.Body>Run settings</Drawer.Body>
    <Drawer.Footer>
      <Drawer.Close render={<Button />}>Cancel</Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>`,
  props: [
    [
      'Root.side',
      'left | right | top | bottom; derives swipe direction',
      'bottom',
    ],
    [
      'Content.flush',
      'attaches the panel to its edge, square corners there',
      'false',
    ],
    [
      '--surf-panel-width',
      'custom property: a width that keeps the surrounding density',
      'the size width',
    ],
    ['Content.closeLabel', 'accessible X label', 'Close panel'],
  ],
}
