'use client'
import * as React from 'react'
import { useDialogFocusBoundary } from './dialog-focus.js'
import { useComponentSize, type ComponentSizeAlias } from './sizing.js'
import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog'
const cx = (...v: (string | undefined | false)[]) => v.filter(Boolean).join(' ')
/** Visible icon close action; inherits Dialog focus and dismissal behavior. */
const DialogCloseButton = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentPropsWithoutRef<typeof BaseDialog.Close>, 'children'>
>(function DialogCloseButton(
  { className, 'aria-label': label = 'Close dialog', ...props },
  ref,
) {
  return (
    <BaseDialog.Close
      {...props}
      ref={ref}
      aria-label={label}
      className={cx(
        'pui-icon-button pui-dialog-close',
        typeof className === 'string' && className,
      )}
    >
      <svg
        width='18'
        height='18'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.7'
        aria-hidden='true'
      >
        <path d='m6 6 12 12M18 6 6 18' />
      </svg>
    </BaseDialog.Close>
  )
})
const DialogContent = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Popup> & {
    closeLabel?: string
    closeDisabled?: boolean
    focusBoundaryLabel?: string
  }
>(function DialogContent(
  {
    className,
    children,
    closeLabel = 'Close dialog',
    closeDisabled,
    focusBoundaryLabel = 'Continue dialog navigation',
    ...props
  },
  ref,
) {
  const scheme = useComponentSize()
  const portalRef = useDialogFocusBoundary(focusBoundaryLabel)
  return (
    <BaseDialog.Portal ref={portalRef}>
      <BaseDialog.Backdrop className='pui-dialog-backdrop' />
      <BaseDialog.Popup
        data-ui-size={scheme}
        {...props}
        ref={ref}
        className={cx(
          'pui-dialog-popup pui-dialog-content',
          typeof className === 'string' && className,
        )}
      >
        <DialogCloseButton aria-label={closeLabel} disabled={closeDisabled} />
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  )
})
function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div {...props} className={cx('pui-dialog-header', className)} />
}
const DialogBody = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(function DialogBody({ className, ...props }, ref) {
  return (
    <div {...props} ref={ref} className={cx('pui-dialog-body', className)} />
  )
})
function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div {...props} className={cx('pui-dialog-footer', className)} />
}
export const Dialog = {
  ...BaseDialog,
  Content: DialogContent,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
  CloseButton: DialogCloseButton,
}

const AlertDialogContent = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseAlertDialog.Popup> & {
    focusBoundaryLabel?: string
  }
>(function AlertDialogContent(
  { className, focusBoundaryLabel = 'Continue dialog navigation', ...props },
  ref,
) {
  const scheme = useComponentSize()
  const portalRef = useDialogFocusBoundary(focusBoundaryLabel)
  return (
    <BaseAlertDialog.Portal ref={portalRef}>
      <BaseAlertDialog.Backdrop className='pui-dialog-backdrop' />
      <BaseAlertDialog.Popup
        data-ui-size={scheme}
        {...props}
        ref={ref}
        className={cx(
          'pui-dialog-popup pui-dialog-content pui-confirm-content',
          typeof className === 'string' && className,
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
export {
  AlertDialogContent,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseButton,
}
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
export const {
  Backdrop: DialogBackdrop,
  Close: DialogClose,
  Description: DialogDescription,
  Handle: DialogHandle,
  Popup: DialogPopup,
  Portal: DialogPortal,
  Root: DialogRoot,
  Title: DialogTitle,
  Trigger: DialogTrigger,
  Viewport: DialogViewport,
} = Dialog
