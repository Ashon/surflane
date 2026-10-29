'use client'
import * as React from 'react'
import { part, skin, usePortalDirection } from './parts.js'
import { useDialogFocusBoundary } from './dialog-focus.js'
import { useLabels } from './label-context.js'
import { SizeScope, useComponentSize, type ComponentSize } from './sizing.js'
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog'
import { DialogFooter, DialogHeader } from './dialog.js'

const AlertDialogContent = function AlertDialogContent({
  size,
  className,
  focusBoundaryLabel,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Popup> & {
  /** Width and density; an alert dialog is small unless set. */
  size?: ComponentSize
  focusBoundaryLabel?: string
} & { ref?: React.Ref<HTMLDivElement> }) {
  const scheme = useComponentSize(size)
  const text = useLabels<{ focusBoundary: string }>('dialog')
  const portalRef = useDialogFocusBoundary(
    focusBoundaryLabel ?? text.focusBoundary ?? 'Continue dialog navigation',
  )
  const dir = usePortalDirection()
  return (
    // A portal keeps React context, so the overlay gives its own size to what it
    // holds: a large one opened from a small card draws large controls.
    <SizeScope size={scheme}>
      <BaseAlertDialog.Portal ref={portalRef}>
        <BaseAlertDialog.Backdrop className='surf-dialog-backdrop' />
        <BaseAlertDialog.Popup
          dir={dir}
          data-ui-size={scheme}
          data-size={size}
          {...props}
          ref={ref}
          className={skin(
            'surf-dialog-popup surf-dialog-content surf-confirm-content',
            className,
          )}
        />
      </BaseAlertDialog.Portal>
    </SizeScope>
  )
}
const AlertDialogTitle = /* @__PURE__ */ part<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Title>
>(BaseAlertDialog.Title, 'surf-dialog-title')
const AlertDialogDescription = /* @__PURE__ */ part<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Description>
>(BaseAlertDialog.Description, 'surf-dialog-description')
export const AlertDialog = {
  ...BaseAlertDialog,
  Content: AlertDialogContent,
  Header: DialogHeader,
  Footer: DialogFooter,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
}
// Flat names for React Server Components, which cannot dot into client exports.
export { AlertDialogContent, AlertDialogTitle, AlertDialogDescription }
export const {
  Backdrop: AlertDialogBackdrop,
  Close: AlertDialogClose,
  Handle: AlertDialogHandle,
  Popup: AlertDialogPopup,
  Portal: AlertDialogPortal,
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
  Viewport: AlertDialogViewport,
  Header: AlertDialogHeader,
  Footer: AlertDialogFooter,
} = AlertDialog
