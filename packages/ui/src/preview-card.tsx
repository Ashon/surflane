'use client'
import * as React from 'react'
import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card'
import {
  OwnPortal,
  defined,
  part,
  scopedPortal,
  skin,
  type Placement,
} from './parts.js'

const PreviewPositioner = /* @__PURE__ */ part<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BasePreviewCard.Positioner>
>(BasePreviewCard.Positioner, 'pui-positioner', { portal: true })
// The preview is visual enhancement; its destination is the accessible interface.
const PreviewPopup = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BasePreviewCard.Popup>
>(function PreviewPopup({ className, ...props }, ref) {
  return (
    <BasePreviewCard.Popup
      {...props}
      ref={ref}
      aria-hidden='true'
      className={skin('pui-preview-card', className)}
    />
  )
})
function PreviewTrigger<Payload>(
  props: BasePreviewCard.Trigger.Props<Payload> &
    React.RefAttributes<HTMLElement>,
) {
  const { className, ...rest } = props
  return (
    <BasePreviewCard.Trigger
      {...rest}
      className={skin('pui-link pui-preview-trigger', className)}
    />
  )
}
const PreviewContent = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BasePreviewCard.Popup> &
    Placement<typeof BasePreviewCard.Positioner> & {
      /** @deprecated Pass side, align, sideOffset and collisionPadding directly. */
      positionerProps?: React.ComponentPropsWithoutRef<
        typeof BasePreviewCard.Positioner
      >
    }
>(function PreviewContent(
  { side, align, sideOffset, collisionPadding, positionerProps, ...props },
  ref,
) {
  return (
    <OwnPortal portal={BasePreviewCard.Portal}>
      <PreviewPositioner
        sideOffset={8}
        collisionPadding={12}
        {...positionerProps}
        {...defined({ side, align, sideOffset, collisionPadding })}
      >
        <PreviewPopup {...props} ref={ref} />
      </PreviewPositioner>
    </OwnPortal>
  )
})
export const PreviewCard = {
  ...BasePreviewCard,
  Portal: /* @__PURE__ */ scopedPortal(BasePreviewCard.Portal),
  Trigger: PreviewTrigger,
  Positioner: PreviewPositioner,
  Popup: PreviewPopup,
  Content: PreviewContent,
}
// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Arrow: PreviewCardArrow,
  Backdrop: PreviewCardBackdrop,
  Handle: PreviewCardHandle,
  Popup: PreviewCardPopup,
  Portal: PreviewCardPortal,
  Positioner: PreviewCardPositioner,
  Root: PreviewCardRoot,
  Trigger: PreviewCardTrigger,
  Viewport: PreviewCardViewport,
  Content: PreviewCardContent,
} = PreviewCard
