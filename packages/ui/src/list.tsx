'use client'
import * as React from 'react'
import { part, cx } from './parts.js'

const ListRoot = /* @__PURE__ */ React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<'ul'>
>(function ListRoot({ className, ...props }, ref) {
  return (
    <ul
      role='list'
      {...props}
      ref={ref}
      className={cx('pui-list', className)}
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
      className={cx('pui-list-item', className)}
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
export { ListRoot, ListItem }
export const {
  Content: ListContent,
  Title: ListTitle,
  Description: ListDescription,
  Actions: ListActions,
} = List
