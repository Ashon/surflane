'use client'
import * as React from 'react'
import { useRender } from '@base-ui/react/use-render'
import { OTPField as BaseOTPField } from '@base-ui/react/otp-field'
import { part, skin } from './parts.js'
import { useResetValue, useRootRef } from './form-state.js'
const Root = function Root({
  value,
  defaultValue = '',
  form,
  onValueChange,
  className,
  ref: forwardedRef,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseOTPField.Root> & {
  ref?: React.Ref<HTMLDivElement>
}) {
  const [element, ref] = useRootRef(forwardedRef)
  const [local, setLocal, revision] = useResetValue(
    value,
    defaultValue,
    element,
    form,
  )
  return (
    <BaseOTPField.Root
      key={revision}
      {...props}
      ref={ref}
      form={form}
      value={local}
      className={skin('surf-otp-field', className)}
      onValueChange={(next, event) => {
        onValueChange?.(next, event)
        if (value === undefined && !event.isCanceled) setLocal(next)
      }}
    />
  )
}
const Separator = function Separator({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseOTPField.Separator> & {
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <BaseOTPField.Separator
      aria-hidden='true'
      {...props}
      ref={ref}
      className={skin('surf-otp-separator', className)}
    />
  )
}
// Preserve Base UI's DOM refs and user render composition while fixing native-validation ARIA.
function SlotElement({
  domProps,
  state,
  render,
}: {
  domProps: React.ComponentPropsWithRef<'input'>
  state: BaseOTPField.Input.State
  render?: BaseOTPField.Input.Props['render']
}) {
  const { ref, ...props } = domProps
  return useRender({
    defaultTagName: 'input',
    ref,
    render:
      typeof render === 'function'
        ? (nextProps) => render(nextProps, state)
        : render,
    props: {
      ...props,
      'aria-invalid':
        !state.disabled && state.valid === false ? true : props['aria-invalid'],
    },
  })
}
const Input = function Input({
  render,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseOTPField.Input> & {
  ref?: React.Ref<HTMLInputElement>
}) {
  return (
    <BaseOTPField.Input
      {...props}
      ref={ref}
      className={skin('surf-input surf-otp-input', className)}
      render={(domProps, state) => (
        <SlotElement domProps={domProps} state={state} render={render} />
      )}
    />
  )
}
export const OTPField = {
  ...BaseOTPField,
  Root,
  Input,
  Group: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'surf-otp-group'),
  Separator,
}

// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Input: OTPFieldInput,
  Root: OTPFieldRoot,
  Separator: OTPFieldSeparator,
  Group: OTPFieldGroup,
} = OTPField
