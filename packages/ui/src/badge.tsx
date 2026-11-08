'use client'
import * as React from 'react'
import { useComponentSize, type ComponentSize } from './sizing.js'
import { useToneTransition } from './tone-transition.js'
import { cx } from './parts.js'
import { StatusIcon, type StatusTone } from './status.js'

export type BadgeProps = React.ComponentPropsWithoutRef<'span'> & {
  size?: ComponentSize
  tone?: StatusTone
  icon?: React.ReactNode
}
export const Badge = function Badge({
  tone = 'neutral',
  icon,
  children,
  className,
  size,
  ref,
  ...props
}: BadgeProps & { ref?: React.Ref<HTMLSpanElement> }) {
  const scheme = useComponentSize(size)
  const elementRef = useToneTransition<HTMLSpanElement>(tone, ref)
  return (
    <span
      {...props}
      ref={elementRef}
      className={cx('surf-badge', className)}
      data-tone={tone}
      data-ui-size={scheme}
    >
      {icon && (
        <span className='surf-badge-icon' aria-hidden='true'>
          {icon}
        </span>
      )}
      {children}
    </span>
  )
}
/** Domain status labels and live announcements remain the caller's responsibility. */
export const StatusBadge = function StatusBadge({
  tone = 'neutral',
  icon,
  ref,
  ...props
}: BadgeProps & { ref?: React.Ref<HTMLSpanElement> }) {
  return (
    <Badge
      {...props}
      ref={ref}
      tone={tone}
      icon={icon === undefined ? <StatusIcon tone={tone} /> : icon}
    />
  )
}
export type StatusDotProps = Omit<
  React.ComponentPropsWithoutRef<'span'>,
  'children'
> & {
  /** The state the dot colors, as StatusBadge's tones do. */
  tone?: StatusTone
  /** The state's name, when no text nearby says it: the dot is then an image of
   * that name. Without it the dot is decorative, hidden from assistive technology. */
  label?: string
} & (
    | {
        /** Pulses while the state is under way, such as working; still when motion
         * is reduced. */
        live?: boolean
        attention?: never
      }
    | {
        /** Blinks three times as the state arrives, such as waiting for an answer,
         * then holds still; still when motion is reduced. */
        attention?: boolean
        live?: never
      }
  )
/** A status without words: a dot in the tone's color beside text that names the
 * state, such as a group's count, or with `label` where nothing does. */
export const StatusDot = function StatusDot({
  tone = 'neutral',
  label,
  live = false,
  attention = false,
  className,
  ref,
  ...props
}: StatusDotProps & { ref?: React.Ref<HTMLSpanElement> }) {
  return (
    <span
      {...props}
      ref={ref}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={cx('surf-status-dot', className)}
      data-tone={tone}
      data-live={live || undefined}
      data-attention={attention || undefined}
    />
  )
}
export type { StatusTone } from './status.js'
