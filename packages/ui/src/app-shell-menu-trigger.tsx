'use client'
import * as React from 'react'
import { Button, type ButtonProps } from './button.js'
import { Icon } from './icon.js'
import { useLabels } from './label-context.js'
import { skin } from './parts.js'

/** The widest window, in px, at which the shell hides its sidebar: from here down
 * MenuTrigger shows and AppShellMenuSheet is the navigation, as
 * `matchMedia(`(max-width: ${appShellNarrowWidth}px)`)` tells. */
export const appShellNarrowWidth = 760

/** Whether the window is narrower than a width, as it changes. The server and the
 * hydrating pass say no, so the markup matches. */
export function useNarrowerThan(width: number | undefined) {
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
export type AppShellMenuTriggerProps = Omit<ButtonProps, 'children'> & {
  /** The button's name. Say what it opens. */
  label?: string
  children?: React.ReactNode
}
/** Opens the caller's navigation, such as a Sheet, where the sidebar is hidden: at
 * appShellNarrowWidth (760px) and narrower it shows at the header's end, and above
 * that it is hidden. AppShellMenuSheet renders one of its own. */
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
export { MenuTrigger }
