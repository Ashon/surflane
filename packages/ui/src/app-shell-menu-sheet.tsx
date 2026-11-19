'use client'
import * as React from 'react'
import { Button } from './button.js'
import { useLabels } from './label-context.js'
import { cx } from './parts.js'
import { Sheet } from './sheet.js'
import { ShellContext } from './app-shell-context.js'
import {
  MenuTrigger,
  appShellNarrowWidth,
  useNarrowerThan,
} from './app-shell-menu-trigger.js'

// A flat export, not a part of the AppShell namespace: a shell that never renders it
// does not bring in Sheet.
const current = (root: Element | null | undefined) =>
  root?.querySelector<HTMLElement>('[aria-current="page"]') ?? null

export type AppShellMenuSheetProps = {
  /** Names the sheet: say what it navigates, such as Workspace navigation. */
  title: React.ReactNode
  description?: React.ReactNode
  /** The navigation: an AppShell.Nav of Links, as the sidebar holds. */
  children: React.ReactNode
  /** Rows under the navigation, such as the account Link, stacked over Close. */
  footer?: React.ReactNode
  /** The menu button's name. Say what it opens. */
  triggerLabel?: string
  /** The close (X) button's name, such as Close workspace navigation. The Close
   * button under the navigation says the appShell closeMenu label, Close menu. */
  closeLabel?: string
  /** Where focus goes after a link in the sheet is chosen: the id of the new page's
   * title, or a function that finds it. Without it, focus stays where the page
   * put it. */
  returnFocus?: string | (() => HTMLElement | null)
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}
/**
 * The phone's navigation, where the sidebar hides: MenuTrigger at the header's end
 * opens a bottom sheet of the same links. The sheet opens on the current link,
 * closes after a choice and hands focus to the new page's title, and closes when
 * the window widens past appShellNarrowWidth. When the window narrows while focus
 * is in the sidebar, focus moves to the menu button.
 */
export function AppShellMenuSheet({
  title,
  description,
  children,
  footer,
  triggerLabel,
  closeLabel,
  returnFocus,
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  className,
}: AppShellMenuSheetProps) {
  const shell = React.useContext(ShellContext)
  const text = useLabels<{ closeMenu: string }>('appShell')
  const close = text.closeMenu ?? 'Close menu'
  const [own, setOwn] = React.useState(defaultOpen)
  const open = controlled ?? own
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (controlled === undefined) setOwn(next)
      onOpenChange?.(next)
    },
    [controlled, onOpenChange],
  )
  const trigger = React.useRef<HTMLButtonElement>(null),
    panel = React.useRef<HTMLDivElement>(null),
    chose = React.useRef(false)
  const narrow = useNarrowerThan(appShellNarrowWidth + 1)
  const sidebar = () =>
    shell ? document.getElementById(shell.sidebarId) : null
  // Focus last inside the sidebar, kept so a narrowing window can pass it on.
  const lastFocused = React.useRef<Element | null>(null)
  React.useEffect(() => {
    const track = (event: FocusEvent) => {
      if (event.target instanceof Element && event.target !== document.body)
        lastFocused.current = event.target
    }
    document.addEventListener('focusin', track)
    return () => document.removeEventListener('focusin', track)
  }, [])
  // Only a change of width acts, read against the width it was.
  const was = React.useRef(narrow)
  React.useEffect(() => {
    if (was.current === narrow) return
    was.current = narrow
    if (!narrow) {
      setOpen(false)
      return
    }
    const side = sidebar()
    if (
      side &&
      (side.contains(document.activeElement) ||
        side.contains(lastFocused.current))
    )
      trigger.current?.focus({ preventScroll: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [narrow])
  const target = () =>
    typeof returnFocus === 'string'
      ? document.getElementById(returnFocus)
      : (returnFocus?.() ?? null)
  return (
    <Sheet.Root
      side='bottom'
      open={open}
      onOpenChange={(next) => {
        if (next) chose.current = false
        setOpen(next)
      }}
    >
      <Sheet.Trigger
        render={<MenuTrigger ref={trigger} label={triggerLabel} />}
      />
      <Sheet.Content
        ref={panel}
        flush
        aria-modal='true'
        closeLabel={closeLabel ?? close}
        className={cx('surf-app-shell-menu-sheet', className)}
        initialFocus={() => current(panel.current) ?? true}
        finalFocus={() => {
          // Wide again: the sidebar is back, and its current link takes focus.
          if (!matchMedia(`(max-width: ${appShellNarrowWidth}px)`).matches)
            return current(sidebar()) ?? target() ?? false
          if (chose.current) return target() ?? false
          return trigger.current ?? true
        }}
      >
        <Sheet.Header>
          <Sheet.Title>{title}</Sheet.Title>
          {description != null && description !== false && (
            <Sheet.Description>{description}</Sheet.Description>
          )}
        </Sheet.Header>
        <Sheet.Body
          onClick={(event) => {
            const link = (event.target as Element).closest('a[href]')
            if (
              !link ||
              event.button ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey
            )
              return
            chose.current = true
            setOpen(false)
          }}
        >
          {children}
        </Sheet.Body>
        <Sheet.Footer stacked>
          {footer}
          <Button variant='secondary' onClick={() => setOpen(false)}>
            {close}
          </Button>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet.Root>
  )
}
