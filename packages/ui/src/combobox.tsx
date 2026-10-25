'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import { OwnPortal, defined, part, scopedPortal, skin } from './parts.js'
import { useResetValue } from './form-state.js'

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
>(BaseCombobox.Popup, 'surf-combobox-popup', { portal: true })
const ComboPositioner = /* @__PURE__ */ part<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Positioner>
>(BaseCombobox.Positioner, 'surf-positioner', { portal: true })
const ComboContent = function ComboContent({
  side,
  align,
  sideOffset,
  collisionPadding,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseCombobox.Popup> &
  Pick<
    React.ComponentPropsWithoutRef<typeof BaseCombobox.Positioner>,
    'side' | 'align' | 'sideOffset' | 'collisionPadding'
  > & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <OwnPortal portal={BaseCombobox.Portal}>
      <ComboPositioner
        sideOffset={6}
        {...defined({ side, align, sideOffset, collisionPadding })}
      >
        <ComboPopup {...props} ref={ref} />
      </ComboPositioner>
    </OwnPortal>
  )
}
const ComboTrigger = function ComboTrigger({
  children,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseCombobox.Trigger> & {
  ref?: React.Ref<HTMLButtonElement>
}) {
  return (
    <BaseCombobox.Trigger
      aria-label='Show options'
      {...props}
      ref={ref}
      className={skin('surf-combobox-action', className)}
    >
      {children ?? <Icon name='chevron-down' />}
    </BaseCombobox.Trigger>
  )
}
const ComboClear = function ComboClear({
  children,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseCombobox.Clear> & {
  ref?: React.Ref<HTMLButtonElement>
}) {
  return (
    <BaseCombobox.Clear
      aria-label='Clear selection'
      {...props}
      ref={ref}
      className={skin('surf-combobox-action', className)}
    >
      {children ?? <Icon name='close' />}
    </BaseCombobox.Clear>
  )
}
const ComboIndicator = function ComboIndicator({
  children,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseCombobox.ItemIndicator> & {
  ref?: React.Ref<HTMLSpanElement>
}) {
  return (
    <BaseCombobox.ItemIndicator
      keepMounted
      {...props}
      ref={ref}
      className={skin('surf-combobox-indicator', className)}
    >
      {children ?? <Icon name='check' />}
    </BaseCombobox.ItemIndicator>
  )
}
const ComboRemove = function ComboRemove({
  children,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseCombobox.ChipRemove> & {
  ref?: React.Ref<HTMLButtonElement>
}) {
  return (
    <BaseCombobox.ChipRemove
      {...props}
      ref={ref}
      className={skin('surf-combobox-chip-remove', className)}
    >
      {children ?? <Icon name='close' />}
    </BaseCombobox.ChipRemove>
  )
}
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
  >(BaseCombobox.Input, 'surf-input surf-combobox-input'),
  InputGroup: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.InputGroup>
  >(BaseCombobox.InputGroup, 'surf-combobox-group'),
  List: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.List>
  >(BaseCombobox.List, 'surf-combobox-list'),
  Item: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.Item>
  >(BaseCombobox.Item, 'surf-combobox-item'),
  Empty: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.Empty>
  >(BaseCombobox.Empty, 'surf-combobox-empty'),
  Status: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.Status>
  >(BaseCombobox.Status, 'surf-combobox-status'),
  Group: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.Group>
  >(BaseCombobox.Group, 'surf-combobox-section'),
  GroupLabel: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.GroupLabel>
  >(BaseCombobox.GroupLabel, 'surf-combobox-section-label'),
  Separator: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.Separator>
  >(BaseCombobox.Separator, 'surf-combobox-separator'),
  Chips: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.Chips>
  >(BaseCombobox.Chips, 'surf-combobox-chips'),
  Chip: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseCombobox.Chip>
  >(BaseCombobox.Chip, 'surf-combobox-chip'),
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
