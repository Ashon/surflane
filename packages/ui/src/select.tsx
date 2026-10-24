'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { useComponentSize, type ComponentSizeAlias } from './sizing.js'
import { Select as BaseSelect } from '@base-ui/react/select'
import { sizeName, cx } from './parts.js'

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
export const Select = function Select({
  options: items,
  value,
  defaultValue,
  onValueChange,
  className,
  inputRef,
  triggerRef,
  size,
  ref,
  ...props
}: SelectProps & { ref?: React.Ref<HTMLButtonElement> }) {
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
      className={cx('surf-select', className)}
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
          className='surf-select-trigger'
          data-value={selected}
        >
          <BaseSelect.Value />
          <BaseSelect.Icon className='surf-select-icon'>
            <Icon name='chevron-down' />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
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
      data-option-value={option.value}
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
