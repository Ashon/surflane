import * as React from 'react'
import { cx } from './class-names.js'
import { elementPart } from './element-part.js'

const ListRoot = function ListRoot({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'ul'> & {
  ref?: React.Ref<HTMLUListElement>
}) {
  return (
    <ul
      role='list'
      {...props}
      ref={ref}
      className={cx('surf-list', className)}
    />
  )
}
const ListItem = function ListItem({
  selected,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & { selected?: boolean } & {
  ref?: React.Ref<HTMLLIElement>
}) {
  return (
    <li
      {...props}
      ref={ref}
      data-selected={selected || undefined}
      className={cx('surf-list-item', className)}
    />
  )
}
export const List = {
  Root: ListRoot,
  Item: ListItem,
  Content: /* @__PURE__ */ elementPart<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'surf-list-content'),
  Title: /* @__PURE__ */ elementPart<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'surf-list-title'),
  Description: /* @__PURE__ */ elementPart<
    HTMLParagraphElement,
    React.ComponentPropsWithoutRef<'p'>
  >('p', 'surf-list-description'),
  Actions: /* @__PURE__ */ elementPart<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'surf-list-actions'),
}
// Flat names for React Server Components, which cannot dot into client exports.
export { ListRoot, ListItem }
export const {
  Content: ListContent,
  Title: ListTitle,
  Description: ListDescription,
  Actions: ListActions,
} = List
