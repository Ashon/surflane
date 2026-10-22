'use client'
import * as React from 'react'
import { cx } from './parts.js'

export type SkeletonProps = Omit<
  React.ComponentPropsWithoutRef<'span'>,
  'children'
> & {
  shape?: 'text' | 'block' | 'circle'
}
/** Decorative placeholder; the owning region provides aria-busy and loading text. */
export const Skeleton = /* @__PURE__ */ React.forwardRef<
  HTMLSpanElement,
  SkeletonProps
>(function Skeleton({ shape = 'text', className, ...props }, ref) {
  return (
    <span
      {...props}
      ref={ref}
      className={cx('pui-skeleton', className)}
      data-shape={shape}
      aria-hidden='true'
    />
  )
})
