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
export type PanelBodyProps = React.ComponentProps<'div'> & {
  /** Names the body as a region and lets the keyboard focus it, so a long body
   * scrolls with the arrow keys, as ScrollArea's label does. */
  label?: string
}
export const Body = function Body({
  label,
  tabIndex = label ? 0 : undefined,
  role = label ? 'region' : undefined,
  className,
  ref,
  ...props
}: PanelBodyProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      {...props}
      ref={ref}
      role={role}
      aria-label={label}
      tabIndex={tabIndex}
      className={cx('surf-panel-body', className)}
    />
  )
}
export type PanelFooterProps = React.ComponentProps<'div'> & {
  /** Stacks the actions, each the full width, as a phone's bottom sheet does. */
  stacked?: boolean
  /** An action apart from the rest, such as Delete: at the inline start while the
   * others keep the end, or last when the footer is stacked. */
  start?: React.ReactNode
}
export function Footer({
  stacked = false,
  start,
  className,
  children,
  ...props
}: PanelFooterProps) {
  const apart = start != null && start !== false && start !== '' && (
    <div className='surf-panel-footer-start'>{start}</div>
  )
  return (
    <div
      {...props}
      data-stacked={stacked || undefined}
      className={cx('surf-panel-footer', className)}
    >
      {!stacked && apart}
      {children}
      {stacked && apart}
    </div>
  )
}
