'use client'
import * as React from 'react'
import { useComponentSize, type ComponentSizeAlias } from './sizing.js'
import { sizeName, cx } from './parts.js'

export type SpinnerProps = Omit<
  React.ComponentPropsWithoutRef<'span'>,
  'children'
> & {
  label?: string
  decorative?: boolean
  size?: ComponentSizeAlias
}
/** Use decorative within a loading region that already owns the announcement. */
export const Spinner = /* @__PURE__ */ React.forwardRef<
  HTMLSpanElement,
  SpinnerProps
>(function Spinner(
  { label = 'Loading', decorative = false, size, className, ...props },
  ref,
) {
  const scheme = useComponentSize(size)
  return (
    <span
      {...props}
      ref={ref}
      className={cx('pui-spinner', className)}
      data-size={sizeName(size)}
      data-ui-size={scheme}
      role={decorative ? undefined : 'status'}
      aria-hidden={decorative || undefined}
    >
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        aria-hidden='true'
      >
        <circle cx='12' cy='12' r='9' opacity='.2' />
        <path d='M12 3a9 9 0 0 1 9 9' strokeLinecap='round' />
      </svg>
      {!decorative && <span className='pui-feedback-sr'>{label}</span>}
    </span>
  )
})
