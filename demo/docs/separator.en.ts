import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Mark a meaningful boundary in content, horizontally or vertically. The parent Stack or Inline sets the outer spacing.',
  avoid:
    "Don't repeat a line between every row. Use spacing instead. For purely decorative lines, use CSS or aria-hidden.",
  keyboard:
    "Separators are non-interactive and aren't in the Tab order. aria-orientation conveys the orientation.",
  anatomy: 'Separator(orientation, optional horizontal inset)',
  tokens: ['--line', '--space-4'],
  code: `import { Separator } from '@surflane/ui'

<Separator />
<Separator inset />
<Separator orientation='vertical' />`,
  props: [
    ['orientation', 'horizontal | vertical', 'horizontal'],
    ['inset', 'horizontal inset by space-4', 'false'],
  ],
}
