'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { NumberField as BaseNumberField } from '@base-ui/react/number-field'
import { part, skin } from './parts.js'
import { useRootRef, useResetValue } from './form-state.js'

const NumberRoot = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseNumberField.Root>
>(function NumberRoot(
  { value, defaultValue, onValueChange, className, form, ...props },
  ref,
) {
  const [element, attach] = useRootRef(ref)
  const [numeric, setNumeric] = useResetValue(
    value,
    defaultValue ?? null,
    element,
    form,
  )
  return (
    <BaseNumberField.Root
      {...props}
      form={form}
      ref={attach}
      value={numeric}
      className={skin('pui-number-field', className)}
      onValueChange={(next, event) => {
        onValueChange?.(next, event)
        if (value === undefined && !event.isCanceled) setNumeric(next)
      }}
    />
  )
})
const NumberIncrement = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseNumberField.Increment>
>(function NumberIncrement({ className, children, ...props }, ref) {
  return (
    <BaseNumberField.Increment
      aria-label='Increase value'
      {...props}
      ref={ref}
      className={skin('pui-number-step', className)}
    >
      {children ?? <Icon name='plus' />}
    </BaseNumberField.Increment>
  )
})
const NumberDecrement = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseNumberField.Decrement>
>(function NumberDecrement({ className, children, ...props }, ref) {
  return (
    <BaseNumberField.Decrement
      aria-label='Decrease value'
      {...props}
      ref={ref}
      className={skin('pui-number-step', className)}
    >
      {children ?? <Icon name='minus' />}
    </BaseNumberField.Decrement>
  )
})
export const NumberField = {
  ...BaseNumberField,
  Root: NumberRoot,
  Increment: NumberIncrement,
  Decrement: NumberDecrement,
  Group: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseNumberField.Group>
  >(BaseNumberField.Group, 'pui-number-group'),
  Input: /* @__PURE__ */ part<
    HTMLInputElement,
    React.ComponentPropsWithoutRef<typeof BaseNumberField.Input>
  >(BaseNumberField.Input, 'pui-number-input'),
  ScrubArea: /* @__PURE__ */ part<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<typeof BaseNumberField.ScrubArea>
  >(BaseNumberField.ScrubArea, 'pui-number-scrub'),
}
// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Decrement: NumberFieldDecrement,
  Group: NumberFieldGroup,
  Increment: NumberFieldIncrement,
  Input: NumberFieldInput,
  Root: NumberFieldRoot,
  ScrubArea: NumberFieldScrubArea,
  ScrubAreaCursor: NumberFieldScrubAreaCursor,
} = NumberField
