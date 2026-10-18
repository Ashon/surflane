import type { ComponentDoc } from './componentDocs'
export const dataDocs: Record<string, ComponentDoc> = {
  table: {
    usage:
      'Compare relationships across rows and columns. Render a native table: Caption, HeaderCell with scope=col or scope=row, and Cell. Wrap it in Container, the labeled scroll region. The calling screen owns sorting, search, and selection state.',
    avoid: [
      "Don't add a grid role or arrow-key cell navigation to an ordinary table. Keep native table semantics instead.",
      "Don't rely on whole-row clicks. Put links, buttons, and checkboxes in the cells instead.",
      "Don't rely on Row.selected alone, because it's visual only. Pair it with a named checkbox, which carries the selection semantics.",
    ],
    anatomy:
      'Container(ScrollArea) → Root(table) → Caption + Head(Row/HeaderCell) + Body(Row/Cell)',
    keyboard:
      "Tab moves through sort buttons, row selection checkboxes, and actions. Rows aren't focus targets. On small screens, the labeled region takes focus and scrolls horizontally. Set aria-sort on the sorted HeaderCell.",
    tokens: [
      '--space-3',
      '--space-4',
      '--radius-md',
      '--interaction-hover-bg',
      '--selected',
    ],
    code: `import { Table } from '@surflane/ui'

<Table.Container label='Environment comparison'>
  <Table.Root>
    <Table.Caption>Registered environments</Table.Caption>
    <Table.Head>
      <Table.Row>
        <Table.HeaderCell scope='col'>Name</Table.HeaderCell>
        <Table.HeaderCell scope='col'>Services</Table.HeaderCell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      <Table.Row>
        <Table.HeaderCell scope='row'>DEMO main</Table.HeaderCell>
        <Table.Cell>3</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>
</Table.Container>`,
    props: [
      ['Container.label', 'accessible name of the scroll region', 'required'],
      [
        'Root / Caption / Head / Body / Foot',
        'native table element props',
        '—',
      ],
      [
        'HeaderCell.scope / aria-sort',
        'native header scope and sort state',
        'caller supplied',
      ],
      [
        'Row.selected',
        'visual only; a named checkbox carries selection semantics',
        'false',
      ],
      ['Cell.colSpan / headers', 'native table-cell attributes', '—'],
    ],
  },
  list: {
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
    tokens: ['--space-3', '--space-4', '--radius-md', '--interaction-hover-bg'],
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
  },
  'inline-message': {
    usage:
      "Explain a notice, error, or warning about the current task, with its cause and next step. Static messages aren't live regions. Announce only asynchronous changes, with role=status, or role=alert when urgent.",
    avoid: [
      "Don't distinguish tones by color alone. State the status in Title and Description instead.",
      "Don't announce every message as an alert on page load. Leave static messages unannounced instead.",
      "Don't imply that retrying guarantees a real result. Say what the retry attempts instead.",
    ],
    anatomy: 'Root(tone) → Icon(tone) + Content(Title + Description + Actions)',
    keyboard:
      "The message doesn't take focus. Tab reaches the action buttons, and Enter or Space activates them. The Icon is decorative. Title and Description convey the status. The caller sets Root.role.",
    tokens: [
      '--status-danger-bg',
      '--status-danger-fg',
      '--status-caution-bg',
      '--status-success-bg',
      '--radius-md',
      '--space-4',
    ],
    code: `import { InlineMessage, Button } from '@surflane/ui'

<InlineMessage.Root tone='danger'>
  <InlineMessage.Icon tone='danger' />
  <InlineMessage.Content>
    <InlineMessage.Title>Discovery failed</InlineMessage.Title>
    <InlineMessage.Description>
      Check the connection and retry.
    </InlineMessage.Description>
    <InlineMessage.Actions>
      <Button onClick={retry}>Retry</Button>
    </InlineMessage.Actions>
  </InlineMessage.Content>
</InlineMessage.Root>`,
    props: [
      [
        'Root.tone / Icon.tone',
        'neutral | success | danger | caution | progress',
        'neutral',
      ],
      [
        'Root.role',
        'native role; choose live announcements deliberately',
        'none',
      ],
      ['Icon.children', 'custom decorative icon', 'semantic status SVG'],
      ['Title / Description / Actions', 'native strong / p / div props', '—'],
    ],
  },
  'empty-state': {
    usage:
      "Explain why there's nothing to show and offer possible next steps. Distinguish first use, no search results, and insufficient permissions. When other content is present, show the state in the relevant region instead of replacing the whole screen.",
    avoid:
      "Don't present an error as an empty success state. Use InlineMessage instead. Don't prompt people to create something they lack permission for. Don't make an action they can't perform the primary button. Offer permission guidance instead.",
    anatomy:
      'Root → optional decorative Icon + Title(h3) + Description + Actions',
    keyboard:
      "It doesn't take focus or create a live region. Set Title.level to fit the surrounding heading hierarchy. Offer clearing a search, creating an item, and permission guidance as clearly named buttons or links.",
    tokens: ['--space-6', '--space-4', '--ink-body', '--ink-muted'],
    code: `import { EmptyState, Button } from '@surflane/ui'

<EmptyState.Root>
  <EmptyState.Title>No matching environments</EmptyState.Title>
  <EmptyState.Description>
    Try another name or clear the filters.
  </EmptyState.Description>
  <EmptyState.Actions>
    <Button onClick={clearFilters}>Clear filters</Button>
  </EmptyState.Actions>
</EmptyState.Root>`,
    props: [
      ['Root', 'native div props; no automatic role or focus', '—'],
      ['Title', 'native heading props + level (2–6)', 'h3'],
      ['Icon', 'native div props; set aria-hidden on a decorative SVG', '—'],
      ['Description / Actions', 'native p / div props', '—'],
    ],
  },
}
