'use client'
import * as React from 'react'
import { skin } from './parts.js'
import { useComponentSize, type ComponentSizeAlias } from './sizing.js'
import { Popover as BasePopover } from '@base-ui/react/popover'
function PopoverContent({
  side = 'bottom',
  align = 'start',
  sideOffset = 8,
  collisionPadding = 12,
  className,
  ...props
}: React.ComponentProps<typeof BasePopover.Popup> &
  Pick<
    React.ComponentProps<typeof BasePopover.Positioner>,
    'side' | 'align' | 'sideOffset' | 'collisionPadding'
  >) {
  const scheme = useComponentSize()
  return (
    <BasePopover.Positioner
      side={side}
      align={align}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className='pui-positioner'
    >
      <BasePopover.Popup
        data-ui-size={scheme}
        {...props}
        className={skin('pui-popover', className)}
      />
    </BasePopover.Positioner>
  )
}
export const Popover = { ...BasePopover, Content: PopoverContent }

// Flat names for React Server Components, which cannot dot into client exports.
export { PopoverContent }
export const {
  Arrow: PopoverArrow,
  Backdrop: PopoverBackdrop,
  Close: PopoverClose,
  Description: PopoverDescription,
  Handle: PopoverHandle,
  Popup: PopoverPopup,
  Portal: PopoverPortal,
  Positioner: PopoverPositioner,
  Root: PopoverRoot,
  Title: PopoverTitle,
  Trigger: PopoverTrigger,
  Viewport: PopoverViewport,
} = Popover
