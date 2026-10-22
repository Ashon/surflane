'use client'
import * as React from 'react'
import { useComponentSize } from './sizing.js'
import { Radio as BaseRadio } from '@base-ui/react/radio'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import { skin, part } from './parts.js'
import { useRootRef, useResetValue } from './form-state.js'
import { ChoiceResetPaint, type ChoiceSize } from './choice.js'

export function RadioGroup<Value = string>({
  value,
  defaultValue,
  onValueChange,
  className,
  form,
  ref,
  ...props
}: BaseRadioGroup.Props<Value>) {
  const [element, attach] = useRootRef<HTMLDivElement>(ref)
  const [selected, setSelected, revision] = useResetValue<Value | null>(
    value,
    defaultValue ?? null,
    element,
    form,
  )
  return (
    <ChoiceResetPaint.Provider value={revision}>
      <BaseRadioGroup<Value | null>
        {...props}
        form={form}
        ref={attach}
        value={selected}
        className={skin('pui-choice-group', className)}
        onValueChange={(next, event) => {
          onValueChange?.(next as Value, event)
          if (value === undefined && !event.isCanceled) setSelected(next)
        }}
      />
    </ChoiceResetPaint.Provider>
  )
}
const RadioRoot = /* @__PURE__ */ React.forwardRef<
  React.ComponentRef<typeof BaseRadio.Root>,
  React.ComponentPropsWithoutRef<typeof BaseRadio.Root> & ChoiceSize
>(function RadioRoot({ size, className, ...props }, ref) {
  React.useContext(ChoiceResetPaint)
  const scheme = useComponentSize(size)
  return (
    <BaseRadio.Root
      {...props}
      data-ui-size={size ? scheme : undefined}
      ref={ref}
      className={skin('pui-radio', className)}
    />
  )
})
export const Radio = {
  ...BaseRadio,
  Root: RadioRoot,
  Indicator: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseRadio.Indicator>,
    React.ComponentPropsWithoutRef<typeof BaseRadio.Indicator>
  >(BaseRadio.Indicator, 'pui-radio-indicator'),
}
// Flat names for React Server Components, which cannot dot into client exports.
export { RadioRoot }
export const { Indicator: RadioIndicator } = Radio
