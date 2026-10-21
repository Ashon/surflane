'use client'
import * as React from 'react'
import { Separator as BaseSeparator } from '@base-ui/react/separator'
import { Chevron } from './chevron.js'
import { skin } from './parts.js'
export const Separator = /* @__PURE__ */ React.forwardRef<
  React.ComponentRef<typeof BaseSeparator>,
  React.ComponentPropsWithoutRef<typeof BaseSeparator> & { inset?: boolean }
>(function Separator({ inset = false, className, ...props }, ref) {
  return (
    <BaseSeparator
      {...props}
      ref={ref}
      data-inset={inset || undefined}
      className={skin('pui-separator', className)}
    />
  )
})
export const Link = /* @__PURE__ */ React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'>
>(function Link({ className, ...props }, ref) {
  return (
    <a
      {...props}
      ref={ref}
      className={['pui-link', className].filter(Boolean).join(' ')}
    />
  )
})
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
      className={['pui-breadcrumbs', className].filter(Boolean).join(' ')}
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
      className={['pui-breadcrumb-list', className].filter(Boolean).join(' ')}
    />
  )
})
const BreadcrumbItem = /* @__PURE__ */ React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(function BreadcrumbItem({ className, ...props }, ref) {
  return (
    <li
      {...props}
      ref={ref}
      className={['pui-breadcrumb-item', className].filter(Boolean).join(' ')}
    />
  )
})
function BreadcrumbSeparator({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      {...props}
      className={['pui-breadcrumb-separator', className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden='true'
    >
      <Chevron />
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
      className={['pui-breadcrumb-current', className]
        .filter(Boolean)
        .join(' ')}
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
