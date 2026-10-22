'use client'
import * as React from 'react'
import { cx } from './parts.js'

export type ChoiceLabelProps = Omit<
  React.ComponentPropsWithoutRef<'label'>,
  'children'
> & {
  /** The Checkbox, Radio or Switch the label names. */
  control: React.ReactElement<{
    'aria-labelledby'?: string
    'aria-describedby'?: string
  }>
  /** The label text; it alone names the control. */
  children: React.ReactNode
  /** A longer explanation, read as the control's description. */
  description?: React.ReactNode
}
/** A checkbox, radio or switch with its label, and an optional description below it.
 * The whole label toggles the control; the control sits on the first line. */
export const ChoiceLabel = /* @__PURE__ */ React.forwardRef<
  HTMLLabelElement,
  ChoiceLabelProps
>(function ChoiceLabel(
  { control, children, description, className, ...props },
  ref,
) {
  const id = React.useId()
  return (
    <label {...props} ref={ref} className={cx('pui-choice-label', className)}>
      <span className='pui-choice-control'>
        {React.cloneElement(control, {
          'aria-labelledby': control.props['aria-labelledby'] ?? `${id}-label`,
          'aria-describedby':
            control.props['aria-describedby'] ??
            (description ? `${id}-description` : undefined),
        })}
      </span>
      <span className='pui-choice-text'>
        <span id={`${id}-label`}>{children}</span>
        {description && (
          <span className='pui-choice-description' id={`${id}-description`}>
            {description}
          </span>
        )}
      </span>
    </label>
  )
})
