'use client'
import * as React from 'react'
const skin = (base: string, extra?: string) =>
  [base, extra].filter(Boolean).join(' ')
/** Layout only. Routing, session, theme and mobile disclosure belong to the caller. */
const Root = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & {
    collapsed?: boolean
    layout?: 'header' | 'workspace'
  }
>(function AppShellRoot(
  { collapsed = false, layout = 'header', className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      data-layout={layout}
      data-sidebar={collapsed ? 'collapsed' : 'expanded'}
      className={skin('pui-app-shell', className)}
    />
  )
})
const Header = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(function AppShellHeader({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={skin('pui-app-shell-header', className)}
    />
  )
})
const Sidebar = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'aside'>
>(function AppShellSidebar({ className, ...props }, ref) {
  return (
    <aside
      {...props}
      ref={ref}
      className={skin('pui-app-shell-sidebar', className)}
    />
  )
})
const Content = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(function AppShellContent({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={skin('pui-app-shell-content', className)}
    />
  )
})
/**
 * The page surface inside a workspace Content. It insets from the shell on every
 * side but the sidebar's; without the sidebar, on narrow screens, it insets evenly.
 */
const Page = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(function AppShellPage({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={skin('pui-app-shell-page', className)}
    />
  )
})
const Footer = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(function AppShellFooter({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={skin('pui-app-shell-footer', className)}
    />
  )
})
const Label = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(function AppShellLabel({ className, ...props }, ref) {
  return (
    <span
      {...props}
      ref={ref}
      className={skin('pui-app-shell-label', className)}
    />
  )
})
const Link = React.forwardRef<
  HTMLAnchorElement,
  Omit<React.ComponentPropsWithoutRef<'a'>, 'children'> & {
    icon: React.ReactNode
    label: string
  }
>(function AppShellLink({ icon, label, className, ...props }, ref) {
  return (
    <a
      {...props}
      ref={ref}
      aria-label={props['aria-label'] ?? label}
      className={skin('pui-app-shell-link', className)}
    >
      <span className='pui-app-shell-icon' aria-hidden='true'>
        {icon}
      </span>
      <Label aria-hidden='true'>{label}</Label>
    </a>
  )
})
export const AppShell = {
  Root,
  Header,
  Sidebar,
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
  Content: AppShellContent,
  Page: AppShellPage,
  Footer: AppShellFooter,
  Label: AppShellLabel,
  Link: AppShellLink,
} = AppShell
