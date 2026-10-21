'use client'
import * as React from 'react'
import { Button } from './button.js'
import { part } from './parts.js'
import { ScrollArea } from './scroll-area.js'

const TableContainer = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ScrollArea> & { label: string }
>(function TableContainer(props, ref) {
  return <ScrollArea {...props} ref={ref} />
})
const RootPart = /* @__PURE__ */ part<
  HTMLTableElement,
  React.ComponentPropsWithoutRef<'table'>
>('table', 'pui-table')
export type TableDensity = 'default' | 'compact'
const TableRoot = /* @__PURE__ */ React.forwardRef<
  HTMLTableElement,
  React.ComponentPropsWithoutRef<typeof RootPart> & {
    /** compact tightens rows for scanning many records with a pointer. */
    density?: TableDensity
    /** Keeps the header visible while a bounded Container scrolls vertically. */
    stickyHeader?: boolean
  }
>(function TableRoot({ density, stickyHeader, ...props }, ref) {
  return (
    <RootPart
      {...props}
      ref={ref}
      data-density={density === 'compact' ? 'compact' : undefined}
      data-sticky-header={stickyHeader || undefined}
    />
  )
})
type CellLayout = {
  align?: 'start' | 'center' | 'end'
  /** Aligns to the end with tabular figures, so digits line up down the column. */
  numeric?: boolean
}
const layout = ({ align, numeric }: CellLayout) => ({
  'data-align': numeric ? 'end' : align,
  'data-numeric': numeric || undefined,
})
const HeaderCellPart = /* @__PURE__ */ part<
  HTMLTableCellElement,
  React.ComponentPropsWithoutRef<'th'>
>('th', 'pui-table-cell pui-table-header')
const CellPart = /* @__PURE__ */ part<
  HTMLTableCellElement,
  React.ComponentPropsWithoutRef<'td'>
>('td', 'pui-table-cell')
// align replaces the obsolete HTML align attribute of th and td.
const TableHeaderCell = /* @__PURE__ */ React.forwardRef<
  HTMLTableCellElement,
  Omit<React.ComponentPropsWithoutRef<typeof HeaderCellPart>, 'align'> &
    CellLayout
>(function TableHeaderCell({ align, numeric, ...props }, ref) {
  return <HeaderCellPart {...props} {...layout({ align, numeric })} ref={ref} />
})
const TableCell = /* @__PURE__ */ React.forwardRef<
  HTMLTableCellElement,
  Omit<React.ComponentPropsWithoutRef<typeof CellPart>, 'align'> & CellLayout
>(function TableCell({ align, numeric, ...props }, ref) {
  return <CellPart {...props} {...layout({ align, numeric })} ref={ref} />
})
export type TableSort = 'ascending' | 'descending'
function SortIcon({ sort }: { sort?: TableSort }) {
  return (
    <svg
      className='pui-table-sort-icon'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path
        d={
          sort === 'ascending'
            ? 'M12 19V5m-6 6 6-6 6 6'
            : sort === 'descending'
              ? 'M12 5v14m-6-6 6 6 6-6'
              : 'm8 9 4-4 4 4m-8 6 4 4 4-4'
        }
      />
    </svg>
  )
}
/** A column header whose button sorts the column. aria-sort names the order on the sorted column only. */
const TableSortHeader = /* @__PURE__ */ React.forwardRef<
  HTMLTableCellElement,
  Omit<
    React.ComponentPropsWithoutRef<typeof TableHeaderCell>,
    'scope' | 'aria-sort' | 'onClick'
  > & {
    sort?: TableSort
    onSort: () => void
    disabled?: boolean
  }
>(function TableSortHeader(
  { sort, onSort, disabled, children, className, ...props },
  ref,
) {
  return (
    <TableHeaderCell
      {...props}
      ref={ref}
      scope='col'
      aria-sort={sort}
      className={['pui-table-sort-header', className].filter(Boolean).join(' ')}
    >
      <Button
        variant='ghost'
        className='pui-table-sort'
        data-sort={sort}
        disabled={disabled}
        onClick={onSort}
      >
        <span>{children}</span>
        <SortIcon sort={sort} />
      </Button>
    </TableHeaderCell>
  )
})
/** One-line text that ends in an ellipsis. String content also becomes the title. */
const TableTruncate = /* @__PURE__ */ React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(function TableTruncate({ className, title, children, ...props }, ref) {
  return (
    <span
      {...props}
      ref={ref}
      title={title ?? (typeof children === 'string' ? children : undefined)}
      className={['pui-table-truncate', className].filter(Boolean).join(' ')}
    >
      {children}
    </span>
  )
})
/** A full-width body row for loading, empty, error and permission messages. It has no hover. */
const TableMessage = /* @__PURE__ */ React.forwardRef<
  HTMLTableCellElement,
  React.ComponentPropsWithoutRef<'td'> & { colSpan: number }
>(function TableMessage({ className, ...props }, ref) {
  return (
    <tr className='pui-table-row pui-table-message-row'>
      <td
        {...props}
        ref={ref}
        className={['pui-table-cell pui-table-message', className]
          .filter(Boolean)
          .join(' ')}
      />
    </tr>
  )
})
const TableRow = /* @__PURE__ */ React.forwardRef<
  HTMLTableRowElement,
  React.ComponentPropsWithoutRef<'tr'> & { selected?: boolean }
>(function TableRow({ selected, className, ...props }, ref) {
  return (
    <tr
      {...props}
      ref={ref}
      data-selected={selected || undefined}
      className={['pui-table-row', className].filter(Boolean).join(' ')}
    />
  )
})
export const Table = {
  Container: TableContainer,
  Root: TableRoot,
  Caption: /* @__PURE__ */ part<
    HTMLTableCaptionElement,
    React.ComponentPropsWithoutRef<'caption'>
  >('caption', 'pui-table-caption'),
  Head: /* @__PURE__ */ part<
    HTMLTableSectionElement,
    React.ComponentPropsWithoutRef<'thead'>
  >('thead', 'pui-table-head'),
  Body: /* @__PURE__ */ part<
    HTMLTableSectionElement,
    React.ComponentPropsWithoutRef<'tbody'>
  >('tbody', 'pui-table-body'),
  Foot: /* @__PURE__ */ part<
    HTMLTableSectionElement,
    React.ComponentPropsWithoutRef<'tfoot'>
  >('tfoot', 'pui-table-foot'),
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  SortHeader: TableSortHeader,
  Cell: TableCell,
  Truncate: TableTruncate,
  Message: TableMessage,
}
const ListRoot = /* @__PURE__ */ React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<'ul'>
>(function ListRoot({ className, ...props }, ref) {
  return (
    <ul
      role='list'
      {...props}
      ref={ref}
      className={['pui-list', className].filter(Boolean).join(' ')}
    />
  )
})
const ListItem = /* @__PURE__ */ React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'> & { selected?: boolean }
>(function ListItem({ selected, className, ...props }, ref) {
  return (
    <li
      {...props}
      ref={ref}
      data-selected={selected || undefined}
      className={['pui-list-item', className].filter(Boolean).join(' ')}
    />
  )
})
export const List = {
  Root: ListRoot,
  Item: ListItem,
  Content: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'pui-list-content'),
  Title: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'pui-list-title'),
  Description: /* @__PURE__ */ part<
    HTMLParagraphElement,
    React.ComponentPropsWithoutRef<'p'>
  >('p', 'pui-list-description'),
  Actions: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'pui-list-actions'),
}

// Flat names for React Server Components, which cannot dot into client exports.
export {
  ListRoot,
  ListItem,
  TableContainer,
  TableRoot,
  TableRow,
  TableHeaderCell,
  TableSortHeader,
  TableCell,
  TableTruncate,
  TableMessage,
}
export const {
  Content: ListContent,
  Title: ListTitle,
  Description: ListDescription,
  Actions: ListActions,
} = List
export const {
  Caption: TableCaption,
  Head: TableHead,
  Body: TableBody,
  Foot: TableFoot,
} = Table
