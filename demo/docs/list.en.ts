import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Show a repeated set of independent resources or history entries. Put body text in Content, and status and actions in Actions. Each Item pads its hover surface 16px horizontally and 12px vertically.',
  avoid: [
    "Don't add dividers between items or nest cards. Let the List's spacing and hover surface separate items instead.",
    "Don't rely on whole-item clicks. Use links and buttons that name their purpose instead.",
    "Don't use List as a Listbox selection widget. To pick options, use Select, Combobox, or CheckboxGroup instead.",
  ],
  anatomy:
    'Root(ul role=list) → Item(li) → Content(Title + Description) + Actions',
  keyboard:
    'Only the inner actions enter the Tab order. Root keeps the native list structure. On small screens, Actions move to the next line.',
  tokens: [
    '--surf-space-3',
    '--surf-space-4',
    '--surf-radius-md',
    '--surf-interaction-hover-bg',
  ],
  code: `import { List, Button } from '@surflane/ui'

<List.Root aria-label='Registered environments'>
  <List.Item>
    <List.Content>
      <List.Title>DEMO main</List.Title>
      <List.Description>3 discovered services</List.Description>
    </List.Content>
    <List.Actions>
      <Button variant='outline'>Inspect DEMO main</Button>
    </List.Actions>
  </List.Item>
</List.Root>`,
  props: [
    ['Root', 'native ul props with role=list', '—'],
    ['Item', 'native li props', '—'],
    [
      'Item.selected',
      'visual only; a Checkbox carries checked semantics',
      'false',
    ],
    ['Content / Title / Actions', 'native div props', '—'],
    ['Description', 'native p props', '—'],
  ],
}
