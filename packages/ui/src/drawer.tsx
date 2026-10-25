'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { useDialogFocusBoundary } from './dialog-focus.js'
import { skin, usePortalDirection } from './parts.js'
import { useComponentSize, normalizeSize } from './sizing.js'
import { Drawer as BaseDrawer } from '@base-ui/react/drawer'
import {
  Body,
  Footer,
  Header,
  type PanelOptions,
  type PanelSide,
} from './panel.js'

const DrawerSide = /* @__PURE__ */ React.createContext({
  side: 'bottom' as PanelSide,
  modal: true as boolean | 'trap-focus',
})
function DrawerRoot({
  side = 'bottom',
  modal = true,
  ...props
}: Omit<React.ComponentProps<typeof BaseDrawer.Root>, 'swipeDirection'> & {
  side?: PanelSide
}) {
  const direction = {
    left: 'left',
    right: 'right',
    top: 'up',
    bottom: 'down',
  } as const
  return (
    <DrawerSide.Provider value={{ side, modal }}>
      <BaseDrawer.Root
        {...props}
        modal={modal}
        swipeDirection={direction[side]}
      />
    </DrawerSide.Provider>
  )
}
const DrawerContent = function DrawerContent({
  size,
  flush,
  closeLabel = 'Close panel',
  focusBoundaryLabel = 'Continue panel navigation',
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseDrawer.Popup> &
  PanelOptions & {
    /** Names the focus guards at the panel's edges, which VoiceOver reaches past
     * the last control, as Dialog's do. */
    focusBoundaryLabel?: string
  } & { ref?: React.Ref<HTMLDivElement> }) {
  const scheme = useComponentSize(size)
  const dir = usePortalDirection()
  const portalRef = useDialogFocusBoundary(focusBoundaryLabel)
  const { side, modal } = React.useContext(DrawerSide)
  const KeyboardProvider =
    side === 'bottom' ? BaseDrawer.VirtualKeyboardProvider : React.Fragment
  return (
    <KeyboardProvider>
      <BaseDrawer.Portal ref={portalRef}>
        <div className='surf-panel-layer' data-ui-size={scheme}>
          {modal === true && (
            <BaseDrawer.Backdrop className='surf-panel-backdrop' />
          )}
          <BaseDrawer.Viewport
            className='surf-panel-viewport'
            data-side={side}
            data-flush={flush || undefined}
          >
            <BaseDrawer.Popup
              dir={dir}
              {...props}
              ref={ref}
              className={skin('surf-panel surf-drawer', className)}
              data-side={side}
              data-size={normalizeSize(size) ?? 'large'}
              data-flush={flush || undefined}
            >
              <div className='surf-drawer-handle' aria-hidden='true' />
              <BaseDrawer.Close
                className='surf-panel-close surf-icon-button'
                aria-label={closeLabel}
              >
                <Icon name='close' />
              </BaseDrawer.Close>
              <BaseDrawer.Content className='surf-panel-content'>
                {children}
              </BaseDrawer.Content>
            </BaseDrawer.Popup>
          </BaseDrawer.Viewport>
        </div>
      </BaseDrawer.Portal>
    </KeyboardProvider>
  )
}
function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof BaseDrawer.Title>) {
  return (
    <BaseDrawer.Title
      {...props}
      className={skin('surf-panel-title', className)}
    />
  )
}
function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseDrawer.Description>) {
  return (
    <BaseDrawer.Description
      {...props}
      className={skin('surf-panel-description', className)}
    />
  )
}
export const Drawer = {
  ...BaseDrawer,
  Root: DrawerRoot,
  Content: DrawerContent,
  PrimitiveContent: BaseDrawer.Content,
  Header,
  Body,
  Footer,
  Title: DrawerTitle,
  Description: DrawerDescription,
}
// Flat names for React Server Components, which cannot dot into client exports.
export { DrawerContent, DrawerDescription, DrawerRoot, DrawerTitle }
export const {
  Backdrop: DrawerBackdrop,
  Close: DrawerClose,
  Handle: DrawerHandle,
  Indent: DrawerIndent,
  IndentBackground: DrawerIndentBackground,
  Popup: DrawerPopup,
  Portal: DrawerPortal,
  Provider: DrawerProvider,
  SwipeArea: DrawerSwipeArea,
  Trigger: DrawerTrigger,
  Viewport: DrawerViewport,
  VirtualKeyboardProvider: DrawerVirtualKeyboardProvider,
  PrimitiveContent: DrawerPrimitiveContent,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
} = Drawer
export type { PanelSide } from './panel.js'
