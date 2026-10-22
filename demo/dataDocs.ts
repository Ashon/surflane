import type { ComponentDoc } from './componentDocs'
export const dataDocs: Record<string, ComponentDoc> = {
  table: {
    usage:
      'Compare relationships across rows and columns. Render a native table: Caption, HeaderCell with scope=col or scope=row, and Cell. Wrap it in Container, the labeled scroll region. Set numeric on number columns, use SortHeader for sortable columns, and set density="compact" for consoles people scan with a pointer. The calling screen owns sorting, search, and selection state; useTableSelection keeps selection by row ID. See Guidelines below for each rule with a working design.',
    avoid: [
      "Don't add a grid role or arrow-key cell navigation to an ordinary table. Keep native table semantics instead.",
      "Don't rely on whole-row clicks. Put links, buttons, and checkboxes in the cells instead.",
      "Don't rely on Row.selected alone, because it's visual only. Pair it with a named checkbox, which carries the selection semantics.",
      "Don't put units in every cell. Name the unit in the header and set numeric instead.",
    ],
    anatomy:
      'Container(ScrollArea) → Root(table, density, stickyHeader) → Caption + Head(Row/HeaderCell or SortHeader) + Body(Row/Cell, Truncate, or Message)',
    keyboard:
      "Tab moves through sort buttons, row selection checkboxes, and actions. Rows aren't focus targets. On small screens, the labeled region takes focus and scrolls horizontally. SortHeader sets aria-sort on the sorted column only, and its button keeps the column's visible name.",
    tokens: [
      '--space-1',
      '--space-3',
      '--space-4',
      '--radius-md',
      '--interaction-hover-bg',
      '--selected',
      '--line',
    ],
    code: `import { Table, Checkbox, useTableSelection } from '@surflane/ui'

const selection = useTableSelection({
  rows: pageRows,
  getId: (row) => row.id,
  canSelect: (row) => row.canManage,
})

<Table.Container label='Service inventory'>
  <Table.Root density='compact'>
    <Table.Caption>Services</Table.Caption>
    <Table.Head>
      <Table.Row>
        <Table.HeaderCell scope='col'>
          <Checkbox.Root
            aria-label='Select services on this page'
            {...selection.pageCheckbox}
          >
            <Checkbox.Indicator />
          </Checkbox.Root>
        </Table.HeaderCell>
        <Table.SortHeader sort='ascending' onSort={toggleNameSort}>
          Name
        </Table.SortHeader>
        <Table.SortHeader numeric onSort={sortByLatency}>
          p95 latency (ms)
        </Table.SortHeader>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {pageRows.map((row) => (
        <Table.Row key={row.id} selected={selection.isSelected(row.id)}>
          <Table.Cell>
            <Checkbox.Root
              aria-label={\`Select \${row.name}\`}
              {...selection.rowCheckbox(row)}
            >
              <Checkbox.Indicator />
            </Checkbox.Root>
          </Table.Cell>
          <Table.HeaderCell scope='row'>{row.name}</Table.HeaderCell>
          <Table.Cell numeric>{row.latency.toLocaleString()}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Root>
</Table.Container>`,
    props: [
      ['Container.label', 'accessible name of the scroll region', 'required'],
      [
        'Container.bleed',
        'hangs the table by its cell inset, so cell text meets the text around it',
        'false',
      ],
      [
        'Root.density',
        'default | compact; compact sets 4px cell padding and 2px between rows',
        'default',
      ],
      [
        'Root.stickyHeader',
        'keeps the header in view inside a Container with a bounded height and orientation="both"; --table-surface sets its background',
        'false',
      ],
      ['Caption / Head / Body / Foot', 'native table element props', '—'],
      [
        'HeaderCell.scope / aria-sort',
        'native header scope and sort state',
        'caller supplied',
      ],
      [
        'HeaderCell.numeric / Cell.numeric',
        'aligns to the end with tabular figures',
        'false',
      ],
      ['HeaderCell.align / Cell.align', 'start | center | end', 'start'],
      [
        'SortHeader.sort / onSort',
        'ascending | descending on the sorted column, omitted on the others; onSort runs on press',
        'unsorted',
      ],
      [
        'Truncate',
        'one line with an ellipsis, 32ch by default; string content becomes the title',
        '—',
      ],
      [
        'Message.colSpan',
        'a full-width body row for loading, empty, error, and permission messages, without hover',
        'required',
      ],
      [
        'Row.selected',
        'visual only; a named checkbox carries selection semantics',
        'false',
      ],
      ['Cell.colSpan / headers', 'native table-cell attributes', '—'],
      [
        'useTableSelection',
        'rows, getId, canSelect, selected or defaultSelected, onSelectedChange → pageCheckbox, rowCheckbox(row), isSelected, toggle, clear, hiddenCount',
        '—',
      ],
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
  stat: {
    usage:
      'Show a key figure on a dashboard: what it measures, its value, how it moved and what it covers. Change takes the change as a number, shows its sign and an arrow, and colors it by direction with the trend tokens. Format values with formatNumber, formatCurrency or formatPercent, so every screen writes numbers the same way.',
    avoid: [
      "Don't show direction with color alone. Change keeps the sign and the arrow, so leave them in.",
      "Don't put a long sentence in Caption. Name the period or the comparison, such as 'vs. yesterday's close'.",
      "Don't use Stat for values people need to compare across rows. Use a Table with numeric cells instead.",
    ],
    keyboard:
      'Stat is static text: a description list in which the label names the value. Nothing enters the Tab order. A link or button you add keeps its own focus.',
    anatomy: 'Root(dl) → Label(dt) + Value(dd) + Change(dd) + Caption(dd)',
    tokens: [
      '--type-metric-size',
      '--trend-up-fg',
      '--trend-down-fg',
      '--trend-flat-fg',
      '--ink-muted',
    ],
    code: `import { Stat, formatCurrency } from '@surflane/ui'

<Stat.Root>
  <Stat.Label>Portfolio value</Stat.Label>
  <Stat.Value>
    {formatCurrency(128_450_000, 'KRW', { locale: 'ko-KR' })}
  </Stat.Value>
  <Stat.Change value={0.0123} />
  <Stat.Caption>vs. yesterday's close</Stat.Caption>
</Stat.Root>`,
    props: [
      ['Change.value', 'number; its sign sets the direction', 'required'],
      [
        'Change.format',
        '(value) => ReactNode',
        'signed percentage, such as +1.2%',
      ],
      ['Change.direction', 'up | down | flat', 'from the sign'],
      [
        'Change.lowerIsBetter',
        'swaps the colors for measures where a fall is good',
        'false',
      ],
      ['Root / Label / Value / Caption', 'native dl, dt and dd props', '—'],
    ],
  },
  sparkline: {
    usage:
      'Show the shape of a series inside a card or a table cell, next to the figure it explains. It has no axes, legend or tooltip: label states what the line shows and how it moved. Set baseline to a reference value, such as the previous close.',
    avoid: [
      "Don't use Sparkline when people need to read values. Use Chart, which has axes, a readout and a table.",
      "Don't leave out label. The line is an image, and the label is all a screen reader hears.",
    ],
    keyboard:
      'Sparkline is an image with an accessible name. It takes no focus and has no interaction.',
    anatomy: 'svg(role=img, aria-label) → baseline + line + end marker',
    tokens: [
      '--trend-up-fg',
      '--trend-down-fg',
      '--ink-body',
      '--icon-stroke-width',
    ],
    code: `import { Sparkline } from '@surflane/ui'

<Sparkline
  data={closes}
  baseline={previousClose}
  label='KOSPI, last 30 days, up 2.3%'
/>`,
    props: [
      ['data', '(number | null)[]; a missing value leaves a gap', 'required'],
      ['label', 'accessible name of the line', 'required'],
      ['size', 'small | default | large: 24, 32 or 48px tall', 'default'],
      ['baseline', "number | 'first' | 'none'", "'none'"],
      ['marker', 'dot on the last value', 'true'],
      [
        'trend',
        'auto | up | down | flat | neutral',
        'auto: last value against the baseline or first value',
      ],
      ['lowerIsBetter', 'swaps the up and down colors', 'false'],
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
        'neutral | info | success | danger | caution | progress',
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
