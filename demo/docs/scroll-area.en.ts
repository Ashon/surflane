import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Fit long content, such as tables, diffs, or logs, into limited space. Scrollbars appear while scrolling or when the pointer comes within 24px of their edge. They stay operable during drag and keyboard scrolling.',
  avoid:
    "Don't split the page into needless nested scroll regions. Use a single scroll region instead. Give a label to any region whose content scrolls out of view.",
  keyboard:
    'Tab focuses the region. Arrow keys and Page Up or Page Down scroll it. Wheel and touch scrolling keep working. label gives the region its accessible name.',
  anatomy: 'ScrollArea(label) → Root / Viewport + Scrollbar / Thumb / Corner',
  tokens: [
    '--surf-scrollbar-indicator-size',
    '--surf-scrollbar-thumb',
    '--surf-scrollbar-track',
  ],
  code: `import { ScrollArea } from '@surflane/ui'

<ScrollArea label='Build logs' orientation='both' style={{ maxHeight: 240 }}>
  <table>...</table>
</ScrollArea>`,
  props: [
    ['label', 'accessible region name', '—'],
    [
      'orientation',
      'vertical | horizontal | both; limits native scrolling and visible bars to those axes',
      'horizontal',
    ],
    [
      'scrollChain',
      'auto passes wheel/touch to parent at an edge; contain isolates the enabled axes',
      'auto',
    ],
    ['style / className', 'viewport attributes', '—'],
    ['rootStyle / rootClassName', 'outer sizing and flex/grid placement', '—'],
    [
      'tabIndex',
      'override the named viewport default when required',
      '0 for named regions',
    ],
  ],
}
