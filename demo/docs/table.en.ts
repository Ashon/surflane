import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
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
    '--surf-space-1',
    '--surf-space-3',
    '--surf-space-4',
    '--surf-radius-md',
    '--surf-interaction-hover-bg',
    '--surf-selected',
    '--surf-line',
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
      'Root.variant',
      'plain | lined | grid | striped; lined draws lines between rows and grid between rows and columns, inside the table only; striped tones every other row',
      'plain',
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
}
