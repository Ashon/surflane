'use client'
import * as React from 'react'
import { useComponentSize, type ComponentSize } from './sizing.js'
import { Field as BaseField } from '@base-ui/react/field'
import { cx } from './parts.js'

/** A multi-line text field. Inside Field.Root it takes the label, description and
 * error from the field, as Input does. */
export const Textarea = function Textarea({
  className,
  size,
  variant = 'default',
  rows,
  cols,
  wrap,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'textarea'> & {
  size?: ComponentSize
  /** `embedded` fills the pane it sits in, such as an editor beside a preview: no
   * edge or corners of its own, and focus as a ring inside it. */
  variant?: 'default' | 'embedded'
} & { ref?: React.Ref<HTMLTextAreaElement> }) {
  const scheme = useComponentSize(size)
  return (
    <BaseField.Control
      {...(props as React.ComponentPropsWithoutRef<typeof BaseField.Control>)}
      ref={ref as unknown as React.Ref<HTMLInputElement>}
      data-ui-size={scheme}
      data-variant={variant === 'embedded' ? variant : undefined}
      render={<textarea rows={rows} cols={cols} wrap={wrap} />}
      className={cx('surf-input surf-textarea', className)}
    />
  )
}
