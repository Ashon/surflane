'use client'
import * as React from 'react'
import { useComponentSize } from './sizing.js'
import { Toast as BaseToast } from '@base-ui/react/toast'
import { part, skin } from './parts.js'
import { StatusIcon, type StatusTone } from './status.js'
const ToneContext = React.createContext<StatusTone>('neutral')
export type ToastRootProps = React.ComponentPropsWithoutRef<
  typeof BaseToast.Root
> & { tone?: StatusTone }
const Root = React.forwardRef<HTMLDivElement, ToastRootProps>(function Root(
  { tone = 'neutral', className, ...props },
  ref,
) {
  return (
    <ToneContext.Provider value={tone}>
      <BaseToast.Root
        {...props}
        ref={ref}
        data-tone={tone}
        className={skin('pui-toast', className)}
      />
    </ToneContext.Provider>
  )
})
const Icon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'> & { tone?: StatusTone }
>(function Icon({ tone, children, className, ...props }, ref) {
  const inherited = React.useContext(ToneContext)
  return (
    <span
      {...props}
      ref={ref}
      aria-hidden='true'
      className={['pui-toast-icon', className].filter(Boolean).join(' ')}
    >
      {children ?? <StatusIcon tone={tone ?? inherited} />}
    </span>
  )
})
const Close = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseToast.Close>
>(function Close({ className, children, ...props }, ref) {
  return (
    <BaseToast.Close
      aria-label='Dismiss notification'
      aria-hidden={false}
      data-variant='ghost'
      data-size='icon'
      {...props}
      ref={ref}
      className={skin('pui-button pui-toast-close', className)}
    >
      {children ?? (
        <svg
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.6'
          aria-hidden='true'
        >
          <path d='m6 6 12 12M18 6 6 18' />
        </svg>
      )}
    </BaseToast.Close>
  )
})
const Action = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseToast.Action>
>(function Action({ className, ...props }, ref) {
  return (
    <BaseToast.Action
      data-variant='outline'
      data-size='sm'
      {...props}
      ref={ref}
      className={skin('pui-button pui-toast-action', className)}
    />
  )
})
export type ToastViewportProps = React.ComponentPropsWithoutRef<
  typeof BaseToast.Viewport
> & { layout?: 'stack' | 'list' | 'anchored' }
const Viewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
  function Viewport({ layout = 'stack', className, ...props }, ref) {
    const viewportRef = React.useRef<HTMLDivElement | null>(null)
    React.useLayoutEffect(() => {
      const viewport = viewportRef.current
      if (!viewport || layout !== 'stack') return
      const resize = new ResizeObserver(update)
      function update() {
        const cards = Array.from(
          viewport!.querySelectorAll<HTMLElement>(
            '.pui-toast:not([data-limited])',
          ),
        )
        const gap = parseFloat(getComputedStyle(viewport!).rowGap) || 0
        const height =
          cards.reduce((sum, card) => {
            const natural = parseFloat(
              getComputedStyle(card).getPropertyValue('--toast-height'),
            )
            return (
              sum + (Number.isFinite(natural) ? natural : card.offsetHeight)
            )
          }, 0) +
          Math.max(0, cards.length - 1) * gap
        const wasOverflow = viewport!.hasAttribute('data-stack-overflow')
        const pinned =
          viewport!.scrollTop >=
          viewport!.scrollHeight - viewport!.clientHeight - 8
        const overflowing = height + 48 > window.innerHeight
        viewport!.toggleAttribute('data-stack-overflow', overflowing)
        const value = `${height}px`
        if (viewport!.style.getPropertyValue('--toast-stack-height') !== value)
          viewport!.style.setProperty('--toast-stack-height', value)
        if (overflowing && (!wasOverflow || pinned))
          viewport!.scrollTop = viewport!.scrollHeight
      }
      function refresh() {
        resize.disconnect()
        viewport!
          .querySelectorAll<HTMLElement>('.pui-toast:not([data-limited])')
          .forEach((card) => resize.observe(card))
        update()
      }
      const mutation = new MutationObserver((records) => {
        // Natural-height variables are on roots; ignore our own viewport sizing writes.
        if (
          records.some(
            (record) =>
              record.target !== viewport ||
              record.attributeName === 'data-expanded',
          )
        )
          refresh()
      })
      mutation.observe(viewport, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-limited', 'data-expanded', 'style'],
      })
      refresh()
      window.addEventListener('resize', update)
      return () => {
        window.removeEventListener('resize', update)
        viewport.removeAttribute('data-stack-overflow')
        resize.disconnect()
        mutation.disconnect()
      }
    }, [layout])
    const scheme = useComponentSize()
    return (
      <BaseToast.Viewport
        {...props}
        ref={(element) => {
          viewportRef.current = element
          if (typeof ref === 'function') ref(element)
          else if (ref) ref.current = element
        }}
        data-layout={layout}
        data-ui-size={scheme}
        className={skin('pui-toast-viewport', className)}
      />
    )
  },
)
export const Toast = {
  ...BaseToast,
  Root,
  Icon,
  Close,
  Action,
  Viewport,
  Content: part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseToast.Content>
  >(BaseToast.Content, 'pui-toast-content'),
  Title: part<
    React.ComponentRef<typeof BaseToast.Title>,
    React.ComponentPropsWithoutRef<typeof BaseToast.Title>
  >(BaseToast.Title, 'pui-toast-title'),
  Description: part<
    React.ComponentRef<typeof BaseToast.Description>,
    React.ComponentPropsWithoutRef<typeof BaseToast.Description>
  >(BaseToast.Description, 'pui-toast-description'),
  Text: part<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
    'div',
    'pui-toast-text',
  ),
  Positioner: part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseToast.Positioner>
  >(BaseToast.Positioner, 'pui-positioner'),
}

// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Action: ToastAction,
  Arrow: ToastArrow,
  Close: ToastClose,
  Content: ToastContent,
  Description: ToastDescription,
  Portal: ToastPortal,
  Positioner: ToastPositioner,
  Provider: ToastProvider,
  Root: ToastRoot,
  Title: ToastTitle,
  Viewport: ToastViewport,
  Icon: ToastIcon,
  Text: ToastText,
} = Toast
