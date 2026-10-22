'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { sizeName, skin, cx } from './parts.js'
import { useDialogFocusBoundary } from './dialog-focus.js'
import { useComponentSize, type ComponentSizeAlias } from './sizing.js'
import { Dialog as BaseDialog } from '@base-ui/react/dialog'

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
      className={skin('pui-icon-button pui-dialog-close', className)}
    >
      <Icon name='close' />
    </BaseDialog.Close>
  )
})
const DialogContent = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Popup> & {
    /** Width and density: small 420px, default 640px, large 840px. */
    size?: ComponentSizeAlias
    closeLabel?: string
    closeDisabled?: boolean
    focusBoundaryLabel?: string
  }
>(function DialogContent(
  {
    size,
    className,
    children,
    closeLabel = 'Close dialog',
    closeDisabled,
    focusBoundaryLabel = 'Continue dialog navigation',
    ...props
  },
  ref,
) {
  const scheme = useComponentSize(size)
  const portalRef = useDialogFocusBoundary(focusBoundaryLabel)
  return (
    <BaseDialog.Portal ref={portalRef}>
      <BaseDialog.Backdrop className='pui-dialog-backdrop' />
      <BaseDialog.Popup
        data-ui-size={scheme}
        data-size={sizeName(size)}
        {...props}
        ref={ref}
        className={skin('pui-dialog-popup pui-dialog-content', className)}
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
// Flat names for React Server Components, which cannot dot into client exports.
export {
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseButton,
}
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
