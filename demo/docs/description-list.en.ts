import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage: [
    "Show a resource's properties as terms and their values: a native dl, read by screen readers as a list of name and value pairs. Each Item holds one Term and its Value.",
    'Inline sets the value beside its term, in a term column of its own width, and moves it under the term where the row is too narrow. Stacked sets every value under its term. columns={2} sets two columns of items where both fit.',
    'On a phone a pair takes less room: a value as wide as its content stays beside its term where it fits, and one that does not, such as a long identifier, moves under it whole.',
    'A row is as tall as a menu row of the size, and the small row in compact density. Rows have no lines between them: the term column and the rhythm carry the structure.',
    'A long value wraps anywhere, so identifiers never push the layout. truncate keeps it to one line instead; the whole value stays in the text and, for text, in the title. copy adds a copy action after the value, which reaches into the row so the row keeps its height, and names its term for screen readers.',
    'A value with nothing in it reads Not set in muted ink, not a dash or zero. Rename it with labels.empty.',
  ],
  avoid: [
    "Don't use a description list for tabular records that share columns; use Table. Don't use it for key figures; use Stat.",
    "Don't put a whole form in values. A value can hold a link, a Badge or a time element; editing belongs in a form.",
    "Don't truncate a value someone must read or compare in full without a copy action or another way to see it.",
  ],
  keyboard: [
    "The list is text and isn't in the Tab order; links and copy actions in values are.",
    'Enter or Space on a copy action copies the value. The result replaces the action in place, as in CopyButton.',
  ],
  anatomy:
    'Root(dl) → Item(div) → Term(dt) + Value(dd: content, or text + CopyButton)',
  tokens: [
    '--surf-ink',
    '--surf-ink-muted',
    '--surf-size-row-default',
    '--surf-size-row-small',
    '--surf-space-4',
    '--surf-space-8',
  ],
  code: `import { DescriptionList } from '@surflane/ui'

<DescriptionList.Root columns={2}>
  <DescriptionList.Item>
    <DescriptionList.Term>Region</DescriptionList.Term>
    <DescriptionList.Value>ap-northeast-2</DescriptionList.Value>
  </DescriptionList.Item>
  <DescriptionList.Item>
    <DescriptionList.Term>Cluster ID</DescriptionList.Term>
    <DescriptionList.Value truncate copy>
      cls-7f3a9c2e41b84d0f9a1e
    </DescriptionList.Value>
  </DescriptionList.Item>
  <DescriptionList.Item>
    <DescriptionList.Term>Description</DescriptionList.Term>
    <DescriptionList.Value>{description}</DescriptionList.Value>
  </DescriptionList.Item>
</DescriptionList.Root>`,
  props: [
    ['Root.layout', 'inline | stacked', 'inline'],
    ['Root.columns', '1 | 2: two columns of items where both fit', '1'],
    [
      'Root.density',
      'default | compact; follows a SizeProvider density unless set',
      'surrounding',
    ],
    ['Root.size', 'small | default | large', 'surrounding'],
    [
      'Root.labels',
      '{ empty, copy, copied, copyError }: the empty value and the copy action',
      'Not set / Copy / Copied / Copy unavailable',
    ],
    [
      'Value.truncate',
      'one line with an ellipsis; text shows in full as the title',
      'false',
    ],
    [
      'Value.copy',
      "true copies the value's text, a string copies that string",
      '—',
    ],
    [
      'Root style --surf-description-list-term-width / -value-min-width / -column-min-width',
      'the term column, the narrowest value beside it, the narrowest column',
      '10rem / 10rem / 22rem',
    ],
  ],
}
