import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Show brief details or a secondary task next to a button. Group Title and Description with Stack gap={1}. Group inputs and action buttons with Stack gap={4}. Lay out the button row with Inline gap={2}. Remove default child margins so the parent gap owns the spacing.',
  avoid:
    "Don't use Popover for required responses or data-loss confirmation. Use AlertDialog instead. Don't put inputs in a Tooltip. Use a Popover instead.",
  keyboard:
    'The Trigger opens the popover and moves focus inside. Escape or an outside click closes it and returns focus to the Trigger.',
  anatomy:
    'Root → Trigger + Content(Portal + Positioner + Popup) → Title / Description / Close',
  tokens: [
    '--surf-menu-border',
    '--surf-shadow-float',
    '--surf-control-radius',
    '--surf-space-1',
    '--surf-space-2',
    '--surf-space-4',
  ],
  code: `import { Popover, Button } from '@surflane/ui'

<Popover.Root>
  <Popover.Trigger render={<Button />}>Inspect</Popover.Trigger>
  <Popover.Content>
    <Popover.Title>Account</Popover.Title>
    <Popover.Description>Preview details.</Popover.Description>
  </Popover.Content>
</Popover.Root>`,
  props: [
    [
      'Content.side / align / sideOffset',
      'Base UI positioner props',
      'bottom / start / 8',
    ],
    [
      'Content.size',
      'small | default | large: width up to 240 / 320 / 480px, and density',
      'default width, surrounding density',
    ],
    [
      '--surf-popover-width',
      'custom property: a width that keeps the surrounding density',
      'the size width',
    ],
    ['Title / Description', 'styled heading and description', '—'],
    ['Root.open / onOpenChange', 'controlled popup state', '—'],
  ],
}
