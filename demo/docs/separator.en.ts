import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Mark a meaningful boundary in content, horizontally or vertically. The parent Stack or Inline sets the outer spacing. Between values on one line, such as a stat strip, variant='dot' sets a small dot with room on each side. Assistive technology and copied text get a comma in its place, so the values stay apart.",
  avoid:
    "Don't repeat a line between every row. Use spacing instead. For purely decorative lines, use CSS or aria-hidden.",
  keyboard:
    "Separators are non-interactive and aren't in the Tab order. aria-orientation conveys the orientation.",
  anatomy:
    "Separator(orientation, optional horizontal inset) | Separator variant='dot' (span holding a comma that shows as a dot)",
  tokens: [
    '--surf-line',
    '--surf-space-4',
    '--surf-ink-muted',
    '--surf-space-2',
  ],
  code: `import { Separator } from '@surflane/ui'

<Separator />
<Separator inset />
<Separator orientation='vertical' />
<Text>dgx-001<Separator variant='dot' />24 GiB free</Text>`,
  props: [
    ['orientation', 'horizontal | vertical', 'horizontal'],
    ['inset', 'horizontal inset by space-4', 'false'],
    [
      'variant',
      'line | dot: dot sits between values on one line; assistive technology and copied text get a comma',
      'line',
    ],
  ],
}
