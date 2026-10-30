'use client'
import * as React from 'react'
import { useRender } from '@base-ui/react/use-render'
import { cx, skin } from './parts.js'
import { Button, type ButtonProps } from './button.js'
import { Icon } from './icon.js'
import { Tooltip } from './tooltip.js'
import { commandKey } from './platform.js'
import { useLabels } from './label-context.js'
import { SizeScope } from './sizing.js'

import {
  ShellContext,
  SidebarContext,
  type Shell,
} from './app-shell-context.js'
/** Whether the window is narrower than a width, as it changes. The server and the
 * hydrating pass say no, so the markup matches. */
function useNarrowerThan(width: number | undefined) {
  const query = width ? `(width < ${width}px)` : null
  const subscribe = React.useCallback(
    (notify: () => void) => {
      if (!query || typeof matchMedia === 'undefined') return () => {}
      const list = matchMedia(query)
      list.addEventListener('change', notify)
      return () => list.removeEventListener('change', notify)
    },
    [query],
  )
  return React.useSyncExternalStore(
    subscribe,
    () => !!query && matchMedia(query).matches,
    () => false,
  )
}
const editable = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    /^(input|textarea|select)$/i.test(target.tagName))

export type AppShellRootProps = React.ComponentPropsWithoutRef<'div'> & {
  layout?: 'header' | 'workspace'
  /** Whether the sidebar is collapsed to its rail. Pass it to control the state. */
  collapsed?: boolean
  /** The starting state when the shell controls it. */
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  /** A localStorage key that remembers the state across visits. A server-rendered
   * app reads a cookie into defaultCollapsed instead, so the first paint is right. */
  persist?: string
  /** ⌘B, or Ctrl+B, toggles the sidebar unless focus is in a text field. */
  shortcut?: boolean
  /** A window width, such as 1280, below which the sidebar starts on its rail.
   * The toggle still opens it there; above the width the shell returns to its own
   * state, and only that state is remembered. Applies when the shell controls the
   * state. */
  collapseBelow?: number
}
/** Layout only. Routing, session, theme and mobile disclosure belong to the caller;
 * the shell keeps the sidebar's collapsed state unless you control it. */
const Root = function AppShellRoot({
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  persist,
  shortcut = true,
  collapseBelow,
  layout = 'header',
  className,
  children,
  ref,
  ...props
}: AppShellRootProps & { ref?: React.Ref<HTMLDivElement> }) {
  const [own, setOwn] = React.useState(defaultCollapsed)
  // Below collapseBelow the rail is the default, and a toggle there holds only
  // until the window crosses the width again.
  const narrow = useNarrowerThan(collapseBelow)
  const [override, setOverride] = React.useState<boolean | null>(null)
  React.useLayoutEffect(() => setOverride(null), [narrow])
  const value = collapsed ?? (narrow ? (override ?? true) : own)
  const latest = React.useRef(value)
  latest.current = value
  const setCollapsed = React.useCallback(
    (next: boolean) => {
      onCollapsedChange?.(next)
      if (collapsed === undefined && narrow) {
        setOverride(next)
        return
      }
      if (collapsed === undefined) setOwn(next)
      if (persist)
        try {
          localStorage.setItem(persist, next ? 'collapsed' : 'expanded')
        } catch {}
    },
    [collapsed, onCollapsedChange, persist, narrow],
  )
  React.useLayoutEffect(() => {
    if (!persist || collapsed !== undefined) return
    try {
      const stored = localStorage.getItem(persist)
      if (stored) setOwn(stored === 'collapsed')
    } catch {}
  }, [persist, collapsed])
  React.useEffect(() => {
    if (!shortcut) return
    const toggle = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== 'b' ||
        event.altKey ||
        event.shiftKey ||
        !commandKey(event) ||
        editable(event.target)
      )
        return
      event.preventDefault()
      setCollapsed(!latest.current)
    }
    document.addEventListener('keydown', toggle)
    return () => document.removeEventListener('keydown', toggle)
  }, [shortcut, setCollapsed])
  const sidebarId = React.useId()
  const shell = React.useMemo(
    () => ({ collapsed: value, setCollapsed, sidebarId, shortcut }),
    [value, setCollapsed, sidebarId, shortcut],
  )
  return (
    <ShellContext.Provider value={shell}>
      <div
        {...props}
        ref={ref}
        data-layout={layout}
        data-sidebar={value ? 'collapsed' : 'expanded'}
        className={cx('surf-app-shell', className)}
      >
        {children}
      </div>
    </ShellContext.Provider>
  )
}
export type AppShellSidebarToggleLabels = {
  /** The button's name in each state; it is also the tooltip. */
  collapse: string
  expand: string
  /** The shortcut the tooltip shows, written as it is. By default Kbd writes the
   * platform's: ⌘B on Apple platforms, Ctrl+B elsewhere. */
  shortcut: string
}
export type AppShellSidebarToggleProps = Omit<ButtonProps, 'children'> & {
  labels?: Partial<AppShellSidebarToggleLabels>
  children?: React.ReactNode
}
/** Collapses the sidebar to its rail and back. Its tooltip names the shortcut. */
const SidebarToggle = function AppShellSidebarToggle({
  labels,
  className,
  children,
  onClick,
  ref,
  ...props
}: AppShellSidebarToggleProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const shell = React.useContext(ShellContext)
  if (!shell) throw new Error('AppShell.SidebarToggle belongs in AppShell.Root')
  const text = useLabels<{ collapse: string; expand: string }>('appShell')
  const label = shell.collapsed
    ? (labels?.expand ?? text.expand ?? 'Expand sidebar')
    : (labels?.collapse ?? text.collapse ?? 'Collapse sidebar')
  return (
    <Tooltip
      label={label}
      shortcut={shell.shortcut ? (labels?.shortcut ?? ['mod', 'b']) : undefined}
    >
      <Button
        variant='ghost'
        size='icon'
        {...props}
        ref={ref}
        aria-label={label}
        aria-expanded={!shell.collapsed}
        aria-controls={shell.sidebarId}
        className={skin('surf-app-shell-toggle', className)}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) shell.setCollapsed(!shell.collapsed)
        }}
      >
        {children ?? <Icon name='sidebar' />}
      </Button>
    </Tooltip>
  )
}
export type AppShellMenuTriggerProps = Omit<ButtonProps, 'children'> & {
  /** The button's name. Say what it opens. */
  label?: string
  children?: React.ReactNode
}
/** Opens the caller's navigation, such as a Sheet, where the sidebar is hidden: at
 * 760px and narrower it shows at the header's end, and above that it is hidden. */
const MenuTrigger = function AppShellMenuTrigger({
  label,
  className,
  children,
  ref,
  ...props
}: AppShellMenuTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const text = useLabels<{ menu: string }>('appShell')
  return (
    <Button
      variant='ghost'
      size='icon'
      {...props}
      ref={ref}
      aria-label={label ?? text.menu ?? 'Open navigation'}
      className={skin('surf-app-shell-menu-trigger', className)}
    >
      {children ?? <Icon name='menu' decorative />}
    </Button>
  )
}
const Header = function AppShellHeader({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('surf-app-shell-header', className)}
    />
  )
}
const Sidebar = function AppShellSidebar({
  className,
  id,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'aside'> & { ref?: React.Ref<HTMLElement> }) {
  const shell = React.useContext(ShellContext)
  return (
    <SidebarContext.Provider value={true}>
      <aside
        {...props}
        ref={ref}
        id={id ?? shell?.sidebarId}
        className={cx('surf-app-shell-sidebar', className)}
      />
    </SidebarContext.Provider>
  )
}
const Content = function AppShellContent({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('surf-app-shell-content', className)}
    />
  )
}
/**
 * A page's own tabs, such as a project's pages as links, first in a Page. Its controls
 * take the small size: each tab stands as far from the page's top and start as the
 * page stands from the shell, its label lines up with the page's text, and its middle
 * on the brand row's line. The space under it parts it from the page, not a line.
 */
const Bar = function AppShellBar({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <SizeScope size='small'>
      <div
        {...props}
        ref={ref}
        data-ui-size='small'
        className={cx('surf-app-shell-bar', className)}
      />
    </SizeScope>
  )
}
/**
 * The page surface inside a workspace Content. It insets from the shell on every
 * side but the sidebar's; without the sidebar, on narrow screens, it insets evenly.
 */
const Page = function AppShellPage({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('surf-app-shell-page', className)}
    />
  )
}
const Footer = function AppShellFooter({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('surf-app-shell-footer', className)}
    />
  )
}
const Label = function AppShellLabel({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'span'> & {
  ref?: React.Ref<HTMLSpanElement>
}) {
  return (
    <span
      {...props}
      ref={ref}
      className={cx('surf-app-shell-label', className)}
    />
  )
}
export type AppShellBrandProps = Omit<
  useRender.ComponentProps<'div'>,
  'ref' | 'children'
> & {
  /** The product mark, about 24px. It is decorative: the name names the brand. */
  mark?: React.ReactNode
  /** The product name, on one line. A long one truncates and keeps its text in title. */
  name: string
  /** An optional second line, such as the workspace. */
  description?: React.ReactNode
}
/** The product's mark and name. In the sidebar it is the top row, its mark centered
 * on the links' icons; in the header it sits on one line. Pass `render`, such as
 * `<a href='/' />`, to make it a link home. */
const Brand = function AppShellBrand({
  mark,
  name,
  description,
  render,
  className,
  ref,
  ...props
}: AppShellBrandProps & { ref?: React.Ref<HTMLDivElement> }) {
  return useRender({
    defaultTagName: 'div',
    render,
    ref,
    props: {
      ...props,
      className: cx('surf-app-shell-brand', className),
      children: (
        <>
          {mark != null && (
            <span className='surf-app-shell-brand-mark' aria-hidden='true'>
              {mark}
            </span>
          )}
          <span className='surf-app-shell-label surf-app-shell-brand-text'>
            <span className='surf-app-shell-brand-name' title={name}>
              {name}
            </span>
            {description != null && (
              <span className='surf-app-shell-brand-description'>
                {description}
              </span>
            )}
          </span>
        </>
      ),
    },
  })
}
export type AppShellNavProps = React.ComponentPropsWithoutRef<'nav'> & {
  /** A visible name over the links, which also names the navigation. Without it,
   * name the navigation with aria-label. */
  label?: string
}
/** A list of Links with even gaps. In the workspace sidebar it lines its links up
 * with the brand and the rail. */
const Nav = function AppShellNav({
  label,
  className,
  children,
  ref,
  ...props
}: AppShellNavProps & { ref?: React.Ref<HTMLElement> }) {
  const id = React.useId()
  return (
    <nav
      aria-labelledby={label ? id : undefined}
      {...props}
      ref={ref}
      className={cx('surf-app-shell-nav', className)}
    >
      {label && (
        <span id={id} className='surf-app-shell-nav-label'>
          <Label>{label}</Label>
        </span>
      )}
      {children}
    </nav>
  )
}
export type AppShellLinkProps = Omit<
  useRender.ComponentProps<'a'>,
  'ref' | 'children'
> & {
  icon: React.ReactNode
  label: string
}
/** A destination with an icon and a name. Pass a router's link as `render` to keep
 * client navigation, or another element, such as a menu trigger for the account, to
 * give it the same row. */
const Link = function AppShellLink({
  icon,
  label,
  render,
  className,
  ref,
  ...props
}: AppShellLinkProps & { ref?: React.Ref<HTMLAnchorElement> }) {
  const shell = React.useContext(ShellContext)
  const inSidebar = React.useContext(SidebarContext)
  const element = useRender({
    defaultTagName: 'a',
    render,
    ref,
    props: {
      ...props,
      'aria-label': props['aria-label'] ?? label,
      className: cx('surf-app-shell-link', className),
      children: (
        <>
          <span className='surf-app-shell-icon' aria-hidden='true'>
            {icon}
          </span>
          <Label aria-hidden='true'>{label}</Label>
        </>
      ),
    },
  })
  // On the collapsed rail only the icon shows, so the name appears as a tooltip.
  return (
    <Tooltip label={label} disabled={!(shell?.collapsed && inSidebar)}>
      {element}
    </Tooltip>
  )
}
export const AppShell = {
  Root,
  Header,
  Sidebar,
  SidebarToggle,
  MenuTrigger,
  Brand,
  Nav,
  Content,
  Bar,
  Page,
  Footer,
  Label,
  Link,
}

// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Root: AppShellRoot,
  Header: AppShellHeader,
  Sidebar: AppShellSidebar,
  SidebarToggle: AppShellSidebarToggle,
  MenuTrigger: AppShellMenuTrigger,
  Brand: AppShellBrand,
  Nav: AppShellNav,
  Content: AppShellContent,
  Bar: AppShellBar,
  Page: AppShellPage,
  Footer: AppShellFooter,
  Label: AppShellLabel,
  Link: AppShellLink,
} = AppShell
