import type { ComponentDoc } from './componentDocs'
export const dataTableDocs: Record<string, ComponentDoc> = {
  'data-table': {
    usage: [
      'Combine Table, FilterBar, Checkbox, Menu, and Pagination for comparison tasks.',
      'Process data in order: filter → stable sort → paginate. Changing the search, sort, or page size returns to the first page.',
      'Preserve selection by row ID. The header checkbox selects only manageable rows on the current page.',
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
      'Preview mode → FilterBar(query, product, reset, result summary) → bulk actions + Columns menu → Table.Container(Table caption, sort headers, page selection, row headers, native links, state) → page size + Pagination → action result',
    keyboard: [
      'Tab, Shift+Tab, Enter, and Space operate the controls. Each sort control is a button inside its header cell.',
      'Search and page changes keep focus on the control in use. Focus returns to the search input after loading finishes, a retry, restored access, or a cleared search.',
      "The Columns menu follows Base UI's arrow keys and Escape, and returns focus to its trigger.",
      'On mobile, the shared ScrollArea handles horizontal overflow.',
      'The table keeps native semantics with scope=col and scope=row. Only the sorted column has aria-sort.',
    ],
    tokens: [
      '--space-2',
      '--space-4',
      '--ink-body',
      '--selected',
      '--control-focus',
      '--interaction-hover-bg',
      '--scrollbar-thumb',
    ],
    code: `import { Table, Checkbox, FilterBar, Pagination, Button } from '@surflane/ui'

// Product-owned state: query, filters, sorting, selected stable IDs, page, columns.
const sorted = stableSort(filter(rows, query), sort)
const visible = sorted.slice((page - 1) * size, page * size)
const manageable = visible.filter((row) => row.canManage)

<Table.Container label='Resource comparison' orientation='horizontal'>
  <Table.Root>
    <Table.Caption>Resources</Table.Caption>
    <Table.Head>
      <Table.Row>
        <Table.HeaderCell scope='col' aria-sort='ascending'>
          <Button variant='ghost' onClick={toggleNameSort}>
            Name
          </Button>
        </Table.HeaderCell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {visible.map((row) => (
        <Table.Row key={row.id} selected={selected.has(row.id)}>
          <Table.HeaderCell scope='row'>
            <a href={row.href}>{row.name}</a>
          </Table.HeaderCell>
        </Table.Row>
      ))}
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
        'name required; product and environment toggle independently',
        'both visible',
      ],
      [
        'Sort',
        'name / product / environment, ascending / descending; hiding active sort restores name',
        'name ascending',
      ],
      [
        'Page size',
        '3 / 5 / 10; changes reset page; no results shows empty state',
        '3',
      ],
      [
        'Preview state',
        'ready / loading / error / permission / empty; manual recovery, no service calls',
        'ready',
      ],
    ],
  },
}
