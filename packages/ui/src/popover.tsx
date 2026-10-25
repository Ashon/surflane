'use client'
import * as React from 'react'
import { OwnPortal, part, scopedPortal, skin } from './parts.js'
import { useComponentSize, type ComponentSize } from './sizing.js'
import { Popover as BasePopover } from '@base-ui/react/popover'
function PopoverContent({
  size,
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
  > & {
    /** Width and density: small 240px, default 320px, large 480px. Unset, the
     * popover keeps the default width and takes the surrounding density. */
    size?: ComponentSize
  }) {
  const scheme = useComponentSize(size)
  return (
    <OwnPortal portal={BasePopover.Portal}>
      <BasePopover.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className='surf-positioner'
      >
        <BasePopover.Popup
          data-ui-size={scheme}
          data-size={size}
          {...props}
          className={skin('surf-popover', className)}
        />
      </BasePopover.Positioner>
    </OwnPortal>
  )
}
const PopoverTitle = /* @__PURE__ */ part<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof BasePopover.Title>
>(BasePopover.Title, 'surf-popover-title')
const PopoverDescription = /* @__PURE__ */ part<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof BasePopover.Description>
>(BasePopover.Description, 'surf-popover-description')
/** Content brings its own portal; Portal stays for wrapping it, or raw parts. */
const PopoverPortal = /* @__PURE__ */ scopedPortal(BasePopover.Portal)
export const Popover = {
  ...BasePopover,
  Portal: PopoverPortal,
  Content: PopoverContent,
  Title: PopoverTitle,
  Description: PopoverDescription,
}

// Flat names for React Server Components, which cannot dot into client exports.
export { PopoverContent, PopoverTitle, PopoverDescription, PopoverPortal }
export const {
  Arrow: PopoverArrow,
  Backdrop: PopoverBackdrop,
  Close: PopoverClose,
  Handle: PopoverHandle,
  Popup: PopoverPopup,
  Positioner: PopoverPositioner,
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Viewport: PopoverViewport,
} = Popover
