"use client";
import * as React from "react";
import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import { PreviewCard as BasePreviewCard } from "@base-ui/react/preview-card";
import { Menu } from "./menu.js";
import { part, skin } from "./parts.js";

const ContextPositioner = part<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.Positioner>
>(BaseContextMenu.Positioner, "pui-positioner");
const ContextContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.Popup> & {
    positionerProps?: React.ComponentPropsWithoutRef<
      typeof BaseContextMenu.Positioner
    >;
  }
>(function ContextContent({ positionerProps, ...props }, ref) {
  return (
    <ContextPositioner {...positionerProps}>
      <Menu.Popup {...props} ref={ref} />
    </ContextPositioner>
  );
});
/** Same menu anatomy and styling, with the context-specific cursor positioner. */
export const ContextMenu = {
  ...BaseContextMenu,
  Trigger: part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseContextMenu.Trigger>
  >(BaseContextMenu.Trigger, "pui-context-trigger"),
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
};
const PreviewPositioner = part<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BasePreviewCard.Positioner>
>(BasePreviewCard.Positioner, "pui-positioner");
// The preview is visual enhancement; its destination is the accessible interface.
const PreviewPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BasePreviewCard.Popup>
>(function PreviewPopup({ className, ...props }, ref) {
  return (
    <BasePreviewCard.Popup
      {...props}
      ref={ref}
      aria-hidden="true"
      className={skin("pui-preview-card", className)}
    />
  );
});
function PreviewTrigger<Payload>(
  props: BasePreviewCard.Trigger.Props<Payload> &
    React.RefAttributes<HTMLElement>,
) {
  const { className, ...rest } = props;
  return (
    <BasePreviewCard.Trigger
      {...rest}
      className={skin("pui-link pui-preview-trigger", className)}
    />
  );
}
const PreviewContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BasePreviewCard.Popup> & {
    positionerProps?: React.ComponentPropsWithoutRef<
      typeof BasePreviewCard.Positioner
    >;
  }
>(function PreviewContent({ positionerProps, ...props }, ref) {
  return (
    <PreviewPositioner
      sideOffset={8}
      collisionPadding={12}
      {...positionerProps}
    >
      <PreviewPopup {...props} ref={ref} />
    </PreviewPositioner>
  );
});
export const PreviewCard = {
  ...BasePreviewCard,
  Trigger: PreviewTrigger,
  Positioner: PreviewPositioner,
  Popup: PreviewPopup,
  Content: PreviewContent,
};

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
} = ContextMenu;
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
} = PreviewCard;
