import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Show a short supplementary description on hover and keyboard focus. Wrap a single focusable trigger.',
  avoid:
    "In Base UI 1.9, a tooltip is a visual, supplementary label. Don't rely on it for the accessible name. Name the trigger itself. Don't put essential descriptions or interactive elements in it. Use the page content or a Popover instead.",
  keyboard:
    'Focusing the trigger shows the tooltip. Escape closes it. The tooltip never receives focus.',
  anatomy: 'TooltipProvider → Tooltip(label) → single focusable trigger',
  tokens: ['--tooltip-background', '--tooltip-foreground', '--control-radius'],
  code: `import { TooltipProvider, Tooltip, Button } from '@surflane/ui'

<TooltipProvider>
  <Tooltip label='Inspect the build logs'>
    <Button variant='outline'>Logs</Button>
  </Tooltip>
  <Tooltip label='Run the pipeline again' shortcut='⌘⇧R'>
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
      "keyboard shortcut set apart after the label, such as '⌘B'",
      '—',
    ],
    ['enabled', 'boolean', 'true'],
    [
      'side / align / sideOffset',
      'placement around the trigger',
      'right / center / 10',
    ],
    ['children', 'single ReactElement', 'required'],
  ],
}
