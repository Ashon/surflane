'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { part, skin, cx } from './parts.js'
import { useDialogFocusBoundary } from './dialog-focus.js'
import { useComponentSize, type ComponentSize } from './sizing.js'
import { Dialog as BaseDialog } from '@base-ui/react/dialog'

/** Visible icon close action; inherits Dialog focus and dismissal behavior. */
const DialogCloseButton = function DialogCloseButton({
  className,
  'aria-label': label = 'Close dialog',
  ref,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof BaseDialog.Close>, 'children'> & {
  ref?: React.Ref<HTMLButtonElement>
}) {
  return (
    <BaseDialog.Close
      {...props}
      ref={ref}
      aria-label={label}
      className={skin('surf-icon-button surf-dialog-close', className)}
    >
      <Icon name='close' />
    </BaseDialog.Close>
  )
}
const DialogContent = function DialogContent({
  size,
  className,
  children,
  closeLabel = 'Close dialog',
  closeDisabled,
  focusBoundaryLabel = 'Continue dialog navigation',
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseDialog.Popup> & {
  /** Width and density: small 420px, default 640px, large 840px. */
  size?: ComponentSize
  closeLabel?: string
  closeDisabled?: boolean
  focusBoundaryLabel?: string
} & { ref?: React.Ref<HTMLDivElement> }) {
  const scheme = useComponentSize(size)
  const portalRef = useDialogFocusBoundary(focusBoundaryLabel)
  return (
    <BaseDialog.Portal ref={portalRef}>
      <BaseDialog.Backdrop className='surf-dialog-backdrop' />
      <BaseDialog.Popup
        data-ui-size={scheme}
        data-size={size}
        {...props}
        ref={ref}
        className={skin('surf-dialog-popup surf-dialog-content', className)}
      >
        <DialogCloseButton aria-label={closeLabel} disabled={closeDisabled} />
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  )
}
function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div {...props} className={cx('surf-dialog-header', className)} />
}
const DialogBody = function DialogBody({
  className,
  ref,
  ...props
}: React.ComponentProps<'div'> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div {...props} ref={ref} className={cx('surf-dialog-body', className)} />
  )
}
function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div {...props} className={cx('surf-dialog-footer', className)} />
}
const DialogTitle = /* @__PURE__ */ part<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Title>
>(BaseDialog.Title, 'surf-dialog-title')
const DialogDescription = /* @__PURE__ */ part<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Description>
>(BaseDialog.Description, 'surf-dialog-description')
export const Dialog = {
  ...BaseDialog,
  Content: DialogContent,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
  CloseButton: DialogCloseButton,
  Title: DialogTitle,
  Description: DialogDescription,
}
// Flat names for React Server Components, which cannot dot into client exports.
export {
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseButton,
  DialogTitle,
  DialogDescription,
}
export const {
  Backdrop: DialogBackdrop,
  Close: DialogClose,
  Handle: DialogHandle,
  Popup: DialogPopup,
  Portal: DialogPortal,
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Viewport: DialogViewport,
} = Dialog
