import * as React from 'react'
import { cx } from './class-names.js'

export type SkeletonProps = Omit<
  React.ComponentPropsWithoutRef<'span'>,
  'children'
> & {
  shape?: 'text' | 'block' | 'circle'
  /** How wide a text line or a block runs, such as '55%' or '12ch'. Full width by
   * default. */
  width?: string
  /** Text lines in one placeholder, as a paragraph would set them. The last runs to
   * 60%, as a paragraph's last line ends short. */
  lines?: number
}
/** Decorative placeholder; the owning region provides aria-busy and loading text. */
export const Skeleton = function Skeleton({
  shape = 'text',
  width,
  lines,
  className,
  style,
  ref,
  ...props
}: SkeletonProps & { ref?: React.Ref<HTMLSpanElement> }) {
  const sized =
    width === undefined
      ? style
      : ({ '--surf-skeleton-width': width, ...style } as React.CSSProperties)
  if (shape === 'text' && lines !== undefined && lines > 1)
    return (
      <span
        {...props}
        ref={ref}
        className={cx('surf-skeleton-lines', className)}
        style={sized}
        aria-hidden='true'
      >
        {Array.from({ length: lines }, (_, index) => (
          <span key={index} className='surf-skeleton' data-shape='text' />
        ))}
      </span>
    )
  return (
    <span
      {...props}
      ref={ref}
      className={cx('surf-skeleton', className)}
      style={sized}
      data-shape={shape}
      aria-hidden='true'
    />
  )
}
