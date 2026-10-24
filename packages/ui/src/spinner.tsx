import * as React from 'react'
import { normalizeSize, type ComponentSizeAlias } from './size.js'
import { sizeName, cx } from './class-names.js'

export type SpinnerProps = Omit<
  React.ComponentPropsWithoutRef<'span'>,
  'children'
> & {
  label?: string
  decorative?: boolean
  size?: ComponentSizeAlias
}
/** Use decorative within a loading region that already owns the announcement. */
export const Spinner = function Spinner({
  label = 'Loading',
  decorative = false,
  size,
  className,
  ref,
  ...props
}: SpinnerProps & { ref?: React.Ref<HTMLSpanElement> }) {
  // An omitted size follows the surrounding size scope through CSS.
  const scheme = normalizeSize(size)
  return (
    <span
      {...props}
      ref={ref}
      className={cx('surf-spinner', className)}
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
      {!decorative && <span className='surf-feedback-sr'>{label}</span>}
    </span>
  )
}
