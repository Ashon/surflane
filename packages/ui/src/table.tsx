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
      rootClassName={cx(
        'surf-table-container',
        bleed && 'surf-table-bleed',
        rootClassName,
      )}
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
  stickyColumn,
  layout,
  minWidth,
  nowrap,
  style,
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
  /** Keeps the first column, such as each row's name, in place while the Container
   * scrolls sideways. That edge of the Container stops fading, and a line marks it
   * once rows pass under it. */
  stickyColumn?: boolean
  /** fixed sizes columns by Table.Column widths and the header row, not by their
   * content, so they hold still while rows change and long text truncates.
   * Columns without a width share what is left. */
  layout?: 'auto' | 'fixed'
  /** The narrowest the table gets, such as '50rem'; a Container scrolls past it. */
  minWidth?: string
  /** Keeps each cell on one line, as a console's rows are. Table.Truncate ends
   * long text in an ellipsis. */
  nowrap?: boolean
} & { ref?: React.Ref<HTMLTableElement> }) {
  return (
    <RootPart
      {...props}
      ref={ref}
      style={
        minWidth === undefined ? style : { minInlineSize: minWidth, ...style }
      }
      data-layout={layout === 'fixed' ? 'fixed' : undefined}
      data-nowrap={nowrap || undefined}
      data-density={density}
      data-variant={variant && variant !== 'plain' ? variant : undefined}
      data-sticky-header={stickyHeader || undefined}
      data-sticky-column={stickyColumn || undefined}
    />
  )
}
type CellLayout = {
  align?: 'start' | 'center' | 'end'
  /** Aligns to the end with tabular figures, so digits line up down the column. */
  numeric?: boolean
  /** Steps the column aside when its Container is narrower than sm (30rem) or md
   * (40rem), so the columns that matter keep their room. Give it to every cell of
   * the column, header included. */
  hideBelow?: 'sm' | 'md'
}
const layout = ({ align, numeric, hideBelow }: CellLayout) => ({
  'data-align': numeric ? 'end' : align,
  'data-numeric': numeric || undefined,
  'data-hide-below': hideBelow,
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
  hideBelow,
  ref,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof HeaderCellPart>, 'align'> &
  CellLayout & { ref?: React.Ref<HTMLTableCellElement> }) {
  return (
    <HeaderCellPart
      {...props}
      {...layout({ align, numeric, hideBelow })}
      ref={ref}
    />
  )
}
const TableCell = function TableCell({
  align,
  numeric,
  hideBelow,
  ref,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof CellPart>, 'align'> &
  CellLayout & { ref?: React.Ref<HTMLTableCellElement> }) {
  return (
    <CellPart {...props} {...layout({ align, numeric, hideBelow })} ref={ref} />
  )
}
/** One column's width, such as '8rem' for a status, in a Table.Columns group. */
const TableColumn = function TableColumn({
  width,
  className,
  style,
  ref,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'col'>, 'width'> & {
  width?: string
} & { ref?: React.Ref<HTMLTableColElement> }) {
  return (
    <col
      {...props}
      ref={ref}
      className={cx('surf-table-column', className)}
      style={width === undefined ? style : { inlineSize: width, ...style }}
    />
  )
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
  measure,
  className,
  title,
  style,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'span'> & {
  /** The widest it gets before the ellipsis, such as '44ch' for long image
   * references; 32ch without it. */
  measure?: string
  ref?: React.Ref<HTMLSpanElement>
}) {
  return (
    <span
      {...props}
      ref={ref}
      title={title ?? (typeof children === 'string' ? children : undefined)}
      style={
        measure
          ? ({
              ...style,
              '--surf-table-truncate-measure': measure,
            } as React.CSSProperties)
          : style
      }
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
  Columns: /* @__PURE__ */ elementPart<
    HTMLTableColElement,
    React.ComponentPropsWithoutRef<'colgroup'>
  >('colgroup', 'surf-table-columns'),
  Column: TableColumn,
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
  TableColumn,
  TableTruncate,
  TableMessage,
}
export const {
  Caption: TableCaption,
  Head: TableHead,
  Body: TableBody,
  Foot: TableFoot,
  Columns: TableColumns,
} = Table
export {
  useTableSelection,
  type TableSelectionOptions,
  type TableSelectionCheckbox,
} from './table-selection.js'
