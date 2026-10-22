'use client'
import * as React from 'react'
import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import { NumberField as BaseNumberField } from '@base-ui/react/number-field'
import { OwnPortal, defined, part, scopedPortal, skin } from './parts.js'
import { useRootRef, useResetValue } from './form-state.js'
function Mark({
  kind,
}: {
  kind: 'check' | 'clear' | 'expand' | 'plus' | 'minus'
}) {
  const path =
    kind === 'check'
      ? 'm5 12 4 4L19 6'
      : kind === 'clear'
        ? 'm6 6 12 12M6 18 18 6'
        : kind === 'expand'
          ? 'm6 9 6 6 6-6'
          : kind === 'plus'
            ? 'M5 12h14M12 5v14'
            : 'M5 12h14'
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.6'
      aria-hidden='true'
    >
      <path d={path} />
    </svg>
  )
}
function ComboboxRoot<
  Value,
  Multiple extends boolean | undefined = false,
  Item = Value,
>({
  children,
  form,
  ...props
}: BaseCombobox.Root.Props<Value, Multiple, Item>) {
  const anchor = React.useRef<HTMLSpanElement>(null)
  // Base UI does not reset its internal selection/query model on native form reset.
  // Recreate that model together; controlled value/query props remain caller-owned.
  const [, , revision] = useResetValue(true, true, anchor, form)
  return (
    <BaseCombobox.Root key={revision} {...props} form={form}>
      <span hidden ref={anchor} />
      {children}
    </BaseCombobox.Root>
  )
}
const ComboPopup = /* @__PURE__ */ part<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Popup>
>(BaseCombobox.Popup, 'pui-combobox-popup')
const ComboPositioner = /* @__PURE__ */ part<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Positioner>
>(BaseCombobox.Positioner, 'pui-positioner')
const ComboContent = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Popup> &
    Pick<
      React.ComponentPropsWithoutRef<typeof BaseCombobox.Positioner>,
      'side' | 'align' | 'sideOffset' | 'collisionPadding'
    > & {
      /** @deprecated Pass side, align, sideOffset and collisionPadding directly. */
      positionerProps?: React.ComponentPropsWithoutRef<
        typeof BaseCombobox.Positioner
      >
    }
>(function ComboContent(
  { side, align, sideOffset, collisionPadding, positionerProps, ...props },
  ref,
) {
  return (
    <OwnPortal portal={BaseCombobox.Portal}>
      <ComboPositioner
        sideOffset={6}
        {...positionerProps}
        {...defined({ side, align, sideOffset, collisionPadding })}
      >
        <ComboPopup {...props} ref={ref} />
      </ComboPositioner>
    </OwnPortal>
  )
})
const ComboTrigger = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Trigger>
>(function ComboTrigger({ children, className, ...props }, ref) {
  return (
    <BaseCombobox.Trigger
      aria-label='Show options'
      {...props}
      ref={ref}
      className={skin('pui-combobox-action', className)}
    >
      {children ?? <Mark kind='expand' />}
    </BaseCombobox.Trigger>
  )
})
const ComboClear = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Clear>
>(function ComboClear({ children, className, ...props }, ref) {
  return (
    <BaseCombobox.Clear
      aria-label='Clear selection'
      {...props}
      ref={ref}
      className={skin('pui-combobox-action', className)}
    >
      {children ?? <Mark kind='clear' />}
    </BaseCombobox.Clear>
  )
})
const ComboIndicator = /* @__PURE__ */ React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.ItemIndicator>
>(function ComboIndicator({ children, className, ...props }, ref) {
  return (
    <BaseCombobox.ItemIndicator
      keepMounted
      {...props}
      ref={ref}
      className={skin('pui-combobox-indicator', className)}
    >
      {children ?? <Mark kind='check' />}
    </BaseCombobox.ItemIndicator>
  )
})
const ComboRemove = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.ChipRemove>
>(function ComboRemove({ children, className, ...props }, ref) {
  return (
    <BaseCombobox.ChipRemove
      {...props}
      ref={ref}
      className={skin('pui-combobox-chip-remove', className)}
    >
      {children ?? <Mark kind='clear' />}
    </BaseCombobox.ChipRemove>
  )
})
export const Combobox = {
  ...BaseCombobox,
  Root: ComboboxRoot,
  Portal: /* @__PURE__ */ scopedPortal(BaseCombobox.Portal),
  Content: ComboContent,
  Popup: ComboPopup,
  Positioner: ComboPositioner,
  Trigger: ComboTrigger,
  Clear: ComboClear,
  ItemIndicator: ComboIndicator,
  ChipRemove: ComboRemove,
  Input: /* @__PURE__ */ part<
    HTMLInputElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.Input>
  >(BaseCombobox.Input, 'pui-input pui-combobox-input'),
  InputGroup: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.InputGroup>
  >(BaseCombobox.InputGroup, 'pui-combobox-group'),
  List: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.List>
  >(BaseCombobox.List, 'pui-combobox-list scroll-area'),
  Item: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.Item>
  >(BaseCombobox.Item, 'pui-combobox-item'),
  Empty: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.Empty>
  >(BaseCombobox.Empty, 'pui-combobox-empty'),
  Status: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.Status>
  >(BaseCombobox.Status, 'pui-combobox-status'),
  Group: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.Group>
  >(BaseCombobox.Group, 'pui-combobox-section'),
  GroupLabel: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.GroupLabel>
  >(BaseCombobox.GroupLabel, 'pui-combobox-section-label'),
  Separator: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.Separator>
  >(BaseCombobox.Separator, 'pui-combobox-separator'),
  Chips: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.Chips>
  >(BaseCombobox.Chips, 'pui-combobox-chips'),
  Chip: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.Chip>
  >(BaseCombobox.Chip, 'pui-combobox-chip'),
}
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
      {children ?? <Mark kind='plus' />}
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
      {children ?? <Mark kind='minus' />}
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
export { ComboboxRoot }
export const {
  Arrow: ComboboxArrow,
  Backdrop: ComboboxBackdrop,
  Chip: ComboboxChip,
  ChipRemove: ComboboxChipRemove,
  Chips: ComboboxChips,
  Clear: ComboboxClear,
  Collection: ComboboxCollection,
  Empty: ComboboxEmpty,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Icon: ComboboxIcon,
  Input: ComboboxInput,
  InputGroup: ComboboxInputGroup,
  Item: ComboboxItem,
  ItemIndicator: ComboboxItemIndicator,
  Label: ComboboxLabel,
  List: ComboboxList,
  Popup: ComboboxPopup,
  Portal: ComboboxPortal,
  Positioner: ComboboxPositioner,
  Row: ComboboxRow,
  Separator: ComboboxSeparator,
  Status: ComboboxStatus,
  Trigger: ComboboxTrigger,
  Value: ComboboxValue,
  Content: ComboboxContent,
} = Combobox
export const {
  Decrement: NumberFieldDecrement,
  Group: NumberFieldGroup,
  Increment: NumberFieldIncrement,
  Input: NumberFieldInput,
  Root: NumberFieldRoot,
  ScrubArea: NumberFieldScrubArea,
  ScrubAreaCursor: NumberFieldScrubAreaCursor,
} = NumberField
