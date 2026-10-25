'use client'
import * as React from 'react'
import { Button } from './button.js'
import { Card } from './card.js'
import { Icon } from './icon.js'
import { InlineMessage } from './inline-message.js'
import { Popover } from './popover.js'
import { Skeleton } from './skeleton.js'
import { Spinner } from './spinner.js'
import { cx } from './class-names.js'

export type DashboardRootProps = React.ComponentPropsWithoutRef<'div'> & {
  /** Names the dashboard as a region of the page, such as "Cluster overview". */
  label?: string
  /** The most columns a wide screen shows, so a row planned for that many keeps its
   * proportions and a span keeps its meaning. Narrower screens still fit fewer. */
  columns?: number
}
/** The panels of a dashboard on a responsive grid: as many columns as fit panels of
 * --surf-dashboard-panel-min-width (20rem), up to columns, one column on a phone. */
const Root = function DashboardRoot({
  label,
  columns,
  className,
  style,
  ref,
  ...props
}: DashboardRootProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      role={label ? 'region' : undefined}
      aria-label={label}
      {...props}
      ref={ref}
      data-columns={columns}
      style={
        columns
          ? ({
              ...style,
              '--surf-dashboard-columns': columns,
            } as React.CSSProperties)
          : style
      }
      className={cx('surf-dashboard', className)}
    />
  )
}
export type DashboardPanelLabels = {
  /** The button that shows the description, given the title. */
  about: (title: string) => string
  loading: string
  refreshing: string
  error: string
  /** Above the last values when a refresh failed. */
  stale: string
  retry: string
  empty: string
}
const panelLabels: DashboardPanelLabels = {
  about: (title) => `About ${title}`,
  loading: 'Loading',
  refreshing: 'Refreshing',
  error: 'This panel could not load.',
  stale: 'These are the last values: the panel could not refresh.',
  retry: 'Retry',
  empty: 'No data in this range.',
}
export type DashboardPanelProps = Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'title'
> & {
  title: string
  /** What the panel shows and how it is measured, behind an info button by the title. */
  description?: React.ReactNode
  /** The heading level of the title. */
  level?: 2 | 3 | 4 | 5 | 6
  /** loading shows a placeholder until the first data arrives; error and empty
   * replace the content with a message; stale keeps the last content under a caution
   * that a refresh failed, with retry. */
  state?: 'ready' | 'loading' | 'error' | 'empty' | 'stale'
  /** The loading placeholder's height, as tall as the content will be, so the
   * panels below don't move when the data arrives. 96px without it. */
  placeholderHeight?: number | string
  /** New data is on its way: the content stays, a spinner shows by the title and the
   * panel is busy for assistive technology. */
  refreshing?: boolean
  /** Shows a retry button in the error message. */
  onRetry?: () => void
  /** Why it failed or why it is empty, in place of the default text. */
  message?: React.ReactNode
  /** Controls at the end of the header, such as a menu. */
  actions?: React.ReactNode
  /** Columns the panel spans where they fit; a phone shows one. */
  span?: 1 | 2 | 3 | 'full'
  labels?: Partial<DashboardPanelLabels>
}
/** One panel of a dashboard: a card with its title, an optional description, the
 * states of its data and the content. The content takes the room the row gives it. */
const Panel = function DashboardPanel({
  title,
  description,
  level = 3,
  state = 'ready',
  refreshing = false,
  onRetry,
  message,
  actions,
  span,
  placeholderHeight,
  labels,
  className,
  children,
  ref,
  ...props
}: DashboardPanelProps & { ref?: React.Ref<HTMLDivElement> }) {
  const text = { ...panelLabels, ...labels }
  const id = React.useId()
  const busy = state === 'loading' || refreshing
  const titleRef = React.useRef<HTMLHeadingElement>(null)
  const retried = React.useRef(false)
  // Retry takes its own button away when the panel leaves the error, so focus
  // moves to the panel's title instead of falling to the page.
  React.useEffect(() => {
    if (!retried.current) return
    retried.current = false
    const active = document.activeElement
    if (!active || active === document.body) titleRef.current?.focus()
  }, [state])
  const retry =
    onRetry &&
    (() => {
      retried.current = true
      onRetry()
    })
  return (
    <Card.Root
      role='group'
      aria-labelledby={`${id}-title`}
      aria-busy={busy || undefined}
      {...props}
      ref={ref}
      data-span={span}
      data-state={state}
      className={cx('surf-dashboard-panel', className)}
    >
      <div className='surf-dashboard-panel-header'>
        {/* A narrow panel cuts its title short; the full one shows on hover. */}
        <Card.Title
          level={level}
          id={`${id}-title`}
          title={title}
          ref={titleRef}
          tabIndex={-1}
        >
          {title}
        </Card.Title>
        {description && (
          <Popover.Root>
            <Popover.Trigger
              render={
                <Button
                  variant='ghost'
                  size='icon-small'
                  aria-label={text.about(title)}
                />
              }
            >
              <Icon name='info' />
            </Popover.Trigger>
            <Popover.Content size='small'>
              <Popover.Description>{description}</Popover.Description>
            </Popover.Content>
          </Popover.Root>
        )}
        {refreshing && state !== 'loading' && (
          <Spinner size='small' label={text.refreshing} />
        )}
        {actions && (
          <div className='surf-dashboard-panel-actions'>{actions}</div>
        )}
      </div>
      <div className='surf-dashboard-panel-body'>
        {state === 'loading' ? (
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
        ) : state === 'stale' ? (
          <>
            <InlineMessage.Root tone='caution'>
              <InlineMessage.Icon />
              <InlineMessage.Content>
                <InlineMessage.Description>
                  {message ?? text.stale}
                </InlineMessage.Description>
                {onRetry && (
                  <InlineMessage.Actions>
                    <Button variant='outline' size='small' onClick={retry}>
                      {text.retry}
                    </Button>
                  </InlineMessage.Actions>
                )}
              </InlineMessage.Content>
            </InlineMessage.Root>
            {children}
          </>
        ) : state === 'error' ? (
          <InlineMessage.Root tone='danger'>
            <InlineMessage.Icon />
            <InlineMessage.Content>
              <InlineMessage.Description>
                {message ?? text.error}
              </InlineMessage.Description>
              {onRetry && (
                <InlineMessage.Actions>
                  <Button variant='outline' size='small' onClick={retry}>
                    {text.retry}
                  </Button>
                </InlineMessage.Actions>
              )}
            </InlineMessage.Content>
          </InlineMessage.Root>
        ) : state === 'empty' ? (
          <p className='surf-dashboard-panel-empty'>{message ?? text.empty}</p>
        ) : (
          children
        )}
      </div>
    </Card.Root>
  )
}
export const Dashboard = { Root, Panel }

// Flat names for React Server Components, which cannot dot into client exports.
export const { Root: DashboardRoot, Panel: DashboardPanel } = Dashboard
