'use client'
import * as React from 'react'
import { Menu as BaseMenu } from '@base-ui/react/menu'
import { OwnPortal, part, scopedPortal, skin } from './parts.js'
const MenuPopup = /* @__PURE__ */ part<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Popup>
>(BaseMenu.Popup, 'pui-menu')
const MenuPositioner = /* @__PURE__ */ part<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Positioner>
>(BaseMenu.Positioner, 'pui-positioner')
const MenuContent = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Popup> &
    Pick<
      React.ComponentPropsWithoutRef<typeof BaseMenu.Positioner>,
      'align' | 'side' | 'sideOffset' | 'collisionPadding'
    >
>(function MenuContent(
  {
    align = 'end',
    sideOffset = 6,
    side,
    collisionPadding,
    className,
    ...props
  },
  ref,
) {
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
})
const MenuTrigger = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.Trigger>
>(function MenuTrigger({ className, ...props }, ref) {
  return (
    <BaseMenu.Trigger
      data-variant='ghost'
      {...props}
      ref={ref}
      className={skin('pui-button pui-menu-trigger', className)}
    />
  )
})
const CheckboxIndicator = /* @__PURE__ */ React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.CheckboxItemIndicator>
>(function CheckboxIndicator({ className, children, ...props }, ref) {
  return (
    <BaseMenu.CheckboxItemIndicator
      keepMounted
      {...props}
      ref={ref}
      className={skin('pui-menu-indicator', className)}
    >
      {children ?? (
        <svg
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.6'
          aria-hidden='true'
        >
          <path d='m5 12 4 4L19 6' />
        </svg>
      )}
    </BaseMenu.CheckboxItemIndicator>
  )
})
const RadioIndicator = /* @__PURE__ */ React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.RadioItemIndicator>
>(function RadioIndicator({ className, children, ...props }, ref) {
  return (
    <BaseMenu.RadioItemIndicator
      keepMounted
      {...props}
      ref={ref}
      className={skin('pui-menu-indicator', className)}
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
})
const SubmenuTrigger = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseMenu.SubmenuTrigger> & {
    indicator?: React.ReactNode
  }
>(function SubmenuTrigger({ className, children, indicator, ...props }, ref) {
  return (
    <BaseMenu.SubmenuTrigger
      {...props}
      ref={ref}
      className={skin('pui-menu-item pui-menu-submenu-trigger', className)}
    >
      {children}
      {indicator === false
        ? null
        : (indicator ?? (
            <svg
              className='pui-submenu-arrow'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.6'
              aria-hidden='true'
            >
              <path d='m9 6 6 6-6 6' />
            </svg>
          ))}
    </BaseMenu.SubmenuTrigger>
  )
})
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
  >(BaseMenu.Item, 'pui-menu-item'),
  LinkItem: /* @__PURE__ */ part<
    HTMLAnchorElement,
    React.ComponentPropsWithoutRef<typeof BaseMenu.LinkItem>
  >(BaseMenu.LinkItem, 'pui-menu-item'),
  CheckboxItem: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseMenu.CheckboxItem>
  >(BaseMenu.CheckboxItem, 'pui-menu-item pui-menu-check-item'),
  RadioItem: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseMenu.RadioItem>
  >(BaseMenu.RadioItem, 'pui-menu-item pui-menu-check-item'),
  GroupLabel: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseMenu.GroupLabel>
  >(BaseMenu.GroupLabel, 'pui-menu-group-label'),
  Separator: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseMenu.Separator>
  >(BaseMenu.Separator, 'pui-menu-separator'),
  Input: /* @__PURE__ */ part<
    HTMLInputElement,
    React.ComponentPropsWithoutRef<typeof BaseMenu.Input>
  >(BaseMenu.Input, 'pui-input'),
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
