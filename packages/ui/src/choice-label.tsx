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
export const ChoiceLabel = function ChoiceLabel({
  control,
  children,
  description,
  className,
  ref,
  ...props
}: ChoiceLabelProps & { ref?: React.Ref<HTMLLabelElement> }) {
  const id = React.useId()
  return (
    <label {...props} ref={ref} className={cx('surf-choice-label', className)}>
      <span className='surf-choice-control'>
        {React.cloneElement(control, {
          'aria-labelledby': control.props['aria-labelledby'] ?? `${id}-label`,
          'aria-describedby':
            control.props['aria-describedby'] ??
            (description ? `${id}-description` : undefined),
        })}
      </span>
      <span className='surf-choice-text'>
        <span id={`${id}-label`}>{children}</span>
        {description && (
          <span className='surf-choice-description' id={`${id}-description`}>
            {description}
          </span>
        )}
      </span>
    </label>
  )
}
