'use client'
import * as React from 'react'
import { useComponentSize, type ComponentSizeAlias } from './sizing.js'
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
export function Tooltip({
  label,
  enabled = true,
  side = 'right',
  align,
  sideOffset = 10,
  children,
}: {
  label: string
  enabled?: boolean
  children: React.ReactElement
} & Pick<
  React.ComponentPropsWithoutRef<typeof BaseTooltip.Positioner>,
  'side' | 'align' | 'sideOffset'
>) {
  const scheme = useComponentSize()
  if (!enabled) return children
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={8}
          className='pui-positioner pui-tooltip-positioner'
        >
          <BaseTooltip.Popup className='pui-tooltip' data-ui-size={scheme}>
            {label}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  )
}
