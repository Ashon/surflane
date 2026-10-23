'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { Button } from './button.js'
import { part, cx } from './parts.js'
import { ScrollArea } from './scroll-area.js'

const TableContainer = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ScrollArea> & {
    label: string
    /** Hangs the table into the gutter by its cell inset, so cell text lines up with
     * the text around it and a row's hover reaches past it evenly on both sides. */
    bleed?: boolean
  }
>(function TableContainer({ bleed, rootClassName, ...props }, ref) {
  return (
    <ScrollArea
      {...props}
      ref={ref}
      rootClassName={cx(bleed && 'pui-table-bleed', rootClassName)}
    />
  )
})
const RootPart = /* @__PURE__ */ part<
  HTMLTableElement,
  React.ComponentPropsWithoutRef<'table'>
>('table', 'pui-table')
export type TableDensity = 'default' | 'compact'
export type TableVariant = 'plain' | 'lined' | 'grid' | 'striped'
const TableRoot = /* @__PURE__ */ React.forwardRef<
  HTMLTableElement,
  React.ComponentPropsWithoutRef<typeof RootPart> & {
    /** compact tightens rows for scanning many records with a pointer. */
    density?: TableDensity
    /**
     * plain separates rows by space; lined draws lines between rows, grid between
     * rows and columns, both inside the table only; striped tones every other row.
     */
    variant?: TableVariant
    /** Keeps the header visible while a bounded Container scrolls vertically. */
    stickyHeader?: boolean
  }
>(function TableRoot({ density, variant, stickyHeader, ...props }, ref) {
  return (
    <RootPart
      {...props}
      ref={ref}
      data-density={density === 'compact' ? 'compact' : undefined}
      data-variant={variant && variant !== 'plain' ? variant : undefined}
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
    <Icon
      name={
        sort === 'ascending'
          ? 'arrow-up'
          : sort === 'descending'
            ? 'arrow-down'
            : 'sort'
      }
      className='pui-table-sort-icon'
    />
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
      className={cx('pui-table-sort-header', className)}
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
      className={cx('pui-table-truncate', className)}
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
        className={cx('pui-table-cell pui-table-message', className)}
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
      className={cx('pui-table-row', className)}
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
// Flat names for React Server Components, which cannot dot into client exports.
export {
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
  Caption: TableCaption,
  Head: TableHead,
  Body: TableBody,
  Foot: TableFoot,
} = Table
export {
  useTableSelection,
  type TableSelectionOptions,
  type TableSelectionCheckbox,
} from './table-selection.js'
