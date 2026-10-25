import * as React from 'react'
import { Icon } from './icon.js'
import { Button } from './button.js'
import { cx } from './class-names.js'
import { elementPart } from './element-part.js'
import { ScrollArea } from './scroll-area.js'

const TableContainer = function TableContainer({
  bleed,
  rootClassName,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof ScrollArea> & {
  label: string
  /** Hangs the table into the gutter by its cell inset, so cell text lines up with
   * the text around it and a row's hover reaches past it evenly on both sides. */
  bleed?: boolean
} & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <ScrollArea
      {...props}
      ref={ref}
      rootClassName={cx(bleed && 'surf-table-bleed', rootClassName)}
    />
  )
}
const RootPart = /* @__PURE__ */ elementPart<
  HTMLTableElement,
  React.ComponentPropsWithoutRef<'table'>
>('table', 'surf-table')
export type TableDensity = 'default' | 'compact'
export type TableVariant = 'plain' | 'lined' | 'grid' | 'striped'
const TableRoot = function TableRoot({
  density,
  variant,
  stickyHeader,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof RootPart> & {
  /** compact tightens rows for scanning many records with a pointer. Without it the
   * table follows a SizeProvider density; default keeps it roomy inside a compact one. */
  density?: TableDensity
  /**
   * plain separates rows by space; lined draws lines between rows, grid between
   * rows and columns, both inside the table only; striped tones every other row.
   */
  variant?: TableVariant
  /** Keeps the header visible while a bounded Container scrolls vertically. */
  stickyHeader?: boolean
} & { ref?: React.Ref<HTMLTableElement> }) {
  return (
    <RootPart
      {...props}
      ref={ref}
      data-density={density}
      data-variant={variant && variant !== 'plain' ? variant : undefined}
      data-sticky-header={stickyHeader || undefined}
    />
  )
}
type CellLayout = {
  align?: 'start' | 'center' | 'end'
  /** Aligns to the end with tabular figures, so digits line up down the column. */
  numeric?: boolean
}
const layout = ({ align, numeric }: CellLayout) => ({
  'data-align': numeric ? 'end' : align,
  'data-numeric': numeric || undefined,
})
const HeaderCellPart = /* @__PURE__ */ elementPart<
  HTMLTableCellElement,
  React.ComponentPropsWithoutRef<'th'>
>('th', 'surf-table-cell surf-table-header')
const CellPart = /* @__PURE__ */ elementPart<
  HTMLTableCellElement,
  React.ComponentPropsWithoutRef<'td'>
>('td', 'surf-table-cell')
// align replaces the obsolete HTML align attribute of th and td.
const TableHeaderCell = function TableHeaderCell({
  align,
  numeric,
  ref,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof HeaderCellPart>, 'align'> &
  CellLayout & { ref?: React.Ref<HTMLTableCellElement> }) {
  return <HeaderCellPart {...props} {...layout({ align, numeric })} ref={ref} />
}
const TableCell = function TableCell({
  align,
  numeric,
  ref,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof CellPart>, 'align'> &
  CellLayout & { ref?: React.Ref<HTMLTableCellElement> }) {
  return <CellPart {...props} {...layout({ align, numeric })} ref={ref} />
}
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
      className='surf-table-sort-icon'
    />
  )
}
/** A column header whose button sorts the column. aria-sort names the order on the sorted column only. */
const TableSortHeader = function TableSortHeader({
  sort,
  onSort,
  disabled,
  children,
  className,
  ref,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof TableHeaderCell>,
  'scope' | 'aria-sort' | 'onClick'
> & {
  sort?: TableSort
  onSort: () => void
  disabled?: boolean
} & { ref?: React.Ref<HTMLTableCellElement> }) {
  return (
    <TableHeaderCell
      {...props}
      ref={ref}
      scope='col'
      aria-sort={sort}
      className={cx('surf-table-sort-header', className)}
    >
      <Button
        variant='ghost'
        className='surf-table-sort'
        data-sort={sort}
        disabled={disabled}
        onClick={onSort}
      >
        <span>{children}</span>
        <SortIcon sort={sort} />
      </Button>
    </TableHeaderCell>
  )
}
/** One-line text that ends in an ellipsis. String content also becomes the title. */
const TableTruncate = function TableTruncate({
  className,
  title,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'span'> & {
  ref?: React.Ref<HTMLSpanElement>
}) {
  return (
    <span
      {...props}
      ref={ref}
      title={title ?? (typeof children === 'string' ? children : undefined)}
      className={cx('surf-table-truncate', className)}
    >
      {children}
    </span>
  )
}
/** A full-width body row for loading, empty, error and permission messages. It has no hover. */
const TableMessage = function TableMessage({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'td'> & { colSpan: number } & {
  ref?: React.Ref<HTMLTableCellElement>
}) {
  return (
    <tr className='surf-table-row surf-table-message-row'>
      <td
        {...props}
        ref={ref}
        className={cx('surf-table-cell surf-table-message', className)}
      />
    </tr>
  )
}
const TableRow = function TableRow({
  selected,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'tr'> & { selected?: boolean } & {
  ref?: React.Ref<HTMLTableRowElement>
}) {
  return (
    <tr
      {...props}
      ref={ref}
      data-selected={selected || undefined}
      className={cx('surf-table-row', className)}
    />
  )
}
export const Table = {
  Container: TableContainer,
  Root: TableRoot,
  Caption: /* @__PURE__ */ elementPart<
    HTMLTableCaptionElement,
    React.ComponentPropsWithoutRef<'caption'>
  >('caption', 'surf-table-caption'),
  Head: /* @__PURE__ */ elementPart<
    HTMLTableSectionElement,
    React.ComponentPropsWithoutRef<'thead'>
  >('thead', 'surf-table-head'),
  Body: /* @__PURE__ */ elementPart<
    HTMLTableSectionElement,
    React.ComponentPropsWithoutRef<'tbody'>
  >('tbody', 'surf-table-body'),
  Foot: /* @__PURE__ */ elementPart<
    HTMLTableSectionElement,
    React.ComponentPropsWithoutRef<'tfoot'>
  >('tfoot', 'surf-table-foot'),
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
