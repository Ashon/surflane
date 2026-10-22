'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu'
import { part, skin } from './parts.js'
function Root<Value>(props: BaseNavigationMenu.Root.Props<Value>) {
  const { className, orientation = 'horizontal', ...rest } = props
  return (
    <BaseNavigationMenu.Root<Value>
      {...rest}
      orientation={orientation}
      data-orientation={orientation}
      className={skin('pui-navigation-menu', className)}
    />
  )
}
const Trigger = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Trigger> & {
    indicator?: React.ReactNode
  }
>(function Trigger({ className, children, indicator, ...props }, ref) {
  return (
    <BaseNavigationMenu.Trigger
      data-variant='ghost'
      {...props}
      ref={ref}
      className={skin('pui-button pui-navigation-trigger', className)}
    >
      {children}
      {indicator === false
        ? null
        : (indicator ?? (
            <BaseNavigationMenu.Icon className='pui-navigation-icon'>
              <Icon name='chevron-down' />
            </BaseNavigationMenu.Icon>
          ))}
    </BaseNavigationMenu.Trigger>
  )
})
export const NavigationMenu = {
  ...BaseNavigationMenu,
  Root,
  Trigger,
  List: /* @__PURE__ */ part<
    HTMLUListElement,
    React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.List>
  >(BaseNavigationMenu.List, 'pui-navigation-list'),
  Item: /* @__PURE__ */ part<
    HTMLLIElement,
    React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Item>
  >(BaseNavigationMenu.Item, 'pui-navigation-item'),
  Link: /* @__PURE__ */ part<
    HTMLAnchorElement,
    React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Link>
  >(BaseNavigationMenu.Link, 'pui-navigation-link'),
  Content: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Content>
  >(BaseNavigationMenu.Content, 'pui-navigation-content'),
  Positioner: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Positioner>
  >(BaseNavigationMenu.Positioner, 'pui-positioner pui-navigation-positioner', {
    portal: true,
  }),
  Popup: /* @__PURE__ */ part<
    HTMLElement,
    React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Popup>
  >(BaseNavigationMenu.Popup, 'pui-navigation-popup', { portal: true }),
  Viewport: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Viewport>
  >(BaseNavigationMenu.Viewport, 'pui-navigation-viewport'),
  Icon: /* @__PURE__ */ React.forwardRef<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Icon>
  >(function NavigationMenuIcon({ children, className, ...props }, ref) {
    return (
      <BaseNavigationMenu.Icon
        {...props}
        ref={ref}
        className={skin('pui-navigation-icon', className)}
      >
        {children ?? <Icon name='chevron-down' />}
      </BaseNavigationMenu.Icon>
    )
  }),
}

// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Arrow: NavigationMenuArrow,
  Backdrop: NavigationMenuBackdrop,
  Content: NavigationMenuContent,
  Icon: NavigationMenuIcon,
  Item: NavigationMenuItem,
  Link: NavigationMenuLink,
  List: NavigationMenuList,
  Popup: NavigationMenuPopup,
  Portal: NavigationMenuPortal,
  Positioner: NavigationMenuPositioner,
  Root: NavigationMenuRoot,
  Trigger: NavigationMenuTrigger,
  Viewport: NavigationMenuViewport,
} = NavigationMenu
