'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { Menu as BaseMenu } from '@base-ui/react/menu'
import { OwnPortal, part, scopedPortal, skin } from './parts.js'
const MenuPopup = /* @__PURE__ */ part<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Popup>
>(BaseMenu.Popup, 'surf-menu', { portal: true })
const MenuPositioner = /* @__PURE__ */ part<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Positioner>
>(BaseMenu.Positioner, 'surf-positioner', { portal: true })
const MenuContent = function MenuContent({
  align = 'end',
  sideOffset = 6,
  side,
  collisionPadding,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseMenu.Popup> &
  Pick<
    React.ComponentPropsWithoutRef<typeof BaseMenu.Positioner>,
    'align' | 'side' | 'sideOffset' | 'collisionPadding'
  > & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <OwnPortal portal={BaseMenu.Portal}>
      <MenuPositioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
      >
        <MenuPopup {...props} ref={ref} className={className} />
      </MenuPositioner>
    </OwnPortal>
  )
}
const MenuTrigger = function MenuTrigger({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseMenu.Trigger> & {
  ref?: React.Ref<HTMLButtonElement>
}) {
  return (
    <BaseMenu.Trigger
      data-variant='ghost'
      {...props}
      ref={ref}
      className={skin('surf-button surf-menu-trigger', className)}
    />
  )
}
const CheckboxIndicator = function CheckboxIndicator({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseMenu.CheckboxItemIndicator> & {
  ref?: React.Ref<HTMLSpanElement>
}) {
  return (
    <BaseMenu.CheckboxItemIndicator
      keepMounted
      {...props}
      ref={ref}
      className={skin('surf-menu-indicator', className)}
    >
      {children ?? <Icon name='check' />}
    </BaseMenu.CheckboxItemIndicator>
  )
}
const RadioIndicator = function RadioIndicator({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseMenu.RadioItemIndicator> & {
  ref?: React.Ref<HTMLSpanElement>
}) {
  return (
    <BaseMenu.RadioItemIndicator
      keepMounted
      {...props}
      ref={ref}
      className={skin('surf-menu-indicator', className)}
    >
      {children ?? (
        <svg
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='currentColor'
          aria-hidden='true'
        >
          <circle cx='12' cy='12' r='4' />
        </svg>
      )}
    </BaseMenu.RadioItemIndicator>
  )
}
const SubmenuTrigger = function SubmenuTrigger({
  className,
  children,
  indicator,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseMenu.SubmenuTrigger> & {
  indicator?: React.ReactNode
} & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <BaseMenu.SubmenuTrigger
      {...props}
      ref={ref}
      className={skin('surf-menu-item surf-menu-submenu-trigger', className)}
    >
      {children}
      {indicator === false
        ? null
        : (indicator ?? (
            <Icon name='chevron-forward' className='surf-submenu-arrow' />
          ))}
    </BaseMenu.SubmenuTrigger>
  )
}
/** Content brings its own portal; Portal stays for wrapping it, or raw parts. */
const MenuPortal = /* @__PURE__ */ scopedPortal(BaseMenu.Portal)
export const Menu = {
  ...BaseMenu,
  Portal: MenuPortal,
  Content: MenuContent,
  Popup: MenuPopup,
  Positioner: MenuPositioner,
  Trigger: MenuTrigger,
  CheckboxItemIndicator: CheckboxIndicator,
  RadioItemIndicator: RadioIndicator,
  SubmenuTrigger,
  Item: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseMenu.Item>
  >(BaseMenu.Item, 'surf-menu-item'),
  LinkItem: /* @__PURE__ */ part<
    HTMLAnchorElement,
    React.ComponentPropsWithoutRef<typeof BaseMenu.LinkItem>
  >(BaseMenu.LinkItem, 'surf-menu-item'),
  CheckboxItem: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseMenu.CheckboxItem>
  >(BaseMenu.CheckboxItem, 'surf-menu-item surf-menu-check-item'),
  RadioItem: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseMenu.RadioItem>
  >(BaseMenu.RadioItem, 'surf-menu-item surf-menu-check-item'),
  GroupLabel: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseMenu.GroupLabel>
  >(BaseMenu.GroupLabel, 'surf-menu-group-label'),
  Separator: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseMenu.Separator>
  >(BaseMenu.Separator, 'surf-menu-separator'),
  Input: /* @__PURE__ */ part<
    HTMLInputElement,
    React.ComponentPropsWithoutRef<typeof BaseMenu.Input>
  >(BaseMenu.Input, 'surf-input'),
}

// Flat names for React Server Components, which cannot dot into client exports.
export { MenuPopup, MenuPositioner, MenuTrigger, MenuContent, MenuPortal }
export const {
  Arrow: MenuArrow,
  Backdrop: MenuBackdrop,
  CheckboxItem: MenuCheckboxItem,
  CheckboxItemIndicator: MenuCheckboxItemIndicator,
  Clear: MenuClear,
  Empty: MenuEmpty,
  FilterProvider: MenuFilterProvider,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  Handle: MenuHandle,
  Input: MenuInput,
  Item: MenuItem,
  LinkItem: MenuLinkItem,
  List: MenuList,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  RadioItemIndicator: MenuRadioItemIndicator,
  Root: MenuRoot,
  Separator: MenuSeparator,
  SubmenuRoot: MenuSubmenuRoot,
  SubmenuTrigger: MenuSubmenuTrigger,
  Viewport: MenuViewport,
} = Menu
