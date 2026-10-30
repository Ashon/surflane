'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu'
import { part, skin } from './parts.js'
import { elementPart } from './element-part.js'
import { ScrollArea } from './scroll-area.js'

const ScrollingContext = React.createContext(false)
function Root<Value>(
  props: BaseNavigationMenu.Root.Props<Value> & {
    /** scroll keeps a horizontal list on one line, scrolling sideways where its
     * links do not fit, such as page tabs on a phone, and keeps the current link in
     * view. */
    overflow?: 'scroll'
  },
) {
  const { className, orientation = 'horizontal', overflow, ...rest } = props
  const scrolling = overflow === 'scroll' && orientation === 'horizontal'
  return (
    <ScrollingContext.Provider value={scrolling}>
      <BaseNavigationMenu.Root<Value>
        {...rest}
        orientation={orientation}
        data-orientation={orientation}
        data-overflow={scrolling ? 'scroll' : undefined}
        className={skin('surf-navigation-menu', className)}
      />
    </ScrollingContext.Provider>
  )
}
const ListPart = /* @__PURE__ */ part<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.List>
>(BaseNavigationMenu.List, 'surf-navigation-list')
// The fade at a scrolling list's edge, which the current link stays clear of.
const fade = 24
/** In a scrolling menu the list sits in a ScrollArea. Its current link is brought
 * into view after layout and again whenever the list or its viewport resizes, as
 * when a web font loads and widens the links; scrolling by hand is left alone. */
const List = function NavigationMenuList(
  props: React.ComponentPropsWithoutRef<typeof ListPart> & {
    ref?: React.Ref<HTMLUListElement>
  },
) {
  const scrolling = React.useContext(ScrollingContext)
  const viewport = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const view = viewport.current
    if (!scrolling || !view) return
    const align = () => {
      const current = view.querySelector<HTMLElement>(
        "[aria-current='page'], [aria-current='location']",
      )
      if (!current) return
      const box = view.getBoundingClientRect(),
        link = current.getBoundingClientRect()
      if (link.left < box.left + fade)
        view.scrollLeft -= box.left + fade - link.left
      else if (link.right > box.right - fade)
        view.scrollLeft += link.right - (box.right - fade)
    }
    align()
    // The list itself widens when a late web font arrives, though the viewport and
    // its content box may not change size; the fonts' own event catches the rest.
    const observer = new ResizeObserver(align)
    observer.observe(view)
    if (view.firstElementChild) observer.observe(view.firstElementChild)
    const list = view.querySelector('ul')
    if (list) observer.observe(list)
    document.fonts?.addEventListener('loadingdone', align)
    return () => {
      observer.disconnect()
      document.fonts?.removeEventListener('loadingdone', align)
    }
  })
  if (!scrolling) return <ListPart {...props} />
  return (
    <ScrollArea ref={viewport} orientation='horizontal'>
      <ListPart {...props} />
    </ScrollArea>
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
  List,
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
