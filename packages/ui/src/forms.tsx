'use client'
import * as React from 'react'
import { useComponentSize, type ComponentSize } from './sizing.js'
import { Field as BaseField } from '@base-ui/react/field'
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset'
import { Form as BaseForm } from '@base-ui/react/form'
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group'
import { Radio as BaseRadio } from '@base-ui/react/radio'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import { Switch as BaseSwitch } from '@base-ui/react/switch'

const ChoiceResetPaint = React.createContext(0)

import { skin, part } from './parts.js'
const FieldRoot = part<
  React.ComponentRef<typeof BaseField.Root>,
  React.ComponentPropsWithoutRef<typeof BaseField.Root>
>(BaseField.Root, 'pui-field')
const FieldLabel = part<
  React.ComponentRef<typeof BaseField.Label>,
  React.ComponentPropsWithoutRef<typeof BaseField.Label>
>(BaseField.Label, 'pui-field-label')
const FieldControl = part<
  React.ComponentRef<typeof BaseField.Control>,
  React.ComponentPropsWithoutRef<typeof BaseField.Control>
>(BaseField.Control, 'pui-input')
const FieldDescription = part<
  React.ComponentRef<typeof BaseField.Description>,
  React.ComponentPropsWithoutRef<typeof BaseField.Description>
>(BaseField.Description, 'pui-field-description')
const FieldError = part<
  React.ComponentRef<typeof BaseField.Error>,
  React.ComponentPropsWithoutRef<typeof BaseField.Error>
>(BaseField.Error, 'pui-field-error')
const FieldItem = part<
  React.ComponentRef<typeof BaseField.Item>,
  React.ComponentPropsWithoutRef<typeof BaseField.Item>
>(BaseField.Item, 'pui-field-item')
export const Field = {
  ...BaseField,
  Root: FieldRoot,
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
  Item: FieldItem,
}
export const Fieldset = {
  ...BaseFieldset,
  Root: part<
    React.ComponentRef<typeof BaseFieldset.Root>,
    React.ComponentPropsWithoutRef<typeof BaseFieldset.Root>
  >(BaseFieldset.Root, 'pui-fieldset'),
  Legend: part<
    React.ComponentRef<typeof BaseFieldset.Legend>,
    React.ComponentPropsWithoutRef<typeof BaseFieldset.Legend>
  >(BaseFieldset.Legend, 'pui-fieldset-legend'),
}
export function Form<
  Values extends Record<string, unknown> = Record<string, unknown>,
>({ className, ...props }: BaseForm.Props<Values>) {
  return <BaseForm<Values> {...props} className={skin('pui-form', className)} />
}
export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<'textarea'> & { size?: ComponentSize }
>(function Textarea({ className, size, ...props }, ref) {
  const scheme = useComponentSize(size)
  return (
    <textarea
      data-ui-size={scheme}
      {...props}
      ref={ref}
      className={['pui-input pui-textarea', className]
        .filter(Boolean)
        .join(' ')}
    />
  )
})
import { useRootRef, useResetValue } from './form-state.js'
const CheckboxRoot = React.forwardRef<
  React.ComponentRef<typeof BaseCheckbox.Root>,
  React.ComponentPropsWithoutRef<typeof BaseCheckbox.Root>
>(function CheckboxRoot(
  {
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
const CheckboxIndicator = React.forwardRef<
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
export const CheckboxGroup = React.forwardRef<
  React.ComponentRef<typeof BaseCheckboxGroup>,
  React.ComponentPropsWithoutRef<typeof BaseCheckboxGroup>
>(function CheckboxGroup(
  { value, defaultValue = [], onValueChange, className, ...props },
  ref,
) {
  const [element, attach] = useRootRef<HTMLDivElement>(ref)
  const [selected, setSelected, revision] = useResetValue(
    value,
    defaultValue,
    element,
  )
  return (
    <ChoiceResetPaint.Provider value={revision}>
      <BaseCheckboxGroup
        {...props}
        ref={attach}
        value={selected}
        className={skin('pui-choice-group', className)}
        onValueChange={(next, event) => {
          onValueChange?.(next, event)
          if (value === undefined && !event.isCanceled) setSelected(next)
        }}
      />
    </ChoiceResetPaint.Provider>
  )
})
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
const RadioRoot = React.forwardRef<
  React.ComponentRef<typeof BaseRadio.Root>,
  React.ComponentPropsWithoutRef<typeof BaseRadio.Root>
>(function RadioRoot({ className, ...props }, ref) {
  React.useContext(ChoiceResetPaint)
  return (
    <BaseRadio.Root
      {...props}
      ref={ref}
      className={skin('pui-radio', className)}
    />
  )
})
export const Radio = {
  ...BaseRadio,
  Root: RadioRoot,
  Indicator: part<
    React.ComponentRef<typeof BaseRadio.Indicator>,
    React.ComponentPropsWithoutRef<typeof BaseRadio.Indicator>
  >(BaseRadio.Indicator, 'pui-radio-indicator'),
}
const SwitchRoot = React.forwardRef<
  React.ComponentRef<typeof BaseSwitch.Root>,
  React.ComponentPropsWithoutRef<typeof BaseSwitch.Root>
>(function SwitchRoot(
  {
    checked,
    defaultChecked = false,
    onCheckedChange,
    className,
    form,
    ...props
  },
  ref,
) {
  const [element, attach] = useRootRef<HTMLElement>(ref)
  const [selected, setSelected] = useResetValue(
    checked,
    defaultChecked,
    element,
    form,
  )
  return (
    <BaseSwitch.Root
      {...props}
      form={form}
      ref={attach}
      checked={selected}
      className={skin('pui-switch', className)}
      onCheckedChange={(next, event) => {
        onCheckedChange?.(next, event)
        if (checked === undefined && !event.isCanceled) setSelected(next)
      }}
    />
  )
})
export const Switch = {
  ...BaseSwitch,
  Root: SwitchRoot,
  Thumb: part<
    React.ComponentRef<typeof BaseSwitch.Thumb>,
    React.ComponentPropsWithoutRef<typeof BaseSwitch.Thumb>
  >(BaseSwitch.Thumb, 'pui-switch-thumb'),
}

// Flat names for React Server Components, which cannot dot into client exports.
export {
  CheckboxIndicator,
  CheckboxRoot,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldItem,
  FieldLabel,
  FieldRoot,
  RadioRoot,
  SwitchRoot,
}
export const { Validity: FieldValidity } = Field
export const { Legend: FieldsetLegend, Root: FieldsetRoot } = Fieldset
export const { Indicator: RadioIndicator } = Radio
export const { Thumb: SwitchThumb } = Switch
