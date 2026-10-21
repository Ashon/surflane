import React, { useLayoutEffect, useRef } from 'react'
import { Button, Sheet } from '@surflane/ui'
import { useMessages } from './i18n'

/** Modal bottom sheet (`navigation-sheet`, shared with the app shell example):
 * centered navigation and a thumb-accessible close action. */
export default function MobileCatalogNavigation({
  open,
  onOpenChange,
  area,
  finalFocus,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  area: string
  finalFocus: () => HTMLElement | null
  children: React.ReactNode
}) {
  const messages = useMessages()
  const panel = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (!open) return
    const viewport = panel.current?.querySelector<HTMLElement>(
      '.catalog-navigation-viewport',
    )
    const active = viewport?.querySelector<HTMLElement>(
      'a[aria-current="page"]',
    )
    if (!viewport || !active) return
    const row = active.getBoundingClientRect(),
      bounds = viewport.getBoundingClientRect()
    if (row.top < bounds.top + 16)
      viewport.scrollTop -= bounds.top + 16 - row.top
    else if (row.bottom > bounds.bottom - 16)
      viewport.scrollTop += row.bottom - bounds.bottom + 16
  }, [open, area])
  return (
    <Sheet.Root side='bottom' open={open} onOpenChange={onOpenChange}>
      <Sheet.Content
        ref={panel}
        className='catalog-mobile-navigation navigation-sheet'
        closeLabel={messages.closeCatalogNavigation}
        initialFocus={() =>
          panel.current?.querySelector<HTMLElement>('a[aria-current="page"]') ??
          panel.current
        }
        finalFocus={finalFocus}
      >
        <Sheet.Header>
          <Sheet.Title>
            {messages.areaNavigation(
              messages.areas[area as keyof typeof messages.areas],
            )}
          </Sheet.Title>
          <Sheet.Description>Choose a page in this section.</Sheet.Description>
        </Sheet.Header>
        <div className='catalog-mobile-navigation-body'>{children}</div>
        <Sheet.Footer>
          <Button variant='secondary' onClick={() => onOpenChange(false)}>
            {messages.closeMenu}
          </Button>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet.Root>
  )
}
