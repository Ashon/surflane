'use client'
import * as React from 'react'
import { useComponentSize, type ComponentSizeAlias } from './sizing.js'
import { Select as BaseSelect } from '@base-ui/react/select'
import { sizeName } from './parts.js'
const cx = (...v: (string | undefined | false)[]) => v.filter(Boolean).join(' ')
function Chevron() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      aria-hidden='true'
    >
      <path d='m7 10 5 5 5-5' />
    </svg>
  )
}
function Check() {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      aria-hidden='true'
    >
      <path d='m5 12 4 4L19 6' />
    </svg>
  )
}
export type SelectOption = {
  value: string
  label: React.ReactNode
  disabled?: boolean
}
/** Options under a visible heading, like an HTML optgroup. */
export type SelectGroup = {
  label: React.ReactNode
  options: SelectOption[]
}
const isGroup = (item: SelectOption | SelectGroup): item is SelectGroup =>
  'options' in item
const flatten = (items: (SelectOption | SelectGroup)[]) =>
  items.flatMap((item) => (isGroup(item) ? item.options : [item]))
export type SelectProps = {
  options: (SelectOption | SelectGroup)[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  form?: string
  required?: boolean
  disabled?: boolean
  id?: string
  className?: string
  inputRef?: React.Ref<HTMLInputElement>
  triggerRef?: React.Ref<HTMLButtonElement>
  size?: ComponentSizeAlias
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-invalid'?: React.AriaAttributes['aria-invalid']
}
/** A single-choice list. The ref reaches the trigger button, as triggerRef does. */
export const Select = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  SelectProps
>(function Select(
  {
    options: items,
    value,
    defaultValue,
    onValueChange,
    className,
    inputRef,
    triggerRef,
    size,
    ...props
  },
  ref,
) {
  const scheme = useComponentSize(size)
  const options = flatten(items)
  // One stable callback, so the trigger ref is not detached on every render.
  const setTrigger = React.useCallback(
    (node: HTMLButtonElement | null) => {
      for (const target of [ref, triggerRef])
        if (typeof target === 'function') target(node)
        else if (target) target.current = node
    },
    [ref, triggerRef],
  )
  const [localValue, setLocalValue] = React.useState(
    defaultValue ?? options[0]?.value ?? '',
  )
  const nativeInput = React.useRef<HTMLInputElement>(null)
  const initialValue = defaultValue ?? options[0]?.value ?? ''
  const resetCallback = React.useRef(onValueChange)
  resetCallback.current = onValueChange
  React.useEffect(() => {
    const owner = nativeInput.current?.form
    if (!owner) return
    const pending = new Set<ReturnType<typeof setTimeout>>()
    const reset = (event: Event) => {
      const timer = setTimeout(() => {
        pending.delete(timer)
        if (event.defaultPrevented) return
        setLocalValue(initialValue)
        resetCallback.current?.(initialValue)
      }, 0)
      pending.add(timer)
    }
    owner.addEventListener('reset', reset)
    return () => {
      owner.removeEventListener('reset', reset)
      pending.forEach(clearTimeout)
    }
  }, [initialValue, props.form])
  const selected = value ?? localValue
  const { name, form, required, disabled, id, ...aria } = props
  return (
    <span
      className={cx('pui-select control-shell select-control', className)}
      data-size={sizeName(size)}
      data-ui-size={scheme}
      data-disabled={disabled || undefined}
    >
      <BaseSelect.Root<string>
        items={options}
        value={selected}
        onValueChange={(v) => {
          setLocalValue(v ?? '')
          onValueChange?.(v ?? '')
        }}
        inputRef={(node) => {
          nativeInput.current = node
          if (typeof inputRef === 'function') inputRef(node)
          else if (inputRef) inputRef.current = node
        }}
        name={name}
        form={form}
        required={required}
        disabled={disabled}
        id={id}
      >
        <BaseSelect.Trigger
          {...aria}
          ref={setTrigger}
          className='pui-select-trigger form-control'
          data-value={selected}
        >
          <BaseSelect.Value />
          <BaseSelect.Icon className='pui-select-icon select-chevron'>
            <Chevron />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner
            className='pui-positioner'
            sideOffset={6}
            alignItemWithTrigger={false}
          >
            <BaseSelect.Popup
              className='pui-select-popup'
              data-ui-size={scheme}
            >
              <BaseSelect.List>
                {items.map((item, index) =>
                  isGroup(item) ? (
                    <BaseSelect.Group className='pui-select-group' key={index}>
                      <BaseSelect.GroupLabel className='pui-select-group-label'>
                        {item.label}
                      </BaseSelect.GroupLabel>
                      {item.options.map(renderOption)}
                    </BaseSelect.Group>
                  ) : (
                    renderOption(item)
                  ),
                )}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </span>
  )
})
function renderOption(option: SelectOption) {
  return (
    <BaseSelect.Item
      className='pui-select-item'
      value={option.value}
      data-option-value={option.value}
      disabled={option.disabled}
      key={option.value}
    >
      <BaseSelect.ItemIndicator className='pui-select-check'>
        <Check />
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
    </BaseSelect.Item>
  )
}
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
      return [{ label: p.label, options: flatten(optionList(p.children)) }]
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
export const NativeSelect = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentPropsWithoutRef<'select'>, 'size' | 'multiple'> & {
    size?: ComponentSizeAlias
  }
>(function NativeSelect(
  { children, onChange, value, defaultValue, className, size, ...props },
  ref,
) {
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
})
export function NativeSelectOption(props: React.ComponentProps<'option'>) {
  return <option {...props} />
}
export function NativeSelectOptGroup(props: React.ComponentProps<'optgroup'>) {
  return <optgroup {...props} />
}
