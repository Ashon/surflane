import * as React from 'react'
import { cx } from './class-names.js'
import { elementPart } from './element-part.js'

const EmptyTitle = function EmptyTitle({
  level = 3,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'h3'> & { level?: 2 | 3 | 4 | 5 | 6 } & {
  ref?: React.Ref<HTMLHeadingElement>
}) {
  return React.createElement(`h${level}`, {
    ...props,
    ref,
    className: cx('surf-empty-title', className),
  })
}
export const EmptyState = {
  Root: /* @__PURE__ */ elementPart<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'surf-empty'),
  Icon: /* @__PURE__ */ elementPart<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'surf-empty-icon'),
  Title: EmptyTitle,
  Description: /* @__PURE__ */ elementPart<
    HTMLParagraphElement,
    React.ComponentPropsWithoutRef<'p'>
  >('p', 'surf-empty-description'),
  Actions: /* @__PURE__ */ elementPart<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'surf-empty-actions'),
}
// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Root: EmptyStateRoot,
  Icon: EmptyStateIcon,
  Title: EmptyStateTitle,
  Description: EmptyStateDescription,
  Actions: EmptyStateActions,
} = EmptyState
