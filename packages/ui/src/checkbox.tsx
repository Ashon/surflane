'use client'
import * as React from 'react'
import { useComponentSize } from './sizing.js'
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { skin } from './parts.js'
import { useRootRef, useResetValue } from './form-state.js'
import { ChoiceResetPaint, type ChoiceSize } from './choice.js'

const CheckboxRoot = /* @__PURE__ */ React.forwardRef<
  React.ComponentRef<typeof BaseCheckbox.Root>,
  React.ComponentPropsWithoutRef<typeof BaseCheckbox.Root> & ChoiceSize
>(function CheckboxRoot(
  {
    size,
    checked,
    defaultChecked = false,
    onCheckedChange,
    className,
    form,
    ...props
  },
  ref,
) {
  React.useContext(ChoiceResetPaint)
  const scheme = useComponentSize(size)
  const [element, attach] = useRootRef<HTMLElement>(ref)
  const [selected, setSelected] = useResetValue(
    checked,
    defaultChecked,
    element,
    form,
  )
  return (
    <BaseCheckbox.Root
      {...props}
      data-ui-size={size ? scheme : undefined}
      form={form}
      ref={attach}
      checked={selected}
      className={skin('pui-checkbox', className)}
      onCheckedChange={(next, event) => {
        onCheckedChange?.(next, event)
        if (checked === undefined && !event.isCanceled) setSelected(next)
      }}
    />
  )
})
const CheckboxIndicator = /* @__PURE__ */ React.forwardRef<
  React.ComponentRef<typeof BaseCheckbox.Indicator>,
  React.ComponentPropsWithoutRef<typeof BaseCheckbox.Indicator>
>(function CheckboxIndicator({ className, children, ...props }, ref) {
  return (
    <BaseCheckbox.Indicator
      {...props}
      ref={ref}
      className={skin('pui-checkbox-indicator', className)}
    >
      {children ?? (
        <svg
          width='14'
          height='14'
          viewBox='0 0 20 20'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          aria-hidden='true'
        >
          <path className='pui-checkbox-check' d='m4 10 4 4 8-8' />
          <path className='pui-checkbox-mixed' d='M4 10h12' />
        </svg>
      )}
    </BaseCheckbox.Indicator>
  )
})
export const Checkbox = {
  ...BaseCheckbox,
  Root: CheckboxRoot,
  Indicator: CheckboxIndicator,
}
// Flat names for React Server Components, which cannot dot into client exports.
export { CheckboxIndicator, CheckboxRoot }
