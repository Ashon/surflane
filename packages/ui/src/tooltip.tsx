'use client'
import * as React from 'react'
import { useComponentSize, type ComponentSize } from './sizing.js'
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
  /** A keyboard shortcut for the same action, such as '⌘B', set apart after the
   * label. */
  shortcut?: string
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
  // Disabling keeps the trigger mounted, so turning the tooltip on or off never
  // moves focus.
  return (
    <BaseTooltip.Root disabled={disabled}>
      <BaseTooltip.Trigger render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={8}
          className='surf-positioner surf-tooltip-positioner'
        >
          <BaseTooltip.Popup className='surf-tooltip' data-ui-size={scheme}>
            {label}
            {shortcut && (
              <kbd className='surf-tooltip-shortcut'>{shortcut}</kbd>
            )}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  )
}
