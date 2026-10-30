'use client'
import * as React from 'react'
import { Separator as BaseSeparator } from '@base-ui/react/separator'
import { cx, skin } from './parts.js'

export type SeparatorProps = React.ComponentPropsWithoutRef<
  typeof BaseSeparator
> & {
  inset?: boolean
  /** dot sits between values on one line, such as a stat strip: a drawn point that
   * assistive technology and copied text read as a comma, so the values stay apart. */
  variant?: 'line' | 'dot'
}
export const Separator = function Separator({
  inset = false,
  variant = 'line',
  className,
  ref,
  ...props
}: SeparatorProps & {
  ref?: React.Ref<React.ComponentRef<typeof BaseSeparator>>
}) {
  // Not a separator role: a comma that only shows as a dot, between two values. The
  // comma stays in the text, clipped and transparent, so it is read and copied.
  if (variant === 'dot')
    return (
      <span
        id={props.id}
        style={typeof props.style === 'object' ? props.style : undefined}
        data-variant='dot'
        className={cx(
          'surf-separator',
          typeof className === 'string' ? className : undefined,
        )}
      >
        {', '}
      </span>
    )
  return (
    <BaseSeparator
      {...props}
      ref={ref}
      data-inset={inset || undefined}
      className={skin('surf-separator', className)}
    />
  )
}
