'use client'
import * as React from 'react'
import { cx, part, skin } from './parts.js'
import { useComponentSize, type ComponentSize } from './sizing.js'
import { StatusIcon, type StatusTone } from './status.js'
import { Collapsible } from './collapsible.js'

export type TimelineRootProps = React.ComponentPropsWithoutRef<'ol'> & {
  size?: ComponentSize
}
/** Events in time order, such as a deploy history, an audit log or a job's steps:
 * an ordered list. Name it with aria-label or aria-labelledby. */
const Root = function TimelineRoot({
  size,
  className,
  ref,
  ...props
}: TimelineRootProps & { ref?: React.Ref<HTMLOListElement> }) {
  const scheme = useComponentSize(size)
  return (
    <ol
      {...props}
      ref={ref}
      className={cx('surf-timeline', className)}
      data-ui-size={scheme}
    />
  )
}
export type TimelineItemProps = React.ComponentPropsWithoutRef<'li'> & {
  /** The event's state; its icon marks the event, and Timeline.Status says it. */
  tone?: StatusTone
  /** Another mark in place of the tone's icon, such as a Spinner. */
  icon?: React.ReactNode
  /** Where a sequence is now, such as a job's running step: it sits on the
   * recessed plane and is announced as the current step. */
  current?: boolean
}
/** One event: its mark, then its title, time, status, description and detail. */
const Item = function TimelineItem({
  tone = 'neutral',
  icon,
  current = false,
  className,
  children,
  ref,
  ...props
}: TimelineItemProps & { ref?: React.Ref<HTMLLIElement> }) {
  return (
    <li
      aria-current={current ? 'step' : undefined}
      {...props}
      ref={ref}
      className={cx('surf-timeline-item', className)}
      data-tone={tone}
      data-current={current || undefined}
    >
      <span className='surf-timeline-mark' aria-hidden='true'>
        {icon ?? <StatusIcon tone={tone} />}
      </span>
      <div className='surf-timeline-body'>{children}</div>
    </li>
  )
}
export type TimelineTimeProps = React.ComponentPropsWithoutRef<'time'> & {
  /** The machine-readable instant, such as an ISO string; the text is yours. */
  dateTime: string
}
const Time = function TimelineTime({
  className,
  ref,
  ...props
}: TimelineTimeProps & { ref?: React.Ref<HTMLTimeElement> }) {
  return (
    <time
      {...props}
      ref={ref}
      className={cx('surf-timeline-time', className)}
    />
  )
}
export type TimelineDetailProps = Omit<
  React.ComponentPropsWithoutRef<typeof Collapsible.Root>,
  'children'
> & {
  /** What the disclosure shows, such as "Logs" or "3 changes". */
  summary: React.ReactNode
  children: React.ReactNode
}
/** More about the event, such as logs or a diff, behind a disclosure; open, it sits
 * on the recessed plane. */
const Detail = function TimelineDetail({
  summary,
  className,
  children,
  ref,
  ...props
}: TimelineDetailProps & {
  ref?: React.Ref<React.ComponentRef<typeof Collapsible.Root>>
}) {
  return (
    <Collapsible.Root
      {...props}
      ref={ref}
      className={skin('surf-timeline-detail', className)}
    >
      <Collapsible.Trigger>{summary}</Collapsible.Trigger>
      <Collapsible.Panel>{children}</Collapsible.Panel>
    </Collapsible.Root>
  )
}
export const Timeline = {
  Root,
  Item,
  /** What happened, in a line. */
  Title: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'surf-timeline-title'),
  Time,
  /** The state in words, in the tone's ink, such as "Failed". */
  Status: /* @__PURE__ */ part<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<'span'>
  >('span', 'surf-timeline-status'),
  Description: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'surf-timeline-description'),
  Detail,
}
// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Root: TimelineRoot,
  Item: TimelineItem,
  Title: TimelineTitle,
  Time: TimelineTime,
  Status: TimelineStatus,
  Description: TimelineDescription,
  Detail: TimelineDetail,
} = Timeline
