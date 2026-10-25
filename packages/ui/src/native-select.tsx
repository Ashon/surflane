'use client'
import * as React from 'react'
import { type ComponentSize } from './sizing.js'
import { Select, type SelectGroup, type SelectOption } from './select.js'

function optionList(children: React.ReactNode): (SelectOption | SelectGroup)[] {
  return React.Children.toArray(children).flatMap((child) => {
    if (
      !React.isValidElement<{
        value?: string | number
        children?: React.ReactNode
        disabled?: boolean
        label?: string
      }>(child)
    )
      return []
    const p = child.props
    if (child.type === React.Fragment) return optionList(p.children)
    // An optgroup keeps its label as a visible group heading.
    if (child.type === 'optgroup' || child.type === NativeSelectOptGroup)
      return [
        {
          label: p.label,
          options: optionList(p.children).flatMap((item) =>
            'options' in item ? item.options : [item],
          ),
        },
      ]
    return [
      {
        value: String(p.value ?? p.children ?? ''),
        label: p.label ?? p.children,
        disabled: p.disabled,
      },
    ]
  })
}
/** Transitional HTML-option adapter. Submitted values use Base UI's native hidden input. */
export const NativeSelect = function NativeSelect({
  children,
  onChange,
  value,
  defaultValue,
  className,
  size,
  ref,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'select'>, 'size' | 'multiple'> & {
  size?: ComponentSize
} & { ref?: React.Ref<HTMLButtonElement> }) {
  const input = React.useRef<HTMLInputElement>(null)
  const options = optionList(children)
  return (
    <Select
      options={options}
      value={value === undefined ? undefined : String(value)}
      defaultValue={
        defaultValue === undefined ? undefined : String(defaultValue)
      }
      className={className}
      size={size}
      inputRef={input}
      triggerRef={ref}
      name={props.name}
      form={props.form}
      disabled={props.disabled}
      required={props.required}
      id={props.id}
      aria-label={props['aria-label']}
      aria-labelledby={props['aria-labelledby']}
      aria-describedby={props['aria-describedby']}
      aria-invalid={props['aria-invalid']}
      onValueChange={(next) => {
        if (!onChange) return
        const target = input.current
        if (!target) return
        const setter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          'value',
        )?.set
        setter?.call(target, next)
        const event = new Event('change', { bubbles: true })
        Object.defineProperties(event, {
          target: { value: target },
          currentTarget: { value: target },
        })
        onChange(event as unknown as React.ChangeEvent<HTMLSelectElement>)
      }}
    />
  )
}
export function NativeSelectOption(props: React.ComponentProps<'option'>) {
  return <option {...props} />
}
export function NativeSelectOptGroup(props: React.ComponentProps<'optgroup'>) {
  return <optgroup {...props} />
}
