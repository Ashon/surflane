'use client'
import * as React from 'react'
import { useComponentSize, type ComponentSizeAlias } from './sizing.js'
import { Field as BaseField } from '@base-ui/react/field'
import { cx } from './parts.js'

/** A multi-line text field. Inside Field.Root it takes the label, description and
 * error from the field, as Input does. */
export const Textarea = /* @__PURE__ */ React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<'textarea'> & { size?: ComponentSizeAlias }
>(function Textarea({ className, size, rows, cols, wrap, ...props }, ref) {
  const scheme = useComponentSize(size)
  return (
    <BaseField.Control
      {...(props as React.ComponentPropsWithoutRef<typeof BaseField.Control>)}
      ref={ref as unknown as React.Ref<HTMLInputElement>}
      data-ui-size={scheme}
      render={<textarea rows={rows} cols={cols} wrap={wrap} />}
      className={cx('pui-input pui-textarea', className)}
    />
  )
})
