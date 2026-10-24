'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { useComponentSize } from './sizing.js'
import {
  Toast as BaseToast,
  type ToastManager,
  type ToastManagerAddOptions,
  type ToastManagerUpdateOptions,
} from '@base-ui/react/toast'
import { part, skin, cx } from './parts.js'
import { StatusIcon, type StatusTone } from './status.js'
const ToneContext = /* @__PURE__ */ React.createContext<StatusTone>('neutral')
export type ToastRootProps = React.ComponentPropsWithoutRef<
  typeof BaseToast.Root
> & { tone?: StatusTone }
const Root = function Root({
  tone = 'neutral',
  className,
  ref,
  ...props
}: ToastRootProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <ToneContext.Provider value={tone}>
      <BaseToast.Root
        {...props}
        ref={ref}
        data-tone={tone}
        className={skin('surf-toast', className)}
      />
    </ToneContext.Provider>
  )
}
const ToneIcon = function ToastIcon({
  tone,
  children,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'span'> & { tone?: StatusTone } & {
  ref?: React.Ref<HTMLSpanElement>
}) {
  const inherited = React.useContext(ToneContext)
  return (
    <span
      {...props}
      ref={ref}
      aria-hidden='true'
      className={cx('surf-toast-icon', className)}
    >
      {children ?? <StatusIcon tone={tone ?? inherited} />}
    </span>
  )
}
const Close = function Close({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseToast.Close> & {
  ref?: React.Ref<HTMLButtonElement>
}) {
  return (
    <BaseToast.Close
      aria-label='Dismiss notification'
      aria-hidden={false}
      data-variant='ghost'
      data-size='icon-small'
      data-ui-size='small'
      {...props}
      ref={ref}
      className={skin('surf-button surf-toast-close', className)}
    >
      {children ?? <Icon name='close' />}
    </BaseToast.Close>
  )
}
const Action = function Action({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseToast.Action> & {
  ref?: React.Ref<HTMLButtonElement>
}) {
  return (
    <BaseToast.Action
      data-variant='outline'
      data-size='small'
      data-ui-size='small'
      {...props}
      ref={ref}
      className={skin('surf-button surf-toast-action', className)}
    />
  )
}
export type ToastViewportProps = React.ComponentPropsWithoutRef<
  typeof BaseToast.Viewport
> & { layout?: 'stack' | 'list' | 'anchored' }
const Viewport = function Viewport({
  layout = 'stack',
  className,
  ref,
  ...props
}: ToastViewportProps & { ref?: React.Ref<HTMLDivElement> }) {
  const viewportRef = React.useRef<HTMLDivElement | null>(null)
  React.useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || layout !== 'stack') return
    const resize = new ResizeObserver(update)
    function update() {
      const cards = Array.from(
        viewport!.querySelectorAll<HTMLElement>(
          '.surf-toast:not([data-limited])',
        ),
      )
      const gap = parseFloat(getComputedStyle(viewport!).rowGap) || 0
      const height =
        cards.reduce((sum, card) => {
          const natural = parseFloat(
            getComputedStyle(card).getPropertyValue('--toast-height'),
          )
          return sum + (Number.isFinite(natural) ? natural : card.offsetHeight)
        }, 0) +
        Math.max(0, cards.length - 1) * gap
      const wasOverflow = viewport!.hasAttribute('data-stack-overflow')
      const pinned =
        viewport!.scrollTop >=
        viewport!.scrollHeight - viewport!.clientHeight - 8
      const overflowing = height + 48 > window.innerHeight
      viewport!.toggleAttribute('data-stack-overflow', overflowing)
      const value = `${height}px`
      if (
        viewport!.style.getPropertyValue('--surf-toast-stack-height') !== value
      )
        viewport!.style.setProperty('--surf-toast-stack-height', value)
      if (overflowing && (!wasOverflow || pinned))
        viewport!.scrollTop = viewport!.scrollHeight
    }
    function refresh() {
      resize.disconnect()
      viewport!
        .querySelectorAll<HTMLElement>('.surf-toast:not([data-limited])')
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
      className={skin('surf-toast-viewport', className)}
    />
  )
}
export const Toast = {
  ...BaseToast,
  Root,
  Icon: ToneIcon,
  Close,
  Action,
  Viewport,
  Content: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseToast.Content>
  >(BaseToast.Content, 'surf-toast-content'),
  Title: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseToast.Title>,
    React.ComponentPropsWithoutRef<typeof BaseToast.Title>
  >(BaseToast.Title, 'surf-toast-title'),
  Description: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseToast.Description>,
    React.ComponentPropsWithoutRef<typeof BaseToast.Description>
  >(BaseToast.Description, 'surf-toast-description'),
  Text: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'surf-toast-text'),
  Positioner: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseToast.Positioner>
  >(BaseToast.Positioner, 'surf-positioner', { portal: true }),
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

/** What a toast() call takes besides its title. */
export type ToastOptions = Omit<
  ToastManagerAddOptions<object>,
  'title' | 'type'
> & {
  /** A button in the toast, such as Undo. Shorthand for actionProps. */
  action?: { label: React.ReactNode; onClick: () => void }
}
/** A promise step or an update: the options, with the title among them. */
export type ToastStep = ToastOptions & { title?: React.ReactNode }
type PromiseStep<Value> =
  React.ReactNode | ToastStep | ((value: Value) => React.ReactNode | ToastStep)
export type ToastHelper = {
  /** A neutral toast. Returns its ID, which update and dismiss take. */
  (title: React.ReactNode, options?: ToastOptions): string
  info: (title: React.ReactNode, options?: ToastOptions) => string
  success: (title: React.ReactNode, options?: ToastOptions) => string
  warning: (title: React.ReactNode, options?: ToastOptions) => string
  error: (title: React.ReactNode, options?: ToastOptions) => string
  /** Stays until updated or dismissed. */
  loading: (title: React.ReactNode, options?: ToastOptions) => string
  /** A loading toast that turns into success or error when the promise settles. */
  promise: <Value>(
    promise: Promise<Value>,
    steps: {
      loading: React.ReactNode | ToastStep
      success: PromiseStep<Value>
      error: PromiseStep<unknown>
    },
  ) => Promise<Value>
  update: (id: string, options: ToastStep) => void
  /** Closes one toast, or every toast without an ID. */
  dismiss: (id?: string) => void
  /** The Base UI manager the Toaster reads. */
  manager: ToastManager
}

// Event names, as other toast libraries call them, and the tones they show.
const tones: Record<string, StatusTone> = {
  info: 'info',
  success: 'success',
  warning: 'caution',
  caution: 'caution',
  error: 'danger',
  danger: 'danger',
  loading: 'progress',
  progress: 'progress',
}
const isOptions = (
  value: unknown,
): value is ToastOptions & {
  title?: React.ReactNode
} =>
  typeof value === 'object' &&
  value !== null &&
  !React.isValidElement(value) &&
  !Array.isArray(value)
function settle(
  { action, actionProps, ...rest }: ToastStep,
  type?: string,
): ToastManagerUpdateOptions<object> {
  return {
    ...rest,
    ...(type ? { type } : {}),
    actionProps: action
      ? { ...actionProps, children: action.label, onClick: action.onClick }
      : actionProps,
  }
}
const step = (value: unknown, type: string, timeout?: number) =>
  settle(
    isOptions(value)
      ? { ...(timeout === undefined ? {} : { timeout }), ...value }
      : {
          title: value as React.ReactNode,
          ...(timeout === undefined ? {} : { timeout }),
        },
    type,
  )

/** A toast helper with a manager of its own. Use the shared `toast` unless a region
 * needs separate notifications. */
export function createToaster(): ToastHelper {
  const manager = BaseToast.createToastManager()
  const add =
    (type?: string, timeout?: number) =>
    (title: React.ReactNode, options: ToastOptions = {}) =>
      manager.add({
        ...(timeout === undefined ? {} : { timeout }),
        ...settle(options, type),
        title,
      })
  return Object.assign(add(), {
    info: add('info'),
    success: add('success'),
    warning: add('warning'),
    error: add('error'),
    loading: add('loading', 0),
    promise: <Value,>(
      promise: Promise<Value>,
      steps: {
        loading: React.ReactNode | ToastStep
        success: PromiseStep<Value>
        error: PromiseStep<unknown>
      },
    ) =>
      manager.promise(promise, {
        loading: step(steps.loading, 'loading', 0),
        success: (value: Value) =>
          step(
            typeof steps.success === 'function'
              ? steps.success(value)
              : steps.success,
            'success',
          ),
        error: (error: unknown) =>
          step(
            typeof steps.error === 'function'
              ? steps.error(error)
              : steps.error,
            'error',
            0,
          ),
      }),
    update: (id: string, options: ToastStep) =>
      manager.update(id, settle(options)),
    dismiss: (id?: string) => manager.close(id),
    manager,
  })
}
/** The shared toast helper: call toast.success('Saved') anywhere, with one Toaster
 * in the app. */
export const toast: ToastHelper = /* @__PURE__ */ createToaster()

export type ToasterProps = Omit<ToastViewportProps, 'children'> & {
  /** The helper whose toasts this renders. */
  toast?: ToastHelper
  /** How many toasts stay visible; older ones wait. */
  limit?: number
  /** Milliseconds before a toast closes, unless it sets its own. */
  timeout?: number
  /** The notifications region's name. */
  label?: string
  /** Each toast's close button name. */
  closeLabel?: string
  /** Directions a toast can be swiped away in. */
  swipeDirection?: React.ComponentPropsWithoutRef<
    typeof BaseToast.Root
  >['swipeDirection']
}
function ToastList({
  swipeDirection,
  closeLabel,
}: Pick<ToasterProps, 'swipeDirection' | 'closeLabel'>) {
  const { toasts } = BaseToast.useToastManager()
  return toasts.map((item) => (
    <Root
      key={item.id}
      toast={item}
      tone={tones[item.type ?? ''] ?? 'neutral'}
      swipeDirection={swipeDirection}
    >
      <Toast.Content>
        <ToneIcon />
        <Toast.Text>
          <Toast.Title />
          <Toast.Description />
          <Action />
        </Toast.Text>
        <Close aria-label={closeLabel} />
      </Toast.Content>
    </Root>
  ))
}
/** Renders a helper's toasts: the provider, the region and each toast. Put one in the
 * app, then call toast() from anywhere. */
export function Toaster({
  toast: helper = toast,
  limit = 3,
  timeout = 5000,
  label = 'Notifications',
  closeLabel = 'Dismiss notification',
  swipeDirection,
  ...props
}: ToasterProps) {
  return (
    <BaseToast.Provider
      toastManager={helper.manager}
      limit={limit}
      timeout={timeout}
    >
      <BaseToast.Portal>
        <Viewport aria-label={label} {...props}>
          <ToastList swipeDirection={swipeDirection} closeLabel={closeLabel} />
        </Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  )
}
