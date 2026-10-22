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
export const Badge = /* @__PURE__ */ React.forwardRef<
  HTMLSpanElement,
  BadgeProps
>(function Badge(
  { tone = 'neutral', icon, children, className, size, ...props },
  ref,
) {
  const scheme = useComponentSize(size)
  const elementRef = useToneTransition<HTMLSpanElement>(tone, ref)
  return (
    <span
      {...props}
      ref={elementRef}
      className={cx('pui-badge', className)}
      data-tone={tone}
      data-ui-size={scheme}
    >
      {icon && (
        <span className='pui-badge-icon' aria-hidden='true'>
          {icon}
        </span>
      )}
      {children}
    </span>
  )
})
/** Domain status labels and live announcements remain the caller's responsibility. */
export const StatusBadge = /* @__PURE__ */ React.forwardRef<
  HTMLSpanElement,
  BadgeProps
>(function StatusBadge({ tone = 'neutral', icon, ...props }, ref) {
  return (
    <Badge
      {...props}
      ref={ref}
      tone={tone}
      icon={icon === undefined ? <StatusIcon tone={tone} /> : icon}
    />
  )
})
export type { StatusTone } from './status.js'
