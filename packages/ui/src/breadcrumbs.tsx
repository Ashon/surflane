'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { cx } from './parts.js'
import { Link } from './link.js'

const BreadcrumbRoot = /* @__PURE__ */ React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'nav'>
>(function BreadcrumbRoot(
  { className, 'aria-label': label = 'Breadcrumb', ...props },
  ref,
) {
  return (
    <nav
      {...props}
      ref={ref}
      aria-label={label}
      className={cx('pui-breadcrumbs', className)}
    />
  )
})
const BreadcrumbList = /* @__PURE__ */ React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<'ol'>
>(function BreadcrumbList({ className, role = 'list', ...props }, ref) {
  return (
    <ol
      {...props}
      role={role}
      ref={ref}
      className={cx('pui-breadcrumb-list', className)}
    />
  )
})
const BreadcrumbItem = /* @__PURE__ */ React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(function BreadcrumbItem({ className, ...props }, ref) {
  return (
    <li {...props} ref={ref} className={cx('pui-breadcrumb-item', className)} />
  )
})
function BreadcrumbSeparator({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      {...props}
      className={cx('pui-breadcrumb-separator', className)}
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
      className={cx('pui-breadcrumb-current', className)}
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
