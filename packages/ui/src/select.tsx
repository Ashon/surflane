'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { useComponentSize, type ComponentSize } from './sizing.js'
import { Select as BaseSelect } from '@base-ui/react/select'
import { cx } from './parts.js'

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
type SelectCommonProps = {
  options: (SelectOption | SelectGroup)[]
  name?: string
  form?: string
  required?: boolean
  disabled?: boolean
  id?: string
  className?: string
  inputRef?: React.Ref<HTMLInputElement>
  triggerRef?: React.Ref<HTMLButtonElement>
  size?: ComponentSize
  /** fill takes its container's width, as a form field does. content fits the
   * longest option, as a native select does, so it sits beside other controls in
   * a header or toolbar and keeps its width when the value changes. */
  width?: 'fill' | 'content'
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-invalid'?: React.AriaAttributes['aria-invalid']
}
export type SelectProps = SelectCommonProps & {
  multiple?: false
  value?: string
  defaultValue?: string
  /** Runs with the new value and Base UI's event details; call
   * eventDetails.cancel() to keep the current value, as other fields allow. */
  onValueChange?: (
    value: string,
    eventDetails: BaseSelect.Root.ChangeEventDetails,
  ) => void
}
/** What a form reset reports: it has already happened, so it can't be canceled. */
function resetDetails(event: Event) {
  return {
    reason: 'none',
    event,
    trigger: undefined,
    cancel() {},
    allowPropagation() {},
    isCanceled: false,
    isPropagationAllowed: false,
  } as unknown as BaseSelect.Root.ChangeEventDetails
}
/** What a multiple Select's trigger says, and its first option. */
export type SelectMultipleLabels = {
  /** Every option chosen, such as "All projects"; also the option that chooses them. */
  all: string
  /** Nothing chosen, such as "No projects". */
  none: string
  /** Several chosen, such as "3 projects". */
  count: (count: number) => string
}
/** Several choices from a list, summed up on one line: a filter of projects, models
 * or nodes. Its first option, labels.all, chooses every option or none. */
export type SelectMultipleProps = SelectCommonProps & {
  multiple: true
  value?: readonly string[]
  defaultValue?: readonly string[]
  onValueChange?: (
    value: string[],
    eventDetails: BaseSelect.Root.ChangeEventDetails,
  ) => void
  labels?: Partial<SelectMultipleLabels>
}
const multipleLabels: SelectMultipleLabels = {
  all: 'All',
  none: 'None',
  count: (count) => `${count} selected`,
}
// The value the "all" option carries; it never reaches a form or a callback.
const ALL = '\u0000all'

/** A choice from a list, or several with multiple. The ref reaches the trigger
 * button, as triggerRef does. */
export const Select = function Select(
  allProps: (SelectProps | SelectMultipleProps) & {
    ref?: React.Ref<HTMLButtonElement>
  },
) {
  const {
    options: items,
    className,
    inputRef,
    triggerRef,
    size,
    width = 'fill',
    ref,
    multiple,
    value: _value,
    defaultValue: _defaultValue,
    onValueChange: _onValueChange,
    labels: _labels,
    ...props
  } = allProps as SelectCommonProps & {
    ref?: React.Ref<HTMLButtonElement>
    multiple?: boolean
    value?: unknown
    defaultValue?: unknown
    onValueChange?: unknown
    labels?: unknown
  }
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
  const many = allProps.multiple === true ? allProps : undefined
  const one = allProps.multiple === true ? undefined : allProps
  const initialValue: string | readonly string[] = many
    ? (many.defaultValue ?? [])
    : (one!.defaultValue ?? options[0]?.value ?? '')
  const [localValue, setLocalValue] = React.useState(initialValue)
  const nativeInput = React.useRef<HTMLInputElement>(null)
  const resetCallback =
    React.useRef<
      (value: never, eventDetails: BaseSelect.Root.ChangeEventDetails) => void
    >(undefined)
  resetCallback.current = allProps.onValueChange as unknown as (
    value: never,
    eventDetails: BaseSelect.Root.ChangeEventDetails,
  ) => void
  const resetKey = many ? initialValue.toString() : (initialValue as string)
  React.useEffect(() => {
    const owner = nativeInput.current?.form
    if (!owner) return
    const pending = new Set<ReturnType<typeof setTimeout>>()
    const reset = (event: Event) => {
      const timer = setTimeout(() => {
        pending.delete(timer)
        if (event.defaultPrevented) return
        setLocalValue(initialValue)
        resetCallback.current?.(
          (Array.isArray(initialValue)
            ? [...initialValue]
            : initialValue) as never,
          resetDetails(event),
        )
      }, 0)
      pending.add(timer)
    }
    owner.addEventListener('reset', reset)
    return () => {
      owner.removeEventListener('reset', reset)
      pending.forEach(clearTimeout)
    }
    // initialValue is read through resetKey, so a new array of the same values
    // does not re-register the listener.
  }, [resetKey, props.form])
  const { name, form, required, disabled, id, ...aria } = props
  const setInput = (node: HTMLInputElement | null) => {
    nativeInput.current = node
    if (typeof inputRef === 'function') inputRef(node)
    else if (inputRef) inputRef.current = node
  }
  // Several values: the "all" option leads the list, and the trigger sums them up.
  const choosable = options.filter((option) => !option.disabled)
  const text = { ...multipleLabels, ...(many?.labels ?? {}) }
  const chosen: readonly string[] = many
    ? (many.value ?? (localValue as readonly string[]))
    : []
  const everything =
    choosable.length > 0 &&
    choosable.every((option) => chosen.includes(option.value))
  const summary = (values: readonly string[]) =>
    values.length === 0
      ? text.none
      : choosable.every((option) => values.includes(option.value))
        ? text.all
        : values.length === 1
          ? options.find((option) => option.value === values[0])?.label
          : text.count(values.length)
  const selected = many
    ? everything
      ? [ALL, ...chosen]
      : chosen
    : (one!.value ?? (localValue as string))
  const value = many ? summary(chosen) : <BaseSelect.Value />
  // Content width: every label the trigger can show, stacked in one cell.
  const sizes = many
    ? [
        text.all,
        text.none,
        text.count(options.length),
        ...options.map((option) => option.label),
      ]
    : options.map((option) => option.label)
  return (
    <span
      className={cx('surf-select', className)}
      data-size={size}
      data-ui-size={scheme}
      data-width={width}
      data-disabled={disabled || undefined}
    >
      <BaseSelect.Root<string, boolean>
        items={options}
        multiple={multiple}
        value={selected}
        onValueChange={(next, eventDetails) => {
          if (many) {
            const list = (next as string[]) ?? []
            const toggledAll = list.includes(ALL) !== everything
            const values = toggledAll
              ? everything
                ? []
                : choosable.map((option) => option.value)
              : // Unchecking one option of "all" leaves the others.
                list.filter((item) => item !== ALL)
            many.onValueChange?.(values, eventDetails)
            if (!eventDetails.isCanceled) setLocalValue(values)
          } else {
            one!.onValueChange?.((next as string) ?? '', eventDetails)
            if (!eventDetails.isCanceled) setLocalValue((next as string) ?? '')
          }
        }}
        inputRef={setInput}
        // A multiple Select submits its own inputs, without the "all" value.
        name={many ? undefined : name}
        form={form}
        required={required}
        disabled={disabled}
        id={id}
      >
        <BaseSelect.Trigger
          {...aria}
          ref={setTrigger}
          className='surf-select-trigger'
          data-value={many ? chosen.join(' ') : (selected as string)}
        >
          {width === 'content' ? (
            // Every label sits in one cell, hidden but the chosen one, so the
            // trigger is as wide as the longest.
            <span className='surf-select-sizer'>
              <span className='surf-select-value'>{value}</span>
              {sizes.map((label, index) => (
                <span key={index} aria-hidden='true'>
                  {label}
                </span>
              ))}
            </span>
          ) : many ? (
            <span className='surf-select-value'>{value}</span>
          ) : (
            value
          )}
          <BaseSelect.Icon className='surf-select-icon'>
            <Icon name='chevron-down' />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        {many &&
          name &&
          chosen.map((item) => (
            <input
              key={item}
              type='hidden'
              name={name}
              value={item}
              form={form}
            />
          ))}
        <BaseSelect.Portal>
          <BaseSelect.Positioner
            className='surf-positioner'
            sideOffset={6}
            alignItemWithTrigger={false}
          >
            <BaseSelect.Popup
              className='surf-select-popup'
              data-ui-size={scheme}
            >
              <BaseSelect.List>
                {many && (
                  <>
                    {renderOption({
                      value: ALL,
                      label: text.all,
                      disabled: choosable.length === 0,
                    })}
                    <BaseSelect.Separator className='surf-select-separator' />
                  </>
                )}
                {items.map((item, index) =>
                  isGroup(item) ? (
                    <BaseSelect.Group className='surf-select-group' key={index}>
                      <BaseSelect.GroupLabel className='surf-select-group-label'>
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
}
function renderOption(option: SelectOption) {
  return (
    <BaseSelect.Item
      className='surf-select-item'
      value={option.value}
      data-option-value={option.value === ALL ? undefined : option.value}
      disabled={option.disabled}
      key={option.value}
    >
      <BaseSelect.ItemIndicator className='surf-select-check'>
        <Icon name='check' />
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
    </BaseSelect.Item>
  )
}
