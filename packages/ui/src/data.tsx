'use client'
import * as React from 'react'
import { part } from './parts.js'
import { ScrollArea } from './scroll-area.js'

const TableContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ScrollArea> & { label: string }
>(function TableContainer(props, ref) {
  return <ScrollArea {...props} ref={ref} />
})
const TableRow = React.forwardRef<
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
  Root: part<HTMLTableElement, React.ComponentPropsWithoutRef<'table'>>(
    'table',
    'pui-table',
  ),
  Caption: part<
    HTMLTableCaptionElement,
    React.ComponentPropsWithoutRef<'caption'>
  >('caption', 'pui-table-caption'),
  Head: part<HTMLTableSectionElement, React.ComponentPropsWithoutRef<'thead'>>(
    'thead',
    'pui-table-head',
  ),
  Body: part<HTMLTableSectionElement, React.ComponentPropsWithoutRef<'tbody'>>(
    'tbody',
    'pui-table-body',
  ),
  Foot: part<HTMLTableSectionElement, React.ComponentPropsWithoutRef<'tfoot'>>(
    'tfoot',
    'pui-table-foot',
  ),
  Row: TableRow,
  HeaderCell: part<HTMLTableCellElement, React.ComponentPropsWithoutRef<'th'>>(
    'th',
    'pui-table-cell pui-table-header',
  ),
  Cell: part<HTMLTableCellElement, React.ComponentPropsWithoutRef<'td'>>(
    'td',
    'pui-table-cell',
  ),
}
const ListRoot = React.forwardRef<
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
const ListItem = React.forwardRef<
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
  Content: part<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
    'div',
    'pui-list-content',
  ),
  Title: part<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
    'div',
    'pui-list-title',
  ),
  Description: part<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
    'p',
    'pui-list-description',
  ),
  Actions: part<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
    'div',
    'pui-list-actions',
  ),
}

// Flat names for React Server Components, which cannot dot into client exports.
export { ListRoot, ListItem, TableContainer, TableRow }
export const {
  Content: ListContent,
  Title: ListTitle,
  Description: ListDescription,
  Actions: ListActions,
} = List
export const {
  Root: TableRoot,
  Caption: TableCaption,
  Head: TableHead,
  Body: TableBody,
  Foot: TableFoot,
  HeaderCell: TableHeaderCell,
  Cell: TableCell,
} = Table
