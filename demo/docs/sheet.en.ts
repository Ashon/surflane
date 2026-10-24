import type { ComponentDoc } from '../componentDocs'
const overlays = [
  '--surf-radius-sheet',
  '--surf-shadow-float',
  '--surf-chrome',
  '--surf-dialog-enter-duration',
]
export const doc: ComponentDoc = {
  usage:
    'Inspect resource details or settings without leaving the current list. Put long content in Body, which scrolls independently.',
  avoid:
    "Don't repeat the same content across stacked panels. Keep each detail in one panel.",
  keyboard:
    'Focus trapping, Escape, and focus restoration work as in Dialog. A Select inside the panel closes first.',
  anatomy: 'Root(side) → Trigger → Content → Header / Body / Footer',
  tokens: overlays,
  code: `import { Sheet, Button } from '@surflane/ui'

<Sheet.Root side='right'>
  <Sheet.Trigger render={<Button />}>Details</Sheet.Trigger>
  <Sheet.Content closeLabel='Close details'>
    <Sheet.Header>
      <Sheet.Title>Environment</Sheet.Title>
      <Sheet.Description>Preview details.</Sheet.Description>
    </Sheet.Header>
    <Sheet.Body>Resource details</Sheet.Body>
    <Sheet.Footer>
      <Sheet.Close render={<Button />}>Done</Sheet.Close>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>`,
  props: [
    ['Root.side', 'left | right | top | bottom', 'right'],
    [
      'Content.size',
      'small | default | large: 320 / 440 / 640px, and density',
      'default',
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
