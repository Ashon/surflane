'use client'
import * as React from 'react'
import { cx } from './parts.js'
import { type ComponentSize } from './sizing.js'

export type PanelSide = 'left' | 'right' | 'top' | 'bottom'
export type PanelOptions = {
  size?: ComponentSize
  closeLabel?: string
  /** Attaches the panel to its edge: no gap, and square corners on that edge, as a
   * mobile bottom sheet sits. */
  flush?: boolean
}
export function Header({ className, ...props }: React.ComponentProps<'div'>) {
  return <div {...props} className={cx('surf-panel-header', className)} />
}
export const Body = function Body({
  className,
  ref,
  ...props
}: React.ComponentProps<'div'> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div {...props} ref={ref} className={cx('surf-panel-body', className)} />
  )
}
export function Footer({
  stacked = false,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  /** Stacks the actions, each the full width, as a phone's bottom sheet does. */
  stacked?: boolean
}) {
  return (
    <div
      {...props}
      data-stacked={stacked || undefined}
      className={cx('surf-panel-footer', className)}
    />
  )
}
