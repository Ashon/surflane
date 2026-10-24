import * as React from 'react'
import { cx } from './class-names.js'
/** Layout only: filtering, routing and async results remain controlled by the caller. */
const Root = function FilterBarRoot({
  label,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'form'> & { label: string } & {
  ref?: React.Ref<HTMLFormElement>
}) {
  return (
    <form
      {...props}
      ref={ref}
      role='search'
      aria-label={label}
      className={cx('surf-filter-bar', className)}
    />
  )
}
const Controls = function FilterBarControls({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('surf-filter-bar-controls', className)}
    />
  )
}
const Field = function FilterBarField({
  width = 'filter',
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'label'> & { width?: 'search' | 'filter' } & {
  ref?: React.Ref<HTMLLabelElement>
}) {
  return (
    <label
      {...props}
      ref={ref}
      data-width={width}
      className={cx('surf-filter-bar-field', className)}
    />
  )
}
const Actions = function FilterBarActions({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('surf-filter-bar-actions', className)}
    />
  )
}
const Summary = function FilterBarSummary({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <div
      role='status'
      aria-atomic='true'
      {...props}
      ref={ref}
      className={cx('surf-filter-bar-summary', className)}
    />
  )
}
export const FilterBar = { Root, Controls, Field, Actions, Summary }

// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Root: FilterBarRoot,
  Controls: FilterBarControls,
  Field: FilterBarField,
  Actions: FilterBarActions,
  Summary: FilterBarSummary,
} = FilterBar
