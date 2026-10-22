'use client'
import * as React from 'react'
import { sizeName, skin } from './parts.js'
import { useDialogFocusBoundary } from './dialog-focus.js'
import { useComponentSize, type ComponentSizeAlias } from './sizing.js'
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog'
import { DialogFooter, DialogHeader } from './dialog.js'

const AlertDialogContent = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Popup> & {
    /** Width and density; an alert dialog is small unless set. */
    size?: ComponentSizeAlias
    focusBoundaryLabel?: string
  }
>(function AlertDialogContent(
  {
    size,
    className,
    focusBoundaryLabel = 'Continue dialog navigation',
    ...props
  },
  ref,
) {
  const scheme = useComponentSize(size)
  const portalRef = useDialogFocusBoundary(focusBoundaryLabel)
  return (
    <BaseAlertDialog.Portal ref={portalRef}>
      <BaseAlertDialog.Backdrop className='pui-dialog-backdrop' />
      <BaseAlertDialog.Popup
        data-ui-size={scheme}
        data-size={sizeName(size)}
        {...props}
        ref={ref}
        className={skin(
          'pui-dialog-popup pui-dialog-content pui-confirm-content',
          className,
        )}
      />
    </BaseAlertDialog.Portal>
  )
})
export const AlertDialog = {
  ...BaseAlertDialog,
  Content: AlertDialogContent,
  Header: DialogHeader,
  Footer: DialogFooter,
}
// Flat names for React Server Components, which cannot dot into client exports.
export { AlertDialogContent }
export const {
  Backdrop: AlertDialogBackdrop,
  Close: AlertDialogClose,
  Description: AlertDialogDescription,
  Handle: AlertDialogHandle,
  Popup: AlertDialogPopup,
  Portal: AlertDialogPortal,
  Root: AlertDialogRoot,
  Title: AlertDialogTitle,
  Trigger: AlertDialogTrigger,
  Viewport: AlertDialogViewport,
  Header: AlertDialogHeader,
  Footer: AlertDialogFooter,
} = AlertDialog
