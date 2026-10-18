'use client'
import * as React from 'react'
import { useComponentSize, type ComponentSize } from './sizing.js'
import { useToneTransition } from './tone-transition.js'
export type StatusTone =
  'neutral' | 'success' | 'danger' | 'caution' | 'progress'
export type BadgeProps = React.ComponentPropsWithoutRef<'span'> & {
  size?: ComponentSize
  tone?: StatusTone
  icon?: React.ReactNode
}
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(
    { tone = 'neutral', icon, children, className, size, ...props },
    ref,
  ) {
    const scheme = useComponentSize(size)
    const elementRef = useToneTransition<HTMLSpanElement>(tone, ref)
    return (
      <span
        {...props}
        ref={elementRef}
        className={['pui-badge', className].filter(Boolean).join(' ')}
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
  },
)
export function StatusIcon({ tone }: { tone: StatusTone }) {
  return (
    <svg
      width='13'
      height='13'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      aria-hidden='true'
    >
      {tone === 'success' ? (
        <path d='m5 12 4 4L19 6' />
      ) : tone === 'caution' ? (
        <>
          <path d='m12 3 10 18H2L12 3Z' />
          <path d='M12 9v4m0 3v1' />
        </>
      ) : tone === 'danger' ? (
        <>
          <circle cx='12' cy='12' r='9' />
          <path d='M12 7v6m0 3v1' />
        </>
      ) : tone === 'progress' ? (
        <>
          <circle cx='12' cy='12' r='9' />
          <path d='M12 7v6l4 2' />
        </>
      ) : (
        <>
          <circle cx='12' cy='12' r='9' />
          <path d='M8 12h8' />
        </>
      )}
    </svg>
  )
}
/** Domain status labels and live announcements remain the caller's responsibility. */
export const StatusBadge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function StatusBadge({ tone = 'neutral', icon, ...props }, ref) {
    return (
      <Badge
        {...props}
        ref={ref}
        tone={tone}
        icon={icon === undefined ? <StatusIcon tone={tone} /> : icon}
      />
    )
  },
)
