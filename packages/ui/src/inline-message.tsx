'use client'
import * as React from 'react'
import { useToneTransition } from './tone-transition.js'
import { part, cx } from './parts.js'
import { type StatusTone, StatusIcon } from './status.js'

const MessageRoot = function MessageRoot({
  tone = 'neutral',
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & { tone?: StatusTone } & {
  ref?: React.Ref<HTMLDivElement>
}) {
  const elementRef = useToneTransition<HTMLDivElement>(tone, ref)
  return (
    <div
      {...props}
      ref={elementRef}
      data-tone={tone}
      className={cx('surf-message', className)}
    />
  )
}
const MessageIcon = function MessageIcon({
  tone = 'neutral',
  children,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'span'> & { tone?: StatusTone } & {
  ref?: React.Ref<HTMLSpanElement>
}) {
  return (
    <span
      {...props}
      ref={ref}
      aria-hidden='true'
      className={cx('surf-message-icon', className)}
    >
      {children ?? <StatusIcon tone={tone} />}
    </span>
  )
}
export const InlineMessage = {
  Root: MessageRoot,
  Icon: MessageIcon,
  Content: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'surf-message-content'),
  Title: /* @__PURE__ */ part<
    HTMLElement,
    React.ComponentPropsWithoutRef<'strong'>
  >('strong', 'surf-message-title'),
  Description: /* @__PURE__ */ part<
    HTMLParagraphElement,
    React.ComponentPropsWithoutRef<'p'>
  >('p', 'surf-message-description'),
  Actions: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'surf-message-actions'),
}
// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Root: InlineMessageRoot,
  Icon: InlineMessageIcon,
  Content: InlineMessageContent,
  Title: InlineMessageTitle,
  Description: InlineMessageDescription,
  Actions: InlineMessageActions,
} = InlineMessage
