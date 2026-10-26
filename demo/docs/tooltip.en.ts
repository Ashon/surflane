import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Show a short supplementary description on hover and keyboard focus. Wrap a single focusable trigger.',
  avoid:
    "In Base UI 1.9, a tooltip is a visual, supplementary label. Don't rely on it for the accessible name. Name the trigger itself. Don't put essential descriptions or interactive elements in it. Use the page content or a Popover instead.",
  keyboard:
    'Focusing the trigger shows the tooltip. Escape closes it. The tooltip never receives focus.',
  anatomy: 'TooltipProvider → Tooltip(label) → single focusable trigger',
  tokens: [
    '--surf-tooltip-background',
    '--surf-tooltip-foreground',
    '--surf-control-radius',
  ],
  code: `import { TooltipProvider, Tooltip, Button } from '@surflane/ui'

<TooltipProvider>
  <Tooltip label='Inspect the build logs'>
    <Button variant='outline'>Logs</Button>
  </Tooltip>
  <Tooltip label='Run the pipeline again' shortcut={['mod', 'shift', 'r']}>
    <Button variant='outline'>Rerun</Button>
  </Tooltip>
</TooltipProvider>`,
  props: [
    [
      'label',
      'ReactNode: a few words, an icon or emphasis; nothing interactive',
      'required',
    ],
    [
      'shortcut',
      "the keys of a shortcut for the same action, as Kbd takes them, set apart after the label: ['mod', 'b'] reads ⌘B on Apple platforms and Ctrl+B elsewhere",
      '—',
    ],
    [
      'disabled',
      'keeps the tooltip from opening; the trigger stays as it is',
      'false',
    ],
    [
      'side / align / sideOffset',
      'placement around the trigger',
      'right / center / 10',
    ],
    ['children', 'single ReactElement', 'required'],
  ],
}
