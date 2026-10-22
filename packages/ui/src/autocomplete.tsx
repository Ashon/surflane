'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete'
import { Combobox } from './combobox.js'
import { part, scopedPortal, skin } from './parts.js'
import { useResetValue } from './form-state.js'

const AutocompleteRoot: typeof BaseAutocomplete.Root =
  function AutocompleteRoot({
    children,
    form,
    value,
    defaultValue,
    onValueChange,
    ...props
  }: React.ComponentProps<typeof BaseAutocomplete.Root>) {
    const anchor = React.useRef<HTMLSpanElement>(null)
    const [query, setQuery, revision] = useResetValue(
      value,
      defaultValue ?? '',
      anchor,
      form,
    )
    return (
      <BaseAutocomplete.Root
        key={revision}
        {...props}
        form={form}
        value={query}
        onValueChange={(next, event) => {
          onValueChange?.(next, event)
          if (value === undefined && !event.isCanceled) setQuery(next)
        }}
      >
        <span hidden ref={anchor} />
        {children}
      </BaseAutocomplete.Root>
    )
  }
const AutoTrigger = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Trigger>
>(function AutoTrigger({ className, children, ...props }, ref) {
  return (
    <BaseAutocomplete.Trigger
      aria-label='Show suggestions'
      {...props}
      ref={ref}
      className={skin('pui-combobox-action', className)}
    >
      {children ?? <Icon name='chevron-down' />}
    </BaseAutocomplete.Trigger>
  )
})
const AutoClear = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Clear>
>(function AutoClear(props, ref) {
  return <Combobox.Clear aria-label='Clear input' {...props} ref={ref} />
})
export const Autocomplete = {
  ...BaseAutocomplete,
  Root: AutocompleteRoot,
  Portal: /* @__PURE__ */ scopedPortal(BaseAutocomplete.Portal),
  Content: Combobox.Content,
  Popup: Combobox.Popup,
  Positioner: Combobox.Positioner,
  Input: Combobox.Input,
  List: Combobox.List,
  Empty: Combobox.Empty,
  Status: Combobox.Status,
  Group: Combobox.Group,
  GroupLabel: Combobox.GroupLabel,
  Clear: AutoClear,
  Trigger: AutoTrigger,
  InputGroup: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseAutocomplete.InputGroup>
  >(BaseAutocomplete.InputGroup, 'pui-combobox-group'),
  Item: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Item>
  >(BaseAutocomplete.Item, 'pui-combobox-item'),
  Separator: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Separator>
  >(BaseAutocomplete.Separator, 'pui-combobox-separator'),
}
// Flat names for React Server Components, which cannot dot into client exports.
export { AutocompleteRoot }
export const {
  Arrow: AutocompleteArrow,
  Backdrop: AutocompleteBackdrop,
  Clear: AutocompleteClear,
  Collection: AutocompleteCollection,
  Empty: AutocompleteEmpty,
  Group: AutocompleteGroup,
  GroupLabel: AutocompleteGroupLabel,
  Icon: AutocompleteIcon,
  Input: AutocompleteInput,
  InputGroup: AutocompleteInputGroup,
  Item: AutocompleteItem,
  List: AutocompleteList,
  Popup: AutocompletePopup,
  Portal: AutocompletePortal,
  Positioner: AutocompletePositioner,
  Row: AutocompleteRow,
  Separator: AutocompleteSeparator,
  Status: AutocompleteStatus,
  Trigger: AutocompleteTrigger,
  Value: AutocompleteValue,
  Content: AutocompleteContent,
} = Autocomplete
