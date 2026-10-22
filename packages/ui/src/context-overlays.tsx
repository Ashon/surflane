'use client'
import * as React from 'react'
import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu'
import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card'
import { Menu } from './menu.js'
import { OwnPortal, defined, part, scopedPortal, skin } from './parts.js'

const ContextPositioner = /* @__PURE__ */ part<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.Positioner>
>(BaseContextMenu.Positioner, 'pui-positioner')
type Placement<Positioner extends React.ElementType> = Pick<
  React.ComponentPropsWithoutRef<Positioner>,
  'side' | 'align' | 'sideOffset' | 'collisionPadding'
>
const ContextContent = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.Popup> &
    Placement<typeof BaseContextMenu.Positioner> & {
      /** @deprecated Pass side, align, sideOffset and collisionPadding directly. */
      positionerProps?: React.ComponentPropsWithoutRef<
        typeof BaseContextMenu.Positioner
      >
    }
>(function ContextContent(
  { side, align, sideOffset, collisionPadding, positionerProps, ...props },
  ref,
) {
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
})
/** Same menu anatomy and styling, with the context-specific cursor positioner. */
export const ContextMenu = {
  ...BaseContextMenu,
  Trigger: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseContextMenu.Trigger>
  >(BaseContextMenu.Trigger, 'pui-context-trigger'),
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
const PreviewPositioner = /* @__PURE__ */ part<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BasePreviewCard.Positioner>
>(BasePreviewCard.Positioner, 'pui-positioner')
// The preview is visual enhancement; its destination is the accessible interface.
const PreviewPopup = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BasePreviewCard.Popup>
>(function PreviewPopup({ className, ...props }, ref) {
  return (
    <BasePreviewCard.Popup
      {...props}
      ref={ref}
      aria-hidden='true'
      className={skin('pui-preview-card', className)}
    />
  )
})
function PreviewTrigger<Payload>(
  props: BasePreviewCard.Trigger.Props<Payload> &
    React.RefAttributes<HTMLElement>,
) {
  const { className, ...rest } = props
  return (
    <BasePreviewCard.Trigger
      {...rest}
      className={skin('pui-link pui-preview-trigger', className)}
    />
  )
}
const PreviewContent = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BasePreviewCard.Popup> &
    Placement<typeof BasePreviewCard.Positioner> & {
      /** @deprecated Pass side, align, sideOffset and collisionPadding directly. */
      positionerProps?: React.ComponentPropsWithoutRef<
        typeof BasePreviewCard.Positioner
      >
    }
>(function PreviewContent(
  { side, align, sideOffset, collisionPadding, positionerProps, ...props },
  ref,
) {
  return (
    <OwnPortal portal={BasePreviewCard.Portal}>
      <PreviewPositioner
        sideOffset={8}
        collisionPadding={12}
        {...positionerProps}
        {...defined({ side, align, sideOffset, collisionPadding })}
      >
        <PreviewPopup {...props} ref={ref} />
      </PreviewPositioner>
    </OwnPortal>
  )
})
export const PreviewCard = {
  ...BasePreviewCard,
  Portal: /* @__PURE__ */ scopedPortal(BasePreviewCard.Portal),
  Trigger: PreviewTrigger,
  Positioner: PreviewPositioner,
  Popup: PreviewPopup,
  Content: PreviewContent,
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
export const {
  Arrow: PreviewCardArrow,
  Backdrop: PreviewCardBackdrop,
  Handle: PreviewCardHandle,
  Popup: PreviewCardPopup,
  Portal: PreviewCardPortal,
  Positioner: PreviewCardPositioner,
  Root: PreviewCardRoot,
  Trigger: PreviewCardTrigger,
  Viewport: PreviewCardViewport,
  Content: PreviewCardContent,
} = PreviewCard
