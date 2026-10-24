'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { NumberField as BaseNumberField } from '@base-ui/react/number-field'
import { part, skin } from './parts.js'
import { useRootRef, useResetValue } from './form-state.js'

const NumberRoot = function NumberRoot({
  value,
  defaultValue,
  onValueChange,
  className,
  form,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseNumberField.Root> & {
  ref?: React.Ref<HTMLDivElement>
}) {
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
      className={skin('surf-number-field', className)}
      onValueChange={(next, event) => {
        onValueChange?.(next, event)
        if (value === undefined && !event.isCanceled) setNumeric(next)
      }}
    />
  )
}
const NumberIncrement = function NumberIncrement({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseNumberField.Increment> & {
  ref?: React.Ref<HTMLButtonElement>
}) {
  return (
    <BaseNumberField.Increment
      aria-label='Increase value'
      {...props}
      ref={ref}
      className={skin('surf-number-step', className)}
    >
      {children ?? <Icon name='plus' />}
    </BaseNumberField.Increment>
  )
}
const NumberDecrement = function NumberDecrement({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseNumberField.Decrement> & {
  ref?: React.Ref<HTMLButtonElement>
}) {
  return (
    <BaseNumberField.Decrement
      aria-label='Decrease value'
      {...props}
      ref={ref}
      className={skin('surf-number-step', className)}
    >
      {children ?? <Icon name='minus' />}
    </BaseNumberField.Decrement>
  )
}
export const NumberField = {
  ...BaseNumberField,
  Root: NumberRoot,
  Increment: NumberIncrement,
  Decrement: NumberDecrement,
  Group: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseNumberField.Group>
  >(BaseNumberField.Group, 'surf-number-group'),
  Input: /* @__PURE__ */ part<
    HTMLInputElement,
    React.ComponentPropsWithoutRef<typeof BaseNumberField.Input>
  >(BaseNumberField.Input, 'surf-number-input'),
  ScrubArea: /* @__PURE__ */ part<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<typeof BaseNumberField.ScrubArea>
  >(BaseNumberField.ScrubArea, 'surf-number-scrub'),
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
