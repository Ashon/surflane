import * as React from 'react'
import { Icon } from './icon.js'
import { cx } from './class-names.js'
import { Link } from './link.js'

const BreadcrumbRoot = function BreadcrumbRoot({
  className,
  'aria-label': label = 'Breadcrumb',
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'nav'> & { ref?: React.Ref<HTMLElement> }) {
  return (
    <nav
      {...props}
      ref={ref}
      aria-label={label}
      className={cx('surf-breadcrumbs', className)}
    />
  )
}
const BreadcrumbList = function BreadcrumbList({
  className,
  role = 'list',
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'ol'> & {
  ref?: React.Ref<HTMLOListElement>
}) {
  return (
    <ol
      {...props}
      role={role}
      ref={ref}
      className={cx('surf-breadcrumb-list', className)}
    />
  )
}
const BreadcrumbItem = function BreadcrumbItem({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & { ref?: React.Ref<HTMLLIElement> }) {
  return (
    <li
      {...props}
      ref={ref}
      className={cx('surf-breadcrumb-item', className)}
    />
  )
}
function BreadcrumbSeparator({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      {...props}
      className={cx('surf-breadcrumb-separator', className)}
      aria-hidden='true'
    >
      <Icon name='chevron-forward' />
    </span>
  )
}
function BreadcrumbCurrent({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      {...props}
      className={cx('surf-breadcrumb-current', className)}
      aria-current='page'
    />
  )
}
export const Breadcrumbs = {
  Root: BreadcrumbRoot,
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link,
  Separator: BreadcrumbSeparator,
  Current: BreadcrumbCurrent,
}
// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Root: BreadcrumbsRoot,
  List: BreadcrumbsList,
  Item: BreadcrumbsItem,
  Link: BreadcrumbsLink,
  Separator: BreadcrumbsSeparator,
  Current: BreadcrumbsCurrent,
} = Breadcrumbs
