'use client'
import * as React from 'react'
import { cx } from './parts.js'
import { useComponentSize, type ComponentSize } from './sizing.js'
import { Input as BaseInput } from '@base-ui/react/input'
export const Input = function Input({
  className,
  leadingIcon,
  wrapperClassName,
  size,
  ref,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> & {
  size?: number | ComponentSize
  leadingIcon?: React.ReactNode
  wrapperClassName?: string
} & { ref?: React.Ref<HTMLInputElement> }) {
  const scheme = useComponentSize(typeof size === 'string' ? size : undefined)
  return (
    <span
      data-ui-size={scheme}
      className={cx('surf-control', wrapperClassName)}
      data-leading-icon={leadingIcon ? '' : undefined}
      data-disabled={props.disabled || undefined}
    >
      {leadingIcon && (
        <span className='surf-control-icon' aria-hidden='true'>
          {leadingIcon}
        </span>
      )}
      <BaseInput
        {...props}
        size={typeof size === 'number' ? size : undefined}
        ref={ref}
        className={cx('surf-input', className)}
      />
    </span>
  )
}
