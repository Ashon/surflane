'use client'
import * as React from 'react'
import { cx, skin } from './parts.js'
import { Button, type ButtonProps } from './button.js'
import { Icon } from './icon.js'
import { Tooltip } from './tooltip.js'

type Shell = {
  collapsed: boolean
  setCollapsed: (next: boolean) => void
  sidebarId: string
  shortcut: boolean
}
const ShellContext = /* @__PURE__ */ React.createContext<Shell | null>(null)
const SidebarContext = /* @__PURE__ */ React.createContext(false)
const editable = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    /^(input|textarea|select)$/i.test(target.tagName))
const apple = () =>
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
/** The sidebar shortcut as this platform writes it. */
const shortcutLabel = () => (apple() ? '⌘B' : 'Ctrl+B')

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
}
/** Layout only. Routing, session, theme and mobile disclosure belong to the caller;
 * the shell keeps the sidebar's collapsed state unless you control it. */
const Root = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  AppShellRootProps
>(function AppShellRoot(
  {
    collapsed,
    defaultCollapsed = false,
    onCollapsedChange,
    persist,
    shortcut = true,
    layout = 'header',
    className,
    children,
    ...props
  },
  ref,
) {
  const [own, setOwn] = React.useState(defaultCollapsed)
  const value = collapsed ?? own
  const latest = React.useRef(value)
  latest.current = value
  const setCollapsed = React.useCallback(
    (next: boolean) => {
      if (collapsed === undefined) setOwn(next)
      onCollapsedChange?.(next)
      if (persist)
        try {
          localStorage.setItem(persist, next ? 'collapsed' : 'expanded')
        } catch {}
    },
    [collapsed, onCollapsedChange, persist],
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
        !(apple() ? event.metaKey : event.ctrlKey) ||
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
        className={cx('pui-app-shell', className)}
      >
        {children}
      </div>
    </ShellContext.Provider>
  )
})
export type AppShellSidebarToggleLabels = {
  /** The button's name in each state; it is also the tooltip. */
  collapse: string
  expand: string
  /** The shortcut the tooltip shows; ⌘B on Apple platforms, Ctrl+B elsewhere. */
  shortcut: string
}
export type AppShellSidebarToggleProps = Omit<ButtonProps, 'children'> & {
  labels?: Partial<AppShellSidebarToggleLabels>
  children?: React.ReactNode
}
/** Collapses the sidebar to its rail and back. Its tooltip names the shortcut. */
const SidebarToggle = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  AppShellSidebarToggleProps
>(function AppShellSidebarToggle(
  { labels, className, children, onClick, ...props },
  ref,
) {
  const shell = React.useContext(ShellContext)
  if (!shell) throw new Error('AppShell.SidebarToggle belongs in AppShell.Root')
  const label = shell.collapsed
    ? (labels?.expand ?? 'Expand sidebar')
    : (labels?.collapse ?? 'Collapse sidebar')
  return (
    <Tooltip
      label={label}
      shortcut={
        shell.shortcut ? (labels?.shortcut ?? shortcutLabel()) : undefined
      }
    >
      <Button
        variant='ghost'
        size='icon'
        {...props}
        ref={ref}
        aria-label={label}
        aria-expanded={!shell.collapsed}
        aria-controls={shell.sidebarId}
        className={skin('pui-app-shell-toggle', className)}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) shell.setCollapsed(!shell.collapsed)
        }}
      >
        {children ?? <Icon name='sidebar' />}
      </Button>
    </Tooltip>
  )
})
const Header = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(function AppShellHeader({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('pui-app-shell-header', className)}
    />
  )
})
const Sidebar = /* @__PURE__ */ React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'aside'>
>(function AppShellSidebar({ className, id, ...props }, ref) {
  const shell = React.useContext(ShellContext)
  return (
    <SidebarContext.Provider value={true}>
      <aside
        {...props}
        ref={ref}
        id={id ?? shell?.sidebarId}
        className={cx('pui-app-shell-sidebar', className)}
      />
    </SidebarContext.Provider>
  )
})
const Content = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(function AppShellContent({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('pui-app-shell-content', className)}
    />
  )
})
/**
 * The page surface inside a workspace Content. It insets from the shell on every
 * side but the sidebar's; without the sidebar, on narrow screens, it insets evenly.
 */
const Page = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(function AppShellPage({ className, ...props }, ref) {
  return (
    <div {...props} ref={ref} className={cx('pui-app-shell-page', className)} />
  )
})
const Footer = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(function AppShellFooter({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('pui-app-shell-footer', className)}
    />
  )
})
const Label = /* @__PURE__ */ React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(function AppShellLabel({ className, ...props }, ref) {
  return (
    <span
      {...props}
      ref={ref}
      className={cx('pui-app-shell-label', className)}
    />
  )
})
const Link = /* @__PURE__ */ React.forwardRef<
  HTMLAnchorElement,
  Omit<React.ComponentPropsWithoutRef<'a'>, 'children'> & {
    icon: React.ReactNode
    label: string
  }
>(function AppShellLink({ icon, label, className, ...props }, ref) {
  const shell = React.useContext(ShellContext)
  const inSidebar = React.useContext(SidebarContext)
  // On the collapsed rail only the icon shows, so the name appears as a tooltip.
  return (
    <Tooltip label={label} disabled={!(shell?.collapsed && inSidebar)}>
      <a
        {...props}
        ref={ref}
        aria-label={props['aria-label'] ?? label}
        className={cx('pui-app-shell-link', className)}
      >
        <span className='pui-app-shell-icon' aria-hidden='true'>
          {icon}
        </span>
        <Label aria-hidden='true'>{label}</Label>
      </a>
    </Tooltip>
  )
})
export const AppShell = {
  Root,
  Header,
  Sidebar,
  SidebarToggle,
  Content,
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
  Content: AppShellContent,
  Page: AppShellPage,
  Footer: AppShellFooter,
  Label: AppShellLabel,
  Link: AppShellLink,
} = AppShell
