import type { ComponentDoc } from './componentDocs'
export const dataTableDocs: Record<string, ComponentDoc> = {
  'data-table': {
    usage:
      'Combines Table, FilterBar, Checkbox, Menu, and Pagination for comparison tasks. Data is computed in the order filter → stable sort → paginate, and changing the search, sort, or page size returns to the first page. Selection is preserved by row ID, and the header checkbox applies only to manageable rows on the current page. The number of selections outside the current page is announced, and bulk actions apply to an explicit selection set that includes hidden selections. Column settings always keep the required name column, and hiding the sorted column restores sorting by name ascending.',
    avoid:
      "Don't turn the whole table into an ARIA grid or hide navigation in whole-row clicks. Checkboxes, name links, and sort buttons each act independently. Don't automatically select server results that aren't visible. This example handles only small local data. The product implements server-side filtering, sorting, and pagination for large datasets, URL state, request cancellation, permissions, idempotent bulk changes, and selection validation. Don't assume virtualization or server-wide selection is implemented.",
    anatomy:
      'Preview mode → FilterBar(query, product, reset, result summary) → bulk actions + Columns menu → Table.Container(Table caption, sort headers, page selection, row headers, native links, state) → page size + Pagination → action result',
    keyboard:
      "Keeps native table semantics and scope=col/row. Sorting lives in a button inside the header, and aria-sort is set on the single currently sorted column. Tab/Shift+Tab and Enter/Space operate the controls, and the column settings menu follows Base UI's arrow keys, Escape, and trigger focus restoration. Search and page changes keep focus on the control in use. Finished loading, retry, restored access, and clearing the search return focus to the search input. Horizontal overflow on mobile is handled by the shared ScrollArea.",
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
