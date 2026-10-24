import * as React from 'react'
import { cx } from './class-names.js'

export type SkeletonProps = Omit<
  React.ComponentPropsWithoutRef<'span'>,
  'children'
> & {
  shape?: 'text' | 'block' | 'circle'
}
/** Decorative placeholder; the owning region provides aria-busy and loading text. */
export const Skeleton = function Skeleton({
  shape = 'text',
  className,
  ref,
  ...props
}: SkeletonProps & { ref?: React.Ref<HTMLSpanElement> }) {
  return (
    <span
      {...props}
      ref={ref}
      className={cx('surf-skeleton', className)}
      data-shape={shape}
      aria-hidden='true'
    />
  )
}
