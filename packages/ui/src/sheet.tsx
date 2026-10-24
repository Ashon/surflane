'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { skin } from './parts.js'
import { useComponentSize, normalizeSize } from './sizing.js'
import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import {
  Body,
  Footer,
  Header,
  type PanelOptions,
  type PanelSide,
} from './panel.js'

const SheetSide = /* @__PURE__ */ React.createContext({
  side: 'right' as PanelSide,
  modal: true as boolean | 'trap-focus',
})
function SheetRoot({
  side = 'right',
  modal = true,
  ...props
}: React.ComponentProps<typeof BaseDialog.Root> & { side?: PanelSide }) {
  return (
    <SheetSide.Provider value={{ side, modal }}>
      <BaseDialog.Root {...props} modal={modal} />
    </SheetSide.Provider>
  )
}
const SheetContent = function SheetContent({
  size,
  flush,
  closeLabel = 'Close panel',
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseDialog.Popup> &
  PanelOptions & { ref?: React.Ref<HTMLDivElement> }) {
  const scheme = useComponentSize(size)
  const { side, modal } = React.useContext(SheetSide)
  return (
    <BaseDialog.Portal>
      <div className='surf-panel-layer' data-ui-size={scheme}>
        {modal === true && (
          <BaseDialog.Backdrop className='surf-panel-backdrop' />
        )}
        <div
          className='surf-panel-viewport'
          data-side={side}
          data-flush={flush || undefined}
        >
          <BaseDialog.Popup
            {...props}
            ref={ref}
            className={skin('surf-panel', className)}
            data-side={side}
            data-size={normalizeSize(size) ?? 'default'}
            data-flush={flush || undefined}
          >
            <BaseDialog.Close
              className='surf-panel-close surf-icon-button'
              aria-label={closeLabel}
            >
              <Icon name='close' />
            </BaseDialog.Close>
            {children}
          </BaseDialog.Popup>
        </div>
      </div>
    </BaseDialog.Portal>
  )
}
function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      {...props}
      className={skin('surf-panel-title', className)}
    />
  )
}
function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description
      {...props}
      className={skin('surf-panel-description', className)}
    />
  )
}
export const Sheet = {
  ...BaseDialog,
  Root: SheetRoot,
  Content: SheetContent,
  Header,
  Body,
  Footer,
  Title: SheetTitle,
  Description: SheetDescription,
}
// Flat names for React Server Components, which cannot dot into client exports.
export { SheetDescription, SheetRoot, SheetTitle, SheetContent }
export const {
  Backdrop: SheetBackdrop,
  Close: SheetClose,
  Handle: SheetHandle,
  Popup: SheetPopup,
  Portal: SheetPortal,
  Trigger: SheetTrigger,
  Viewport: SheetViewport,
  Header: SheetHeader,
  Body: SheetBody,
  Footer: SheetFooter,
} = Sheet
export type { PanelSide } from './panel.js'
