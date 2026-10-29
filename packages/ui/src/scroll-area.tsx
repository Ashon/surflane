'use client'
import * as React from 'react'
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area'
import { cx } from './parts.js'
export const ScrollArea = function ScrollArea({
  label,
  orientation = 'horizontal',
  scrollChain = 'auto',
  fade = 'both',
  style,
  rootClassName,
  rootStyle,
  tabIndex = label ? 0 : undefined,
  role = label ? 'region' : undefined,
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  label?: string
  rootClassName?: string
  rootStyle?: React.CSSProperties
  orientation?: 'horizontal' | 'vertical' | 'both'
  scrollChain?: 'auto' | 'contain'
  /** Which edges fade while they hide content, on each axis that scrolls. Turn one
   * off where something stays in place over it; a Table with stickyColumn turns its
   * inline start off itself, and one with stickyHeader its top. A page's own
   * scroller, such as an AppShell's content, sets none. */
  fade?: 'both' | 'start' | 'end' | 'none'
} & { ref?: React.Ref<HTMLDivElement> }) {
  const dragPointer = React.useRef<number | null>(null)
  const clearDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragPointer.current !== event.pointerId) return
    dragPointer.current = null
    event.currentTarget.removeAttribute('data-scroll-dragging')
  }
  return (
    <BaseScrollArea.Root
      className={cx('surf-scroll-root', rootClassName)}
      style={rootStyle}
      data-fade={fade === 'both' ? undefined : fade}
      onPointerMoveCapture={(event) => {
        if (event.pointerType === 'touch') return
        const root = event.currentTarget
        const bounds = root.getBoundingClientRect()
        root.toggleAttribute(
          'data-scroll-near-x',
          bounds.bottom - event.clientY <= 24 && event.clientY <= bounds.bottom,
        )
        root.toggleAttribute(
          'data-scroll-near-y',
          bounds.right - event.clientX <= 24 && event.clientX <= bounds.right,
        )
      }}
      onPointerLeave={(event) => {
        event.currentTarget.removeAttribute('data-scroll-near-x')
        event.currentTarget.removeAttribute('data-scroll-near-y')
      }}
      onPointerDownCapture={(event) => {
        const target = event.target as Element
        const bar = target.closest('.surf-scrollbar')
        if (event.button === 0 && bar?.parentElement === event.currentTarget) {
          dragPointer.current = event.pointerId
          event.currentTarget.setAttribute(
            'data-scroll-dragging',
            bar.getAttribute('data-orientation') ?? '',
          )
        }
      }}
      onPointerUpCapture={clearDrag}
      onPointerCancelCapture={clearDrag}
      onLostPointerCapture={clearDrag}
    >
      <BaseScrollArea.Viewport
        {...props}
        ref={ref}
        className={cx('surf-scroll-viewport', className)}
        role={role}
        aria-label={label}
        tabIndex={tabIndex}
        data-scroll-orientation={orientation}
        style={{
          overflowX: orientation === 'vertical' ? 'hidden' : 'auto',
          overflowY: orientation === 'horizontal' ? 'hidden' : 'auto',
          overscrollBehaviorX:
            orientation === 'vertical' ? 'auto' : scrollChain,
          overscrollBehaviorY:
            orientation === 'horizontal' ? 'auto' : scrollChain,
          ...style,
        }}
      >
        <BaseScrollArea.Content
          className='surf-scroll-content'
          style={orientation === 'vertical' ? { minWidth: 0 } : undefined}
        >
          {children}
        </BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      {orientation !== 'vertical' && (
        <BaseScrollArea.Scrollbar
          orientation='horizontal'
          className='surf-scrollbar'
        >
          <BaseScrollArea.Thumb className='surf-scroll-thumb' />
        </BaseScrollArea.Scrollbar>
      )}
      {orientation !== 'horizontal' && (
        <BaseScrollArea.Scrollbar
          orientation='vertical'
          className='surf-scrollbar'
        >
          <BaseScrollArea.Thumb className='surf-scroll-thumb' />
        </BaseScrollArea.Scrollbar>
      )}
      <BaseScrollArea.Corner />
    </BaseScrollArea.Root>
  )
}
