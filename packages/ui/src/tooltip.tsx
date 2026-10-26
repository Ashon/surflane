'use client'
import * as React from 'react'
import { useComponentSize, type ComponentSize } from './sizing.js'
import { usePortalDirection } from './parts.js'
import { Kbd, type KbdKey } from './kbd.js'
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'
export function TooltipProvider({
  delayDuration = 150,
  skipDelayDuration = 300,
  children,
}: {
  delayDuration?: number
  skipDelayDuration?: number
  children: React.ReactNode
}) {
  return (
    <BaseTooltip.Provider
      delay={delayDuration}
      closeDelay={0}
      timeout={skipDelayDuration}
    >
      {children}
    </BaseTooltip.Provider>
  )
}
export type TooltipProps = {
  /** What the trigger does, in a few words. It may hold an icon or emphasis, but
   * nothing interactive: a tooltip never takes focus. */
  label: React.ReactNode
  /** A keyboard shortcut for the same action, set apart after the label: the keys
   * as Kbd takes them, such as ['mod', 'b'], which reads ⌘B on Apple platforms and
   * Ctrl+B elsewhere. */
  shortcut?: KbdKey | readonly KbdKey[]
  /** Keeps the tooltip from opening while the trigger stays as it is. */
  disabled?: boolean
  children: React.ReactElement
} & Pick<
  React.ComponentPropsWithoutRef<typeof BaseTooltip.Positioner>,
  'side' | 'align' | 'sideOffset'
>
export function Tooltip({
  label,
  shortcut,
  disabled = false,
  side = 'right',
  align,
  sideOffset = 10,
  children,
}: TooltipProps) {
  const scheme = useComponentSize()
  const dir = usePortalDirection()
  // Disabling keeps the trigger mounted, so turning the tooltip on or off never
  // moves focus.
  return (
    <BaseTooltip.Root disabled={disabled}>
      <BaseTooltip.Trigger render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          dir={dir}
          side={side}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={8}
          className='surf-positioner surf-tooltip-positioner'
        >
          <BaseTooltip.Popup className='surf-tooltip' data-ui-size={scheme}>
            {label}
            {shortcut && shortcut.length > 0 && (
              <Kbd keys={shortcut} className='surf-tooltip-shortcut' />
            )}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  )
}
