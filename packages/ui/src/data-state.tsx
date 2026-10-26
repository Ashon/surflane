'use client'
import * as React from 'react'
import { Button } from './button.js'
import { InlineMessage } from './inline-message.js'
import { Skeleton } from './skeleton.js'
import { Spinner } from './spinner.js'
import { StatusIcon } from './status.js'
import { cx } from './parts.js'
import { useLabels } from './label-context.js'

export type DataStateLabels = {
  loading: string
  refreshing: string
  error: string
  stale: string
  retry: string
  empty: string
}
const defaultLabels: DataStateLabels = {
  loading: 'Loading',
  refreshing: 'Refreshing',
  error: 'This could not load.',
  stale: 'These are the last values: they could not refresh.',
  retry: 'Retry',
  empty: 'Nothing to show yet.',
}
/** Where the data stands: ready shows the content; stale shows it under a caution. */
export type DataStateValue = 'ready' | 'loading' | 'error' | 'empty' | 'stale'
export type DataStateProps = Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'children'
> & {
  state?: DataStateValue
  /** New data is on its way: the content stays, dimmed and busy. */
  refreshing?: boolean
  /** Shows a retry action with an error or stale values. */
  onRetry?: () => void
  /** Why it failed or why it is empty, in place of the default text. */
  message?: React.ReactNode
  /** inline fits a line beside other text; block fills a card or a region; page
   * stands in for a whole page's content, centred. */
  layout?: 'inline' | 'block' | 'page'
  /** The loading placeholder's height, so the content does not move in. */
  placeholderHeight?: number | string
  /** Where focus goes when a retry takes its own button away; the DataState itself
   * by default. */
  retryFocus?: React.RefObject<HTMLElement | null>
  labels?: Partial<DataStateLabels>
  children?: React.ReactNode
}
/** The states of data around any content: loading, an error with a retry, empty,
 * stale values under a caution, and refreshing. Dashboard.Panel draws its body with
 * it. */
export const DataState = function DataState({
  state = 'ready',
  refreshing = false,
  onRetry,
  message,
  layout = 'block',
  placeholderHeight,
  retryFocus,
  labels,
  className,
  children,
  ref,
  ...props
}: DataStateProps & { ref?: React.Ref<HTMLDivElement> }) {
  const provided = useLabels<DataStateLabels>('dataState')
  const text = { ...defaultLabels, ...provided, ...labels }
  const root = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(ref, () => root.current!, [])
  const retried = React.useRef(false)
  // A retry takes its own button away when the state changes, so focus moves on
  // instead of falling to the page.
  React.useEffect(() => {
    if (!retried.current) return
    retried.current = false
    const active = document.activeElement
    if (!active || active === document.body)
      (retryFocus?.current ?? root.current)?.focus()
  }, [state, retryFocus])
  const retry =
    onRetry &&
    (() => {
      retried.current = true
      onRetry()
    })
  const inline = layout === 'inline'
  const retryButton = retry && (
    <Button variant={inline ? 'ghost' : 'outline'} size='small' onClick={retry}>
      {text.retry}
    </Button>
  )
  // The content keeps one wrapper in every state, so a layout around it never shifts.
  const content = (
    <div
      className='surf-data-state-content'
      data-refreshing={refreshing || undefined}
    >
      {children}
    </div>
  )
  const notice = (tone: 'danger' | 'caution', words: React.ReactNode) =>
    inline ? (
      <span className='surf-data-state-notice' data-tone={tone}>
        <span className='surf-data-state-icon' aria-hidden='true'>
          <StatusIcon tone={tone} />
        </span>
        <span>{words}</span>
        {retryButton}
      </span>
    ) : (
      <InlineMessage.Root tone={tone}>
        <InlineMessage.Icon />
        <InlineMessage.Content>
          <InlineMessage.Description>{words}</InlineMessage.Description>
          {retryButton && (
            <InlineMessage.Actions>{retryButton}</InlineMessage.Actions>
          )}
        </InlineMessage.Content>
      </InlineMessage.Root>
    )
  return (
    <div
      {...props}
      ref={root}
      tabIndex={-1}
      aria-busy={state === 'loading' || refreshing || undefined}
      className={cx('surf-data-state', className)}
      data-state={state}
      data-layout={layout}
    >
      {state === 'loading' ? (
        inline ? (
          <Spinner size='small' label={text.loading} />
        ) : (
          <>
            <Skeleton
              shape='block'
              style={
                placeholderHeight === undefined
                  ? undefined
                  : { blockSize: placeholderHeight }
              }
            />
            <span className='surf-feedback-sr'>{text.loading}</span>
          </>
        )
      ) : state === 'error' ? (
        notice('danger', message ?? text.error)
      ) : state === 'empty' ? (
        <p className='surf-data-state-empty'>{message ?? text.empty}</p>
      ) : state === 'stale' ? (
        <>
          {notice('caution', message ?? text.stale)}
          {content}
        </>
      ) : (
        content
      )}
      {/* Always present, so the refresh is announced when its text arrives. */}
      <span className='surf-feedback-sr' role='status'>
        {refreshing && state !== 'loading' ? text.refreshing : ''}
      </span>
    </div>
  )
}
