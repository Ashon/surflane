import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage: [
    'Combine Table, FilterBar, Checkbox, Menu, and Pagination for comparison tasks. The table follows the Table guidelines.',
    'Process data in order: filter → stable sort → paginate. Changing the search, sort, or page size returns to the first page.',
    'Sort with Table.SortHeader. Text sorts ascending first and numbers descending first; a status line announces the new order.',
    'Keep selection with useTableSelection, by row ID. The header checkbox selects only manageable rows on the current page.',
    'Keep the header and column widths in every state. Loading shows skeleton rows for the page size with aria-busy; errors, missing access and empty results sit in Table.Message rows.',
    'Announce how many selections sit outside the current page. Bulk actions apply to an explicit selection set that includes hidden selections.',
    'The Columns menu always keeps the required name column. Hiding the sorted column resets the sort to name ascending.',
  ],
  avoid: [
    "Don't turn the whole table into an ARIA grid. Keep native table semantics.",
    "Don't hide navigation in whole-row clicks. Checkboxes, name links, and sort buttons each act on their own.",
    "Don't auto-select server results that aren't visible.",
    "Don't assume virtualization or server-wide selection. Neither is implemented, and the example handles only small local data.",
    "Don't filter, sort, or paginate large datasets locally. The product owns server-side filtering, sorting, and pagination, plus URL state, request cancellation, permissions, idempotent bulk changes, and selection validation.",
  ],
  anatomy:
    'Preview mode → FilterBar(query, product, reset, result summary) → bulk actions + Columns menu → Table.Container(caption, fixed column widths, SortHeader columns, page selection, row headers with native links, numeric instances, state; skeleton or Message rows) → page size + Pagination → status line',
  keyboard: [
    'Tab, Shift+Tab, Enter, and Space operate the controls. Each sort control is a button inside its header cell.',
    'Search and page changes keep focus on the control in use. Focus returns to the search input after loading finishes, a retry, restored access, or a cleared search.',
    "The Columns menu follows Base UI's arrow keys and Escape, and returns focus to its trigger.",
    'On mobile, the shared ScrollArea handles horizontal overflow.',
    'The table keeps native semantics with scope=col and scope=row. Only the sorted column has aria-sort, and sort buttons are disabled while the table has no rows.',
  ],
  tokens: [
    '--surf-space-2',
    '--surf-space-4',
    '--surf-ink-body',
    '--surf-selected',
    '--surf-control-focus',
    '--surf-interaction-hover-bg',
    '--surf-scrollbar-thumb',
  ],
  code: `import { Table, Checkbox, Pagination, useTableSelection } from '@surflane/ui'

// Product-owned state: query, filters, sorting, selected stable IDs, page, columns.
const sorted = stableSort(filter(rows, query), sort)
const visible = sorted.slice((page - 1) * size, page * size)
const selection = useTableSelection({
  rows: visible,
  getId: (row) => row.id,
  canSelect: (row) => row.canManage,
  selected,
  onSelectedChange: setSelected,
})

<Table.Container label='Resource comparison' orientation='horizontal'>
  <Table.Root aria-busy={loading || undefined}>
    <Table.Caption>Resources</Table.Caption>
    <Table.Head>
      <Table.Row>
        <Table.HeaderCell scope='col'>
          <Checkbox.Root
            aria-label='Select manageable rows on this page'
            {...selection.pageCheckbox}
          >
            <Checkbox.Indicator />
          </Checkbox.Root>
        </Table.HeaderCell>
        <Table.SortHeader
          sort={sortOf('name')}
          onSort={() => toggleSort('name')}
        >
          Name
        </Table.SortHeader>
        <Table.SortHeader
          numeric
          sort={sortOf('instances')}
          onSort={() => toggleSort('instances')}
        >
          Instances
        </Table.SortHeader>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {error ? (
        <Table.Message colSpan={3}>…retry…</Table.Message>
      ) : (
        visible.map((row) => (
          <Table.Row key={row.id} selected={selection.isSelected(row.id)}>
            <Table.Cell>
              <Checkbox.Root
                aria-label={\`Select \${row.name}\`}
                {...selection.rowCheckbox(row)}
              >
                <Checkbox.Indicator />
              </Checkbox.Root>
            </Table.Cell>
            <Table.HeaderCell scope='row'>
              <a href={row.href}>{row.name}</a>
            </Table.HeaderCell>
            <Table.Cell numeric>{row.instances}</Table.Cell>
          </Table.Row>
        ))
      )}
    </Table.Body>
  </Table.Root>
</Table.Container>
<Pagination page={page} pageCount={pageCount} onPageChange={setPage} />

// Reset page on filter/sort/page-size changes and clamp after response changes.
// Header selection is only the current page's manageable rows, not all results.
// Revalidate selected IDs against authorization on the server before mutation.`,
  props: [
    [
      'Processing order',
      'query/product filters → stable sort with ID tie-break → clamped page',
      'caller-owned',
    ],
    [
      'Selection',
      'stable row IDs; current-page manageable select all; hidden selections announced',
      '[]',
    ],
    [
      'Columns',
      'name required; product, environment and instances toggle independently',
      'all visible',
    ],
    [
      'Sort',
      'name / product / environment ascending first, instances descending first; hiding active sort restores name',
      'name ascending',
    ],
    [
      'Page size',
      '3 / 5 / 10; changes reset page; no results shows empty state',
      '3',
    ],
    [
      'Preview state',
      'ready / loading (skeleton rows, aria-busy) / error / permission / empty (Message rows); manual recovery, no service calls',
      'ready',
    ],
  ],
}
