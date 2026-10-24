'use client'
import * as React from 'react'
import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu'
import { Menu } from './menu.js'
import {
  OwnPortal,
  defined,
  part,
  scopedPortal,
  type Placement,
} from './parts.js'

const ContextPositioner = /* @__PURE__ */ part<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.Positioner>
>(BaseContextMenu.Positioner, 'surf-positioner', { portal: true })
const ContextContent = function ContextContent({
  side,
  align,
  sideOffset,
  collisionPadding,
  positionerProps,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseContextMenu.Popup> &
  Placement<typeof BaseContextMenu.Positioner> & {
    /** @deprecated Pass side, align, sideOffset and collisionPadding directly. */
    positionerProps?: React.ComponentPropsWithoutRef<
      typeof BaseContextMenu.Positioner
    >
  } & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <OwnPortal portal={BaseContextMenu.Portal}>
      <ContextPositioner
        {...positionerProps}
        {...defined({ side, align, sideOffset, collisionPadding })}
      >
        <Menu.Popup {...props} ref={ref} />
      </ContextPositioner>
    </OwnPortal>
  )
}
/** Same menu anatomy and styling, with the context-specific cursor positioner. */
export const ContextMenu = {
  ...BaseContextMenu,
  Trigger: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseContextMenu.Trigger>
  >(BaseContextMenu.Trigger, 'surf-context-trigger'),
  Portal: /* @__PURE__ */ scopedPortal(BaseContextMenu.Portal),
  Positioner: ContextPositioner,
  Content: ContextContent,
  Popup: Menu.Popup,
  Item: Menu.Item,
  LinkItem: Menu.LinkItem,
  CheckboxItem: Menu.CheckboxItem,
  CheckboxItemIndicator: Menu.CheckboxItemIndicator,
  RadioItem: Menu.RadioItem,
  RadioItemIndicator: Menu.RadioItemIndicator,
  GroupLabel: Menu.GroupLabel,
  Separator: Menu.Separator,
  SubmenuTrigger: Menu.SubmenuTrigger,
}
// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Arrow: ContextMenuArrow,
  Backdrop: ContextMenuBackdrop,
  CheckboxItem: ContextMenuCheckboxItem,
  CheckboxItemIndicator: ContextMenuCheckboxItemIndicator,
  Group: ContextMenuGroup,
  GroupLabel: ContextMenuGroupLabel,
  Item: ContextMenuItem,
  LinkItem: ContextMenuLinkItem,
  Popup: ContextMenuPopup,
  Portal: ContextMenuPortal,
  Positioner: ContextMenuPositioner,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  RadioItemIndicator: ContextMenuRadioItemIndicator,
  Root: ContextMenuRoot,
  Separator: ContextMenuSeparator,
  SubmenuRoot: ContextMenuSubmenuRoot,
  SubmenuTrigger: ContextMenuSubmenuTrigger,
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
} = ContextMenu
