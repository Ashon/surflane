'use client'
import * as React from 'react'
import { part, cx } from './parts.js'

const EmptyTitle = /* @__PURE__ */ React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<'h3'> & { level?: 2 | 3 | 4 | 5 | 6 }
>(function EmptyTitle({ level = 3, className, ...props }, ref) {
  return React.createElement(`h${level}`, {
    ...props,
    ref,
    className: cx('pui-empty-title', className),
  })
})
export const EmptyState = {
  Root: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'pui-empty'),
  Icon: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'pui-empty-icon'),
  Title: EmptyTitle,
  Description: /* @__PURE__ */ part<
    HTMLParagraphElement,
    React.ComponentPropsWithoutRef<'p'>
  >('p', 'pui-empty-description'),
  Actions: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'pui-empty-actions'),
}
// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Root: EmptyStateRoot,
  Icon: EmptyStateIcon,
  Title: EmptyStateTitle,
  Description: EmptyStateDescription,
  Actions: EmptyStateActions,
} = EmptyState
