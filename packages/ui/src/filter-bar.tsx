'use client'
import * as React from 'react'
const cx = (base: string, extra?: string) =>
  [base, extra].filter(Boolean).join(' ')
/** Layout only: filtering, routing and async results remain controlled by the caller. */
const Root = /* @__PURE__ */ React.forwardRef<
  HTMLFormElement,
  React.ComponentPropsWithoutRef<'form'> & { label: string }
>(function FilterBarRoot({ label, className, ...props }, ref) {
  return (
    <form
      {...props}
      ref={ref}
      role='search'
      aria-label={label}
      className={cx('pui-filter-bar', className)}
    />
  )
})
const Controls = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(function FilterBarControls({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('pui-filter-bar-controls', className)}
    />
  )
})
const Field = /* @__PURE__ */ React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<'label'> & { width?: 'search' | 'filter' }
>(function FilterBarField({ width = 'filter', className, ...props }, ref) {
  return (
    <label
      {...props}
      ref={ref}
      data-width={width}
      className={cx('pui-filter-bar-field', className)}
    />
  )
})
const Actions = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(function FilterBarActions({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('pui-filter-bar-actions', className)}
    />
  )
})
const Summary = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(function FilterBarSummary({ className, ...props }, ref) {
  return (
    <div
      role='status'
      aria-atomic='true'
      {...props}
      ref={ref}
      className={cx('pui-filter-bar-summary', className)}
    />
  )
})
export const FilterBar = { Root, Controls, Field, Actions, Summary }

// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Root: FilterBarRoot,
  Controls: FilterBarControls,
  Field: FilterBarField,
  Actions: FilterBarActions,
  Summary: FilterBarSummary,
} = FilterBar
