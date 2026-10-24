'use client'
import * as React from 'react'
import { cx } from './parts.js'
import { type ComponentSizeAlias } from './sizing.js'

export type PanelSide = 'left' | 'right' | 'top' | 'bottom'
export type PanelOptions = {
  size?: ComponentSizeAlias
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
export function Footer({ className, ...props }: React.ComponentProps<'div'>) {
  return <div {...props} className={cx('surf-panel-footer', className)} />
}
