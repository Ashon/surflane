'use client'
import * as React from 'react'
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area'
export const ScrollArea = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & {
    label?: string
    rootClassName?: string
    rootStyle?: React.CSSProperties
    orientation?: 'horizontal' | 'vertical' | 'both'
    scrollChain?: 'auto' | 'contain'
  }
>(function ScrollArea(
  {
    label,
    orientation = 'horizontal',
    scrollChain = 'auto',
    style,
    rootClassName,
    rootStyle,
    tabIndex = label ? 0 : undefined,
    role = label ? 'region' : undefined,
    className,
    children,
    ...props
  },
  ref,
) {
  const dragPointer = React.useRef<number | null>(null)
  const clearDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragPointer.current !== event.pointerId) return
    dragPointer.current = null
    event.currentTarget.removeAttribute('data-scroll-dragging')
  }
  return (
    <BaseScrollArea.Root
      className={['pui-scroll-root', rootClassName].filter(Boolean).join(' ')}
      style={rootStyle}
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
        const bar = target.closest('.pui-scrollbar')
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
        className={['pui-scroll-viewport scroll-area', className]
          .filter(Boolean)
          .join(' ')}
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
          className='pui-scroll-content'
          style={orientation === 'vertical' ? { minWidth: 0 } : undefined}
        >
          {children}
        </BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      {orientation !== 'vertical' && (
        <BaseScrollArea.Scrollbar
          orientation='horizontal'
          className='pui-scrollbar'
        >
          <BaseScrollArea.Thumb className='pui-scroll-thumb' />
        </BaseScrollArea.Scrollbar>
      )}
      {orientation !== 'horizontal' && (
        <BaseScrollArea.Scrollbar
          orientation='vertical'
          className='pui-scrollbar'
        >
          <BaseScrollArea.Thumb className='pui-scroll-thumb' />
        </BaseScrollArea.Scrollbar>
      )}
      <BaseScrollArea.Corner />
    </BaseScrollArea.Root>
  )
})
