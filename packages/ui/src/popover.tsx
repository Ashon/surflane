'use client'
import * as React from 'react'
import { part, sizeName, skin } from './parts.js'
import { useComponentSize, type ComponentSizeAlias } from './sizing.js'
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
    size?: ComponentSizeAlias
  }) {
  const scheme = useComponentSize(size)
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
        data-size={sizeName(size)}
        {...props}
        className={skin('pui-popover', className)}
      />
    </BasePopover.Positioner>
  )
}
const PopoverTitle = /* @__PURE__ */ part<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof BasePopover.Title>
>(BasePopover.Title, 'pui-popover-title')
const PopoverDescription = /* @__PURE__ */ part<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof BasePopover.Description>
>(BasePopover.Description, 'pui-popover-description')
export const Popover = {
  ...BasePopover,
  Content: PopoverContent,
  Title: PopoverTitle,
  Description: PopoverDescription,
}

// Flat names for React Server Components, which cannot dot into client exports.
export { PopoverContent, PopoverTitle, PopoverDescription }
export const {
  Arrow: PopoverArrow,
  Backdrop: PopoverBackdrop,
  Close: PopoverClose,
  Handle: PopoverHandle,
  Popup: PopoverPopup,
  Portal: PopoverPortal,
  Positioner: PopoverPositioner,
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Viewport: PopoverViewport,
} = Popover
