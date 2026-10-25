'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu'
import { part, skin } from './parts.js'
import { elementPart } from './element-part.js'
function Root<Value>(props: BaseNavigationMenu.Root.Props<Value>) {
  const { className, orientation = 'horizontal', ...rest } = props
  return (
    <BaseNavigationMenu.Root<Value>
      {...rest}
      orientation={orientation}
      data-orientation={orientation}
      className={skin('surf-navigation-menu', className)}
    />
  )
}
const Trigger = function Trigger({
  className,
  children,
  indicator,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Trigger> & {
  indicator?: React.ReactNode
} & { ref?: React.Ref<HTMLButtonElement> }) {
  return (
    <BaseNavigationMenu.Trigger
      data-variant='ghost'
      {...props}
      ref={ref}
      className={skin('surf-button surf-navigation-trigger', className)}
    >
      {children}
      {indicator === false
        ? null
        : (indicator ?? (
            <BaseNavigationMenu.Icon className='surf-navigation-icon'>
              <Icon name='chevron-down' />
            </BaseNavigationMenu.Icon>
          ))}
    </BaseNavigationMenu.Trigger>
  )
}
export const NavigationMenu = {
  ...BaseNavigationMenu,
  Root,
  Trigger,
  List: /* @__PURE__ */ part<
    HTMLUListElement,
    React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.List>
  >(BaseNavigationMenu.List, 'surf-navigation-list'),
  Item: /* @__PURE__ */ part<
    HTMLLIElement,
    React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Item>
  >(BaseNavigationMenu.Item, 'surf-navigation-item'),
  Link: /* @__PURE__ */ part<
    HTMLAnchorElement,
    React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Link>
  >(BaseNavigationMenu.Link, 'surf-navigation-link'),
  /** A destination's name, on its own line inside a Link. */
  LinkTitle: /* @__PURE__ */ elementPart<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<'span'>
  >('span', 'surf-navigation-link-title'),
  /** A line under the title that says what is there. */
  LinkDescription: /* @__PURE__ */ elementPart<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<'span'>
  >('span', 'surf-navigation-link-description'),
  Content: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Content>
  >(BaseNavigationMenu.Content, 'surf-navigation-content'),
  Positioner: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Positioner>
  >(
    BaseNavigationMenu.Positioner,
    'surf-positioner surf-navigation-positioner',
    {
      portal: true,
    },
  ),
  Popup: /* @__PURE__ */ part<
    HTMLElement,
    React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Popup>
  >(BaseNavigationMenu.Popup, 'surf-navigation-popup', { portal: true }),
  Viewport: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Viewport>
  >(BaseNavigationMenu.Viewport, 'surf-navigation-viewport'),
  Icon: function NavigationMenuIcon({
    children,
    className,
    ref,
    ...props
  }: React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Icon> & {
    ref?: React.Ref<HTMLSpanElement>
  }) {
    return (
      <BaseNavigationMenu.Icon
        {...props}
        ref={ref}
        className={skin('surf-navigation-icon', className)}
      >
        {children ?? <Icon name='chevron-down' />}
      </BaseNavigationMenu.Icon>
    )
  },
}

// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Arrow: NavigationMenuArrow,
  Backdrop: NavigationMenuBackdrop,
  Content: NavigationMenuContent,
  Icon: NavigationMenuIcon,
  Item: NavigationMenuItem,
  Link: NavigationMenuLink,
  LinkDescription: NavigationMenuLinkDescription,
  LinkTitle: NavigationMenuLinkTitle,
  List: NavigationMenuList,
  Popup: NavigationMenuPopup,
  Portal: NavigationMenuPortal,
  Positioner: NavigationMenuPositioner,
  Root: NavigationMenuRoot,
  Trigger: NavigationMenuTrigger,
  Viewport: NavigationMenuViewport,
} = NavigationMenu
